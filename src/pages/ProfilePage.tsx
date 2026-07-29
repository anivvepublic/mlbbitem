import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { useProfile } from '../hooks/useProfile'
import { ProfileIdentityCard } from '../components/profile/ProfileIdentityCard'
import { ProfileEditForm } from '../components/profile/ProfileEditForm'
import { ProfileBadges } from '../components/profile/ProfileBadges'
import { ActivityTimeline } from '../components/profile/ActivityTimeline'

export function ProfilePage() {
  const { user } = useAuth()
  const { profile, refresh } = useProfile()
  const [listingCount, setListingCount] = useState(0)
  const [favoriteCount, setFavoriteCount] = useState(0)

  useEffect(() => {
    if (!user) return
    let cancelled = false
    Promise.all([
      supabase.from('accounts').select('id', { count: 'exact', head: true }).eq('seller_id', user.id),
      supabase.from('favorites').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
    ]).then(([acc, fav]) => {
      if (cancelled) return
      setListingCount(acc.count || 0)
      setFavoriteCount(fav.count || 0)
    })
    return () => {
      cancelled = true
    }
  }, [user, profile])

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-[64px] text-center">
        <p className="text-gray-500 dark:text-text-muted">Profilini görmek için giriş yapmalısın.</p>
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Ambient üst */}
      <div
        className="absolute top-0 inset-x-0 h-[360px] pointer-events-none opacity-[0.10] dark:opacity-[0.16]"
        style={{ background: 'radial-gradient(60% 100% at 30% 0%, #FF6A1F 0%, transparent 70%)' }}
      />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-[28px] md:py-[40px]">
        <div className="grid grid-cols-1 lg:grid-cols-[330px_1fr] gap-[24px] lg:gap-[32px]">
          <ProfileIdentityCard
            profile={profile}
            email={user.email || ''}
            listingCount={listingCount}
            favoriteCount={favoriteCount}
          />

          <div className="space-y-[24px]">
            <ProfileEditForm profile={profile} onSaved={refresh} />
            <ProfileBadges profile={profile} listingCount={listingCount} />
            <ActivityTimeline />
          </div>
        </div>
      </div>
    </div>
  )
}