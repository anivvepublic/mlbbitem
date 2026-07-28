import { SlidersHorizontal, RotateCcw } from 'lucide-react'
import { RankFilter } from './RankFilter'
import { PriceRangeFilter } from './PriceRangeFilter'
import { SkinCountFilter } from './SkinCountFilter'
import type { MarketplaceFilters } from '../../types'

interface FilterSidebarProps {
  filters: MarketplaceFilters
  toggleRank: (rank: string) => void
  setMinPrice: (v: number) => void
  setMaxPrice: (v: number) => void
  setMinSkins: (v: number) => void
  reset: () => void
  hasActiveFilters: boolean
}

export function FilterSidebar({
  filters,
  toggleRank,
  setMinPrice,
  setMaxPrice,
  setMinSkins,
  reset,
  hasActiveFilters,
}: FilterSidebarProps) {
  return (
    <aside className="hidden lg:block">
      <div className="sticky top-[100px] bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-[18px] py-[16px] border-b border-gray-100 dark:border-dark-700 bg-gray-50/50 dark:bg-dark-900/40">
          <div className="flex items-center gap-[8px]">
            <SlidersHorizontal size={18} className="text-primary" />
            <span className="font-display font-bold text-[15px] text-dark-900 dark:text-text-light">
              Filtreler
            </span>
          </div>
          {hasActiveFilters && (
            <button
              onClick={reset}
              className="flex items-center gap-[4px] text-[12px] text-gray-400 hover:text-red-500 transition-colors"
            >
              <RotateCcw size={12} />
              Temizle
            </button>
          )}
        </div>
        <div className="px-[18px]">
          <RankFilter selected={filters.ranks} onToggle={toggleRank} />
          <PriceRangeFilter
            minPrice={filters.minPrice}
            maxPrice={filters.maxPrice}
            onChangeMin={setMinPrice}
            onChangeMax={setMaxPrice}
          />
          <SkinCountFilter minSkins={filters.minSkins} onChange={setMinSkins} />
        </div>
      </div>
    </aside>
  )
}