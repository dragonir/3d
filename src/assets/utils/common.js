import * as THREE from "three";

// 创建文字
export const makeTextSprite = (text, color, parameters) => {
  if (parameters === undefined) parameters = {};
  var fontface = parameters.hasOwnProperty("fontface") ? parameters["fontface"] : "Arial";
  var fontsize = parameters.hasOwnProperty("fontsize") ? parameters["fontsize"] : 32;
  var borderThickness = parameters.hasOwnProperty("borderThickness") ? parameters["borderThickness"] : 4;
  var borderColor = parameters.hasOwnProperty("borderColor") ? parameters["borderColor"] : { r: 0, g: 0, b: 0, a: 1.0 };
  var canvas = document.createElement('canvas');
  var context = canvas.getContext('2d');
  context.font = fontsize + "px " + fontface;
  var metrics = context.measureText(text);
  var textWidth = metrics.width;
  context.strokeStyle = "rgba(" + borderColor.r + "," + borderColor.g + "," + borderColor.b + "," + borderColor.a + ")";
  context.lineWidth = borderThickness;
  context.fillStyle = color ? color : "#ffffff";
  context.fillText(text, borderThickness, fontsize + borderThickness);
  context.font = 48 + "px " + fontface;
  context.width = textWidth;
  var texture = new THREE.Texture(canvas);
  texture.needsUpdate = true;
  var spriteMaterial = new THREE.SpriteMaterial({ map: texture });
  var sprite = new THREE.Sprite(spriteMaterial);
  return sprite;
}

// 创建圆形文字
export const makeCycleTextSprite = (text, color = 'black', borderColor = 'white',  textColor = 'white', W = 100, H = 100, borderWidth = 6) => {
  var canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  var ctx = canvas.getContext('2d');
  ctx.beginPath();
  ctx.arc((W + borderWidth) / 2, (H + borderWidth) / 2, 40, 0, Math.PI * 2, true);
  ctx.closePath();
  // 填充背景颜色
  ctx.fillStyle = color;
  ctx.fill();
  // 填充边框颜色
  ctx.lineWidth = borderWidth;
  ctx.lineCap = 'round';
  ctx.strokeStyle = borderColor;
  ctx.stroke();
  // 填充文字颜色
  ctx.font = "64px Arial";
  ctx.fillStyle = textColor;
  ctx.textAlign = "center";
  var metrics = ctx.measureText(text);
  ctx.fillText(text, (W + borderWidth) / 2, (H + borderWidth * 2) / 2 + metrics.fontBoundingBoxDescent + metrics.actualBoundingBoxDescent * 4);
  var texture = new THREE.Texture(canvas);
  texture.needsUpdate = true;
  var spriteMaterial = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    opacity: .8,
  });
  var sprite = new THREE.Sprite(spriteMaterial);
  return sprite;
}