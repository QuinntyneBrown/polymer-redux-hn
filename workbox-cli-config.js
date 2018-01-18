module.exports = {
  "globDirectory": "dist/",
  "globPatterns": [
    "**/*.{html,json,js}"
  ],
  "swDest": "dist/sw.js",
  "clientsClaim": true,
  "skipWaiting": true,
  "runtimeCaching":  [
    {
      "urlPattern": new RegExp('/api/'),
      "handler": "networkFirst"
    }
  ]
};
