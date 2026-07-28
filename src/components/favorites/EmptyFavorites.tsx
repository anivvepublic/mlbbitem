import { Heart, ArrowRight } from 'lucide-react'

interface EmptyFavoritesProps {
  isGuest: boolean
}

export function EmptyFavorites({ isGuest }: EmptyFavoritesProps) {
  return (
    <div className="col-span-full flex flex-col items-center text-center py-[64px] px-[20px]">
      {/* İkon Kutusu */}
      <div
        className="w-[80px] h-[80px] bg-gray-50 dark:bg-dark-800 border border-gray-200 dark:border-dark-700 flex items-center justify-center mb-[20px]"
        style={{ clipPath: 'polygon(14px 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%, 0 14px)' }}
      >
        <Heart size={34} className="text-gray-300 dark:text-dark-600" />
      </div>

      {/* Başlık ve Açıklama */}
      <h3 className="font-display font-bold text-[22px] md:text-[26px] text-dark-900 dark:text-text-light mb-[10px]">
        {isGuest ? 'Favorilerini Görmek İçin Giriş Yap' : 'Henüz Favorin Yok'}
      </h3>
      <p className="text-[14px] md:text-[15px] text-gray-500 dark:text-text-muted max-w-[380px] mb-[28px] leading-relaxed">
        {isGuest
          ? 'Beğendiğin hesapları kaydetmek ve kolayca takip etmek için hesabına giriş yapmalısın.'
          : 'Pazar yerindeki hesapların sağ üstündeki kalp ikonuna basarak onları buraya ekleyebilirsin.'}
      </p>

      {/* Buton */}
      {isGuest ? (
        <a
          href="/marketplace"
          className="flex items-center gap-[8px] px-[24px] py-[12px] bg-primary text-white font-display font-bold text-[15px] rounded-lg hover:bg-primary-dark transition-colors clip-chamfer"
        >
          Pazar Yerine Git
          <ArrowRight size={18} />
        </a>
      ) : (
        <a
          href="/marketplace"
          className="flex items-center gap-[8px] px-[24px] py-[12px] bg-dark-900 dark:bg-dark-700 text-white font-display font-bold text-[15px] rounded-lg hover:bg-dark-800 transition-colors clip-chamfer"
        >
          Hesap Keşfet
          <ArrowRight size={18} />
        </a>
      )}
    </div>
  )
}