import { useState } from 'react'
import { Loader2, Send, CheckCircle2, AlertTriangle, Wallet } from 'lucide-react'
import { ModalBase } from '../../components/ui/ModalBase'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import type { Account } from '../../types'

interface MakeOfferModalProps {
  isOpen: boolean
  onClose: () => void
  account: Account | null
  balance: number
}

export function MakeOfferModal({ isOpen, onClose, account, balance }: MakeOfferModalProps) {
  const { user } = useAuth()
  const [amount, setAmount] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  if (!account) return null

  const numAmount = Number(amount)
  const lowOffer = numAmount > 0 && numAmount < account.price * 0.5

  const reset = () => {
    setAmount('')
    setMessage('')
    setError('')
    setSuccess(false)
    setLoading(false)
  }
  const handleClose = () => {
    reset()
    onClose()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    setError('')
    if (!numAmount || numAmount <= 0) {
      setError('Gecerli bir teklif tutari gir.')
      return
    }
    setLoading(true)
    const { error: insertError } = await supabase.from('offers').insert({
      account_id: account.id,
      buyer_id: user.id,
      amount: numAmount,
      message: message.trim() || null,
      status: 'pending',
    })
    setLoading(false)
    if (insertError) {
      setError('Teklif gonderilemedi: ' + insertError.message)
      return
    }
    setSuccess(true)
    window.dispatchEvent(new Event('mlbb-offers-changed'))
  }

  const inputClass =
    'w-full px-[12px] py-[12px] bg-white dark:bg-dark-700 border-2 border-gray-200 dark:border-dark-600 rounded-lg focus:border-primary focus:outline-none transition-colors text-[15px] text-dark-900 dark:text-text-light'

  return (
    <ModalBase isOpen={isOpen} onClose={handleClose} title="Teklif Ver">
      {success ? (
        <div className="text-center py-[12px]">
          <div className="w-[64px] h-[64px] rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-[16px]">
            <CheckCircle2 size={34} className="text-green-600 dark:text-green-400" />
          </div>
          <h3 className="font-display font-bold text-[20px] text-dark-900 dark:text-text-light mb-[8px]">
            Teklifin İletildi
          </h3>
          <p className="text-[14px] text-gray-500 dark:text-text-muted max-w-[300px] mx-auto mb-[20px] leading-relaxed">
            Satıcı teklifini incelediğinde sana dönüş yapacak. Kabul edilirse bakiyenle tamamlarsın.
          </p>
          <button
            onClick={handleClose}
            className="w-full px-[20px] py-[13px] bg-primary text-white font-display font-bold text-[15px] rounded-lg hover:bg-primary-dark transition-colors clip-chamfer"
          >
            Tamam
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-[16px]">
          <div className="bg-gray-50 dark:bg-dark-900/60 border border-gray-100 dark:border-dark-700 rounded-lg p-[12px] flex items-center gap-[12px]">
            {account.image_url ? (
              <img src={account.image_url} alt="" className="w-[48px] h-[48px] rounded-lg object-cover flex-shrink-0" />
            ) : (
              <div className="w-[48px] h-[48px] rounded-lg bg-gray-200 dark:bg-dark-700 flex-shrink-0" />
            )}
            <div className="min-w-0">
              <p className="text-[13px] font-semibold text-dark-900 dark:text-text-light truncate">{account.title}</p>
              <p className="text-[13px] text-primary font-display font-bold">
                İstenen: {account.price.toLocaleString('tr-TR')} ₺
              </p>
            </div>
          </div>

          {/* Bakiye bilgisi (bloke edilmez) */}
          <div className="flex items-center justify-between bg-blue-50 dark:bg-blue-900/15 border border-blue-200 dark:border-blue-800/50 rounded-lg px-[12px] py-[9px]">
            <span className="flex items-center gap-[7px] text-[12px] text-blue-700 dark:text-blue-300">
              <Wallet size={15} />
              Mevcut bakiyen
            </span>
            <span className="font-display font-bold text-[14px] text-blue-700 dark:text-blue-300">
              {balance.toLocaleString('tr-TR')} ₺
            </span>
          </div>

          <div>
            <label className="block text-[13px] font-semibold text-dark-900 dark:text-text-light mb-[6px]">
              Teklifin (₺)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min={1}
              placeholder="Örn: 4500"
              className={inputClass}
            />
            {lowOffer && (
              <p className="flex items-center gap-[5px] text-[12px] text-amber-600 dark:text-amber-400 mt-[6px]">
                <AlertTriangle size={13} />
                İstenen fiyatın yarısından düşük teklifler genelde reddedilir.
              </p>
            )}
          </div>

          <div>
            <label className="block text-[13px] font-semibold text-dark-900 dark:text-text-light mb-[6px]">
              Mesajın (opsiyonel)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              maxLength={300}
              placeholder="Satıcıya kısa bir not bırak..."
              className={inputClass + ' resize-none'}
            />
          </div>

          {error && (
            <div className="px-[14px] py-[11px] bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-[13px] text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full px-[20px] py-[13px] bg-primary text-white font-display font-bold text-[15px] rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 flex items-center justify-center gap-[8px] clip-chamfer"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Gönderiliyor...
              </>
            ) : (
              <>
                <Send size={18} />
                Teklifi Gönder
              </>
            )}
          </button>
          <p className="text-center text-[11px] text-gray-400 dark:text-text-muted">
            Teklif bir niyettir, bakiyen bu aşamada bloke edilmez.
          </p>
        </form>
      )}
    </ModalBase>
  )
}