import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export default function VisitorsManager() {
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState('today');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('visitors')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(500);
      
      if (error) throw error;
      setVisitors(data || []);
    } catch (error) {
      console.error('Veri yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredVisitors = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    return visitors.filter(v => {
      const visitDate = new Date(v.created_at);
      if (timeFilter === 'today') {
        return visitDate >= today;
      } else if (timeFilter === 'week') {
        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);
        return visitDate >= weekAgo;
      } else if (timeFilter === 'month') {
        const monthAgo = new Date(today);
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        return visitDate >= monthAgo;
      }
      return true;
    });
  };

  const filteredVisitors = getFilteredVisitors();
  
  const stats = {
    totalVisits: filteredVisitors.length,
    uniqueIPs: new Set(filteredVisitors.map(v => v.ip)).size,
    avgDuration: filteredVisitors.length > 0 
      ? Math.round(filteredVisitors.reduce((acc, v) => acc + (v.duration || 0), 0) / filteredVisitors.length) + ' sn'
      : '0 sn',
    mostViewed: (() => {
      const pageCounts = {};
      filteredVisitors.forEach(v => {
        pageCounts[v.page] = (pageCounts[v.page] || 0) + 1;
      });
      const sorted = Object.entries(pageCounts).sort((a, b) => b[1] - a[1]);
      return sorted.length > 0 ? sorted[0][0] : '-';
    })()
  };

  const getDailyStats = () => {
    const daily = {};
    filteredVisitors.forEach(v => {
      const date = new Date(v.created_at).toLocaleDateString('tr-TR');
      daily[date] = (daily[date] || 0) + 1;
    });
    return Object.entries(daily).sort((a, b) => new Date(b[0]) - new Date(a[0])).slice(0, 7);
  };

  const dailyStats = getDailyStats();

  if (loading) {
    return <div className="p-8 text-center">Yükleniyor...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Ziyaretçi İstatistikleri</h1>

      {/* Time Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button 
          onClick={() => setTimeFilter('today')}
          className={`px-4 py-2 rounded font-medium ${timeFilter === 'today' ? 'bg-sky-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
        >
          Bugün
        </button>
        <button 
          onClick={() => setTimeFilter('week')}
          className={`px-4 py-2 rounded font-medium ${timeFilter === 'week' ? 'bg-sky-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
        >
          Bu Hafta
        </button>
        <button 
          onClick={() => setTimeFilter('month')}
          className={`px-4 py-2 rounded font-medium ${timeFilter === 'month' ? 'bg-sky-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
        >
          Bu Ay
        </button>
        <button 
          onClick={() => setTimeFilter('all')}
          className={`px-4 py-2 rounded font-medium ${timeFilter === 'all' ? 'bg-sky-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
        >
          Tümü
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow p-4">
          <p className="text-sm text-gray-500">Toplam Ziyaret</p>
          <p className="text-2xl font-bold text-sky-600">{stats.totalVisits}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-4">
          <p className="text-sm text-gray-500">Benzersiz IP</p>
          <p className="text-2xl font-bold text-sky-600">{stats.uniqueIPs}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-4">
          <p className="text-sm text-gray-500">Ortalama Süre</p>
          <p className="text-2xl font-bold text-sky-600">{stats.avgDuration}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-4">
          <p className="text-sm text-gray-500">En Çok Ziyaret</p>
          <p className="text-2xl font-bold text-sky-600 text-sm">{stats.mostViewed}</p>
        </div>
      </div>

      {/* Daily Stats */}
      {dailyStats.length > 0 && (
        <div className="bg-white rounded-xl shadow p-4 mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Günlük Ziyaretçi Sayısı</h2>
          <div className="flex items-end gap-2 h-32">
            {dailyStats.map(([date, count], idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-sky-500 rounded-t transition-all hover:bg-sky-600"
                  style={{ height: `${Math.max((count / Math.max(...dailyStats.map(d => d[1]))) * 100, 10)}%` }}
                ></div>
                <p className="text-xs text-gray-500 mt-1 truncate">{date.split('.')[0]}</p>
                <p className="text-xs font-bold text-sky-600">{count}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Visitor Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">IP Adresi</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tarih/Saat</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sayfa</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Süre</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredVisitors.slice(0, 50).map((visitor, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-gray-800 text-sm">{visitor.ip || '-'}</td>
                <td className="px-6 py-4 text-gray-500 text-sm">{new Date(visitor.created_at).toLocaleString('tr-TR')}</td>
                <td className="px-6 py-4 text-gray-800 text-sm">{visitor.page || '-'}</td>
                <td className="px-6 py-4 text-gray-500 text-sm">{visitor.duration ? visitor.duration + ' sn' : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredVisitors.length === 0 && (
          <p className="text-center text-gray-500 py-8">Bu dönemde ziyaretçi bulunamadı.</p>
        )}
      </div>
    </div>
  );
}
