import './importer'
import {
  DirectionLight, Floor, FlyCameraControl, Skybox,
  Road, StreetLight, Billboard
} from './objects/index.js'
import { EffectComposer } from 'lib/postprocessing/EffectComposer'
import { RenderPass } from 'lib/postprocessing/RenderPass'
import { FilmPass } from 'lib/postprocessing/FilmPass'
// import { BloomPass } from 'lib/postprocessing/BloomPass'
import Stats from 'lib/stats.js'
import handleListeners from './listeners'

const scene = new THREE.Scene()
const clock = new THREE.Clock()
const stats = new Stats()
const state = {
  camera: { angle: 75, far: 5000, near: .1 },
  rideSpeed: .05,
  renderer: { antialias: false },
  pixelRatio: 1
}

/* camera */
let camera = new THREE.PerspectiveCamera(
  state.camera.angle, window.innerWidth / window.innerHeight,
  state.camera.near, state.camera.far)
camera.position.y = .5
camera.position.z = 0

/* renderer */
let renderer = new THREE.WebGLRenderer(state.renderer)
renderer.setPixelRatio(devicePixelRatio * state.pixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMap.enabled = true
renderer.shadowMapSoft = true
renderer.shadowCameraNear = state.camera.near
renderer.shadowCameraFar = state.camera.far
renderer.shadowCameraFov = 50
renderer.shadowMapBias = 0.0039
renderer.shadowMapDarkness = .5
renderer.shadowMapWidth = 1024
renderer.shadowMapHeight = 1024

renderer.domElement.id = 'renderer'
document.body.appendChild(renderer.domElement)

/* filters / shaders */
EffectComposer.prototype.removePass = function(targetPass) {
  this.passes = this.passes.filter(pass => {
    return pass.constructor.name != targetPass.constructor.name
  })
}

const composer = new EffectComposer(renderer)
const renderPass = new RenderPass(scene, camera)
// const bloomPass = new BloomPass()
const filmPass = new FilmPass(0.2, 0.2, 648, false)
      filmPass.enabled = false
composer.addPass(renderPass)
composer.addPass(filmPass)

/* global. listeners */
handleListeners(
  camera, renderer, composer, filmPass,
  stats
)

/* After initialize */
/* objects */
Skybox(scene)
// DirectionLight(scene)

let billboard = Billboard(scene, -50)
const road = Road(scene)
const floorTexture = Floor(scene)
const updateFlyCamera = FlyCameraControl(camera, document)
const streetLights = []

scene.fog = new THREE.Fog(0x000000, .1, 100)

for(let i = 0; i < 13; i++) {
  // add every z: 10
  streetLights.push(StreetLight(scene, (i * -10) + 15))
}

/* analyser */
// let analyser, dataArray = null
// const getAudioCtx = (stream, type = 'stream') => {
//   const audioCtx = new AudioContext()
//   const source = type == 'stream'
//     ? audioCtx.createMediaStreamSource(stream)
//     : audioCtx.createMediaElementSource(stream)

//   analyser = audioCtx.createAnalyser()
//   source.connect(analyser)
//   analyser.fftSize = 64

//   dataArray = new Uint8Array(analyser.frequencyBinCount)
// }

const updateStreenLights = () => {
  for (let i = 0; i < streetLights.length; i++) {
    streetLights[i].position.z += state.rideSpeed
    streetLights[i].children[3].intensity = 2

    if (streetLights[i].position.z > 50) {
      scene.remove(streetLights[i])
      streetLights.splice(i, 1)
      streetLights.push(StreetLight(scene, -50))
    }
  }
}

const updateBillboards = () => {
  if (billboard.position.z > 50) {scene.remove(billboard); billboard = null}
  if (!billboard) billboard = Billboard(scene, -50)
  billboard.position.z += state.rideSpeed
}

/* action */
const action = (time, delta) => {
  stats.showFps()
  updateFlyCamera(delta)
  updateBillboards()
  updateStreenLights()

  floorTexture.offset.y += state.rideSpeed
  road.offset.y += state.rideSpeed
}

const animate = (time, delta = clock.getDelta()) => {
  action(time, delta)
  composer.render(delta)
  requestAnimationFrame(animate)
}; animate()
