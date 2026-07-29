import { useInView } from '../../hooks/useInView'
import { Sparkles } from 'lucide-react'
import { MarketplaceAccountCard } from '../marketplace/MarketplaceAccountCard'
import type { Account, SellerProfile } from '../../types'

interface SimilarListingsProps {
  listings: Account[]
  sellers: Record<string, SellerProfile>
  currentUserId: string | null
  favoriteIds: Set<string>
  onToggleFavorite: (id: string) => void
}

export function SimilarListings({
  listings,
  sellers,
  currentUserId,
  favoriteIds,
  onToggleFavorite,
}: SimilarListingsProps) {
  const { ref, inView } = useInView<HTMLDivElement>()

  if (listings.length === 0) return null

  return (
    <div
      ref={ref}
      className={`mt-[40px] md:mt-[56px] transition-all duration-500 ${
        inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div className="flex items-center gap-[10px] mb-[18px]">
        <Sparkles size={20} className="text-primary" />
        <h2 className="font-display font-bold text-[22px] text-dark-900 dark:text-text-light">
          Buna Benzer Hesaplar
        </h2>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-[12px] md:gap-[16px]">
        {listings.map((acc, i) => (
          <MarketplaceAccountCard
            key={acc.id}
            account={acc}
            seller={sellers[acc.seller_id] || null}
            isFavorite={favoriteIds.has(acc.id)}
            isOwn={!!currentUserId && currentUserId === acc.seller_id}
            onToggleFavorite={onToggleFavorite}
            index={i}
          />
        ))}
      </div>
    </div>
  )
}