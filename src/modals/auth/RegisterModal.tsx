import { useState } from 'react'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { ModalBase } from '../../components/ui/ModalBase'
import { signUpWithEmail, signInWithGoogle } from '../../lib/auth'

interface RegisterModalProps {
  isOpen: boolean
  onClose: () => void
  onSwitchToLogin: () => void
}

export function RegisterModal({ isOpen, onClose, onSwitchToLogin }: RegisterModalProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (password !== confirmPassword) {
      setError('Şifreler eşleşmiyor!')
      return
    }

    if (password.length < 6) {
      setError('Şifre en az 6 karakter olmalıdır!')
      return
    }

    setLoading(true)

    const { error } = await signUpWithEmail(email, password)
    
    if (error) {
      setError(error.message)
    } else {
      setSuccess('Kayıt başarılı! Giriş yapabilirsiniz.')
      setTimeout(() => {
        onSwitchToLogin()
      }, 2000)
    }
    
    setLoading(false)
  }

  const handleGoogleRegister = async () => {
    setError('')
    setLoading(true)
    
    const { error } = await signInWithGoogle()
    
    if (error) {
      setError(error.message)
    }
    
    setLoading(false)
  }

  return (
    <ModalBase isOpen={isOpen} onClose={onClose} title="Kayıt Ol">
      <div className="space-y-4">
        {/* Google ile Kayıt */}
        <button
          onClick={handleGoogleRegister}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white dark:bg-dark-700 border-2 border-gray-200 dark:border-dark-600 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-600 transition-colors disabled:opacity-50"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          <span className="font-medium text-[15px] text-dark-900 dark:text-text-light">
            Google ile Kayıt Ol
          </span>
        </button>

        {/* Ayırıcı */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200 dark:border-dark-700"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white dark:bg-dark-800 text-gray-500 dark:text-text-muted">
              veya
            </span>
          </div>
        </div>

        {/* Email Form */}
        <form onSubmit={handleEmailRegister} className="space-y-4">
          {/* Email Input */}
          <div>
            <label className="block text-[14px] font-medium text-dark-900 dark:text-text-light mb-2">
              E-posta
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-white dark:bg-dark-700 border-2 border-gray-200 dark:border-dark-600 rounded-lg focus:border-primary focus:outline-none transition-colors text-[15px] text-dark-900 dark:text-text-light"
              placeholder="ornek@email.com"
            />
          </div>

          {/* Şifre Input */}
          <div>
            <label className="block text-[14px] font-medium text-dark-900 dark:text-text-light mb-2">
              Şifre
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 pr-12 bg-white dark:bg-dark-700 border-2 border-gray-200 dark:border-dark-600 rounded-lg focus:border-primary focus:outline-none transition-colors text-[15px] text-dark-900 dark:text-text-light"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-500 dark:text-text-muted hover:text-primary transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Şifre Tekrar Input */}
          <div>
            <label className="block text-[14px] font-medium text-dark-900 dark:text-text-light mb-2">
              Şifre Tekrar
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-3 pr-12 bg-white dark:bg-dark-700 border-2 border-gray-200 dark:border-dark-600 rounded-lg focus:border-primary focus:outline-none transition-colors text-[15px] text-dark-900 dark:text-text-light"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-500 dark:text-text-muted hover:text-primary transition-colors"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Hata Mesajı */}
          {error && (
            <div className="px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-[13px] text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Başarı Mesajı */}
          {success && (
            <div className="px-4 py-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <p className="text-[13px] text-green-600 dark:text-green-400">{success}</p>
            </div>
          )}

          {/* Kayıt Butonu */}
          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 flex items-center justify-center gap-2 clip-chamfer"
          >
            {loading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                <span>Kayıt yapılıyor...</span>
              </>
            ) : (
              <span>Kayıt Ol</span>
            )}
          </button>
        </form>

        {/* Giriş Yap Linki */}
        <div className="text-center pt-2">
          <p className="text-[14px] text-gray-600 dark:text-text-muted">
            Zaten hesabın var mı?{' '}
            <button
              onClick={onSwitchToLogin}
              className="text-primary hover:text-primary-dark font-semibold transition-colors"
            >
              Giriş Yap
            </button>
          </p>
        </div>
      </div>
    </ModalBase>
  )
}