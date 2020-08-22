import './imports'
import Stats from 'lib/stats'
import DirectionLight from 'components/directionLight'
import Floor from 'components/floor'
import Player from 'components/player'

const clock = new THREE.Clock()
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

/* prysics */
const world = new OIMO.World({ 
  timestep: 1/60, 
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

let coubes = 1
const createCube = () => {
  setTimeout(() => {
    const box = new THREE.Mesh(geo, mat)
    box.position.y = 10
    scene.add(box)
    coubes -= 1
    if (coubes >= 0) createCube()
  }, 200)
}; createCube()




var body = world.add({ 
  type:'sphere', // type of shape : sphere, box, cylinder 
  size:[1,1,1], // size of shape
  pos:[0,0,0], // start position in degree
  rot:[0,0,90], // start rotation in degree
  move:true, // dynamic or statique
  density: 1,
  friction: 0.2,
  restitution: 0.2,
  belongsTo: 1, // The bits of the collision groups to which the shape belongs.
  collidesWith: 0xffffffff // The bits of the collision groups with which the shape collides.
});





/* action */
const stats = new Stats
const action = () => {
  player.control()
  stats.showFps().showMemory()
}

const animate = (time, delta = clock.getDelta()) => {
  action()
  world.step()
  composer.render(delta)
  requestAnimationFrame(animate)
}; animate()
