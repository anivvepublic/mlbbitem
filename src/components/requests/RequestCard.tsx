import { ShoppingBag, MessageCircle, Gem, Clock } from 'lucide-react'
import { useInView } from '../../hooks/useInView'
import { RANK_TIER_COLOR } from '../../lib/ranks'
import type { AccountRequest, SellerProfile } from '../../types'

interface RequestCardProps {
  request: AccountRequest
  owner?: SellerProfile | null
  isOwn: boolean
  onContact: (request: AccountRequest) => void
  index: number
}

export function RequestCard({ request, owner, isOwn, onContact, index }: RequestCardProps) {
  const { ref, inView } = useInView<HTMLDivElement>()
  const ownerName = owner?.display_name || owner?.username || 'Kullanıcı'
  const ownerInitial = ownerName.charAt(0).toUpperCase()
  const tierColor = request.wanted_rank ? RANK_TIER_COLOR[request.wanted_rank] || '#9CA3AF' : null

  const daysAgo = Math.floor(
    (Date.now() - new Date(request.created_at).getTime()) / (1000 * 60 * 60 * 24)
  )
  const dateLabel = daysAgo === 0 ? 'Bugün' : daysAgo === 1 ? 'Dün' : `${daysAgo} gün önce`

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${(index % 6) * 60}ms` }}
      className={`group relative bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-xl overflow-hidden hover:border-primary hover:shadow-2xl hover:-translate-y-[5px] transition-all duration-300 ${
        inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[16px]'
      }`}
    >
      {/* Sol turuncu şerit */}
      <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-primary" />

      <div className="p-[16px] pl-[20px]">
        {/* Üst satır: ARANıyor damgası + tarih */}
        <div className="flex items-center justify-between mb-[12px]">
          <span
            className="inline-flex items-center gap-[5px] bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-[1.5px] px-[8px] py-[3px] -rotate-2"
            style={{ clipPath: 'polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)' }}
          >
            Aranıyor
          </span>
          <span className="flex items-center gap-[4px] text-[11px] text-gray-400 dark:text-text-muted">
            <Clock size={11} />
            {dateLabel}
          </span>
        </div>

        {/* Rank rozeti + başlık */}
        <div className="flex items-start gap-[10px] mb-[8px]">
          {request.wanted_rank && tierColor && (
            <span
              className="flex-shrink-0 mt-[2px] px-[8px] py-[3px] text-[10px] font-bold text-white"
              style={{
                backgroundColor: tierColor,
                clipPath: 'polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)',
              }}
            >
              {request.wanted_rank}
            </span>
          )}
          <h3 className="font-display font-bold text-[17px] leading-tight text-dark-900 dark:text-text-light group-hover:text-primary transition-colors">
            {request.title}
          </h3>
        </div>

        {/* Açıklama */}
        {request.description && (
          <p className="text-[13px] text-gray-500 dark:text-text-muted leading-relaxed line-clamp-2 mb-[14px]">
            {request.description}
          </p>
        )}

        {/* Bütçe + Skin bilgisi */}
        <div className="grid grid-cols-2 gap-[8px] mb-[14px]">
          <div className="bg-gray-50 dark:bg-dark-900/60 border border-gray-100 dark:border-dark-700 rounded-lg p-[10px]">
            <p className="text-[10px] uppercase tracking-[1px] text-gray-400 dark:text-text-muted mb-[3px]">
              Bütçe
            </p>
            <p className="font-display font-bold text-[15px] text-primary leading-none">
              {request.budget_max > 0
                ? `₺${request.budget_min.toLocaleString('tr-TR')} - ₺${request.budget_max.toLocaleString('tr-TR')}`
                : 'Pazarlığa açık'}
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-dark-900/60 border border-gray-100 dark:border-dark-700 rounded-lg p-[10px]">
            <p className="text-[10px] uppercase tracking-[1px] text-gray-400 dark:text-text-muted mb-[3px] flex items-center gap-[3px]">
              <Gem size={10} />
              Min. Skin
            </p>
            <p className="font-display font-bold text-[15px] text-dark-900 dark:text-text-light leading-none">
              {request.min_skins > 0 ? `${request.min_skins}+` : 'Farketmez'}
            </p>
          </div>
        </div>

        {/* Alt satır: Oluşturan + Bende Var */}
        <div className="flex items-center justify-between pt-[12px] border-t border-gray-100 dark:border-dark-700">
          <div className="flex items-center gap-[7px] min-w-0">
            {owner?.avatar_url ? (
              <img src={owner.avatar_url} alt="" className="w-[22px] h-[22px] rounded-full object-cover" />
            ) : (
              <span className="w-[22px] h-[22px] rounded-full bg-primary/20 text-primary text-[11px] font-bold flex items-center justify-center flex-shrink-0">
                {ownerInitial}
              </span>
            )}
            <span className="text-[12px] text-gray-500 dark:text-text-muted truncate">
              {isOwn ? 'Sen' : ownerName}
            </span>
          </div>

          {isOwn ? (
            <span className="text-[11px] font-semibold text-gray-400 dark:text-text-muted">
              Senin talebin
            </span>
          ) : (
            <button
              onClick={() => onContact(request)}
              className="flex items-center gap-[6px] px-[14px] py-[8px] bg-primary text-white text-[13px] font-display font-bold rounded-lg hover:bg-primary-dark hover:gap-[9px] transition-all clip-chamfer"
            >
              <ShoppingBag size={15} />
              Bende Var
            </button>
          )}
        </div>
      </div>
    </div>
  )
}