// Kill switch for the service worker that earlier versions of the site
// registered: browsers that still have it installed pick this file up on
// their next update check, drop all caches, unregister and reload open tabs.
self.addEventListener('install', () => self.skipWaiting())

self.addEventListener('activate', event => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys()
      await Promise.all(keys.map(key => caches.delete(key)))
      await self.registration.unregister()
      const clients = await self.clients.matchAll({type: 'window'})
      clients.forEach(client => client.navigate(client.url))
    })()
  )
})
