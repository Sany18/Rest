const config = {
  serverPort: process.env.PORT || 3000
}

// web
try { if (window) {
  window.config = config
}} catch {}


// node
try { if (global) {
  config.serverPort = process.env.PORT || config.serverPort
  global.config = config
}} catch {}
