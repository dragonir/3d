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
    this.y = obj.range[0] * canvas.height + (obj.range[1] - obj.range[0]) * canvas.height * Math.random() + 36;
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

export const barrageList = [{
  value: "使用的是静态死数据",
  color: "blue",
  range: [0, 0.5]
},
{
  value: "安可！安可！安可！安可！安可！",
  color: "blue",
  range: [0, 0.6]
},
{
  value: "可以控制区域和垂直分布范围",
  color: "blue",
  range: [0, 0.5]
},
{
  value: "字体大小和速度在方法内设置",
  color: "black",
  range: [0.1, 1]
},
{
  value: "适合用在一些静态页面上",
  color: "black",
  range: [0.2, 1]
},
{
  value: "❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤❤",
  color: "red",
  range: [0.2, 0.9]
},
{
  value: "卡哇伊 ❤ 卡哇伊 ❤ 卡哇伊 ❤ 卡哇伊 ❤ 卡哇伊 ❤ 卡哇伊 ❤ 卡哇伊 ❤ 卡哇伊 ❤",
  color: "black",
  range: [0.2, 1]
},
{
  value: "可以设置边框颜色",
  color: "black",
  range: [0.2, 1]
},
{
  value: "这也太好看了吧，绝绝子！",
  color: "black",
  range: [0.2, 0.9]
},
{
  value: "HongKong HongKong HongKong HongKong HongKong",
  color: "black",
  range: [0.2, 1]
},
{
  value: "初音未来，miku miku miku miku miku miku miku",
  color: "black",
  range: [0.6, 0.7]
},
{
  value: "初音未来，老婆！初音未来，老婆！初音未来，老婆！初音未来，老婆！",
  color: "red",
  range: [0.2, 1]
},
{
  value: "可以回到原文",
  color: "black",
  range: [0, 0.9]
},
{
  value: "⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡",
  color: "yellow",
  range: [0.7, 1]
},
{
  value: "下面就是占位弹幕了",
  color: "black",
  range: [0.7, 0.95]
},
{
  value: "前方高能预警！！！",
  color: "orange",
  range: [0.5, 0.8]
},
{
  value: "前方高能预警！！！",
  color: "green",
  range: [0.5, 0.9]
},
{
  value: "前方高能预警！！！",
  color: "orange",
  range: [0, 1]
},
{
  value: "前方高能预警！！！",
  color: "yellow",
  range: [0, 1]
}
];