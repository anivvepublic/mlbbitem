import { useState, useRef, useEffect } from 'react'
import { ArrowDownUp, Check } from 'lucide-react'
import { SORT_OPTIONS } from '../../lib/ranks'
import type { SortKey } from '../../types'

interface SortSelectProps {
  value: SortKey
  onChange: (v: SortKey) => void
}

export function SortSelect({ value, onChange }: SortSelectProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const current = SORT_OPTIONS.find((o) => o.key === value)

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-[8px] px-[12px] py-[9px] bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-lg hover:border-primary transition-colors text-[13px] font-medium text-dark-900 dark:text-text-light"
      >
        <ArrowDownUp size={15} className="text-gray-400" />
        <span className="hidden sm:inline text-gray-400">Sırala:</span>
        <span>{current?.label}</span>
      </button>
      {open && (
        <div className="absolute right-0 mt-[6px] w-[220px] bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-lg shadow-xl overflow-hidden z-40">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              onClick={() => {
                onChange(opt.key)
                setOpen(false)
              }}
              className={`w-full flex items-center justify-between px-[14px] py-[10px] text-[13px] transition-colors ${
                opt.key === value
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-gray-700 dark:text-text-light hover:bg-gray-50 dark:hover:bg-dark-700'
              }`}
            >
              {opt.label}
              {opt.key === value && <Check size={15} />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}