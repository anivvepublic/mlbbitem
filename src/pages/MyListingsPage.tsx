import { useEffect, useState } from 'react'
import { LayoutGrid, Plus, Loader2 } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import type { Account } from '../types'
import { StatsBand } from '../components/mylistings/StatsBand'
import { ListingCard } from '../components/mylistings/ListingCard'
import { EditListingModal } from '../components/mylistings/EditListingModal'
import { DeleteConfirmModal } from '../components/mylistings/DeleteConfirmModal'

export function MyListingsPage() {
  const { user, loading: authLoading } = useAuth()
  const [listings, setListings] = useState<Account[]>([])
  const [offerCounts, setOfferCounts] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)
  const [editTarget, setEditTarget] = useState<Account | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Account | null>(null)

  const fetchListings = async () => {
    if (!user) {
      setLoading(false)
      return
    }
    setLoading(true)
    const { data, error } = await supabase
      .from('accounts')
      .select('*')
      .eq('seller_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('İlanlar yüklenirken hata:', error)
      setListings([])
    } else {
      const list = data || []
      setListings(list)

      // Bekleyen teklif sayılarını tek sorguda çek
      const ids = list.map((l) => l.id)
      if (ids.length) {
        const { data: off } = await supabase
          .from('offers')
          .select('account_id')
          .in('account_id', ids)
          .eq('status', 'pending')
        const map: Record<string, number> = {}
        ;(off || []).forEach((o) => {
          map[o.account_id] = (map[o.account_id] || 0) + 1
        })
        setOfferCounts(map)
      } else {
        setOfferCounts({})
      }
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchListings()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const handleStatus = async (id: string, status: Account['status']) => {
    await supabase.from('accounts').update({ status }).eq('id', id)
    fetchListings()
  }

  if (authLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 size={40} className="animate-spin text-primary" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-[64px] text-center">
        <p className="text-gray-500 dark:text-text-muted">İlanlarını görmek için giriş yapmalısın.</p>
      </div>
    )
  }

  return (
    <div className="relative">
      <div
        className="absolute top-0 inset-x-0 h-[320px] pointer-events-none opacity-[0.10] dark:opacity-[0.16]"
        style={{ background: 'radial-gradient(60% 100% at 50% 0%, #FF6A1F 0%, transparent 70%)' }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-[28px] md:py-[40px]">
        {/* Başlık */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-[16px] mb-[28px]">
          <div>
            <h1 className="font-display font-bold text-[28px] md:text-[36px] text-dark-900 dark:text-text-light">
              İlanlarım
            </h1>
            <p className="text-[14px] text-gray-500 dark:text-text-muted mt-[6px]">
              Tüm ilanlarını yönet, düzenle ve durumlarını takip et.
            </p>
          </div>
          <a
            href="/create-listing"
            className="inline-flex items-center justify-center gap-[8px] px-[20px] py-[12px] bg-primary text-white font-display font-bold text-[15px] rounded-lg hover:bg-primary-dark hover:gap-[12px] transition-all clip-chamfer"
          >
            <Plus size={19} />
            Yeni İlan Ekle
          </a>
        </div>

        {/* İstatistik bandı */}
        {!loading && listings.length > 0 && <StatsBand listings={listings} />}

        {/* Liste */}
        {loading ? (
          <div className="flex items-center justify-center py-[64px]">
            <Loader2 size={32} className="animate-spin text-primary" />
          </div>
        ) : listings.length === 0 ? (
          <div className="bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-xl p-[48px] text-center">
            <div
              className="w-[72px] h-[72px] bg-gray-50 dark:bg-dark-900 border border-gray-200 dark:border-dark-700 flex items-center justify-center mx-auto mb-[18px]"
              style={{ clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)' }}
            >
              <LayoutGrid size={30} className="text-gray-300 dark:text-dark-600" />
            </div>
            <h3 className="font-display font-bold text-[20px] text-dark-900 dark:text-text-light mb-[8px]">
              Henüz İlanın Yok
            </h3>
            <p className="text-[14px] text-gray-500 dark:text-text-muted max-w-[340px] mx-auto mb-[22px]">
              İlk ilanını oluştur ve hesabını güvenle satmaya başla.
            </p>
            <a
              href="/create-listing"
              className="inline-flex items-center gap-[7px] px-[20px] py-[12px] bg-primary text-white font-display font-bold text-[14px] rounded-lg hover:bg-primary-dark transition-colors clip-chamfer"
            >
              <Plus size={17} />
              İlk İlanını Oluştur
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[16px]">
            {listings.map((l) => (
              <ListingCard
                key={l.id}
                account={l}
                offerCount={offerCounts[l.id] || 0}
                onEdit={setEditTarget}
                onDelete={setDeleteTarget}
                onStatus={handleStatus}
              />
            ))}
          </div>
        )}
      </div>

      <EditListingModal account={editTarget} onClose={() => setEditTarget(null)} onSaved={fetchListings} />
      <DeleteConfirmModal account={deleteTarget} onClose={() => setDeleteTarget(null)} onDeleted={fetchListings} />
    </div>
  )
}