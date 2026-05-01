import { useState, useEffect } from 'react';
import { getVideos, saveVideos } from '../../lib/siteData';
import { supabase } from '../../lib/supabase';

export default function VideoManager() {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const loadVideos = async () => {
      const loaded = await getVideos();
      setVideos(loaded);
    };
    loadVideos();
  }, []);

  // Auto-save kaldırıldı - sadece kullanıcı action yaptığında kaydet

  const moveItem = async (id, direction) => {
    const sortedVideos = [...videos].sort((a, b) => (a.sort_order || a.order || 0) - (b.sort_order || b.order || 0));
    const index = sortedVideos.findIndex(item => item.id === id);
    
    let swapIndex = direction === 'up' ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= sortedVideos.length) return;
    
    const video1 = sortedVideos[index];
    const video2 = sortedVideos[swapIndex];
    
    const sort1 = video1.sort_order || video1.order || 0;
    const sort2 = video2.sort_order || video2.order || 0;
    
    await supabase
      .from('videos')
      .update({ sort_order: sort1 })
      .eq('id', video2.id);
    
    await supabase
      .from('videos')
      .update({ sort_order: sort2 })
      .eq('id', video1.id);
    
    const { data } = await supabase.from('videos').select('*').order('sort_order', { ascending: true });
    setVideos(data || []);
  };

  const deleteItem = async (id) => {
    if (confirm('Bu videoyu silmek istediğinizden emin misiniz?')) {
      await supabase.from('videos').delete().eq('id', id);
      setVideos(videos.filter(item => item.id !== id));
    }
  };

  const [showModal, setShowModal] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);
  const [formData, setFormData] = useState({ title: '', duration: '', url: '' });

  const openAddModal = () => {
    setEditingVideo(null);
    setFormData({ title: '', duration: '', url: '' });
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setEditingVideo(item);
    setFormData({ title: item.title, duration: item.duration, url: item.url || '' });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!formData.title || !formData.duration) {
      alert('Lütfen başlık ve süre alanlarını doldurun!');
      return;
    }

    let newVideos;
    if (editingVideo) {
      newVideos = videos.map(item => 
        item.id === editingVideo.id 
          ? { ...item, ...formData } 
          : item
      );
    } else {
      const newId = Math.max(...videos.map(n => n.id || 0), 0) + 1;
      newVideos = [...videos, { id: -newId, ...formData, order: videos.length + 1 }];
    }
    setVideos(newVideos);
    const result = await saveVideos(newVideos);
    if (result) setVideos(result);
    setShowModal(false);
    alert('Kaydedildi!');
  };

  const sortedVideos = [...videos].sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Videolar Yönetimi</h1>
        <button 
          onClick={openAddModal}
          className="bg-sky-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-sky-700"
        >
          + Yeni Video Ekle
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedVideos.map((item, index) => (
          <div key={item.id} className="bg-white rounded-xl shadow overflow-hidden">
            <div className="aspect-video bg-sky-100 flex items-center justify-center relative">
              <span className="text-5xl">🎬</span>
              <span className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs">
                {item.duration}
              </span>
              <div className="absolute top-2 left-2 flex flex-col gap-1">
                <button
                  onClick={() => index > 0 && moveItem(item.id, 'up')}
                  className="bg-white bg-opacity-75 p-1 rounded text-xs hover:bg-opacity-100 disabled:opacity-50"
                  disabled={index === 0}
                  title="Yukarı Taşı"
                >
                  ▲
                </button>
                <button
                  onClick={() => index < sortedVideos.length - 1 && moveItem(item.id, 'down')}
                  className="bg-white bg-opacity-75 p-1 rounded text-xs hover:bg-opacity-100 disabled:opacity-50"
                  disabled={index === sortedVideos.length - 1}
                  title="Aşağı Taşı"
                >
                  ▼
                </button>
              </div>
            </div>
            <div className="p-4">
              <p className="font-bold text-gray-800">{item.title}</p>
              <p className="text-sm text-gray-500">Süre: {item.duration}</p>
              <div className="flex gap-2 mt-3">
                <button 
                  onClick={() => openEditModal(item)}
                  className="flex-1 bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600"
                >
                  Düzenle
                </button>
                <button
                  onClick={() => deleteItem(item.id)}
                  className="flex-1 bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
                >
                  Sil
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {sortedVideos.length === 0 && (
        <p className="text-center text-gray-500 py-8">Henüz video eklenmemiş.</p>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              {editingVideo ? 'Video Düzenle' : 'Yeni Video Ekle'}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-2 text-gray-700">Başlık</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2 text-gray-700">Süre (dk:sn)</label>
                <input
                  type="text"
                  value={formData.duration}
                  onChange={(e) => setFormData({...formData, duration: e.target.value})}
                  placeholder="Ör: 5:32"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2 text-gray-700">Video URL (YouTube vb.)</label>
                <input
                  type="text"
                  value={formData.url}
                  onChange={(e) => setFormData({...formData, url: e.target.value})}
                  placeholder="https://..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600"
                />
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