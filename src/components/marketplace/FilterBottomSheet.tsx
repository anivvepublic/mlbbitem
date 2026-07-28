import { useEffect } from 'react'
import { X, RotateCcw } from 'lucide-react'
import { RankFilter } from './RankFilter'
import { PriceRangeFilter } from './PriceRangeFilter'
import { SkinCountFilter } from './SkinCountFilter'
import type { MarketplaceFilters } from '../../types'

interface FilterBottomSheetProps {
  open: boolean
  onClose: () => void
  resultCount: number
  filters: MarketplaceFilters
  toggleRank: (rank: string) => void
  setMinPrice: (v: number) => void
  setMaxPrice: (v: number) => void
  setMinSkins: (v: number) => void
  reset: () => void
  hasActiveFilters: boolean
}

export function FilterBottomSheet({
  open,
  onClose,
  resultCount,
  filters,
  toggleRank,
  setMinPrice,
  setMaxPrice,
  setMinSkins,
  reset,
  hasActiveFilters,
}: FilterBottomSheetProps) {
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : 'unset'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [open])

  return (
    <div
      className={`fixed inset-0 z-[90] lg:hidden ${open ? '' : 'pointer-events-none'}`}
      aria-hidden={!open}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          open ? 'opacity-100' : 'opacity-0'
        }`}
      />
      {/* Panel */}
      <div
        className={`absolute bottom-0 left-0 right-0 bg-white dark:bg-dark-800 rounded-t-2xl max-h-[88vh] flex flex-col transition-transform duration-300 ease-out ${
          open ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        {/* Tutamaç + Başlık */}
        <div className="flex-shrink-0 px-[18px] pt-[12px] pb-[14px] border-b border-gray-100 dark:border-dark-700">
          <div className="w-[40px] h-[4px] rounded-full bg-gray-300 dark:bg-dark-600 mx-auto mb-[14px]" />
          <div className="flex items-center justify-between">
            <span className="font-display font-bold text-[18px] text-dark-900 dark:text-text-light">
              Filtreler
            </span>
            <div className="flex items-center gap-[10px]">
              {hasActiveFilters && (
                <button
                  onClick={reset}
                  className="flex items-center gap-[4px] text-[13px] text-gray-400 hover:text-red-500 transition-colors"
                >
                  <RotateCcw size={13} />
                  Temizle
                </button>
              )}
              <button
                onClick={onClose}
                className="p-[6px] rounded-lg bg-gray-100 dark:bg-dark-700 text-gray-500"
                aria-label="Kapat"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Gövde */}
        <div className="flex-1 overflow-y-auto px-[18px] scrollbar-hide">
          <RankFilter selected={filters.ranks} onToggle={toggleRank} />
          <PriceRangeFilter
            minPrice={filters.minPrice}
            maxPrice={filters.maxPrice}
            onChangeMin={setMinPrice}
            onChangeMax={setMaxPrice}
          />
          <SkinCountFilter minSkins={filters.minSkins} onChange={setMinSkins} />
        </div>

        {/* Alt buton */}
        <div className="flex-shrink-0 p-[16px] border-t border-gray-100 dark:border-dark-700">
          <button
            onClick={onClose}
            className="w-full py-[14px] bg-primary text-white font-display font-bold text-[15px] rounded-lg hover:bg-primary-dark transition-colors clip-chamfer"
          >
            {resultCount} Sonucu Göster
          </button>
        </div>
      </div>
    </div>
  )
}