import * as THREE from 'three'
import Experience from './Experience.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { BokehPass } from 'three/examples/jsm/postprocessing/BokehPass.js'

export default class Renderer {
  constructor(_options = {}) {
    this.experience = new Experience()
    this.config = this.experience.config
    this.debug = this.experience.debug
    this.stats = this.experience.stats
    this.time = this.experience.time
    this.sizes = this.experience.sizes
    this.scene = this.experience.scene
    this.camera = this.experience.camera

    // Debug
    if (this.debug) {
      this.debugFolder = this.debug.addFolder({
        title: 'renderer'
      })
    }

    this.usePostprocess = true

    this.setInstance()
    this.setPostProcess()
  }

  setInstance() {
    this.clearColor = '#010101'

    // Renderer
    this.instance = new THREE.WebGLRenderer({
      alpha: false,
      antialias: true
    })

    this.instance.sortObjects = false

    this.instance.domElement.style.position = 'absolute'
    this.instance.domElement.style.top = 0
    this.instance.domElement.style.left = 0
    this.instance.domElement.style.width = '100%'
    this.instance.domElement.style.height = '100%'

    // this.instance.setClearColor(0x414141, 1)
    this.instance.setClearColor(this.clearColor, 1)
    this.instance.setSize(this.config.width, this.config.height)
    this.instance.setPixelRatio(this.config.pixelRatio)

    // this.instance.physicallyCorrectLights = true
    this.instance.outputEncoding = THREE.sRGBEncoding
    // this.instance.shadowMap.type = THREE.PCFSoftShadowMap
    // this.instance.shadowMap.enabled = true
    // this.instance.toneMapping = THREE.ReinhardToneMapping
    // this.instance.toneMapping = THREE.ReinhardToneMapping
    // this.instance.toneMappingExposure = 1.3

    this.context = this.instance.getContext()

    // Add stats panel
    if (this.stats) {
      this.stats.setRenderPanel(this.context)
    }
  }

  setPostProcess() {
    this.postProcess = {}

    /**
     * Render pass
     */
    this.postProcess.renderPass = new RenderPass(this.scene, this.camera.instance)

    /**
     * Render pass
     */
    this.postProcess.bokehPass = new BokehPass(
      this.scene,
      this.camera.instance, {
        focus: 21.50,
        aperture: 0.001,
        maxblur: 0.005,
      }
    )

    // Debug
    if (this.debug) {
      this.debugFolder
        .addInput(
          this.postProcess.bokehPass.materialBokeh.uniforms.focus,
          'value', {
            label: 'focus',
            min: 0,
            max: 50
          }
        )

      this.debugFolder
        .addInput(
          this.postProcess.bokehPass.materialBokeh.uniforms.aperture,
          'value', {
            label: 'aperture',
            min: 0,
            max: 0.01
          }
        )

      this.debugFolder
        .addInput(
          this.postProcess.bokehPass.materialBokeh.uniforms.maxblur,
          'value', {
            label: 'maxblur',
            min: 0,
            max: 0.1
          }
        )
    }

    /**
     * Effect composer
     */
    const RenderTargetClass = this.config.pixelRatio >= 2 ? THREE.WebGLRenderTarget : THREE.WebGLMultisampleRenderTarget
    // const RenderTargetClass = THREE.WebGLRenderTarget
    this.renderTarget = new RenderTargetClass(
      this.config.width,
      this.config.height, {
        generateMipmaps: false,
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBFormat,
        encoding: THREE.sRGBEncoding
      }
    )
    this.postProcess.composer = new EffectComposer(this.instance, this.renderTarget)

    this.postProcess.composer.addPass(this.postProcess.renderPass)
    this.postProcess.composer.addPass(this.postProcess.bokehPass)

    this.postProcess.composer.setSize(this.config.width, this.config.height)
    this.postProcess.composer.setPixelRatio(this.config.pixelRatio)
  }

  resize() {
    // Instance
    this.instance.setSize(this.config.width, this.config.height)
    this.instance.setPixelRatio(this.config.pixelRatio)

    // Post process
    this.postProcess.composer.setSize(this.config.width, this.config.height)
    this.postProcess.composer.setPixelRatio(this.config.pixelRatio)
  }

  update() {
    if (this.stats) {
      this.stats.beforeRender()
    }

    if (this.usePostprocess) {
      this.postProcess.composer.render()
    } else {
      this.instance.render(this.scene, this.camera.instance)
    }

    if (this.stats) {
      this.stats.afterRender()
    }
  }

  destroy() {
    this.instance.renderLists.dispose()
    this.instance.dispose()
    this.renderTarget.dispose()
    this.postProcess.composer.renderTarget1.dispose()
    this.postProcess.composer.renderTarget2.dispose()
  }
}