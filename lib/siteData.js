// Shared data store - fetches from Supabase
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wompuxhuzmcrioouschv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndvbXB1eGh1em1jcmlvb3VzY2h2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczNzE0ODksImV4cCI6MjA5Mjk0NzQ4OX0.PSm6LFzpn23bgzFvo9pM733sPyiPvj62BCSa3vD1sXw';

const supabase = createClient(supabaseUrl, supabaseKey);

// Otomatik paragraf fonksiyonu
export const autoParagraph = (text) => {
  if (!text) return '';
  if (text.includes('<p') || text.includes('<div') || text.includes('<table')) {
    return text;
  }
  return text
    .split(/\n{2,}/)
    .map(p => p.trim())
    .filter(p => p.length > 0)
    .map(p => `<p style="margin-bottom:15px;">${p.replace(/\n/g, '<br/>')}</p>`)
    .join('\n');
};

// Haberler
export const getNews = async () => {
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) {
    console.error('Haberler yüklenirken hata:', error);
    return [];
  }
  return (data || []).map(item => ({ ...item, images: typeof item.images === "string" ? JSON.parse(item.images || "[]") : item.images }));
};

export const saveNews = async (news) => {
  try {
    for (const item of news) {
      const { id, item_order, ...rest } = item;
      const newsData = {
        title: rest.title || '',
        date: rest.date || '',
        description: rest.description || '',
        image_url: rest.image_url || '',
        document_url: rest.document_url || '',
        signature: rest.signature || '',
        sort_order: item_order || 0
      };
      
      if (id && id > 0) {
        const { error } = await supabase
          .from('news')
          .update(newsData)
          .eq('id', id);
        if (error) {
          console.error('Haber güncellenirken hata:', error);
        }
      } else {
        const { error } = await supabase
          .from('news')
          .insert([newsData]);
        if (error) {
          console.error('Haber eklenirken hata:', error);
        }
      }
    }
    return true;
  } catch (error) {
    console.error('Haberler kaydedilirken hata:', error);
    return false;
  }
};

// Duyurular
export const getAnnouncements = async () => {
  const { data, error } = await supabase
    .from('announcements')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) {
    console.error('Duyurular yüklenirken hata:', error);
    return [];
  }
  return (data || []).map(item => ({ ...item, images: typeof item.images === "string" ? JSON.parse(item.images || "[]") : item.images }));
};

export const saveAnnouncements = async (announcements) => {
  try {
    for (const item of announcements) {
      const { id, item_order, ...rest } = item;
      const announcementData = {
        title: rest.title || '',
        date: rest.date || '',
        description: rest.description || '',
        image_url: rest.image_url || '',
        sort_order: item_order || 0
      };
      
      if (id && id > 0) {
        const { error } = await supabase
          .from('announcements')
          .update(announcementData)
          .eq('id', id);
        if (error) {
          console.error('Duyuru güncellenirken hata:', error);
        }
      } else {
        const { error } = await supabase
          .from('announcements')
          .insert([announcementData]);
        if (error) {
          console.error('Duyuru eklenirken hata:', error);
        }
      }
    }
    return true;
  } catch (error) {
    console.error('Duyurular kaydedilirken hata:', error);
    return false;
  }
};

// Galeri - Albüm formatında
export const getGallery = async () => {
  const { data, error } = await supabase
    .from('gallery')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) {
    console.error('Galeri yüklenirken hata:', error);
    return [];
  }
  return (data || []).map(item => ({ ...item, images: typeof item.images === "string" ? JSON.parse(item.images || "[]") : item.images }));
};

export const saveGallery = async (gallery) => {
  try {
    for (const item of gallery) {
      const { id, order, images, ...rest } = item;
      const albumData = {
        title: rest.title || '',
        content: rest.content || '',
        images: typeof images === 'string' ? images : JSON.stringify(images || []),
        sort_order: order || 0
      };
      
      if (id && id > 0) {
        const { error } = await supabase
          .from('gallery')
          .update(albumData)
          .eq('id', id);
        if (error) {
          console.error('Galeri güncellenirken hata:', error);
        }
      } else {
        const { error } = await supabase
          .from('gallery')
          .insert([albumData]);
        if (error) {
          console.error('Galeri eklenirken hata:', error);
        }
      }
    }
    return true;
  } catch (error) {
    console.error('Galeri kaydedilirken hata:', error);
    return false;
  }
};

// Videolar
export const getVideos = async () => {
  const { data, error } = await supabase
    .from('videos')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) {
    console.error('Videolar yüklenirken hata:', error);
    return [];
  }
  return data || [];
};

export const saveVideos = async (videos) => {
  try {
    for (const item of videos) {
      const { id, order, ...rest } = item;
      const videoData = {
        title: rest.title || '',
        url: rest.url || '',
        description: rest.description || rest.duration || '',
        sort_order: order || 0
      };
      
      let result;
      if (id && id > 0) {
        result = await supabase
          .from('videos')
          .update(videoData)
          .eq('id', id);
      } else {
        result = await supabase
          .from('videos')
          .insert([videoData]);
      }
      
      if (result.error) {
        console.error('Video kaydetme hatası:', id, result.error);
      } else {
        console.log('Video kaydedildi:', id, videoData);
      }
    }
    return true;
  } catch (error) {
    console.error('Videolar kaydedilirken hata:', error);
    return false;
  }
};

// Dernek İçerikleri
export const getDernekContent = async () => {
  const { data, error } = await supabase
    .from('dernek_content')
    .select('*');
  if (error) {
    console.error('Dernek içerik yüklenirken hata:', error);
    return {};
  }
  const result = {};
  if (data) {
    data.forEach(item => {
      result[item.section_key] = item;
    });
  }
  return result;
};

export const saveDernekContent = async (dernek) => {
  try {
    await supabase.from('dernek_content').delete().neq('id', 0);
    for (const [key, item] of Object.entries(dernek)) {
      await supabase.from('dernek_content').insert([{ section_key: key, ...item }]);
    }
    return true;
  } catch (error) {
    console.error('Dernek içerik kaydedilirken hata:', error);
    return false;
  }
};

// Intersteno İçerikleri
export const getInterstenoContent = async () => {
  const { data, error } = await supabase
    .from('intersteno_content')
    .select('*');
  if (error) {
    console.error('Intersteno içerik yüklenirken hata:', error);
    return {};
  }
  const result = {};
  if (data) {
    data.forEach(item => {
      result[item.section_key] = item;
    });
  }
  return result;
};

export const saveInterstenoContent = async (intersteno) => {
  try {
    await supabase.from('intersteno_content').delete().neq('id', 0);
    for (const [key, item] of Object.entries(intersteno)) {
      await supabase.from('intersteno_content').insert([{ section_key: key, ...item }]);
    }
    return true;
  } catch (error) {
    console.error('Intersteno içerik kaydedilirken hata:', error);
    return false;
  }
};

// F Klavye İçerikleri
export const getFKlavyeContent = async () => {
  const { data, error } = await supabase
    .from('fklavye_content')
    .select('*');
  if (error) {
    console.error('F Klavye içerik yüklenirken hata:', error);
    return {};
  }
  const result = {};
  if (data) {
    data.forEach(item => {
      result[item.section_key] = item;
    });
  }
  return result;
};

export const saveFKlavyeContent = async (fklavye) => {
  try {
    await supabase.from('fklavye_content').delete().neq('id', 0);
    for (const [key, item] of Object.entries(fklavye)) {
      await supabase.from('fklavye_content').insert([{ section_key: key, ...item }]);
    }
    return true;
  } catch (error) {
    console.error('F Klavye içerik kaydedilirken hata:', error);
    return false;
  }
};

// İletişim
export const getIletisimContent = async () => {
  const { data, error } = await supabase
    .from('iletisim')
    .select('*')
    .eq('id', 1)
    .single();
  if (error) {
    console.error('İletişim yüklenirken hata:', error);
    return '<p>İletişim bilgileri yakında eklenecek...</p>';
  }
  return data?.content || '<p>İletişim bilgileri yakında eklenecek...</p>';
};

export const saveIletisimContent = async (content) => {
  try {
    await supabase.from('iletisim').update({ content }).eq('id', 1);
    return true;
  } catch (error) {
    console.error('İletişim kaydedilirken hata:', error);
    return false;
  }
};
