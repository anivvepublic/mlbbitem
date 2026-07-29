import { ZoomIn, Image as ImageIcon } from 'lucide-react'
import { RANK_TIER_COLOR } from '../../lib/ranks'
import type { Account } from '../../types'

interface AccountShowcaseProps {
  account: Account
  onZoom: () => void
}

export function AccountShowcase({ account, onZoom }: AccountShowcaseProps) {
  const tierColor = RANK_TIER_COLOR[account.rank] || '#FF6A1F'
  const shortId = account.id.replace(/-/g, '').slice(0, 6).toUpperCase()

  return (
    <div className="relative">
      {/* Rank rengine bağlı ambiyans parıltısı */}
      <div
        className="absolute -inset-4 opacity-25 blur-[90px] rounded-full pointer-events-none"
        style={{ backgroundColor: tierColor }}
      />

      <div className="relative group">
        {/* Ana görsel */}
        <div
          className="relative aspect-[16/10] md:aspect-[16/9] rounded-2xl overflow-hidden bg-dark-900 border border-gray-200 dark:border-dark-700 shadow-2xl"
          style={{ clipPath: 'polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)' }}
        >
          {account.image_url ? (
            <img
              src={account.image_url}
              alt={account.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-dark-800 to-dark-900">
              <ImageIcon size={48} className="text-dark-600 mb-2" />
              <span className="text-[13px] text-dark-600">Görsel eklenmemiş</span>
            </div>
          )}

          {/* Üst gradient */}
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/60 to-transparent" />
          {/* Alt gradient */}
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/80 to-transparent" />

          {/* Sol üst: SATILIK mühürü + ID */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span
              className="flex items-center gap-[6px] bg-dark-900/85 backdrop-blur-sm text-white text-[11px] font-bold px-[10px] py-[5px]"
              style={{ clipPath: 'polygon(5px 0, 100% 0, 100% calc(100% - 5px), calc(100% - 5px) 100%, 0 100%, 0 5px)' }}
            >
              <span className="relative flex w-[7px] h-[7px]">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-[7px] w-[7px] bg-green-500" />
              </span>
              SATILIK
            </span>
            <span className="bg-black/50 backdrop-blur-sm text-white/80 text-[11px] font-mono px-[8px] py-[5px] rounded">
              #MLB-{shortId}
            </span>
          </div>

          {/* Sağ üst: yakınlaştır */}
          <button
            onClick={onZoom}
            className="absolute top-4 right-4 w-[40px] h-[40px] rounded-full bg-black/50 backdrop-blur-sm text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-primary"
            aria-label="Görseli yakınlaştır"
          >
            <ZoomIn size={20} />
          </button>

          {/* Sol alt: rank plakası */}
          <div className="absolute bottom-4 left-4">
            <span
              className="inline-block text-white text-[13px] font-display font-bold px-[14px] py-[7px] shadow-lg"
              style={{
                backgroundColor: tierColor,
                clipPath: 'polygon(7px 0, 100% 0, 100% calc(100% - 7px), calc(100% - 7px) 100%, 0 100%, 0 7px)',
              }}
            >
              {account.rank}
            </span>
          </div>

          {/* Sağ alt: server */}
          {account.server && (
            <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm text-white/90 text-[12px] font-medium px-[10px] py-[6px] rounded">
              {account.server}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}