import { useEffect } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

interface ImageLightboxModalProps {
  images: string[]
  index: number
  open: boolean
  onClose: () => void
  onNavigate: (next: number) => void
}

export function ImageLightboxModal({ images, index, open, onClose, onNavigate }: ImageLightboxModalProps) {
  const hasMany = images.length > 1

  const go = (dir: number) => {
    if (!hasMany) return
    const next = (index + dir + images.length) % images.length
    onNavigate(next)
  }

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') go(1)
      if (e.key === 'ArrowLeft') go(-1)
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = 'unset'
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, index, images.length])

  if (!open || images.length === 0) return null
  const src = images[index] || images[0]

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/92 backdrop-blur-md" onClick={onClose} />

      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-20 w-[44px] h-[44px] rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
        aria-label="Kapat"
      >
        <X size={22} />
      </button>

      {hasMany && (
        <>
          <button
            onClick={() => go(-1)}
            className="absolute left-3 md:left-6 z-20 w-[46px] h-[46px] rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-primary transition-colors"
            aria-label="Önceki"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={() => go(1)}
            className="absolute right-3 md:right-6 z-20 w-[46px] h-[46px] rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-primary transition-colors"
            aria-label="Sonraki"
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}

      <img
        key={src}
        src={src}
        alt=""
        className="relative max-w-full max-h-[82vh] object-contain rounded-lg shadow-2xl animate-[fadeIn_.25s_ease]"
      />

      {hasMany && (
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-[7px] bg-black/50 backdrop-blur-sm px-[12px] py-[8px] rounded-full">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => onNavigate(i)}
              className={`h-[7px] rounded-full transition-all duration-300 ${i === index ? 'w-6 bg-primary' : 'w-[7px] bg-white/40 hover:bg-white/70'}`}
              aria-label={`Görsel ${i + 1}`}
            />
          ))}
        </div>
      )}

      {hasMany && (
        <span className="absolute top-5 left-1/2 -translate-x-1/2 z-20 text-white/80 text-[12px] font-mono bg-black/40 px-[10px] py-[4px] rounded-full">
          {index + 1} / {images.length}
        </span>
      )}
    </div>
  )
}