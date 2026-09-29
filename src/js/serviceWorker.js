// Earlier versions of the site registered a caching service worker (/sw.js).
// Remove it together with its caches for returning visitors.
export const unregister = () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .getRegistrations()
      .then(registrations => {
        registrations.forEach(registration => registration.unregister())
      })
      .catch(error => {
        console.error(error.message)
      })
  }

  if ('caches' in window) {
    caches
      .keys()
      .then(keys => keys.forEach(key => caches.delete(key)))
      .catch(error => {
        console.error(error.message)
      })
  }
}
