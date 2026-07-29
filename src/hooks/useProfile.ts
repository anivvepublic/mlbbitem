import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import type { SellerProfile } from '../types'

// Giris yapan kullanicinin profil satirini cekip canli tutar.
// 'mlbb-profile-changed' olayini dinler -> profil kaydedilince
// Header, menu ve profil sayfasi kendi kendine tazelenir.
export function useProfile() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<SellerProfile | null>(null)

  const refresh = useCallback(async () => {
    if (!user) {
      setProfile(null)
      return
    }
    const { data } = await supabase
      .from('profiles')
      .select('id,username,display_name,avatar_url,completed_deals,created_at,bio,phone')
      .eq('id', user.id)
      .maybeSingle()
    setProfile(data)
  }, [user])

  useEffect(() => {
    refresh()
    window.addEventListener('mlbb-profile-changed', refresh)
    return () => window.removeEventListener('mlbb-profile-changed', refresh)
  }, [refresh])

  return { profile, refresh }
}