import { useInView } from '../../hooks/useInView'
import { FileText } from 'lucide-react'

interface AccountDescriptionProps {
  description: string | null
}

export function AccountDescription({ description }: AccountDescriptionProps) {
  const { ref, inView } = useInView<HTMLDivElement>()

  return (
    <div
      ref={ref}
      className={`transition-all duration-500 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
    >
      <div className="flex items-center gap-[10px] mb-[14px]">
        <span
          className="w-[32px] h-[32px] bg-primary/10 flex items-center justify-center"
          style={{ clipPath: 'polygon(5px 0, 100% 0, 100% calc(100% - 5px), calc(100% - 5px) 100%, 0 100%, 0 5px)' }}
        >
          <FileText size={16} className="text-primary" />
        </span>
        <h2 className="font-display font-bold text-[20px] text-dark-900 dark:text-text-light">
          Hesap Açıklaması
        </h2>
      </div>

      <div className="bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-xl p-[20px]">
        {description ? (
          <p className="text-[15px] leading-[1.8] text-gray-700 dark:text-text-muted whitespace-pre-line">
            {description}
          </p>
        ) : (
          <p className="text-[14px] text-gray-400 dark:text-text-muted italic">
            Satıcı bu ilan için açıklama eklememiş.
          </p>
        )}
      </div>
    </div>
  )
}