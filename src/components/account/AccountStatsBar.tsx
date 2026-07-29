import { Trophy, Gem, Users, TrendingUp } from 'lucide-react'
import { useInView } from '../../hooks/useInView'
import type { Account } from '../../types'

interface AccountStatsBarProps {
  account: Account
}

export function AccountStatsBar({ account }: AccountStatsBarProps) {
  const { ref, inView } = useInView<HTMLDivElement>()

  const stats = [
    { icon: Trophy, label: 'Rank', value: account.rank, accent: false },
    { icon: Gem, label: 'Skin', value: String(account.skins_count || 0), accent: true },
    { icon: Users, label: 'Hero', value: String(account.hero_count || 0), accent: false },
    { icon: TrendingUp, label: 'Seviye', value: String(account.level || 0), accent: true },
  ]

  return (
    <div
      ref={ref}
      className={`grid grid-cols-2 md:grid-cols-4 gap-[10px] md:gap-[14px] transition-all duration-500 ${
        inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      {stats.map((s, i) => (
        <div
          key={s.label}
          style={{ transitionDelay: `${i * 70}ms` }}
          className="relative bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 p-[16px] overflow-hidden group hover:border-primary transition-colors"
        >
          {/* köşe vurgusu */}
          <div className="absolute top-0 right-0 w-0 h-0 border-t-[28px] border-t-primary/10 border-l-[28px] border-l-transparent group-hover:border-t-primary/25 transition-colors" />
          <s.icon size={20} className={s.accent ? 'text-primary mb-[10px]' : 'text-gray-400 dark:text-text-muted mb-[10px]'} />
          <p className="text-[11px] uppercase tracking-[1.5px] text-gray-400 dark:text-text-muted mb-[4px]">
            {s.label}
          </p>
          <p className="font-display font-bold text-[16px] md:text-[18px] text-dark-900 dark:text-text-light leading-tight truncate">
            {s.value}
          </p>
        </div>
      ))}
    </div>
  )
}