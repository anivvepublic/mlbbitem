import { useEffect, useMemo, useState } from 'react'
import { Megaphone, Plus, SearchX } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { useAuthModal } from '../context/AuthModalContext'
import { RANK_GROUPS } from '../lib/ranks'
import type { AccountRequest, SellerProfile } from '../types'
import { RequestCard } from '../components/requests/RequestCard'
import { CreateRequestModal } from '../components/requests/CreateRequestModal'
import { ContactRevealModal } from '../components/requests/ContactRevealModal'

const POPULAR_RANKS = RANK_GROUPS[0].ranks.concat(RANK_GROUPS[1].ranks)

export function RequestsPage() {
  const { user } = useAuth()
  const { openLogin } = useAuthModal()

  const [requests, setRequests] = useState<AccountRequest[]>([])
  const [owners, setOwners] = useState<Record<string, SellerProfile>>({})
  const [loading, setLoading] = useState(true)
  const [rankFilter, setRankFilter] = useState<string | null>(null)
  const [whatsappOnly, setWhatsappOnly] = useState(false)
  const [createOpen, setCreateOpen] = useState(false)
  const [contactRequest, setContactRequest] = useState<AccountRequest | null>(null)

  const fetchRequests = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('requests')
      .select('*')
      .eq('status', 'open')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Talepler yüklenirken hata:', error)
    } else {
      setRequests(data || [])
      const ids = Array.from(new Set((data || []).map((r) => r.user_id)))
      if (ids.length) {
        const { data: prof } = await supabase
          .from('profiles')
          .select('id,username,display_name,avatar_url')
          .in('id', ids)
        if (prof) {
          const map: Record<string, SellerProfile> = {}
          prof.forEach((p) => {
            map[p.id] = p
          })
          setOwners(map)
        }
      }
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchRequests()
  }, [])

  const filtered = useMemo(() => {
    return requests.filter((r) => {
      if (rankFilter && r.wanted_rank !== rankFilter) return false
      if (whatsappOnly && r.contact_type !== 'whatsapp') return false
      return true
    })
  }, [requests, rankFilter, whatsappOnly])

  const handleCreateClick = () => {
    if (!user) {
      openLogin()
      return
    }
    setCreateOpen(true)
  }

  const handleContact = (request: AccountRequest) => {
    if (!user) {
      openLogin()
      return
    }
    setContactRequest(request)
  }

  return (
    <div>
      {/* Üst Bant — çapraz çizgili "aranıyor" dokusu */}
      <section
        className="relative bg-dark-900 overflow-hidden [clip-path:polygon(0_0,100%_0,100%_calc(100%-16px),0_100%)] md:[clip-path:polygon(0_0,100%_0,100%_calc(100%-32px),0_100%)]"
      >
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(45deg, #FF6A1F 0, #FF6A1F 2px, transparent 2px, transparent 14px)',
          }}
        />
        <div className="absolute -top-[60px] right-[10%] w-[280px] h-[280px] rounded-full bg-primary/20 blur-[90px]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-[36px] pb-[56px] md:pt-[48px] md:pb-[72px]">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-[20px]">
            <div>
              <span
                className="inline-block bg-primary text-white text-[11px] font-bold uppercase tracking-[2px] px-[12px] py-[5px] mb-[14px] -rotate-1"
                style={{ clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)' }}
              >
                Aranıyor
              </span>
              <h1 className="font-display font-bold text-white text-[36px] sm:text-[48px] md:text-[56px] leading-[0.95] tracking-tight">
                TALEP
                <br />
                <span className="text-primary">PANOSU</span>
              </h1>
              <p className="text-text-muted text-[14px] md:text-[15px] mt-[12px] max-w-[440px] leading-relaxed">
                Aradığın hesabı bulamadın mı? Talebini as, elinde uygun hesap olan satıcılar sana ulaşsın.
              </p>
            </div>

            <button
              onClick={handleCreateClick}
              className="flex-shrink-0 flex items-center justify-center gap-[8px] px-[22px] py-[13px] bg-primary text-white font-display font-bold text-[15px] rounded-lg hover:bg-primary-dark hover:gap-[12px] transition-all clip-chamfer"
            >
              <Plus size={20} />
              Talep Oluştur
            </button>
          </div>
        </div>
      </section>

      {/* Filtreler + İçerik */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-[24px] md:py-[32px]">
        {/* Filtre chip'leri */}
        <div className="flex flex-wrap items-center gap-[8px] mb-[20px]">
          <span className="text-[13px] font-semibold text-gray-400 dark:text-text-muted mr-[4px]">
            Rank:
          </span>
          <button
            onClick={() => setRankFilter(null)}
            className={`px-[14px] py-[7px] rounded-full text-[13px] font-medium transition-all ${
              rankFilter === null
                ? 'bg-primary text-white shadow-md'
                : 'bg-gray-100 dark:bg-dark-800 text-gray-600 dark:text-text-muted hover:bg-gray-200 dark:hover:bg-dark-700'
            }`}
          >
            Hepsi
          </button>
          {POPULAR_RANKS.map((r) => (
            <button
              key={r}
              onClick={() => setRankFilter(rankFilter === r ? null : r)}
              className={`px-[14px] py-[7px] rounded-full text-[13px] font-medium transition-all ${
                rankFilter === r
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-gray-100 dark:bg-dark-800 text-gray-600 dark:text-text-muted hover:bg-gray-200 dark:hover:bg-dark-700'
              }`}
            >
              {r}
            </button>
          ))}
          <span className="w-[1px] h-[20px] bg-gray-200 dark:bg-dark-700 mx-[6px]" />
          <button
            onClick={() => setWhatsappOnly(!whatsappOnly)}
            className={`px-[14px] py-[7px] rounded-full text-[13px] font-medium transition-all ${
              whatsappOnly
                ? 'bg-green-600 text-white shadow-md'
                : 'bg-gray-100 dark:bg-dark-800 text-gray-600 dark:text-text-muted hover:bg-gray-200 dark:hover:bg-dark-700'
            }`}
          >
            WhatsApp ile ulaşılabilir
          </button>
        </div>

        {/* Sonuç sayısı */}
        <p className="text-[13px] text-gray-500 dark:text-text-muted mb-[18px]">
          <span className="font-display font-bold text-dark-900 dark:text-text-light">{filtered.length}</span>{' '}
          açık talep bulundu
        </p>

        {/* Kartlar */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-[16px]">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-[260px] bg-gray-100 dark:bg-dark-800 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center text-center py-[64px] px-[20px]">
            <div
              className="w-[80px] h-[80px] bg-gray-50 dark:bg-dark-800 border border-gray-200 dark:border-dark-700 flex items-center justify-center mb-[20px]"
              style={{ clipPath: 'polygon(14px 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%, 0 14px)' }}
            >
              <SearchX size={34} className="text-gray-300 dark:text-dark-600" />
            </div>
            <h3 className="font-display font-bold text-[20px] text-dark-900 dark:text-text-light mb-[8px]">
              {requests.length === 0 ? 'Henüz açık talep yok' : 'Bu filtrelerle talep bulunamadı'}
            </h3>
            <p className="text-[14px] text-gray-500 dark:text-text-muted max-w-[340px] mb-[24px]">
              {requests.length === 0
                ? 'İlk talebi sen oluştur, satıcılar sana ulaşsın.'
                : 'Filtreleri değiştirmeyi veya yeni bir talep oluşturmayı dene.'}
            </p>
            <button
              onClick={handleCreateClick}
              className="flex items-center gap-[8px] px-[22px] py-[12px] bg-primary text-white font-display font-bold text-[14px] rounded-lg hover:bg-primary-dark transition-colors clip-chamfer"
            >
              <Megaphone size={17} />
              Talep Oluştur
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-[16px]">
            {filtered.map((request, i) => (
              <RequestCard
                key={request.id}
                request={request}
                owner={owners[request.user_id] || null}
                isOwn={!!user && user.id === request.user_id}
                onContact={handleContact}
                index={i}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modallar */}
      <CreateRequestModal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        onSuccess={fetchRequests}
      />
      <ContactRevealModal
        request={contactRequest}
        owner={contactRequest ? owners[contactRequest.user_id] || null : null}
        onClose={() => setContactRequest(null)}
      />
    </div>
  )
}