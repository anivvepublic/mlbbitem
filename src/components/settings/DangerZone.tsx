import { useState } from 'react'
import { AlertTriangle, Loader2, Power } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'

export function DangerZone() {
  const { signOutUser } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)

  const confirm = async () => {
    setLoading(true)
    await supabase.rpc('deactivate_account')
    await signOutUser()
    setLoading(false)
    navigate('/')
  }

  return (
    <div>
      {step === 0 && (
        <button
          onClick={() => setStep(1)}
          className="flex items-center gap-[7px] px-[18px] py-[11px] border-2 border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 font-display font-bold text-[14px] rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors clip-chamfer"
        >
          <Power size={16} />
          Hesabımı Devre Dışı Bırak
        </button>
      )}

      {step === 1 && (
        <div className="bg-red-50 dark:bg-red-900/15 border border-red-200 dark:border-red-800/50 rounded-lg p-[16px]">
          <p className="flex items-start gap-[8px] text-[13px] text-red-700 dark:text-red-300 leading-relaxed mb-[14px]">
            <AlertTriangle size={16} className="flex-shrink-0 mt-[1px]" />
            Bu işlem tüm ilanlarını devre dışı bırakır, favorilerini ve tekliflerini siler, profil bilgilerini temizler.
            Kalıcı silme için destek ekibiyle iletişime geçmelisin.
          </p>
          <div className="flex items-center gap-[10px]">
            <button
              onClick={confirm}
              disabled={loading}
              className="flex items-center gap-[7px] px-[18px] py-[10px] bg-red-600 text-white font-display font-bold text-[14px] rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 clip-chamfer"
            >
              {loading ? <Loader2 size={15} className="animate-spin" /> : null}
              Evet, Devre Dışı Bırak
            </button>
            <button
              onClick={() => setStep(0)}
              className="px-[16px] py-[10px] text-[14px] font-semibold text-gray-500 hover:text-dark-900 dark:hover:text-text-light transition-colors"
            >
              Vazgeç
            </button>
          </div>
        </div>
      )}
    </div>
  )
}