import { useState } from 'react'
import { Loader2, ShieldCheck, CheckCircle2, Lock, BadgeCheck } from 'lucide-react'
import { ModalBase } from '../../components/ui/ModalBase'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import type { Account } from '../../types'

interface BuyNowModalProps {
  isOpen: boolean
  onClose: () => void
  account: Account | null
}

export function BuyNowModal({ isOpen, onClose, account }: BuyNowModalProps) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  if (!account) return null

  const reset = () => {
    setError('')
    setSuccess(false)
    setLoading(false)
  }
  const handleClose = () => {
    reset()
    onClose()
  }

  const handleConfirm = async () => {
    if (!user) return
    setError('')
    setLoading(true)

    const { error: insertError } = await supabase.from('deals').insert({
      account_id: account.id,
      buyer_id: user.id,
      seller_id: account.seller_id,
      amount: account.price,
      status: 'pending_payment',
    })
    setLoading(false)

    if (insertError) {
      setError('Satın alma başlatılamadı: ' + insertError.message)
      return
    }
    setSuccess(true)
    window.dispatchEvent(new Event('mlbb-offers-changed'))
  }

  return (
    <ModalBase isOpen={isOpen} onClose={handleClose} title="Hemen Satın Al">
      {success ? (
        <div className="text-center py-[12px]">
          <div className="relative w-[72px] h-[72px] mx-auto mb-[18px] flex items-center justify-center">
            <span className="absolute inset-0 rounded-full bg-green-500/20 animate-ping" />
            <span className="relative w-[72px] h-[72px] rounded-full bg-green-500/10 flex items-center justify-center">
              <CheckCircle2 size={38} className="text-green-600 dark:text-green-400" />
            </span>
          </div>
          <h3 className="font-display font-bold text-[20px] text-dark-900 dark:text-text-light mb-[8px]">
            Satın Alma Talebin Oluşturuldu
          </h3>
          <p className="text-[14px] text-gray-500 dark:text-text-muted max-w-[320px] mx-auto mb-[20px] leading-relaxed">
            Satıcıya bildirim gitti. Ödeme ve hesap devir adımlarını "Satın Almalarım"
            bölümünden takip edebilirsin. Paran, güvenli aracılık kapsamında koruma altında.
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
          {/* İlan özeti */}
          <div className="bg-gray-50 dark:bg-dark-900/60 border border-gray-100 dark:border-dark-700 rounded-lg p-[12px] flex items-center gap-[12px]">
            {account.image_url ? (
              <img src={account.image_url} alt="" className="w-[52px] h-[52px] rounded-lg object-cover flex-shrink-0" />
            ) : (
              <div className="w-[52px] h-[52px] rounded-lg bg-gray-200 dark:bg-dark-700 flex-shrink-0" />
            )}
            <div className="min-w-0">
              <p className="text-[13px] font-semibold text-dark-900 dark:text-text-light truncate">
                {account.title}
              </p>
              <p className="text-[12px] text-gray-400 dark:text-text-muted">{account.rank}</p>
            </div>
          </div>

          {/* Fiyat bloğu */}
          <div className="relative bg-dark-900 rounded-xl px-[18px] py-[16px] overflow-hidden">
            <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-primary/20 blur-2xl" />
            <p className="text-[11px] uppercase tracking-[2px] text-text-muted mb-[4px] relative">
              Ödeyeceğin Tutar
            </p>
            <div className="flex items-baseline gap-[6px] relative">
              <span className="font-display font-bold text-[30px] text-white leading-none">
                {account.price.toLocaleString('tr-TR')}
              </span>
              <span className="font-display font-bold text-[18px] text-primary">₺</span>
            </div>
          </div>

          {/* Güven satırları */}
          <div className="space-y-[9px]">
            {[
              { icon: ShieldCheck, text: 'Ödeme, hesap sana teslim edilene kadar güvende.' },
              { icon: Lock, text: 'Hesap bilgileri devir anına kadar gizli kalır.' },
              { icon: BadgeCheck, text: 'Teslim sonrası 24 saat itiraz hakkın var.' },
            ].map((b) => (
              <div key={b.text} className="flex items-center gap-[10px]">
                <span className="w-[26px] h-[26px] flex-shrink-0 rounded-full bg-green-500/10 flex items-center justify-center">
                  <b.icon size={14} className="text-green-600 dark:text-green-400" />
                </span>
                <span className="text-[13px] text-gray-600 dark:text-text-muted leading-snug">
                  {b.text}
                </span>
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
            disabled={loading}
            className="w-full px-[20px] py-[14px] bg-primary text-white font-display font-bold text-[15px] rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 flex items-center justify-center gap-[8px] clip-chamfer"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                İşleniyor...
              </>
            ) : (
              <>
                <Lock size={17} />
                {account.price.toLocaleString('tr-TR')} ₺ ile Satın Al
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