const config = {
  serverPort: 3000
}

try { if (window) {
  window.config = config
}} catch {}

try { if (global) {
  config.serverPort = process.env.PORT || config.serverPort
  module.exports = config
}} catch {}
