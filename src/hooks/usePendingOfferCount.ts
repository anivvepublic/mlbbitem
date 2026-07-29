import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

// Satıcının ilanlarına gelen BEKLEYEN teklif sayısı.
// 'mlbb-offers-changed' olayını dinler -> kabul/ret sonrası menüdeki
// rozet kendi kendine tazelenir (sayfa değişmeden, canlı his).
export function usePendingOfferCount(): number {
  const { user } = useAuth()
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!user) {
      setCount(0)
      return
    }
    let cancelled = false

    async function run() {
      const { data: accs } = await supabase
        .from('accounts')
        .select('id')
        .eq('seller_id', user!.id)
      if (cancelled) return

      const ids = (accs || []).map((a) => a.id)
      if (ids.length === 0) {
        setCount(0)
        return
      }

      const { count: c } = await supabase
        .from('offers')
        .select('*', { count: 'exact', head: true })
        .in('account_id', ids)
        .eq('status', 'pending')
      if (!cancelled) setCount(c || 0)
    }

    run()
    window.addEventListener('mlbb-offers-changed', run)
    return () => {
      cancelled = true
      window.removeEventListener('mlbb-offers-changed', run)
    }
  }, [user])

  return count
}