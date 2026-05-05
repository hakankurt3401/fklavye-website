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
          
          {content?.image_url && (
            <div className="mb-6" style={{ overflow: 'hidden' }}>
              <img 
                src={content.image_url} 
                alt={content.title || 'Başkan'} 
                className="float-left mr-6 mb-4 rounded-lg shadow-md object-cover"
                style={{ width: '200px', height: 'auto' }}
              />
              <div className="text-lg text-gray-700 leading-relaxed">
                {content.content && (
                  <div dangerouslySetInnerHTML={{ __html: content.content }} />
                )}
              </div>
            </div>
          )}
          
          {(!content?.image_url && content?.content) && (
            <div 
              className="prose max-w-none text-gray-700 leading-relaxed text-lg"
              dangerouslySetInnerHTML={{ __html: content.content }} 
            />
          )}
          
          {!content && (
            <p className="text-gray-500">İçerik bulunamadı.</p>
          )}
        </div>
      </div>
    </Layout>
  );
}