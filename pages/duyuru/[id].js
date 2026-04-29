import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { supabase } from '../../lib/supabase';

export default function DuyuruDetay() {
  const router = useRouter();
  const { id } = router.query;
  const [duyuru, setDuyuru] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadDuyuru();
    }
  }, [id]);

  const loadDuyuru = async () => {
    try {
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      setDuyuru(data);
    } catch (error) {
      console.error('Duyuru yüklenirken hata:', error);
      setDuyuru(null);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  if (loading) {
    return (
      <Layout title="Duyuru - F Klavye Uçan Parmaklar Derneği">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="bg-white rounded-xl shadow p-6 text-center">
            <p>Yükleniyor...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!duyuru) {
    return (
      <Layout title="Duyuru - F Klavye Uçan Parmaklar Derneği">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="bg-white rounded-xl shadow p-6">
            <p className="text-gray-500 text-center py-8">Duyuru bulunamadı.</p>
            <div className="text-center mt-4">
              <button onClick={() => router.push('/sayfa/duyurular')} className="bg-blue-800 text-white px-4 py-2 rounded-lg hover:bg-blue-900">
                Duyurulara Dön
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={`${duyuru.title} - F Klavye Uçan Parmaklar Derneği`}>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow p-6">
          <button onClick={() => router.push('/sayfa/duyurular')} className="mb-4 text-blue-800 hover:underline">
            ← Duyurulara Dön
          </button>
          
          <div className="mb-4">
            <span className="bg-blue-800 text-white px-2 py-1 rounded text-xs font-bold">DUYURU</span>
            <span className="ml-2 text-gray-500 text-sm">{formatDate(duyuru.date)}</span>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-800 mb-6">{duyuru.title}</h1>
          
          {duyuru.image_url && (
            <div className="mb-6 w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
              <img src={duyuru.image_url} alt={duyuru.title} className="object-cover w-full h-full" />
            </div>
          )}
          
          <div className="prose max-w-none text-gray-700 leading-relaxed text-lg" dangerouslySetInnerHTML={{ __html: duyuru.description }} />
          
          {duyuru.signature && (
            <p className="mt-6 text-gray-500 italic">- {duyuru.signature}</p>
          )}
        </div>
      </div>
    </Layout>
  );
}
