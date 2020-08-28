export default scene => {
  const state = {
    planeSize: 1,
    scale: 10000,
    repeats: 100
  }

  const texture = THREE.loadTexture('floorSquere.png')
  const geometry = new THREE.PlaneBufferGeometry(state.planeSize, state.planeSize, state.planeSize, state.planeSize)
  const material = new THREE.MeshLambertMaterial({ map: texture, wireframe: false });
  const mesh = new THREE.Mesh(geometry, material, 0)

  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.magFilter = THREE.NearestFilter
  texture.repeat.set(state.repeats, state.repeats)

  mesh.receiveShadow = true
  mesh.scale.set(state.scale, state.scale, state.scale)
  mesh.rotation.x = Math.PI * -.5
  mesh.name = 'static'

  mesh.body = scene.world.add({ size:[10000, 10, 10000], pos:[0, -5, 0] })

  scene.add(mesh)

  return mesh
}
