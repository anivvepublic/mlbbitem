import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Loader2, SearchX, Send, Wallet } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { useAuthModal } from '../context/AuthModalContext'
import { useBalance } from '../hooks/useBalance'
import { trackView } from '../lib/viewTracker'
import { RANK_TIER_COLOR } from '../lib/ranks'
import type { Account, SellerProfile } from '../types'
import { AccountShowcase } from '../components/account/AccountShowcase'
import { AccountStatsBar } from '../components/account/AccountStatsBar'
import { AccountPurchasePanel } from '../components/account/AccountPurchasePanel'
import { AccountDescription } from '../components/account/AccountDescription'
import { SellerAboutBlock } from '../components/account/SellerAboutBlock'
import { TrustStrip } from '../components/account/TrustStrip'
import { SimilarListings } from '../components/account/SimilarListings'
import { ImageLightboxModal } from '../modals/account/ImageLightboxModal'
import { MakeOfferModal } from '../modals/account/MakeOfferModal'
import { BuyNowModal } from '../modals/account/BuyNowModal'
import { TopUpModal } from '../modals/wallet/TopUpModal'

export function AccountDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const { openLogin } = useAuthModal()
  const { balance } = useBalance()

  const [account, setAccount] = useState<Account | null>(null)
  const [seller, setSeller] = useState<SellerProfile | null>(null)
  const [similar, setSimilar] = useState<Account[]>([])
  const [similarSellers, setSimilarSellers] = useState<Record<string, SellerProfile>>({})
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [offerOpen, setOfferOpen] = useState(false)
  const [buyOpen, setBuyOpen] = useState(false)
  const [topUpOpen, setTopUpOpen] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function run() {
      if (!id) return
      setLoading(true)
      const { data, error } = await supabase.from('accounts').select('*').eq('id', id).maybeSingle()
      if (cancelled) return
      if (error || !data) {
        setNotFound(true)
        setLoading(false)
        return
      }
      setAccount(data)
      trackView(data.id)

      const { data: prof } = await supabase
        .from('profiles')
        .select('id,username,display_name,avatar_url,completed_deals,created_at')
        .eq('id', data.seller_id)
        .maybeSingle()
      if (!cancelled) setSeller(prof)

      const { data: sim } = await supabase
        .from('accounts')
        .select('*')
        .eq('rank', data.rank)
        .eq('status', 'active')
        .neq('id', data.id)
        .limit(3)
      if (!cancelled && sim) {
        setSimilar(sim)
        const ids = Array.from(new Set(sim.map((s) => s.seller_id)))
        if (ids.length) {
          const { data: sp } = await supabase
            .from('profiles')
            .select('id,username,display_name,avatar_url,completed_deals')
            .in('id', ids)
          if (!cancelled && sp) {
            const map: Record<string, SellerProfile> = {}
            sp.forEach((p) => {
              map[p.id] = p
            })
            setSimilarSellers(map)
          }
        }
      }
      setLoading(false)
    }
    run()
    return () => {
      cancelled = true
    }
  }, [id])

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
        if (!cancelled) setFavoriteIds(new Set((data || []).map((f) => f.account_id)))
      })
    return () => {
      cancelled = true
    }
  }, [user])

  const requireAuth = (action: () => void) => {
    if (!user) {
      openLogin()
      return
    }
    action()
  }

  const toggleFavorite = () => {
    if (!account) return
    requireAuth(async () => {
      if (!account) return
      const has = favoriteIds.has(account.id)
      if (has) {
        setFavoriteIds((prev) => {
          const next = new Set(prev)
          next.delete(account.id)
          return next
        })
        await supabase.from('favorites').delete().eq('user_id', user!.id).eq('account_id', account.id)
      } else {
        setFavoriteIds((prev) => new Set(prev).add(account.id))
        await supabase.from('favorites').insert({ user_id: user!.id, account_id: account.id })
      }
    })
  }

  const handleMakeOffer = () => requireAuth(() => setOfferOpen(true))
  const handleBuyNow = () => requireAuth(() => setBuyOpen(true))
  const handleTopUp = () => requireAuth(() => setTopUpOpen(true))

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 size={40} className="animate-spin text-primary" />
      </div>
    )
  }

  if (notFound || !account) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-[64px]">
        <div className="flex flex-col items-center text-center">
          <div
            className="w-[80px] h-[80px] bg-gray-50 dark:bg-dark-800 border border-gray-200 dark:border-dark-700 flex items-center justify-center mb-[20px]"
            style={{ clipPath: 'polygon(14px 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%, 0 14px)' }}
          >
            <SearchX size={34} className="text-gray-300 dark:text-dark-600" />
          </div>
          <h2 className="font-display font-bold text-[24px] text-dark-900 dark:text-text-light mb-[8px]">
            Bu İlan Bulunamadı
          </h2>
          <p className="text-[15px] text-gray-500 dark:text-text-muted max-w-[360px] mb-[24px]">
            İlan kaldırılmış, satılmış veya bağlantı hatalı olabilir.
          </p>
          <Link
            to="/marketplace"
            className="flex items-center gap-[8px] px-[22px] py-[12px] bg-primary text-white font-display font-bold text-[15px] rounded-lg hover:bg-primary-dark transition-colors clip-chamfer"
          >
            <ArrowLeft size={18} />
            Pazar Yerine Dön
          </Link>
        </div>
      </div>
    )
  }

  const isFavorite = favoriteIds.has(account.id)
  const tierColor = RANK_TIER_COLOR[account.rank] || '#FF6A1F'
  const isReserved = account.status === 'pending'
  const isSold = account.status === 'sold'

  return (
    <div className="relative">
      {/* Rank rengine göre ambient üst bandı */}
      <div
        className="absolute top-0 inset-x-0 h-[420px] pointer-events-none opacity-[0.10] dark:opacity-[0.16]"
        style={{ background: `radial-gradient(60% 100% at 50% 0%, ${tierColor} 0%, transparent 70%)` }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-[24px] md:py-[32px] pb-[120px] lg:pb-[32px]">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-[8px] text-[13px] text-gray-400 dark:text-text-muted mb-[18px] flex-wrap">
          <Link to="/" className="hover:text-primary transition-colors">Ana Sayfa</Link>
          <span>/</span>
          <Link to="/marketplace" className="hover:text-primary transition-colors">Hesap Pazarı</Link>
          <span>/</span>
          <span className="text-gray-600 dark:text-text-light truncate max-w-[200px]">{account.title}</span>
        </nav>

        {/* Başlık + durum */}
        <div className="flex items-start justify-between gap-[16px] mb-[24px]">
          <h1 className="font-display font-bold text-[26px] md:text-[36px] text-dark-900 dark:text-text-light leading-tight">
            {account.title}
          </h1>
          {(isReserved || isSold) && (
            <span className="flex-shrink-0 mt-[6px] px-[12px] py-[6px] bg-gray-200 dark:bg-dark-700 text-gray-600 dark:text-text-muted text-[11px] font-bold uppercase tracking-[1px] clip-chamfer">
              {isSold ? 'Satıldı' : 'Rezerve'}
            </span>
          )}
        </div>

        {/* Ana grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-[24px] lg:gap-[32px]">
          <div className="space-y-[24px] md:space-y-[28px]">
            <AccountShowcase account={account} onZoom={() => setLightboxOpen(true)} />
            <AccountStatsBar account={account} />
            <TrustStrip />
            <AccountDescription description={account.description} />
            <SellerAboutBlock seller={seller} createdAt={account.created_at} />
          </div>

          <div className="lg:sticky lg:top-[100px] lg:self-start">
            <AccountPurchasePanel
              account={account}
              seller={seller}
              balance={balance}
              isFavorite={isFavorite}
              isOwn={!!user && user.id === account.seller_id}
              onToggleFavorite={toggleFavorite}
              onMakeOffer={handleMakeOffer}
              onBuyNow={handleBuyNow}
              onTopUp={handleTopUp}
            />
          </div>
        </div>

        <SimilarListings
          listings={similar}
          sellers={similarSellers}
          currentUserId={user?.id || null}
          favoriteIds={favoriteIds}
          onToggleFavorite={() => {}}
        />

        {/* MOBİL STICKY ALT BAR */}
        <div className="fixed bottom-0 inset-x-0 z-40 lg:hidden bg-white/95 dark:bg-dark-900/95 backdrop-blur-md border-t border-gray-200 dark:border-dark-700 px-3 py-3 flex items-center gap-2">
          <div className="pr-1">
            <p className="text-[10px] text-gray-400 dark:text-text-muted leading-none mb-[2px]">Fiyat</p>
            <p className="font-display font-bold text-[17px] text-primary leading-none whitespace-nowrap">
              {account.price.toLocaleString('tr-TR')}₺
            </p>
          </div>
          <button
            onClick={handleMakeOffer}
            className="flex-1 flex items-center justify-center gap-[5px] px-[8px] py-[12px] border-2 border-primary text-primary font-display font-bold text-[13px] rounded-lg clip-chamfer"
          >
            <Send size={14} />
            Teklif
          </button>
          <button
            onClick={handleBuyNow}
            className="flex-1 flex items-center justify-center gap-[5px] px-[8px] py-[12px] bg-primary text-white font-display font-bold text-[13px] rounded-lg clip-chamfer"
          >
            <Wallet size={14} />
            Satın Al
          </button>
        </div>

        <ImageLightboxModal
          src={account.image_url}
          alt={account.title}
          open={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
        />
        <MakeOfferModal isOpen={offerOpen} onClose={() => setOfferOpen(false)} account={account} balance={balance} />
        <BuyNowModal isOpen={buyOpen} onClose={() => setBuyOpen(false)} account={account} balance={balance} />
        <TopUpModal isOpen={topUpOpen} onClose={() => setTopUpOpen(false)} currentBalance={balance} />
      </div>
    </div>
  )
}