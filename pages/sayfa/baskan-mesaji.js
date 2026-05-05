import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { getDernekContent } from '../../lib/supabase';

export default function BaskanMesaji() {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await getDernekContent();
      setContent(data['Başkanın Mesajı'] || null);
    } catch (error) {
      console.error('Veri yüklenirken hata:', error);
      setContent(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout title="Başkanın Mesajı - F Klavye Uçan Parmaklar Derneği">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="bg-white rounded-xl shadow p-6 text-center">
            <p>Yükleniyor...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Başkanın Mesajı - F Klavye Uçan Parmaklar Derneği">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow p-6">
          <h1 className="text-2xl font-bold text-blue-800 mb-6">Başkanın Mesajı</h1>
          
                    {content?.content && (
            <div className="mb-6" style={{ overflow: 'hidden' }}>
              <img
                src="https://res.cloudinary.com/dwelnz4ud/image/upload/v1777933065/bekirarabac%C4%B1_mbwooq.jpg"
                alt="Dernek Başkanı"
                className="float-left mr-6 mb-4"
                style={{ width: '200px', height: 'auto', borderRadius: '8px', objectFit: 'cover' }}
              />
              <div className="text-lg text-gray-700 leading-relaxed">
                <div dangerouslySetInnerHTML={{ __html: content.content }} />
              </div>
            </div>
          )}
          
          {!content && (
            <p className="text-gray-500">İçerik bulunamadı.</p>
          )}
        </div>
      </div>
    </Layout>
  );
}