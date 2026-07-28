import { SearchX, RotateCcw, Megaphone } from 'lucide-react'

interface EmptyMarketplaceProps {
  hasFilters: boolean
  onReset: () => void
}

export function EmptyMarketplace({ hasFilters, onReset }: EmptyMarketplaceProps) {
  return (
    <div className="col-span-full flex flex-col items-center text-center py-[48px] px-[20px]">
      <div
        className="w-[80px] h-[80px] bg-gray-50 dark:bg-dark-800 border border-gray-200 dark:border-dark-700 flex items-center justify-center mb-[20px]"
        style={{ clipPath: 'polygon(14px 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%, 0 14px)' }}
      >
        <SearchX size={34} className="text-gray-300 dark:text-dark-600" />
      </div>
      <h3 className="font-display font-bold text-[20px] text-dark-900 dark:text-text-light mb-[8px]">
        {hasFilters ? 'Aradığın kriterlere uygun hesap yok' : 'Henüz hiç ilan yok'}
      </h3>
      <p className="text-[14px] text-gray-500 dark:text-text-muted max-w-[340px] mb-[20px]">
        {hasFilters
          ? 'Filtreleri biraz gevşetmeyi veya aramayı değiştirmeyi dene.'
          : 'Pazar yeri dolmaya başlıyor, çok yakında efsane hesaplar burada olacak.'}
      </p>
      <div className="flex flex-col sm:flex-row items-center gap-[10px]">
        {hasFilters && (
          <button
            onClick={onReset}
            className="flex items-center gap-[6px] px-[18px] py-[10px] border-2 border-primary text-primary font-semibold rounded-lg hover:bg-primary hover:text-white transition-colors text-[14px] clip-chamfer"
          >
            <RotateCcw size={15} />
            Filtreleri Temizle
          </button>
        )}
        <a
          href="/requests"
          className="flex items-center gap-[6px] px-[18px] py-[10px] bg-dark-900 dark:bg-dark-700 text-white font-semibold rounded-lg hover:bg-dark-800 transition-colors text-[14px] clip-chamfer"
        >
          <Megaphone size={15} />
          Talep Oluştur
        </a>
      </div>
    </div>
  )
}