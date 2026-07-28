import { Check } from 'lucide-react'
import { RANK_GROUPS, RANK_TIER_COLOR } from '../../lib/ranks'
import { FilterSection } from './FilterSection'

interface RankFilterProps {
  selected: string[]
  onToggle: (rank: string) => void
}

export function RankFilter({ selected, onToggle }: RankFilterProps) {
  return (
    <FilterSection title="Rank Seviyesi" count={selected.length}>
      <div className="space-y-[14px]">
        {RANK_GROUPS.map((group) => (
          <div key={group.label}>
            <p className="text-[11px] font-semibold text-gray-400 dark:text-text-muted uppercase tracking-[1px] mb-[8px]">
              {group.label}
            </p>
            <div className="space-y-[6px]">
              {group.ranks.map((rank) => {
                const checked = selected.includes(rank)
                return (
                  <label
                    key={rank}
                    className="flex items-center gap-[10px] cursor-pointer group py-[3px]"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => onToggle(rank)}
                      className="sr-only"
                    />
                    <span
                      className={`w-[18px] h-[18px] flex-shrink-0 flex items-center justify-center transition-all duration-200 ${
                        checked
                          ? 'bg-primary border-primary'
                          : 'border-2 border-gray-300 dark:border-dark-600 group-hover:border-primary'
                      }`}
                      style={{ clipPath: 'polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)' }}
                    >
                      {checked && <Check size={12} className="text-white" strokeWidth={3} />}
                    </span>
                    <span
                      className="w-[8px] h-[8px] rounded-full flex-shrink-0"
                      style={{ backgroundColor: RANK_TIER_COLOR[rank] || '#9CA3AF' }}
                    />
                    <span
                      className={`text-[14px] transition-colors ${
                        checked
                          ? 'text-dark-900 dark:text-text-light font-medium'
                          : 'text-gray-600 dark:text-text-muted group-hover:text-dark-900 dark:group-hover:text-text-light'
                      }`}
                    >
                      {rank}
                    </span>
                  </label>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </FilterSection>
  )
}