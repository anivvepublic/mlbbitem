import type { Account } from '../../types'

interface AccountCardProps {
  account: Account
}

export function AccountCard({ account }: AccountCardProps) {
  return (
    <div className="bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-video bg-gray-100 dark:bg-dark-900">
        {account.image_url ? (
          <img 
            src={account.image_url} 
            alt={account.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            Görsel Yok
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-display font-semibold text-lg text-dark-900 dark:text-text-light line-clamp-1">
            {account.title}
          </h3>
          <span className="bg-primary text-white text-xs font-bold px-2 py-1 rounded clip-chamfer">
            {account.rank}
          </span>
        </div>
        
        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-text-muted mb-3">
          <span>{account.skins_count} Skin</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-2xl font-display font-bold text-primary">
            ₺{account.price.toLocaleString('tr-TR')}
          </span>
          <button className="bg-primary text-white px-4 py-2 rounded font-semibold hover:bg-primary-dark transition-colors clip-chamfer">
            İncele
          </button>
        </div>
      </div>
    </div>
  )
}