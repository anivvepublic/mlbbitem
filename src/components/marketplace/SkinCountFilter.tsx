import { FilterSection } from './FilterSection'
import { SKINS_MAX } from '../../lib/ranks'

interface SkinCountFilterProps {
  minSkins: number
  onChange: (v: number) => void
}

export function SkinCountFilter({ minSkins, onChange }: SkinCountFilterProps) {
  const percent = (minSkins / SKINS_MAX) * 100

  return (
    <FilterSection title="Skin Sayısı" count={minSkins > 0 ? 1 : 0}>
      <div className="flex items-center justify-between mb-[12px]">
        <span className="text-[13px] text-gray-500 dark:text-text-muted">En az</span>
        <span className="font-display font-bold text-[16px] text-primary">
          {minSkins} skin
        </span>
      </div>
      <div className="relative h-[6px] rounded-full bg-gray-200 dark:bg-dark-700">
        <div
          className="absolute h-[6px] rounded-full bg-primary transition-all duration-150"
          style={{ width: `${percent}%` }}
        />
        <input
          type="range"
          min={0}
          max={SKINS_MAX}
          step={1}
          value={minSkins}
          onChange={(e) => onChange(Number(e.target.value))}
          className="range-thumb"
          aria-label="Minimum skin sayısı"
        />
      </div>
      <div className="flex items-center justify-between mt-[12px]">
        <input
          type="number"
          min={0}
          max={SKINS_MAX}
          value={minSkins}
          onChange={(e) => onChange(Math.min(Number(e.target.value) || 0, SKINS_MAX))}
          className="w-[80px] px-[8px] py-[6px] bg-gray-50 dark:bg-dark-700 border border-gray-200 dark:border-dark-600 rounded-md text-[13px] text-dark-900 dark:text-text-light focus:border-primary focus:outline-none transition-colors"
        />
        <button
          onClick={() => onChange(0)}
          className="text-[12px] text-gray-400 hover:text-primary transition-colors"
        >
          Sıfırla
        </button>
      </div>
    </FilterSection>
  )
}