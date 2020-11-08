export default scene => {
  const state = {
    planeSize: 1000,
    segments: 1,
    repeats: 100
  }

  const texture = THREE.loadTexture('floorSquere.png')
  const geometry = new THREE.PlaneGeometry(state.planeSize, state.planeSize, state.segments, state.segments)
  const material = new THREE.MeshLambertMaterial({ map: texture, wireframe: false });
  const mesh = new THREE.Mesh(geometry, material, 0)

  // for(let i = 0; i < geometry.vertices.length; i++) {
  //   geometry.vertices[i].z = Math.floor((Math.random()*10)+1)
  // }

  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.magFilter = THREE.NearestFilter
  texture.repeat.set(state.repeats, state.repeats)

  mesh.receiveShadow = true
  mesh.rotation.x = Math.PI * -.5
  mesh.static = true
  mesh.name = 'floor'

  mesh.body = scene.world.add({ size:[10000, 10, 10000], pos:[0, -5, 0] })

  scene.add(mesh)

  return mesh
}
