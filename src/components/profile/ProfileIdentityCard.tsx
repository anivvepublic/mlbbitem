import { BadgeCheck, Calendar, LayoutGrid, Trophy, Heart, AtSign, Phone } from 'lucide-react'
import type { SellerProfile } from '../../types'

interface ProfileIdentityCardProps {
  profile: SellerProfile | null
  email: string
  listingCount: number
  favoriteCount: number
}

export function ProfileIdentityCard({
  profile,
  email,
  listingCount,
  favoriteCount,
}: ProfileIdentityCardProps) {
  const name = profile?.display_name || profile?.username || email.split('@')[0]
  const initial = name.charAt(0).toUpperCase()
  const verified = (profile?.completed_deals || 0) > 0

  const memberDays = profile?.created_at
    ? Math.floor((Date.now() - new Date(profile.created_at).getTime()) / (1000 * 60 * 60 * 24))
    : 0
  const memberLabel =
    memberDays < 1 ? 'Yeni üye' : memberDays < 30 ? `${memberDays} gündür üye` : `${Math.floor(memberDays / 30)} aydır üye`

  const stats = [
    { icon: LayoutGrid, label: 'İlan', value: listingCount },
    { icon: Trophy, label: 'İşlem', value: profile?.completed_deals || 0 },
    { icon: Heart, label: 'Favori', value: favoriteCount },
  ]

  return (
    <div className="lg:sticky lg:top-[100px]">
      <div className="relative bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-2xl overflow-hidden shadow-xl">
        {/* Üst ambient bant */}
        <div className="relative h-[88px] bg-dark-900 overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.14]"
            style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '18px 18px' }}
          />
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-40 h-40 rounded-full bg-primary/40 blur-3xl" />
        </div>

        <div className="px-[22px] pb-[22px] -mt-[44px] relative">
          {/* Avatar */}
          <div className="relative w-[88px] h-[88px] mb-[14px]">
            <div className="absolute inset-0 rounded-full bg-primary/30 blur-xl" />
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={name}
                className="relative w-[88px] h-[88px] rounded-full object-cover border-4 border-white dark:border-dark-800"
              />
            ) : (
              <span className="relative w-[88px] h-[88px] rounded-full bg-primary text-white font-display font-bold text-[34px] flex items-center justify-center border-4 border-white dark:border-dark-800">
                {initial}
              </span>
            )}
            {verified && (
              <span className="absolute bottom-[2px] right-[2px] w-[26px] h-[26px] rounded-full bg-green-500 border-[3px] border-white dark:border-dark-800 flex items-center justify-center">
                <BadgeCheck size={14} className="text-white" />
              </span>
            )}
          </div>

          {/* İsim */}
          <h2 className="font-display font-bold text-[24px] text-dark-900 dark:text-text-light leading-tight truncate">
            {name}
          </h2>

          {/* Kullanıcı adı */}
          {profile?.username && (
            <p className="flex items-center gap-[4px] text-[13px] font-semibold text-primary mt-[3px]">
              <AtSign size={13} />
              {profile.username}
            </p>
          )}

          {/* E-posta */}
          <p className="text-[13px] text-gray-500 dark:text-text-muted truncate mt-[4px]">{email}</p>

          {/* Telefon */}
          {profile?.phone && (
            <p className="flex items-center gap-[5px] text-[12px] text-gray-500 dark:text-text-muted mt-[6px]">
              <Phone size={12} />
              +{profile.phone}
            </p>
          )}

          {/* Üyelik */}
          <p className="flex items-center gap-[5px] text-[12px] text-gray-400 dark:text-text-muted mt-[6px]">
            <Calendar size={13} />
            {memberLabel}
          </p>

          {/* Bio */}
          {profile?.bio && (
            <p className="text-[13px] text-gray-600 dark:text-text-muted leading-relaxed mt-[14px] pt-[14px] border-t border-gray-100 dark:border-dark-700">
              {profile.bio}
            </p>
          )}

          {/* Mini istatistikler */}
          <div className="grid grid-cols-3 gap-[8px] mt-[18px]">
            {stats.map((s) => (
              <div
                key={s.label}
                className="bg-gray-50 dark:bg-dark-900/60 border border-gray-100 dark:border-dark-700 rounded-lg py-[12px] text-center"
              >
                <s.icon size={16} className="text-primary mx-auto mb-[5px]" />
                <p className="font-display font-bold text-[18px] text-dark-900 dark:text-text-light leading-none">
                  {s.value}
                </p>
                <p className="text-[10px] uppercase tracking-[1px] text-gray-400 dark:text-text-muted mt-[4px]">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}