import { useState } from 'react';

export default function IletisimManager() {
  const [items, setItems] = useState([
    { id: 1, title: 'İletişim Bilgileri', content: 'Adres:...\nTelefon:...\nE-posta:...', date: '2024-01-01', order: 1 },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({ title: '', content: '', date: '' });

  const moveItem = (id, direction) => {
    const sortedItems = [...items].sort((a, b) => (a.order || 0) - (b.order || 0));
    const index = sortedItems.findIndex(item => item.id === id);
    
    if (direction === 'up' && index > 0) {
      const temp = sortedItems[index].order;
      sortedItems[index].order = sortedItems[index - 1].order;
      sortedItems[index - 1].order = temp;
    } else if (direction === 'down' && index < sortedItems.length - 1) {
      const temp = sortedItems[index].order;
      sortedItems[index].order = sortedItems[index + 1].order;
      sortedItems[index + 1].order = temp;
    }
    
    setItems(sortedItems);
  };

  const deleteItem = (id) => {
    if (confirm('Bu içeriği silmek istediğinizden emin misiniz?')) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({ title: '', content: '', date: new Date().toISOString().split('T')[0] });
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({ title: item.title, content: item.content, date: item.date });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!formData.title || !formData.content) {
      alert('Lütfen tüm alanları doldurun!');
      return;
    }

    if (editingItem) {
      setItems(items.map(item => 
        item.id === editingItem.id 
          ? { ...item, ...formData } 
          : item
      ));
    } else {
      const newId = Math.max(...items.map(n => n.id)) + 1;
      setItems([...items, { id: newId, ...formData, order: items.length + 1 }]);
    }
    setShowModal(false);
  };

  const sortedItems = [...items].sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">İletişim Yönetimi</h1>
        <button 
          onClick={openAddModal}
          className="bg-sky-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-sky-700"
        >
          + Yeni İçerik Ekle
        </button>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sıra</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Başlık</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tarih</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sortedItems.map((item, index) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sky-600">{index + 1}</span>
                    <div className="flex flex-col">
                      <button
                        onClick={() => index > 0 && moveItem(item.id, 'up')}
                        className="text-gray-400 hover:text-sky-600 text-xs"
                        disabled={index === 0}
                      >
                        ▲
                      </button>
                      <button
                        onClick={() => index < sortedItems.length - 1 && moveItem(item.id, 'down')}
                        className="text-gray-400 hover:text-sky-600 text-xs"
                        disabled={index === sortedItems.length - 1}
                      >
                        ▼
                      </button>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 font-medium text-gray-800">{item.title}</td>
                <td className="px-4 py-4 text-gray-500 text-sm">{item.date}</td>
                <td className="px-4 py-4">
                  <div className="flex justify-center gap-2">
                    <button 
                      onClick={() => openEditModal(item)}
                      className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                    >
                      Düzenle
                    </button>
                    <button
                      onClick={() => deleteItem(item.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                    >
                      Sil
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {sortedItems.length === 0 && (
          <p className="text-center text-gray-500 py-8">Henüz içerik eklenmemiş.</p>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              {editingItem ? 'İçerik Düzenle' : 'Yeni İçerik Ekle'}
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
                <label className="block text-sm font-bold mb-2 text-gray-700">Tarih</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2 text-gray-700">İçerik (HTML destekli)</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  rows="10"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600 font-mono text-sm"
                  placeholder="İçeriği buraya yazın. Linkler otomatik olarak tıklanabilir hale dönüştürülecektir."
                />
                <p className="text-xs text-gray-500 mt-1">
                  HTML etiketleri kullanabilirsiniz. Linkler otomatik olarak tıklanabilir.
                </p>
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
