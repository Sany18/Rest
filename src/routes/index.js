switch (window.location.pathname) {
  case '/': require('./menu.js'); break
  case '/game': require('./game/index.js'); break

  default: console.log('nope')
}
