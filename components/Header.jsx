import { useState } from "react";
import Link from "next/link";

function Header() {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    {
      id: "dernegimiz",
      label: "Derneğimiz",
      submenu: [
        { label: "Tarihçemiz", href: "/tarihcemiz" },
        { label: "Tüzük", href: "/tuzuk" },
        { label: "Yönetim Kurulu", href: "/yonetim-kurulu" },
        { label: "Denetim Kurulu", href: "/denetim-kurulu" },
      ]
    },
    {
      id: "haberler",
      label: "Haberler",
      submenu: [
        { label: "Haberler", href: "/haberler?tab=haberler" },
        { label: "Duyurular", href: "/haberler?tab=duyurular" },
        { label: "Basın Bültenleri", href: "/haberler?tab=basin" },
      ]
    },
    {
      id: "intersteno",
      label: "İntersteno-Türk",
      submenu: [
        { label: "İntersteno Onursal Başkanları", href: "/intersteno-onursal-baskanlari" },
        { label: "İntersteno Hakkında", href: "/intersteno-hakkinda" },
        { label: "İntersteno Yönetim Kurulu", href: "/intersteno-yonetim-kurulu" },
        { label: "İntersteno Konseyi", href: "/intersteno-konseyi" },
        { label: "İntersteno Türk Hakkında", href: "/intersteno-turk-hakkinda" },
        { label: "İntersteno-Türk Yönetimi", href: "/intersteno-turk-yonetimi" },
      ]
    },
    { id: "galeri", label: "Galeri", href: "/galeri" },
    { id: "videolar", label: "Videolar", href: "/videolar" },
    {
      id: "fklavye",
      label: "F Klavye",
      submenu: [
        { label: "F Klavyenin Mucidi: İhsan YENER", href: "/f-klavyenin-mucidi" },
        { label: "F Klavyenin Hikayesi", href: "/f-klavyenin-hikayesi" },
        { label: "F Klavyenin Özellikleri", href: "/f-klavyenin-ozellikleri" },
        { label: "Günümüzde F Klavye Gerçeği", href: "/gunumuzde-f-klavye" },
      ]
    },
    { id: "iletisim", label: "İletişim", href: "/iletisim" },
  ];

  const handleDropdownToggle = (id) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };

  return (
    <header className="bg-[#1a5c7a] text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
              <span className="text-[#1a5c7a] font-bold text-xl">FK</span>
            </div>
            <div className="hidden sm:block">
              <span className="block text-xl font-bold">F Klavye</span>
              <span className="block text-xs">ve Uçan Parmaklar Derneği</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            <Link href="/" className="hover:text-[#cfe9ff] transition-colors font-medium">
              Ana Sayfa
            </Link>

            {menuItems.map((item) => (
              <div key={item.id} className="relative">
                {item.submenu ? (
                  <>
                    <button
                      onClick={() => handleDropdownToggle(item.id)}
                      onMouseEnter={() => setOpenDropdown(item.id)}
                      className="flex items-center hover:text-[#cfe9ff] transition-colors font-medium"
                    >
                      {item.label}
                      <span className="ml-1 text-xs">▾</span>
                    </button>
                    {(openDropdown === item.id || mobileMenuOpen) && (
                      <div
                        className="absolute left-0 top-full mt-2 bg-white text-[#333] shadow-lg rounded-lg min-w-[220px] z-50"
                        onMouseLeave={() => setOpenDropdown(null)}
                      >
                        {item.submenu.map((subItem, index) => (
                          <Link
                            key={index}
                            href={subItem.href}
                            className="block px-4 py-3 hover:bg-[#cfe9ff] hover:text-[#1a5c7a] first:rounded-t-lg last:rounded-b-lg border-b last:border-b-0 border-gray-100"
                          >
                            {subItem.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link href={item.href} className="hover:text-[#cfe9ff] transition-colors font-medium">
                    {item.label}
                  </Link>
                )}
              </div>
            ))}

            <Link
              href="/yonetim-paneli"
              className="bg-[#cfe9ff] text-[#1a5c7a] px-4 py-2 rounded-lg font-bold hover:bg-white transition-colors"
            >
              Yönetim Paneli
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-white text-2xl p-2"
          >
            {mobileMenuOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="lg:hidden pb-4 border-t border-white/20 pt-4">
            <div className="flex flex-col space-y-2">
              <Link href="/" className="px-4 py-2 hover:bg-white/10 rounded" onClick={() => setMobileMenuOpen(false)}>
                Ana Sayfa
              </Link>
              {menuItems.map((item) => (
                <div key={item.id}>
                  {item.submenu ? (
                    <>
                      <button
                        onClick={() => handleDropdownToggle(item.id)}
                        className="w-full text-left px-4 py-2 hover:bg-white/10 rounded flex justify-between items-center"
                      >
                        <span>{item.label}</span>
                        <span className="text-xs">{openDropdown === item.id ? "▴" : "▾"}</span>
                      </button>
                      {openDropdown === item.id && (
                        <div className="ml-4 mt-1 space-y-1">
                          {item.submenu.map((subItem, index) => (
                            <Link
                              key={index}
                              href={subItem.href}
                              className="block px-4 py-2 hover:bg-white/10 rounded text-sm"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              {subItem.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      className="block px-4 py-2 hover:bg-white/10 rounded"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
              <Link
                href="/yonetim-paneli"
                className="mx-4 my-2 bg-[#cfe9ff] text-[#1a5c7a] px-4 py-2 rounded-lg font-bold text-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                Yönetim Paneli
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}

export default Header;