import * as THREE from 'three'
import gsap from 'gsap'

import Experience from './Experience.js'
import windStrokeVertex from './shaders/windStroke/vertex.glsl'
import windStrokeFragment from './shaders/windStroke/fragment.glsl'

export default class WindStrokes {
  constructor(_options) {
    // Options
    this.experience = new Experience()
    this.resources = this.experience.resources
    this.debug = this.experience.debug
    this.scene = this.experience.scene

    this.resource1 = this.resources.items.windStroke1Model
    this.resource2 = this.resources.items.windStroke2Model

    // Debug
    if (this.debug) {
      this.debugFolder = this.debug.addFolder({
        title: 'windStrokes'
      })

      this.debugFolder
        .addButton({
          title: 'pop()'
        })
        .on('click', () => {
          this.pop()
        })
    }

    this.setMaterial()

    const autoPop = () => {
      if (Math.random() < 0.3) {
        this.pop()
      }

      gsap.delayedCall(0.5, autoPop)
    }

    autoPop()
  }

  setMaterial() {
    this.material = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: {
        uProgress: {
          value: 0
        }
      },
      vertexShader: windStrokeVertex,
      fragmentShader: windStrokeFragment
    })

    if (this.debug) {
      this.debugFolder
        .addInput(
          this.material.uniforms.uProgress,
          'value', {
            min: 0,
            max: 1
          }
        )


      const mesh = this.resource1.scene.children[0].clone(false)
      mesh.material = this.material

      mesh.position.x = 0
      mesh.position.y = 2
      mesh.position.z = 4

      this.scene.add(mesh)
    }
  }

  pop() {
    const resource = Math.random() < 0.5 ? this.resource1 : this.resource2

    const mesh = resource.scene.children[0].clone(false)
    mesh.material = this.material.clone()

    mesh.position.x = (3 + Math.random() * 7) * (Math.random() < 0.5 ? 1 : -1)
    mesh.position.y = Math.random() * 3
    mesh.position.z = (2.2 + Math.random() * 5) * (Math.random() < 0.5 ? 1 : -1)

    gsap.to(
      mesh.material.uniforms.uProgress, {
        ease: 'power2.inOut',
        duration: 10,
        value: 1
      }
    )

    gsap.to(
      mesh.position, {
        duration: 10,
        ease: 'power2.inOut',
        x: mesh.position.x + 1.5,
        onComplete: () => {
          mesh.geometry.dispose()
          mesh.material.dispose()
          this.scene.remove(mesh)
        }
      }
    )

    this.scene.add(mesh)
  }
}