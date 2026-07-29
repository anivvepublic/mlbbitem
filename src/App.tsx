import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider } from './context/AuthContext'
import { AuthModalProvider } from './context/AuthModalContext'
import { Layout } from './components/layout/Layout'
import { HomePage } from './pages/HomePage'
import { MarketplacePage } from './pages/MarketplacePage'
import { MyListingsPage } from './pages/MyListingsPage'
import { FavoritesPage } from './pages/FavoritesPage'
import { RequestsPage } from './pages/RequestsPage'
import { MyOffersPage } from './pages/MyOffersPage'
import { WalletPage } from './pages/WalletPage'
import { ProfilePage } from './pages/ProfilePage'
import { SettingsPage } from './pages/SettingsPage'
import { AccountDetailPage } from './pages/AccountDetailPage'
import { CreateListingPage } from './pages/CreateListingPage'
import { LoginModal } from './modals/auth/LoginModal'
import { RegisterModal } from './modals/auth/RegisterModal'

function App() {
  const [loginOpen, setLoginOpen] = useState(false)
  const [registerOpen, setRegisterOpen] = useState(false)

  const openLogin = () => {
    setRegisterOpen(false)
    setLoginOpen(true)
  }
  const openRegister = () => {
    setLoginOpen(false)
    setRegisterOpen(true)
  }

  return (
    <ThemeProvider>
      <AuthProvider>
        <AuthModalProvider value={{ openLogin, openRegister }}>
          <BrowserRouter>
            <Layout>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/marketplace" element={<MarketplacePage />} />
                <Route path="/account/:id" element={<AccountDetailPage />} />
                <Route path="/requests" element={<RequestsPage />} />
                <Route path="/my-listings" element={<MyListingsPage />} />
                <Route path="/my-offers" element={<MyOffersPage />} />
                <Route path="/wallet" element={<WalletPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/favorites" element={<FavoritesPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/create-listing" element={<CreateListingPage />} />
              </Routes>
            </Layout>

            <LoginModal
              isOpen={loginOpen}
              onClose={() => setLoginOpen(false)}
              onSwitchToRegister={openRegister}
            />
            <RegisterModal
              isOpen={registerOpen}
              onClose={() => setRegisterOpen(false)}
              onSwitchToLogin={openLogin}
            />
          </BrowserRouter>
        </AuthModalProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App