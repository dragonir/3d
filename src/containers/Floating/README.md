# 使用Three.js内置方法实现惊艳的浮动文字效果

## 背景

在 Three.js Journey 课程示例中，提供了一个仅通过Three.js内置方法实现的浮动文字效果的[示例](https://www.ilithya.rocks/)，于是本文参照示例，实现类似的效果。本文使用React+Three.js技术栈，本文中涉及到的知识点主要包括：

## 效果

![banner](./images/banner.gif)
![mobile](./images/mobile.png)
![preview_1](./images/preview_1.gif)
![preview_3](./images/preview_3.gif)

示例效果：

本文实现效果：

> `👀` 在线预览：<https://dragonir.github.io/3d/#/floating>

已适配移动端

## 实现

### 资源引入

```js
import './index.styl';
import React from 'react';
import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass.js';
```

### DOM结构

```html
<div className='floating_page' style={{ backgroundColor: this.state.backgroundColor }}>
  <div id="canvas"></div>
  <input className='color_pick' type="color" onChange={this.handleInputChange} value={this.state.backgroundColor} />
  <button className='pass_button' onClick={this.handleRenderChange}>特效<span className='highlight'>{this.state.renderGlithPass ? '开' : '关'}</span></button>
  <div className='meta'>
    <a className="github" href='https://github.com/dragonir/3d' target="_blank" rel="noreferrer">
      <svg height="32" aria-hidden="true" viewBox="0 0 16 16" version="1.1" width="32" data-view-component="true">
        <path fill='#ffffff' fillRule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
      </svg>
    </a>
    <p className='text'>dragonir</p>
    <p className='text'>website: <a href='https://tricell.fun' target="_blank" rel="noreferrer">tricell.fun</a></p>
    <p className='text'>juejin: <a href='https://juejin.cn/user/2295436008498765' target="_blank" rel="noreferrer">@dragonir</a></p>
    <p className='text'>cnblog: <a href='https://www.cnblogs.com/dragonir/' target="_blank" rel="noreferrer">@dragonir</a></p>
    <p className='text'>segmentFault: <a href='https://segmentfault.com/u/dragonir' target="_blank" rel="noreferrer">@dragonir</a></p>
  </div>
</div>
```

```js
  state = {
    backgroundColor: '#164CCA',
    // ios safari，因此手机端默认关闭后期特效、pc端默认开启
    renderGlithPass: !(window.navigator.userAgent.toLowerCase().indexOf('mobile') > 0)
  }
```

### 场景初始化

```js
    var canvas, stats, camera, scene, renderer, glitchPass, composer, mouseX = 0, mouseY = 0, _this = this;
    const group = new THREE.Group(), textMesh = new THREE.Mesh(), nearDist = 0.1, farDist = 10000;
```

```js
canvas = document.getElementById('canvas');
renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearAlpha(0);
canvas.appendChild(renderer.domElement);

scene = new THREE.Scene();
scene.fog = new THREE.Fog(0xeeeeee, 0, 100);
camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, nearDist, farDist);
camera.position.set(-2 * farDist, 0, 780);
```

### 创建文字模型

```js
// 字体
const loader = new FontLoader();
loader.load('./fonts/helvetiker_regular.typeface.json', font => {
  textMesh.geometry = new TextGeometry('@dragonir\nfantastic\nthree.js\nart work', {
    font: font,
    size: 100,
    height: 40,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 30,
    bevelSize: 8,
    bevelOffset: 1,
    bevelSegments: 12
  });
  textMesh.material = material;
  textMesh.position.x = 120 * -2;
  textMesh.position.z = 120 * -1;
  scene.add(textMesh);
});
```

![font](./images/font.png)

### 创建几何体模型

```js
function generateRandomMesh(geometry, material, count){
for (let i = 0; i < count; i++) {
  let mesh = new THREE.Mesh(geometry, material);
  let dist = farDist / 3;
  let distDouble = dist * 2;
  let tau = 2 * Math.PI;
  mesh.position.x = Math.random() * distDouble - dist;
  mesh.position.y = Math.random() * distDouble - dist;
  mesh.position.z = Math.random() * distDouble - dist;
  mesh.rotation.x = Math.random() * tau;
  mesh.rotation.y = Math.random() * tau;
  mesh.rotation.z = Math.random() * tau;
  // 手动控制何时重新计算 3D 变换以获得更好的性能
  mesh.matrixAutoUpdate = false;
  mesh.updateMatrix();
  group.add(mesh);
}
}
```

![geomentry](./images/geometry.png)

```js
// BufferAttribute 允许更有效地将数据传递到 GPU
const octahedronGeometry = new THREE.OctahedronBufferGeometry(80);
const material = new THREE.MeshNormalMaterial();
generateRandomMesh(octahedronGeometry, material, 100);
const torusGeometry = new THREE.TorusBufferGeometry(40, 25, 16, 40);
generateRandomMesh(torusGeometry, material, 200);
const coneGeometry = new THREE.ConeBufferGeometry(40, 80, 80);
generateRandomMesh(coneGeometry, material, 100);
scene.add(group);
```

### 背景颜色切换

```js
handleInputChange = e => {
  this.setState({
    backgroundColor: e.target.value
  })
}
```

![preview_2](./images/preview_2.png)

### 后期渲染开关

```js
  handleRenderChange = () => {
    this.setState({
      renderGlithPass: !this.state.renderGlithPass
    })
  }
```

### 后期渲染

```js
// 后期
composer = new EffectComposer(renderer);
composer.addPass( new RenderPass(scene, camera));
glitchPass = new GlitchPass();
composer.addPass(glitchPass);
```

### 动画效果

```js
function animate() {
  requestAnimationFrame(animate);
  camera.position.x += (mouseX - camera.position.x) * 0.05;
  camera.position.y += (mouseY * -1 - camera.position.y) * 0.05;
  // 旋转世界空间中的每一个网格
  camera.lookAt(scene.position);
  const t = Date.now() * 0.001;
  const rx = Math.sin(t * 0.7) * 0.5;
  const ry = Math.sin(t * 0.3) * 0.5;
  const rz = Math.sin(t * 0.2) * 0.5;
  group.rotation.x = rx;
  group.rotation.y = ry;
  group.rotation.z = rz;
  textMesh.rotation.x = rx;
  textMesh.rotation.y = ry;
  textMesh.rotation.z = rx;
  renderer.render(scene, camera);
  _this.state.renderGlithPass && composer.render();
  stats && stats.update();
}
```

### 缩放适配

```js
// 页面缩放
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize( window.innerWidth, window.innerHeight );
}, false);
```

### 双击全屏

```js
// 双击全屏
window.addEventListener('dblclick', () => {
  const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement;
  if (!fullscreenElement) {
    if (canvas.requestFullscreen) {
      canvas.requestFullscreen();
    } else if (canvas.webkitRequestFullscreen) {
      canvas.webkitRequestFullscreen();
    }
    console.log('go fullscrenn')
    scene.background = new THREE.Color(_this.state.backgroundColor)
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
    console.log('leave fullscrenn')
    scene.background = '';
    composer.render();
  }
})
```

### 鼠标事件监听

```js
const mouseFX = {
  windowHalfX: window.innerWidth / 2,
  windowHalfY: window.innerHeight / 2,
  coordinates: (coordX, coordY) => {
    mouseX = (coordX - mouseFX.windowHalfX) * 5;
    mouseY = (coordY - mouseFX.windowHalfY) * 5;
  },
  onMouseMove: e => { mouseFX.coordinates(e.clientX, e.clientY) },
  onTouchMove: e => { mouseFX.coordinates(e.changedTouches[0].clientX, e.changedTouches[0].clientY)}
};
document.addEventListener('mousemove', mouseFX.onMouseMove, false);
document.addEventListener('touchmove', mouseFX.onTouchMove, false);
```

### 网格背景

```css
background: #164CCA;
background-image: linear-gradient(rgba(3, 192, 60, .3) 1px, transparent 1px), linear-gradient(90deg, rgba(3, 192, 60, .3) 1px, transparent 1px);
background-size: 1em 1em;
```

.1 认识后期处理
后期处理，其实就是原有的页面效果不能满足审美需求，通过一些技术手段以达到预期的效果，实现的过程就是后期处理。
在three.js中实现后期处理，需要经过以下几步

创建效果组合器
效果组合器是各种处理通道的入口，three.js提供了一个 EffectComposer 对象，使用它来创建一个效果组合器，从某种程度上说这个效果组合器是各种通道的容器，创建时需要一个渲染器的实例

添加通道
在后期处理过程中 renderPass 通道 必须要有，这个通道在指定的场景和相机的基础上渲染出一个新的场景，这里需要通过RenderPass对象创建一个通道实例，然后将它添加到效果组合器中；three.js 中提供了很多后期处理的通道，你可以直接来使用它们，只需要创建对应的通道，配置一些参数，将它们添加到效果组合器就可以了，这里特别说一下，three.js还提供了一个 ShaderPass 通道，它支持使用自定义的Shader创建高级的后期处理通道

更新通道
在render循环中，调用效果组合器的render函数，效果组合器会依次使用添加的处理通道来处理场景将最终的结果输出

### GlitchPass通道介绍
GlitchPass通道产生模拟电磁风暴效果，它只有一个参数配置

goWild 该属性接收一个布尔值，指定是否持续产生电磁风暴效果


### OctahedronBufferGeometry

八面缓冲几何体（OctahedronGeometry）
发布于 2021-07-10 字数 1198 浏览 1079 评论 0
一个用于创建八面体的类。

// iOS iframe auto-resize workaround
if ( /(iPad|iPhone|iPod)/g.test( navigator.userAgent ) ) {
const scene = document.getElementById( ‘scene’ );
scene.style.width = getComputedStyle( scene ).width;
scene.style.height = getComputedStyle( scene ).height;
scene.setAttribute( ‘scrolling’, ‘no’ );
}

构造器
OctahedronGeometry(radius : Float, detail : Integer)
radius — 八面体的半径，默认值为1。
detail — 默认值为0，将这个值设为一个大于0的数将会为它增加一些顶点，使其不再是一个八面体。

属性
共有属性请参见其基类PolyhedronGeometry。

.parameters : Object
一个包含着构造函数中每个参数的对象。在对象实例化之后，对该属性的任何修改都不会改变这个几何体。

方法(Methods)
共有方法请参见其基类PolyhedronGeometry。

### TorusBufferGeometry

### ConeBufferGeometry

> `🔗` 完整代码：<https://github.com/dragonir/3d/tree/master/src/containers/Floating>

## 总结

本文知识点主要包含的的新知识：

> 想了解场景初始化、光照、阴影、基础几何体、网格、材质及其他 `Three.js` 的相关知识，可阅读我往期文章。**转载请注明原文地址和作者**。如果觉得文章对你有帮助，不要忘了**一键三连哦 👍**。

## 附录

* [1]. [拜托，使用Three.js让二维图片具有3D效果超酷的好吗 💥](https://juejin.cn/post/7067344398912061454)
* [2]. [Three.js 实现2022冬奥主题3D趣味页面 🐼](https://juejin.cn/post/7060292943608807460)
* [3]. [1000粉！使用Three.js制作一个专属3D奖牌 🥇](https://juejin.cn/post/7055079293247815711)
* [4]. [Three.js 实现虎年春节3D创意页面](https://juejin.cn/post/7051745314914435102)
* [5]. [Three.js 实现脸书元宇宙3D动态Logo](https://juejin.cn/post/7031893833163997220)
* [6]. [Three.js 实现3D全景侦探小游戏](https://juejin.cn/post/7042298964468564005)
* [7]. [Three.js实现炫酷的酸性风格3D页面](https://juejin.cn/post/7012996721693163528)
* [8]. [3dx模型转换为blender支持格式](https://anyconv.com/tw/max-zhuan-obj/)
* [9]. [www.ilithya.rocks](https://www.ilithya.rocks/)
