import 'lib/livereload'
import 'lib/consoleIgnore'
import 'lib/global'

switch (window.location.pathname) {
  case '/':          require('./menu.js'); break
  case '/game':      require('./game/index.js'); break
  case '/synthwave': require('./synthwave/index.js'); break

  default: require('./menu.js')
}
