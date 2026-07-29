import { Heart, ShieldCheck, Lock, Send, BadgeCheck, Wallet, Plus, CheckCircle2, AlertCircle } from 'lucide-react'
import type { Account, SellerProfile } from '../../types'

interface AccountPurchasePanelProps {
  account: Account
  seller?: SellerProfile | null
  balance: number
  isFavorite: boolean
  isOwn: boolean
  onToggleFavorite: () => void
  onMakeOffer: () => void
  onBuyNow: () => void
  onTopUp: () => void
}

export function AccountPurchasePanel({
  account,
  seller,
  balance,
  isFavorite,
  isOwn,
  onToggleFavorite,
  onMakeOffer,
  onBuyNow,
  onTopUp,
}: AccountPurchasePanelProps) {
  const sellerName = seller?.display_name || seller?.username || 'Satıcı'
  const sellerInitial = sellerName.charAt(0).toUpperCase()
  const enough = balance >= account.price
  const gap = account.price - balance

  return (
    <div className="bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-2xl overflow-hidden shadow-xl">
      {/* Fiyat başlığı + favori */}
      <div className="relative bg-dark-900 px-[22px] py-[20px] overflow-hidden">
        <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-primary/20 blur-2xl" />
        <button
          onClick={onToggleFavorite}
          className={`absolute top-[16px] right-[16px] w-[36px] h-[36px] rounded-full flex items-center justify-center transition-all active:scale-90 ${
            isFavorite ? 'bg-red-500 text-white' : 'bg-white/10 text-white/80 hover:bg-white/20'
          }`}
          aria-label="Favorilere ekle"
        >
          <Heart size={17} fill={isFavorite ? 'currentColor' : 'none'} strokeWidth={2.5} />
        </button>
        <p className="text-[12px] uppercase tracking-[2px] text-text-muted mb-[6px] relative">
          İstenen Fiyat
        </p>
        <div className="flex items-baseline gap-[6px] relative">
          <span className="font-display font-bold text-[34px] text-white leading-none">
            {account.price.toLocaleString('tr-TR')}
          </span>
          <span className="font-display font-bold text-[20px] text-primary">₺</span>
        </div>
      </div>

      <div className="p-[20px] space-y-[14px]">
        {/* Bakiye satırı */}
        <div className="bg-gray-50 dark:bg-dark-900/60 border border-gray-100 dark:border-dark-700 rounded-lg px-[12px] py-[10px]">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-[7px] text-[12px] text-gray-500 dark:text-text-muted">
              <Wallet size={15} />
              Cüzdan Bakiyen
            </span>
            <button
              onClick={onTopUp}
              className="flex items-center gap-[4px] text-[12px] font-semibold text-primary hover:underline"
            >
              <Plus size={13} />
              Yükle
            </button>
          </div>
          <div className="flex items-center justify-between mt-[6px]">
            <span className="font-display font-bold text-[18px] text-dark-900 dark:text-text-light">
              {balance.toLocaleString('tr-TR')} ₺
            </span>
            {isOwn ? (
              <span className="text-[11px] text-gray-400 dark:text-text-muted">Kendi ilanın</span>
            ) : enough ? (
              <span className="flex items-center gap-[4px] text-[11px] font-semibold text-green-600 dark:text-green-400">
                <CheckCircle2 size={13} />
                Bakiyen yeterli
              </span>
            ) : (
              <span className="flex items-center gap-[4px] text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                <AlertCircle size={13} />
                {gap.toLocaleString('tr-TR')} ₺ daha
              </span>
            )}
          </div>
        </div>

        {/* İki ana buton */}
        <div className="flex items-stretch gap-[8px]">
          <button
            onClick={onBuyNow}
            disabled={isOwn}
            className="flex-1 flex items-center justify-center gap-[7px] px-[12px] py-[14px] bg-primary text-white font-display font-bold text-[14px] rounded-lg hover:bg-primary-dark hover:gap-[10px] transition-all disabled:opacity-40 disabled:cursor-not-allowed clip-chamfer"
          >
            <Wallet size={17} />
            Satın Al
          </button>
          <button
            onClick={onMakeOffer}
            disabled={isOwn}
            className="flex-1 flex items-center justify-center gap-[7px] px-[12px] py-[14px] border-2 border-primary text-primary font-display font-bold text-[14px] rounded-lg hover:bg-primary/10 transition-all disabled:opacity-40 disabled:cursor-not-allowed clip-chamfer"
          >
            <Send size={16} />
            Teklif Ver
          </button>
        </div>

        {/* Güven rozetleri */}
        <div className="space-y-[9px] pt-[2px]">
          {[
            { icon: ShieldCheck, text: 'Ödeme emanet hesapta korunur' },
            { icon: Lock, text: 'Hesap devrine kadar bilgiler gizli' },
            { icon: BadgeCheck, text: 'Teslim sonrası 24s itiraz hakkı' },
          ].map((b) => (
            <div key={b.text} className="flex items-center gap-[10px]">
              <span className="w-[26px] h-[26px] flex-shrink-0 rounded-full bg-green-500/10 flex items-center justify-center">
                <b.icon size={14} className="text-green-600 dark:text-green-400" />
              </span>
              <span className="text-[13px] text-gray-600 dark:text-text-muted leading-snug">{b.text}</span>
            </div>
          ))}
        </div>

        {/* Satıcı mini kart */}
        <div className="pt-[14px] border-t border-gray-100 dark:border-dark-700">
          <p className="text-[11px] uppercase tracking-[1.5px] text-gray-400 dark:text-text-muted mb-[10px]">
            Satıcı
          </p>
          <div className="flex items-center gap-[12px]">
            {seller?.avatar_url ? (
              <img src={seller.avatar_url} alt="" className="w-[42px] h-[42px] rounded-full object-cover" />
            ) : (
              <span className="w-[42px] h-[42px] rounded-full bg-primary/20 text-primary font-display font-bold text-[17px] flex items-center justify-center">
                {sellerInitial}
              </span>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-[14px] font-semibold text-dark-900 dark:text-text-light truncate">{sellerName}</p>
              <p className="text-[12px] text-green-600 dark:text-green-400 flex items-center gap-[4px]">
                <BadgeCheck size={13} />
                {seller?.completed_deals || 0} başarılı işlem
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}