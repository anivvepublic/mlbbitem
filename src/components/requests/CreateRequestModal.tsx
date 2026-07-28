import { useState } from 'react'
import { Loader2, MessageSquare, Phone } from 'lucide-react'
import { ModalBase } from '../ui/ModalBase'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import { RANK_GROUPS } from '../../lib/ranks'

interface CreateRequestModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

const ALL_RANKS = RANK_GROUPS.flatMap((g) => g.ranks)

export function CreateRequestModal({ isOpen, onClose, onSuccess }: CreateRequestModalProps) {
  const { user } = useAuth()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [wantedRank, setWantedRank] = useState('')
  const [minSkins, setMinSkins] = useState('')
  const [budgetMin, setBudgetMin] = useState('')
  const [budgetMax, setBudgetMax] = useState('')
  const [contactType, setContactType] = useState<'site' | 'whatsapp'>('site')
  const [contactInfo, setContactInfo] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setError('')

    if (title.trim().length < 5) {
      setError('Başlık en az 5 karakter olmalıdır.')
      return
    }
    const bMin = Number(budgetMin) || 0
    const bMax = Number(budgetMax) || 0
    if (bMax > 0 && bMin > bMax) {
      setError('Minimum bütçe, maksimum bütçeden büyük olamaz.')
      return
    }
    if (contactType === 'whatsapp' && contactInfo.trim().length < 10) {
      setError('WhatsApp için geçerli bir telefon numarası gir (örn: 905551234567).')
      return
    }

    setLoading(true)
    const { error: insertError } = await supabase.from('requests').insert({
      user_id: user.id,
      title: title.trim(),
      description: description.trim() || null,
      wanted_rank: wantedRank || null,
      min_skins: Number(minSkins) || 0,
      budget_min: bMin,
      budget_max: bMax,
      contact_type: contactType,
      contact_info: contactType === 'whatsapp' ? contactInfo.trim() : null,
      status: 'open',
    })
    setLoading(false)

    if (insertError) {
      setError('Talep oluşturulamadı: ' + insertError.message)
      return
    }

    // Formu sıfırla ve kapat
    setTitle('')
    setDescription('')
    setWantedRank('')
    setMinSkins('')
    setBudgetMin('')
    setBudgetMax('')
    setContactType('site')
    setContactInfo('')
    onSuccess()
    onClose()
  }

  const inputClass =
    'w-full px-[12px] py-[11px] bg-white dark:bg-dark-700 border-2 border-gray-200 dark:border-dark-600 rounded-lg focus:border-primary focus:outline-none transition-colors text-[14px] text-dark-900 dark:text-text-light'

  return (
    <ModalBase isOpen={isOpen} onClose={onClose} title="Talep Oluştur">
      <form onSubmit={handleSubmit} className="space-y-[16px]">
        {/* Başlık */}
        <div>
          <label className="block text-[13px] font-semibold text-dark-900 dark:text-text-light mb-[6px]">
            Aradığın Hesap Başlığı
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            maxLength={80}
            placeholder="Örn: Mythic Glory Chou hesabı arıyorum"
            className={inputClass}
          />
        </div>

        {/* Açıklama */}
        <div>
          <label className="block text-[13px] font-semibold text-dark-900 dark:text-text-light mb-[6px]">
            Detaylar (opsiyonel)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            maxLength={300}
            placeholder="Hangi skinler, hangi hero'lar, ne tür bir hesap arıyorsun?"
            className={inputClass + ' resize-none'}
          />
        </div>

        {/* Rank + Min Skin */}
        <div className="grid grid-cols-2 gap-[12px]">
          <div>
            <label className="block text-[13px] font-semibold text-dark-900 dark:text-text-light mb-[6px]">
              İstenen Rank
            </label>
            <select
              value={wantedRank}
              onChange={(e) => setWantedRank(e.target.value)}
              className={inputClass}
            >
              <option value="">Farketmez</option>
              {ALL_RANKS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[13px] font-semibold text-dark-900 dark:text-text-light mb-[6px]">
              Min. Skin
            </label>
            <input
              type="number"
              value={minSkins}
              onChange={(e) => setMinSkins(e.target.value)}
              min={0}
              max={500}
              placeholder="0"
              className={inputClass}
            />
          </div>
        </div>

        {/* Bütçe */}
        <div>
          <label className="block text-[13px] font-semibold text-dark-900 dark:text-text-light mb-[6px]">
            Bütçen (₺)
          </label>
          <div className="grid grid-cols-2 gap-[12px]">
            <input
              type="number"
              value={budgetMin}
              onChange={(e) => setBudgetMin(e.target.value)}
              min={0}
              placeholder="En az"
              className={inputClass}
            />
            <input
              type="number"
              value={budgetMax}
              onChange={(e) => setBudgetMax(e.target.value)}
              min={0}
              placeholder="En fazla"
              className={inputClass}
            />
          </div>
        </div>

        {/* İletişim tercihi */}
        <div>
          <label className="block text-[13px] font-semibold text-dark-900 dark:text-text-light mb-[6px]">
            Satıcılar Sana Nasıl Ulaşsın?
          </label>
          <div className="grid grid-cols-2 gap-[10px]">
            <button
              type="button"
              onClick={() => setContactType('site')}
              className={`flex items-center justify-center gap-[8px] px-[12px] py-[12px] rounded-lg border-2 transition-all text-[13px] font-semibold ${
                contactType === 'site'
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-gray-200 dark:border-dark-600 text-gray-500 dark:text-text-muted hover:border-gray-300'
              }`}
            >
              <MessageSquare size={16} />
              Site İçi
            </button>
            <button
              type="button"
              onClick={() => setContactType('whatsapp')}
              className={`flex items-center justify-center gap-[8px] px-[12px] py-[12px] rounded-lg border-2 transition-all text-[13px] font-semibold ${
                contactType === 'whatsapp'
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-gray-200 dark:border-dark-600 text-gray-500 dark:text-text-muted hover:border-gray-300'
              }`}
            >
              <Phone size={16} />
              WhatsApp
            </button>
          </div>
        </div>

        {/* WhatsApp numarası */}
        {contactType === 'whatsapp' && (
          <div>
            <label className="block text-[13px] font-semibold text-dark-900 dark:text-text-light mb-[6px]">
              WhatsApp Numaran
            </label>
            <input
              type="tel"
              value={contactInfo}
              onChange={(e) => setContactInfo(e.target.value)}
              placeholder="905551234567"
              className={inputClass}
            />
            <p className="text-[11px] text-gray-400 dark:text-text-muted mt-[4px]">
              Ülke koduyla birlikte yaz, başında + veya 0 olmadan.
            </p>
          </div>
        )}

        {/* Hata */}
        {error && (
          <div className="px-[14px] py-[11px] bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-[13px] text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Gönder */}
        <button
          type="submit"
          disabled={loading}
          className="w-full px-[20px] py-[13px] bg-primary text-white font-display font-bold text-[15px] rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 flex items-center justify-center gap-[8px] clip-chamfer"
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Yayınlanıyor...
            </>
          ) : (
            'Talebi Yayınla'
          )}
        </button>
      </form>
    </ModalBase>
  )
}