import { useInView } from '../../hooks/useInView'
import { ShieldCheck, BadgeCheck, RotateCcw, Lock } from 'lucide-react'

const ITEMS = [
  { icon: Lock, title: 'Emanet Hesap', text: 'Ödemen teslimata kadar bizde güvende.' },
  { icon: BadgeCheck, title: 'Doğrulanmış Satıcı', text: 'İşlem geçmişi kontrol edilmiş hesaplar.' },
  { icon: RotateCcw, title: 'İade Garantisi', text: 'Sorun çıkarsa paran iade edilir.' },
  { icon: ShieldCheck, title: '24s İtiraz Hakkı', text: 'Teslim sonrası inceleme penceresi.' },
]

export function TrustStrip() {
  const { ref, inView } = useInView<HTMLDivElement>()

  return (
    <div
      ref={ref}
      className={`transition-all duration-500 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-[10px]">
        {ITEMS.map((it, i) => (
          <div
            key={it.title}
            style={{ transitionDelay: `${i * 70}ms` }}
            className="group relative bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-xl p-[14px] overflow-hidden hover:border-primary/50 transition-colors"
          >
            <div className="absolute top-0 left-0 w-[3px] h-full bg-primary/0 group-hover:bg-primary transition-colors" />
            <it.icon size={20} className="text-primary mb-[8px]" />
            <p className="font-display font-bold text-[13px] text-dark-900 dark:text-text-light mb-[3px]">
              {it.title}
            </p>
            <p className="text-[11px] text-gray-500 dark:text-text-muted leading-snug">{it.text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}