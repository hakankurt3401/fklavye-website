const fs = require('fs');
const path = require('path');

const SUPABASE_URL = 'https://wompuxhuzmcrioouschv.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndvbXB1eGh1em1jcmlvb3VzY2h2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczNzE0ODksImV4cCI6MjA5Mjk0NzQ4OX0.PSm6LFzpn23bgzFvo9pM733sPyiPvj62BCSa3vD1sXw';

async function supabaseRequest(table, method, data, params = '') {
  const url = `${SUPABASE_URL}/rest/v1/${table}${params}`;
  
  const options = {
    method: method,
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Prefer': method === 'POST' ? 'return=representation' : ''
    }
  };
  
  if (data && (method === 'POST' || method === 'PATCH' || method === 'PUT')) {
    options.body = JSON.stringify(data);
  }
  
  try {
    const response = await fetch(url, options);
    const text = await response.text();
    
    if (!response.ok && method === 'POST') {
      console.log(`  Error: ${text.substring(0, 100)}`);
      return null;
    }
    
    return text;
  } catch (error) {
    console.error(`  Fetch error:`, error.message);
    return null;
  }
}

async function importSection(tableName, dataObj) {
  if (!dataObj || typeof dataObj !== 'object') {
    console.log(`  Skipping ${tableName} - no data`);
    return;
  }
  
  let count = 0;
  for (const [key, item] of Object.entries(dataObj)) {
    const record = {
      section_key: key,
      title: item?.title || '',
      content: item?.content || item?.description || '',
      date: item?.date || ''
    };
    
    const result = await supabaseRequest(tableName, 'POST', record);
    if (result) count++;
  }
  console.log(`  Imported ${count} items to ${tableName}`);
}

async function runImport() {
  console.log('Starting backup import...\n');
  
  const backupPath = path.join(__dirname, 'fklavye-backup-2026-04-27.json');
  
  if (!fs.existsSync(backupPath)) {
    console.error('Backup file not found:', backupPath);
    return;
  }
  
  const backupContent = fs.readFileSync(backupPath, 'utf8');
  let backup;
  
  try {
    backup = JSON.parse(backupContent);
  } catch (e) {
    console.error('Failed to parse backup file:', e.message);
    return;
  }
  
  console.log('Backup file loaded successfully\n');
  
  // Parse stringified arrays if needed
  if (typeof backup.news === 'string') {
    try {
      backup.news = JSON.parse(backup.news);
    } catch {}
  }
  if (typeof backup.announcements === 'string') {
    try {
      backup.announcements = JSON.parse(backup.announcements);
    } catch {}
  }
  if (typeof backup.gallery === 'string') {
    try {
      backup.gallery = JSON.parse(backup.gallery);
    } catch {}
  }
  if (typeof backup.videos === 'string') {
    try {
      backup.videos = JSON.parse(backup.videos);
    } catch {}
  }
  
  // Parse stringified objects if needed
  if (typeof backup.dernek === 'string') {
    try {
      backup.dernek = JSON.parse(backup.dernek);
    } catch {}
  }
  if (typeof backup.intersteno === 'string') {
    try {
      backup.intersteno = JSON.parse(backup.intersteno);
    } catch {}
  }
  if (typeof backup.fklavye === 'string') {
    try {
      backup.fklavye = JSON.parse(backup.fklavye);
    } catch {}
  }
  
  console.log('Data summary:');
  console.log(`  - ${Array.isArray(backup.news) ? backup.news.length : 0} news items`);
  console.log(`  - ${Array.isArray(backup.announcements) ? backup.announcements.length : 0} announcements`);
  console.log(`  - ${Array.isArray(backup.gallery) ? backup.gallery.length : 0} gallery items`);
  console.log(`  - ${Array.isArray(backup.videos) ? backup.videos.length : 0} videos`);
  console.log(`  - ${backup.dernek && typeof backup.dernek === 'object' ? Object.keys(backup.dernek).length : 0} dernek sections`);
  console.log(`  - ${backup.intersteno && typeof backup.intersteno === 'object' ? Object.keys(backup.intersteno).length : 0} intersteno sections`);
  console.log(`  - ${backup.fklavye && typeof backup.fklavye === 'object' ? Object.keys(backup.fklavye).length : 0} fklavye sections`);
  console.log('');
  
  // Import array data
  console.log('Importing array data...');
  
  if (Array.isArray(backup.news)) {
    console.log('\nNews:');
    for (const item of backup.news) {
      const news = {
        title: item.title || '',
        date: item.date || '',
        description: item.description || '',
        image_url: item.imageUrl || item.image_url || '',
        document_url: item.documentUrl || item.document_url || '',
        signature: item.signature || '',
        sort_order: item.order || 0
      };
      await supabaseRequest('news', 'POST', news);
    }
    console.log(`  Imported ${backup.news.length} news items`);
  }
  
  if (Array.isArray(backup.announcements)) {
    console.log('\nAnnouncements:');
    for (const item of backup.announcements) {
      const announcement = {
        title: item.title || '',
        date: item.date || '',
        description: item.description || '',
        image_url: item.imageUrl || item.image_url || '',
        sort_order: item.order || 0
      };
      await supabaseRequest('announcements', 'POST', announcement);
    }
    console.log(`  Imported ${backup.announcements.length} announcements`);
  }
  
  if (Array.isArray(backup.gallery)) {
    console.log('\nGallery:');
    for (const item of backup.gallery) {
      const gallery = {
        title: item.title || '',
        content: item.content || item.description || '',
        images: typeof item.images === 'string' ? item.images : JSON.stringify(item.images || []),
        sort_order: item.order || 0
      };
      await supabaseRequest('gallery', 'POST', gallery);
    }
    console.log(`  Imported ${backup.gallery.length} gallery items`);
  }
  
  if (Array.isArray(backup.videos)) {
    console.log('\nVideos:');
    for (const item of backup.videos) {
      const video = {
        title: item.title || '',
        url: item.url || item.videoUrl || '',
        description: item.description || '',
        sort_order: item.order || 0
      };
      await supabaseRequest('videos', 'POST', video);
    }
    console.log(`  Imported ${backup.videos.length} videos`);
  }
  
  // Import object data
  console.log('\nImporting object data...');
  
  console.log('\nDernek:');
  await importSection('dernek_content', backup.dernek);
  
  console.log('\nIntersteno:');
  await importSection('intersteno_content', backup.intersteno);
  
  console.log('\nFklavye:');
  await importSection('fklavye_content', backup.fklavye);
  
  console.log('\n✅ All data imported successfully!');
}

runImport().catch(console.error);