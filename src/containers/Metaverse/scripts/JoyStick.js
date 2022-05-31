export default class JoyStick {
  constructor(props) {
    const circle = document.createElement('div');
    circle.style.cssText = `
      position: absolute;
      bottom: 16px;
      width: 100px;
      height: 100px;
      background: rgba(120, 120, 120, 0.3);
      border-radius: 50%;
      left: 50%;
      transform: translateX(-50%);
      box-sizing: border-box;
      filter: drop-shadow(0px 1px 1px rgba(0, 0, 0, .25));
      z-index: 11
    `;
    const thumb = document.createElement('div');
    thumb.style.cssText = `
      position: absolute;
      left: 20px;
      top: 20px;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: rgba(255, 255, 255, .6);
      box-shadow: 0px 1px 2px rgba(200, 200, 200, .25);
    `;
    circle.appendChild(thumb);
    document.getElementById('metaverse').appendChild(circle);
    this.domElement = thumb;
    this.maxRadius = props.maxRadius || 40;
    this.maxRadiusSquared = this.maxRadius * this.maxRadius;
    this.onMove = props.onMove;
    this.game = props.game;
    this.origin = {
      left: this.domElement.offsetLeft,
      top: this.domElement.offsetTop
    };
    this.rotationDamping = props.rotationDamping || 0.06;
    this.moveDamping = props.moveDamping || 0.01;
    if (this.domElement !== undefined) {
      const joystick = this;
      if ('ontouchstart' in window) {
        this.domElement.addEventListener('touchstart', function (event) {
          joystick.tap(event);
        });
      } else {
        this.domElement.addEventListener('mousedown', function (event) {
          joystick.tap(event);
        });
      }
    }
  }

  getMousePosition(event) {
    let clientX = event.targetTouches ? event.targetTouches[0].pageX : event.clientX;
    let clientY = event.targetTouches ? event.targetTouches[0].pageY : event.clientY;
    return {
      x: clientX,
      y: clientY
    };
  }

  tap(event) {
    event = event || window.event;
    //获取鼠标开始位置
    this.offset = this.getMousePosition(event);
    const joystick = this;
    if ('ontouchstart' in window) {
      document.ontouchmove = function (event) {
        joystick.move(event);
      };
      document.ontouchend = function (event) {
        joystick.up(event);
      };
    } else {
      document.onmousemove = function (event) {
        joystick.move(event);
      };
      document.onmouseup = function (event) {
        joystick.up(event);
      };
    }
  }

  move(event) {
    event = event || window.event;
    const mouse = this.getMousePosition(event);
    // 计算新的鼠标位置
    let left = mouse.x - this.offset.x;
    let top = mouse.y - this.offset.y;
    const sqMag = left * left + top * top;
    if (sqMag > this.maxRadiusSquared) {
      const magnitude = Math.sqrt(sqMag);
      left /= magnitude;
      top /= magnitude;
      left *= this.maxRadius;
      top *= this.maxRadius;
    }
    // 设置元素新的位置
    this.domElement.style.top = `${top + this.domElement.clientHeight/2}px`;
    this.domElement.style.left = `${left + this.domElement.clientWidth/2}px`;
    const forward = -(top - this.origin.top + this.domElement.clientHeight / 2) / this.maxRadius;
    const turn = (left - this.origin.left + this.domElement.clientWidth / 2) / this.maxRadius;
    if (this.onMove !== undefined) this.onMove.call(this.game, forward, turn);
  }

  up() {
    if ('ontouchstart' in window) {
      document.ontouchmove = null;
      document.touchend = null;
    } else {
      document.onmousemove = null;
      document.onmouseup = null;
    }
    this.domElement.style.top = `${this.origin.top}px`;
    this.domElement.style.left = `${this.origin.left}px`;
    this.onMove.call(this.game, 0, 0);
  }
}