import Layout from '../../components/Layout';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

export default function HaberDetay() {
  const router = useRouter();
  const { id } = router.query;
  const [haber, setHaber] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadHaber();
    }
  }, [id]);

  const loadHaber = async () => {
    try {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      setHaber(data);
    } catch (error) {
      console.error('Haber yüklenirken hata:', error);
      setHaber(null);
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
      <Layout title="Haber - F Klavye Uçan Parmaklar Derneği">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="bg-white rounded-xl shadow p-6 text-center">
            <p>Yükleniyor...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!haber) {
    return (
      <Layout title="Haber - F Klavye Uçan Parmaklar Derneği">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="bg-white rounded-xl shadow p-6">
            <p className="text-gray-500">Haber bulunamadı.</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={`${haber.title} - F Klavye Uçan Parmaklar Derneği`}>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-blue-800 text-white px-3 py-1 rounded font-bold text-xs">HABER</span>
            <span className="text-gray-500">{formatDate(haber.date)}</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">{haber.title}</h1>
          {haber.image_url && (
            <div className="w-full h-80 bg-gray-100 rounded-lg mb-6 overflow-hidden">
              <img src={haber.image_url} alt={haber.title} className="object-cover w-full h-full" />
            </div>
          )}
          <div 
            className="prose max-w-none text-gray-700 leading-relaxed text-lg" 
            dangerouslySetInnerHTML={{ __html: haber.description }} 
          />
          {haber.signature && <p className="mt-6 text-gray-500 italic text-lg">- {haber.signature}</p>}
          {haber.document_url && (
            <div className="mt-6">
              <a href={haber.document_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                📄 Dökümanı İndir
              </a>
            </div>
          )}
          <div className="mt-8 pt-4 border-t">
            <button onClick={() => router.back()} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-medium hover:bg-gray-300">
              ← Geri Dön
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}