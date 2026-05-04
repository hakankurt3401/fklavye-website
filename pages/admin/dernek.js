import { useState } from 'react';

function ContentEditor({ value, onChange }) {
  const insertTag = (tag, attributes = '') => {
    const newValue = value + `<${tag}${attributes}>Metin</${tag}>`;
    onChange(newValue);
  };

  const insertLink = () => {
    const url = prompt('Link URL:');
    if (url) {
      const newValue = value + `<a href="${url}" class="text-blue-600 hover:underline">Link</a>`;
      onChange(newValue);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap gap-1 mb-2 p-2 bg-gray-100 rounded-lg">
        <button type="button" onClick={() => insertTag('b')} className="px-3 py-1 bg-white border rounded font-bold hover:bg-gray-50" title="Kalın">B</button>
        <button type="button" onClick={() => insertTag('i')} className="px-3 py-1 bg-white border rounded italic hover:bg-gray-50" title="İtalik">I</button>
        <button type="button" onClick={() => insertTag('u')} className="px-3 py-1 bg-white border rounded underline hover:bg-gray-50" title="Altı Çizili">U</button>
        <span className="w-px h-6 bg-gray-300 mx-1 self-center"></span>
        <button type="button" onClick={() => insertTag('p', " style='text-align:left'")} className="px-3 py-1 bg-white border rounded hover:bg-gray-50" title="Sola Yasla">⬅</button>
        <button type="button" onClick={() => insertTag('p', " style='text-align:center'")} className="px-3 py-1 bg-white border rounded hover:bg-gray-50" title="Ortala">⬌</button>
        <button type="button" onClick={() => insertTag('p', " style='text-align:right'")} className="px-3 py-1 bg-white border rounded hover:bg-gray-50" title="Sağa Yasla">➡</button>
        <span className="w-px h-6 bg-gray-300 mx-1 self-center"></span>
        <button type="button" onClick={insertLink} className="px-3 py-1 bg-blue-500 text-white border border-blue-500 rounded hover:bg-blue-600" title="Link Ekle">🔗 Link</button>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows="10"
        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600 font-mono text-sm"
        placeholder="İçeriği buraya yazın..."
      />
      <p className="text-xs text-gray-500 mt-1">
        HTML etiketleri kullanabilirsiniz. Linkler otomatik olarak tıklanabilir.
      </p>
    </div>
  );
}

export default function DernekManager() {
  const [items, setItems] = useState([
    { id: 1, title: 'Başkanın Mesajı', content: 'Başkanın mesajı içeriği...', date: '2024-01-01', order: 0 },
    { id: 2, title: 'Tarihçemiz', content: 'Derneğimizin tarihi hakkında bilgi...', date: '2024-01-01', order: 1 },
    { id: 3, title: 'Tüzük', content: 'Dernek tüzüğü içeriği...', date: '2024-01-01', order: 2 },
    { id: 4, title: 'Yönetim Kurulu', content: 'Yönetim kurulu üyeleri...', date: '2024-01-01', order: 3 },
    { id: 5, title: 'Denetim Kurulu', content: 'Denetim kurulu üyeleri...', date: '2024-01-01', order: 4 },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({ title: '', content: '', date: '' });
  const [activeSub, setActiveSub] = useState('Başkanın Mesajı');

  const subItems = ['Başkanın Mesajı', 'Tarihçemiz', 'Tüzük', 'Yönetim Kurulu', 'Denetim Kurulu'];

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
        <h1 className="text-2xl font-bold text-gray-800">Derneğimiz Yönetimi</h1>
        <button 
          onClick={openAddModal}
          className="bg-sky-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-sky-700"
        >
          + Yeni İçerik Ekle
        </button>
      </div>

      {/* Sub Menu */}
      <div className="flex flex-wrap gap-2 mb-6 bg-white p-2 rounded-lg">
        {subItems.map((sub) => (
          <button
            key={sub}
            onClick={() => setActiveSub(sub)}
            className={`px-4 py-2 rounded font-medium ${
              activeSub === sub ? 'bg-sky-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            {sub}
          </button>
        ))}
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
                      <button onClick={() => index > 0 && moveItem(item.id, 'up')} className="text-gray-400 hover:text-sky-600 text-xs" disabled={index === 0}>▲</button>
                      <button onClick={() => index < sortedItems.length - 1 && moveItem(item.id, 'down')} className="text-gray-400 hover:text-sky-600 text-xs" disabled={index === sortedItems.length - 1}>▼</button>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 font-medium text-gray-800">{item.title}</td>
                <td className="px-4 py-4 text-gray-500 text-sm">{item.date}</td>
                <td className="px-4 py-4">
                  <div className="flex justify-center gap-2">
                    <button onClick={() => openEditModal(item)} className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600">Düzenle</button>
                    <button onClick={() => deleteItem(item.id)} className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600">Sil</button>
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
                <input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600" />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2 text-gray-700">Tarih</label>
                <input type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600" />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2 text-gray-700">İçerik</label>
                <ContentEditor value={formData.content} onChange={(content) => setFormData({...formData, content})} />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={handleSave} className="flex-1 bg-sky-600 text-white py-3 rounded-lg font-bold hover:bg-sky-700">Kaydet</button>
              <button onClick={() => setShowModal(false)} className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-bold hover:bg-gray-300">İptal</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
