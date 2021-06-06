import 'lib/consoleIgnore'
import 'lib/global'

if (process.env.NODE_ENV == 'development') {
  require('lib/livereload')
}

switch (window.location.pathname) {
  case '/':          require('./menu.js'); break
  case '/game':      require('./game/index.js'); break
  case '/synthwave': require('./synthwave/index.js'); break
  case '/wasm':      require('./wasm/dist/app.js'); break

  default: require('./menu.js')
}
