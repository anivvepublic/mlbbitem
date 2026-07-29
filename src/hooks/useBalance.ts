import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

// Giris yapan kullanıcının cüzdan bakiyesi.
// 'mlbb-balance-changed' olayını dinler -> yükleme / satın alma sonrası
// menüdeki, paneldeki ve cüzdan sayfasındaki bakiye kendi kendine tazelenir.
export function useBalance() {
  const { user } = useAuth()
  const [balance, setBalance] = useState(0)

  const refresh = useCallback(async () => {
    if (!user) {
      setBalance(0)
      return
    }
    const { data } = await supabase
      .from('profiles')
      .select('balance')
      .eq('id', user.id)
      .maybeSingle()
    setBalance(data?.balance ?? 0)
  }, [user])

  useEffect(() => {
    refresh()
    window.addEventListener('mlbb-balance-changed', refresh)
    return () => window.removeEventListener('mlbb-balance-changed', refresh)
  }, [refresh])

  return { balance, refresh }
}