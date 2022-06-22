import * as THREE from 'three'
import gsap from 'gsap'
import { mergeUniforms } from 'three/src/renderers/shaders/UniformsUtils.js'
import Experience from './Experience.js'
import matcapVertex from './shaders/matcap/vertex.glsl'
import matcapFragment from './shaders/matcap/fragment.glsl'

export default class MatcapsModel {
  constructor(_options) {
    // Options
    this.experience = new Experience()
    this.debug = this.experience.debug
    this.scene = this.experience.scene
    this.resources = this.experience.resources
    this.time = this.experience.time

    this.floorColor = '#5c6607'
    this.pointColor = '#ff3fa4'
    this.objects = {}
    this.objects.flags = []

    // Debug
    if (this.debug) {
      this.debugFolder = this.debug.addFolder({
        title: 'matcapsModel'
      })

      this.debugFolder
        .addInput(
          this,
          'floorColor', {
            view: 'color'
          }
        )
        .on('change', () => {
          this.uniforms.uFloorColor.value.set(this.floorColor)
        })

      this.debugFolder
        .addInput(
          this,
          'pointColor', {
            view: 'color'
          }
        )
        .on('change', () => {
          this.uniforms.uPointColor.value.set(this.pointColor)
        })
    }

    this.setUniforms()
    this.setModel()
    this.setTelescope()
  }

  setUniforms() {
    this.uniforms = {}

    this.uniforms.uFloorColor = {
      value: new THREE.Color(this.floorColor)
    }
    this.uniforms.uFloorOrientationOffset = {
      value: 1
    }
    this.uniforms.uFloorOrientationMultiplier = {
      value: 0.62
    }
    this.uniforms.uFloorDistanceLimit = {
      value: 3.8
    }

    this.uniforms.uPointColor = {
      value: new THREE.Color(this.pointColor)
    }
    this.uniforms.uPointOrientationOffset = {
      value: -0.11
    }
    this.uniforms.uPointOrientationMultiplier = {
      value: 1.08
    }
    this.uniforms.uPointDistanceLimit = {
      value: 4.25
    }
    this.uniforms.uPointPosition = {
      value: new THREE.Vector3(0.78, 0.39, 1.337)
    }

    // Debug
    if (this.debug) {
      this.debugFolder
        .addInput(
          this.uniforms.uFloorOrientationOffset,
          'value', {
            label: 'uFloorOrientationOffset',
            min: -1,
            max: 1
          }
        )

      this.debugFolder
        .addInput(
          this.uniforms.uFloorOrientationMultiplier,
          'value', {
            label: 'uFloorOrientationMultiplier',
            min: 0,
            max: 3
          }
        )

      this.debugFolder
        .addInput(
          this.uniforms.uFloorDistanceLimit,
          'value', {
            label: 'uFloorDistanceLimit',
            min: 0,
            max: 10
          }
        )

      this.debugFolder
        .addInput(
          this.uniforms.uPointOrientationOffset,
          'value', {
            label: 'uPointOrientationOffset',
            min: -1,
            max: 1
          }
        )

      this.debugFolder
        .addInput(
          this.uniforms.uPointOrientationMultiplier,
          'value', {
            label: 'uPointOrientationMultiplier',
            min: 0,
            max: 3
          }
        )

      this.debugFolder
        .addInput(
          this.uniforms.uPointDistanceLimit,
          'value', {
            label: 'uPointDistanceLimit',
            min: 0,
            max: 10
          }
        )

      this.debugFolder
        .addInput(
          this.uniforms.uPointPosition.value,
          'x', {
            label: 'uPointPositionX',
            min: -3,
            max: 3
          }
        )

      this.debugFolder
        .addInput(
          this.uniforms.uPointPosition.value,
          'y', {
            label: 'uPointPositionY',
            min: -3,
            max: 3
          }
        )

      this.debugFolder
        .addInput(
          this.uniforms.uPointPosition.value,
          'z', {
            label: 'uPointPositionZ',
            min: -3,
            max: 3
          }
        )
    }
  }

  setModel() {
    this.model = {}
    this.model.resource = this.resources.items.model

    // Traverse the scene and save materials
    this.model.materials = {}

    this.model.resource.scene.traverse((_child) => {
      if (_child instanceof THREE.Mesh && _child.material instanceof THREE.MeshStandardMaterial) {
        // Material
        let materialName = _child.material.name
        const useWind = _child.name.match(/^flag/)

        if (useWind)
          materialName += 'flag'

        let material = this.model.materials[materialName]

        if (!material) {
          material = {}
          material.original = _child.material
          material.meshes = []
          material.useWind = useWind

          this.model.materials[materialName] = material
        }

        material.meshes.push(_child)
      }

      // Save object
      if (_child.name.match(/^telescopeY/))
        this.objects.telescopeY = _child

      if (_child.name.match(/^telescopeX/))
        this.objects.telescopeX = _child

      if (_child.name.match(/^gear0/))
        this.objects.gear0 = _child

      if (_child.name.match(/^gear1/))
        this.objects.gear1 = _child
    })

    // Create new materials
    for (const _materialKey in this.model.materials) {
      const material = this.model.materials[_materialKey]

      const matcapTexture = this.resources.items[`${material.original.name}MatcapTexture`]
      matcapTexture.encoding = THREE.sRGBEncoding

      // material.new = new THREE.MeshMatcapMaterial({ matcap: matcapTexture })

      const defines = {
        MATCAP: '',
        USE_MATCAP: ''
      }

      if (material.useWind)
        defines.USE_WIND = ''

      material.new = new THREE.ShaderMaterial({
        uniforms: mergeUniforms([
          THREE.UniformsLib.common,
          THREE.UniformsLib.bumpmap,
          THREE.UniformsLib.normalmap,
          THREE.UniformsLib.displacementmap,
          THREE.UniformsLib.fog,
          THREE.UniformsLib.lights,
          {
            uTime: {
              value: null
            },
            matcap: {
              value: null
            }
          }
        ]),
        defines,
        vertexShader: matcapVertex,
        fragmentShader: matcapFragment
      })
      material.new.matcap = matcapTexture
      material.new.uniforms.matcap.value = matcapTexture

      material.new.uniforms.uFloorColor = this.uniforms.uFloorColor
      material.new.uniforms.uFloorOrientationOffset = this.uniforms.uFloorOrientationOffset
      material.new.uniforms.uFloorOrientationMultiplier = this.uniforms.uFloorOrientationMultiplier
      material.new.uniforms.uFloorDistanceLimit = this.uniforms.uFloorDistanceLimit

      material.new.uniforms.uPointColor = this.uniforms.uPointColor
      material.new.uniforms.uPointOrientationOffset = this.uniforms.uPointOrientationOffset
      material.new.uniforms.uPointOrientationMultiplier = this.uniforms.uPointOrientationMultiplier
      material.new.uniforms.uPointDistanceLimit = this.uniforms.uPointDistanceLimit
      material.new.uniforms.uPointPosition = this.uniforms.uPointPosition

      for (const _mesh of material.meshes) {
        _mesh.material = material.new
      }
    }

    this.scene.add(this.model.resource.scene)
  }

  setTelescope() {
    this.telescope = {}

    this.telescope.rotateY = () => {
      gsap.to(
        this.objects.telescopeY.rotation, {
          duration: 0.5 + Math.random() * 2,
          delay: Math.random() * 2,
          ease: 'power2.inOut',
          y: (Math.random() - 0.5) * 1.5,
          onComplete: this.telescope.rotateY
        }
      )
    }

    this.telescope.rotateX = () => {
      gsap.to(
        this.objects.telescopeX.rotation, {
          duration: 0.5 + Math.random() * 2,
          delay: Math.random() * 2,
          ease: 'power2.inOut',
          x: -Math.random(),
          onComplete: this.telescope.rotateX
        }
      )
    }

    this.telescope.rotateY()
    this.telescope.rotateX()
  }

  update() {
    for (const _materialKey in this.model.materials) {
      const material = this.model.materials[_materialKey]
      material.new.uniforms.uTime.value = this.time.elapsed
    }
    this.objects.gear0.rotation.y = -0.1 + this.objects.telescopeY.rotation.y * (11 / 6)
    this.objects.gear1.rotation.y = 0.4 + this.objects.telescopeY.rotation.y * (11 / 6)
  }
}