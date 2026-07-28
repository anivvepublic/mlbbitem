import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Account } from '../types'
import { AccountCard } from '../components/cards/AccountCard'
import { Button } from '../components/ui/Button'

// Slider için görsel listesi (Kendi görsellerini buraya ekledin)
const HERO_IMAGES = [
  '/images/hero-1.png',
  '/images/hero-2.png',
  '/images/hero-3.png',
  '/images/hero-4.png',
  '/images/hero-5.png',
]

export function HomePage() {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [loading, setLoading] = useState(true)
  
  // Slider State'leri
  const [currentSlide, setCurrentSlide] = useState(0)

  // Otomatik kaydırma efekti (Her 4 saniyede bir değişir)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_IMAGES.length)
    }, 4000) // 4000ms = 4 saniye

    return () => clearInterval(interval) // Sayfa kapanınca zamanlayıcıyı durdur
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
          setAccounts(data || [])
        }
      } catch (err) {
        console.error('Supabase bağlantı hatası:', err)
      }
      setLoading(false)
    }

    fetchAccounts()
  }, [])

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-white dark:bg-dark-900 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
            
            {/* Sol: Başlık ve Butonlar (Değişmedi) */}
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
                <Button size="lg" variant="primary">
                  İlan Ver
                </Button>
                <Button size="lg" variant="outline">
                  Hesap Bul
                </Button>
              </div>
            </div>

            {/* Sağ: Animasyonlu Görsel Slider */}
            <div className="relative z-10">
              <div className="relative aspect-[4/3] md:aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-dark-800 to-dark-900 shadow-2xl">
                
                {/* Görseller (Cross-fade animasyonu ile) */}
                {HERO_IMAGES.map((imgSrc, index) => (
                  <div
                    key={index}
                    className={`absolute inset-0 w-full h-full transition-all duration-1000 ease-in-out ${
                      index === currentSlide 
                        ? 'opacity-100 scale-100' 
                        : 'opacity-0 scale-105'
                    }`}
                  >
                    <img 
                      src={imgSrc} 
                      alt={`MLBB Hero Slide ${index + 1}`} 
                      className="w-full h-full object-cover"
                    />
                    {/* Görsel üzerine hafif karartma (yazı okunabilirliği için gerekirse, şu an kapalı) */}
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-900/40 to-transparent" />
                  </div>
                ))}

                {/* Slider İlerleme Çubuğu (Alt Kısım) */}
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-20">
                  {HERO_IMAGES.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        index === currentSlide 
                          ? 'w-8 bg-primary' 
                          : 'w-2 bg-white/40 hover:bg-white/70'
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
              
              {/* Dekoratif Arka Plan Parıltısı (Görselin arkasında) */}
              <div className="absolute -top-10 -right-10 w-64 h-64 bg-primary/20 rounded-full blur-3xl -z-10" />
              <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -z-10" />
            </div>

          </div>
        </div>
      </section>

      {/* Hesap Vitrini */}
      <section className="bg-gray-50 dark:bg-dark-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-display font-bold text-center text-dark-900 dark:text-text-light mb-12">
            VİTRİN İLANLARI
          </h2>
          
          {loading ? (
            <div className="text-center text-gray-600 dark:text-text-muted">Yükleniyor...</div>
          ) : accounts.length === 0 ? (
            <div className="text-center text-gray-600 dark:text-text-muted">Henüz ilan yok</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {accounts.map((account) => (
                <AccountCard key={account.id} account={account} />
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
              { step: '03', title: 'Güvenli Teslimat', desc: 'Aracılık sistemiyle güvenli işlem yap.' }
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