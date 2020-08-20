import './imports'
import Floor from 'components/floor'
import Player from 'components/player'

const clock = new THREE.Clock()
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

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

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
  // composer.setSize(window.innerWidth, window.innerHeight)
}, false)


Floor(scene)
const player = new Player(camera, scene)

const action = () => {
  player.control()
}

const animate = (time, delta = clock.getDelta()) => {
  action()
  renderer.render(scene, camera)
  // composer.render(delta)
  // scene.simulate()
  requestAnimationFrame(animate)
}; animate()
