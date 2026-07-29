import { useState } from 'react'
import { Lock, Mail, Palette, Bell, AlertTriangle, CheckCircle2, Moon, Sun } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { SettingsSection } from '../components/settings/SettingsSection'
import { PasswordForm } from '../components/settings/PasswordForm'
import { DangerZone } from '../components/settings/DangerZone'

const NOTIF_KEYS = ['offers', 'deals', 'messages'] as const
type NotifKey = (typeof NOTIF_KEYS)[number]

export function SettingsPage() {
  const { user } = useAuth()
  const { isDark, toggle } = useTheme()
  const [emailMsg, setEmailMsg] = useState<{ ok: boolean; text: string } | null>(null)
  const [notifs, setNotifs] = useState<Record<NotifKey, boolean>>(() => {
    try {
      const raw = localStorage.getItem('mlbb-notifs')
      return raw ? JSON.parse(raw) : { offers: true, deals: true, messages: true }
    } catch {
      return { offers: true, deals: true, messages: true }
    }
  })

  const handleEmailReset = async () => {
    if (!user?.email) return
    setEmailMsg(null)
    const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
      redirectTo: window.location.origin + '/settings',
    })
    setEmailMsg(
      error
        ? { ok: false, text: error.message }
        : { ok: true, text: 'E-posta adresine bir sıfırlama bağlantısı gönderdik.' }
    )
  }

  const toggleNotif = (k: NotifKey) => {
    setNotifs((prev) => {
      const next = { ...prev, [k]: !prev[k] }
      localStorage.setItem('mlbb-notifs', JSON.stringify(next))
      return next
    })
  }

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-[64px] text-center">
        <p className="text-gray-500 dark:text-text-muted">Ayarları görmek için giriş yapmalısın.</p>
      </div>
    )
  }

  const notifMeta: Record<NotifKey, { label: string; desc: string }> = {
    offers: { label: 'Yeni teklifler', desc: 'İlanlarına teklif geldiğinde' },
    deals: { label: 'Satış hareketleri', desc: 'Satın alma ve devir adımlarında' },
    messages: { label: 'Mesajlar', desc: 'Site içi mesajlaşma aktif olunca' },
  }

  return (
    <div className="relative">
      <div
        className="absolute top-0 inset-x-0 h-[320px] pointer-events-none opacity-[0.10] dark:opacity-[0.16]"
        style={{ background: 'radial-gradient(60% 100% at 70% 0%, #FF6A1F 0%, transparent 70%)' }}
      />

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-[28px] md:py-[40px]">
        <h1 className="font-display font-bold text-[28px] md:text-[36px] text-dark-900 dark:text-text-light mb-[8px]">
          Ayarlar
        </h1>
        <p className="text-[14px] text-gray-500 dark:text-text-muted mb-[28px]">
          Hesabını, güvenliğini ve tercihlerini yönet.
        </p>

        <div className="space-y-[18px]">
          {/* E-posta */}
          <SettingsSection
            icon={Mail}
            title="E-posta Adresi"
            description="Giriş ve bildirimler için kullandığın adres."
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-[12px]">
              <div className="flex-1 px-[14px] py-[12px] bg-gray-50 dark:bg-dark-900/60 border border-gray-100 dark:border-dark-700 rounded-lg text-[14px] text-dark-900 dark:text-text-light truncate">
                {user.email}
              </div>
              <button
                onClick={handleEmailReset}
                className="px-[18px] py-[12px] border-2 border-gray-200 dark:border-dark-600 text-dark-900 dark:text-text-light font-display font-bold text-[14px] rounded-lg hover:border-primary hover:text-primary transition-colors clip-chamfer whitespace-nowrap"
              >
                Sıfırlama Maili
              </button>
            </div>
            {emailMsg && (
              <p className={`flex items-center gap-[6px] text-[13px] mt-[12px] ${emailMsg.ok ? 'text-green-600 dark:text-green-400' : 'text-red-500'}`}>
                {emailMsg.ok && <CheckCircle2 size={14} />}
                {emailMsg.text}
              </p>
            )}
          </SettingsSection>

          {/* Şifre */}
          <SettingsSection
            icon={Lock}
            title="Şifre"
            description="Hesabını korumak için güçlü bir şifre kullan."
          >
            <PasswordForm />
          </SettingsSection>

          {/* Görünüm */}
          <SettingsSection
            icon={Palette}
            title="Görünüm"
            description="Açık ve koyu tema arasında geçiş yap."
          >
            <button
              onClick={toggle}
              className="flex items-center gap-[12px] w-full sm:w-auto px-[16px] py-[12px] bg-gray-50 dark:bg-dark-900/60 border border-gray-100 dark:border-dark-700 rounded-lg hover:border-primary transition-colors"
            >
              <span className="w-[36px] h-[36px] rounded-full bg-primary/10 flex items-center justify-center">
                {isDark ? <Moon size={18} className="text-primary" /> : <Sun size={18} className="text-primary" />}
              </span>
              <div className="text-left">
                <p className="text-[14px] font-semibold text-dark-900 dark:text-text-light">
                  {isDark ? 'Koyu Tema' : 'Açık Tema'}
                </p>
                <p className="text-[12px] text-gray-400 dark:text-text-muted">Değiştirmek için tıkla</p>
              </div>
            </button>
          </SettingsSection>

          {/* Bildirimler */}
          <SettingsSection
            icon={Bell}
            title="Bildirim Tercihleri"
            description="Hangi durumlarda uyarı almak istediğini seç."
          >
            <div className="space-y-[10px]">
              {NOTIF_KEYS.map((k) => (
                <label
                  key={k}
                  className="flex items-center justify-between gap-[12px] px-[14px] py-[12px] bg-gray-50 dark:bg-dark-900/60 border border-gray-100 dark:border-dark-700 rounded-lg cursor-pointer hover:border-gray-300 dark:hover:border-dark-600 transition-colors"
                >
                  <div>
                    <p className="text-[14px] font-semibold text-dark-900 dark:text-text-light">{notifMeta[k].label}</p>
                    <p className="text-[12px] text-gray-400 dark:text-text-muted">{notifMeta[k].desc}</p>
                  </div>
                  <span
                    className={`relative w-[44px] h-[24px] rounded-full transition-colors flex-shrink-0 ${
                      notifs[k] ? 'bg-primary' : 'bg-gray-300 dark:bg-dark-600'
                    }`}
                  >
                    <span
                      className={`absolute top-[2px] w-[20px] h-[20px] rounded-full bg-white shadow transition-all ${
                        notifs[k] ? 'left-[22px]' : 'left-[2px]'
                      }`}
                    />
                  </span>
                  <input type="checkbox" checked={notifs[k]} onChange={() => toggleNotif(k)} className="sr-only" />
                </label>
              ))}
            </div>
          </SettingsSection>

          {/* Tehlikeli bölge */}
          <SettingsSection
            icon={AlertTriangle}
            title="Tehlikeli Bölge"
            description="Hesabını devre dışı bırakmak geri dönüşü zor bir işlemdir."
            danger
          >
            <DangerZone />
          </SettingsSection>
        </div>
      </div>
    </div>
  )
}