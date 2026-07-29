import { Check, X, Clock, TrendingDown, TrendingUp, Loader2 } from 'lucide-react'
import type { Offer } from '../../types'

interface OfferRowProps {
  offer: Offer
  loading: boolean
  onAccept: (id: string) => void
  onReject: (id: string) => void
}

export function OfferRow({ offer, loading, onAccept, onReject }: OfferRowProps) {
  const acc = offer.account
  const buyer = offer.buyer
  const buyerName = buyer?.display_name || buyer?.username || 'Alıcı'
  const buyerInitial = buyerName.charAt(0).toUpperCase()
  const listPrice = acc?.price || 0
  const diff = listPrice > 0 ? offer.amount - listPrice : 0
  const diffPct = listPrice > 0 ? Math.round((diff / listPrice) * 100) : 0

  const daysAgo = Math.floor((Date.now() - new Date(offer.created_at).getTime()) / (1000 * 60 * 60 * 24))
  const dateLabel = daysAgo === 0 ? 'Bugün' : daysAgo === 1 ? 'Dün' : `${daysAgo} gün önce`

  return (
    <div className="group bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-xl p-[16px] hover:border-primary/50 hover:shadow-lg transition-all">
      <div className="flex items-start gap-[12px]">
        {/* İlan görseli */}
        {acc?.image_url ? (
          <img src={acc.image_url} alt="" className="w-[52px] h-[52px] rounded-lg object-cover flex-shrink-0" />
        ) : (
          <div className="w-[52px] h-[52px] rounded-lg bg-gray-100 dark:bg-dark-700 flex-shrink-0" />
        )}

        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-semibold text-dark-900 dark:text-text-light truncate">
            {acc?.title || 'İlan'}
          </p>
          <div className="flex items-center gap-[8px] mt-[3px]">
            {buyer?.avatar_url ? (
              <img src={buyer.avatar_url} alt="" className="w-[18px] h-[18px] rounded-full object-cover" />
            ) : (
              <span className="w-[18px] h-[18px] rounded-full bg-primary/20 text-primary text-[10px] font-bold flex items-center justify-center">
                {buyerInitial}
              </span>
            )}
            <span className="text-[12px] text-gray-500 dark:text-text-muted truncate">{buyerName}</span>
            <span className="text-[11px] text-gray-400 dark:text-text-muted flex items-center gap-[3px] flex-shrink-0">
              <Clock size={11} />
              {dateLabel}
            </span>
          </div>
        </div>

        {/* Teklif tutarı + fark */}
        <div className="text-right flex-shrink-0">
          <p className="font-display font-bold text-[18px] text-primary leading-none">
            {offer.amount.toLocaleString('tr-TR')}₺
          </p>
          {listPrice > 0 && diff !== 0 && (
            <p
              className={`text-[11px] font-semibold flex items-center justify-end gap-[3px] mt-[3px] ${
                diff < 0 ? 'text-red-500' : 'text-green-600 dark:text-green-400'
              }`}
            >
              {diff < 0 ? <TrendingDown size={12} /> : <TrendingUp size={12} />}
              {diffPct > 0 ? '+' : ''}
              {diffPct}%
            </p>
          )}
        </div>
      </div>

      {offer.message && (
        <p className="mt-[12px] text-[13px] text-gray-600 dark:text-text-muted bg-gray-50 dark:bg-dark-900/60 rounded-lg px-[12px] py-[8px] leading-relaxed">
          “{offer.message}”
        </p>
      )}

      {/* Aksiyonlar */}
      <div className="flex items-center gap-[8px] mt-[14px] pt-[12px] border-t border-gray-100 dark:border-dark-700">
        <button
          onClick={() => onAccept(offer.id)}
          disabled={loading}
          className="flex-1 flex items-center justify-center gap-[6px] px-[12px] py-[9px] bg-green-600 text-white text-[13px] font-display font-bold rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 clip-chamfer"
        >
          {loading ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} strokeWidth={3} />}
          Kabul Et
        </button>
        <button
          onClick={() => onReject(offer.id)}
          disabled={loading}
          className="flex-1 flex items-center justify-center gap-[6px] px-[12px] py-[9px] border-2 border-gray-200 dark:border-dark-600 text-gray-600 dark:text-text-muted text-[13px] font-display font-bold rounded-lg hover:border-red-400 hover:text-red-500 transition-colors disabled:opacity-50 clip-chamfer"
        >
          <X size={15} strokeWidth={3} />
          Reddet
        </button>
      </div>
    </div>
  )
}