const config = {
  jumpHeight: 40,
  speed: 35,
  mass: 1
}

export default class Player {
  constructor(camera, scene) {
    this.camera = camera
    this.scene = scene
    this.player = this.createPlayerModel()
    this.connect()
  }

  /*get*/
  moveForward = false
  moveBackward = false
  moveLeft = false
  moveRight = false
  rotationRight = false
  rotationLeft = false
  jump = false
  crouch = false
  canJump = true

  direction = new THREE.Vector3()
  nullVector = new THREE.Vector3(0, 0, 0)
  mainDirectionVector = new THREE.Vector3(0, 0, 1)
  quaternion = new THREE.Quaternion()

  eulerX = new THREE.Euler(0, 0, 0, 'YXZ')
  eulerY = new THREE.Euler(0, 0, 0, 'YXZ')

  control = () => {
    if (document.pointerLockElement) {
      this.player.body.resetQuaternion(this.quaternion.setFromEuler(this.eulerY))

      this.player.body.linearVelocity.x = 0
      this.player.body.linearVelocity.z = 0

      this.direction.z = +this.moveForward - +this.moveBackward
      this.direction.x = +this.moveLeft - +this.moveRight

      let cameraDirection = camera.getWorldDirection(this.nullVector).multiplyScalar(config.speed)
      if (this.moveForward || this.moveBackward) {
        this.player.body.linearVelocity.x += cameraDirection.x * this.direction.z
        this.player.body.linearVelocity.z += cameraDirection.z * this.direction.z
      }
      if (this.moveLeft || this.moveRight) {
        this.player.body.linearVelocity.x += cameraDirection.z * this.direction.x
        this.player.body.linearVelocity.z += -cameraDirection.x * this.direction.x
      }
      if (this.jump && this.canJump) {
        this.player.body.linearVelocity.y = config.jumpHeight
        this.canJump = false
        setTimeout(_ => this.canJump = true, 500)
      }
    }
  }

  onMouseMove = event => {
    if (!document.pointerLockElement) return

    let movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0
    let movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0

    this.eulerY.y -= movementX * 0.002
    this.eulerX.x -= movementY * 0.002
    this.eulerX.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.eulerX.x))

    this.camera.quaternion.setFromEuler(this.eulerX)
    this.player.body.resetQuaternion(this.quaternion.setFromEuler(this.eulerY))
  }

  createPlayerModel = () => {
    let boxGeometry = new THREE.BoxBufferGeometry(5, 10, 5)
    let boxMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, opacity: 1 })
    let mesh = new THREE.Mesh(boxGeometry, boxMaterial, config.mass)

    mesh.castShadow = true
    mesh.receiveShadow = true
    mesh.name = 'me'
    mesh.body = scene.world.add({ size: [5, 10, 5], pos: [0, 20, 50], move: true })

    this.camera.add(this.crosshair())
    this.camera.position.set(0, 7.5, 0)
    mesh.add(this.camera)
    this.scene.add(mesh)

    return mesh
  }

  crosshair = () => {
    let size = .001
    let geometry = new THREE.Geometry()
    let material = new THREE.LineBasicMaterial({ color: 'white' })
    geometry.vertices.push(
      new THREE.Vector3(0, size, -.1),
      new THREE.Vector3(size, 0, -.1),
      new THREE.Vector3(0, -size, -.1),
      new THREE.Vector3(-size, 0, -.1),
      new THREE.Vector3(0, size, -.1)
    )

    let crosshair = new THREE.Line(geometry, material)
    return crosshair
  }

  keydown = event => {
    switch (event.keyCode) {
      case 38: case 87: this.moveForward = true; break;  // W forward
      case 40: case 83: this.moveBackward = true; break; // S back
      case 37: case 65: this.moveLeft = true; break;     // A left
      case 39: case 68: this.moveRight = true; break;    // D right
      case 81: this.rotationLeft = true; break;          // Q rotation left
      case 69: this.rotationRight = true; break;         // E rotation right
      case 17: this.crouch = true; break;                // Ctrl crouch
      case 32: this.jump = true; break;                  // Space jump
    }
  }

  keyup = event => {
    switch (event.keyCode) {
      case 38: case 87: this.moveForward = false; break;  // forward
      case 40: case 83: this.moveBackward = false; break; // back
      case 37: case 65: this.moveLeft = false; break;     // left
      case 39: case 68: this.moveRight = false; break;    // right
      case 81: this.rotationLeft = false; break;          // rotation left
      case 69: this.rotationRight = false; break;         // rotation right
      case 17: this.crouch = false; break;                // crouch
      case 32: this.jump = false; break;                  // jump
    }
  }

  displayBlocker = () => {
    document.pointerLockElement ? document.exitPointerLock() : document.body.requestPointerLock()
  }

  pointerlockchange = () => {
    this.moveForward = this.moveBackward = this.moveLeft = this.moveRight = this.jump = false
    document.getElementById('blocker').style.display = document.pointerLockElement ? 'none' : 'flex'
  }

  connect = () => {
    document.addEventListener('mousemove', this.onMouseMove, false)
    document.addEventListener('keydown', this.keydown, false)
    document.addEventListener('keyup', this.keyup, false)
    document.addEventListener('pointerlockchange', this.pointerlockchange)
    document.getElementById('blocker').addEventListener('click', this.displayBlocker, false)
  }

  disconnect = () => {
    document.removeEventListener('mousemove', this.onMouseMove, false)
    document.removeEventListener('keydown', this.keydown, false)
    document.removeEventListener('keyup', this.keyup, false)
    document.removeEventListener('pointerlockchange', this.pointerlockchange)
    document.getElementById('blocker').removeEventListener('click', this.blocker, false)
  }
}
