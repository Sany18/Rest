import './imports'
import Floor from 'components/floor'
import Player from 'components/player'

const clock = new THREE.Clock()
const scene = new Physijs.Scene({ reportsize: 60, fixedTimeStep: 1 / 60 })
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
scene.setGravity(new THREE.Vector3(0, -980, 0))

/* renderer */
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

/* filters / shaders */
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

/* objects */
Floor(scene)
const player = new Player(camera, scene)

const box = new Physijs.BoxMesh(
  new THREE.CubeGeometry( 5, 5, 5 ),
  new THREE.MeshBasicMaterial({ color: 0x888888 })
);
box.position.z = -100
box.position.y = 20
scene.add(box)

/* action */
const action = () => {
  player.control()
}

const animate = (time, delta = clock.getDelta()) => {
  action()
  renderer.render(scene, camera)
  composer.render(delta)
  scene.simulate()
  requestAnimationFrame(animate)
}; animate()
