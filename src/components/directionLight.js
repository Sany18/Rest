export default (scene) => {
  const state = {
    position: { x: 0, y: 200, z: -200 },
    size: 300,
    color: 0xffffff,
    shadowResolution: 2048
  }
  const light = new THREE.DirectionalLight(state.color, .5)
  const ambientlight = new THREE.AmbientLight(0x404040)

  light.position.set(state.position.x, state.position.y, state.position.z)
  light.target.position.set(0, 0, 0)

  light.castShadow = true
  light.shadow.camera.left = -state.size
  light.shadow.camera.right = state.size
  light.shadow.camera.top = state.size
  light.shadow.camera.bottom = -state.size
  light.shadow.mapSize.width = state.shadowResolution
  light.shadow.mapSize.height = state.shadowResolution

//     let helper = new THREE.CameraHelper(light.shadow.camera)
//     scene.add(helper)

  scene.add(light)
  scene.add(ambientlight)

  return light
}
