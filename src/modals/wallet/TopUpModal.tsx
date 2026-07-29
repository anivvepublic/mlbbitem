import { useState } from 'react'
import { Loader2, CheckCircle2, Wallet, Plus, Info } from 'lucide-react'
import { ModalBase } from '../../components/ui/ModalBase'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'

interface TopUpModalProps {
  isOpen: boolean
  onClose: () => void
  currentBalance: number
}

const QUICK_AMOUNTS = [100, 250, 500, 1000]

export function TopUpModal({ isOpen, onClose, currentBalance }: TopUpModalProps) {
  const { user } = useAuth()
  const [selected, setSelected] = useState<number | null>(250)
  const [custom, setCustom] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState<number | null>(null)

  const amount = custom ? Number(custom) : selected || 0

  const reset = () => {
    setSelected(250)
    setCustom('')
    setError('')
    setSuccess(null)
    setLoading(false)
  }
  const handleClose = () => {
    reset()
    onClose()
  }

  const handleTopUp = async () => {
    if (!user) return
    setError('')
    if (!amount || amount <= 0) {
      setError('Gecerli bir tutar sec.')
      return
    }
    setLoading(true)
    const { data, error: rpcError } = await supabase.rpc('topup_balance', {
      p_user_id: user.id,
      p_amount: amount,
    })
    setLoading(false)

    if (rpcError || !data?.ok) {
      setError(data?.error || rpcError?.message || 'Yukleme basarisiz.')
      return
    }
    setSuccess(amount)
    window.dispatchEvent(new Event('mlbb-balance-changed'))
  }

  return (
    <ModalBase isOpen={isOpen} onClose={handleClose} title="Cüzdana Bakiye Yükle">
      {success !== null ? (
        <div className="text-center py-[10px]">
          <div className="relative w-[68px] h-[68px] mx-auto mb-[16px] flex items-center justify-center">
            <span className="absolute inset-0 rounded-full bg-green-500/20 animate-ping" />
            <span className="relative w-[68px] h-[68px] rounded-full bg-green-500/10 flex items-center justify-center">
              <CheckCircle2 size={36} className="text-green-600 dark:text-green-400" />
            </span>
          </div>
          <h3 className="font-display font-bold text-[20px] text-dark-900 dark:text-text-light mb-[6px]">
            {success.toLocaleString('tr-TR')} ₺ Yüklendi
          </h3>
          <p className="text-[14px] text-gray-500 dark:text-text-muted mb-[20px]">
            Yeni bakiyen:{' '}
            <span className="font-display font-bold text-primary">
              {(currentBalance + success).toLocaleString('tr-TR')} ₺
            </span>
          </p>
          <button
            onClick={handleClose}
            className="w-full px-[20px] py-[13px] bg-primary text-white font-display font-bold text-[15px] rounded-lg hover:bg-primary-dark transition-colors clip-chamfer"
          >
            Tamam
          </button>
        </div>
      ) : (
        <div className="space-y-[16px]">
          {/* Test modu notu */}
          <div className="flex items-start gap-[10px] bg-blue-50 dark:bg-blue-900/15 border border-blue-200 dark:border-blue-800/50 rounded-lg px-[12px] py-[10px]">
            <Info size={16} className="text-blue-500 flex-shrink-0 mt-[1px]" />
            <p className="text-[12px] text-blue-700 dark:text-blue-300 leading-snug">
              Ödeme altyapısı çok yakında. Şu an bakiye test amaçlı, anında ve ücretsiz eklenir.
            </p>
          </div>

          {/* Mevcut bakiye */}
          <div className="flex items-center justify-between bg-gray-50 dark:bg-dark-900/60 border border-gray-100 dark:border-dark-700 rounded-lg px-[14px] py-[12px]">
            <span className="flex items-center gap-[8px] text-[13px] text-gray-500 dark:text-text-muted">
              <Wallet size={16} />
              Mevcut bakiyen
            </span>
            <span className="font-display font-bold text-[16px] text-dark-900 dark:text-text-light">
              {currentBalance.toLocaleString('tr-TR')} ₺
            </span>
          </div>

          {/* Hızlı tutarlar */}
          <div>
            <label className="block text-[13px] font-semibold text-dark-900 dark:text-text-light mb-[8px]">
              Yükleme Tutarı
            </label>
            <div className="grid grid-cols-4 gap-[8px]">
              {QUICK_AMOUNTS.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => {
                    setSelected(q)
                    setCustom('')
                  }}
                  className={`py-[12px] rounded-lg border-2 font-display font-bold text-[14px] transition-all ${
                    selected === q && !custom
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-gray-200 dark:border-dark-600 text-gray-600 dark:text-text-muted hover:border-gray-300'
                  }`}
                >
                  {q}₺
                </button>
              ))}
            </div>
          </div>

          {/* Özel tutar */}
          <div className="relative">
            <input
              type="number"
              value={custom}
              onChange={(e) => {
                setCustom(e.target.value)
                setSelected(null)
              }}
              min={1}
              placeholder="Özel tutar gir"
              className="w-full px-[12px] py-[12px] pr-[34px] bg-white dark:bg-dark-700 border-2 border-gray-200 dark:border-dark-600 rounded-lg focus:border-primary focus:outline-none transition-colors text-[15px] text-dark-900 dark:text-text-light"
            />
            <span className="absolute right-[12px] top-1/2 -translate-y-1/2 text-[14px] text-gray-400">₺</span>
          </div>

          {error && (
            <div className="px-[14px] py-[11px] bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-[13px] text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          <button
            onClick={handleTopUp}
            disabled={loading}
            className="w-full px-[20px] py-[14px] bg-primary text-white font-display font-bold text-[15px] rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 flex items-center justify-center gap-[8px] clip-chamfer"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Yükleniyor...
              </>
            ) : (
              <>
                <Plus size={18} />
                {amount > 0 ? `${amount.toLocaleString('tr-TR')} ₺ Yükle` : 'Tutar Seç'}
              </>
            )}
          </button>
        </div>
      )}
    </ModalBase>
  )
}