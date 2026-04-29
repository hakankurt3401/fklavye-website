import { useState } from 'react';

export default function Settings() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handlePasswordChange = (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    // Demo: In production, this should validate against backend
    if (currentPassword !== 'Fklavye-2026!') {
      setError('Mevcut şifre hatalı!');
      return;
    }

    if (newPassword.length < 6) {
      setError('Yeni şifre en az 6 karakter olmalıdır!');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Yeni şifreler eşleşmiyor!');
      return;
    }

    // Demo success - in production, this would call an API
    setMessage('Şifre başarıyla değiştirildi!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Ayarlar</h1>

      {/* Şifre Değiştirme */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <h2 className="text-lg font-bold mb-4 text-gray-800">Şifre Değiştir</h2>
        
        {message && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {message}
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-2 text-gray-700">Mevcut Şifre</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2 text-gray-700">Yeni Şifre</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2 text-gray-700">Yeni Şifre (Tekrar)</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-sky-600 text-white py-3 px-6 rounded-lg font-bold hover:bg-sky-700 transition-colors"
          >
            Şifreyi Değiştir
          </button>
        </form>
      </div>

      {/* Site Bilgileri */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-bold mb-4 text-gray-800">Site Bilgileri</h2>
        <div className="space-y-3 text-gray-600">
          <p><strong>Site Adı:</strong> F Klavye Uçan Parmaklar Derneği</p>
          <p><strong>URL:</strong> https://fklavye.org.tr</p>
          <p><strong>Yönetim Paneli:</strong> /admin</p>
          <p><strong>Mevcut Kullanıcı:</strong> fklavye</p>
        </div>
      </div>
    </div>
  );
}
