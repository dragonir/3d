// 弹幕方法
export const Barrage = function (canvas, data) {
  if (!canvas || !data || !data.length) {
    return;
  }
  if (typeof canvas == "string") {
    canvas = document.querySelector(canvas);
    Barrage(canvas, data);
    return;
  }
  var context = canvas.getContext("2d");
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
  // 存储实例
  var store = {};
  // 字号大小
  var fontSize = 28;
  // 实例方法
  var _Barrage = function (obj, index) {
    // 随机x坐标也就是横坐标，对于y纵坐标，以及变化量moveX
    this.x = (1 + index * 0.1 / Math.random()) * canvas.width;
    this.y =
      obj.range[0] * canvas.height +
      (obj.range[1] - obj.range[0]) * canvas.height * Math.random() +
      36;
    if (this.y < fontSize) {
      this.y = fontSize;
    } else if (this.y > canvas.height - fontSize) {
      this.y = canvas.height - fontSize;
    }
    this.moveX = 1 + Math.random() * 3;
    this.opacity = 0.8 + 0.2 * Math.random();
    this.params = obj;
    this.draw = function () {
      var params = this.params;
      // 根据此时x位置绘制文本
      context.strokeStyle = params.color;
      context.font = "bold " + fontSize + 'px "microsoft yahei", sans-serif';
      context.fillStyle = "rgba(255,255,255," + this.opacity + ")";
      context.fillText(params.value, this.x, this.y);
      context.strokeText(params.value, this.x, this.y);
    };
  };
  data.forEach(function (obj, index) {
    store[index] = new _Barrage(obj, index);
  });
  // 绘制弹幕文本
  var draw = function () {
    for (var index in store) {
      var barrage = store[index];
      // 位置变化
      barrage.x -= barrage.moveX;
      if (barrage.x < -1 * canvas.width * 1.5) {
        // 移动到画布外部时候从左侧开始继续位移
        barrage.x = (1 + index * 0.1 / Math.random()) * canvas.width;
        barrage.y =
          (barrage.params.range[0] +
            (barrage.params.range[1] - barrage.params.range[0]) *
            Math.random()) *
          canvas.height;
        if (barrage.y < fontSize) {
          barrage.y = fontSize;
        } else if (barrage.y > canvas.height - fontSize) {
          barrage.y = canvas.height - fontSize;
        }
        barrage.moveX = 1 + Math.random() * 3;
      }
      // 根据新位置绘制圆圈圈
      store[index].draw();
    }
  };
  // 画布渲染
  var render = function () {
    // 清除画布
    context.clearRect(0, 0, canvas.width, canvas.height);
    // 绘制画布上所有的圆圈圈
    draw();
    // 继续渲染
    requestAnimationFrame(render);
  };
  render();
};