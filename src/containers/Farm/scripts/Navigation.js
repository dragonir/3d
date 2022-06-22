import * as THREE from 'three'
import normalizeWheel from 'normalize-wheel'

import Experience from './Experience.js'

export default class Navigation {
  constructor() {
    this.experience = new Experience()
    this.debug = this.experience.debug
    this.time = this.experience.time
    this.sizes = this.experience.sizes
    this.targetElement = this.experience.targetElement
    this.camera = this.experience.camera

    this.center = new THREE.Vector3(0, 2, 0)

    this.setSpherical()
    this.setBoomTruck()
    this.setDrag()
    this.setMouse()
    this.setTouch()
    this.setWheel()
    this.setContextMenu()
  }

  setSpherical() {
    this.spherical = {}

    const radius = Math.max(1, this.sizes.height / this.sizes.width) * 16
    this.spherical.target = new THREE.Spherical(radius, Math.PI * 0.4, Math.PI * 0.25)
    this.spherical.value = this.spherical.target.clone()

    this.spherical.easing = 0.01

    this.spherical.speed = {}
    this.spherical.speed.radius = 0.01
    this.spherical.speed.phi = -2
    this.spherical.speed.theta = -2

    this.spherical.limits = {}
    this.spherical.limits.radius = {
      min: 9,
      max: 30
    }
    this.spherical.limits.phi = {
      min: 0.8,
      max: 1.35
    }
    this.spherical.limits.theta = {
      min: 0.35,
      max: 1.35
    }
  }

  setBoomTruck() {
    this.boomTruck = {}
    this.boomTruck.target = {
      x: 0,
      y: 0
    }
    this.boomTruck.value = {
      x: 0,
      y: 0
    }
    this.boomTruck.limits = {
      min: -0.2,
      max: 0.2
    }
    this.boomTruck.speed = 0.4
    this.boomTruck.easing = 0.01
  }

  setDrag() {
    this.drag = {}

    /**
     * Setup
     */
    this.drag.value = {
      x: 0,
      y: 0
    }
    this.drag.previous = {
      x: 0,
      y: 0
    }
    this.drag.delta = {
      x: 0,
      y: 0
    }

    this.drag.secondary = false

    /**
     * Methods
     */
    this.drag.start = (_x, _y) => {
      const normalizedX = _x / this.sizes.width
      const normalizedY = _y / this.sizes.height

      this.drag.value.x = normalizedX
      this.drag.value.y = normalizedY

      this.drag.previous.x = normalizedX
      this.drag.previous.y = normalizedY
    }

    this.drag.move = (_x, _y) => {
      const normalizedX = _x / this.sizes.width
      const normalizedY = _y / this.sizes.height

      this.drag.value.x = normalizedX
      this.drag.value.y = normalizedY

      this.drag.delta.x += this.drag.value.x - this.drag.previous.x
      this.drag.delta.y += this.drag.value.y - this.drag.previous.y

      this.drag.previous.x = normalizedX
      this.drag.previous.y = normalizedY
    }

    this.drag.end = () => {

    }
  }

  setMouse() {
    this.mouse = {}
    this.mouse.onMouseDown = (_event) => {
      // Prevent
      _event.preventDefault()

      // Button
      this.drag.secondary = _event.button === 1 || _event.button === 2 || _event.shiftKey || _event.ctrlKey

      // Start
      this.drag.start(_event.clientX, _event.clientY)

      // Cursor
      this.targetElement.style.cursor = 'grabbing'

      // Events
      this.targetElement.addEventListener('mousemove', this.mouse.onMouseMove)
      window.addEventListener('mouseup', this.mouse.onMouseUp)
    }

    this.mouse.onMouseMove = (_event) => {
      // Move
      this.drag.move(_event.clientX, _event.clientY)
    }

    this.mouse.onMouseUp = () => {
      // End
      this.drag.end()

      // Cursor
      this.targetElement.style.cursor = 'grab'

      // Events
      this.targetElement.removeEventListener('mousemove', this.mouse.onMouseMove)
      window.removeEventListener('mouseup', this.mouse.onMouseUp)
    }

    this.targetElement.addEventListener('mousedown', this.mouse.onMouseDown)
  }

  setTouch() {
    this.touch = {}

    this.touch.pinch = {}
    this.touch.pinch.value = 0
    this.touch.pinch.previous = 0
    this.touch.pinch.delta = 0
    this.touch.pinch.multiplier = -0.2

    this.touch.onTouchStart = (_event) => {
      // Prevent
      _event.preventDefault()

      // Button
      this.drag.secondary = _event.touches.length > 1

      // Start
      let x = 0
      let y = 0

      for (const _touch of _event.touches) {
        x += _touch.clientX
        y += _touch.clientY
      }

      x /= _event.touches.length
      y /= _event.touches.length

      this.drag.start(x, y)

      // Pinch
      if (_event.touches.length > 1) {
        const distance = Math.hypot(_event.touches[0].clientX - _event.touches[1].clientX, _event.touches[0].clientY - _event.touches[1].clientY)

        this.touch.pinch.value = distance
        this.touch.pinch.previous = this.touch.pinch.value
      }

      // Events
      this.targetElement.addEventListener('touchmove', this.touch.onTouchMove)
      window.addEventListener('touchend', this.touch.onTouchEnd)
    }

    this.touch.onTouchMove = (_event) => {
      // Move
      let x = 0
      let y = 0

      for (const _touch of _event.touches) {
        x += _touch.clientX
        y += _touch.clientY
      }

      x /= _event.touches.length
      y /= _event.touches.length

      this.drag.move(x, y)

      if (_event.touches.length > 1) {
        this.touch.pinch.value = Math.hypot(_event.touches[0].clientX - _event.touches[1].clientX, _event.touches[0].clientY - _event.touches[1].clientY)
        this.touch.pinch.delta += this.touch.pinch.value - this.touch.pinch.previous
        this.touch.pinch.previous = this.touch.pinch.value
      }
    }

    this.touch.onTouchEnd = () => {
      // End
      this.drag.end()

      // Events
      this.targetElement.removeEventListener('touchmove', this.touch.onTouchMove)
      window.removeEventListener('touchend', this.touch.onTouchEnd)
    }

    this.targetElement.addEventListener('touchstart', this.touch.onTouchStart)
  }

  setWheel() {
    this.wheel = {}

    this.wheel.delta = 0

    this.wheel.onWheel = (_event) => {
      const normalized = normalizeWheel(_event)

      this.wheel.delta += normalized.pixelY
    }

    document.addEventListener('mousewheel', this.wheel.onWheel)
  }

  setContextMenu() {
    this.contextMenu = {}
    this.contextMenu.onContextMenu = (_event) => {
      _event.preventDefault()
    }

    window.addEventListener('contextmenu', this.contextMenu.onContextMenu)
  }

  update() {
    /**
     * Spherical
     */
    // Radius
    this.spherical.target.radius += this.wheel.delta * this.spherical.speed.radius
    this.spherical.target.radius += this.touch.pinch.delta * this.spherical.value.radius * this.touch.pinch.multiplier * this.spherical.speed.radius
    this.spherical.target.radius = Math.max(this.spherical.limits.radius.min, Math.min(this.spherical.limits.radius.max, this.spherical.target.radius))

    if (!this.drag.secondary) {
      // Theta and phi
      this.spherical.target.phi += this.drag.delta.y * this.spherical.speed.phi
      this.spherical.target.theta += this.drag.delta.x * this.spherical.speed.theta

      this.spherical.target.phi = Math.max(this.spherical.limits.phi.min, Math.min(this.spherical.limits.phi.max, this.spherical.target.phi))
      this.spherical.target.theta = Math.max(this.spherical.limits.theta.min, Math.min(this.spherical.limits.theta.max, this.spherical.target.theta))
    }

    // Easing
    this.spherical.value.radius += (this.spherical.target.radius - this.spherical.value.radius) * this.spherical.easing * this.time.delta
    this.spherical.value.phi += (this.spherical.target.phi - this.spherical.value.phi) * this.spherical.easing * this.time.delta
    this.spherical.value.theta += (this.spherical.target.theta - this.spherical.value.theta) * this.spherical.easing * this.time.delta

    /**
     * Boom truck
     */
    if (this.drag.secondary) {
      this.boomTruck.target.x += this.drag.delta.x * this.boomTruck.speed
      this.boomTruck.target.y += this.drag.delta.y * this.boomTruck.speed

      this.boomTruck.target.x = Math.max(this.boomTruck.limits.min, Math.min(this.boomTruck.limits.max, this.boomTruck.target.x))
      this.boomTruck.target.y = Math.max(this.boomTruck.limits.min, Math.min(this.boomTruck.limits.max, this.boomTruck.target.y))
    }

    this.boomTruck.value.x += (this.boomTruck.target.x - this.boomTruck.value.x) * this.boomTruck.easing * this.time.delta
    this.boomTruck.value.y += (this.boomTruck.target.y - this.boomTruck.value.y) * this.boomTruck.easing * this.time.delta

    /**
     * Drag
     */
    this.drag.delta.x = 0
    this.drag.delta.y = 0

    /**
     * Touch
     */
    this.touch.pinch.delta = 0

    /**
     * Wheel
     */
    this.wheel.delta = 0

    /**
     * Camera
     */
    // Apply spherical
    const cameraPosition = new THREE.Vector3()
    cameraPosition.setFromSpherical(this.spherical.value)
    this.camera.modes.default.instance.position.copy(cameraPosition)

    // Apply center offset
    this.camera.modes.default.instance.position.add(this.center)

    // Look at center
    this.camera.modes.default.instance.lookAt(this.center)

    // Apply boom truck
    this.camera.modes.default.instance.translateX(-this.boomTruck.value.x * this.spherical.value.radius)
    this.camera.modes.default.instance.translateY(this.boomTruck.value.y * this.spherical.value.radius)
  }
}