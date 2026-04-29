import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { getNews, getAnnouncements, getGallery, getVideos } from '../lib/supabase';

export default function Home() {
  const [currentAnnouncement, setCurrentAnnouncement] = useState(0);
  const [news, setNews] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [galleryImages, setGalleryImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [newsData, announcementsData, galleryData, videosData] = await Promise.all([
        getNews(),
        getAnnouncements(),
        getGallery(),
        getVideos()
      ]);
      setNews(newsData || []);
      setAnnouncements(announcementsData || []);
      setGalleryImages(galleryData || []);
      setVideos(videosData || []);
    } catch (error) {
      console.error('Veri yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (news.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % news.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [news]);

  useEffect(() => {
    if (announcements.length === 0) return;
    const timer = setInterval(() => {
      setCurrentAnnouncement((prev) => (prev + 1) % announcements.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [announcements]);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const goToSlide = (index) => setCurrentSlide(index);
  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % news.length);
  const prevSlide = () => setCurrentSlide((prev) => prev === 0 ? news.length - 1 : prev - 1);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-800 mx-auto mb-4"></div>
            <p className="text-gray-600">Yükleniyor...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* HABERLER Başlığı */}
      <section className="bg-blue-800 py-3 border-b border-blue-700">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-xl font-bold text-white text-center">HABERLER</h2>
        </div>
      </section>

      {/* Kayan Haberler */}
      <section className="bg-blue-200 py-5 border-b border-blue-300">
        <div className="max-w-7xl mx-auto px-4">
          {news.length === 0 ? (
            <div className="bg-white rounded-xl shadow p-8 text-center text-gray-500">
              Henüz haber eklenmemiş.
            </div>
          ) : (
            <div className="relative">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="flex flex-col lg:flex-row">
                  <div className="lg:w-1/2 p-6 flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="bg-blue-800 text-white px-3 py-1 rounded font-bold text-sm">HABER</span>
                      <span className="text-gray-500 text-sm">{formatDate(news[currentSlide]?.date)}</span>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">{news[currentSlide]?.title}</h3>
                    <p className="text-gray-600 text-base line-clamp-4 mb-4">
                      {news[currentSlide]?.description?.replace(/<[^>]*>/g, '').substring(0, 200)}...
                    </p>
                    <Link href={`/haber/${news[currentSlide]?.id}`} className="bg-blue-800 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-900 w-fit text-base inline-block">
                      Devamını Oku →
                    </Link>
                  </div>
                  <div className="lg:w-1/2 bg-blue-100 flex items-center justify-center min-h-72 lg:min-h-96 overflow-hidden">
                    {news[currentSlide]?.image_url ? (
                      <img 
                        src={news[currentSlide].image_url} 
                        alt={news[currentSlide]?.title} 
                        className="w-full h-full object-contain" 
                        style={{ maxHeight: '360px' }}
                      />
                    ) : (
                      <div className="text-center p-4">
                        <span className="text-5xl">📷</span>
                        <p className="text-gray-500 text-sm mt-2">Haber görseli</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {news.length > 1 && (
                <>
                  <button 
                    onClick={prevSlide}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full shadow flex items-center justify-center text-gray-700 font-bold z-10"
                  >
                    ❮
                  </button>
                  <button 
                    onClick={nextSlide}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full shadow flex items-center justify-center text-gray-700 font-bold z-10"
                  >
                    ❯
                  </button>
                </>
              )}

              {news.length > 1 && (
                <div className="flex justify-center gap-2 mt-4">
                  {news.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className={`w-2 h-2 rounded-full transition-all ${index === currentSlide ? 'bg-blue-800 w-6' : 'bg-blue-400'}`}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Duyurular */}
      <section className="py-6 bg-blue-100">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-xl font-bold mb-4 text-blue-800">DUYURULAR</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {announcements.slice(0, 5).map((item, index) => (
              <a key={item.id} href={`/duyuru/${item.id}`} className={`p-4 rounded-xl border-2 transition-all block ${index === currentAnnouncement ? 'bg-blue-200 border-blue-500 shadow-lg' : 'bg-white border-blue-200 hover:border-blue-400'}`}>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">📢</span>
                  <span className="text-sm text-blue-600">{item.date}</span>
                </div>
                <p className="font-medium text-gray-800 text-base">{item.title}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* F KLAVYE'NİN ÖZELLİKLERİ */}
      <section className="py-6 bg-blue-200">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-xl font-bold mb-4 text-blue-800 text-center">F KLAVYE'NİN ÖZELLİKLERİ</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-5 shadow-lg hover:shadow-xl transition-shadow text-center">
              <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-3xl">🌍</span>
              </div>
              <h3 className="text-lg font-bold text-blue-800 mb-2">Türkçe Uyumluluğu</h3>
              <p className="text-gray-600 text-base">F klavye, Türkçeye özgü olarak geliştirilmiş bir klavye düzenidir.</p>
            </div>
            <div className="bg-white rounded-xl p-5 shadow-lg hover:shadow-xl transition-shadow text-center">
              <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-3xl">⚖️</span>
              </div>
              <h3 className="text-lg font-bold text-blue-800 mb-2">Eşit Dağılım</h3>
              <p className="text-gray-600 text-base">Harfler, sağ ve sol eller arasında dengeli dağıtılmıştır.</p>
            </div>
            <div className="bg-white rounded-xl p-5 shadow-lg hover:shadow-xl transition-shadow text-center">
              <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-3xl">⚡</span>
              </div>
              <h3 className="text-lg font-bold text-blue-800 mb-2">Hızlı Yazma</h3>
              <p className="text-gray-600 text-base">Türkçe kelimelerde sık kullanılan harfler kolay tuşlara yerleştirilmiştir.</p>
            </div>
          </div>
          <div className="text-center mt-4">
            <Link href="/sayfa/f-klavyenin-ozellikleri" className="inline-block bg-blue-800 text-white px-5 py-2 rounded-lg font-bold hover:bg-blue-900 text-base">Tüm Özellikler</Link>
          </div>
        </div>
      </section>

      {/* Galeri */}
      <section className="py-4 bg-blue-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-blue-800">GALERİ</h2>
            <Link href="/sayfa/galeri" className="text-blue-600 hover:underline text-sm">Tümünü Gör →</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {galleryImages.slice(0, 4).map((album) => {
              const images = typeof album.images === 'string' ? JSON.parse(album.images || '[]') : (album.images || []);
              return (
              <Link key={album.id} href="/sayfa/galeri">
                <div className="bg-white rounded-lg overflow-hidden shadow hover:shadow-md transition-shadow cursor-pointer">
                  <div className="aspect-video bg-blue-100 overflow-hidden relative">
                    {images.length > 0 ? (
                      images.length === 1 ? (
                        <img src={images[0]} alt={album.title} className="object-cover w-full h-full" />
                      ) : (
                        <div className="flex w-full h-full">
                          {images.slice(0, 4).map((img, i) => (
                            <div key={i} className="w-1/2 h-1/2 overflow-hidden">
                              <img src={img} alt="" className="w-full h-full object-cover" />
                            </div>
                          ))}
                        </div>
                      )
                    ) : (
                      <div className="flex items-center justify-center w-full h-full">
                        <span className="text-2xl">📷</span>
                      </div>
                    )}
                    {images.length > 0 && (
                      <div className="absolute bottom-1 right-1 bg-blue-800 text-white px-1.5 py-0.5 rounded text-xs">
                        {images.length}
                      </div>
                    )}
                  </div>
                  <div className="p-2">
                    <p className="font-medium text-gray-800 text-sm line-clamp-1">{album.title}</p>
                  </div>
                </div>
              </Link>
            )})}
          </div>
        </div>
      </section>

      {/* Videolar */}
      <section className="py-6 bg-blue-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-blue-800">VİDEOLAR</h2>
            <Link href="/sayfa/videolar" className="text-blue-600 hover:underline text-base">Tümünü Gör →</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {videos.slice(0, 3).map((video) => (
              <div key={video.id} className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                <div className="aspect-video bg-blue-100 relative">
                  {video.url && video.url.includes('.mp4') ? (
                    <video 
                      src={video.url} 
                      className="w-full h-full object-cover"
                      controls
                      title={video.title}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-4xl">🎬</span>
                    </div>
                  )}
                  {video.duration && (
                    <span className="absolute bottom-2 right-2 bg-blue-800 text-white px-2 py-1 rounded text-sm">{video.duration}</span>
                  )}
                </div>
                <div className="p-3">
                  <p className="font-medium text-gray-800 text-base">{video.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}