import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export default function MessagesManager() {
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Mesajlar yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await supabase.from('messages').update({ read: true }).eq('id', id);
      setMessages(messages.map(m => m.id === id ? { ...m, read: true } : m));
    } catch (error) {
      console.error('Okundu işaretleme hatası:', error);
    }
  };

  const deleteMessage = async (id) => {
    if (!confirm('Bu mesajı silmek istediğinizden emin misiniz?')) return;
    try {
      await supabase.from('messages').delete().eq('id', id);
      setMessages(messages.filter(m => m.id !== id));
      setSelectedMessage(null);
    } catch (error) {
      console.error('Mesaj silme hatası:', error);
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Yükleniyor...</div>;
  }

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
                  <span className="text-sm text-gray-400">{new Date(msg.created_at).toLocaleDateString('tr-TR')}</span>
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
              </div>
              <span className="text-sm text-gray-400">{new Date(selectedMessage.created_at).toLocaleString('tr-TR')}</span>
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
