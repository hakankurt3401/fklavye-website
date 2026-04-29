import { useState } from 'react';

export default function VisitorsManager() {
  const [visitors] = useState([
    { id: 1, ip: '192.168.1.1', date: '2024-01-26 14:30', page: 'Ana Sayfa', duration: '2:45' },
    { id: 2, ip: '192.168.1.2', date: '2024-01-26 14:25', page: 'Tüzük', duration: '1:20' },
    { id: 3, ip: '192.168.1.3', date: '2024-01-26 14:20', page: 'Yönetim Kurulu', duration: '3:10' },
    { id: 4, ip: '192.168.1.1', date: '2024-01-26 13:45', page: 'İletişim', duration: '0:45' },
    { id: 5, ip: '192.168.1.4', date: '2024-01-26 13:30', page: 'Haberler', duration: '4:15' },
    { id: 6, ip: '192.168.1.5', date: '2024-01-26 12:00', page: 'Galeri', duration: '1:30' },
    { id: 7, ip: '192.168.1.6', date: '2024-01-25 18:20', page: 'Ana Sayfa', duration: '5:00' },
    { id: 8, ip: '192.168.1.7', date: '2024-01-25 16:45', page: 'F Klavye', duration: '2:30' },
  ]);

  const stats = {
    totalVisits: visitors.length,
    uniqueIPs: new Set(visitors.map(v => v.ip)).size,
    avgDuration: '2:47',
    mostViewed: 'Ana Sayfa'
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Ziyaretçi İstatistikleri</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow p-4">
          <p className="text-sm text-gray-500">Toplam Ziyaret</p>
          <p className="text-2xl font-bold text-primary">{stats.totalVisits}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-4">
          <p className="text-sm text-gray-500">Benzersiz IP</p>
          <p className="text-2xl font-bold text-primary">{stats.uniqueIPs}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-4">
          <p className="text-sm text-gray-500">Ortalama Süre</p>
          <p className="text-2xl font-bold text-primary">{stats.avgDuration}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-4">
          <p className="text-sm text-gray-500">En Çok Ziyaret</p>
          <p className="text-2xl font-bold text-primary">{stats.mostViewed}</p>
        </div>
      </div>

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
            {visitors.map((visitor) => (
              <tr key={visitor.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-gray-800">{visitor.ip}</td>
                <td className="px-6 py-4 text-gray-500 text-sm">{visitor.date}</td>
                <td className="px-6 py-4 text-gray-800">{visitor.page}</td>
                <td className="px-6 py-4 text-gray-500 text-sm">{visitor.duration}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
