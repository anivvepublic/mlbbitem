import { RangeSlider } from '../ui/RangeSlider'
import { FilterSection } from './FilterSection'
import { PRICE_MIN, PRICE_MAX } from '../../lib/ranks'

interface PriceRangeFilterProps {
  minPrice: number
  maxPrice: number
  onChangeMin: (v: number) => void
  onChangeMax: (v: number) => void
}

export function PriceRangeFilter({
  minPrice,
  maxPrice,
  onChangeMin,
  onChangeMax,
}: PriceRangeFilterProps) {
  const isActive = minPrice !== PRICE_MIN || maxPrice !== PRICE_MAX

  return (
    <FilterSection title="Fiyat Aralığı" count={isActive ? 1 : 0}>
      <RangeSlider
        min={PRICE_MIN}
        max={PRICE_MAX}
        step={100}
        valueMin={minPrice}
        valueMax={maxPrice}
        onChangeMin={onChangeMin}
        onChangeMax={onChangeMax}
      />
      <div className="flex items-center gap-[10px] mt-[16px]">
        <div className="flex-1">
          <label className="block text-[11px] text-gray-400 dark:text-text-muted mb-[5px]">
            En Düşük
          </label>
          <div className="relative">
            <input
              type="number"
              min={PRICE_MIN}
              max={maxPrice}
              value={minPrice}
              onChange={(e) => onChangeMin(Number(e.target.value) || 0)}
              className="w-full px-[10px] py-[8px] pr-[28px] bg-gray-50 dark:bg-dark-700 border border-gray-200 dark:border-dark-600 rounded-md text-[13px] text-dark-900 dark:text-text-light focus:border-primary focus:outline-none transition-colors"
            />
            <span className="absolute right-[10px] top-1/2 -translate-y-1/2 text-[12px] text-gray-400">
              ₺
            </span>
          </div>
        </div>
        <span className="text-gray-300 dark:text-dark-600 mt-[18px]">—</span>
        <div className="flex-1">
          <label className="block text-[11px] text-gray-400 dark:text-text-muted mb-[5px]">
            En Yüksek
          </label>
          <div className="relative">
            <input
              type="number"
              min={minPrice}
              max={PRICE_MAX}
              value={maxPrice}
              onChange={(e) => onChangeMax(Number(e.target.value) || PRICE_MAX)}
              className="w-full px-[10px] py-[8px] pr-[28px] bg-gray-50 dark:bg-dark-700 border border-gray-200 dark:border-dark-600 rounded-md text-[13px] text-dark-900 dark:text-text-light focus:border-primary focus:outline-none transition-colors"
            />
            <span className="absolute right-[10px] top-1/2 -translate-y-1/2 text-[12px] text-gray-400">
              ₺
            </span>
          </div>
        </div>
      </div>
    </FilterSection>
  )
}