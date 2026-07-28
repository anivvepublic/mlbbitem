import { Plus } from 'lucide-react'
import { SearchBar } from './SearchBar'
import { useAuth } from '../../context/AuthContext'
import { useAuthModal } from '../../context/AuthModalContext'

interface MarketplaceHeaderProps {
  q: string
  onQChange: (v: string) => void
}

export function MarketplaceHeader({ q, onQChange }: MarketplaceHeaderProps) {
  const { user } = useAuth()
  const { openLogin } = useAuthModal()

  const handleCreate = () => {
    if (!user) {
      openLogin()
    } else {
      window.location.href = '/create-listing'
    }
  }

  return (
    <section className="relative bg-dark-900 overflow-hidden [clip-path:polygon(0_0,100%_0,100%_calc(100%-16px),0_100%)] md:[clip-path:polygon(0_0,100%_0,100%_calc(100%-32px),0_100%)]">
      {/* Nokta dokusu */}
      <div
        className="absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
          backgroundSize: '22px 22px',
        }}
      />
      {/* Yumuşak turuncu parıltı */}
      <div className="absolute -top-[80px] -right-[60px] w-[320px] h-[320px] rounded-full bg-primary/25 blur-[90px]" />
      <div className="absolute -bottom-[100px] left-[10%] w-[260px] h-[260px] rounded-full bg-primary/10 blur-[80px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-[36px] pb-[56px] md:pt-[48px] md:pb-[72px]">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-[20px] mb-[24px]">
          <div>
            <span
              className="inline-block bg-primary text-white text-[11px] font-bold uppercase tracking-[2px] px-[12px] py-[5px] mb-[14px]"
              style={{ clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)' }}
            >
              Pazar Yeri
            </span>
            <h1 className="font-display font-bold text-white text-[36px] sm:text-[48px] md:text-[56px] leading-[0.95] tracking-tight">
              HESAP
              <br />
              <span className="text-primary">PAZARI</span>
            </h1>
            <p className="text-text-muted text-[14px] md:text-[15px] mt-[12px] max-w-[420px] leading-relaxed">
              Yüzlerce Mobile Legends hesabı tek çatı altında. Filtrele, karşılaştır, güvenle al.
            </p>
          </div>

          <button
            onClick={handleCreate}
            className="flex-shrink-0 flex items-center justify-center gap-[8px] px-[22px] py-[13px] bg-primary text-white font-display font-bold text-[15px] rounded-lg hover:bg-primary-dark hover:gap-[12px] transition-all clip-chamfer"
          >
            <Plus size={20} />
            İlan Ver
          </button>
        </div>

        <SearchBar value={q} onChange={onQChange} />
      </div>
    </section>
  )
}