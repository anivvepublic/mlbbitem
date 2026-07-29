import type { LucideIcon } from 'lucide-react'

interface SettingsSectionProps {
  icon: LucideIcon
  title: string
  description: string
  danger?: boolean
  children: React.ReactNode
}

export function SettingsSection({ icon: Icon, title, description, danger, children }: SettingsSectionProps) {
  return (
    <div className="group relative bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-xl overflow-hidden transition-colors hover:border-gray-300 dark:hover:border-dark-600">
      {/* Sol kenar vurgusu */}
      <div
        className={`absolute top-0 left-0 w-[3px] h-full transition-all duration-300 ${
          danger ? 'bg-red-500/40 group-hover:bg-red-500' : 'bg-primary/0 group-hover:bg-primary'
        }`}
      />
      <div className="p-[22px] md:p-[24px]">
        <div className="flex items-start gap-[12px] mb-[18px]">
          <span
            className={`w-[38px] h-[38px] flex-shrink-0 rounded-lg flex items-center justify-center ${
              danger ? 'bg-red-500/10' : 'bg-primary/10'
            }`}
          >
            <Icon size={19} className={danger ? 'text-red-500' : 'text-primary'} />
          </span>
          <div>
            <h3 className="font-display font-bold text-[17px] text-dark-900 dark:text-text-light">{title}</h3>
            <p className="text-[13px] text-gray-500 dark:text-text-muted mt-[2px] leading-snug">{description}</p>
          </div>
        </div>
        {children}
      </div>
    </div>
  )
}