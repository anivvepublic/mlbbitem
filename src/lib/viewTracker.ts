import { supabase } from './supabase'

// Oturum bazlı spam koruması:
// Aynı ilan, aynı sayfa oturumunda yalnızca bir kez sayılır.
// Kullanıcı aşağı-yukarı kaydırdıkça sayı şişmez.
// Sayfa yenilenince Set sıfırlanır, yeni oturum başlar.
const countedViews = new Set<string>()

export function trackView(accountId: string): void {
  // Bu oturumda zaten sayıldıysa geç
  if (countedViews.has(accountId)) return
  countedViews.add(accountId)

  // Fire-and-forget: UI'ı asla bloklamaz, kullanıcı kaydırmaya devam eder
  supabase
    .rpc('increment_view_count', { account_uuid: accountId })
    .then(({ error }) => {
      if (error) {
        console.error('Görüntülenme sayacı güncellenemedi:', error.message)
        // Hata olursa Set'ten çıkar, bir sonraki görünüşte tekrar dener
        countedViews.delete(accountId)
      }
    })
}