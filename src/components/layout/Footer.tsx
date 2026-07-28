export function Footer() {
  return (
    <footer className="bg-dark-900 text-text-light mt-auto relative overflow-hidden">
      
      {/* Üst Dekoratif Turuncu Çizgi */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-primary to-transparent"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-[48px] md:py-[64px]">
        
        {/* Ana Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-[32px] md:gap-[48px]">
          
          {/* Sol: Marka ve Açıklama (5 sütun) */}
          <div className="md:col-span-5">
            {/* Marka Adı - Tipografi ile */}
            <div className="mb-[16px] md:mb-[20px]">
              <span className="font-display font-bold text-[28px] md:text-[36px] tracking-tight">
                <span className="text-white">MLBB</span>
                <span className="text-primary">ITEM</span>
              </span>
            </div>
            
            <p className="text-text-muted text-[14px] md:text-[15px] leading-[1.7] max-w-[320px] md:max-w-[380px]">
              Türkiye'nin güvenilir Mobile Legends hesap pazarı. 
              Güvenli aracılık sistemiyle hesabını sat veya hayalindeki hesabı bul.
            </p>

            {/* Dekoratif Kesik Köşe Çizgi */}
            <div className="mt-[20px] md:mt-[24px] flex items-center gap-[8px]">
              <div className="w-[40px] h-[3px] bg-primary"></div>
              <div className="w-[12px] h-[3px] bg-primary opacity-60"></div>
              <div className="w-[6px] h-[3px] bg-primary opacity-30"></div>
            </div>
          </div>

          {/* Orta: Hızlı Linkler (3 sütun) */}
          <div className="md:col-span-3 md:col-start-7">
            <h3 className="font-display font-semibold text-[14px] md:text-[15px] uppercase tracking-[2px] text-primary mb-[16px] md:mb-[20px]">
              Hızlı Erişim
            </h3>
            <ul className="space-y-[10px] md:space-y-[12px]">
              <li>
                <a 
                  href="/" 
                  className="text-text-muted hover:text-white text-[14px] md:text-[15px] transition-colors inline-flex items-center group"
                >
                  <span className="w-[4px] h-[4px] bg-primary mr-[10px] opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Ana Sayfa
                </a>
              </li>
              <li>
                <a 
                  href="/marketplace" 
                  className="text-text-muted hover:text-white text-[14px] md:text-[15px] transition-colors inline-flex items-center group"
                >
                  <span className="w-[4px] h-[4px] bg-primary mr-[10px] opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Hesap Pazarı
                </a>
              </li>
              <li>
                <a 
                  href="/requests" 
                  className="text-text-muted hover:text-white text-[14px] md:text-[15px] transition-colors inline-flex items-center group"
                >
                  <span className="w-[4px] h-[4px] bg-primary mr-[10px] opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Talep Oluştur
                </a>
              </li>
              <li>
                <a 
                  href="/faq" 
                  className="text-text-muted hover:text-white text-[14px] md:text-[15px] transition-colors inline-flex items-center group"
                >
                  <span className="w-[4px] h-[4px] bg-primary mr-[10px] opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  SSS
                </a>
              </li>
            </ul>
          </div>

          {/* Sağ: Yasal Uyarı (3 sütun) */}
          <div className="md:col-span-3">
            <h3 className="font-display font-semibold text-[14px] md:text-[15px] uppercase tracking-[2px] text-primary mb-[16px] md:mb-[20px]">
              Yasal Bilgi
            </h3>
            <p className="text-text-muted text-[12px] md:text-[13px] leading-[1.7]">
              MLBBITEM, Moonton ile bağlantılı değildir. Mobile Legends: Bang Bang, 
              Moonton'un tescilli markasıdır. Hesap alım-satımı Moonton Kullanım 
              Şartları'na aykırı olabilir. Tüm işlemler kullanıcı sorumluluğundadır.
            </p>
          </div>
        </div>

        {/* Alt Çizgi */}
        <div className="border-t border-dark-700 mt-[40px] md:mt-[56px] pt-[24px] md:pt-[32px]">
          <div className="flex flex-col md:flex-row items-center justify-between gap-[12px]">
            
            {/* Copyright */}
            <p className="text-text-muted text-[13px] md:text-[14px]">
              © 2026 <span className="text-white font-medium">MLBBITEM</span>. Tüm hakları saklıdır.
            </p>

            {/* Alt Linkler */}
            <div className="flex items-center gap-[20px] md:gap-[24px]">
              <a 
                href="/terms" 
                className="text-text-muted hover:text-primary text-[13px] md:text-[14px] transition-colors"
              >
                Kullanım Şartları
              </a>
              <span className="text-dark-700">•</span>
              <a 
                href="/privacy" 
                className="text-text-muted hover:text-primary text-[13px] md:text-[14px] transition-colors"
              >
                Gizlilik
              </a>
              <span className="text-dark-700">•</span>
              <a 
                href="/contact" 
                className="text-text-muted hover:text-primary text-[13px] md:text-[14px] transition-colors"
              >
                İletişim
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}