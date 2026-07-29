import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Upload, Image as ImageIcon, Check, ChevronRight, ChevronLeft, Sparkles, Tag, Trophy,
  Gem, Users, TrendingUp, Globe, FileText, Loader2, CheckCircle2, Eye,
  ShieldCheck, Rocket, Info, X, Star, Plus, Trash2,
} from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { useAuthModal } from '../context/AuthModalContext'
import { useProfile } from '../hooks/useProfile'
import { RANK_GROUPS, RANK_TIER_COLOR } from '../lib/ranks'

const ALL_RANKS = RANK_GROUPS.flatMap((g) => g.ranks)
const SERVERS = ['Türkiye', 'Avrupa', 'Asya', 'MENA']
const MAX_IMAGES = 6
const STEPS = [
  { label: 'Temel', icon: FileText },
  { label: 'Hesap', icon: Trophy },
  { label: 'Görsel', icon: ImageIcon },
  { label: 'Fiyat', icon: Tag },
  { label: 'Önizleme', icon: Sparkles },
]

interface DraftImage {
  preview: string
  url: string | null
  uploading: boolean
}

function priceHint(rank: string): [number, number] | null {
  const r = rank.toLowerCase()
  if (r.includes('honor')) return [5000, 12000]
  if (r.includes('glory')) return [4000, 9000]
  if (r.includes('mythic')) return [2500, 6000]
  if (r.includes('grandmaster')) return [1800, 4000]
  if (r.includes('legend')) return [1000, 3000]
  if (r.includes('epic')) return [400, 1400]
  return [200, 900]
}

function StepShell({ stepKey, children }: { stepKey: number; children: React.ReactNode }) {
  const [entered, setEntered] = useState(false)
  useEffect(() => {
    setEntered(false)
    const r = requestAnimationFrame(() => setEntered(true))
    return () => cancelAnimationFrame(r)
  }, [stepKey])
  return (
    <div className={`transition-all duration-500 ${entered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}>
      {children}
    </div>
  )
}

export function CreateListingPage() {
  const { user, loading: authLoading } = useAuth()
  const { openLogin } = useAuthModal()
  const { profile } = useProfile()
  const navigate = useNavigate()
  const fileRef = useRef<HTMLInputElement>(null)

  const [step, setStep] = useState(0)
  const [done, setDone] = useState<string | null>(null)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [rank, setRank] = useState('')
  const [server, setServer] = useState('Türkiye')
  const [skins, setSkins] = useState('')
  const [heroes, setHeroes] = useState('')
  const [level, setLevel] = useState('')
  const [images, setImages] = useState<DraftImage[]>([])
  const [coverIndex, setCoverIndex] = useState(0)
  const [price, setPrice] = useState('')
  const [publishing, setPublishing] = useState(false)
  const [error, setError] = useState('')

  // LOGIN FIX: auth cozulmeden (loading) hicbir sey yapma.
  // openLogin dependency'de yok -> referans degisse bile tekrar tetiklemez.
  useEffect(() => {
    if (!authLoading && !user) openLogin()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, user])

  const ambient = rank ? RANK_TIER_COLOR[rank] || '#FF6A1F' : '#FF6A1F'
  const hint = rank ? priceHint(rank) : null

  // ---- Coklu gorsel yukleme ----
  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (!user || files.length === 0) return
    setError('')
    const slots = MAX_IMAGES - images.length
    const batch = files.slice(0, slots)
    if (files.length > slots) setError(`En fazla ${MAX_IMAGES} görsel. ${files.length - slots} tanesi eklendi.`)

    // Once hepsine aninda onizleme ekle (uploading)
    const placeholders: DraftImage[] = batch.map((f) => ({
      preview: URL.createObjectURL(f),
      url: null,
      uploading: true,
    }))
    const startIndex = images.length
    setImages((prev) => [...prev, ...placeholders])

    // Paralel yukle, bitince url'yi yerine yaz
    await Promise.all(
      batch.map(async (file, i) => {
        const ext = file.name.split('.').pop() || 'png'
        const path = `${user.id}/listing-${Date.now()}-${i}.${ext}`
        const { error: upErr } = await supabase.storage.from('mlbb-media').upload(path, file)
        if (upErr) {
          setImages((prev) => prev.filter((_, idx) => idx !== startIndex + i))
          return
        }
        const { data } = supabase.storage.from('mlbb-media').getPublicUrl(path)
        setImages((prev) =>
          prev.map((im, idx) => (idx === startIndex + i ? { ...im, url: data.publicUrl, uploading: false } : im))
        )
      })
    )
    e.target.value = ''
  }

  const removeImage = (i: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== i))
    setCoverIndex((c) => (c === i ? 0 : c > i ? c - 1 : c))
  }

  const allUploaded = images.every((im) => !im.uploading)
  const coverUrl = images[coverIndex]?.url || null

  // ---- Adim dogrulama ----
  const stepError = (): string => {
    if (step === 0 && title.trim().length < 4) return 'Başlık en az 4 karakter olmalı.'
    if (step === 1 && !rank) return 'Bir rank seçmelisin.'
    if (step === 2 && images.some((im) => im.uploading)) return 'Görseller yükleniyor, lütfen bekle.'
    if (step === 3 && (!Number(price) || Number(price) <= 0)) return 'Geçerli bir fiyat gir.'
    return ''
  }

  const next = () => {
    const e = stepError()
    if (e) {
      setError(e)
      return
    }
    setError('')
    setStep((s) => Math.min(s + 1, STEPS.length - 1))
  }
  const prev = () => {
    setError('')
    setStep((s) => Math.max(s - 1, 0))
  }

  const publish = async () => {
    if (!user) return
    setPublishing(true)
    setError('')
    const { data, error: insErr } = await supabase
      .from('accounts')
      .insert({
        title: title.trim(),
        description: description.trim() || null,
        rank,
        server,
        skins_count: Number(skins) || 0,
        hero_count: Number(heroes) || 0,
        level: Number(level) || 0,
        image_url: coverUrl, // kapak
        price: Number(price),
        seller_id: user.id,
        status: 'active',
        view_count: 0,
      })
      .select('id')
      .single()
    if (insErr || !data) {
      setError('İlan yayınlanamadı: ' + (insErr?.message || 'bilinmeyen hata'))
      setPublishing(false)
      return
    }
    // Galeri kaydi
    const uploaded = images.filter((im) => im.url)
    if (uploaded.length) {
      const rows = uploaded.map((im, i) => ({
        account_id: data.id,
        url: im.url!,
        position: i,
        is_cover: images.indexOf(im) === coverIndex,
      }))
      await supabase.from('account_images').insert(rows)
    }
    setPublishing(false)
    setDone(data.id)
  }

  // Fiyat gauge hesabi
  const numPrice = Number(price) || 0
  let gaugePct = 50
  let gaugeZone = ''
  let gaugeColor = '#9CA3AF'
  if (hint && numPrice > 0) {
    const [lo, hi] = hint
    if (numPrice < lo) {
      gaugePct = 4
      gaugeZone = 'Piyasanın altında — hızlı satılır ama değerinin altında kalabilir'
      gaugeColor = '#34D399'
    } else if (numPrice > hi) {
      gaugePct = 96
      gaugeZone = 'Piyasanın üstünde — alıcı ikna etmek zorlaşabilir'
      gaugeColor = '#FBBF24'
    } else {
      gaugePct = ((numPrice - lo) / (hi - lo)) * 88 + 6
      gaugeZone = 'İdeal aralıkta — rekabetçi ve adil'
      gaugeColor = '#FF6A1F'
    }
  }
  const quickPrices = hint ? [hint[0], Math.round(((hint[0] + hint[1]) / 2) / 50) * 50, hint[1]] : []

  // ---- Auth bekleniyor ----
  if (authLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 size={40} className="animate-spin text-primary" />
      </div>
    )
  }
  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-[64px] text-center">
        <p className="text-gray-500 dark:text-text-muted">İlan oluşturmak için giriş yapmalısın.</p>
      </div>
    )
  }

  // ---- BASARI ----
  if (done) {
    return (
      <div className="relative min-h-[70vh] flex items-center justify-center px-4">
        <div className="absolute inset-0 pointer-events-none opacity-[0.12] dark:opacity-[0.18]"
          style={{ background: 'radial-gradient(50% 60% at 50% 40%, #34D399 0%, transparent 70%)' }} />
        <div className="relative text-center max-w-[460px]">
          <div className="relative w-[96px] h-[96px] mx-auto mb-[24px] flex items-center justify-center">
            <span className="absolute inset-0 rounded-full bg-green-500/25 animate-ping" />
            <span className="relative w-[96px] h-[96px] rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center">
              <Rocket size={42} className="text-green-500" />
            </span>
          </div>
          <h1 className="font-display font-bold text-[30px] md:text-[40px] text-dark-900 dark:text-text-light leading-tight">
            İlanın Yayında!
          </h1>
          <p className="text-[15px] text-gray-500 dark:text-text-muted mt-[10px] leading-relaxed">
            “<span className="font-semibold text-dark-900 dark:text-text-light">{title}</span>” pazar yerine düştü.
            {images.length > 1 && ` ${images.length} görselle vitrinde.`}
          </p>
          <div className="flex flex-col sm:flex-row gap-[10px] justify-center mt-[28px]">
            <button
              onClick={() => navigate(`/account/${done}`)}
              className="flex items-center justify-center gap-[8px] px-[22px] py-[13px] bg-primary text-white font-display font-bold text-[15px] rounded-lg hover:bg-primary-dark hover:gap-[12px] transition-all clip-chamfer"
            >
              <Eye size={18} />
              İlanı Gör
            </button>
            <a
              href="/my-listings"
              className="flex items-center justify-center gap-[8px] px-[22px] py-[13px] border-2 border-gray-200 dark:border-dark-600 text-dark-900 dark:text-text-light font-display font-bold text-[15px] rounded-lg hover:border-primary hover:text-primary transition-colors clip-chamfer"
            >
              İlanlarım
            </a>
          </div>
        </div>
      </div>
    )
  }

  const sellerName = profile?.display_name || profile?.username || 'Sen'
  const sellerInitial = sellerName.charAt(0).toUpperCase()
  const previewCover = images[coverIndex]?.preview || images[coverIndex]?.url

  return (
    <div className="relative">
      <div
        className="absolute top-0 inset-x-0 h-[460px] pointer-events-none transition-all duration-700 opacity-[0.10] dark:opacity-[0.16]"
        style={{ background: `radial-gradient(60% 100% at 50% 0%, ${ambient} 0%, transparent 70%)` }}
      />

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-[28px] md:py-[40px]">
        <div className="mb-[26px]">
          <span
            className="inline-block bg-primary text-white text-[11px] font-bold uppercase tracking-[2px] px-[12px] py-[5px] mb-[12px]"
            style={{ clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)' }}
          >
            İlan Oluştur
          </span>
          <h1 className="font-display font-bold text-[28px] md:text-[38px] text-dark-900 dark:text-text-light leading-tight">
            Hesabını Vitrine Çıkar
          </h1>
          <p className="text-[14px] text-gray-500 dark:text-text-muted mt-[6px]">
            5 kısa adımda ilanını hazırla, güvenli pazar yerine yayınla.
          </p>
        </div>

        {/* Stepper */}
        <div className="flex items-center mb-[28px] overflow-x-auto scrollbar-hide pb-[4px]">
          {STEPS.map((s, i) => {
            const activeStep = i === step
            const doneStep = i < step
            return (
              <div key={s.label} className="flex items-center flex-1 last:flex-none min-w-[64px]">
                <div className="flex flex-col items-center gap-[7px]">
                  <span
                    className={`relative w-[38px] h-[38px] rounded-full flex items-center justify-center transition-all duration-300 ${
                      doneStep
                        ? 'bg-primary text-white'
                        : activeStep
                        ? 'bg-primary text-white shadow-lg shadow-primary/30 scale-110'
                        : 'bg-gray-100 dark:bg-dark-800 text-gray-400 dark:text-text-muted border border-gray-200 dark:border-dark-700'
                    }`}
                  >
                    {activeStep && <span className="absolute inset-0 rounded-full bg-primary/40 animate-ping" />}
                    {doneStep ? <Check size={18} strokeWidth={3} className="relative" /> : <s.icon size={17} className="relative" />}
                  </span>
                  <span className={`text-[11px] font-semibold whitespace-nowrap ${activeStep || doneStep ? 'text-dark-900 dark:text-text-light' : 'text-gray-400 dark:text-text-muted'}`}>
                    {s.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="flex-1 h-[3px] mx-[8px] mb-[22px] rounded-full bg-gray-200 dark:bg-dark-700 overflow-hidden">
                    <div className={`h-full bg-primary transition-all duration-500 ${doneStep ? 'w-full' : 'w-0'}`} />
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <div className="bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-2xl p-[22px] md:p-[30px] shadow-xl">
          {/* ADIM 0 */}
          {step === 0 && (
            <StepShell stepKey={0}>
              <StepHead icon={FileText} title="Temel Bilgiler" sub="İlanın başlığı ve açıklaması alıcıyı ilk yakalayan şeydir." />
              <div className="space-y-[18px]">
                <Field label="İlan Başlığı">
                  <input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={80} placeholder="Örn: Mythic Glory Chou - Tüm Skinler Açık" className={inputCls} />
                  <p className="text-[11px] text-gray-400 dark:text-text-muted mt-[5px] text-right">{title.length}/80</p>
                </Field>
                <Field label="Açıklama">
                  <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} maxLength={500} placeholder="Hangi skinler, hangi hero'lar, hesap geçmişi, neden satıyorsun? Ne kadar detay o kadar güven." className={inputCls + ' resize-none'} />
                  <p className="text-[11px] text-gray-400 dark:text-text-muted mt-[5px] text-right">{description.length}/500</p>
                </Field>
              </div>
            </StepShell>
          )}

          {/* ADIM 1 */}
          {step === 1 && (
            <StepShell stepKey={1}>
              <StepHead icon={Trophy} title="Hesap Detayları" sub="Rank'ı seçtiğinde sayfa onun rengine bürünür." />
              <div className="space-y-[18px]">
                <Field label="Rank">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-[8px] max-h-[240px] overflow-y-auto pr-[4px]">
                    {ALL_RANKS.map((r) => {
                      const sel = rank === r
                      const c = RANK_TIER_COLOR[r] || '#9CA3AF'
                      return (
                        <button
                          key={r}
                          type="button"
                          onClick={() => setRank(r)}
                          className={`px-[10px] py-[10px] rounded-lg text-[12px] font-display font-bold transition-all border-2 ${
                            sel ? 'text-white border-transparent scale-[1.02] shadow-md' : 'border-gray-200 dark:border-dark-600 text-gray-600 dark:text-text-muted hover:border-gray-300'
                          }`}
                          style={sel ? { backgroundColor: c } : undefined}
                        >
                          {r}
                        </button>
                      )
                    })}
                  </div>
                </Field>
                <Field label="Sunucu">
                  <div className="flex flex-wrap gap-[8px]">
                    {SERVERS.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setServer(s)}
                        className={`flex items-center gap-[6px] px-[14px] py-[9px] rounded-lg text-[13px] font-semibold border-2 transition-all ${
                          server === s ? 'border-primary bg-primary/10 text-primary' : 'border-gray-200 dark:border-dark-600 text-gray-600 dark:text-text-muted hover:border-gray-300'
                        }`}
                      >
                        <Globe size={14} />
                        {s}
                      </button>
                    ))}
                  </div>
                </Field>
                <div className="grid grid-cols-3 gap-[12px]">
                  <Field label="Skin"><NumInput icon={Gem} value={skins} onChange={setSkins} placeholder="0" /></Field>
                  <Field label="Hero"><NumInput icon={Users} value={heroes} onChange={setHeroes} placeholder="0" /></Field>
                  <Field label="Seviye"><NumInput icon={TrendingUp} value={level} onChange={setLevel} placeholder="0" /></Field>
                </div>
              </div>
            </StepShell>
          )}

          {/* ADIM 2 — COKLU GORSEL */}
          {step === 2 && (
            <StepShell stepKey={2}>
              <StepHead icon={ImageIcon} title="Hesap Görselleri" sub={`En fazla ${MAX_IMAGES} görsel. İlk eklediğin otomatik kapak olur, sonra değiştirebilirsin.`} />
              <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFiles} />

              {/* Ana onizleme (kapak) - blur/contain: yatay ss kaymaz */}
              {previewCover ? (
                <div className="relative aspect-[16/9] rounded-xl overflow-hidden border border-gray-200 dark:border-dark-700 bg-dark-900">
                  <img src={previewCover} alt="" aria-hidden className="absolute inset-0 w-full h-full object-cover scale-110 blur-2xl opacity-50" />
                  <img src={previewCover} alt="kapak" className="relative w-full h-full object-contain" />
                  <span className="absolute top-[10px] left-[10px] flex items-center gap-[5px] px-[9px] py-[4px] bg-primary text-white text-[11px] font-bold rounded-md">
                    <Star size={12} fill="white" />
                    Kapak
                  </span>
                </div>
              ) : (
                <div className="relative aspect-[16/9] rounded-xl border-2 border-dashed border-gray-300 dark:border-dark-600 flex items-center justify-center">
                  <span className="text-[13px] text-gray-400 dark:text-text-muted">Henüz görsel yok</span>
                </div>
              )}

              {/* Thumb seridi + ekle kutusu (grid, kayma yok) */}
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-[8px] mt-[12px]">
                {images.map((im, i) => (
                  <div
                    key={i}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 group ${
                      i === coverIndex ? 'border-primary ring-2 ring-primary/30' : 'border-gray-200 dark:border-dark-700'
                    }`}
                  >
                    <img src={im.preview} alt="" className="w-full h-full object-cover" />
                    {im.uploading && (
                      <div className="absolute inset-0 bg-black/55 flex items-center justify-center">
                        <Loader2 size={18} className="animate-spin text-white" />
                      </div>
                    )}
                    {i === coverIndex && !im.uploading && (
                      <span className="absolute top-[3px] left-[3px] w-[18px] h-[18px] rounded-full bg-primary flex items-center justify-center">
                        <Star size={10} className="text-white" fill="white" />
                      </span>
                    )}
                    {!im.uploading && (
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/55 transition-colors flex flex-col items-center justify-center gap-[4px] opacity-0 group-hover:opacity-100">
                        {i !== coverIndex && (
                          <button
                            type="button"
                            onClick={() => setCoverIndex(i)}
                            className="px-[6px] py-[3px] bg-white text-dark-900 text-[9px] font-bold rounded flex items-center gap-[2px]"
                          >
                            <Star size={9} /> Kapak
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => removeImage(i)}
                          className="w-[22px] h-[22px] bg-red-500 text-white rounded flex items-center justify-center"
                          aria-label="Sil"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    )}
                  </div>
                ))}

                {images.length < MAX_IMAGES && (
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="aspect-square rounded-lg border-2 border-dashed border-gray-300 dark:border-dark-600 hover:border-primary hover:bg-primary/5 transition-all flex flex-col items-center justify-center gap-[3px] group"
                  >
                    <Plus size={20} className="text-gray-400 group-hover:text-primary transition-colors" />
                    <span className="text-[10px] text-gray-400 group-hover:text-primary font-semibold">{images.length}/{MAX_IMAGES}</span>
                  </button>
                )}
              </div>

              <div className="flex items-start gap-[8px] mt-[14px] bg-blue-50 dark:bg-blue-900/15 border border-blue-200 dark:border-blue-800/50 rounded-lg px-[12px] py-[10px]">
                <Info size={15} className="text-blue-500 flex-shrink-0 mt-[1px]" />
                <p className="text-[12px] text-blue-700 dark:text-blue-300 leading-snug">
                  Yatay ekran görüntüsü de dikey de fark etmez — görseller kırpmadan, kaymadan tam görünür. Birini kapak yapmak için üzerine gelip “Kapak” de.
                </p>
              </div>
            </StepShell>
          )}

          {/* ADIM 3 — ZENGIN FIYAT */}
          {step === 3 && (
            <StepShell stepKey={3}>
              <StepHead icon={Tag} title="Fiyat Belirle" sub="Tutarı gir, piyasa ibresinin nereye düştüğünü canlı izle." />

              <div className="relative bg-gradient-to-br from-dark-900 to-dark-800 rounded-2xl p-[24px] overflow-hidden mb-[18px]">
                <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-primary/20 blur-3xl" />
                <div
                  className="absolute inset-0 opacity-[0.08]"
                  style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '18px 18px' }}
                />
                <p className="relative text-[12px] uppercase tracking-[2px] text-text-muted mb-[10px]">İstediğin Fiyat</p>
                <div className="relative flex items-center">
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    min={0}
                    placeholder="0"
                    className="relative w-full bg-transparent border-none outline-none font-display font-bold text-[44px] md:text-[56px] text-white leading-none placeholder:text-white/20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <span className="relative font-display font-bold text-[30px] md:text-[36px] text-primary ml-[8px]">₺</span>
                </div>

                {/* Piyasa ibresi */}
                {hint && numPrice > 0 && (
                  <div className="relative mt-[22px]">
                    <div className="h-[8px] rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${gaugePct}%`, backgroundColor: gaugeColor }}
                      />
                    </div>
                    <div
                      className="absolute -top-[5px] w-[18px] h-[18px] rounded-full border-[3px] border-dark-900 shadow-lg transition-all duration-500"
                      style={{ left: `calc(${gaugePct}% - 9px)`, backgroundColor: gaugeColor }}
                    />
                    <div className="flex justify-between text-[10px] text-text-muted mt-[8px] font-mono">
                      <span>₺{hint[0].toLocaleString('tr-TR')}</span>
                      <span>₺{hint[1].toLocaleString('tr-TR')}</span>
                    </div>
                    <p className="text-[12px] mt-[8px] font-semibold" style={{ color: gaugeColor }}>
                      {gaugeZone}
                    </p>
                  </div>
                )}
              </div>

              {/* Hizli oneri chip'leri */}
              {quickPrices.length > 0 && (
                <div>
                  <p className="text-[12px] font-semibold uppercase tracking-[1px] text-gray-400 dark:text-text-muted mb-[8px]">
                    Hızlı öneriler ({rank})
                  </p>
                  <div className="flex flex-wrap gap-[8px]">
                    {quickPrices.map((q, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setPrice(String(q))}
                        className={`px-[14px] py-[9px] rounded-lg text-[13px] font-display font-bold border-2 transition-all ${
                          numPrice === q
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-gray-200 dark:border-dark-600 text-gray-600 dark:text-text-muted hover:border-primary hover:text-primary'
                        }`}
                      >
                        ₺{q.toLocaleString('tr-TR')}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-[8px] mt-[16px] text-[12px] text-gray-400 dark:text-text-muted">
                <ShieldCheck size={14} className="text-green-500" />
                Ödeme, hesap alıcıya teslim edilene kadar emanet hesapta korunur.
              </div>
            </StepShell>
          )}

          {/* ADIM 4 */}
          {step === 4 && (
            <StepShell stepKey={4}>
              <StepHead icon={Sparkles} title="Son Bir Bakış" sub="İlanın pazar yerinde tam olarak böyle görünecek." />
              <div className="bg-white dark:bg-dark-800 border-2 border-gray-200 dark:border-dark-700 rounded-xl overflow-hidden max-w-[360px] mx-auto shadow-lg">
                <div className="relative aspect-[16/10] bg-dark-900">
                  {previewCover ? (
                    <>
                      <img src={previewCover} alt="" aria-hidden className="absolute inset-0 w-full h-full object-cover scale-110 blur-2xl opacity-50" />
                      <img src={previewCover} alt="" className="relative w-full h-full object-contain" />
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon size={30} className="text-gray-300 dark:text-dark-600" />
                    </div>
                  )}
                  {images.length > 1 && (
                    <span className="absolute top-[10px] right-[10px] bg-black/50 backdrop-blur-sm text-white/90 text-[11px] font-mono px-[8px] py-[4px] rounded">
                      {images.length} görsel
                    </span>
                  )}
                  <span
                    className="absolute bottom-[10px] left-[10px] text-white text-[11px] font-display font-bold px-[10px] py-[5px]"
                    style={{ backgroundColor: ambient, clipPath: 'polygon(5px 0, 100% 0, 100% calc(100% - 5px), calc(100% - 5px) 100%, 0 100%, 0 5px)' }}
                  >
                    {rank || 'Rank'}
                  </span>
                </div>
                <div className="p-[14px]">
                  <h3 className="font-display font-semibold text-[15px] text-dark-900 dark:text-text-light line-clamp-2 min-h-[38px] mb-[10px]">
                    {title || 'İlan başlığın burada görünecek'}
                  </h3>
                  <div className="flex items-center gap-[6px] mb-[12px]">
                    <span className="px-[8px] py-[3px] bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[11px] font-bold rounded-md flex items-center gap-[4px]">
                      <Globe size={11} />
                      {server}
                    </span>
                  </div>
                  <div className="font-display font-bold text-[22px] text-primary mb-[12px]">
                    ₺{numPrice.toLocaleString('tr-TR') || '0'}
                  </div>
                  <div className="flex items-center gap-[8px] pt-[12px] border-t border-gray-100 dark:border-dark-700">
                    {profile?.avatar_url ? (
                      <img src={profile.avatar_url} alt="" className="w-[22px] h-[22px] rounded-full object-cover" />
                    ) : (
                      <span className="w-[22px] h-[22px] rounded-full bg-primary/20 text-primary text-[11px] font-bold flex items-center justify-center">{sellerInitial}</span>
                    )}
                    <span className="text-[12px] text-gray-500 dark:text-text-muted">Sen · 0 başarılı işlem</span>
                  </div>
                </div>
              </div>

              <div className="mt-[18px] grid grid-cols-2 gap-[8px] text-[13px]">
                <SumRow label="Skin" value={skins || '0'} />
                <SumRow label="Hero" value={heroes || '0'} />
                <SumRow label="Seviye" value={level || '0'} />
                <SumRow label="Görsel" value={images.length > 0 ? `${images.length} adet` : 'Yok'} />
              </div>
            </StepShell>
          )}

          {error && (
            <div className="mt-[18px] px-[14px] py-[11px] bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-[13px] text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          <div className="flex items-center justify-between mt-[24px] pt-[18px] border-t border-gray-100 dark:border-dark-700">
            <button
              type="button"
              onClick={prev}
              disabled={step === 0}
              className="flex items-center gap-[6px] px-[16px] py-[11px] text-[14px] font-display font-bold text-gray-500 dark:text-text-muted hover:text-dark-900 dark:hover:text-text-light transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={18} />
              Geri
            </button>

            {step < STEPS.length - 1 ? (
              <button
                type="button"
                onClick={next}
                className="flex items-center gap-[7px] px-[22px] py-[12px] bg-primary text-white font-display font-bold text-[15px] rounded-lg hover:bg-primary-dark hover:gap-[11px] transition-all clip-chamfer"
              >
                Devam Et
                <ChevronRight size={18} />
              </button>
            ) : (
              <button
                type="button"
                onClick={publish}
                disabled={publishing || !allUploaded}
                className="flex items-center gap-[8px] px-[24px] py-[12px] bg-green-600 text-white font-display font-bold text-[15px] rounded-lg hover:bg-green-700 hover:gap-[12px] transition-all disabled:opacity-50 clip-chamfer"
              >
                {publishing ? <Loader2 size={18} className="animate-spin" /> : <Rocket size={18} />}
                {publishing ? 'Yayınlanıyor...' : 'İlanı Yayınla'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const inputCls =
  'w-full px-[14px] py-[12px] bg-white dark:bg-dark-700 border-2 border-gray-200 dark:border-dark-600 rounded-lg focus:border-primary focus:outline-none transition-colors text-[14px] text-dark-900 dark:text-text-light'

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[12px] font-semibold uppercase tracking-[1px] text-gray-400 dark:text-text-muted mb-[7px]">{label}</label>
      {children}
    </div>
  )
}

function StepHead({ icon: Icon, title, sub }: { icon: typeof FileText; title: string; sub: string }) {
  return (
    <div className="flex items-start gap-[12px] mb-[22px]">
      <span className="w-[40px] h-[40px] flex-shrink-0 rounded-lg bg-primary/10 flex items-center justify-center">
        <Icon size={20} className="text-primary" />
      </span>
      <div>
        <h2 className="font-display font-bold text-[19px] text-dark-900 dark:text-text-light">{title}</h2>
        <p className="text-[13px] text-gray-500 dark:text-text-muted mt-[2px]">{sub}</p>
      </div>
    </div>
  )
}

function NumInput({ icon: Icon, value, onChange, placeholder }: { icon: typeof Gem; value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <div className="relative">
      <Icon size={15} className="absolute left-[12px] top-1/2 -translate-y-1/2 text-gray-400" />
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        min={0}
        placeholder={placeholder}
        className="w-full pl-[34px] pr-[10px] py-[11px] bg-white dark:bg-dark-700 border-2 border-gray-200 dark:border-dark-600 rounded-lg focus:border-primary focus:outline-none transition-colors text-[14px] text-dark-900 dark:text-text-light"
      />
    </div>
  )
}

function SumRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between bg-gray-50 dark:bg-dark-900/60 border border-gray-100 dark:border-dark-700 rounded-lg px-[12px] py-[9px]">
      <span className="text-gray-400 dark:text-text-muted">{label}</span>
      <span className="font-semibold text-dark-900 dark:text-text-light">{value}</span>
    </div>
  )
}