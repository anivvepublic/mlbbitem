import { useState } from 'react'
import { Loader2, ShieldCheck, CheckCircle2, Lock, BadgeCheck, Wallet, Plus } from 'lucide-react'
import { ModalBase } from '../../components/ui/ModalBase'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import type { Account } from '../../types'

interface BuyNowModalProps {
  isOpen: boolean
  onClose: () => void
  account: Account | null
  balance: number // <-- EKLENDİ
}

const QUICK_TOPUP = [100, 250, 500, 1000]

export function BuyNowModal({ isOpen, onClose, account, balance }: BuyNowModalProps) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [toppingUp, setToppingUp] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  if (!account) return null

  const enough = balance >= account.price
  const gap = account.price - balance

  const reset = () => {
    setError('')
    setSuccess(false)
    setLoading(false)
    setToppingUp(false)
  }
  const handleClose = () => {
    reset()
    onClose()
  }

  const handleInlineTopUp = async (amount: number) => {
    if (!user) return
    setToppingUp(true)
    setError('')
    const { data, error: rpcError } = await supabase.rpc('topup_balance', {
      p_user_id: user.id,
      p_amount: amount,
    })
    setToppingUp(false)
    if (rpcError || !data?.ok) {
      setError(data?.error || rpcError?.message || 'Yukleme basarisiz.')
      return
    }
    window.dispatchEvent(new Event('mlbb-balance-changed'))
  }

  const handleConfirm = async () => {
    if (!user) return
    setError('')
    setLoading(true)
    const { data, error: rpcError } = await supabase.rpc('reserve_and_pay', {
      p_account_id: account.id,
      p_buyer_id: user.id,
    })
    setLoading(false)

    if (rpcError || !data?.ok) {
      setError(data?.error || rpcError?.message || 'Satin alma basarisiz.')
      return
    }
    setSuccess(true)
    window.dispatchEvent(new Event('mlbb-balance-changed'))
  }

  return (
    <ModalBase isOpen={isOpen} onClose={handleClose} title="Hemen Satın Al">
      {success ? (
        <div className="text-center py-[10px]">
          <div className="relative w-[72px] h-[72px] mx-auto mb-[18px] flex items-center justify-center">
            <span className="absolute inset-0 rounded-full bg-green-500/20 animate-ping" />
            <span className="relative w-[72px] h-[72px] rounded-full bg-green-500/10 flex items-center justify-center">
              <CheckCircle2 size={38} className="text-green-600 dark:text-green-400" />
            </span>
          </div>
          <h3 className="font-display font-bold text-[20px] text-dark-900 dark:text-text-light mb-[8px]">
            Satın Alma Başarılı
          </h3>
          <p className="text-[14px] text-gray-500 dark:text-text-muted max-w-[320px] mx-auto mb-[20px] leading-relaxed">
            {account.price.toLocaleString('tr-TR')} ₺ bakiyenden düşüldü ve emanet hesaba alındı.
            Satıcı hesabı devrettiğinde bilgiler sana açılacak. Süreci "Satın Almalarım" bölümünden takip et.
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
          <div className="bg-gray-50 dark:bg-dark-900/60 border border-gray-100 dark:border-dark-700 rounded-lg p-[12px] flex items-center gap-[12px]">
            {account.image_url ? (
              <img src={account.image_url} alt="" className="w-[52px] h-[52px] rounded-lg object-cover flex-shrink-0" />
            ) : (
              <div className="w-[52px] h-[52px] rounded-lg bg-gray-200 dark:bg-dark-700 flex-shrink-0" />
            )}
            <div className="min-w-0">
              <p className="text-[13px] font-semibold text-dark-900 dark:text-text-light truncate">{account.title}</p>
              <p className="text-[12px] text-gray-400 dark:text-text-muted">{account.rank}</p>
            </div>
          </div>

          <div className="relative bg-dark-900 rounded-xl px-[18px] py-[16px] overflow-hidden">
            <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-primary/20 blur-2xl" />
            <div className="relative flex items-center justify-between mb-[10px]">
              <span className="text-[12px] text-text-muted">Hesap fiyatı</span>
              <span className="font-display font-bold text-[16px] text-white">
                {account.price.toLocaleString('tr-TR')} ₺
              </span>
            </div>
            <div className="relative flex items-center justify-between mb-[12px]">
              <span className="flex items-center gap-[6px] text-[12px] text-text-muted">
                <Wallet size={14} />
                Bakiyen
              </span>
              <span className="font-display font-bold text-[16px] text-white">
                {balance.toLocaleString('tr-TR')} ₺
              </span>
            </div>
            <div className="relative h-[1px] bg-white/10 mb-[12px]" />
            <div className="relative flex items-center justify-between">
              <span className={`text-[13px] font-semibold flex items-center gap-[6px] ${enough ? 'text-green-400' : 'text-amber-400'}`}>
                {enough ? <CheckCircle2 size={15} /> : <Lock size={14} />}
                {enough ? 'Bakiyenden düşülecek' : `${gap.toLocaleString('tr-TR')} ₺ daha gerekli`}
              </span>
            </div>
          </div>

          {!enough && (
            <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/50 rounded-lg p-[12px]">
              <p className="text-[12px] font-semibold text-amber-700 dark:text-amber-300 mb-[8px]">
                Hızlıca bakiye yükle (test modu)
              </p>
              <div className="grid grid-cols-4 gap-[6px]">
                {QUICK_TOPUP.map((q) => (
                  <button
                    key={q}
                    onClick={() => handleInlineTopUp(q)}
                    disabled={toppingUp}
                    className="flex items-center justify-center gap-[3px] py-[9px] rounded-md bg-white dark:bg-dark-700 border border-amber-200 dark:border-dark-600 text-[12px] font-display font-bold text-amber-700 dark:text-amber-300 hover:border-amber-400 transition-colors disabled:opacity-50"
                  >
                    <Plus size={12} />
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-[8px]">
            {[
              { icon: ShieldCheck, text: 'Ödeme, hesap teslimine kadar emanette.' },
              { icon: BadgeCheck, text: 'Teslim sonrası 24 saat itiraz hakkın var.' },
            ].map((b) => (
              <div key={b.text} className="flex items-center gap-[10px]">
                <span className="w-[24px] h-[24px] flex-shrink-0 rounded-full bg-green-500/10 flex items-center justify-center">
                  <b.icon size={13} className="text-green-600 dark:text-green-400" />
                </span>
                <span className="text-[12px] text-gray-600 dark:text-text-muted leading-snug">{b.text}</span>
              </div>
            ))}
          </div>

          {error && (
            <div className="px-[14px] py-[11px] bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-[13px] text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          <button
            onClick={handleConfirm}
            disabled={loading || !enough}
            className="w-full px-[20px] py-[14px] bg-primary text-white font-display font-bold text-[15px] rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-[8px] clip-chamfer"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                İşleniyor...
              </>
            ) : (
              <>
                <Lock size={17} />
                {enough ? `${account.price.toLocaleString('tr-TR')} ₺ ile Satın Al` : 'Yetersiz Bakiye'}
              </>
            )}
          </button>
          <p className="text-center text-[11px] text-gray-400 dark:text-text-muted">
            Onaylayarak güvenli aracılık şartlarını kabul edersin.
          </p>
        </div>
      )}
    </ModalBase>
  )
}