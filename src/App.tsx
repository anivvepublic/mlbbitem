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
                <Route path="/requests" element={<RequestsPage />} />
                <Route path="/my-listings" element={<MyListingsPage />} />
                <Route path="/profile" element={<div className="p-8 text-center">Profil Sayfası Yakında</div>} />
                <Route path="/favorites" element={<FavoritesPage />} />
                <Route path="/settings" element={<div className="p-8 text-center">Ayarlar Sayfası Yakında</div>} />
                <Route path="/create-listing" element={<div className="p-8 text-center">İlan Oluşturma Yakında</div>} />
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