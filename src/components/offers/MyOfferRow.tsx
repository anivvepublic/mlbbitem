import { useState } from 'react'
import { Undo2, Clock, TrendingDown, TrendingUp, Check, X, Loader2, Minus } from 'lucide-react'
import { useInView } from '../../hooks/useInView'
import { supabase } from '../../lib/supabase'
import type { Offer } from '../../types'

interface MyOfferRowProps {
  offer: Offer
  index: number
  onChanged: () => void
}

const STATUS_META: Record<Offer['status'], { label: string; cls: string; icon: typeof Check }> = {
  pending: { label: 'Bekliyor', cls: 'bg-amber-500/10 text-amber-600 dark:text-amber-400', icon: Clock },
  accepted: { label: 'Kabul Edildi', cls: 'bg-green-500/10 text-green-600 dark:text-green-400', icon: Check },
  rejected: { label: 'Reddedildi', cls: 'bg-gray-500/10 text-gray-500', icon: X },
  withdrawn: { label: 'Geri Çektin', cls: 'bg-gray-500/10 text-gray-500', icon: Minus },
}

export function MyOfferRow({ offer, index, onChanged }: MyOfferRowProps) {
  const { ref, inView } = useInView<HTMLDivElement>()
  const [loading, setLoading] = useState(false)
  const acc = offer.account
  const seller = offer.seller
  const sellerName = seller?.display_name || seller?.username || 'Satıcı'
  const sellerInitial = sellerName.charAt(0).toUpperCase()
  const listPrice = acc?.price || 0
  const diff = listPrice > 0 ? offer.amount - listPrice : 0
  const diffPct = listPrice > 0 ? Math.round((diff / listPrice) * 100) : 0
  const meta = STATUS_META[offer.status]

  const daysAgo = Math.floor((Date.now() - new Date(offer.created_at).getTime()) / (1000 * 60 * 60 * 24))
  const dateLabel = daysAgo === 0 ? 'Bugün' : daysAgo === 1 ? 'Dün' : `${daysAgo} gün önce`

  const withdraw = async () => {
    setLoading(true)
    await supabase.from('offers').update({ status: 'withdrawn' }).eq('id', offer.id)
    setLoading(false)
    window.dispatchEvent(new Event('mlbb-offers-changed'))
    onChanged()
  }

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${(index % 6) * 60}ms` }}
      className={`group bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-xl p-[16px] hover:border-blue-400 hover:shadow-xl hover:-translate-y-[3px] transition-all duration-300 ${
        inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div className="flex items-start gap-[12px]">
        {acc?.image_url ? (
          <img src={acc.image_url} alt="" className="w-[52px] h-[52px] rounded-lg object-cover flex-shrink-0" />
        ) : (
          <div className="w-[52px] h-[52px] rounded-lg bg-gray-100 dark:bg-dark-700 flex-shrink-0" />
        )}

        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-semibold text-dark-900 dark:text-text-light truncate">{acc?.title || 'İlan'}</p>
          <div className="flex items-center gap-[8px] mt-[3px]">
            {seller?.avatar_url ? (
              <img src={seller.avatar_url} alt="" className="w-[18px] h-[18px] rounded-full object-cover" />
            ) : (
              <span className="w-[18px] h-[18px] rounded-full bg-blue-500/20 text-blue-500 text-[10px] font-bold flex items-center justify-center">
                {sellerInitial}
              </span>
            )}
            <span className="text-[12px] text-gray-500 dark:text-text-muted truncate">Satıcı: {sellerName}</span>
            <span className="text-[11px] text-gray-400 dark:text-text-muted flex items-center gap-[3px] flex-shrink-0">
              <Clock size={11} />
              {dateLabel}
            </span>
          </div>
        </div>

        <div className="text-right flex-shrink-0">
          <p className="font-display font-bold text-[18px] text-blue-600 dark:text-blue-400 leading-none">
            {offer.amount.toLocaleString('tr-TR')}₺
          </p>
          {listPrice > 0 && diff !== 0 && (
            <p className={`text-[11px] font-semibold flex items-center justify-end gap-[3px] mt-[3px] ${diff < 0 ? 'text-red-500' : 'text-green-600 dark:text-green-400'}`}>
              {diff < 0 ? <TrendingDown size={12} /> : <TrendingUp size={12} />}
              {diffPct > 0 ? '+' : ''}{diffPct}%
            </p>
          )}
        </div>
      </div>

      {offer.message && (
        <p className="mt-[12px] text-[13px] text-gray-600 dark:text-text-muted bg-gray-50 dark:bg-dark-900/60 rounded-lg px-[12px] py-[8px] leading-relaxed">
          “{offer.message}”
        </p>
      )}

      <div className="flex items-center justify-between mt-[14px] pt-[12px] border-t border-gray-100 dark:border-dark-700">
        <span className={`inline-flex items-center gap-[6px] px-[10px] py-[5px] rounded-full text-[12px] font-semibold ${meta.cls}`}>
          <meta.icon size={13} strokeWidth={2.5} />
          {meta.label}
        </span>

        {offer.status === 'pending' ? (
          <button
            onClick={withdraw}
            disabled={loading}
            className="flex items-center gap-[6px] px-[14px] py-[8px] border-2 border-gray-200 dark:border-dark-600 text-gray-600 dark:text-text-muted text-[12px] font-display font-bold rounded-lg hover:border-red-400 hover:text-red-500 transition-colors disabled:opacity-50 clip-chamfer"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : <Undo2 size={14} />}
            Geri Çek
          </button>
        ) : offer.status === 'accepted' ? (
          <span className="text-[12px] font-semibold text-green-600 dark:text-green-400">
            Satıcıyla iletişime geç →
          </span>
        ) : null}
      </div>
    </div>
  )
}