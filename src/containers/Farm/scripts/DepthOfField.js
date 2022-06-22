import * as THREE from 'three'
import Experience from './Experience.js'

export default class DepthOfField {
  constructor() {
    // Options
    this.experience = new Experience()
    this.scene = this.experience.scene
    this.camera = this.experience.camera
    this.renderer = this.experience.renderer
    this.time = this.experience.time
    this.raycaster = new THREE.Raycaster()
    this.focus = {}
    this.focus.value = 0
    this.focus.target = this.focus.value
    this.focus.easing = 0.005
  }

  update() {
    // Raycast
    this.raycaster.setFromCamera(new THREE.Vector2(0, 0), this.camera.instance)
    const intersects = this.raycaster.intersectObjects(this.scene.children, true)
    if (intersects.length) {
      const intersect = intersects[0]
      this.focus.target = intersect.distance
    }
    // Ease focus
    this.focus.value += (this.focus.target - this.focus.value) * this.time.delta * this.focus.easing
    this.renderer.postProcess.bokehPass.materialBokeh.uniforms.focus.value = this.focus.value
  }
}