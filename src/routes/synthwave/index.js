import './importer'
import {
  DirectionLight, Floor, FlyCameraControl, Skybox,
  Mountain, Road, StreetLight, Billboard
} from './objects/index.js'
import { EffectComposer, RenderPass } from 'postprocessing'
import Stats from 'lib/stats.js'

const scene = new THREE.Scene()
const clock = new THREE.Clock()
const stats = new Stats()
const state = {
  camera: { angle: 75, far: 5000, near: .1 },
  rideSpeed: .02,
  renderer: { antialias: false },
  pixelRatio: 1
}

/* camera */
let camera = new THREE.PerspectiveCamera(
  state.camera.angle, window.innerWidth / window.innerHeight,
  state.camera.near, state.camera.far)
camera.position.y = .5
camera.position.z = 20

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
document.body.appendChild(renderer.domElement)

/* filters / shaders */
const composer = new EffectComposer(renderer)
const pass = new RenderPass(scene, camera)
composer.addPass(pass)
pass.renderToScreen = true

/* global. listeners */
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
  composer.setSize(window.innerWidth, window.innerHeight)
}, false)

/* After initialize */
/* objects */
Skybox(scene)
DirectionLight(scene)

let billboard = Billboard(scene, -10)
const road = Road(scene)
const floorTexture = Floor(scene)
const flyCamera = FlyCameraControl(camera, document)
const mountains = []
const streetLights = []

scene.fog = new THREE.Fog(0x000000, .1, 100)

for(let i = 0; i < 5; i++) {
  streetLights.push(StreetLight(scene, (i * -10) + 15))
  mountains.push(Mountain(scene, Math.randIntBetweenRanges([-20, -4], [4, 20]), Math.randInt(0, 20)))
}

/* analyser */
let analyser, dataArray = false
const getAudioCtx = (stream, type = 'stream') => {
  const audioCtx = new AudioContext()
  const source = type == 'stream'
    ? audioCtx.createMediaStreamSource(stream)
    : audioCtx.createMediaElementSource(stream)

  analyser = audioCtx.createAnalyser()
  source.connect(analyser)
  analyser.fftSize = 64

  dataArray = new Uint8Array(analyser.frequencyBinCount)
}

const updateVisualiser = () => {
  if (!dataArray) { return }

  analyser.getByteFrequencyData(dataArray)

  while (mountains.length < 15) {
    mountains.push(Mountain(scene, Math.randIntBetweenRanges([-20, -4], [4, 20]), Math.randInt(0, -20)))
  }

  for (let i = 0; i < streetLights.length; i++) {
    streetLights[i].position.z += state.rideSpeed
    streetLights[i].children[3].intensity = (dataArray[12] / 255 * 1.5) + .5

    if (streetLights[i].position.z > 40) {
      scene.remove(streetLights[i])
      streetLights.splice(i, 1)
      streetLights.push(StreetLight(scene, -10))
    }
  }

  for (let i = 0; i < mountains.length; i++) {
    mountains[i].updateMountainHeight(dataArray[i * 2] / 35)
    mountains[i].position.z += state.rideSpeed

    if (mountains[i].position.z > 25) {
      scene.remove(mountains[i])
      mountains.splice(i, 1)
    }
  }
}

navigator.mediaDevices.getUserMedia({ audio: { deviceId: 'default' }, video: false })
  .then(getAudioCtx)

/* action */
const action = (time, delta) => {
  stats.showFps()
  flyCamera(delta)

  if (billboard.position.z > 25) {scene.remove(billboard); billboard = null}
  if (!billboard) billboard = Billboard(scene, -30)
  billboard.position.z += state.rideSpeed

  floorTexture.offset.y += state.rideSpeed
  road.offset.y += state.rideSpeed

  updateVisualiser()
}

const animate = (time, delta = clock.getDelta()) => {
  action(time, delta)
  composer.render(delta)
  requestAnimationFrame(animate)
}; animate()
