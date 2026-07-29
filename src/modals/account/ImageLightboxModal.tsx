import { useEffect } from 'react'
import { X } from 'lucide-react'

interface ImageLightboxModalProps {
  src: string | null
  alt: string
  open: boolean
  onClose: () => void
}

export function ImageLightboxModal({ src, alt, open, onClose }: ImageLightboxModalProps) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = 'unset'
    }
  }, [open, onClose])

  if (!open || !src) return null

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={onClose} />
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 w-[44px] h-[44px] rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
        aria-label="Kapat"
      >
        <X size={22} />
      </button>
      <img
        src={src}
        alt={alt}
        className="relative max-w-full max-h-[88vh] object-contain rounded-lg shadow-2xl"
      />
    </div>
  )
}