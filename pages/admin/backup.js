import { useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function BackupManager() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleExport = async () => {
    setLoading(true);
    setMessage('Veriler aktarılıyor...');
    
    try {
      // Tüm verileri Supabase'den çek
      const tables = ['news', 'announcements', 'gallery', 'videos', 'dernek_content', 'intersteno_content', 'fklavye_content', 'iletisim', 'messages'];
      const data = {};
      
      for (const table of tables) {
        const { data: result, error } = await supabase.from(table).select('*');
        if (error) {
          console.error(`${table} tablosu çekilirken hata:`, error);
          data[table] = [];
        } else {
          data[table] = result || [];
        }
      }
      
      const json = JSON.stringify(data, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `fklavye-supabase-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setMessage('Veriler başarıyla indirildi!');
    } catch (err) {
      console.error('Dışa aktarma hatası:', err);
      setMessage('Hata: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setLoading(true);
    setMessage('Veriler içe aktarılıyor...');
    
    try {
      const reader = new FileReader();
      const fileContent = await new Promise((resolve, reject) => {
        reader.onload = (event) => resolve(event.target.result);
        reader.onerror = (err) => reject(err);
        reader.readAsText(file);
      });
      
      const data = JSON.parse(fileContent);
      
      // Her tabloyu Supabase'e geri yükle
      const tableMap = {
        news: 'news',
        announcements: 'announcements',
        gallery: 'gallery',
        videos: 'videos',
        dernek_content: 'dernek_content',
        intersteno_content: 'intersteno_content',
        fklavye_content: 'fklavye_content',
        iletisim: 'iletisim',
        messages: 'messages'
      };
      
      let successCount = 0;
      let errorCount = 0;
      
      for (const [key, tableName] of Object.entries(tableMap)) {
        if (data[key] && Array.isArray(data[key])) {
          for (const item of data[key]) {
            try {
              const { error } = await supabase.from(tableName).upsert(item);
              if (error) {
                console.error(`${tableName} tablosuna eklenirken hata:`, error);
                errorCount++;
              } else {
                successCount++;
              }
            } catch (err) {
              console.error(`${tableName} tablosuna eklenirken hata:`, err);
              errorCount++;
            }
          }
        }
      }
      
      setMessage(`Geri yükleme tamamlandı! ${successCount} kayıt başarıyla aktarıldı.${errorCount > 0 ? ` ${errorCount} kayıt hatalı.` : ''}`);
      alert('Geri yükleme tamamlandı! Sayfayı yenileyin.');
    } catch (err) {
      console.error('İçe aktarma hatası:', err);
      setMessage('Hata: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Yedekleme</h1>
      
      {message && (
        <div className={`p-4 mb-4 rounded-lg ${loading ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
          {message}
        </div>
      )}
      
      <div className="bg-white rounded-xl shadow p-6">
        <div className="space-y-6">
          <div>
            <h3 className="font-bold text-lg mb-2">📤 Dışa Aktar</h3>
            <p className="text-gray-500 text-sm mb-4">Tüm verileri Supabase'den çekip JSON olarak indir</p>
            <button 
              type="button"
              onClick={handleExport}
              disabled={loading}
              className="bg-green-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Aktarılıyor...' : 'Tüm Veriyi İndir'}
            </button>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-2">📥 İçe Aktar</h3>
            <p className="text-gray-500 text-sm mb-4">JSON dosyasından verileri Supabase'e geri yükle</p>
            <label className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold cursor-pointer hover:bg-blue-700 inline-block">
              JSON Dosyası Seç
              <input type="file" onChange={handleImport} className="hidden" accept=".json" />
            </label>
          </div>
          
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-bold text-gray-700 mb-2">📋 Nasıl Çalışır?</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li><strong>Dışa Aktar:</strong> Supabase veritabanındaki tüm verileri JSON dosyası olarak indirir</li>
              <li><strong>İçe Aktar:</strong> JSON dosyasındaki verileri Supabase veritabanına geri yükler</li>
              <li><strong>Not:</strong> Fotoğraf ve video dosyaları hosting'de kalmaya devam eder</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
