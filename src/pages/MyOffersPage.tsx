import { useEffect, useState } from 'react'
import { Inbox, Loader2, Wallet, Package } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { OfferRow } from '../components/offers/OfferRow'
import { DealRow } from '../components/offers/DealRow'
import type { Offer, Deal } from '../types'

type Tab = 'offers' | 'deals'

export function MyOffersPage() {
  const { user } = useAuth()
  const [tab, setTab] = useState<Tab>('offers')
  const [offers, setOffers] = useState<Offer[]>([])
  const [deals, setDeals] = useState<Deal[]>([])
  const [loading, setLoading] = useState(true)
  const [actionId, setActionId] = useState<string | null>(null)

  const fetchAll = async () => {
    if (!user) {
      setLoading(false)
      return
    }
    setLoading(true)

    const { data: accs } = await supabase.from('accounts').select('id').eq('seller_id', user.id)
    const accIds = (accs || []).map((a) => a.id)

    if (accIds.length === 0) {
      setOffers([])
      setDeals([])
      setLoading(false)
      return
    }

    const { data: offData } = await supabase
      .from('offers')
      .select('*, account:accounts(id,title,price,image_url), buyer:profiles(id,username,display_name,avatar_url)')
      .in('account_id', accIds)
      .eq('status', 'pending')
      .order('created_at', { ascending: false })

    const { data: dealData } = await supabase
      .from('deals')
      .select('*, account:accounts(id,title,price,image_url), buyer:profiles(id,username,display_name,avatar_url)')
      .eq('seller_id', user.id)
      .order('created_at', { ascending: false })

    setOffers((offData as unknown as Offer[]) || [])
    setDeals((dealData as unknown as Deal[]) || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchAll()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const acceptOffer = async (offerId: string) => {
    if (!user) return
    setActionId(offerId)
    const target = offers.find((o) => o.id === offerId)

    await supabase.from('offers').update({ status: 'accepted' }).eq('id', offerId)
    if (target) {
      await supabase
        .from('offers')
        .update({ status: 'rejected' })
        .eq('account_id', target.account_id)
        .neq('id', offerId)
        .eq('status', 'pending')
    }
    setActionId(null)
    window.dispatchEvent(new Event('mlbb-offers-changed'))
    fetchAll()
  }

  const rejectOffer = async (offerId: string) => {
    if (!user) return
    setActionId(offerId)
    await supabase.from('offers').update({ status: 'rejected' }).eq('id', offerId)
    setActionId(null)
    window.dispatchEvent(new Event('mlbb-offers-changed'))
    fetchAll()
  }

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-[64px] text-center">
        <p className="text-gray-500 dark:text-text-muted">Bu sayfayı görmek için giriş yapmalısın.</p>
      </div>
    )
  }

  const pendingCount = offers.length
  const activeDeals = deals.filter((d) => d.status !== 'completed' && d.status !== 'cancelled').length

  return (
    <div>
      <section className="relative bg-dark-900 overflow-hidden [clip-path:polygon(0_0,100%_0,100%_calc(100%-16px),0_100%)] md:[clip-path:polygon(0_0,100%_0,100%_calc(100%-32px),0_100%)]">
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{ backgroundImage: 'repeating-linear-gradient(45deg, #FF6A1F 0, #FF6A1F 2px, transparent 2px, transparent 14px)' }}
        />
        <div className="absolute -top-[60px] right-[12%] w-[260px] h-[260px] rounded-full bg-primary/20 blur-[90px]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-[32px] pb-[52px] md:pt-[44px] md:pb-[68px]">
          <span
            className="inline-block bg-primary text-white text-[11px] font-bold uppercase tracking-[2px] px-[12px] py-[5px] mb-[14px]"
            style={{ clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)' }}
          >
            Satıcı Paneli
          </span>
          <h1 className="font-display font-bold text-white text-[34px] sm:text-[44px] md:text-[52px] leading-[0.95] tracking-tight">
            GELEN
            <br />
            <span className="text-primary">TEKLİFLER</span>
          </h1>
          <p className="text-text-muted text-[14px] md:text-[15px] mt-[12px] max-w-[440px] leading-relaxed">
            İlanlarına gelen teklifleri ve başlatılan satın almaları tek yerden yönet.
          </p>

          <div className="flex flex-wrap gap-[12px] mt-[22px]">
            <div className="flex items-center gap-[10px] bg-white/5 border border-white/10 rounded-xl px-[16px] py-[12px]">
              <span className="relative flex w-[10px] h-[10px]">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-[10px] w-[10px] bg-primary" />
              </span>
              <div>
                <p className="font-display font-bold text-[20px] text-white leading-none">{pendingCount}</p>
                <p className="text-[11px] text-text-muted mt-[2px]">Bekleyen teklif</p>
              </div>
            </div>
            <div className="flex items-center gap-[10px] bg-white/5 border border-white/10 rounded-xl px-[16px] py-[12px]">
              <Package size={18} className="text-green-400" />
              <div>
                <p className="font-display font-bold text-[20px] text-white leading-none">{activeDeals}</p>
                <p className="text-[11px] text-text-muted mt-[2px]">Aktif satış</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-[24px] md:py-[32px]">
        <div className="flex items-center gap-[4px] border-b border-gray-200 dark:border-dark-700 mb-[24px]">
          {([
            { key: 'offers', label: 'Gelen Teklifler', icon: Wallet, badge: pendingCount },
            { key: 'deals', label: 'Satın Almalar', icon: Package, badge: activeDeals },
          ] as const).map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`relative flex items-center gap-[8px] px-[16px] py-[14px] text-[14px] font-display font-bold transition-colors ${
                tab === t.key
                  ? 'text-primary'
                  : 'text-gray-500 dark:text-text-muted hover:text-dark-900 dark:hover:text-text-light'
              }`}
            >
              <t.icon size={17} />
              {t.label}
              {t.badge > 0 && (
                <span className={`px-[7px] py-[1px] rounded-full text-[11px] font-bold ${tab === t.key ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-dark-700 text-gray-600 dark:text-text-muted'}`}>
                  {t.badge}
                </span>
              )}
              {tab === t.key && (
                <span className="absolute bottom-[-1px] left-0 right-0 h-[3px] bg-primary rounded-t-full" />
              )}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-[64px]">
            <Loader2 size={32} className="animate-spin text-primary" />
          </div>
        ) : tab === 'offers' ? (
          offers.length === 0 ? (
            <EmptyState
              icon={<Inbox size={34} className="text-gray-300 dark:text-dark-600" />}
              title="Henüz Bekleyen Teklif Yok"
              text="İlanların pazar yerinde göründükçe teklifler buraya düşecek. Bildirim rozetini takip et."
            />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-[14px]">
              {offers.map((o) => (
                <OfferRow
                  key={o.id}
                  offer={o}
                  loading={actionId === o.id}
                  onAccept={acceptOffer}
                  onReject={rejectOffer}
                />
              ))}
            </div>
          )
        ) : deals.length === 0 ? (
          <EmptyState
            icon={<Package size={34} className="text-gray-300 dark:text-dark-600" />}
            title="Henüz Satın Alma Yok"
            text="Birisi ilanını direkt satın aldığında işlem burada görünecek ve durumunu buradan takip edeceksin."
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-[14px]">
            {deals.map((d) => (
              <DealRow key={d.id} deal={d} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function EmptyState({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="flex flex-col items-center text-center py-[56px] px-[20px]">
      <div
        className="w-[80px] h-[80px] bg-gray-50 dark:bg-dark-800 border border-gray-200 dark:border-dark-700 flex items-center justify-center mb-[20px]"
        style={{ clipPath: 'polygon(14px 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%, 0 14px)' }}
      >
        {icon}
      </div>
      <h3 className="font-display font-bold text-[20px] text-dark-900 dark:text-text-light mb-[8px]">{title}</h3>
      <p className="text-[14px] text-gray-500 dark:text-text-muted max-w-[360px] leading-relaxed">{text}</p>
    </div>
  )
}