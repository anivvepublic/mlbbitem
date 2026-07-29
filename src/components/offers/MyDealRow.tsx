import { Package, Clock, Check, X } from 'lucide-react'
import { useInView } from '../../hooks/useInView'
import type { Deal } from '../../types'

interface MyDealRowProps {
  deal: Deal
  index: number
}

const STEP_LABEL = ['Ödeme Emanette', 'Hesap Devredildi', 'Tamamlandı']

export function MyDealRow({ deal, index }: MyDealRowProps) {
  const { ref, inView } = useInView<HTMLDivElement>()
  const acc = deal.account
  const seller = deal.seller
  const sellerName = seller?.display_name || seller?.username || 'Satıcı'
  const sellerInitial = sellerName.charAt(0).toUpperCase()

  const cancelled = deal.status === 'cancelled'
  const completedIndex =
    deal.status === 'completed' ? 3 : deal.status === 'transferred' ? 2 : deal.status === 'paid' ? 1 : 0

  const headLabel = cancelled
    ? 'İşlem İptal Edildi'
    : completedIndex >= 3
    ? 'Teslim Alındı · Tamamlandı'
    : `${STEP_LABEL[completedIndex]} bekleniyor`

  const daysAgo = Math.floor((Date.now() - new Date(deal.created_at).getTime()) / (1000 * 60 * 60 * 24))
  const dateLabel = daysAgo === 0 ? 'Bugün' : daysAgo === 1 ? 'Dün' : `${daysAgo} gün önce`

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
          <div className="w-[52px] h-[52px] rounded-lg bg-gray-100 dark:bg-dark-700 flex items-center justify-center flex-shrink-0">
            <Package size={20} className="text-gray-300 dark:text-dark-600" />
          </div>
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
            {deal.amount.toLocaleString('tr-TR')}₺
          </p>
          <p className="text-[10px] uppercase tracking-[1px] text-gray-400 dark:text-text-muted mt-[3px]">Ödediğin</p>
        </div>
      </div>

      {/* Akış çubuğu */}
      <div className="mt-[16px] pt-[14px] border-t border-gray-100 dark:border-dark-700">
        <p className={`text-[12px] font-semibold mb-[12px] flex items-center gap-[6px] ${cancelled ? 'text-red-500' : completedIndex >= 3 ? 'text-green-600 dark:text-green-400' : 'text-blue-600 dark:text-blue-400'}`}>
          {cancelled ? <X size={14} /> : completedIndex >= 3 ? <Check size={14} strokeWidth={3} /> : <Clock size={13} className="animate-pulse" />}
          {headLabel}
        </p>

        {cancelled ? (
          <div className="h-[6px] rounded-full bg-red-500/20 overflow-hidden">
            <div className="h-full w-full bg-red-500/60" />
          </div>
        ) : (
          <div className="flex items-center">
            {STEP_LABEL.map((label, i) => {
              const done = i < completedIndex
              const active = i === completedIndex && completedIndex < 3
              return (
                <div key={label} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center gap-[6px]">
                    <span
                      className={`relative w-[22px] h-[22px] rounded-full flex items-center justify-center text-[11px] font-bold transition-colors ${
                        done
                          ? 'bg-green-500 text-white'
                          : active
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 dark:bg-dark-700 text-gray-400'
                      }`}
                    >
                      {active && <span className="absolute inset-0 rounded-full bg-blue-500/40 animate-ping" />}
                      {done ? <Check size={12} strokeWidth={3} className="relative" /> : i + 1}
                    </span>
                    <span className={`text-[10px] text-center leading-tight max-w-[64px] ${done || active ? 'text-dark-900 dark:text-text-light font-semibold' : 'text-gray-400 dark:text-text-muted'}`}>
                      {label}
                    </span>
                  </div>
                  {i < STEP_LABEL.length - 1 && (
                    <div className="flex-1 h-[3px] mx-[6px] mb-[20px] rounded-full bg-gray-200 dark:bg-dark-700 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${i < completedIndex - 1 || (i === completedIndex - 1 && done) ? 'w-full bg-green-500' : active || i < completedIndex ? 'w-full bg-blue-500' : 'w-0'}`}
                        style={{ width: i < completedIndex ? '100%' : '0%' }}
                      />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}