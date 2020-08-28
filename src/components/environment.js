const ToRad = 0.0174532925
const ToDeg = 57.295779513
const wallTexture = THREE.loadTexture('wall.jpg')
const boxTexture = THREE.loadTexture('woodBox.png')

const addBodyToWorld = (scene, mesh, geometry) => {
  const size = [geometry.parameters.width, geometry.parameters.height, geometry.parameters.depth]
  const pos = [mesh.position.x, mesh.position.y, mesh.position.z]
  const rot = [mesh.rotation.x * ToDeg, mesh.rotation.y * ToDeg, mesh.rotation.z * ToDeg]

  mesh.body = scene.world.add({ size, pos, rot })
  scene.add(mesh)
}

const Wall = (scene, sx = 5, sy = 5, sz = 5, x = 0, y = 0, z = 0, _x = 0, _y = 0, _z = 0) => {
  const geometry = new THREE.BoxGeometry(sx, sy, sz)
  const material = new THREE.MeshLambertMaterial({ map: wallTexture, wireframe: false });
  const mesh = new THREE.Mesh(geometry, material, 0)

  mesh.receiveShadow = true
  mesh.castShadow = true
  mesh.position.x = x
  mesh.position.y = y
  mesh.position.z = z
  mesh.rotation.x = _x * ToRad
  mesh.rotation.y = _y * ToRad
  mesh.rotation.z = _z * ToRad
  mesh.static = true
  mesh.name = 'wall'

  addBodyToWorld(scene, mesh, geometry)
}

const Box = (scene, sx = 5, sy = 5, sz = 5, x = 0, y = 0, z = 0, _x = 0, _y = 0, _z = 0) => {
  const geometry = new THREE.BoxGeometry(sx, sy, sz)
  const material = new THREE.MeshLambertMaterial({ map: boxTexture, wireframe: false });
  const mesh = new THREE.Mesh(geometry, material, 0)

  mesh.receiveShadow = true
  mesh.castShadow = true
  mesh.position.x = x
  mesh.position.y = y
  mesh.position.z = z
  mesh.rotation.x = _x * ToRad
  mesh.rotation.y = _y * ToRad
  mesh.rotation.z = _z * ToRad
  mesh.static = true
  mesh.name = 'box'

  addBodyToWorld(scene, mesh, geometry)
}

// Wall(scene, width, height, depth, pos_x, pos_y, pos_z, rot_x, rot_y, rot_z)
export default scene => {
  Wall(scene, 5, 10, 20, -20, 5, 20)
  Wall(scene, 5, 10, 20, -10, 5, 10, 0, 90, 0)
  Wall(scene, 5, 20, 20, 0, 10, -50, 0, 90, 0)
  Wall(scene, 5, 20, 20, 50, 10, 50, 0, -45, 0)
  Wall(scene, 5, 50, 20, -30, 3, 40, 0, 0, 60)
  Wall(scene, 5, 50, 20, -75.5, 15.2, 40, 0, 0, 90)
  Wall(scene, 5, 50, 20, -110, 15.2, 25, 0, 90, 90)
  Box(scene, 10, 10, 10, -110, 5, 50)
  Box(scene, 10, 10, 10, 30, 5, 20)
  Box(scene, 10, 10, 10, 40, 5, 20)
  Box(scene, 10, 10, 10, 30, 15, 20, 0, 12, 0)
}
