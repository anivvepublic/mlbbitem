import { useCallback, useEffect, useMemo, useState } from 'react'
import { SlidersHorizontal, Loader2 } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { useAuthModal } from '../context/AuthModalContext'
import { useDebounce } from '../hooks/useDebounce'
import { PRICE_MIN, PRICE_MAX, SORT_OPTIONS } from '../lib/ranks'
import type { Account, SellerProfile, SortKey, MarketplaceFilters, FilterChip } from '../types'
import { MarketplaceHeader } from '../components/marketplace/MarketplaceHeader'
import { FilterSidebar } from '../components/marketplace/FilterSidebar'
import { FilterBottomSheet } from '../components/marketplace/FilterBottomSheet'
import { ActiveFilterChips } from '../components/marketplace/ActiveFilterChips'
import { SortSelect } from '../components/marketplace/SortSelect'
import { MarketplaceAccountCard } from '../components/marketplace/MarketplaceAccountCard'
import { SkeletonCard } from '../components/marketplace/SkeletonCard'
import { EmptyMarketplace } from '../components/marketplace/EmptyMarketplace'

const PAGE_SIZE = 12

function readNumber(param: string | null, fallback: number): number {
  if (param === null) return fallback
  const n = Number(param)
  return Number.isNaN(n) ? fallback : n
}

export function MarketplacePage() {
  const { user } = useAuth()
  const { openLogin } = useAuthModal()

  // ---- Filtre state (URL'den başlat) ----
  const params = new URLSearchParams(window.location.search)
  const [q, setQ] = useState(params.get('q') || '')
  const [ranks, setRanks] = useState<string[]>(
    params.get('rank') ? params.get('rank')!.split(',') : []
  )
  const [minPrice, setMinPrice] = useState(readNumber(params.get('minPrice'), PRICE_MIN))
  const [maxPrice, setMaxPrice] = useState(readNumber(params.get('maxPrice'), PRICE_MAX))
  const [minSkins, setMinSkins] = useState(readNumber(params.get('minSkins'), 0))
  const [sort, setSort] = useState<SortKey>((params.get('sort') as SortKey) || 'newest')

  const debouncedQ = useDebounce(q, 300)

  // ---- Veri state ----
  const [accounts, setAccounts] = useState<Account[]>([])
  const [sellers, setSellers] = useState<Record<string, SellerProfile>>({})
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set())
  const [total, setTotal] = useState(0)
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [sheetOpen, setSheetOpen] = useState(false)

  // ---- URL senkronizasyonu ----
  useEffect(() => {
    const p = new URLSearchParams()
    if (q) p.set('q', q)
    if (ranks.length) p.set('rank', ranks.join(','))
    if (minPrice !== PRICE_MIN) p.set('minPrice', String(minPrice))
    if (maxPrice !== PRICE_MAX) p.set('maxPrice', String(maxPrice))
    if (minSkins > 0) p.set('minSkins', String(minSkins))
    if (sort !== 'newest') p.set('sort', sort)
    const qs = p.toString()
    const newUrl = qs ? `?${qs}` : window.location.pathname
    window.history.replaceState(null, '', newUrl)
  }, [q, ranks, minPrice, maxPrice, minSkins, sort])

  // Filtre değişince sayfalama sıfırlansın
  useEffect(() => {
    setVisibleCount(PAGE_SIZE)
  }, [debouncedQ, ranks, minPrice, maxPrice, minSkins, sort])

  // ---- Ana sorgu ----
  useEffect(() => {
    let cancelled = false
    async function run() {
      setLoading(true)
      let query = supabase
        .from('accounts')
        .select('*', { count: 'exact' })
        .eq('status', 'active')
        .gte('price', minPrice)
        .lte('price', maxPrice)
        .gte('skins_count', minSkins)

      if (debouncedQ.trim()) {
        query = query.or(`title.ilike.%${debouncedQ.trim()}%,description.ilike.%${debouncedQ.trim()}%`)
      }
      if (ranks.length) query = query.in('rank', ranks)

      if (sort === 'newest') query = query.order('created_at', { ascending: false })
      else if (sort === 'price_asc') query = query.order('price', { ascending: true })
      else if (sort === 'price_desc') query = query.order('price', { ascending: false })
      else query = query.order('skins_count', { ascending: false })

      const { data, count, error } = await query.range(0, visibleCount - 1)

      if (cancelled) return
      if (error) {
        console.error('Pazar sorgusu hatası:', error)
        setAccounts([])
        setTotal(0)
      } else {
        setAccounts(data || [])
        setTotal(count || 0)

        const ids = Array.from(new Set((data || []).map((a) => a.seller_id)))
        if (ids.length) {
          const { data: prof } = await supabase
            .from('profiles')
            .select('id,username,display_name,avatar_url,completed_deals')
            .in('id', ids)
          if (!cancelled && prof) {
            const map: Record<string, SellerProfile> = {}
            prof.forEach((p) => {
              map[p.id] = p
            })
            setSellers(map)
          }
        } else if (!cancelled) {
          setSellers({})
        }
      }
      setLoading(false)
      setLoadingMore(false)
    }
    run()
    return () => {
      cancelled = true
    }
  }, [debouncedQ, ranks, minPrice, maxPrice, minSkins, sort, visibleCount])

  // ---- Favoriler ----
  useEffect(() => {
    if (!user) {
      setFavoriteIds(new Set())
      return
    }
    let cancelled = false
    supabase
      .from('favorites')
      .select('account_id')
      .eq('user_id', user.id)
      .then(({ data }) => {
        if (cancelled) return
        setFavoriteIds(new Set((data || []).map((f) => f.account_id)))
      })
    return () => {
      cancelled = true
    }
  }, [user])

  const toggleRank = useCallback((rank: string) => {
    setRanks((prev) => (prev.includes(rank) ? prev.filter((r) => r !== rank) : [...prev, rank]))
  }, [])

  const reset = useCallback(() => {
    setQ('')
    setRanks([])
    setMinPrice(PRICE_MIN)
    setMaxPrice(PRICE_MAX)
    setMinSkins(0)
    setSort('newest')
  }, [])

  const toggleFavorite = useCallback(
    async (accountId: string) => {
      if (!user) {
        openLogin()
        return
      }
      const has = favoriteIds.has(accountId)
      if (has) {
        setFavoriteIds((prev) => {
          const next = new Set(prev)
          next.delete(accountId)
          return next
        })
        await supabase.from('favorites').delete().eq('user_id', user.id).eq('account_id', accountId)
      } else {
        setFavoriteIds((prev) => new Set(prev).add(accountId))
        await supabase.from('favorites').insert({ user_id: user.id, account_id: accountId })
      }
    },
    [user, favoriteIds, openLogin]
  )

  const loadMore = () => {
    setLoadingMore(true)
    setVisibleCount((c) => c + PAGE_SIZE)
  }

  const hasMore = accounts.length < total

  const filters: MarketplaceFilters = { q, ranks, minPrice, maxPrice, minSkins, sort }

  const hasActiveFilters =
    q !== '' ||
    ranks.length > 0 ||
    minPrice !== PRICE_MIN ||
    maxPrice !== PRICE_MAX ||
    minSkins > 0

  const activeFilterCount =
    (q ? 1 : 0) +
    ranks.length +
    (minPrice !== PRICE_MIN || maxPrice !== PRICE_MAX ? 1 : 0) +
    (minSkins > 0 ? 1 : 0)

  // ---- Aktif chip'ler ----
  const chips = useMemo<FilterChip[]>(() => {
    const list: FilterChip[] = []
    if (q) list.push({ key: 'q', label: `Arama: "${q}"`, onRemove: () => setQ('') })
    ranks.forEach((r) =>
      list.push({ key: `rank-${r}`, label: r, onRemove: () => toggleRank(r) })
    )
    if (minPrice !== PRICE_MIN || maxPrice !== PRICE_MAX) {
      list.push({
        key: 'price',
        label: `₺${minPrice.toLocaleString('tr-TR')} - ₺${maxPrice.toLocaleString('tr-TR')}`,
        onRemove: () => {
          setMinPrice(PRICE_MIN)
          setMaxPrice(PRICE_MAX)
        },
      })
    }
    if (minSkins > 0) {
      list.push({ key: 'skins', label: `En az ${minSkins} skin`, onRemove: () => setMinSkins(0) })
    }
    return list
  }, [q, ranks, minPrice, maxPrice, minSkins, toggleRank])

  const sortLabel = SORT_OPTIONS.find((o) => o.key === sort)?.label || ''

  return (
    <div>
      <MarketplaceHeader q={q} onQChange={setQ} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-[24px] md:py-[32px]">
        <div className="lg:grid lg:grid-cols-[260px_1fr] lg:gap-[28px]">
          {/* PC filtre kulesi */}
          <FilterSidebar
            filters={filters}
            toggleRank={toggleRank}
            setMinPrice={setMinPrice}
            setMaxPrice={setMaxPrice}
            setMinSkins={setMinSkins}
            reset={reset}
            hasActiveFilters={hasActiveFilters}
          />

          {/* Sonuç alanı */}
          <div>
            {/* Üst bar */}
            <div className="flex items-center justify-between gap-[12px] mb-[16px]">
              <div className="flex items-center gap-[10px]">
                {/* Mobil filtre butonu */}
                <button
                  onClick={() => setSheetOpen(true)}
                  className="lg:hidden flex items-center gap-[7px] px-[12px] py-[9px] bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-lg hover:border-primary transition-colors text-[13px] font-medium text-dark-900 dark:text-text-light relative"
                >
                  <SlidersHorizontal size={15} className="text-primary" />
                  Filtreler
                  {activeFilterCount > 0 && (
                    <span className="absolute -top-[6px] -right-[6px] w-[18px] h-[18px] bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {activeFilterCount}
                    </span>
                  )}
                </button>
                <span className="text-[13px] text-gray-500 dark:text-text-muted">
                  <span className="font-display font-bold text-dark-900 dark:text-text-light">
                    {total}
                  </span>{' '}
                  hesap bulundu
                </span>
              </div>
              <SortSelect value={sort} onChange={setSort} />
            </div>

            {/* Aktif chip'ler */}
            <div className="mb-[18px]">
              <ActiveFilterChips chips={chips} onClearAll={reset} />
            </div>

            {/* Grid / Skeleton / Empty */}
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-[12px] md:gap-[16px]">
                {Array.from({ length: 8 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : accounts.length === 0 ? (
              <div className="grid grid-cols-1">
                <EmptyMarketplace hasFilters={hasActiveFilters} onReset={reset} />
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-[12px] md:gap-[16px]">
                  {accounts.map((account, i) => (
                    <MarketplaceAccountCard
                      key={account.id}
                      account={account}
                      seller={sellers[account.seller_id] || null}
                      isFavorite={favoriteIds.has(account.id)}
                      isOwn={!!user && user.id === account.seller_id}
                      onToggleFavorite={toggleFavorite}
                      index={i}
                    />
                  ))}
                  {loadingMore &&
                    Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={`m-${i}`} />)}
                </div>

                {hasMore && !loadingMore && (
                  <div className="flex justify-center mt-[32px]">
                    <button
                      onClick={loadMore}
                      className="px-[28px] py-[12px] border-2 border-gray-200 dark:border-dark-700 text-dark-900 dark:text-text-light font-display font-semibold text-[14px] rounded-lg hover:border-primary hover:text-primary transition-colors clip-chamfer"
                    >
                      Daha Fazla Göster
                    </button>
                  </div>
                )}
                {loadingMore && (
                  <div className="flex justify-center mt-[32px]">
                    <Loader2 size={24} className="animate-spin text-primary" />
                  </div>
                )}
              </>
            )}

            {/* Mobil alt bilgi */}
            {!loading && accounts.length > 0 && (
              <p className="lg:hidden text-center text-[12px] text-gray-400 mt-[24px]">
                Sıralama: {sortLabel}
              </p>
            )}
          </div>
        </div>
      </div>

      <FilterBottomSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        resultCount={total}
        filters={filters}
        toggleRank={toggleRank}
        setMinPrice={setMinPrice}
        setMaxPrice={setMaxPrice}
        setMinSkins={setMinSkins}
        reset={reset}
        hasActiveFilters={hasActiveFilters}
      />
    </div>
  )
}