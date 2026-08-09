self.addEventListener('push', function(event) {
  let data = { title: 'Bimbel Alberta', body: 'Ada pengumuman baru!' };
  
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: 'https://exyrlwugzdvqfiafvfcv.supabase.co/storage/v1/object/public/images/Icon%20193X193.png',
    badge: 'https://exyrlwugzdvqfiafvfcv.supabase.co/storage/v1/object/public/images/Icon%20193X193.png',
    data: data.url || '/'
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data || '/')
  );
});
