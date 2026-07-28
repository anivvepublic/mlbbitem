import { X } from 'lucide-react'
import type { FilterChip } from '../../types'

interface ActiveFilterChipsProps {
  chips: FilterChip[]
  onClearAll: () => void
}

export function ActiveFilterChips({ chips, onClearAll }: ActiveFilterChipsProps) {
  if (chips.length === 0) return null

  return (
    <div className="flex flex-wrap items-center gap-[8px]">
      {chips.map((chip) => (
        <button
          key={chip.key}
          onClick={chip.onRemove}
          className="group flex items-center gap-[6px] pl-[12px] pr-[8px] py-[6px] bg-primary/10 dark:bg-primary/20 text-primary rounded-full text-[12px] font-medium hover:bg-primary/20 dark:hover:bg-primary/30 transition-colors"
        >
          {chip.label}
          <span className="w-[16px] h-[16px] rounded-full bg-primary/20 group-hover:bg-primary group-hover:text-white flex items-center justify-center transition-colors">
            <X size={10} strokeWidth={3} />
          </span>
        </button>
      ))}
      <button
        onClick={onClearAll}
        className="text-[12px] text-gray-400 hover:text-red-500 underline underline-offset-2 transition-colors ml-[4px]"
      >
        Tümünü temizle
      </button>
    </div>
  )
}