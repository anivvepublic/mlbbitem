import { MessageCircle, PhoneCall, ExternalLink } from 'lucide-react'
import { ModalBase } from '../ui/ModalBase'
import type { AccountRequest, SellerProfile } from '../../types'

interface ContactRevealModalProps {
  request: AccountRequest | null
  owner?: SellerProfile | null
  onClose: () => void
}

export function ContactRevealModal({ request, owner, onClose }: ContactRevealModalProps) {
  if (!request) return null

  const ownerName = owner?.display_name || owner?.username || 'Kullanıcı'
  const cleanNumber = (request.contact_info || '').replace(/\D/g, '')
  const waLink = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(
    `Merhaba, MLBBITEM'de "${request.title}" talebini gördüm. Elimde uygun bir hesap var.`
  )}`

  return (
    <ModalBase isOpen={!!request} onClose={onClose} title="Satıcıyla İletişime Geç">
      <div className="text-center">
        {/* Talep özeti */}
        <div className="bg-gray-50 dark:bg-dark-900/60 border border-gray-100 dark:border-dark-700 rounded-lg p-[16px] mb-[20px] text-left">
          <p className="font-display font-bold text-[16px] text-dark-900 dark:text-text-light mb-[4px]">
            {request.title}
          </p>
          <p className="text-[13px] text-gray-500 dark:text-text-muted">
            Talep sahibi: <span className="font-semibold">{ownerName}</span>
          </p>
        </div>

        {request.contact_type === 'whatsapp' && request.contact_info ? (
          <>
            <div className="w-[56px] h-[56px] rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-[14px]">
              <MessageCircle size={26} className="text-green-600" />
            </div>
            <p className="text-[14px] text-gray-600 dark:text-text-muted mb-[18px]">
              Talep sahibi WhatsApp üzerinden iletişim istiyor. Hazır mesajla direkt yazabilirsin.
            </p>
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-[8px] px-[20px] py-[13px] bg-green-600 text-white font-display font-bold text-[15px] rounded-lg hover:bg-green-700 transition-colors clip-chamfer"
            >
              <PhoneCall size={18} />
              WhatsApp'tan Yaz
              <ExternalLink size={14} />
            </a>
          </>
        ) : (
          <>
            <div className="w-[56px] h-[56px] rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-[14px]">
              <MessageCircle size={26} className="text-primary" />
            </div>
            <p className="text-[14px] text-gray-600 dark:text-text-muted mb-[6px]">
              Talep sahibi site içi iletişim istiyor.
            </p>
            <p className="text-[13px] text-gray-400 dark:text-text-muted">
              Site içi mesajlaşma sistemi çok yakında aktif olacak.
            </p>
          </>
        )}
      </div>
    </ModalBase>
  )
}