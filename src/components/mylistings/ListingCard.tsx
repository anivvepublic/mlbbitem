import { useRef, useState } from 'react'
import { Eye, Pencil, Trash2, ChevronDown, HandCoins, Image as ImageIcon } from 'lucide-react'
import type { Account } from '../../types'

interface ListingCardProps {
  account: Account
  offerCount: number
  onEdit: (a: Account) => void
  onDelete: (a: Account) => void
  onStatus: (id: string, status: Account['status']) => void
}

const STATUS_META: Record<Account['status'], { label: string; cls: string }> = {
  active: { label: 'Aktif', cls: 'bg-green-600 text-white' },
  sold: { label: 'Satıldı', cls: 'bg-primary text-white' },
  pending: { label: 'Beklemede', cls: 'bg-amber-500 text-white' },
  disabled: { label: 'Devre Dışı', cls: 'bg-gray-500 text-white' },
}

export function ListingCard({ account, offerCount, onEdit, onDelete, onStatus }: ListingCardProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const meta = STATUS_META[account.status]

  const setStatus = (s: Account['status']) => {
    setMenuOpen(false)
    if (s !== account.status) onStatus(account.id, s)
  }

  return (
    <div className="group bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-xl overflow-hidden hover:border-primary hover:shadow-xl transition-all">
      {/* Görsel */}
      <div className="relative aspect-[16/9] bg-gray-100 dark:bg-dark-900">
        {account.image_url ? (
          <img src={account.image_url} alt={account.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageIcon size={26} className="text-gray-300 dark:text-dark-600" />
          </div>
        )}
        <span className={`absolute top-[10px] left-[10px] px-[9px] py-[4px] text-[11px] font-bold clip-chamfer ${meta.cls}`}>
          {meta.label}
        </span>
        {offerCount > 0 && account.status === 'active' && (
          <span className="absolute top-[10px] right-[10px] flex items-center gap-[4px] px-[8px] py-[4px] bg-dark-900/85 backdrop-blur-sm text-white text-[11px] font-bold rounded-md">
            <HandCoins size={12} className="text-primary" />
            {offerCount} teklif
          </span>
        )}
      </div>

      {/* İçerik */}
      <div className="p-[14px]">
        <h3 className="font-display font-semibold text-[15px] text-dark-900 dark:text-text-light line-clamp-1 mb-[8px]">
          {account.title}
        </h3>
        <div className="flex items-center justify-between mb-[12px]">
          <span className="text-[12px] text-gray-500 dark:text-text-muted">
            {account.rank} · {account.skins_count} skin
          </span>
          <span className="font-display font-bold text-[17px] text-primary">
            {account.price.toLocaleString('tr-TR')}₺
          </span>
        </div>

        {/* Aksiyonlar */}
        <div className="flex items-center gap-[6px] pt-[12px] border-t border-gray-100 dark:border-dark-700">
          <a
            href={`/account/${account.id}`}
            className="flex-1 flex items-center justify-center gap-[5px] px-[8px] py-[8px] text-[12px] font-medium text-gray-600 dark:text-text-muted hover:text-primary hover:bg-gray-50 dark:hover:bg-dark-700 rounded-lg transition-colors"
          >
            <Eye size={15} />
            Gör
          </a>
          <button
            onClick={() => onEdit(account)}
            className="flex-1 flex items-center justify-center gap-[5px] px-[8px] py-[8px] text-[12px] font-medium text-gray-600 dark:text-text-muted hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
          >
            <Pencil size={15} />
            Düzenle
          </button>

          {/* Durum menüsü */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              onBlur={() => setTimeout(() => setMenuOpen(false), 150)}
              className="flex items-center justify-center gap-[3px] px-[8px] py-[8px] text-[12px] font-medium text-gray-600 dark:text-text-muted hover:text-primary hover:bg-gray-50 dark:hover:bg-dark-700 rounded-lg transition-colors"
            >
              Durum
              <ChevronDown size={13} className={`transition-transform ${menuOpen ? 'rotate-180' : ''}`} />
            </button>
            {menuOpen && (
              <div className="absolute right-0 bottom-full mb-[6px] w-[140px] bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-lg shadow-xl overflow-hidden z-30">
                {(['active', 'sold', 'disabled'] as const).map((s) => (
                  <button
                    key={s}
                    onMouseDown={() => setStatus(s)}
                    className={`w-full text-left px-[12px] py-[9px] text-[13px] transition-colors ${
                      account.status === s
                        ? 'bg-primary/10 text-primary font-semibold'
                        : 'text-gray-700 dark:text-text-light hover:bg-gray-50 dark:hover:bg-dark-700'
                    }`}
                  >
                    {STATUS_META[s].label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => onDelete(account)}
            className="flex items-center justify-center px-[8px] py-[8px] text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            aria-label="Sil"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </div>
  )
}