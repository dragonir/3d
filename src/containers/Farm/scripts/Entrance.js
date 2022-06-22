import * as THREE from 'three'
import gsap from 'gsap'
import Experience from './Experience.js'

export default class Entrance {
  constructor(_options) {
    // Options
    this.experience = new Experience()
    this.debug = this.experience.debug
    this.resources = this.experience.resources
    this.scene = this.experience.scene

    // Debug
    if (this.debug) {
      this.debugFolder = this.debug.addFolder({
        title: 'entrance'
      })
    }

    this.setModel()
    this.setStrokes()
  }

  setModel() {
    this.model = {}
    this.model.color = '#ffffff'

    this.model.resource = this.resources.items.entranceModel

    this.model.mesh = this.model.resource.scene.children[0]
    this.model.mesh.material.transparent = true
    this.model.mesh.material.emissive.set(this.model.color)
    this.scene.add(this.model.resource.scene)

    // Debug
    if (this.debug) {
      this.debugFolder
        .addInput(
          this.model,
          'color', {
            view: 'color'
          }
        )
        .on('change', () => {
          this.model.mesh.material.emissive.set(this.model.color)
        })
    }
  }

  setStrokes() {
    // Setup
    this.strokes = {}
    this.strokes.count = 10
    this.strokes.length = 1.5
    this.strokes.items = []

    this.strokes.texture = this.resources.items.entranceStrokeTexture

    // Geometry
    this.strokes.geometry = new THREE.PlaneGeometry(this.strokes.length, 0.075, 1, 1)
    this.strokes.geometry.rotateX(-Math.PI * 0.25)
    this.strokes.geometry.rotateY(Math.PI * 0.5)

    // Material
    this.strokes.material = new THREE.MeshBasicMaterial({
      transparent: true,
      depthWrite: false,
      alphaMap: this.strokes.texture
    })

    // Mesh
    this.strokes.mesh = new THREE.InstancedMesh(
      this.strokes.geometry,
      this.strokes.material,
      this.strokes.count
    )
    this.strokes.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
    this.scene.add(this.strokes.mesh)

    // Items
    for (let i = 0; i < this.strokes.count; i++) {
      const item = {}

      // Setup
      item.index = i
      item.position = new THREE.Vector3(0, 0, 3)
      item.quaternion = new THREE.Quaternion()
      item.scale = new THREE.Vector3(1, 1, 1)
      item.matrix = new THREE.Matrix4()
      item.matrix.compose(item.position, item.quaternion, item.scale)

      this.strokes.mesh.setMatrixAt(i, item.matrix)

      // Reset
      item.reset = () => {
        item.position.z = 3.2
        item.position.y = Math.random() * 1
        item.position.x = (Math.random() - 0.5) * 1

        item.scale.z = 0

        const duration = 2
        const delay = Math.random() * duration * 2

        gsap.to(
          item.position, {
            delay: delay,
            duration: duration,
            ease: 'power2.in',
            z: 1.337 - this.strokes.length * 0.5
          }
        )

        gsap.to(
          item.scale, {
            delay: delay,
            duration: duration,
            ease: 'power4.in',
            z: 1,
            onComplete: item.reset
          }
        )
      }

      item.reset()

      // Save
      this.strokes.items.push(item)
    }
  }

  update() {
    for (const _item of this.strokes.items) {
      _item.matrix.compose(_item.position, _item.quaternion, _item.scale)
      this.strokes.mesh.setMatrixAt(_item.index, _item.matrix)
    }

    this.strokes.mesh.instanceMatrix.needsUpdate = true
  }
}