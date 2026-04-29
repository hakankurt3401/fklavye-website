import Layout from '../../components/Layout';
import { getVideos } from '../../lib/supabase';
import { useState, useEffect } from 'react';

export default function Videolar() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await getVideos();
      setVideos(data || []);
    } catch (error) {
      console.error('Videolar yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const getEmbedUrl = (url) => {
    if (!url) return null;
    const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s]+)/);
    if (youtubeMatch) {
      return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
    }
    return null;
  };

  const isLocalVideo = (url) => {
    return url && (url.startsWith('/videos/') || url.startsWith('/videos'));
  };

  const isDirectVideo = (url) => {
    if (!url) return false;
    return url.match(/\.(mp4|webm|ogg|mov)$/i) || 
           url.includes('cloudinary.com') ||
           url.includes('vimeo.com');
  };

  if (loading) {
    return (
      <Layout title="Videolar - F Klavye Uçan Parmaklar Derneği">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="bg-white rounded-xl shadow p-6 text-center">
            <p>Yükleniyor...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Videolar - F Klavye Uçan Parmaklar Derneği">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-2xl font-bold text-blue-800 mb-6">Videolar</h2>
          
          {videos.length === 0 ? (
            <p className="text-center text-gray-500 py-8">Henüz video eklenmemiş.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video) => {
                const embedUrl = getEmbedUrl(video.url);
                const localVideo = isLocalVideo(video.url);
                
                return (
                  <div key={video.id} className="bg-blue-50 rounded-lg overflow-hidden">
                    <div className="aspect-video bg-gray-900 relative">
                      {embedUrl ? (
                        <iframe
                          src={embedUrl}
                          className="w-full h-full"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          title={video.title}
                        />
                      ) : localVideo ? (
                        <video
                          src={video.url}
                          controls
                          className="w-full h-full object-contain"
                        >
                          Tarayıcınız video etiketini desteklemiyor.
                        </video>
                      ) : isDirectVideo(video.url) ? (
                        <video
                          src={video.url}
                          controls
                          className="w-full h-full object-contain"
                        >
                          Tarayıcınız video etiketini desteklemiyor.
                        </video>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-800 text-white">
                          <div className="text-center">
                            <span className="text-5xl block mb-2">🎬</span>
                            <p className="text-sm">Video yüklenemedi</p>
                          </div>
                        </div>
                      )}
                      {video.duration && (
                        <span className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs">
                          {video.duration}
                        </span>
                      )}
                    </div>
                    <div className="p-4">
                      <p className="font-medium text-gray-800">{video.title}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}