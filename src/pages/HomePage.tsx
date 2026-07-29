import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { useAuthModal } from '../context/AuthModalContext'
import type { Account, SellerProfile } from '../types'
import { MarketplaceAccountCard } from '../components/marketplace/MarketplaceAccountCard'
import { Button } from '../components/ui/Button'

const HERO_IMAGES = [
  '/images/hero-1.png',
  '/images/hero-2.png',
  '/images/hero-3.png',
  '/images/hero-4.png',
  '/images/hero-5.png',
]

export function HomePage() {
  const { user } = useAuth()
  const { openLogin } = useAuthModal()
  const [accounts, setAccounts] = useState<Account[]>([])
  const [sellers, setSellers] = useState<Record<string, SellerProfile>>({})
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_IMAGES.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    async function fetchAccounts() {
      try {
        const { data, error } = await supabase
          .from('accounts')
          .select('*')
          .eq('status', 'active')
          .order('created_at', { ascending: false })
          .limit(6)

        if (error) {
          console.error('Hesaplar yüklenirken hata:', error)
        } else {
          const list = data || []
          setAccounts(list)
          const ids = Array.from(new Set(list.map((a) => a.seller_id)))
          if (ids.length) {
            const { data: prof } = await supabase
              .from('profiles')
              .select('id,username,display_name,avatar_url,completed_deals')
              .in('id', ids)
            if (prof) {
              const map: Record<string, SellerProfile> = {}
              prof.forEach((p) => {
                map[p.id] = p
              })
              setSellers(map)
            }
          }
        }
      } catch (err) {
        console.error('Supabase bağlantı hatası:', err)
      }
      setLoading(false)
    }
    fetchAccounts()
  }, [])

  useEffect(() => {
    if (!user) {
      setFavoriteIds(new Set())
      return
    }
    let cancelled = false
    supabase
      .from('favorites')
      .select('account_id')
      .eq('user_id', user.id)
      .then(({ data }) => {
        if (!cancelled) setFavoriteIds(new Set((data || []).map((f) => f.account_id)))
      })
    return () => {
      cancelled = true
    }
  }, [user])

  const toggleFavorite = (accountId: string) => {
    if (!user) {
      openLogin()
      return
    }
    const has = favoriteIds.has(accountId)
    if (has) {
      setFavoriteIds((prev) => {
        const next = new Set(prev)
        next.delete(accountId)
        return next
      })
      supabase.from('favorites').delete().eq('user_id', user.id).eq('account_id', accountId)
    } else {
      setFavoriteIds((prev) => new Set(prev).add(accountId))
      supabase.from('favorites').insert({ user_id: user.id, account_id: accountId })
    }
  }

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-white dark:bg-dark-900 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
            <div className="space-y-6 z-10">
              <div className="inline-block clip-chamfer bg-primary text-white px-4 py-2 text-sm font-display font-semibold">
                TÜRKİYE'NİN MLBB PAZARI
              </div>
              <h1 className="text-4xl lg:text-6xl font-display font-bold text-dark-900 dark:text-text-light leading-tight">
                HESABIN MI VAR?
                <br />
                <span className="text-primary">DEĞERİNDE SAT.</span>
              </h1>
              <p className="text-gray-600 dark:text-text-muted text-lg max-w-lg">
                Güvenli aracılık sistemiyle MLBB hesabını sat veya hayalindeki hesabı bul.
                Anlaşmazlık durumunda paran güvende.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="/marketplace">
                  <Button size="lg" variant="primary">İlan Ver</Button>
                </a>
                <a href="/marketplace">
                  <Button size="lg" variant="outline">Hesap Bul</Button>
                </a>
              </div>
            </div>

            <div className="relative z-10">
              <div className="relative aspect-[4/3] md:aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-dark-800 to-dark-900 shadow-2xl">
                {HERO_IMAGES.map((imgSrc, index) => (
                  <div
                    key={index}
                    className={`absolute inset-0 w-full h-full transition-all duration-1000 ease-in-out ${
                      index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                    }`}
                  >
                    <img src={imgSrc} alt={`MLBB Hero Slide ${index + 1}`} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-900/40 to-transparent" />
                  </div>
                ))}
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-20">
                  {HERO_IMAGES.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        index === currentSlide ? 'w-8 bg-primary' : 'w-2 bg-white/40 hover:bg-white/70'
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
              <div className="absolute -top-10 -right-10 w-64 h-64 bg-primary/20 rounded-full blur-3xl -z-10" />
              <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Vitrin — gerçek, tıklanabilir kartlar */}
      <section className="bg-gray-50 dark:bg-dark-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <h2 className="text-3xl font-display font-bold text-dark-900 dark:text-text-light">
              VİTRİN İLANLARI
            </h2>
            <a href="/marketplace" className="text-primary font-semibold text-[14px] hover:underline hidden sm:block">
              Tümünü gör →
            </a>
          </div>

          {loading ? (
            <div className="text-center text-gray-600 dark:text-text-muted py-12">Yükleniyor...</div>
          ) : accounts.length === 0 ? (
            <div className="text-center text-gray-600 dark:text-text-muted py-12">Henüz ilan yok</div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-[12px] md:gap-[16px]">
              {accounts.map((account, i) => (
                <MarketplaceAccountCard
                  key={account.id}
                  account={account}
                  seller={sellers[account.seller_id] || null}
                  isFavorite={favoriteIds.has(account.id)}
                  isOwn={!!user && user.id === account.seller_id}
                  onToggleFavorite={toggleFavorite}
                  index={i}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Nasıl Çalışır */}
      <section className="bg-white dark:bg-dark-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-display font-bold text-center text-dark-900 dark:text-text-light mb-12">
            NASIL ÇALIŞIR?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'İlan Oluştur', desc: 'Hesabının detaylarını gir, fiyatını belirle.' },
              { step: '02', title: 'Alıcı Bul', desc: 'İlanını gören alıcılarla iletişime geç.' },
              { step: '03', title: 'Güvenli Teslimat', desc: 'Aracılık sistemiyle güvenli işlem yap.' },
            ].map((item) => (
              <div key={item.step} className="bg-gray-50 dark:bg-dark-800 p-6 rounded-xl border border-gray-200 dark:border-dark-700">
                <div className="text-primary font-display font-bold text-4xl mb-4">{item.step}</div>
                <h3 className="text-xl font-semibold text-dark-900 dark:text-text-light mb-2">{item.title}</h3>
                <p className="text-gray-600 dark:text-text-muted">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}