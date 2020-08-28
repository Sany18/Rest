import './imports'
import Stats from 'lib/stats'
import DirectionLight from 'components/directionLight'
import Floor from 'components/floor'
import Player from 'components/player'
import Environment from 'components/environment'

const clock = new THREE.Clock()
const scene = new THREE.Scene()
window.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

window.scene = scene // dev

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

/* objects */
const stats = new Stats
Floor(scene)
DirectionLight(scene)
Environment(scene)
const player = new Player(camera, scene)

const geo = new THREE.CubeGeometry(5, 5, 5)
const texture = THREE.loadTexture('woodBox.png')
const mat = new THREE.MeshLambertMaterial({ map: texture })
let coubes = 20
const createCube = () => {
  setTimeout(() => {
    const mesh = new THREE.Mesh(geo, mat)
    mesh.castShadow = true
    mesh.body = scene.world.add({ size:[5, 5, 5], pos:[5, 5, 0], move: true })
    mesh.name = 'box'
    window.coube = mesh
    scene.add(mesh)

    coubes -= 1
    if (coubes >= 0) createCube()
  }, 200)
}; createCube()

scene.fog = new THREE.Fog(0xffffff)
const skyboxNames = ['ft', 'bk', 'up', 'dn', 'rt', 'lf']
scene.background = new THREE.CubeTextureLoader().load(
  skyboxNames.map(name => `/textures/skybox-clouds/${name}.jpg`)
)

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
