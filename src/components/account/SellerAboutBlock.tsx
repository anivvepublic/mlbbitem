import { useInView } from '../../hooks/useInView'
import { BadgeCheck, Calendar, ShieldCheck } from 'lucide-react'
import type { SellerProfile } from '../../types'

interface SellerAboutBlockProps {
  seller?: SellerProfile | null
  createdAt: string
}

export function SellerAboutBlock({ seller, createdAt }: SellerAboutBlockProps) {
  const { ref, inView } = useInView<HTMLDivElement>()
  const sellerName = seller?.display_name || seller?.username || 'Satıcı'
  const sellerInitial = sellerName.charAt(0).toUpperCase()

  const daysAgo = Math.floor((Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24))
  const dateLabel = daysAgo === 0 ? 'Bugün' : daysAgo === 1 ? 'Dün' : `${daysAgo} gün önce`

  const memberDays = seller?.created_at
    ? Math.floor((Date.now() - new Date(seller.created_at).getTime()) / (1000 * 60 * 60 * 24))
    : null
  const memberLabel =
    memberDays === null ? '' : memberDays < 30 ? `${memberDays} gündür üye` : `${Math.floor(memberDays / 30)} aydır üye`

  const verified = (seller?.completed_deals || 0) > 0

  return (
    <div
      ref={ref}
      className={`transition-all duration-500 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
    >
      <div className="relative bg-gradient-to-br from-white to-gray-50 dark:from-dark-800 dark:to-dark-900 border border-gray-200 dark:border-dark-700 rounded-xl p-[20px] overflow-hidden">
        <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-primary/5 blur-2xl" />
        <div className="relative flex items-center gap-[16px]">
          {seller?.avatar_url ? (
            <img src={seller.avatar_url} alt="" className="w-[56px] h-[56px] rounded-full object-cover flex-shrink-0" />
          ) : (
            <span className="w-[56px] h-[56px] rounded-full bg-primary/20 text-primary font-display font-bold text-[22px] flex items-center justify-center flex-shrink-0">
              {sellerInitial}
            </span>
          )}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-[8px]">
              <p className="font-display font-bold text-[17px] text-dark-900 dark:text-text-light truncate">
                {sellerName}
              </p>
              {verified && (
                <span className="flex items-center gap-[3px] px-[7px] py-[2px] rounded-full bg-green-500/10 text-green-600 dark:text-green-400 text-[10px] font-bold flex-shrink-0">
                  <ShieldCheck size={11} />
                  DOĞRULANDI
                </span>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-x-[14px] gap-y-[4px] mt-[6px]">
              <span className="text-[13px] text-green-600 dark:text-green-400 flex items-center gap-[5px]">
                <BadgeCheck size={15} />
                {seller?.completed_deals || 0} işlem
              </span>
              {memberLabel && (
                <span className="text-[13px] text-gray-400 dark:text-text-muted flex items-center gap-[5px]">
                  <Calendar size={14} />
                  {memberLabel}
                </span>
              )}
              <span className="text-[13px] text-gray-400 dark:text-text-muted">İlan {dateLabel}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}