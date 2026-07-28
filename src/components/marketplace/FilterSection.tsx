import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface FilterSectionProps {
  title: string
  count?: number
  defaultOpen?: boolean
  children: React.ReactNode
}

export function FilterSection({ title, count, defaultOpen = true, children }: FilterSectionProps) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="border-b border-gray-100 dark:border-dark-700 last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-[14px] text-left group"
      >
        <span className="flex items-center gap-2 font-display font-semibold text-[14px] uppercase tracking-[1px] text-dark-900 dark:text-text-light">
          {title}
          {count !== undefined && count > 0 && (
            <span className="normal-case tracking-normal text-[11px] font-bold bg-primary text-white rounded-full w-[20px] h-[20px] flex items-center justify-center">
              {count}
            </span>
          )}
        </span>
        <ChevronDown
          size={18}
          className={`text-gray-400 group-hover:text-primary transition-transform duration-300 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-out ${
          open ? 'max-h-[700px] opacity-100 pb-[16px]' : 'max-h-0 opacity-0'
        }`}
      >
        {children}
      </div>
    </div>
  )
}