import { useInView } from '../../hooks/useInView'
import { Award, Flame, ShieldCheck, Star } from 'lucide-react'
import type { SellerProfile } from '../../types'

interface ProfileBadgesProps {
  profile: SellerProfile | null
  listingCount: number
}

interface Badge {
  icon: typeof Award
  label: string
  sub: string
  color: string
  glow: string
  earned: boolean
}

export function ProfileBadges({ profile, listingCount }: ProfileBadgesProps) {
  const { ref, inView } = useInView<HTMLDivElement>()
  const deals = profile?.completed_deals || 0

  const tier =
    deals >= 15
      ? { label: 'Altın Satıcı', color: '#FFD24A', glow: 'rgba(255,210,74,0.35)' }
      : deals >= 5
      ? { label: 'Gümüş Satıcı', color: '#D6DCE5', glow: 'rgba(214,220,229,0.3)' }
      : deals >= 1
      ? { label: 'Bronz Satıcı', color: '#E0915A', glow: 'rgba(224,145,90,0.3)' }
      : { label: 'Yeni Satıcı', color: '#9CA3AF', glow: 'rgba(156,163,175,0.25)' }

  const badges: Badge[] = [
    { icon: Award, label: tier.label, sub: `${deals} işlem`, color: tier.color, glow: tier.glow, earned: true },
    { icon: Flame, label: 'Aktif İlan', sub: listingCount > 0 ? `${listingCount} yayında` : 'İlan yok', color: '#FF6A1F', glow: 'rgba(255,106,31,0.3)', earned: listingCount > 0 },
    { icon: ShieldCheck, label: 'Doğrulanmış', sub: deals > 0 ? 'Kimlik onaylı' : 'Henüz değil', color: '#34D399', glow: 'rgba(52,211,153,0.3)', earned: deals > 0 },
    { icon: Star, label: 'Koleksiyoncu', sub: deals >= 10 ? '10+ işlem' : '10 işleme az kaldı', color: '#A78BFA', glow: 'rgba(167,139,250,0.3)', earned: deals >= 10 },
  ]

  return (
    <div
      ref={ref}
      className={`transition-all duration-500 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
    >
      <h3 className="font-display font-bold text-[17px] text-dark-900 dark:text-text-light mb-[14px] flex items-center gap-[8px]">
        <Award size={18} className="text-primary" />
        Rozetler
      </h3>
      <div className="flex gap-[10px] overflow-x-auto pb-[6px] scrollbar-hide -mx-[2px] px-[2px]">
        {badges.map((b, i) => (
          <div
            key={b.label}
            style={{ transitionDelay: `${i * 80}ms` }}
            className={`group relative flex-shrink-0 w-[132px] p-[14px] rounded-xl border transition-all duration-500 ${
              inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
            } ${
              b.earned
                ? 'bg-white dark:bg-dark-800 border-gray-200 dark:border-dark-700 hover:-translate-y-1 hover:shadow-lg'
                : 'bg-gray-50 dark:bg-dark-900/40 border-gray-100 dark:border-dark-700/60 opacity-60'
            }`}
          >
            {b.earned && (
              <div
                className="absolute -top-6 -right-6 w-16 h-16 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ backgroundColor: b.glow }}
              />
            )}
            <div
              className="relative w-[38px] h-[38px] rounded-lg flex items-center justify-center mb-[10px]"
              style={{ backgroundColor: b.earned ? b.glow : 'rgba(156,163,175,0.12)' }}
            >
              <b.icon size={19} style={{ color: b.earned ? b.color : '#9CA3AF' }} />
            </div>
            <p className="relative font-display font-bold text-[13px] text-dark-900 dark:text-text-light leading-tight">
              {b.label}
            </p>
            <p className="relative text-[11px] text-gray-400 dark:text-text-muted mt-[3px]">{b.sub}</p>
          </div>
        ))}
      </div>
    </div>
  )
}