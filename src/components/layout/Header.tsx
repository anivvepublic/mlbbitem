import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Moon, Sun, Menu, X, LogOut, User, LayoutGrid, Heart, Settings, Wallet } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'
import { useAuth } from '../../context/AuthContext'
import { useAuthModal } from '../../context/AuthModalContext'
import { useProfile } from '../../hooks/useProfile'
import { useBalance } from '../../hooks/useBalance'
import { usePendingOfferCount } from '../../hooks/usePendingOfferCount'
import { UserDropdown } from '../ui/UserDropdown'

export function Header() {
  const { isDark, toggle } = useTheme()
  const { user, signOutUser } = useAuth()
  const { openLogin, openRegister } = useAuthModal()
  const { profile } = useProfile()
  const { balance } = useBalance()
  const pendingOffers = usePendingOfferCount()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const displayName = profile?.display_name || profile?.username || (user?.email ? user.email.split('@')[0] : 'Kullanıcı')
  const initial = displayName.charAt(0).toUpperCase()

  const handleMobileSignOut = async () => {
    await signOutUser()
    setMobileMenuOpen(false)
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-dark-900 border-b border-gray-200 dark:border-dark-700 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-[64px] md:h-[80px]">
          <div className="flex items-center flex-shrink-0 z-10 ml-[-10px] md:ml-[-70px]">
            <a href="/" className="block">
              <img src="/images/logo.png" alt="MLBBITEM" className="h-[140px] md:h-[200px] w-auto object-contain" />
            </a>
          </div>

          <nav className="hidden md:flex items-center space-x-8 ml-auto mr-8">
            <a href="/" className="text-dark-900 dark:text-text-light hover:text-primary font-medium transition-colors text-[16px]">Ana Sayfa</a>
            <a href="/marketplace" className="text-gray-600 dark:text-text-muted hover:text-primary font-medium transition-colors text-[16px]">Hesap Pazarı</a>
            <a href="/requests" className="text-gray-600 dark:text-text-muted hover:text-primary font-medium transition-colors text-[16px]">Talep Oluştur</a>
          </nav>

          <div className="flex items-center gap-3 ml-auto md:ml-0">
            {!user && (
              <>
                <button onClick={openLogin} className="hidden md:block px-5 py-2 border-2 border-primary text-primary font-semibold rounded-lg hover:bg-primary hover:text-white transition-colors text-[15px]">Giriş Yap</button>
                <button onClick={openRegister} className="hidden md:block px-5 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors text-[15px] clip-chamfer">Kayıt Ol</button>
              </>
            )}

            {user && (
              <div className="hidden md:block">
                <UserDropdown />
              </div>
            )}

            <button onClick={toggle} className="p-[10px] rounded-lg bg-gray-100 dark:bg-dark-800 text-gray-600 dark:text-text-light hover:bg-gray-200 dark:hover:bg-dark-700 transition-colors" aria-label="Tema değiştir">
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-[10px] rounded-lg bg-gray-100 dark:bg-dark-800 text-gray-600 dark:text-text-light" aria-label="Menü">
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-dark-700 py-4">
            {user && (
              <div className="flex items-center gap-3 px-2 py-3 mb-3 border-b border-gray-200 dark:border-dark-700">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="" className="w-[40px] h-[40px] rounded-full object-cover flex-shrink-0" />
                ) : (
                  <div className="w-[40px] h-[40px] rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-display font-bold text-[16px]">{initial}</span>
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-[14px] font-semibold text-dark-900 dark:text-text-light truncate">{displayName}</p>
                  {profile?.username && (
                    <p className="text-[12px] text-primary font-semibold truncate">@{profile.username}</p>
                  )}
                  <p className="text-[12px] text-gray-500 dark:text-text-muted truncate">{user.email}</p>
                </div>
              </div>
            )}

            <nav className="flex flex-col space-y-1">
              <a href="/" className="text-dark-900 dark:text-text-light hover:text-primary font-medium transition-colors text-[16px] px-2 py-[10px] rounded-lg hover:bg-gray-50 dark:hover:bg-dark-800" onClick={() => setMobileMenuOpen(false)}>Ana Sayfa</a>
              <a href="/marketplace" className="text-gray-600 dark:text-text-muted hover:text-primary font-medium transition-colors text-[16px] px-2 py-[10px] rounded-lg hover:bg-gray-50 dark:hover:bg-dark-800" onClick={() => setMobileMenuOpen(false)}>Hesap Pazarı</a>
              <a href="/requests" className="text-gray-600 dark:text-text-muted hover:text-primary font-medium transition-colors text-[16px] px-2 py-[10px] rounded-lg hover:bg-gray-50 dark:hover:bg-dark-800" onClick={() => setMobileMenuOpen(false)}>Talep Oluştur</a>
            </nav>

            {user && (
              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-dark-700">
                <nav className="flex flex-col space-y-1">
                  <a href="/profile" className="flex items-center gap-3 text-gray-600 dark:text-text-muted hover:text-primary font-medium transition-colors text-[15px] px-2 py-[10px] rounded-lg hover:bg-gray-50 dark:hover:bg-dark-800" onClick={() => setMobileMenuOpen(false)}>
                    <User size={18} /> Profilim
                  </a>
                  <a href="/wallet" className="flex items-center gap-3 text-gray-600 dark:text-text-muted hover:text-primary font-medium transition-colors text-[15px] px-2 py-[10px] rounded-lg hover:bg-gray-50 dark:hover:bg-dark-800" onClick={() => setMobileMenuOpen(false)}>
                    <Wallet size={18} />
                    <span className="flex-1">Cüzdanım</span>
                    <span className="font-display font-bold text-[12px] text-green-600 dark:text-green-400">{balance.toLocaleString('tr-TR')}₺</span>
                  </a>
                  <a href="/my-listings" className="flex items-center gap-3 text-gray-600 dark:text-text-muted hover:text-primary font-medium transition-colors text-[15px] px-2 py-[10px] rounded-lg hover:bg-gray-50 dark:hover:bg-dark-800" onClick={() => setMobileMenuOpen(false)}>
                    <LayoutGrid size={18} /> İlanlarım
                  </a>
                  <a href="/my-offers" className="flex items-center gap-3 text-gray-600 dark:text-text-muted hover:text-primary font-medium transition-colors text-[15px] px-2 py-[10px] rounded-lg hover:bg-gray-50 dark:hover:bg-dark-800" onClick={() => setMobileMenuOpen(false)}>
                    <Heart size={18} />
                    <span className="flex-1">Gelen Teklifler</span>
                    {pendingOffers > 0 && (
                      <span className="min-w-[20px] h-[20px] px-[6px] rounded-full bg-primary text-white text-[11px] font-bold flex items-center justify-center">{pendingOffers}</span>
                    )}
                  </a>
                  <a href="/favorites" className="flex items-center gap-3 text-gray-600 dark:text-text-muted hover:text-primary font-medium transition-colors text-[15px] px-2 py-[10px] rounded-lg hover:bg-gray-50 dark:hover:bg-dark-800" onClick={() => setMobileMenuOpen(false)}>
                    <Heart size={18} /> Favorilerim
                  </a>
                  <a href="/settings" className="flex items-center gap-3 text-gray-600 dark:text-text-muted hover:text-primary font-medium transition-colors text-[15px] px-2 py-[10px] rounded-lg hover:bg-gray-50 dark:hover:bg-dark-800" onClick={() => setMobileMenuOpen(false)}>
                    <Settings size={18} /> Ayarlar
                  </a>
                </nav>
                <button onClick={handleMobileSignOut} className="w-full flex items-center gap-3 mt-3 px-2 py-[10px] text-red-600 dark:text-red-400 font-medium text-[15px] rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                  <LogOut size={18} /> Çıkış Yap
                </button>
              </div>
            )}

            {!user && (
              <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-gray-200 dark:border-dark-700">
                <button onClick={() => { openLogin(); setMobileMenuOpen(false) }} className="w-full px-5 py-3 border-2 border-primary text-primary font-semibold rounded-lg hover:bg-primary hover:text-white transition-colors text-[15px]">Giriş Yap</button>
                <button onClick={() => { openRegister(); setMobileMenuOpen(false) }} className="w-full px-5 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors text-[15px] clip-chamfer">Kayıt Ol</button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  )
}