import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { getGallery } from '../../lib/supabase';

export default function Galeri() {
  const [albums, setAlbums] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await getGallery();
      setAlbums(data || []);
    } catch (error) {
      console.error('Galeri yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const openAlbum = (album) => {
    setSelectedAlbum(album);
    setCurrentImageIndex(0);
  };

  const closeAlbum = () => {
    setSelectedAlbum(null);
  };

  const nextImage = () => {
    if (selectedAlbum && selectedAlbum.images) {
      setCurrentImageIndex((prev) => 
        prev === selectedAlbum.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (selectedAlbum && selectedAlbum.images) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? selectedAlbum.images.length - 1 : prev - 1
      );
    }
  };

  if (loading) {
    return (
      <Layout title="Galeri - F Klavye Uçan Parmaklar Derneği">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="bg-white rounded-xl shadow p-6 text-center">
            <p>Yükleniyor...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Galeri - F Klavye Uçan Parmaklar Derneği">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-2xl font-bold text-blue-800 mb-6">Galeri</h2>
          
          {albums.length === 0 ? (
            <p className="text-gray-500">Henüz albüm eklenmemiş.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {albums.map((album) => {
                const images = typeof album.images === 'string' ? JSON.parse(album.images || '[]') : (album.images || []);
                return (
                <div 
                  key={album.id} 
                  className="bg-blue-50 rounded-lg overflow-hidden border border-blue-100 cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => openAlbum(album)}
                >
                  <div className="aspect-video bg-gray-200 overflow-hidden relative">
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
                        <span className="text-4xl">📷</span>
                      </div>
                    )}
                    {images.length > 0 && (
                      <div className="absolute bottom-2 right-2 bg-blue-800 text-white px-2 py-1 rounded text-xs">
                        {images.length} resim
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="font-bold text-gray-800">{album.title}</h3>
                    {album.content && (
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">{album.content.replace(/<[^>]*>/g, '')}</p>
                    )}
                  </div>
                </div>
              )})}
            </div>
          )}
        </div>
      </div>

      {/* Lightbox */}
      {selectedAlbum && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4" onClick={closeAlbum}>
          <div className="bg-white rounded-xl max-w-6xl w-full max-h-[95vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b flex-shrink-0">
              <div>
                <h3 className="text-xl font-bold text-gray-800">{selectedAlbum.title}</h3>
                {selectedAlbum.content && (
                  <p className="text-sm text-gray-600">{selectedAlbum.content.replace(/<[^>]*>/g, '')}</p>
                )}
              </div>
              <button onClick={closeAlbum} className="text-gray-500 hover:text-gray-700 text-2xl">✕</button>
            </div>
            
            <div className="flex-1 overflow-auto relative bg-black flex items-center justify-center" style={{ minHeight: '400px' }}>
              {selectedAlbum.images && selectedAlbum.images.length > 0 ? (
                <>
                  <img 
                    src={selectedAlbum.images[currentImageIndex]} 
                    alt={selectedAlbum.title}
                    className="max-w-full max-h-[60vh] object-contain"
                    style={{ maxHeight: '60vh' }}
                  />
                  {selectedAlbum.images.length > 1 && (
                    <>
                      <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-3 text-gray-700 font-bold">❮</button>
                      <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-3 text-gray-700 font-bold">❯</button>
                    </>
                  )}
                </>
              ) : (
                <div className="text-white text-center">
                  <span className="text-6xl">📷</span>
                  <p className="mt-2">Bu albümde resim yok</p>
                </div>
              )}
            </div>
            
            {selectedAlbum.images && selectedAlbum.images.length > 1 && (
              <div className="p-4 border-t bg-gray-50 flex-shrink-0">
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {selectedAlbum.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentImageIndex(i)}
                      className={`flex-shrink-0 w-16 h-16 rounded overflow-hidden border-2 transition-all ${
                        i === currentImageIndex ? 'border-blue-500 ring-2 ring-blue-300' : 'border-gray-200'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
                <p className="text-center text-sm text-gray-500 mt-2">
                  {currentImageIndex + 1} / {selectedAlbum.images.length}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </Layout>
  );
}