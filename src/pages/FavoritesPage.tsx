import { useEffect, useState } from 'react'
import { Heart, Loader2 } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { MarketplaceAccountCard } from '../components/marketplace/MarketplaceAccountCard'
import { SkeletonCard } from '../components/marketplace/SkeletonCard'
import { EmptyFavorites } from '../components/favorites/EmptyFavorites'
import type { Account, SellerProfile } from '../types'

export function FavoritesPage() {
  const { user } = useAuth()
  const [accounts, setAccounts] = useState<Account[]>([])
  const [sellers, setSellers] = useState<Record<string, SellerProfile>>({})
  const [loading, setLoading] = useState(true)

  // Favorileri ve ilgili verileri çek
  useEffect(() => {
    async function fetchFavorites() {
      if (!user) {
        setLoading(false)
        return
      }

      setLoading(true)

      // 1. Kullanıcının favori ID'lerini al
      const { data: favData, error: favError } = await supabase
        .from('favorites')
        .select('account_id')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (favError || !favData) {
        console.error('Favoriler yüklenirken hata:', favError)
        setLoading(false)
        return
      }

      const accountIds = favData.map((f) => f.account_id)

      // Favori yoksa erken çık
      if (accountIds.length === 0) {
        setAccounts([])
        setLoading(false)
        return
      }

      // 2. Hesap detaylarını al
      const { data: accData, error: accError } = await supabase
        .from('accounts')
        .select('*')
        .in('id', accountIds)
        .eq('status', 'active') // Sadece aktif ilanları göster

      if (accError || !accData) {
        console.error('Hesaplar yüklenirken hata:', accError)
        setLoading(false)
        return
      }

      setAccounts(accData)

      // 3. Satıcı profillerini al
      const sellerIds = Array.from(new Set(accData.map((a) => a.seller_id)))
      if (sellerIds.length > 0) {
        const { data: profData } = await supabase
          .from('profiles')
          .select('id, username, display_name, avatar_url')
          .in('id', sellerIds)

        if (profData) {
          const sellerMap: Record<string, SellerProfile> = {}
          profData.forEach((p) => {
            sellerMap[p.id] = p
          })
          setSellers(sellerMap)
        }
      }

      setLoading(false)
    }

    fetchFavorites()
  }, [user])

  // Favoriden çıkarma işlemi
  const handleRemoveFavorite = async (accountId: string) => {
    if (!user) return

    // Önce UI'dan kaldır (Optimistic update)
    setAccounts((prev) => prev.filter((a) => a.id !== accountId))

    // Supabase'den sil
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', user.id)
      .eq('account_id', accountId)

    if (error) {
      console.error('Favori silinirken hata:', error)
      // Hata olursa geri ekle (İsteğe bağlı, şu an basit tutuyoruz)
    }
  }

  // Giriş yapmamış kullanıcı durumu
  if (!user && !loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-[32px] md:py-[48px]">
        <EmptyFavorites isGuest={true} />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-[32px] md:py-[48px]">
      {/* Sayfa Başlığı */}
      <div className="mb-[32px] md:mb-[40px]">
        <div className="flex items-center gap-[12px] mb-[8px]">
          <div
            className="w-[40px] h-[40px] bg-primary/10 flex items-center justify-center"
            style={{ clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)' }}
          >
            <Heart size={20} className="text-primary" fill="currentColor" />
          </div>
          <h1 className="font-display font-bold text-[28px] md:text-[36px] text-dark-900 dark:text-text-light">
            Favorilerim
          </h1>
        </div>
        <p className="text-[14px] md:text-[15px] text-gray-500 dark:text-text-muted max-w-[500px]">
          Beğendiğin ve takip ettiğin hesaplar burada listeleniyor. Kalp ikonuna tekrar basarak favorilerden çıkarabilirsin.
        </p>
      </div>

      {/* İçerik Alanı */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-[12px] md:gap-[16px]">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : accounts.length === 0 ? (
        <div className="grid grid-cols-1">
          <EmptyFavorites isGuest={false} />
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-[12px] md:gap-[16px]">
          {accounts.map((account, index) => (
            <MarketplaceAccountCard
              key={account.id}
              account={account}
              seller={sellers[account.seller_id] || null}
              isFavorite={true} // Hepsi favori zaten
              isOwn={user?.id === account.seller_id}
              onToggleFavorite={handleRemoveFavorite}
              index={index}
            />
          ))}
        </div>
      )}
    </div>
  )
}