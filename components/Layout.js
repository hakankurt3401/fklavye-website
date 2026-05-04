import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';

export default function Layout({ children, title = 'F Klavye Uçan Parmaklar Derneği' }) {
  return (
    <div className="min-h-screen flex flex-col bg-blue-50">
      <Head>
        <title>{title}</title>
        <meta name="description" content="F Klavye Uçan Parmaklar Derneği resmi web sitesi" />
      </Head>

      {/* Header */}
      <header className="bg-blue-100 text-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-5">
          <div className="flex items-center justify-center gap-6">
            <div className="relative w-40 h-40 flex-shrink-0">
              <Image src="/logo.png" alt="F Klavye Logo" fill className="object-contain" sizes="160px" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-center">F Klavye Uçan Parmaklar Derneği</h1>
          </div>
        </div>

        <nav className="bg-blue-200">
          <div className="max-w-7xl mx-auto px-4">
            <ul className="flex flex-wrap items-center justify-center gap-1 py-2 text-base">
              <li><Link href="/" className="px-5 py-2 hover:bg-blue-300 text-gray-800 rounded font-bold text-lg">Ana Sayfa</Link></li>
              <li className="relative group">
                <button className="px-5 py-2 hover:bg-blue-300 text-gray-800 rounded flex items-center gap-1 font-bold text-lg">Derneğimiz <span className="text-xs">▾</span></button>
                <div className="absolute left-1/2 -translate-x-1/2 md:left-0 md:translate-x-0 top-full mt-1 bg-white text-gray-800 shadow-lg rounded-lg min-w-52 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                  <Link href="/sayfa/baskan-mesaji" className="block px-4 py-2 hover:bg-blue-50 rounded-t font-medium">Başkanın Mesajı</Link>
                  <Link href="/sayfa/tarihcemiz" className="block px-4 py-2 hover:bg-blue-50 font-medium">Tarihçemiz</Link>
                  <Link href="/sayfa/tuzuk" className="block px-4 py-2 hover:bg-blue-50 font-medium">Tüzük</Link>
                  <Link href="/sayfa/yonetim-kurulu" className="block px-4 py-2 hover:bg-blue-50 font-medium">Yönetim Kurulu</Link>
                  <Link href="/sayfa/denetim-kurulu" className="block px-4 py-2 hover:bg-blue-50 rounded-b font-medium">Denetim Kurulu</Link>
                </div>
              </li>
              <li className="relative group">
                <button className="px-5 py-2 hover:bg-blue-300 text-gray-800 rounded flex items-center gap-1 font-bold text-lg">Haberler <span className="text-xs">▾</span></button>
                <div className="absolute left-1/2 -translate-x-1/2 md:left-0 md:translate-x-0 top-full mt-1 bg-white text-gray-800 shadow-lg rounded-lg min-w-52 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                  <Link href="/sayfa/haberler" className="block px-4 py-2 hover:bg-blue-50 rounded-t font-medium">Haberler</Link>
                  <Link href="/sayfa/duyurular" className="block px-4 py-2 hover:bg-blue-50 font-medium">Duyurular</Link>
                  <Link href="/sayfa/basin" className="block px-4 py-2 hover:bg-blue-50 rounded-b font-medium">Basın Bültenleri</Link>
                </div>
              </li>
              <li className="relative group">
                <button className="px-5 py-2 hover:bg-blue-300 text-gray-800 rounded flex items-center gap-1 font-bold text-lg">İntersteno-Türk <span className="text-xs">▾</span></button>
                <div className="absolute left-1/2 -translate-x-1/2 md:left-0 md:translate-x-0 top-full mt-1 bg-white text-gray-800 shadow-lg rounded-lg min-w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                  <Link href="/sayfa/intersteno-onursal" className="block px-4 py-2 hover:bg-blue-50 rounded-t font-medium">İntersteno Onursal Başkanları</Link>
                  <Link href="/sayfa/intersteno-hakkinda" className="block px-4 py-2 hover:bg-blue-50 font-medium">İntersteno Hakkında</Link>
                  <Link href="/sayfa/intersteno-yonetim" className="block px-4 py-2 hover:bg-blue-50 font-medium">İntersteno Yönetim Kurulu</Link>
                  <Link href="/sayfa/intersteno-konsey" className="block px-4 py-2 hover:bg-blue-50 font-medium">İntersteno Konseyi</Link>
                  <Link href="/sayfa/intersteno-turk-hakkinda" className="block px-4 py-2 hover:bg-blue-50 font-medium">İntersteno Türk Hakkında</Link>
                  <Link href="/sayfa/intersteno-turk-yonetimi" className="block px-4 py-2 hover:bg-blue-50 rounded-b font-medium">İntersteno-Türk Yönetimi</Link>
                </div>
              </li>
              <li><Link href="/sayfa/galeri" className="px-5 py-2 hover:bg-blue-300 text-gray-800 rounded font-bold text-lg block">Galeri</Link></li>
              <li><Link href="/sayfa/videolar" className="px-5 py-2 hover:bg-blue-300 text-gray-800 rounded font-bold text-lg block">Videolar</Link></li>
              <li className="relative group">
                <button className="px-5 py-2 hover:bg-blue-300 text-gray-800 rounded flex items-center gap-1 font-bold text-lg">F Klavye <span className="text-xs">▾</span></button>
                <div className="absolute left-1/2 -translate-x-1/2 md:left-0 md:translate-x-0 top-full mt-1 bg-white text-gray-800 shadow-lg rounded-lg min-w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                  <Link href="/sayfa/f-klavyenin-mucidi" className="block px-4 py-2 hover:bg-blue-50 rounded-t font-medium">F Klavyenin Mucidi</Link>
                  <Link href="/sayfa/f-klavyenin-hikayesi" className="block px-4 py-2 hover:bg-blue-50 font-medium">F Klavyenin Hikayesi</Link>
                  <Link href="/sayfa/f-klavyenin-ozellikleri" className="block px-4 py-2 hover:bg-blue-50 font-medium">F Klavyenin Özellikleri</Link>
                  <Link href="/sayfa/gunumuzde-f-klavye" className="block px-4 py-2 hover:bg-blue-50 rounded-b font-medium">Günümüzde F Klavye</Link>
                </div>
              </li>
              <li><Link href="/sayfa/iletisim" className="px-5 py-2 hover:bg-blue-300 text-gray-800 rounded font-bold text-lg block">İletişim</Link></li>
            </ul>
          </div>
        </nav>
      </header>

      <main className="flex-1 bg-blue-100">
        {children}
      </main>

      <footer className="bg-blue-200 text-gray-700 py-4">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm">Copyright © 2026 - Her Hakkı Saklıdır. Kopyalanması, çoğaltılması ve dağıtılması halinde yasal haklarımız işletilecektir.</p>
        </div>
      </footer>
    </div>
  );
}