import * as THREE from 'three'
import * as OIMO from 'oimo'
import './template'
import 'assets/synthwave.scss'

window.THREE = THREE
window.OIMO = OIMO

if (process.env.NODE_ENV != 'development') {
  console.log(`
    License:
    This work is based on "Synthwave | 80s retro style foreground" 
    (https://sketchfab.com/3d-models/synthwave-80s-retro-style-foreground-5184125634af45a4b1a657b7d51c3d6e) 
    by Omer Bhatti (https://sketchfab.com/OmerBhatti) licensed under CC-BY-4.0 (http://creativecommons.or
    g/licenses/by/4.0/)
  `)
}

THREE.loadTexture = name => {
  return new THREE.TextureLoader().load(
    `/textures/${name}`,
    texture => {},
    xhr => console.info((xhr.loaded / xhr.total * 100) + ' % loaded'), // temporarily unavailable
    xhr => console.info('Texture not loaded ' + name)
  )
}
