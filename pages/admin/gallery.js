import { useState, useEffect } from 'react';
import { getGallery, saveGallery } from '../../lib/siteData';

export default function GalleryManager() {
  const [albums, setAlbums] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState(null);
  const [formData, setFormData] = useState({ title: '', content: '', images: '' });
  const [activeTab, setActiveTab] = useState('edit'); // 'edit' or 'add'

  useEffect(() => {
    const loadGallery = async () => {
      const loaded = await getGallery();
      setAlbums(loaded);
    };
    loadGallery();
  }, []);

  const moveItem = (id, direction) => {
    const sortedAlbums = [...albums].sort((a, b) => (a.order || 0) - (b.order || 0));
    const idx = sortedAlbums.findIndex(album => album.id === id);
    if (idx < 0) return;
    
    if (direction === 'up' && idx > 0) {
      const prev = sortedAlbums[idx - 1];
      const curr = sortedAlbums[idx];
      const tempOrder = prev.order;
      prev.order = curr.order;
      curr.order = tempOrder;
    } else if (direction === 'down' && idx < sortedAlbums.length - 1) {
      const next = sortedAlbums[idx + 1];
      const curr = sortedAlbums[idx];
      const tempOrder = next.order;
      next.order = curr.order;
      curr.order = tempOrder;
    } else return;
    
    const updated = albums.map(album => {
      if (album.id === prev?.id) return prev;
      if (album.id === curr?.id) return curr;
      return album;
    });
    
    setAlbums(updated);
    saveGallery(updated);
  };

  const deleteItem = (id) => {
    if (!confirm('Bu albümü silmek istediğinizden emin misiniz?')) return;
    const newAlbums = albums.filter(album => album.id !== id);
    setAlbums(newAlbums);
    saveGallery(newAlbums);
  };

  const openAddModal = () => {
    setEditingAlbum(null);
    setFormData({ title: '', content: '', images: '' });
    setActiveTab('add');
    setShowModal(true);
  };

  const openEditModal = (album) => {
    setEditingAlbum(album);
    setFormData({ 
      title: album.title || '', 
      content: album.content || '', 
      images: (album.images || []).join('\n')
    });
    setActiveTab('edit');
    setShowModal(true);
  };

  const handleSave = () => {
    if (!formData.title) {
      alert('Başlık gerekli!');
      return;
    }

    const imageList = formData.images
      ? formData.images.split('\n').filter(url => url.trim())
      : [];

    let newAlbums;
    if (editingAlbum) {
      newAlbums = albums.map(album => 
        album.id === editingAlbum.id 
          ? { 
              ...album, 
              title: formData.title, 
              content: formData.content,
              images: imageList
            }
          : album
      );
    } else {
      const newId = Math.max(...albums.map(n => n.id), 0) + 1;
      newAlbums = [...albums, { 
        id: newId, 
        title: formData.title, 
        content: formData.content,
        images: imageList,
        order: albums.length + 1 
      }];
    }
    setAlbums(newAlbums);
    saveGallery(newAlbums);
    setShowModal(false);
    alert('Kaydedildi!');
  };

  const sortedAlbums = [...albums].sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Galeri Yönetimi</h1>
        <button 
          onClick={openAddModal}
          className="bg-sky-600 text-white px-5 py-2 rounded-lg font-bold hover:bg-sky-700"
        >
          + Yeni Albüm Ekle
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedAlbums.map((album, index) => (
          <div key={album.id} className="bg-white rounded-xl shadow overflow-hidden">
            {/* Albüm Önizleme */}
            <div className="aspect-video bg-sky-100 flex items-center justify-center relative overflow-hidden">
              {album.images && album.images.length > 0 ? (
                album.images.length === 1 ? (
                  <img src={album.images[0]} alt={album.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="flex w-full h-full">
                    {album.images.slice(0, 4).map((img, i) => (
                      <div key={i} className="w-1/2 h-1/2 overflow-hidden">
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                )
              ) : (
                <span className="text-5xl">📷</span>
              )}
              <div className="absolute top-2 right-2 flex flex-col gap-1">
                <button
                  onClick={() => moveItem(album.id, 'up')}
                  className="bg-white bg-opacity-75 p-1 rounded text-xs hover:bg-opacity-100 disabled:opacity-50"
                  disabled={index === 0}
                  title="Yukarı"
                >
                  ▲
                </button>
                <span className="text-xs font-bold text-center bg-white bg-opacity-75 px-1 rounded">{index + 1}</span>
                <button
                  onClick={() => moveItem(album.id, 'down')}
                  className="bg-white bg-opacity-75 p-1 rounded text-xs hover:bg-opacity-100 disabled:opacity-50"
                  disabled={index === sortedAlbums.length - 1}
                  title="Aşağı"
                >
                  ▼
                </button>
              </div>
              <div className="absolute bottom-2 left-2 bg-blue-800 text-white px-2 py-1 rounded text-xs">
                {album.images ? album.images.length : 0} resim
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-gray-800 text-lg mb-1">{album.title}</h3>
              {album.content && (
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{album.content.replace(/<[^>]*>/g, '')}</p>
              )}
              <div className="flex gap-2">
                <button 
                  onClick={() => openEditModal(album)}
                  className="flex-1 bg-blue-500 text-white px-3 py-2 rounded-lg text-sm hover:bg-blue-600"
                >
                  Düzenle
                </button>
                <button
                  onClick={() => deleteItem(album.id)}
                  className="bg-red-500 text-white px-3 py-2 rounded-lg text-sm hover:bg-red-600"
                >
                  Sil
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {sortedAlbums.length === 0 && (
        <p className="text-center text-gray-500 py-8">Henüz albüm eklenmemiş.</p>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              {editingAlbum ? 'Albüm Düzenle' : 'Yeni Albüm Ekle'}
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-2 text-gray-700">Albüm Başlığı *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600"
                  placeholder="Albüm başlığı"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2 text-gray-700">Albüm İçeriği</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600"
                  placeholder="Albüm açıklaması (opsiyonel)"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2 text-gray-700">Resim URL'leri (Her satıra bir URL)</label>
                <textarea
                  value={formData.images}
                  onChange={(e) => setFormData({...formData, images: e.target.value})}
                  rows={6}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600 text-sm"
                  placeholder="https://ornek.com/resim1.jpg&#10;https://ornek.com/resim2.jpg&#10;https://ornek.com/resim3.jpg"
                />
                <p className="text-xs text-gray-500 mt-1">Her satıra bir resim URL'i yazın. Resimler sırasıyla gösterilecektir.</p>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSave}
                className="flex-1 bg-sky-600 text-white py-3 rounded-lg font-bold hover:bg-sky-700"
              >
                Kaydet
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-bold hover:bg-gray-300"
              >
                İptal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
