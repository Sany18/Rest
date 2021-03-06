import 'assets/menu.scss'
import 'lib/moveElement'

const template = `
  <div class="window moveable" style="width: 300px">
    <div class="title-bar moveable-button">
      <div class="title-bar-text">D:/Games</div>
      <div class="title-bar-controls">
        <button aria-label="Minimize"></button>
        <button aria-label="Maximize"></button>
        <button aria-label="Close"></button>
      </div>
    </div>
    <div class="window-body">
      <p>Go to...</p>
      <button onclick="location.href='/game'">Game</button>
      <button onclick="location.href='/synthwave'">Synthwave</button>
    </div>
  </div>

  <div class="window moveable" style="width: 130px">
    <div class="title-bar moveable-button">
      <div class="title-bar-text">D:/CPP</div>
      <div class="title-bar-controls">
        <button aria-label="Minimize"></button>
        <button aria-label="Maximize"></button>
        <button aria-label="Close"></button>
      </div>
    </div>
    <div class="window-body">
      <button onclick="location.href='/wasm'">First wasm</button>
    </div>
  </div>

  <div class="bottom-bar">
    <div>
      <button class="start-button">
        Start
      </button>
    </div>
    <div class="bottom-bar__block">
      <div class="clock"></div>
    </div>
  </div>
`
document.write(template)

const clock = () => {
  const checkZero = i => (i < 10 ? '0' + 1 : i)
  const today = new Date()
  const Y = (today.getFullYear() + '').substr(2)
  const D = today.getDate()
  const M = today.getMonth() + 1
  const h = today.getHours()
  const m = checkZero(today.getMinutes())
  const s = checkZero(today.getSeconds())

  document.querySelector('.clock').innerHTML = `${h}:${m}:${s} ${D}.${M}.${Y}`
  setTimeout(clock, 500)
}; clock()

document.addEventListener('contextmenu', event => {
  event.preventDefault()
  const el = document.querySelector('.context-menu')
  if (el) el.remove()
  const links = `
    <a href='/'>Go home</a>
    <div onclick="alert('a')">Alert</div>
    <div onclick="console.log('yep, log')">Take a log</div>
  `

  const menu = document.createElement('div')
  menu.style.cssText = `top: ${event.clientY}px; left: ${event.clientX}px;`
  menu.classList.add('context-menu')
  menu.innerHTML = links
  document.body.appendChild(menu)
}, false)

document.addEventListener('click', event => {
  const el = document.querySelector('.context-menu')
  if (el) el.remove()
}, false)
