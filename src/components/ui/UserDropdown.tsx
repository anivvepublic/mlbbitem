import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, LayoutGrid, Heart, Settings, LogOut, ChevronDown, Wallet } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useProfile } from '../../hooks/useProfile'
import { useBalance } from '../../hooks/useBalance'
import { usePendingOfferCount } from '../../hooks/usePendingOfferCount'

export function UserDropdown() {
  const { user, signOutUser } = useAuth()
  const navigate = useNavigate()
  const { profile } = useProfile()
  const { balance } = useBalance()
  const pendingOffers = usePendingOfferCount()
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

  const displayName = profile?.display_name || profile?.username || user.email?.split('@')[0] || 'Kullanıcı'
  const initial = displayName.charAt(0).toUpperCase()

  const menuItems = [
    { label: 'Profilim', icon: User, href: '/profile', badge: 0, money: false },
    { label: 'Cüzdanım', icon: Wallet, href: '/wallet', badge: 0, money: true },
    { label: 'İlanlarım', icon: LayoutGrid, href: '/my-listings', badge: 0, money: false },
    { label: 'Gelen Teklifler', icon: Heart, href: '/my-offers', badge: pendingOffers, money: false },
    { label: 'Favorilerim', icon: Heart, href: '/favorites', badge: 0, money: false },
    { label: 'Ayarlar', icon: Settings, href: '/settings', badge: 0, money: false },
  ]

  const handleSignOut = async () => {
    await signOutUser()
    setIsOpen(false)
    navigate('/')
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-[6px] pr-[10px] rounded-full bg-gray-100 dark:bg-dark-800 hover:bg-gray-200 dark:hover:bg-dark-700 transition-colors"
      >
        {profile?.avatar_url ? (
          <img src={profile.avatar_url} alt="" className="w-[32px] h-[32px] rounded-full object-cover" />
        ) : (
          <div className="w-[32px] h-[32px] rounded-full bg-primary flex items-center justify-center">
            <span className="text-white font-display font-bold text-[14px]">{initial}</span>
          </div>
        )}
        <span className="hidden lg:block text-[14px] font-medium text-dark-900 dark:text-text-light max-w-[100px] truncate">
          {displayName}
        </span>
        <ChevronDown
          size={16}
          className={`text-gray-500 dark:text-text-muted transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-[250px] bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-lg shadow-xl overflow-hidden z-50">
          {/* Kart başı: avatar + isim + @username + email */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 dark:border-dark-700">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="" className="w-[40px] h-[40px] rounded-full object-cover flex-shrink-0" />
            ) : (
              <div className="w-[40px] h-[40px] rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                <span className="text-white font-display font-bold text-[16px]">{initial}</span>
              </div>
            )}
            <div className="min-w-0">
              <p className="text-[13px] font-semibold text-dark-900 dark:text-text-light truncate">{displayName}</p>
              {profile?.username && (
                <p className="text-[12px] text-primary font-semibold truncate">@{profile.username}</p>
              )}
              <p className="text-[11px] text-gray-500 dark:text-text-muted truncate">{user.email}</p>
            </div>
          </div>

          <nav className="py-2">
            {menuItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-[10px] text-[14px] text-gray-700 dark:text-text-light hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors"
              >
                <item.icon size={18} className="text-gray-500 dark:text-text-muted" />
                <span className="flex-1">{item.label}</span>
                {item.money ? (
                  <span className="font-display font-bold text-[12px] text-green-600 dark:text-green-400">
                    {balance.toLocaleString('tr-TR')}₺
                  </span>
                ) : item.badge > 0 ? (
                  <span className="min-w-[20px] h-[20px] px-[6px] rounded-full bg-primary text-white text-[11px] font-bold flex items-center justify-center">
                    {item.badge}
                  </span>
                ) : null}
              </a>
            ))}
          </nav>

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