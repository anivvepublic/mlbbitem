import { useEffect, useState } from 'react'
import { LayoutGrid, Plus, Eye, Trash2, Pencil, Loader2 } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import type { Account } from '../types'

export function MyListingsPage() {
  const { user, loading: authLoading } = useAuth()
  const [listings, setListings] = useState<Account[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchMyListings() {
      if (!user) {
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('accounts')
        .select('*')
        .eq('seller_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('İlanlar yüklenirken hata:', error)
      } else {
        setListings(data || [])
      }
      setLoading(false)
    }

    fetchMyListings()
  }, [user])

  // Auth yükleniyorsa
  if (authLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 size={40} className="animate-spin text-primary" />
      </div>
    )
  }

  // Giriş yapmamışsa
  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <div className="w-[64px] h-[64px] rounded-full bg-gray-100 dark:bg-dark-800 flex items-center justify-center mb-4">
          <LayoutGrid size={28} className="text-gray-400" />
        </div>
        <h2 className="font-display font-bold text-[22px] text-dark-900 dark:text-text-light mb-2">
          Giriş Yapman Gerekiyor
        </h2>
        <p className="text-[15px] text-gray-600 dark:text-text-muted text-center max-w-[320px]">
          İlanlarını görüntülemek ve yönetmek için önce giriş yapmalısın.
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      
      {/* Sayfa Başlığı */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display font-bold text-[28px] md:text-[32px] text-dark-900 dark:text-text-light">
            İlanlarım
          </h1>
          <p className="text-[15px] text-gray-600 dark:text-text-muted mt-1">
            Tüm ilanlarını buradan yönetebilirsin.
          </p>
        </div>
        <a
          href="/create-listing"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors text-[15px] clip-chamfer"
        >
          <Plus size={20} />
          Yeni İlan Ekle
        </a>
      </div>

      {/* İstatistikler */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-lg p-4">
          <p className="text-[13px] text-gray-500 dark:text-text-muted mb-1">Toplam İlan</p>
          <p className="font-display font-bold text-[24px] text-dark-900 dark:text-text-light">
            {listings.length}
          </p>
        </div>
        <div className="bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-lg p-4">
          <p className="text-[13px] text-gray-500 dark:text-text-muted mb-1">Aktif</p>
          <p className="font-display font-bold text-[24px] text-green-600">
            {listings.filter(l => l.status === 'active').length}
          </p>
        </div>
        <div className="bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-lg p-4">
          <p className="text-[13px] text-gray-500 dark:text-text-muted mb-1">Satıldı</p>
          <p className="font-display font-bold text-[24px] text-primary">
            {listings.filter(l => l.status === 'sold').length}
          </p>
        </div>
        <div className="bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-lg p-4">
          <p className="text-[13px] text-gray-500 dark:text-text-muted mb-1">Beklemede</p>
          <p className="font-display font-bold text-[24px] text-yellow-600">
            {listings.filter(l => l.status === 'pending').length}
          </p>
        </div>
      </div>

      {/* İlan Listesi */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 size={32} className="animate-spin text-primary" />
        </div>
      ) : listings.length === 0 ? (
        /* Boş Durum */
        <div className="bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-lg p-8 md:p-12 text-center">
          <div className="w-[72px] h-[72px] rounded-full bg-gray-100 dark:bg-dark-700 flex items-center justify-center mx-auto mb-4">
            <LayoutGrid size={32} className="text-gray-400" />
          </div>
          <h3 className="font-display font-bold text-[20px] text-dark-900 dark:text-text-light mb-2">
            Henüz İlanın Yok
          </h3>
          <p className="text-[15px] text-gray-600 dark:text-text-muted max-w-[360px] mx-auto mb-6">
            İlk ilanını oluştur ve MLBBITEM ailesinde hesabını satmaya başla.
          </p>
          <a
            href="/create-listing"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors text-[15px] clip-chamfer"
          >
            <Plus size={20} />
            İlk İlanını Oluştur
          </a>
        </div>
      ) : (
        /* İlan Kartları */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <div 
              key={listing.id} 
              className="bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Görsel */}
              <div className="aspect-video bg-gray-100 dark:bg-dark-900 relative">
                {listing.image_url ? (
                  <img 
                    src={listing.image_url} 
                    alt={listing.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <LayoutGrid size={32} />
                  </div>
                )}
                {/* Durum Etiketi */}
                <div className="absolute top-3 left-3">
                  {listing.status === 'active' && (
                    <span className="px-3 py-1 bg-green-600 text-white text-[12px] font-semibold rounded-full">
                      Aktif
                    </span>
                  )}
                  {listing.status === 'sold' && (
                    <span className="px-3 py-1 bg-primary text-white text-[12px] font-semibold rounded-full">
                      Satıldı
                    </span>
                  )}
                  {listing.status === 'pending' && (
                    <span className="px-3 py-1 bg-yellow-500 text-white text-[12px] font-semibold rounded-full">
                      Beklemede
                    </span>
                  )}
                </div>
              </div>

              {/* İçerik */}
              <div className="p-4">
                <h3 className="font-display font-semibold text-[16px] text-dark-900 dark:text-text-light mb-1 line-clamp-1">
                  {listing.title}
                </h3>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[13px] text-gray-500 dark:text-text-muted">
                    {listing.rank} - {listing.skins_count} Skin
                  </span>
                  <span className="font-display font-bold text-[18px] text-primary">
                    {listing.price.toLocaleString('tr-TR')} TL
                  </span>
                </div>

                {/* Aksiyon Butonları */}
                <div className="flex items-center gap-2 pt-3 border-t border-gray-100 dark:border-dark-700">
                  <button className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-[13px] font-medium text-gray-600 dark:text-text-muted hover:text-primary hover:bg-gray-50 dark:hover:bg-dark-700 rounded-lg transition-colors">
                    <Eye size={16} />
                    Görüntüle
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-[13px] font-medium text-gray-600 dark:text-text-muted hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
                    <Pencil size={16} />
                    Düzenle
                  </button>
                  <button className="flex items-center justify-center gap-1 px-3 py-2 text-[13px] font-medium text-gray-600 dark:text-text-muted hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}