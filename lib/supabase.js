import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wompuxhuzmcrioouschv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndvbXB1eGh1em1jcmlvb3VzY2h2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczNzE0ODksImV4cCI6MjA5Mjk0NzQ4OX0.PSm6LFzpn23bgzFvo9pM733sPyiPvj62BCSa3vD1sXw';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Fetch functions
export async function getNews() {
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function getAnnouncements() {
  const { data, error } = await supabase
    .from('announcements')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function getGallery() {
  const { data, error } = await supabase
    .from('gallery')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return (data || []).map(item => ({ ...item, images: typeof item.images === "string" ? JSON.parse(item.images || "[]") : item.images }));
}

export async function getVideos() {
  const { data, error } = await supabase
    .from('videos')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function getDernekContent() {
  const { data, error } = await supabase
    .from('dernek_content')
    .select('*')
    .order('created_at', { ascending: true });
  if (error) throw error;
  
  const result = {};
  (data || []).forEach(item => {
    result[item.section_key] = item;
  });
  return result;
}

export async function getInterstenoContent() {
  const { data, error } = await supabase
    .from('intersteno_content')
    .select('*')
    .order('created_at', { ascending: true });
  if (error) throw error;
  
  const result = {};
  (data || []).forEach(item => {
    result[item.section_key] = item;
  });
  return result;
}

export async function getFklavyeContent() {
  const { data, error } = await supabase
    .from('fklavye_content')
    .select('*')
    .order('created_at', { ascending: true });
  if (error) throw error;
  
  const result = {};
  (data || []).forEach(item => {
    result[item.section_key] = item;
  });
  return result;
}

export async function getIletisim() {
  const { data, error } = await supabase
    .from('iletisim')
    .select('*')
    .eq('id', 1)
    .single();
  if (error && error.code !== 'PGRST116') return { content: '' };
  return data || { content: '' };
}

export async function getMessages() {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

// Insert/Update functions
export async function saveNews(newsItem) {
  const newsData = {
    title: newsItem.title || '',
    date: newsItem.date || '',
    description: newsItem.description || '',
    image_url: newsItem.image_url || '',
    document_url: newsItem.document_url || '',
    signature: newsItem.signature || '',
    sort_order: newsItem.sort_order || newsItem.item_order || 0
  };
  
  if (newsItem.id) {
    const { data, error } = await supabase
      .from('news')
      .update(newsData)
      .eq('id', newsItem.id);
    if (error) throw error;
    return data;
  } else {
    const { data, error } = await supabase
      .from('news')
      .insert(newsData);
    if (error) throw error;
    return data;
  }
}

export async function saveAnnouncement(item) {
  const announcementData = {
    title: item.title || '',
    date: item.date || '',
    description: item.description || '',
    image_url: item.image_url || '',
    sort_order: item.sort_order || item.item_order || 0
  };
  
  if (item.id) {
    const { data, error } = await supabase
      .from('announcements')
      .update(announcementData)
      .eq('id', item.id);
    if (error) throw error;
    return data;
  } else {
    const { data, error } = await supabase
      .from('announcements')
      .insert(announcementData);
    if (error) throw error;
    return data;
  }
}

export async function saveGallery(item) {
  const galleryData = {
    title: item.title || '',
    content: item.content || '',
    images: typeof item.images === 'string' ? item.images : JSON.stringify(item.images || []),
    sort_order: item.sort_order || item.order || 0
  };
  
  if (item.id) {
    const { data, error } = await supabase
      .from('gallery')
      .update(galleryData)
      .eq('id', item.id);
    if (error) throw error;
    return data;
  } else {
    const { data, error } = await supabase
      .from('gallery')
      .insert(galleryData);
    if (error) throw error;
    return data;
  }
}

export async function saveVideo(item) {
  const videoData = {
    title: item.title || '',
    url: item.url || '',
    description: item.description || item.duration || '',
    sort_order: item.sort_order || item.order || 0
  };
  
  if (item.id) {
    const { data, error } = await supabase
      .from('videos')
      .update(videoData)
      .eq('id', item.id);
    if (error) throw error;
    return data;
  } else {
    const { data, error } = await supabase
      .from('videos')
      .insert(videoData);
    if (error) throw error;
    return data;
  }
}

export async function saveDernekContent(key, content) {
  const { data, error } = await supabase
    .from('dernek_content')
    .upsert({ section_key: key, ...content });
  if (error) throw error;
  return data;
}

export async function saveInterstenoContent(key, content) {
  const { data, error } = await supabase
    .from('intersteno_content')
    .upsert({ section_key: key, ...content });
  if (error) throw error;
  return data;
}

export async function saveFklavyeContent(key, content) {
  const { data, error } = await supabase
    .from('fklavye_content')
    .upsert({ section_key: key, ...content });
  if (error) throw error;
  return data;
}

export async function saveIletisim(content) {
  const { data, error } = await supabase
    .from('iletisim')
    .upsert({ id: 1, content });
  if (error) throw error;
  return data;
}

export async function saveMessage(message) {
  const { data, error } = await supabase
    .from('messages')
    .insert(message);
  if (error) throw error;
  return data;
}

// Delete functions
export async function deleteNews(id) {
  const { error } = await supabase
    .from('news')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

export async function deleteAnnouncement(id) {
  const { error } = await supabase
    .from('announcements')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

export async function deleteGallery(id) {
  const { error } = await supabase
    .from('gallery')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

export async function deleteVideo(id) {
  const { error } = await supabase
    .from('videos')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

// Storage functions
export async function uploadFile(bucket, fileName, file) {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file);
  if (error) throw error;
  return data;
}

export function getPublicUrl(bucket, fileName) {
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(fileName);
  return data.publicUrl;
}
