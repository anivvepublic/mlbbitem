import { useEffect, useRef, useState } from 'react'
import { Camera, Save, Loader2, CheckCircle2, User, AtSign, Phone, AlignLeft } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import type { SellerProfile } from '../../types'

interface ProfileEditFormProps {
  profile: SellerProfile | null
  onSaved: () => void
}

export function ProfileEditForm({ profile, onSaved }: ProfileEditFormProps) {
  const { user } = useAuth()
  const fileRef = useRef<HTMLInputElement>(null)
  const [displayName, setDisplayName] = useState('')
  const [username, setUsername] = useState('')
  const [phone, setPhone] = useState('')
  const [bio, setBio] = useState('')
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [toast, setToast] = useState('')

  // Profil (re)yu¨klendiginde formu gercek verilerle doldur.
  // Boylece sayfaya her giriste eski bilgiler satirlarda hazir durur.
  useEffect(() => {
    setDisplayName(profile?.display_name || '')
    setUsername(profile?.username || '')
    setPhone(profile?.phone || '')
    setBio(profile?.bio || '')
  }, [profile])

  const flash = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2600)
  }

  const broadcast = () => {
    // Header + menu + diger dinleyiciler tazelenir
    window.dispatchEvent(new Event('mlbb-profile-changed'))
  }

  const handleAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return
    setUploading(true)
    const ext = file.name.split('.').pop() || 'png'
    // DÜZELTİLDİ: yolun ilk parçası artık senin ID'n -> Storage kuralı izin verir
    const path = `${user.id}/avatar-${Date.now()}.${ext}`

    const { error: upErr } = await supabase.storage.from('mlbb-media').upload(path, file)
    if (upErr) {
      flash('Görsel yüklenemedi: ' + upErr.message)
      setUploading(false)
      return
    }
    const { data } = supabase.storage.from('mlbb-media').getPublicUrl(path)
    const { error: updErr } = await supabase
      .from('profiles')
      .update({ avatar_url: data.publicUrl })
      .eq('id', user.id)

    setUploading(false)
    if (updErr) {
      flash('Fotoğraf kaydedilemedi.')
      return
    }
    onSaved()
    broadcast()
    flash('Profil fotoğrafın güncellendi.')
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    setSaving(true)
    const { error } = await supabase
      .from('profiles')
      .update({
        display_name: displayName.trim() || null,
        username: username.trim() || null,
        phone: phone.trim() || null,
        bio: bio.trim() || null,
      })
      .eq('id', user.id)
    setSaving(false)
    if (error) {
      flash('Kaydedilemedi: ' + error.message)
      return
    }
    onSaved()
    broadcast()
    flash('Profilin güncellendi.')
  }

  const inputClass =
    'w-full pl-[40px] pr-[12px] py-[12px] bg-white dark:bg-dark-700 border-2 border-gray-200 dark:border-dark-600 rounded-lg focus:border-primary focus:outline-none transition-colors text-[14px] text-dark-900 dark:text-text-light'

  return (
    <form
      onSubmit={handleSave}
      className="bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-2xl p-[22px] md:p-[26px] shadow-lg"
    >
      <div className="flex items-center justify-between mb-[20px]">
        <h3 className="font-display font-bold text-[19px] text-dark-900 dark:text-text-light">
          Profili Düzenle
        </h3>
        {toast && (
          <span className="flex items-center gap-[6px] text-[12px] font-semibold text-green-600 dark:text-green-400">
            <CheckCircle2 size={14} />
            {toast}
          </span>
        )}
      </div>

      {/* Avatar değiştir */}
      <div className="flex items-center gap-[16px] mb-[22px] pb-[20px] border-b border-gray-100 dark:border-dark-700">
        <div className="relative group">
          {profile?.avatar_url ? (
            <img src={profile.avatar_url} alt="" className="w-[64px] h-[64px] rounded-full object-cover" />
          ) : (
            <span className="w-[64px] h-[64px] rounded-full bg-primary/20 text-primary font-display font-bold text-[24px] flex items-center justify-center">
              {(profile?.display_name || profile?.username || '?').charAt(0).toUpperCase()}
            </span>
          )}
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="absolute inset-0 rounded-full bg-black/55 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity disabled:opacity-100"
            aria-label="Fotoğraf değiştir"
          >
            {uploading ? <Loader2 size={20} className="animate-spin text-white" /> : <Camera size={20} className="text-white" />}
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatar} />
        </div>
        <div>
          <p className="text-[14px] font-semibold text-dark-900 dark:text-text-light">Profil Fotoğrafı</p>
          <p className="text-[12px] text-gray-400 dark:text-text-muted mt-[2px]">
            Kare görsel önerilir · PNG veya JPG
          </p>
        </div>
      </div>

      {/* Alanlar */}
      <div className="space-y-[16px]">
        <div>
          <label className="block text-[12px] font-semibold uppercase tracking-[1px] text-gray-400 dark:text-text-muted mb-[7px]">
            Görünen İsim
          </label>
          <div className="relative">
            <User size={17} className="absolute left-[13px] top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={displayName} onChange={(e) => setDisplayName(e.target.value)} maxLength={40} placeholder="Adın veya lakabın" className={inputClass} />
          </div>
        </div>

        <div>
          <label className="block text-[12px] font-semibold uppercase tracking-[1px] text-gray-400 dark:text-text-muted mb-[7px]">
            Kullanıcı Adı
          </label>
          <div className="relative">
            <AtSign size={17} className="absolute left-[13px] top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={username} onChange={(e) => setUsername(e.target.value)} maxLength={24} placeholder="benzersiz_kullanici_adi" className={inputClass} />
          </div>
        </div>

        <div>
          <label className="block text-[12px] font-semibold uppercase tracking-[1px] text-gray-400 dark:text-text-muted mb-[7px]">
            Telefon
          </label>
          <div className="relative">
            <Phone size={17} className="absolute left-[13px] top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={phone} onChange={(e) => setPhone(e.target.value)} maxLength={20} placeholder="905551234567" className={inputClass} />
          </div>
        </div>

        <div>
          <label className="block text-[12px] font-semibold uppercase tracking-[1px] text-gray-400 dark:text-text-muted mb-[7px]">
            Hakkımda
          </label>
          <div className="relative">
            <AlignLeft size={17} className="absolute left-[13px] top-[14px] text-gray-400" />
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              maxLength={180}
              placeholder="Kendini alıcılara tanıt..."
              className={inputClass + ' pl-[40px] resize-none'}
            />
          </div>
          <p className="text-[11px] text-gray-400 dark:text-text-muted mt-[5px] text-right">{bio.length}/180</p>
        </div>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="mt-[8px] w-full flex items-center justify-center gap-[8px] px-[20px] py-[13px] bg-primary text-white font-display font-bold text-[15px] rounded-lg hover:bg-primary-dark hover:gap-[12px] transition-all disabled:opacity-50 clip-chamfer"
      >
        {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
        {saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
      </button>
    </form>
  )
}