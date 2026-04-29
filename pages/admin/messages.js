import { useState, useEffect } from 'react';

export default function MessagesManager() {
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = JSON.parse(localStorage.getItem('site_messages') || '[]');
      setMessages(stored);
    }
  }, []);

  const markAsRead = (id) => {
    const updated = messages.map(m => m.id === id ? { ...m, read: true } : m);
    setMessages(updated);
    localStorage.setItem('site_messages', JSON.stringify(updated));
  };

  const deleteMessage = (id) => {
    if (!confirm('Bu mesajı silmek istediğinizden emin misiniz?')) return;
    const updated = messages.filter(m => m.id !== id);
    setMessages(updated);
    localStorage.setItem('site_messages', JSON.stringify(updated));
    setSelectedMessage(null);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Gelen Mesajlar</h1>

      {messages.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-8 text-center text-gray-500">
          <span className="text-4xl block mb-2">📭</span>
          <p>Henüz mesaj bulunmamaktadır.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="divide-y divide-gray-200">
            {messages.map((msg) => (
              <div
                key={msg.id}
                onClick={() => {
                  setSelectedMessage(msg);
                  if (!msg.read) markAsRead(msg.id);
                }}
                className={`p-4 cursor-pointer hover:bg-gray-50 ${!msg.read ? 'bg-blue-50' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {!msg.read && <span className="w-2 h-2 bg-sky-600 rounded-full"></span>}
                    <div>
                      <p className="font-bold text-gray-800">{msg.name}</p>
                      <p className="text-sm text-gray-500">{msg.email}</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-400">{msg.date}</span>
                </div>
                <p className="mt-2 text-gray-600 text-sm truncate">{msg.subject} - {msg.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Message Detail Modal */}
      {selectedMessage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedMessage(null)}
        >
          <div className="bg-white rounded-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-xl text-gray-800">{selectedMessage.name}</h3>
                <p className="text-sm text-gray-500">{selectedMessage.email}</p>
                {selectedMessage.phone && <p className="text-sm text-gray-500">{selectedMessage.phone}</p>}
              </div>
              <span className="text-sm text-gray-400">{selectedMessage.date}</span>
            </div>
            <div className="mb-4">
              <span className="text-xs font-bold text-gray-500 uppercase">Konu:</span>
              <p className="text-gray-800 font-medium">{selectedMessage.subject}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-gray-700 whitespace-pre-wrap">{selectedMessage.message}</p>
            </div>
            <div className="flex gap-3">
              <a
                href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                className="flex-1 bg-sky-600 text-white py-2 rounded-lg font-bold text-center hover:bg-sky-700"
              >
                E-posta ile Yanıtla
              </a>
              <button
                onClick={() => deleteMessage(selectedMessage.id)}
                className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-red-600"
              >
                Sil
              </button>
              <button
                onClick={() => setSelectedMessage(null)}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-bold hover:bg-gray-300"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
