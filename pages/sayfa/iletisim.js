import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { getIletisim, saveMessage } from '../../lib/supabase';

export default function Iletisim() {
  const [iletisimContent, setIletisimContent] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await getIletisim();
      setIletisimContent(data || '');
    } catch (error) {
      console.error('Veri yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await saveMessage({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        message: formData.message,
        date: new Date().toISOString().split('T')[0],
        read: false
      });
      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (error) {
      console.error('Mesaj gönderme hatası:', error);
      alert('Mesaj gönderilirken hata oluştu!');
    }
  };

  if (loading) {
    return (
      <Layout title="İletişim - F Klavye Uçan Parmaklar Derneği">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="bg-white rounded-xl shadow p-6 text-center">
            <p>Yükleniyor...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="İletişim - F Klavye Uçan Parmaklar Derneği">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <h2 className="text-2xl font-bold text-blue-800 mb-6">İletişim</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* İletişim Bilgileri / İçerik */}
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">İletişim Bilgilerimiz</h3>
              
              {iletisimContent && iletisimContent.address ? (
                <div className="space-y-4">
                  {iletisimContent.address && (
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-2xl">📍</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-800">Adres</h4>
                        <p className="text-gray-600">{iletisimContent.address}</p>
                      </div>
                    </div>
                  )}
                  
                  {iletisimContent.email && (
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-2xl">📧</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-800">E-posta</h4>
                        <p className="text-gray-600">{iletisimContent.email}</p>
                      </div>
                    </div>
                  )}
                  
                  {iletisimContent.working_hours && (
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-2xl">🕐</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-800">Çalışma Saatleri</h4>
                        <p className="text-gray-600">{iletisimContent.working_hours}</p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">📍</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800">Adres</h4>
                      <p className="text-gray-600">İstiklal Mah. Yücel Çakmaklı Cad. No 6/3 K 2 D 4 Afyonkarahisar</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">📧</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800">E-posta</h4>
                      <p className="text-gray-600">bilgi@fklavye.org.tr</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Mesaj Formu */}
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Bize Ulaşın</h3>
              
              {submitted ? (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-6 rounded-lg text-center">
                  <span className="text-4xl block mb-2">✅</span>
                  <p className="font-bold">Mesajınız Alındı!</p>
                  <p className="text-sm mt-2">En kısa sürede size dönüş yapacağız.</p>
                  <button 
                    onClick={() => setSubmitted(false)}
                    className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                  >
                    Yeni Mesaj Gönder
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Adınız Soyadınız *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600"
                      placeholder="Adınız Soyadınız"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">E-posta *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600"
                      placeholder="ornek@mail.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Telefon</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600"
                      placeholder="0555 555 55 55"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Konu *</label>
                    <input
                      type="text"
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600"
                      placeholder="Mesajınızın konusu"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Mesajınız *</label>
                    <textarea
                      required
                      rows="5"
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600"
                      placeholder="Mesajınızı buraya yazın..."
                    />
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full bg-sky-600 text-white py-3 rounded-lg font-bold hover:bg-sky-700 transition-colors"
                  >
                    Gönder
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
