import { useState } from 'react'
import { AlertTriangle, Loader2, Trash2 } from 'lucide-react'
import { ModalBase } from '../ui/ModalBase'
import { supabase } from '../../lib/supabase'
import type { Account } from '../../types'

interface DeleteConfirmModalProps {
  account: Account | null
  onClose: () => void
  onDeleted: () => void
}

export function DeleteConfirmModal({ account, onClose, onDeleted }: DeleteConfirmModalProps) {
  const [loading, setLoading] = useState(false)

  if (!account) return null

  const handleDelete = async () => {
    setLoading(true)
    await supabase.from('accounts').delete().eq('id', account.id)
    setLoading(false)
    onDeleted()
    onClose()
  }

  return (
    <ModalBase isOpen={!!account} onClose={onClose} title="İlanı Sil">
      <div className="text-center">
        <div className="w-[60px] h-[60px] rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-[16px]">
          <AlertTriangle size={30} className="text-red-500" />
        </div>
        <p className="text-[15px] text-dark-900 dark:text-text-light mb-[6px]">
          Bu ilanı silmek istediğine emin misin?
        </p>
        <p className="text-[13px] text-gray-500 dark:text-text-muted mb-[6px]">
          “<span className="font-semibold text-dark-900 dark:text-text-light">{account.title}</span>”
        </p>
        <p className="text-[12px] text-gray-400 dark:text-text-muted mb-[22px]">
          Bu işlem geri alınamaz. İlan ve gelen teklifler kalıcı olarak silinir.
        </p>
        <div className="flex items-center gap-[10px]">
          <button
            onClick={onClose}
            className="flex-1 px-[16px] py-[12px] border-2 border-gray-200 dark:border-dark-600 text-gray-600 dark:text-text-muted font-display font-bold text-[14px] rounded-lg hover:border-gray-300 transition-colors clip-chamfer"
          >
            Vazgeç
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-[7px] px-[16px] py-[12px] bg-red-600 text-white font-display font-bold text-[14px] rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 clip-chamfer"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
            Sil
          </button>
        </div>
      </div>
    </ModalBase>
  )
}