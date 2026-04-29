import { useState } from 'react';

export default function EditPage() {
  const [selectedPage, setSelectedPage] = useState('tarihcemiz');
  const [content, setContent] = useState('');
  const [fontSize, setFontSize] = useState('16');
  const [fontFamily, setFontFamily] = useState('Arial');
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [saved, setSaved] = useState(false);

  const pages = [
    { id: 'tarihcemiz', label: 'Tarihçemiz' },
    { id: 'tuzuk', label: 'Tüzük' },
    { id: 'yonetim-kurulu', label: 'Yönetim Kurulu' },
    { id: 'denetim-kurulu', label: 'Denetim Kurulu' },
    { id: 'iletisim', label: 'İletişim' },
    { id: 'intersteno-hakkinda', label: 'İntersteno Hakkında' },
    { id: 'intersteno-onursal', label: 'İntersteno Onursal Başkanları' },
    { id: 'intersteno-yonetim', label: 'İntersteno Yönetim Kurulu' },
    { id: 'intersteno-konsey', label: 'İntersteno Konseyi' },
    { id: 'intersteno-turk-hakkinda', label: 'İntersteno Türk Hakkında' },
    { id: 'intersteno-turk-yonetimi', label: 'İntersteno Türk Yönetimi' },
    { id: 'f-klavyenin-mucidi', label: 'F Klavyenin Mucidi' },
    { id: 'f-klavyenin-hikayesi', label: 'F Klavyenin Hikayesi' },
    { id: 'f-klavyenin-ozellikleri', label: 'F Klavyenin Özellikleri' },
    { id: 'gunumuzde-f-klavye', label: 'Günümüzde F Klavye' },
  ];

  const insertLink = () => {
    const url = prompt('Link URL:');
    const text = prompt('Link metni:');
    if (url && text) {
      setContent(content + `<a href="${url}" class="text-primary hover:underline">${text}</a>`);
    }
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Sayfa Düzenle</h1>

      {/* Page Selector */}
      <div className="bg-white rounded-xl shadow p-4 mb-6">
        <label className="block text-sm font-bold mb-2 text-gray-700">Sayfa Seçin</label>
        <select
          value={selectedPage}
          onChange={(e) => setSelectedPage(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        >
          {pages.map((page) => (
            <option key={page.id} value={page.id}>{page.label}</option>
          ))}
        </select>
      </div>

      {/* Editor */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-gray-800">İçerik Editörü</h3>
          <button
            onClick={handleSave}
            className={`px-4 py-2 rounded font-bold ${saved ? 'bg-green-500' : 'bg-primary'} text-white`}
          >
            {saved ? 'Kaydedildi!' : 'Kaydet'}
          </button>
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap gap-2 mb-4 p-3 bg-gray-50 rounded-lg">
          <select
            value={fontFamily}
            onChange={(e) => setFontFamily(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="Arial">Arial</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Georgia">Georgia</option>
            <option value="Verdana">Verdana</option>
          </select>
          
          <select
            value={fontSize}
            onChange={(e) => setFontSize(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="14">14px</option>
            <option value="16">16px</option>
            <option value="18">18px</option>
            <option value="20">20px</option>
            <option value="24">24px</option>
          </select>

          <button
            onClick={() => setIsBold(!isBold)}
            className={`p-2 border rounded font-bold ${isBold ? 'bg-primary text-white' : ''}`}
          >
            B
          </button>
          
          <button
            onClick={() => setIsItalic(!isItalic)}
            className={`p-2 border rounded italic ${isItalic ? 'bg-primary text-white' : ''}`}
          >
            I
          </button>

          <button
            onClick={insertLink}
            className="p-2 border rounded bg-blue-500 text-white hover:bg-blue-600"
          >
            🔗 Link
          </button>
        </div>

        {/* Text Area */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full h-64 p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          style={{
            fontFamily,
            fontSize: `${fontSize}px`,
            fontWeight: isBold ? 'bold' : 'normal',
            fontStyle: isItalic ? 'italic' : 'normal',
          }}
          placeholder="İçeriği buraya yazın..."
        />

        <p className="text-sm text-gray-500 mt-2">
          HTML etiketleri kullanabilirsiniz. Örneğin: &lt;h2&gt;, &lt;p&gt;, &lt;strong&gt;, &lt;em&gt;, &lt;a&gt;
        </p>
      </div>
    </div>
  );
}
