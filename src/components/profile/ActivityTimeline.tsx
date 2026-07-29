import { useEffect, useState } from 'react'
import { useInView } from '../../hooks/useInView'
import { Activity, Clock, Inbox } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'

interface ActivityItem {
  id: string
  kind: 'deal' | 'offer'
  title: string
  amount: number
  status: string
  created_at: string
}

const STATUS_DOT: Record<string, string> = {
  completed: 'bg-green-500',
  paid: 'bg-blue-500',
  transferred: 'bg-purple-500',
  pending_payment: 'bg-amber-500',
  accepted: 'bg-green-500',
  pending: 'bg-amber-500',
  rejected: 'bg-gray-400',
  cancelled: 'bg-gray-400',
}

export function ActivityTimeline() {
  const { user } = useAuth()
  const { ref, inView } = useInView<HTMLDivElement>()
  const [items, setItems] = useState<ActivityItem[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    async function run() {
      if (!user) return
      const [{ data: deals }, { data: offers }] = await Promise.all([
        supabase
          .from('deals')
          .select('id,amount,status,created_at,account:accounts(title)')
          .eq('seller_id', user.id)
          .order('created_at', { ascending: false })
          .limit(4),
        supabase
          .from('offers')
          .select('id,amount,status,created_at,account:accounts(title)')
          .eq('buyer_id', user.id)
          .order('created_at', { ascending: false })
          .limit(4),
      ])

      const merged: ActivityItem[] = [
        ...((deals as any[]) || []).map((d) => ({
          id: 'd-' + d.id,
          kind: 'deal' as const,
          title: d.account?.title || 'İlan',
          amount: d.amount,
          status: d.status,
          created_at: d.created_at,
        })),
        ...((offers as any[]) || []).map((o) => ({
          id: 'o-' + o.id,
          kind: 'offer' as const,
          title: o.account?.title || 'İlan',
          amount: o.amount,
          status: o.status,
          created_at: o.created_at,
        })),
      ]
        .sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at))
        .slice(0, 5)

      setItems(merged)
      setLoaded(true)
    }
    run()
  }, [user])

  const label = (it: ActivityItem) =>
    it.kind === 'deal' ? 'Satış' : it.status === 'accepted' ? 'Kabul edilen teklif' : 'Teklifin'

  return (
    <div
      ref={ref}
      className={`transition-all duration-500 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
    >
      <h3 className="font-display font-bold text-[17px] text-dark-900 dark:text-text-light mb-[14px] flex items-center gap-[8px]">
        <Activity size={18} className="text-primary" />
        Son Hareketlerin
      </h3>

      <div className="bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-xl overflow-hidden">
        {!loaded ? (
          <div className="p-[24px] text-center text-[13px] text-gray-400">Yükleniyor...</div>
        ) : items.length === 0 ? (
          <div className="p-[28px] text-center">
            <Inbox size={26} className="text-gray-300 dark:text-dark-600 mx-auto mb-[8px]" />
            <p className="text-[13px] text-gray-400 dark:text-text-muted">Henüz hareket yok.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-dark-700">
            {items.map((it) => {
              const d = new Date(it.created_at)
              const ago = Math.floor((Date.now() - d.getTime()) / (1000 * 60 * 60 * 24))
              const when = ago === 0 ? 'Bugün' : ago === 1 ? 'Dün' : `${ago} gün önce`
              return (
                <div key={it.id} className="flex items-center gap-[12px] px-[16px] py-[13px] hover:bg-gray-50 dark:hover:bg-dark-900/40 transition-colors">
                  <span className={`w-[9px] h-[9px] rounded-full flex-shrink-0 ${STATUS_DOT[it.status] || 'bg-gray-400'}`} />
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-semibold text-dark-900 dark:text-text-light truncate">
                      {label(it)}
                    </p>
                    <p className="text-[12px] text-gray-400 dark:text-text-muted truncate">{it.title}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-display font-bold text-[14px] text-primary leading-none">
                      {it.amount.toLocaleString('tr-TR')}₺
                    </p>
                    <p className="text-[11px] text-gray-400 dark:text-text-muted flex items-center justify-end gap-[3px] mt-[3px]">
                      <Clock size={10} />
                      {when}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}