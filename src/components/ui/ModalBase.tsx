import { useEffect } from 'react'
import { X } from 'lucide-react'

interface ModalBaseProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

export function ModalBase({ isOpen, onClose, title, children }: ModalBaseProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-white dark:bg-dark-800 rounded-lg shadow-2xl w-full max-w-[440px] max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-dark-800 border-b border-gray-200 dark:border-dark-700 px-6 py-4 flex items-center justify-between">
          <h2 className="font-display font-bold text-[20px] md:text-[24px] text-dark-900 dark:text-text-light">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
            aria-label="Kapat"
          >
            <X size={20} className="text-gray-600 dark:text-text-muted" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  )
}