import './imports'
import Stats from 'lib/stats'
import Player from 'components/player'
import Environment from 'components/environment'

const clock = new THREE.Clock()
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

window.scene = scene // dev
window.camera = camera // dev

/* prysics */
const world = scene.world = new OIMO.World({ 
  timestep: 1 / 60,
  iterations: 8, 
  broadphase: 2, // 1 brute force, 2 sweep and prune, 3 volume tree
  worldscale: 1, // scale full world 
  random: true,  // randomize sample
  info: false,   // calculate statistic or not
  gravity: [0, -98, 0] 
})

/* renderer / filters / shaders */
const renderer = new THREE.WebGLRenderer({ antialias: false })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMap.enabled = true
renderer.shadowMapSoft = true
renderer.shadowCameraNear = 1
renderer.shadowCameraFar = camera.far
renderer.shadowCameraFov = 50
renderer.shadowMapBias = 0.0039
renderer.shadowMapDarkness = .5
renderer.shadowMapWidth = 1024
renderer.shadowMapHeight = 1024
document.body.appendChild(renderer.domElement)

const composer = new EffectComposer(renderer)
const pass = new RenderPass(scene, camera)
composer.addPass(pass)

/* global listeners */
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
  composer.setSize(window.innerWidth, window.innerHeight)
}, false)

window.addEventListener('keydown', e => {
  if (e.keyCode == 192) document.getElementById('menu').classList.toggle('show')
})

/* objects */
Environment(scene)
const stats = new Stats
const player = new Player(camera, scene)

/* raycaster */
let raycaster = new THREE.Raycaster()
window.addEventListener('click', () => {
  let position = camera.getWorldPosition(new THREE.Vector3())
  let direction = camera.getWorldDirection(new THREE.Vector3())

  raycaster.set(position, direction)
  raycaster.intersectObjects(scene.children, true).forEach((i, ind) => {
    if (i.object.name && ind == 4) console.log('hit', i.object.name)
  })
})

/* action */
const action = () => {
  player.control()
  stats.showFps().showMemory()

  Object.values(scene.children).forEach(el => {
    if (el.body && !el.body.sleeping && !el.static) {
      el.position.copy(el.body.getPosition())
      el.quaternion.copy(el.body.getQuaternion())
    }
  })
}

const animate = (time, delta = clock.getDelta()) => {
  world.step()
  action()
  composer.render(delta)
  requestAnimationFrame(animate)
}; animate()
