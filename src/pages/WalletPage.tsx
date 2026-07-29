import { useEffect, useState } from 'react'
import { Wallet, Plus, Loader2, ArrowUpFromLine, Receipt } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { useBalance } from '../hooks/useBalance'
import { TopUpModal } from '../modals/wallet/TopUpModal'
import type { TopUp } from '../types'

export function WalletPage() {
  const { user } = useAuth()
  const { balance } = useBalance()
  const [topUps, setTopUps] = useState<TopUp[]>([])
  const [loading, setLoading] = useState(true)
  const [topUpOpen, setTopUpOpen] = useState(false)

  useEffect(() => {
    async function run() {
      if (!user) {
        setLoading(false)
        return
      }
      const { data } = await supabase
        .from('topups')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      setTopUps(data || [])
      setLoading(false)
    }
    run()
  }, [user])

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-[64px] text-center">
        <p className="text-gray-500 dark:text-text-muted">Cüzdanını görmek için giriş yapmalısın.</p>
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Ambient */}
      <div
        className="absolute top-0 inset-x-0 h-[360px] pointer-events-none opacity-[0.10] dark:opacity-[0.16]"
        style={{ background: 'radial-gradient(60% 100% at 50% 0%, #FF6A1F 0%, transparent 70%)' }}
      />

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-[28px] md:py-[40px]">
        <h1 className="font-display font-bold text-[28px] md:text-[36px] text-dark-900 dark:text-text-light mb-[24px] flex items-center gap-[12px]">
          <span
            className="w-[42px] h-[42px] bg-primary/10 flex items-center justify-center"
            style={{ clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)' }}
          >
            <Wallet size={22} className="text-primary" />
          </span>
          Cüzdanım
        </h1>

        {/* Bakiye kartı */}
        <div className="relative bg-dark-900 rounded-2xl p-[28px] overflow-hidden mb-[28px] shadow-2xl">
          <div
            className="absolute inset-0 opacity-[0.12]"
            style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '20px 20px' }}
          />
          <div className="absolute -top-12 -right-12 w-44 h-44 rounded-full bg-primary/30 blur-3xl" />
          <div className="relative">
            <p className="text-[12px] uppercase tracking-[2px] text-text-muted mb-[8px]">Toplam Bakiye</p>
            <div className="flex items-baseline gap-[8px] mb-[20px]">
              <span className="font-display font-bold text-[44px] md:text-[52px] text-white leading-none">
                {balance.toLocaleString('tr-TR')}
              </span>
              <span className="font-display font-bold text-[24px] text-primary">₺</span>
            </div>
            <button
              onClick={() => setTopUpOpen(true)}
              className="flex items-center justify-center gap-[8px] px-[22px] py-[13px] bg-primary text-white font-display font-bold text-[15px] rounded-lg hover:bg-primary-dark hover:gap-[12px] transition-all clip-chamfer"
            >
              <Plus size={19} />
              Bakiye Yükle
            </button>
          </div>
        </div>

        {/* Yükleme geçmişi */}
        <div className="flex items-center gap-[8px] mb-[14px]">
          <Receipt size={18} className="text-gray-400 dark:text-text-muted" />
          <h2 className="font-display font-bold text-[18px] text-dark-900 dark:text-text-light">
            Yükleme Geçmişi
          </h2>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-[40px]">
            <Loader2 size={28} className="animate-spin text-primary" />
          </div>
        ) : topUps.length === 0 ? (
          <div className="bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-xl p-[32px] text-center">
            <div
              className="w-[56px] h-[56px] bg-gray-50 dark:bg-dark-900 border border-gray-200 dark:border-dark-700 flex items-center justify-center mx-auto mb-[14px]"
              style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}
            >
              <ArrowUpFromLine size={24} className="text-gray-300 dark:text-dark-600" />
            </div>
            <p className="text-[14px] text-gray-500 dark:text-text-muted mb-[16px]">Henüz bakiye yüklemedin.</p>
            <button
              onClick={() => setTopUpOpen(true)}
              className="inline-flex items-center gap-[6px] px-[18px] py-[10px] bg-primary text-white font-display font-bold text-[14px] rounded-lg hover:bg-primary-dark transition-colors clip-chamfer"
            >
              <Plus size={16} />
              İlk Yüklemeni Yap
            </button>
          </div>
        ) : (
          <div className="bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-xl overflow-hidden divide-y divide-gray-100 dark:divide-dark-700">
            {topUps.map((t) => {
              const d = new Date(t.created_at)
              const dateStr = d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
              return (
                <div key={t.id} className="flex items-center justify-between px-[16px] py-[14px]">
                  <div className="flex items-center gap-[12px]">
                    <span className="w-[36px] h-[36px] rounded-full bg-green-500/10 flex items-center justify-center">
                      <ArrowUpFromLine size={17} className="text-green-600 dark:text-green-400" />
                    </span>
                    <div>
                      <p className="text-[14px] font-semibold text-dark-900 dark:text-text-light">Bakiye Yüklemesi</p>
                      <p className="text-[12px] text-gray-400 dark:text-text-muted">{dateStr}</p>
                    </div>
                  </div>
                  <span className="font-display font-bold text-[16px] text-green-600 dark:text-green-400">
                    +{t.amount.toLocaleString('tr-TR')} ₺
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <TopUpModal isOpen={topUpOpen} onClose={() => setTopUpOpen(false)} currentBalance={balance} />
    </div>
  )
}