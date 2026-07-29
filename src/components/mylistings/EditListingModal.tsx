import { useEffect, useState } from 'react'
import { Loader2, Save } from 'lucide-react'
import { ModalBase } from '../ui/ModalBase'
import { supabase } from '../../lib/supabase'
import { RANK_GROUPS } from '../../lib/ranks'
import type { Account } from '../../types'

interface EditListingModalProps {
  account: Account | null
  onClose: () => void
  onSaved: () => void
}

const SERVERS = ['Türkiye', 'Avrupa', 'Asya', 'MENA']
const ALL_RANKS = RANK_GROUPS.flatMap((g) => g.ranks)

export function EditListingModal({ account, onClose, onSaved }: EditListingModalProps) {
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')
  const [rank, setRank] = useState('')
  const [skins, setSkins] = useState('')
  const [heroes, setHeroes] = useState('')
  const [level, setLevel] = useState('')
  const [server, setServer] = useState('')
  const [desc, setDesc] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (account) {
      setTitle(account.title)
      setPrice(String(account.price))
      setRank(account.rank)
      setSkins(String(account.skins_count))
      setHeroes(String(account.hero_count || 0))
      setLevel(String(account.level || 0))
      setServer(account.server || 'Türkiye')
      setDesc(account.description || '')
      setError('')
    }
  }, [account])

  if (!account) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (title.trim().length < 4) {
      setError('Başlık en az 4 karakter olmalı.')
      return
    }
    setLoading(true)
    const { error: upErr } = await supabase
      .from('accounts')
      .update({
        title: title.trim(),
        price: Number(price) || 0,
        rank,
        skins_count: Number(skins) || 0,
        hero_count: Number(heroes) || 0,
        level: Number(level) || 0,
        server,
        description: desc.trim() || null,
      })
      .eq('id', account.id)
    setLoading(false)
    if (upErr) {
      setError('Güncellenemedi: ' + upErr.message)
      return
    }
    onSaved()
    onClose()
  }

  const inputClass =
    'w-full px-[12px] py-[11px] bg-white dark:bg-dark-700 border-2 border-gray-200 dark:border-dark-600 rounded-lg focus:border-primary focus:outline-none transition-colors text-[14px] text-dark-900 dark:text-text-light'

  return (
    <ModalBase isOpen={!!account} onClose={onClose} title="İlanı Düzenle">
      <form onSubmit={handleSubmit} className="space-y-[14px]">
        <div>
          <label className="block text-[12px] font-semibold uppercase tracking-[1px] text-gray-400 dark:text-text-muted mb-[6px]">Başlık</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={80} className={inputClass} />
        </div>

        <div className="grid grid-cols-2 gap-[12px]">
          <div>
            <label className="block text-[12px] font-semibold uppercase tracking-[1px] text-gray-400 dark:text-text-muted mb-[6px]">Fiyat (₺)</label>
            <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} min={0} className={inputClass} />
          </div>
          <div>
            <label className="block text-[12px] font-semibold uppercase tracking-[1px] text-gray-400 dark:text-text-muted mb-[6px]">Sunucu</label>
            <select value={server} onChange={(e) => setServer(e.target.value)} className={inputClass}>
              {SERVERS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-[12px] font-semibold uppercase tracking-[1px] text-gray-400 dark:text-text-muted mb-[6px]">Rank</label>
          <select value={rank} onChange={(e) => setRank(e.target.value)} className={inputClass}>
            {ALL_RANKS.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-3 gap-[10px]">
          <div>
            <label className="block text-[12px] font-semibold uppercase tracking-[1px] text-gray-400 dark:text-text-muted mb-[6px]">Skin</label>
            <input type="number" value={skins} onChange={(e) => setSkins(e.target.value)} min={0} className={inputClass} />
          </div>
          <div>
            <label className="block text-[12px] font-semibold uppercase tracking-[1px] text-gray-400 dark:text-text-muted mb-[6px]">Hero</label>
            <input type="number" value={heroes} onChange={(e) => setHeroes(e.target.value)} min={0} className={inputClass} />
          </div>
          <div>
            <label className="block text-[12px] font-semibold uppercase tracking-[1px] text-gray-400 dark:text-text-muted mb-[6px]">Seviye</label>
            <input type="number" value={level} onChange={(e) => setLevel(e.target.value)} min={0} className={inputClass} />
          </div>
        </div>

        <div>
          <label className="block text-[12px] font-semibold uppercase tracking-[1px] text-gray-400 dark:text-text-muted mb-[6px]">Açıklama</label>
          <textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={3} maxLength={500} className={inputClass + ' resize-none'} />
        </div>

        {error && (
          <div className="px-[14px] py-[11px] bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-[13px] text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-[8px] px-[20px] py-[13px] bg-primary text-white font-display font-bold text-[15px] rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 clip-chamfer"
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          {loading ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
        </button>
      </form>
    </ModalBase>
  )
}