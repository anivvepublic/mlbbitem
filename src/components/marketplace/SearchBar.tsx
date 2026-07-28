import { Search, X } from 'lucide-react'

interface SearchBarProps {
  value: string
  onChange: (v: string) => void
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative group w-full">
      <Search
        size={20}
        className="absolute left-[16px] top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Hesap, skin veya açıklama ara..."
        className="w-full pl-[48px] pr-[44px] py-[14px] bg-white dark:bg-dark-800 border-2 border-transparent rounded-xl text-[15px] text-dark-900 dark:text-text-light placeholder:text-gray-400 focus:outline-none focus:border-primary shadow-lg transition-all"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-[14px] top-1/2 -translate-y-1/2 p-[4px] rounded-full bg-gray-100 dark:bg-dark-700 text-gray-500 hover:bg-gray-200 dark:hover:bg-dark-600 transition-colors"
          aria-label="Aramayı temizle"
        >
          <X size={14} />
        </button>
      )}
    </div>
  )
}