export default scene => {
  const state = {
    planeSize: 10,
    scale: 10,
    repeats: 1
  }

  const texture = THREE.loadTexture('floorSquere.png')
  const geometry = new THREE.PlaneBufferGeometry(state.planeSize, state.planeSize, state.planeSize, state.planeSize)
  const material = new THREE.MeshLambertMaterial({ map: texture, wireframe: false });
  const mesh = new THREE.Mesh(geometry, material, 0)

  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.magFilter = THREE.NearestFilter
  texture.repeat.set(state.repeats, state.repeats)
  texture.scale = 5

  mesh.receiveShadow = true
  mesh.scale.set(state.scale, state.scale, state.scale)
  mesh.rotation.x = Math.PI * -.5

  scene.add(mesh)

  return mesh
}
