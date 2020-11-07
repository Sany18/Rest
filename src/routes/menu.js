import 'assets/menu.scss'

const clock = () => {
  const checkZero = i => (i < 10 ? '0' + 1 : i)
  const today = new Date()
  const D = today.getDate()
  const M = today.getMonth()
  const h = today.getHours()
  const m = checkZero(today.getMinutes())
  const s = checkZero(today.getSeconds())

  document.querySelector('.clock').innerHTML = `${h}:${m}:${s} ${D}.${M}`
  setTimeout(clock, 500)
}

const template = `
  <div class="columns">
    <div class="column">
      <a href="/game">Game</a>
    </div>
    <div class="column">
    </div>
  </div>
  <div class="bottom-bar">
    <div class="bottom-bar__block">
      <button>Start</button>
    </div>
    <div class="bottom-bar__block">
      <div class="clock"></div>
    </div>
  </div>
`

document.write(template)

clock()
