export default scene => {
  const state = {
    planeSize: 100,
    scale: 20
  }

  const repeats = state.planeSize / 16
  const geometry = new THREE.PlaneBufferGeometry(state.planeSize, state.planeSize, state.planeSize, state.planeSize)
  const material = new THREE.MeshBasicMaterial({ color: 0xffff00, wireframe: true, opacity: 0.5 });
  const mesh = new Physijs.BoxMesh(geometry, material, 0)

  mesh.receiveShadow = true
  mesh.scale.set(state.scale, state.scale, state.scale)
  mesh.rotation.x = Math.PI * -.5

  scene.add(mesh)

  return mesh
}
