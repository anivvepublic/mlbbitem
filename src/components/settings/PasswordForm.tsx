import { useState } from 'react'
import { Loader2, CheckCircle2, Eye, EyeOff } from 'lucide-react'
import { supabase } from '../../lib/supabase'

export function PasswordForm() {
  const [pw, setPw] = useState('')
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMsg(null)
    if (pw.length < 6) {
      setMsg({ ok: false, text: 'Şifre en az 6 karakter olmalı.' })
      return
    }
    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password: pw })
    setLoading(false)
    if (error) {
      setMsg({ ok: false, text: error.message })
      return
    }
    setPw('')
    setMsg({ ok: true, text: 'Şifren güncellendi.' })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-[12px]">
      <div className="relative max-w-[360px]">
        <input
          type={show ? 'text' : 'password'}
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          placeholder="Yeni şifre"
          className="w-full px-[12px] py-[12px] pr-[44px] bg-gray-50 dark:bg-dark-700 border-2 border-gray-200 dark:border-dark-600 rounded-lg focus:border-primary focus:outline-none transition-colors text-[14px] text-dark-900 dark:text-text-light"
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-[12px] top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors"
          aria-label="Göster/gizle"
        >
          {show ? <EyeOff size={17} /> : <Eye size={17} />}
        </button>
      </div>

      {msg && (
        <p className={`flex items-center gap-[6px] text-[13px] ${msg.ok ? 'text-green-600 dark:text-green-400' : 'text-red-500'}`}>
          {msg.ok && <CheckCircle2 size={14} />}
          {msg.text}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="flex items-center gap-[7px] px-[18px] py-[11px] bg-dark-900 dark:bg-dark-700 text-white font-display font-bold text-[14px] rounded-lg hover:bg-dark-800 transition-colors disabled:opacity-50 clip-chamfer"
      >
        {loading ? <Loader2 size={16} className="animate-spin" /> : null}
        Şifreyi Güncelle
      </button>
    </form>
  )
}