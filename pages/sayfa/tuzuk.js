import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { getDernekContent } from '../../lib/supabase';

export default function TuZuk() {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await getDernekContent();
      setContent(data['Tüzük'] || null);
    } catch (error) {
      console.error('Veri yüklenirken hata:', error);
      setContent(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout title="Tüzük - F Klavye Uçan Parmaklar Derneği">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="bg-white rounded-xl shadow p-6 text-center">
            <p>Yükleniyor...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!content) {
    return (
      <Layout title="Tüzük - F Klavye Uçan Parmaklar Derneği">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="bg-white rounded-xl shadow p-6">
            <p className="text-gray-500">İçerik bulunamadı.</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={`${content.title || 'Tüzük'} - F Klavye Uçan Parmaklar Derneği`}>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow p-6">
          <h1 className="text-2xl font-bold text-blue-800 mb-6">{content.title}</h1>
          <div className="prose max-w-none text-gray-700 leading-relaxed text-lg" dangerouslySetInnerHTML={{ __html: content.content || '' }} />
        </div>
      </div>
    </Layout>
  );
}
