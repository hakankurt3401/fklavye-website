import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import NewsManager from './news';
import GalleryManager from './gallery';
import VideoManager from './videos';
import MessagesManager from './messages';
import VisitorsManager from './visitors';
import BackupManager from './backup';
import Settings from './settings';
import ContentManagers from './content';

export default function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [loginError, setLoginError] = useState('');

  const VALID_USERNAME = 'fklavye';
  const VALID_PASSWORD = 'Fklavye-2026!';

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === VALID_USERNAME && password === VALID_PASSWORD) {
      setIsLoggedIn(true);
      setLoginError('');
    } else {
      setLoginError('Kullanıcı adı veya şifre hatalı!');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
    setCurrentPage('dashboard');
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-600 to-sky-700 flex items-center justify-center p-4">
        <Head>
          <title>Yönetim Paneli - Giriş</title>
        </Head>
        <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full">
          <div className="text-center mb-6">
            <div className="relative w-20 h-20 mx-auto mb-4">
              <Image src="/logo.png" alt="Logo" fill className="object-contain rounded-full" />
            </div>
            <h1 className="text-2xl font-bold text-sky-700">Yönetim Paneli</h1>
            <p className="text-gray-500 text-sm mt-1">F Klavye Uçan Parmaklar Derneği</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-bold mb-2 text-gray-700">Kullanıcı Adı</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2 text-gray-700">Şifre</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600"
                required
              />
            </div>
            {loginError && (
              <p className="text-red-500 text-sm text-center">{loginError}</p>
            )}
            <button
              type="submit"
              className="w-full bg-sky-600 text-white py-3 rounded-lg font-bold hover:bg-sky-700 transition-colors"
            >
              Giriş Yap
            </button>
          </form>
        </div>
      </div>
    );
  }

  const menuItems = [
    { id: 'dashboard', label: 'Ana Sayfa', icon: '🏠' },
    { id: 'news', label: 'Haberler', icon: '📰', submenu: ['Haberler', 'Duyurular', 'Basın Bültenleri'] },
    { id: 'content', label: 'İçerikler', icon: '📝', submenu: ['Derneğimiz', 'İntersteno-Türk', 'F Klavye', 'İletişim'] },
    { id: 'gallery', label: 'Galeri', icon: '🖼️' },
    { id: 'videos', label: 'Videolar', icon: '🎬' },
    { id: 'messages', label: 'Mesajlar', icon: '📬' },
    { id: 'visitors', label: 'Ziyaretçiler', icon: '👥' },
    { id: 'backup', label: 'Yedekleme', icon: '💾' },
    { id: 'settings', label: 'Ayarlar', icon: '⚙️' },
  ];

  const renderContent = () => {
    switch (currentPage) {
      case 'news': return <NewsManager />;
      case 'gallery': return <GalleryManager />;
      case 'videos': return <VideoManager />;
      case 'messages': return <MessagesManager />;
      case 'visitors': return <VisitorsManager />;
      case 'backup': return <BackupManager />;
      case 'settings': return <Settings />;
      case 'content': return <ContentManagers />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>Yönetim Paneli</title>
      </Head>

      {/* Header - Üst Menü */}
      <header className="bg-sky-700 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10">
                <Image src="/logo.png" alt="Logo" fill className="object-contain rounded-full" />
              </div>
              <span className="text-xl font-bold">Yönetim Paneli</span>
            </div>
            
            <div className="flex items-center gap-4">
              <Link href="/" className="text-sm hover:text-sky-200">Siteyi Görüntüle</Link>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded font-bold text-sm transition-colors"
              >
                Çıkış Yap
              </button>
            </div>
          </div>
        </div>
        
        {/* Üst Menü */}
        <nav className="bg-sky-800">
          <div className="max-w-7xl mx-auto px-4">
            <ul className="flex flex-wrap items-center gap-1 py-2 text-sm">
              {menuItems.map((item) => (
                <li key={item.id} className="relative group">
                  <button
                    onClick={() => setCurrentPage(item.id)}
                    className={`px-4 py-2 rounded font-medium flex items-center gap-2 transition-colors ${
                      currentPage === item.id
                        ? 'bg-sky-700 font-bold'
                        : 'hover:bg-sky-700'
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                    {item.submenu && <span className="text-xs">▾</span>}
                  </button>
                  {item.submenu && (
                    <div className="absolute left-0 top-full mt-1 bg-white text-gray-800 shadow-lg rounded-lg min-w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                      {item.submenu.map((sub, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentPage(item.id)}
                          className="w-full text-left px-4 py-2 hover:bg-sky-50 first:rounded-t last:rounded-b text-sm"
                        >
                          {sub}
                        </button>
                      ))}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {renderContent()}
      </main>
    </div>
  );
}

function Dashboard() {
  const stats = [
    { label: 'Toplam Haber', value: '12', icon: '📰' },
    { label: 'Galeri Öğesi', value: '24', icon: '🖼️' },
    { label: 'Video', value: '8', icon: '🎬' },
    { label: 'Okunmamış Mesaj', value: '3', icon: '📬' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Hoş Geldiniz</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-sky-600">{stat.value}</p>
                <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
              </div>
              <span className="text-4xl">{stat.icon}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}