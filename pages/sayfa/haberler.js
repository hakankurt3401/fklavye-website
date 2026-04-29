import Link from 'next/link';
import Layout from '../../components/Layout';
import { getNews } from '../../lib/supabase';
import { useState, useEffect } from 'react';

export default function Haberler() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await getNews();
      setNews(data || []);
    } catch (error) {
      console.error('Haberler yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout title="Haberler - F Klavye Uçan Parmaklar Derneği">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="bg-white rounded-xl shadow p-6 text-center">
            <p>Yükleniyor...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Haberler - F Klavye Uçan Parmaklar Derneği">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow p-5">
          <h2 className="text-xl font-bold text-blue-800 mb-4">Haberler</h2>
          {news.length === 0 ? (
            <p className="text-gray-500">Henüz haber eklenmemiş.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {news.map((item) => (
                <div key={item.id} className="bg-blue-50 rounded-lg p-4 border border-blue-100 hover:shadow-md transition-shadow flex gap-4">
                  {item.image_url && (
                    <div className="w-24 h-24 flex-shrink-0 bg-gray-200 rounded-lg overflow-hidden">
                      <img src={item.image_url} alt={item.title} className="object-cover w-full h-full" />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="bg-blue-800 text-white px-2 py-0.5 rounded font-bold text-xs">HABER</span>
                      <span className="text-gray-400 text-xs">{item.date}</span>
                    </div>
                    <h3 className="text-base font-bold text-gray-800 mb-1">{item.title}</h3>
                    <p className="text-gray-600 text-sm line-clamp-2 mb-2">
                      {item.description?.replace(/<[^>]*>/g, '').substring(0, 100)}...
                    </p>
                    <Link href={`/haber/${item.id}`} className="text-blue-600 hover:underline text-sm">
                      Devamını Oku →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}