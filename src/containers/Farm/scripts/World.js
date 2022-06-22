import Experience from './Experience.js'
import Floor from './Floor.js'
import Entrance from './Entrance.js'
import MatcapsModel from './MatcapsModel.js'
import WindStrokes from './WindStrokes.js'

export default class World {
  constructor(_options) {
    this.experience = new Experience()
    this.config = this.experience.config
    this.scene = this.experience.scene
    this.resources = this.experience.resources

    this.resources.on('groupEnd', (_group) => {
      if (_group.name === 'base') {
        this.setFloor()
        this.setEntrance()
        this.setMatcapsModel()
        this.setWindStrokes()
      }
    })
  }

  setFloor() {
    this.floor = new Floor()
  }

  setEntrance() {
    this.entrance = new Entrance()
  }

  setMatcapsModel() {
    this.matcapsModel = new MatcapsModel()
  }

  setWindStrokes() {
    this.windStrokes = new WindStrokes()
  }

  resize() {}

  update() {
    if (this.entrance)
      this.entrance.update()

    if (this.matcapsModel)
      this.matcapsModel.update()
  }

  destroy() {}
}