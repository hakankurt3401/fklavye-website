import Link from "next/link";

function Footer() {
  return (
    <footer className="bg-[#1a5c7a] text-white py-10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Dernek Bilgileri */}
          <div>
            <h3 className="font-bold text-lg mb-4">F Klavye ve Uçan Parmaklar Derneği</h3>
            <p className="text-sm opacity-90">
              Klavye kültürünü geliştirmek ve yarışmalar düzenlemek için kurulmuş bir dernek.
            </p>
            <p className="text-sm mt-2">
              <strong>Kuruluş:</strong> 5 Mayıs 1957
            </p>
          </div>

          {/* Hızlı Menü */}
          <div>
            <h3 className="font-bold text-lg mb-4">Hızlı Menü</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="hover:text-[#cfe9ff] opacity-90 hover:opacity-100">Ana Sayfa</Link></li>
              <li><Link href="/tarihcemiz" className="hover:text-[#cfe9ff] opacity-90 hover:opacity-100">Tarihçemiz</Link></li>
              <li><Link href="/haberler" className="hover:text-[#cfe9ff] opacity-90 hover:opacity-100">Haberler</Link></li>
              <li><Link href="/galeri" className="hover:text-[#cfe9ff] opacity-90 hover:opacity-100">Galeri</Link></li>
              <li><Link href="/videolar" className="hover:text-[#cfe9ff] opacity-90 hover:opacity-100">Videolar</Link></li>
              <li><Link href="/iletisim" className="hover:text-[#cfe9ff] opacity-90 hover:opacity-100">İletişim</Link></li>
            </ul>
          </div>

          {/* İletişim */}
          <div>
            <h3 className="font-bold text-lg mb-4">İletişim</h3>
            <p className="text-sm opacity-90">📧 info@fklavye.org.tr</p>
            <p className="text-sm opacity-90">🌐 www.fklavye.org.tr</p>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="hover:text-[#cfe9ff] opacity-90 hover:opacity-100">Facebook</a>
              <a href="#" className="hover:text-[#cfe9ff] opacity-90 hover:opacity-100">Instagram</a>
              <a href="#" className="hover:text-[#cfe9ff] opacity-90 hover:opacity-100">YouTube</a>
            </div>
          </div>
        </div>

        {/* Alt Satır */}
        <div className="border-t border-white/20 mt-8 pt-6 text-center text-sm opacity-80">
          <p>&copy; {new Date().getFullYear()} F Klavye ve Uçan Parmaklar Derneği. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;