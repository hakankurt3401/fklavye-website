import Layout from '../../components/Layout';
import { getAnnouncements } from '../../lib/supabase';
import { useState, useEffect } from 'react';

export default function Duyurular() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await getAnnouncements();
      setAnnouncements(data || []);
    } catch (error) {
      console.error('Duyurular yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout title="Duyurular - F Klavye Uçan Parmaklar Derneği">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="bg-white rounded-xl shadow p-6 text-center">
            <p>Yükleniyor...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Duyurular - F Klavye Uçan Parmaklar Derneği">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-2xl font-bold text-blue-800 mb-6">Duyurular</h2>
          {announcements.length === 0 ? (
            <p className="text-gray-500">Henüz duyuru eklenmemiş.</p>
          ) : (
            <div className="space-y-4">
              {announcements.map((item) => (
                <a key={item.id} href={`/duyuru/${item.id}`} className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg border border-blue-100 hover:bg-blue-100 transition-colors">
                  {item.image_url && (
                    <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
                      <img src={item.image_url} alt={item.title} className="object-cover w-full h-full" />
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="font-medium text-gray-800 mb-1">{item.title}</p>
                    <span className="text-xs text-blue-600">{item.date}</span>
                    {item.description && (
                      <p className="mt-2 text-gray-600 line-clamp-2 text-sm">
                        {item.description.replace(/<[^>]*>/g, '').substring(0, 150)}...
                      </p>
                    )}
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}