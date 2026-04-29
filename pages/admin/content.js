import { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';

// Otomatik paragraf fonksiyonu - kaydederken kullanılır
const formatContent = (text) => {
  if (!text) return '';
  
  // HTML taglerini kontrol et - tablo veya paragraflar varsa dokunma
  const hasTableStart = text.indexOf('<table') !== -1;
  const hasTableEnd = text.indexOf('</table>') !== -1;
  const hasParagraphStart = text.indexOf('<p') !== -1;
  const hasParagraphEnd = text.indexOf('</p>') !== -1;
  
  if ((hasTableStart && hasTableEnd) || (hasParagraphStart && hasParagraphEnd)) {
    return text;
  }
  
  // Tablo HTML'i düzgün kapanmamış veya bozulmuş olabilir, korumaya al
  if (text.includes('table') && (text.includes('<td') || text.includes('<th'))) {
    return text;
  }
  
  // Her satırı ayrı paragraf yap
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

  // Yazı boyutu değiştirme
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

  // Manuel paragraf yapma
  const autoFormatParagraphs = () => {
    if (!value) return;
    const hasParagraphTags = /<p[^>]*>[\s\S]*?<\/p>/i.test(value);
    if (hasParagraphTags) {
      alert('İçerik zaten paragraflanmış görünüyor!');
      return;
    }
    let formatted = formatContent(value);
    onChange(formatted);
    alert('Paragraflar oluşturuldu!');
  };

  // Tablo ekleme
  const insertTable = () => {
    const rows = prompt('Kaç satır olsun?', '3');
    const cols = prompt('Kaç sütun olsun?', '3');
    if (!rows || !cols) return;
    
    let table = '<table style="border-collapse:collapse;width:100%;margin:10px 0;">';
    table += '<thead><tr>';
    for (let c = 0; c < cols; c++) {
      table += `<th style="border:1px solid #ccc;padding:8px;background:#e0e7ff;">Sütun ${c + 1}</th>`;
    }
    table += '</tr></thead><tbody>';
    for (let r = 0; r < rows; r++) {
      table += '<tr>';
      for (let c = 0; c < cols; c++) {
        table += `<td style="border:1px solid #ccc;padding:8px;">Veri ${r + 1}-${c + 1}</td>`;
      }
      table += '</tr>';
    }
    table += '</tbody></table>';
    insertAtCursor(table);
  };

  return (
    <div>
      <div className="flex flex-wrap gap-1 mb-2 p-2 bg-gray-100 rounded-lg">
        <button type="button" onClick={() => insertTag('b')} className="px-3 py-1 bg-white border rounded font-bold hover:bg-gray-50" title="Kalın">B</button>
        <button type="button" onClick={() => insertTag('i')} className="px-3 py-1 bg-white border rounded italic hover:bg-gray-50" title="İtalik">I</button>
        <button type="button" onClick={() => insertTag('u')} className="px-3 py-1 bg-white border rounded underline hover:bg-gray-50" title="Altı Çizili">U</button>
        <span className="w-px h-6 bg-gray-300 mx-1 self-center"></span>
        <button type="button" onClick={() => insertTag('p', " style='text-align:left'")} className="px-3 py-1 bg-white border rounded hover:bg-gray-50" title="Sola Yasla">⬅</button>
        <button type="button" onClick={() => insertTag('p', " style='text-align:center'")} className="px-3 py-1 bg-white border rounded hover:bg-gray-50" title="ortala">⬌</button>
        <button type="button" onClick={() => insertTag('p', " style='text-align:right'")} className="px-3 py-1 bg-white border rounded hover:bg-gray-50" title="Sağa Yasla">➡</button>
        <span className="w-px h-6 bg-gray-300 mx-1 self-center"></span>
        <span className="text-xs text-gray-500 self-center mr-1">Boyut:</span>
        <button type="button" onClick={() => changeFontSize('14px')} className="px-2 py-1 bg-white border rounded text-xs hover:bg-gray-50" title="Küçük">A</button>
        <button type="button" onClick={() => changeFontSize('16px')} className="px-2 py-1 bg-white border rounded text-sm hover:bg-gray-50" title="Normal">A</button>
        <button type="button" onClick={() => changeFontSize('20px')} className="px-2 py-1 bg-white border rounded text-base hover:bg-gray-50" title="Büyük">A</button>
        <button type="button" onClick={() => changeFontSize('24px')} className="px-2 py-1 bg-white border rounded text-lg hover:bg-gray-50" title="Çok Büyük">A</button>
        <span className="w-px h-6 bg-gray-300 mx-1 self-center"></span>
        <button type="button" onClick={insertTable} className="px-3 py-1 bg-green-500 text-white border border-green-500 rounded hover:bg-green-600" title="Tablo">📊</button>
        <button type="button" onClick={insertLink} className="px-3 py-1 bg-blue-500 text-white border border-blue-500 rounded hover:bg-blue-600" title="Link">🔗</button>
        <button type="button" onClick={convertLinks} className="px-3 py-1 bg-purple-500 text-white border border-purple-500 rounded hover:bg-purple-600" title="Linkleri Dönüştür">🔄</button>
        <button type="button" onClick={autoFormatParagraphs} className="px-3 py-1 bg-orange-500 text-white border border-orange-500 rounded hover:bg-orange-600" title="Paragraf Yap">📝</button>
      </div>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows="10"
        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600 font-mono text-sm"
        placeholder="İçeriği buraya yazın... (Tablo eklemek için 📊 butonuna basın)"
      />
      <p className="text-xs text-gray-500 mt-1">Önizleme:</p>
      <div className="mt-2 p-4 bg-gray-50 border border-gray-200 rounded-lg min-h-[100px]">
        <div dangerouslySetInnerHTML={{ __html: value || '<span class="text-gray-400">İçerik önizlemesi burada görünecek...</span>' }} />
      </div>
    </div>
  );
}

// Dernek Manager
function DernekManager() {
  const [items, setItems] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [editingKey, setEditingKey] = useState(null);
  const [formData, setFormData] = useState({ title: '', content: '', date: '' });
  const [activeSub, setActiveSub] = useState('Tarihçemiz');
  const [loading, setLoading] = useState(true);

  const subItems = ['Tarihçemiz', 'Tüzük', 'Yönetim Kurulu', 'Denetim Kurulu'];

  useEffect(() => { 
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('dernek_content')
        .select('*');
      
      if (error) throw error;
      
      const itemsObj = {};
      if (data && data.length > 0) {
        data.forEach(item => {
          itemsObj[item.section_key] = item;
        });
      }
      setItems(itemsObj);
    } catch (error) {
      console.error('Veri yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (key) => {
    setEditingKey(key);
    setFormData({ 
      title: items[key]?.title || key, 
      content: items[key]?.content || '', 
      date: items[key]?.date || new Date().toISOString().split('T')[0] 
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!formData.content) { alert('İçerik boş olamaz!'); return; }
    const formattedContent = formatContent(formData.content);
    
    try {
      const { error } = await supabase
        .from('dernek_content')
        .upsert({
          section_key: editingKey,
          title: formData.title,
          content: formattedContent,
          date: formData.date
        }, { onConflict: 'section_key' });
      
      if (error) throw error;
      
      setItems({ ...items, [editingKey]: { title: formData.title, content: formattedContent, date: formData.date } });
      setShowModal(false);
      alert('Kaydedildi! (Paragraflar otomatik oluşturuldu)');
    } catch (error) {
      console.error('Kayıt hatası:', error);
      alert('Kayıt sırasında hata oluştu!');
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Yükleniyor...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Derneğimiz Yönetimi</h1>
      </div>
      <div className="flex flex-wrap gap-2 mb-6 bg-white p-2 rounded-lg">
        {subItems.map((sub) => (
          <button key={sub} onClick={() => setActiveSub(sub)} className={`px-4 py-2 rounded font-medium ${activeSub === sub ? 'bg-sky-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>{sub}</button>
        ))}
      </div>
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Başlık</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tarih</th><th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">İşlemler</th></tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {subItems.map((sub) => (
              <tr key={sub} className="hover:bg-gray-50">
                <td className="px-4 py-4 font-medium text-gray-800">{sub}</td>
                <td className="px-4 py-4 text-gray-500 text-sm">{items[sub]?.date || '-'}</td>
                <td className="px-4 py-4"><div className="flex justify-center gap-2"><button onClick={() => openEditModal(sub)} className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600">Düzenle</button></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-3xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 text-gray-800">İçerik Düzenle - {editingKey}</h2>
            <div className="space-y-4">
              <div><label className="block text-sm font-bold mb-2 text-gray-700">Başlık</label><input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600" /></div>
              <div><label className="block text-sm font-bold mb-2 text-gray-700">Tarih</label><input type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600" /></div>
              <div><label className="block text-sm font-bold mb-2 text-gray-700">İçerik</label><ContentEditor value={formData.content} onChange={(content) => setFormData({...formData, content})} /></div>
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

// Intersteno Manager
function InterstenoManager() {
  const [items, setItems] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [editingKey, setEditingKey] = useState(null);
  const [formData, setFormData] = useState({ title: '', content: '', date: '' });
  const [activeSub, setActiveSub] = useState('İntersteno Hakkında');
  const [loading, setLoading] = useState(true);

  const subItems = ['İntersteno Hakkında', 'İntersteno Onursal Başkanları', 'İntersteno Yönetim Kurulu', 'İntersteno Konseyi', 'İntersteno Türk Hakkında', 'İntersteno-Türk Yönetimi'];

  useEffect(() => { 
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('intersteno_content')
        .select('*');
      
      if (error) throw error;
      
      const itemsObj = {};
      if (data && data.length > 0) {
        data.forEach(item => {
          itemsObj[item.section_key] = item;
        });
      }
      setItems(itemsObj);
    } catch (error) {
      console.error('Veri yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (key) => {
    setEditingKey(key);
    setFormData({ 
      title: items[key]?.title || key, 
      content: items[key]?.content || '', 
      date: items[key]?.date || new Date().toISOString().split('T')[0] 
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!formData.content) { alert('İçerik boş olamaz!'); return; }
    const formattedContent = formatContent(formData.content);
    
    try {
      const { error } = await supabase
        .from('intersteno_content')
        .upsert({
          section_key: editingKey,
          title: formData.title,
          content: formattedContent,
          date: formData.date
        }, { onConflict: 'section_key' });
      
      if (error) throw error;
      
      setItems({ ...items, [editingKey]: { title: formData.title, content: formattedContent, date: formData.date } });
      setShowModal(false);
      alert('Kaydedildi! (Paragraflar otomatik oluşturuldu)');
    } catch (error) {
      console.error('Kayıt hatası:', error);
      alert('Kayıt sırasında hata oluştu!');
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Yükleniyor...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">İntersteno-Türk Yönetimi</h1>
      </div>
      <div className="flex flex-wrap gap-2 mb-6 bg-white p-2 rounded-lg">
        {subItems.map((sub) => (
          <button key={sub} onClick={() => setActiveSub(sub)} className={`px-4 py-2 rounded font-medium text-sm ${activeSub === sub ? 'bg-sky-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>{sub}</button>
        ))}
      </div>
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Başlık</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tarih</th><th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">İşlemler</th></tr></thead>
          <tbody className="divide-y divide-gray-200">
            {subItems.map((sub) => (
              <tr key={sub} className="hover:bg-gray-50"><td className="px-4 py-4 font-medium text-gray-800">{sub}</td><td className="px-4 py-4 text-gray-500 text-sm">{items[sub]?.date || '-'}</td><td className="px-4 py-4"><div className="flex justify-center gap-2"><button onClick={() => openEditModal(sub)} className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600">Düzenle</button></div></td></tr>
            ))}
          </tbody>
        </table>
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-3xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 text-gray-800">İçerik Düzenle - {editingKey}</h2>
            <div className="space-y-4">
              <div><label className="block text-sm font-bold mb-2 text-gray-700">Başlık</label><input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600" /></div>
              <div><label className="block text-sm font-bold mb-2 text-gray-700">Tarih</label><input type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600" /></div>
              <div><label className="block text-sm font-bold mb-2 text-gray-700">İçerik</label><ContentEditor value={formData.content} onChange={(content) => setFormData({...formData, content})} /></div>
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

// F Klavye Manager
function FKlavyeManager() {
  const [items, setItems] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [editingKey, setEditingKey] = useState(null);
  const [formData, setFormData] = useState({ title: '', content: '', date: '' });
  const [activeSub, setActiveSub] = useState('F Klavyenin Mucidi');
  const [loading, setLoading] = useState(true);

  const subItems = ['F Klavyenin Mucidi', 'F Klavyenin Hikayesi', 'F Klavyenin Özellikleri', 'Günümüzde F Klavye'];

  useEffect(() => { 
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('fklavye_content')
        .select('*');
      
      if (error) throw error;
      
      const itemsObj = {};
      if (data && data.length > 0) {
        data.forEach(item => {
          itemsObj[item.section_key] = item;
        });
      }
      setItems(itemsObj);
    } catch (error) {
      console.error('Veri yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (key) => {
    setEditingKey(key);
    setFormData({ 
      title: items[key]?.title || key, 
      content: items[key]?.content || '', 
      date: items[key]?.date || new Date().toISOString().split('T')[0] 
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!formData.content) { alert('İçerik boş olamaz!'); return; }
    const formattedContent = formatContent(formData.content);
    
    try {
      const { error } = await supabase
        .from('fklavye_content')
        .upsert({
          section_key: editingKey,
          title: formData.title,
          content: formattedContent,
          date: formData.date
        }, { onConflict: 'section_key' });
      
      if (error) throw error;
      
      setItems({ ...items, [editingKey]: { title: formData.title, content: formattedContent, date: formData.date } });
      setShowModal(false);
      alert('Kaydedildi! (Paragraflar otomatik oluşturuldu)');
    } catch (error) {
      console.error('Kayıt hatası:', error);
      alert('Kayıt sırasında hata oluştu!');
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Yükleniyor...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">F Klavye Yönetimi</h1>
      </div>
      <div className="flex flex-wrap gap-2 mb-6 bg-white p-2 rounded-lg">
        {subItems.map((sub) => (
          <button key={sub} onClick={() => setActiveSub(sub)} className={`px-4 py-2 rounded font-medium ${activeSub === sub ? 'bg-sky-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>{sub}</button>
        ))}
      </div>
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Başlık</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tarih</th><th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">İşlemler</th></tr></thead>
          <tbody className="divide-y divide-gray-200">
            {subItems.map((sub) => (
              <tr key={sub} className="hover:bg-gray-50"><td className="px-4 py-4 font-medium text-gray-800">{sub}</td><td className="px-4 py-4 text-gray-500 text-sm">{items[sub]?.date || '-'}</td><td className="px-4 py-4"><div className="flex justify-center gap-2"><button onClick={() => openEditModal(sub)} className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600">Düzenle</button></div></td></tr>
            ))}
          </tbody>
        </table>
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-3xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 text-gray-800">İçerik Düzenle - {editingKey}</h2>
            <div className="space-y-4">
              <div><label className="block text-sm font-bold mb-2 text-gray-700">Başlık</label><input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600" /></div>
              <div><label className="block text-sm font-bold mb-2 text-gray-700">Tarih</label><input type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600" /></div>
              <div><label className="block text-sm font-bold mb-2 text-gray-700">İçerik</label><ContentEditor value={formData.content} onChange={(content) => setFormData({...formData, content})} /></div>
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

// Iletisim Manager
function IletisimManager() {
  const [content, setContent] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => { 
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('iletisim')
        .select('content')
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      setContent(data?.content || '');
    } catch (error) {
      console.error('Veri yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    const formattedContent = formatContent(content);
    
    try {
      const { error } = await supabase
        .from('iletisim')
        .upsert({ id: 1, content: formattedContent });
      
      if (error) throw error;
      
      setShowModal(false);
      alert('Kaydedildi! (Paragraflar otomatik oluşturuldu)');
    } catch (error) {
      console.error('Kayıt hatası:', error);
      alert('Kayıt sırasında hata oluştu!');
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Yükleniyor...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">İletişim Yönetimi</h1>
        <button onClick={() => setShowModal(true)} className="bg-sky-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-sky-700">Düzenle</button>
      </div>
      <div className="bg-white rounded-xl shadow p-6">
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-3xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 text-gray-800">İletişim İçeriğini Düzenle</h2>
            <ContentEditor value={content} onChange={setContent} />
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

export default function ContentManagers() {
  const [activeTab, setActiveTab] = useState('dernek');
  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-6 bg-white p-2 rounded-lg">
        <button onClick={() => setActiveTab('dernek')} className={`px-4 py-2 rounded font-medium ${activeTab === 'dernek' ? 'bg-sky-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>Derneğimiz</button>
        <button onClick={() => setActiveTab('intersteno')} className={`px-4 py-2 rounded font-medium ${activeTab === 'intersteno' ? 'bg-sky-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>İntersteno-Türk</button>
        <button onClick={() => setActiveTab('fklavye')} className={`px-4 py-2 rounded font-medium ${activeTab === 'fklavye' ? 'bg-sky-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>F Klavye</button>
        <button onClick={() => setActiveTab('iletisim')} className={`px-4 py-2 rounded font-medium ${activeTab === 'iletisim' ? 'bg-sky-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>İletişim</button>
      </div>
      {activeTab === 'dernek' && <DernekManager />}
      {activeTab === 'intersteno' && <InterstenoManager />}
      {activeTab === 'fklavye' && <FKlavyeManager />}
      {activeTab === 'iletisim' && <IletisimManager />}
    </div>
  );
}
