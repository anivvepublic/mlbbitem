import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, LayoutGrid, Heart, Settings, LogOut, ChevronDown } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export function UserDropdown() {
  const { user, signOutUser } = useAuth()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (!user) return null

  const displayName = user.email ? user.email.split('@')[0] : 'Kullanıcı'
  const initial = displayName.charAt(0).toUpperCase()

  const menuItems = [
    { label: 'Profilim', icon: User, href: '/profile' },
    { label: 'İlanlarım', icon: LayoutGrid, href: '/my-listings' },
    { label: 'Favorilerim', icon: Heart, href: '/favorites' },
    { label: 'Ayarlar', icon: Settings, href: '/settings' },
  ]

  const handleSignOut = async () => {
    await signOutUser()
    setIsOpen(false)
    navigate('/')
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Avatar Butonu */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-[6px] pr-[10px] rounded-full bg-gray-100 dark:bg-dark-800 hover:bg-gray-200 dark:hover:bg-dark-700 transition-colors"
      >
        <div className="w-[32px] h-[32px] rounded-full bg-primary flex items-center justify-center">
          <span className="text-white font-display font-bold text-[14px]">{initial}</span>
        </div>
        <span className="hidden lg:block text-[14px] font-medium text-dark-900 dark:text-text-light max-w-[100px] truncate">
          {displayName}
        </span>
        <ChevronDown 
          size={16} 
          className={`text-gray-500 dark:text-text-muted transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {/* Dropdown Menü */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-[220px] bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-lg shadow-xl overflow-hidden z-50">
          {/* Kullanıcı Bilgisi */}
          <div className="px-4 py-3 border-b border-gray-100 dark:border-dark-700">
            <p className="text-[13px] font-semibold text-dark-900 dark:text-text-light truncate">
              {displayName}
            </p>
            <p className="text-[12px] text-gray-500 dark:text-text-muted truncate">
              {user.email}
            </p>
          </div>

          {/* Menü Linkleri */}
          <nav className="py-2">
            {menuItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-[10px] text-[14px] text-gray-700 dark:text-text-light hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors"
              >
                <item.icon size={18} className="text-gray-500 dark:text-text-muted" />
                {item.label}
              </a>
            ))}
          </nav>

          {/* Çıkış Yap */}
          <div className="border-t border-gray-100 dark:border-dark-700 py-2">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-4 py-[10px] text-[14px] text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <LogOut size={18} />
              Çıkış Yap
            </button>
          </div>
        </div>
      )}
    </div>
  )
}