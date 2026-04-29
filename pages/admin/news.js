import { useState, useEffect, useRef } from 'react';
import { supabase, getNews, getAnnouncements, saveNews, saveAnnouncement, deleteNews, deleteAnnouncement } from '../../lib/supabase';

// Otomatik paragraf fonksiyonu
const formatContent = (text) => {
  if (!text) return '';
  const hasTableStart = text.indexOf('<table') !== -1;
  const hasTableEnd = text.indexOf('</table>') !== -1;
  const hasParagraphStart = text.indexOf('<p') !== -1;
  const hasParagraphEnd = text.indexOf('</p>') !== -1;
  if ((hasTableStart && hasTableEnd) || (hasParagraphStart && hasParagraphEnd)) {
    return text;
  }
  if (text.includes('table') && (text.includes('<td') || text.includes('<th'))) {
    return text;
  }
  return text
    .split(/\n{1,}/)
    .map(para => para.trim())
    .filter(para => para.length > 0)
    .map(para => `<p style="margin-bottom:15px;">${para.replace(/\n/g, '<br/>')}</p>`)
    .join('\n');
};

function ContentEditor({ value, onChange }) {
  const textareaRef = useRef(null);
  const getCursorPosition = () => {
    if (textareaRef.current) return textareaRef.current.selectionStart;
    return value.length;
  };
  const insertAtCursor = (before, after = '') => {
    const pos = getCursorPosition();
    const beforeText = value.substring(0, pos);
    const afterText = value.substring(pos);
    onChange(beforeText + before + after + afterText);
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(pos + before.length, pos + before.length);
      }
    }, 0);
  };
  const insertTag = (tag, attributes = '') => {
    const pos = getCursorPosition();
    const selectedText = value.substring(textareaRef.current?.selectionStart || pos, textareaRef.current?.selectionEnd || pos);
    const beforeText = value.substring(0, textareaRef.current?.selectionStart || pos);
    const afterText = value.substring(textareaRef.current?.selectionEnd || pos);
    if (selectedText) {
      onChange(beforeText + `<${tag}${attributes}>${selectedText}</${tag}>` + afterText);
    } else {
      onChange(beforeText + `<${tag}${attributes}>Metin</${tag}>` + afterText);
    }
  };
  const insertParagraph = () => insertAtCursor('<p style="margin-top:10px;margin-bottom:10px;">', '</p>');
  const insertLineBreak = () => insertAtCursor('<br/>');
  const insertTable = () => {
    const table = `<table style="border-collapse:collapse;width:100%;margin:10px 0;"><thead><tr style="background:#e0e7ff;"><th style="border:1px solid #ccc;padding:8px;">Başlık 1</th><th style="border:1px solid #ccc;padding:8px;">Başlık 2</th></tr></thead><tbody><tr><td style="border:1px solid #ccc;padding:8px;">Veri 1</td><td style="border:1px solid #ccc;padding:8px;">Veri 2</td></tr></tbody></table>`;
    insertAtCursor(table);
  };
  const insertLink = () => {
    const url = prompt('Link URL:');
    if (url) {
      const selectedText = value.substring(textareaRef.current?.selectionStart || 0, textareaRef.current?.selectionEnd || 0);
      if (selectedText) {
        insertTag('a href="' + url + '" class="text-blue-600 hover:underline"', '');
      } else {
        insertAtCursor(`<a href="${url}" class="text-blue-600 hover:underline">Link</a>`);
      }
    }
  };
  const convertLinks = () => {
    const urlRegex = /(https?:\/\/[^\s<]+)/g;
    onChange(value.replace(urlRegex, '<a href="$1" class="text-blue-600 hover:underline">$1</a>'));
  };
  const changeFontSize = (size) => {
    const pos = getCursorPosition();
    const selectedText = value.substring(textareaRef.current?.selectionStart || pos, textareaRef.current?.selectionEnd || pos);
    const beforeText = value.substring(0, textareaRef.current?.selectionStart || pos);
    const afterText = value.substring(textareaRef.current?.selectionEnd || pos);
    if (selectedText) {
      onChange(beforeText + `<span style="font-size:${size}">${selectedText}</span>` + afterText);
    } else {
      onChange(beforeText + `<span style="font-size:${size}">Metin</span>` + afterText);
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
        <span className="text-xs text-gray-500 self-center mr-1">Boyut:</span>
        <button type="button" onClick={() => changeFontSize('14px')} className="px-2 py-1 bg-white border rounded text-xs hover:bg-gray-50" title="Küçük">A</button>
        <button type="button" onClick={() => changeFontSize('16px')} className="px-2 py-1 bg-white border rounded text-sm hover:bg-gray-50" title="Normal">A</button>
        <button type="button" onClick={() => changeFontSize('20px')} className="px-2 py-1 bg-white border rounded text-base hover:bg-gray-50" title="Büyük">A</button>
        <button type="button" onClick={() => changeFontSize('24px')} className="px-2 py-1 bg-white border rounded text-lg hover:bg-gray-50" title="Çok Büyük">A</button>
        <span className="w-px h-6 bg-gray-300 mx-1 self-center"></span>
        <button type="button" onClick={insertParagraph} className="px-3 py-1 bg-white border rounded hover:bg-gray-50 font-bold" title="Paragraf">P</button>
        <button type="button" onClick={insertLineBreak} className="px-3 py-1 bg-white border rounded hover:bg-gray-50" title="Satır Sonu">↩</button>
        <span className="w-px h-6 bg-gray-300 mx-1 self-center"></span>
        <button type="button" onClick={insertTable} className="px-3 py-1 bg-green-500 text-white border border-green-500 rounded hover:bg-green-600" title="Tablo">📊</button>
        <button type="button" onClick={insertLink} className="px-3 py-1 bg-blue-500 text-white border border-blue-500 rounded hover:bg-blue-600" title="Link">🔗</button>
        <button type="button" onClick={convertLinks} className="px-3 py-1 bg-purple-500 text-white border border-purple-500 rounded hover:bg-purple-600" title="Linkleri Dönüştür">🔄</button>
      </div>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows="6"
        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600 font-mono text-sm"
        placeholder="İçeriği buraya yazın..."
      />
      <p className="text-xs text-gray-500 mt-1">Önizleme:</p>
      <div className="mt-2 p-4 bg-gray-50 border border-gray-200 rounded-lg min-h-[80px]">
        <div dangerouslySetInnerHTML={{ __html: value || '<span class="text-gray-400">İçerik önizlemesi...</span>' }} />
      </div>
    </div>
  );
}

export default function NewsManager() {
  const [news, setNews] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({ title: '', date: '', description: '', image_url: '', document_url: '', signature: '' });
  const [activeSub, setActiveSub] = useState('Haberler');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const loadedNews = await getNews();
      const loadedAnnouncements = await getAnnouncements();
      setNews(loadedNews || []);
      setAnnouncements(loadedAnnouncements || []);
    } catch (error) {
      console.error('Veri yüklenirken hata:', error);
    }
  };

  const openAddModal = (type) => {
    setEditingItem({ type, isNew: true });
    setFormData({ title: '', date: new Date().toISOString().split('T')[0], description: '', image_url: '', document_url: '', signature: '' });
    setShowModal(true);
  };

  const openEditModal = (item, type) => {
    setEditingItem({ ...item, type, isNew: false });
    setFormData({
      title: item.title || '',
      date: item.date,
      description: item.description || '',
      image_url: item.image_url || '',
      document_url: item.document_url || '',
      signature: item.signature || ''
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!formData.title || !formData.date) {
      alert('Lütfen başlık ve tarih alanlarını doldurun!');
      return;
    }

    const formattedDescription = formatContent(formData.description);

    try {
      if (editingItem.type === 'announcement') {
        const itemData = {
          title: formData.title,
          date: formData.date,
          description: formattedDescription,
          image_url: formData.image_url,
          document_url: formData.document_url,
          signature: formData.signature,
          item_order: editingItem.isNew ? (announcements.length + 1) : editingItem.item_order
        };
        if (editingItem.isNew) {
          await saveAnnouncement(itemData);
        } else {
          await saveAnnouncement({ ...itemData, id: editingItem.id });
        }
      } else {
        const itemData = {
          title: formData.title,
          date: formData.date,
          description: formattedDescription,
          image_url: formData.image_url,
          document_url: formData.document_url,
          signature: formData.signature,
          item_order: editingItem.isNew ? (news.length + 1) : editingItem.item_order
        };
        if (editingItem.isNew) {
          await saveNews(itemData);
        } else {
          await saveNews({ ...itemData, id: editingItem.id });
        }
      }
      await loadData();
      setShowModal(false);
      alert('Kaydedildi!');
    } catch (error) {
      console.error('Kaydetme hatası:', error);
      alert('Kaydetme sırasında hata oluştu!');
    }
  };

  const handleDelete = async (id, type) => {
    if (!confirm('Silmek istediğinizden emin misiniz?')) return;
    try {
      if (type === 'announcement') {
        await deleteAnnouncement(id);
      } else {
        await deleteNews(id);
      }
      await loadData();
      alert('Silindi!');
    } catch (error) {
      console.error('Silme hatası:', error);
      alert('Silme sırasında hata oluştu!');
    }
  };

  const moveNewsUp = async (index) => {
    if (index === 0) return;
    const sorted = [...news].sort((a, b) => (a.item_order || 0) - (b.item_order || 0));
    const currentItem = sorted[index];
    const prevItem = sorted[index - 1];
    try {
      await saveNews({ ...currentItem, item_order: prevItem.item_order });
      await saveNews({ ...prevItem, item_order: currentItem.item_order });
      await loadData();
    } catch (error) {
      console.error('Sıralama hatası:', error);
    }
  };

  const moveNewsDown = async (index) => {
    const sorted = [...news].sort((a, b) => (a.item_order || 0) - (b.item_order || 0));
    if (index >= sorted.length - 1) return;
    const currentItem = sorted[index];
    const nextItem = sorted[index + 1];
    try {
      await saveNews({ ...currentItem, item_order: nextItem.item_order });
      await saveNews({ ...nextItem, item_order: currentItem.item_order });
      await loadData();
    } catch (error) {
      console.error('Sıralama hatası:', error);
    }
  };

  const moveAnnouncementUp = async (id) => {
    const sorted = [...announcements].sort((a, b) => (a.item_order || 0) - (b.item_order || 0));
    const idx = sorted.findIndex(a => a.id === id);
    if (idx <= 0) return;
    const prev = sorted[idx - 1];
    const curr = sorted[idx];
    try {
      await saveAnnouncement({ ...prev, item_order: curr.item_order });
      await saveAnnouncement({ ...curr, item_order: prev.item_order });
      await loadData();
    } catch (error) {
      console.error('Sıralama hatası:', error);
    }
  };

  const moveAnnouncementDown = async (id) => {
    const sorted = [...announcements].sort((a, b) => (a.item_order || 0) - (b.item_order || 0));
    const idx = sorted.findIndex(a => a.id === id);
    if (idx < 0 || idx >= sorted.length - 1) return;
    const next = sorted[idx + 1];
    const curr = sorted[idx];
    try {
      await saveAnnouncement({ ...next, item_order: curr.item_order });
      await saveAnnouncement({ ...curr, item_order: next.item_order });
      await loadData();
    } catch (error) {
      console.error('Sıralama hatası:', error);
    }
  };

  const sortedAnnouncements = [...announcements].sort((a, b) => (a.item_order || 0) - (b.item_order || 0));
  const sortedNews = [...news].sort((a, b) => (a.item_order || 0) - (b.item_order || 0));

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Haberler Yönetimi</h1>
      </div>

      <div className="flex flex-wrap gap-2 mb-6 bg-white p-2 rounded-lg">
        {['Haberler', 'Duyurular', 'Basın Bültenleri'].map((sub) => (
          <button key={sub} onClick={() => setActiveSub(sub)} className={`px-4 py-2 rounded font-medium ${activeSub === sub ? 'bg-sky-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>
            {sub}
          </button>
        ))}
      </div>

      {activeSub === 'Haberler' && (
        <div>
          <div className="mb-4">
            <button onClick={() => openAddModal('news')} className="bg-sky-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-sky-700">+ Yeni Haber Ekle</button>
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
                {sortedNews.map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-2 py-4">
                      <div className="flex items-center gap-1">
                        <button onClick={() => moveNewsUp(index)} className="p-1 bg-gray-100 hover:bg-gray-200 rounded text-gray-600" title="Yukarı">▲</button>
                        <span className="font-bold text-sky-600 w-6 text-center">{index + 1}</span>
                        <button onClick={() => moveNewsDown(index)} className="p-1 bg-gray-100 hover:bg-gray-200 rounded text-gray-600" title="Aşağı">▼</button>
                      </div>
                    </td>
                    <td className="px-4 py-4 font-medium text-gray-800">{item.title}</td>
                    <td className="px-4 py-4 text-gray-500 text-sm">{item.date}</td>
                    <td className="px-4 py-4">
                      <div className="flex justify-center gap-2">
                        <button onClick={() => openEditModal(item, 'news')} className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600">Düzenle</button>
                        <button onClick={() => handleDelete(item.id, 'news')} className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600">Sil</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {sortedNews.length === 0 && <p className="text-center text-gray-500 py-8">Henüz haber eklenmemiş.</p>}
          </div>
        </div>
      )}

      {activeSub === 'Duyurular' && (
        <div>
          <div className="mb-4">
            <button onClick={() => openAddModal('announcement')} className="bg-sky-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-sky-700">+ Yeni Duyuru Ekle</button>
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
                {sortedAnnouncements.map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-2 py-4">
                      <div className="flex items-center gap-1">
                        <button onClick={() => moveAnnouncementUp(item.id)} className="p-1 bg-gray-100 hover:bg-gray-200 rounded text-gray-600" title="Yukarı">▲</button>
                        <span className="font-bold text-sky-600 w-6 text-center">{index + 1}</span>
                        <button onClick={() => moveAnnouncementDown(item.id)} className="p-1 bg-gray-100 hover:bg-gray-200 rounded text-gray-600" title="Aşağı">▼</button>
                      </div>
                    </td>
                    <td className="px-4 py-4 font-medium text-gray-800">{item.title}</td>
                    <td className="px-4 py-4 text-gray-500 text-sm">{item.date}</td>
                    <td className="px-4 py-4">
                      <div className="flex justify-center gap-2">
                        <button onClick={() => openEditModal(item, 'announcement')} className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600">Düzenle</button>
                        <button onClick={() => handleDelete(item.id, 'announcement')} className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600">Sil</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {announcements.length === 0 && <p className="text-center text-gray-500 py-8">Henüz duyuru eklenmemiş.</p>}
          </div>
        </div>
      )}

      {activeSub === 'Basın Bültenleri' && (
        <div>
          <div className="mb-4">
            <button onClick={() => openAddModal('press')} className="bg-sky-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-sky-700">+ Yeni Basın Bülteni Ekle</button>
          </div>
          <div className="bg-white rounded-xl shadow p-8 text-center text-gray-500">
            Basın Bültenleri bölümü yakında eklenecek.
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              {editingItem?.isNew ? 'Yeni ' + (editingItem?.type === 'announcement' ? 'Duyuru' : editingItem?.type === 'press' ? 'Basın Bülteni' : 'Haber') + ' Ekle' : 'Düzenle'}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-2 text-gray-700">Başlık *</label>
                <input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600" />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2 text-gray-700">Tarih *</label>
                <input type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600" />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2 text-gray-700">İçerik (HTML destekli)</label>
                <ContentEditor value={formData.description} onChange={(desc) => setFormData({...formData, description: desc})} />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2 text-gray-700">Fotoğraf URL</label>
                <input type="text" value={formData.image_url} onChange={(e) => setFormData({...formData, image_url: e.target.value})} placeholder="https://..." className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600" />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2 text-gray-700">Döküman URL</label>
                <input type="text" value={formData.document_url} onChange={(e) => setFormData({...formData, document_url: e.target.value})} placeholder="https://..." className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600" />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2 text-gray-700">İmza</label>
                <input type="text" value={formData.signature} onChange={(e) => setFormData({...formData, signature: e.target.value})} placeholder="İmza veya ek bilgi..." className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600" />
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