import { useEffect } from 'react'
import { Heart, Eye, CheckCircle2, Clock, Globe } from 'lucide-react'
import { useInView } from '../../hooks/useInView'
import { trackView } from '../../lib/viewTracker'
import type { Account, SellerProfile } from '../../types'

interface MarketplaceAccountCardProps {
  account: Account
  seller?: SellerProfile | null
  isFavorite: boolean
  isOwn: boolean
  onToggleFavorite: (id: string) => void
  index: number
}

export function MarketplaceAccountCard({
  account,
  seller,
  isFavorite,
  isOwn,
  onToggleFavorite,
  index,
}: MarketplaceAccountCardProps) {
  const { ref, inView } = useInView<HTMLAnchorElement>()
  const sellerName = seller?.display_name || seller?.username || 'Satıcı'
  const sellerInitial = sellerName.charAt(0).toUpperCase()

  // Kart ekranda ilk göründüğü anda görüntülenme sayacını artır
  // (kullanıcı kaydırıp buraya geldiğinde veya kart zaten görünür durumdaysa)
  useEffect(() => {
    if (inView) {
      trackView(account.id)
    }
  }, [inView, account.id])

  // Tarih hesaplama (dinamik)
  const daysAgo = Math.floor(
    (Date.now() - new Date(account.created_at).getTime()) / (1000 * 60 * 60 * 24)
  )
  const dateLabel = daysAgo === 0 ? 'Bugün' : daysAgo === 1 ? 'Dün' : `${daysAgo} gün önce`

  return (
    <a
      ref={ref}
      href={`/account/${account.id}`}
      style={{
        transitionDelay: `${(index % 8) * 50}ms`,
      }}
      className={`group block bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-xl overflow-hidden hover:border-primary hover:shadow-2xl hover:-translate-y-[6px] transition-all duration-300 ${
        inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[16px]'
      }`}
    >
      {/* Görsel Alanı */}
      <div className="relative aspect-[16/10] bg-gray-100 dark:bg-dark-900 overflow-hidden">
        {account.image_url ? (
          <img
            src={account.image_url}
            alt={account.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-[1.08] transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-dark-700 dark:to-dark-800">
            <span className="text-gray-400 dark:text-dark-600 text-[12px] font-medium">
              Görsel Yok
            </span>
          </div>
        )}

        {/* Kendi ilanın damgası */}
        {isOwn && (
          <span className="absolute top-[10px] left-[10px] px-[8px] py-[4px] bg-dark-900/90 backdrop-blur-sm text-white text-[10px] font-bold flex items-center gap-[4px] rounded-md">
            <CheckCircle2 size={12} />
            Senin İlanın
          </span>
        )}

        {/* Favori kalbi */}
        <button
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onToggleFavorite(account.id)
          }}
          className={`absolute top-[10px] right-[10px] w-[32px] h-[32px] rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-200 active:scale-90 ${
            isFavorite
              ? 'bg-red-500 text-white shadow-lg'
              : 'bg-black/40 text-white hover:bg-black/60'
          }`}
          aria-label="Favorilere ekle"
        >
          <Heart size={16} fill={isFavorite ? 'currentColor' : 'none'} strokeWidth={2.5} />
        </button>

        {/* Alt gradient overlay */}
        <div className="absolute inset-x-0 bottom-0 h-[60px] bg-gradient-to-t from-black/50 to-transparent" />
      </div>

      {/* İçerik Alanı */}
      <div className="p-[14px]">
        {/* Başlık */}
        <h3 className="font-display font-semibold text-[15px] leading-tight text-dark-900 dark:text-text-light line-clamp-2 min-h-[38px] mb-[10px] group-hover:text-primary transition-colors">
          {account.title}
        </h3>

        {/* Server bilgisi (skin sayısı yerine) */}
        <div className="flex items-center gap-[6px] mb-[12px]">
          <span className="px-[8px] py-[3px] bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[11px] font-bold rounded-md flex items-center gap-[4px]">
            <Globe size={11} />
            {account.server || 'Sunucu Belirtilmemiş'}
          </span>
        </div>

        {/* Fiyat (dinamik) */}
        <div className="flex items-baseline gap-[4px] mb-[12px]">
          <span className="font-display font-bold text-[22px] text-primary leading-none">
            ₺{account.price.toLocaleString('tr-TR')}
          </span>
        </div>

        {/* Satıcı Bilgisi (dinamik) */}
        <div className="flex items-center gap-[8px] pt-[12px] border-t border-gray-100 dark:border-dark-700 mb-[10px]">
          {seller?.avatar_url ? (
            <img
              src={seller.avatar_url}
              alt=""
              className="w-[22px] h-[22px] rounded-full object-cover"
            />
          ) : (
            <span className="w-[22px] h-[22px] rounded-full bg-primary/20 text-primary text-[11px] font-bold flex items-center justify-center">
              {sellerInitial}
            </span>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-medium text-dark-900 dark:text-text-light truncate">
              {sellerName}
            </p>
            <p className="text-[10px] text-green-600 dark:text-green-400 flex items-center gap-[3px]">
              <CheckCircle2 size={10} />
              {seller?.completed_deals || 0} başarılı işlem
            </p>
          </div>
        </div>

        {/* Alt Bilgi: Görüntülenme (gerçek) + Tarih (dinamik) */}
        <div className="flex items-center justify-between text-[11px] text-gray-400 dark:text-text-muted">
          <span className="flex items-center gap-[4px]">
            <Eye size={12} />
            {(account.view_count || 0).toLocaleString('tr-TR')} görüntülenme
          </span>
          <span className="flex items-center gap-[4px]">
            <Clock size={12} />
            {dateLabel}
          </span>
        </div>
      </div>
    </a>
  )
}