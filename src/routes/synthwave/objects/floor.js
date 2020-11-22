import { GLTFLoader } from 'lib/loaders/GLTFLoader'

export default scene => {
  // const material = new THREE.MeshStandardMaterial()
  const glTFLoader = new GLTFLoader()
  let plane = { offset: { y: 0 } }

  glTFLoader.load('textures/models/scene.gltf', model => {
    plane = model.scene

    // plane.traverse(child => {
    //   if (child instanceof THREE.Mesh) {
    //     child.material.receiveShadow = true
    //   }
    // })

    plane.name = 'floor'
    plane.receiveShadow = true
    plane.position.set(0, -.4, 0)
    plane.scale.x = plane.scale.y = plane.scale.x = .5

    scene.add(plane)
  })
}
