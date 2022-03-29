export const img2matrix = {
  fromImage: (image, width, depth, minHeight, maxHeight) => {
    width = width | 0;
    depth = depth | 0;
    var i, j;
    var matrix = [];
    var canvas = document.createElement('canvas'),
      ctx = canvas.getContext('2d');
    var imgData, pixel, channels = 4;
    var heightRange = maxHeight - minHeight;
    var heightData;
    canvas.width = width;
    canvas.height = depth;
    ctx.drawImage(image, 0, 0, width, depth);
    imgData = ctx.getImageData(0, 0, width, depth).data;
    for (i = 0 | 0; i < depth; i = (i + 1) | 0) {
      matrix.push([]);
      for (j = 0 | 0; j < width; j = (j + 1) | 0) {
        pixel = i * depth + j;
        heightData = imgData[pixel * channels] / 255 * heightRange + minHeight;
        matrix[i].push(heightData);
      }
    }
    return matrix;
  },
  fromUrl: (url, width, depth, minHeight, maxHeight) => {
    return function () {
      return new Promise(function (onFulfilled, onRejected) {
        var image = new Image();
        image.crossOrigin = "anonymous";
        image.onload = function () {
          var matrix = img2matrix.fromImage(image, width, depth, minHeight, maxHeight);
          onFulfilled(matrix);
        };
        image.src = url;
      });
    }
  }
};

export const randnum = (min, max) => Math.round(Math.random() * (max - min) + min);
