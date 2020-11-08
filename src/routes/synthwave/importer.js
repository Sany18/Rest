import * as THREE from 'three'
import * as OIMO from 'oimo'
import { EffectComposer, RenderPass } from 'postprocessing'

window.THREE = THREE
window.OIMO = OIMO
window.EffectComposer = EffectComposer
window.RenderPass = RenderPass

THREE.loadTexture = name => {
  return new THREE.TextureLoader().load(
    `/textures/${name}`,
    texture => {},
    xhr => console.info((xhr.loaded / xhr.total * 100) + ' % loaded'), // temporarily unavailable
    xhr => console.info('Texture not loaded ' + name)
  )
}
