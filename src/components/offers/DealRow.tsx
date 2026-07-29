import { Package, Clock } from 'lucide-react'
import { useInView } from '../../hooks/useInView'
import type { Deal } from '../../types'

interface DealRowProps {
  deal: Deal
  index: number
}

const STATUS_META: Record<Deal['status'], { label: string; color: string; dot: string }> = {
  pending_payment: { label: 'Ödeme Bekleniyor', color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400', dot: 'bg-amber-500' },
  paid: { label: 'Ödeme Emanette', color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400', dot: 'bg-blue-500' },
  transferred: { label: 'Hesap Devredildi', color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400', dot: 'bg-purple-500' },
  completed: { label: 'Tamamlandı', color: 'bg-green-500/10 text-green-600 dark:text-green-400', dot: 'bg-green-500' },
  cancelled: { label: 'İptal', color: 'bg-gray-500/10 text-gray-500', dot: 'bg-gray-400' },
}

export function DealRow({ deal, index }: DealRowProps) {
  const { ref, inView } = useInView<HTMLDivElement>()
  const acc = deal.account
  const buyer = deal.buyer
  const buyerName = buyer?.display_name || buyer?.username || 'Alıcı'
  const buyerInitial = buyerName.charAt(0).toUpperCase()
  const meta = STATUS_META[deal.status]

  const daysAgo = Math.floor((Date.now() - new Date(deal.created_at).getTime()) / (1000 * 60 * 60 * 24))
  const dateLabel = daysAgo === 0 ? 'Bugün' : daysAgo === 1 ? 'Dün' : `${daysAgo} gün önce`

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${(index % 6) * 60}ms` }}
      className={`bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-xl p-[16px] hover:border-primary hover:shadow-xl hover:-translate-y-[3px] transition-all duration-300 ${
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
            {buyer?.avatar_url ? (
              <img src={buyer.avatar_url} alt="" className="w-[18px] h-[18px] rounded-full object-cover" />
            ) : (
              <span className="w-[18px] h-[18px] rounded-full bg-primary/20 text-primary text-[10px] font-bold flex items-center justify-center">
                {buyerInitial}
              </span>
            )}
            <span className="text-[12px] text-gray-500 dark:text-text-muted truncate">Alıcı: {buyerName}</span>
            <span className="text-[11px] text-gray-400 dark:text-text-muted flex items-center gap-[3px] flex-shrink-0">
              <Clock size={11} />
              {dateLabel}
            </span>
          </div>
        </div>

        <div className="text-right flex-shrink-0">
          <p className="font-display font-bold text-[18px] text-primary leading-none">
            {deal.amount.toLocaleString('tr-TR')}₺
          </p>
        </div>
      </div>

      <div className="mt-[14px] pt-[12px] border-t border-gray-100 dark:border-dark-700 flex items-center justify-between">
        <span className={`inline-flex items-center gap-[6px] px-[10px] py-[5px] rounded-full text-[12px] font-semibold ${meta.color}`}>
          <span className={`w-[7px] h-[7px] rounded-full ${meta.dot} ${deal.status === 'pending_payment' ? 'animate-pulse' : ''}`} />
          {meta.label}
        </span>
        <span className="text-[12px] text-gray-400 dark:text-text-muted">
          {deal.status === 'completed' ? 'Kazanç cebinde' : 'İşlem sürüyor'}
        </span>
      </div>
    </div>
  )
}