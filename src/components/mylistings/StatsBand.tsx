import { LayoutGrid, CheckCircle2, Power, Clock } from 'lucide-react'
import { useInView } from '../../hooks/useInView'
import { useCountUp } from '../../hooks/useCountUp'
import type { Account } from '../../types'

interface StatsBandProps {
  listings: Account[]
}

function StatTile({
  icon: Icon,
  label,
  value,
  color,
  delay,
  inView,
}: {
  icon: typeof LayoutGrid
  label: string
  value: number
  color: string
  delay: number
  inView: boolean
}) {
  const n = useCountUp(value, 1100, inView)
  return (
    <div
      style={{ transitionDelay: `${delay}ms` }}
      className={`group relative bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-xl p-[18px] overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-lg ${
        inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
      }`}
    >
      <div className="absolute top-0 right-0 w-0 h-0 border-t-[30px] border-l-[30px] border-l-transparent transition-colors" style={{ borderTopColor: color + '22' }} />
      <Icon size={20} style={{ color }} className="mb-[10px]" />
      <p className="font-display font-bold text-[28px] text-dark-900 dark:text-text-light leading-none">{n}</p>
      <p className="text-[11px] uppercase tracking-[1px] text-gray-400 dark:text-text-muted mt-[6px]">{label}</p>
    </div>
  )
}

export function StatsBand({ listings }: StatsBandProps) {
  const { ref, inView } = useInView<HTMLDivElement>()
  const active = listings.filter((l) => l.status === 'active').length
  const sold = listings.filter((l) => l.status === 'sold').length
  const disabled = listings.filter((l) => l.status === 'disabled' || l.status === 'pending').length

  return (
    <div ref={ref} className="grid grid-cols-2 md:grid-cols-4 gap-[12px] mb-[28px]">
      <StatTile icon={LayoutGrid} label="Toplam" value={listings.length} color="#FF6A1F" delay={0} inView={inView} />
      <StatTile icon={CheckCircle2} label="Aktif" value={active} color="#34D399" delay={80} inView={inView} />
      <StatTile icon={Power} label="Satıldı" value={sold} color="#35C7FF" delay={160} inView={inView} />
      <StatTile icon={Clock} label="Beklemede" value={disabled} color="#FBBF24" delay={240} inView={inView} />
    </div>
  )
}