import './imports'
import Stats from 'lib/stats'
import DirectionLight from 'components/directionLight'
import Floor from 'components/floor'
import Player from 'components/player'

const clock = new THREE.Clock()
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

window.scene = scene // dev

/* prysics */
const world = scene.world = new OIMO.World({ 
  timestep: 1 / 60, 
  iterations: 8, 
  broadphase: 2, // 1 brute force, 2 sweep and prune, 3 volume tree
  worldscale: 1, // scale full world 
  random: true,  // randomize sample
  info: false,   // calculate statistic or not
  gravity: [0, -9.8, 0] 
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
Floor(scene)
DirectionLight(scene)
const player = new Player(camera, scene)

const geo = new THREE.CubeGeometry(5, 5, 5)
const mat = new THREE.MeshLambertMaterial({ color: 0x888888 })

let coubes = 50
const createCube = () => {
  setTimeout(() => {
    const mesh = new THREE.Mesh(geo, mat)
    mesh.castShadow = true
    mesh.body = scene.world.add({ size:[5, 5, 5], pos:[0, 20, 0], move: true })
    mesh.name = '1'
    scene.add(mesh)

    coubes -= 1
    if (coubes >= 0) createCube()
  }, 500)
}; createCube()

scene.fog = new THREE.Fog(0x000000)
scene.background = new THREE.CubeTextureLoader().load(
  Array(6).fill().map((_, i) => `/textures/skybox-space-2/${i + 1}.png`)
)

/* action */
const stats = new Stats
const action = () => {
  player.control()
  stats.showFps().showMemory()
}

const animate = (time, delta = clock.getDelta()) => {
  world.step()

  Object.values(scene.children).forEach(el => {
    if (el.body && !el.body.sleeping) {
      switch(el.name) {
        case 'me':
          el.body.setPosition(el.position)
          el.body.setQuaternion(el.quaternion)
          el.body.updatePosition(1)
        break;
        case '1':
          el.position.copy(el.body.getPosition())
          el.quaternion.copy(el.body.getQuaternion())
        break;
      }
    }
  })

  action()
  composer.render(delta)
  requestAnimationFrame(animate)
}; animate()
