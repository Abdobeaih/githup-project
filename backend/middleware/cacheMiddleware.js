/**
 * Cache control and ETag middleware for API responses.
 * Reduces bandwidth and improves repeat-visit performance.
 */

// Cache-control for API responses (short TTL for dynamic data)
function cacheControl(maxAgeSeconds = 300) {
  return (req, res, next) => {
    // Only cache GET requests
    if (req.method === 'GET') {
      res.set('Cache-Control', `public, max-age=${maxAgeSeconds}, must-revalidate`)
      res.set('Vary', 'Accept-Encoding')
    } else {
      res.set('Cache-Control', 'no-store')
    }
    next()
  }
}

// Aggressive cache for static-like responses (plans, medical centers, banks)
function staticCache() {
  return cacheControl(600) // 10 minutes
}

// No cache for auth/user-specific data
function noCache() {
  return (req, res, next) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate')
    res.set('Pragma', 'no-cache')
    next()
  }
}

module.exports = { cacheControl, staticCache, noCache }
