# Three.js 实现3D开放世界小游戏《阿狸的多元宇宙》 🦊

![banner](./images/banner.gif)

> 声明：本文涉及图文和模型素材仅用于个人学习、研究和欣赏，请勿二次修改、非法传播、转载、出版、商用、及进行其他获利行为。

## 背景

> 2545光年之外的开普勒1028星系，有一颗色彩斑斓的宜居星球，星际移民必须穿戴基地发放的防辐射服才能生存。阿狸驾驶星际飞行器降临此地，快帮它在限定时间内使用轮盘移动找到基地获取防辐射服吧！

本文使用 `Three.js + React + CANNON` 技术栈，实现通过滑动屏幕控制模型在3D世界里运动的low poly低多边形风格小游戏。本文主要涉及到的知识点包括：。

## 效果

主线任务：限定时间内找到庇护所
支线任务：自由探索开放世界

## 设计

![progress](./images/progress.png)

![preview](./images/preview.png)

![star](./images/star.png)

![land](./images/land.png)

![fox](./images/fox.png)

![shelter](./images/shelter.png)

![loading](./images/loading.png)

![result](./images/result.png)


## 实现

### 加载资源

```js
import './index.styl';
import React from 'react';
import * as THREE from './libs/three.module';
import { GLTFLoader } from './libs/GLTFLoader';
import { img2matrix, randnum } from './scripts/Utils';
import CANNON from 'cannon';
import CannonHelper from './scripts/CannonHelper';
import JoyStick from './scripts/JoyStick';
import foxModel from './models/Fox.glb';
import Shelter from './models/Shelter.glb';
import heightMapImage from './images/Heightmap.png';
import snowflakeTexture from './images/snowflake.png';
```

### 页面结构

```js
render () {
  return (
    <div id="metaverse">
      <canvas className='webgl'></canvas>
      <div id='info'></div>
      <div className='tool'>
        <div className='countdown'>{this.state.countdown}</div>
        <button className='reset_button' onClick={this.resetGame}>时光倒流</button>
        <p className='hint'>站得越高看得越远</p>
      </div>
      {this.state.showLoading ? (<div className='loading'>
        <div className='box'>
          <p className='progress'>{this.state.loadingProcess} %</p>
          <p className='description'>游戏描述</p>
          <button className='start_button' style={{'visibility': this.state.loadingProcess === 100 ? 'visible' : 'hidden'}} onClick={this.startGame}>开始游戏</button>
        </div>
      </div>) : '' }
      {this.state.showResult ? (<div className='result'>
        <div className='box'>
          <p className='text'>{this.state.resultText}</p>
          <button className='button' onClick={this.resetGame}>再试一次</button>
          <button className='button' onClick={this.discover}>自由探索</button>
        </div>
      </div>) : '' }
    </div>
  )
}
```

### 数据初始化

```js
constructor(props) {
  super(props);
  this.scene = null;
  this.camera = null;
  this.player = null;
  this.target = null;
  this.playPosition = { x: 0, y: -.01, z: 0 };
  this.shelterPosition = { x: 93, y: -2, z: 25.5 };
}
state = {
  loadingProcess: 0,
  showLoading: true,
  showResult: false,
  resultText: '失败',
  countdown: 60,
  freeDiscover: false
}
```

### 场景初始化

```js
const canvas = document.querySelector('canvas.webgl');
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
  alpha: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMapSoft = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
const scene = new THREE.Scene();
this.scene = scene;
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, .01, 100000);
camera.position.set(1, 1, -1);
this.camera = camera;
camera.lookAt(scene.position);

const ambientLight = new THREE.AmbientLight(0xffffff, .4);
scene.add(ambientLight)

// 添加 front & back 光源
var light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(1, 1, 1).normalize();
scene.add(light);
```

### 创建世界

```js
const cannonHelper = new CannonHelper(scene);
const world = new CANNON.World();
world.broadphase = new CANNON.SAPBroadphase(world);
world.gravity.set(0, -10, 0);
world.defaultContactMaterial.friction = 0;
const groundMaterial = new CANNON.Material("groundMaterial");
const wheelMaterial = new CANNON.Material("wheelMaterial");
const wheelGroundContactMaterial = new CANNON.ContactMaterial(wheelMaterial, groundMaterial, {
  friction: 0,
  restitution: 0,
  contactEquationStiffness: 1000
});
world.addContactMaterial(wheelGroundContactMaterial);
```

### 创建星空

```js
// 星空粒子
const textureLoader = new THREE.TextureLoader();
const imageSrc = textureLoader.load(snowflakeTexture);
const shaderPoint = THREE.ShaderLib.points;
const uniforms = THREE.UniformsUtils.clone(shaderPoint.uniforms);
uniforms.map.value = imageSrc;
var sparkGeometry = new THREE.Geometry();
for (let i = 0; i < 1000; i++) {
  sparkGeometry.vertices.push(new THREE.Vector3());
}
const sparks = new THREE.Points(sparkGeometry, new THREE.PointsMaterial({
  size: 2,
  color: new THREE.Color(0xffffff),
  map: uniforms.map.value,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
  transparent: true,
  opacity: 0.75
}));
sparks.scale.set(1, 1, 1);
scene.add(sparks);
sparks.geometry.vertices.map(spark => {
  spark.y = randnum(30, 40);
  spark.x = randnum(-500, 500);
  spark.z = randnum(-500, 500);
  return true;
});
```

### 创建地形

```js
var sizeX = 128, sizeY = 128, minHeight = 0, maxHeight = 60, check = null;
Promise.all([
  img2matrix.fromUrl(heightMapImage, sizeX, sizeY, minHeight, maxHeight)(),
]).then(function (data) {
  var matrix = data[0];
  const terrainShape = new CANNON.Heightfield(matrix, { elementSize: 10 });
  const terrainBody = new CANNON.Body({ mass: 0 });
  terrainBody.addShape(terrainShape);
  terrainBody.position.set(-sizeX * terrainShape.elementSize / 2, -10, sizeY * terrainShape.elementSize / 2);
  terrainBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
  world.add(terrainBody);
  cannonHelper.addVisual(terrainBody, 'landscape');
  var raycastHelperGeometry = new THREE.CylinderGeometry(0, 1, 5, 1.5);
  raycastHelperGeometry.translate(0, 0, 0);
  raycastHelperGeometry.rotateX(Math.PI / 2);
  var raycastHelperMesh = new THREE.Mesh(raycastHelperGeometry, new THREE.MeshNormalMaterial());
  scene.add(raycastHelperMesh);
  check = () => {
    var raycaster = new THREE.Raycaster(target.position, new THREE.Vector3(0, -1, 0));
    var intersects = raycaster.intersectObject(terrainBody.threemesh.children[0]);
    if (intersects.length > 0) {
      raycastHelperMesh.position.set(0, 0, 0);
      raycastHelperMesh.lookAt(intersects[0].face.normal);
      raycastHelperMesh.position.copy(intersects[0].point);
    }
    // 将模型放置在地形上
    target.position.y = intersects && intersects[0] ? intersects[0].point.y + 0.1 : 30;
    // 标志基地
    var raycaster2 = new THREE.Raycaster(shelterLocation.position, new THREE.Vector3(0, -1, 0));
    var intersects2 = raycaster2.intersectObject(terrainBody.threemesh.children[0]);
    shelterLocation.position.y = intersects2 && intersects2[0] ? intersects2[0].point.y + .5 : 30;
    shelterLight.position.y = shelterLocation.position.y + 50;
    shelterLight.position.x = shelterLocation.position.x + 5
    shelterLight.position.z = shelterLocation.position.z;
  }
});
```

### 创建基地模型

```js
// 模型加载进度管理
const loadingManager = new THREE.LoadingManager();
loadingManager.onProgress = async(url, loaded, total) => {
  if (Math.floor(loaded / total * 100) === 100) {
    this.loadingProcessTimeout && clearTimeout(this.loadingProcessTimeout);
    this.loadingProcessTimeout = setTimeout(() => {
      this.setState({ loadingProcess: Math.floor(loaded / total * 100) });
    }, 800);
  } else {
    this.setState({ loadingProcess: Math.floor(loaded / total * 100) });
  }
};
// 基地
const shelterGeometry = new THREE.BoxBufferGeometry(0.15, 2, 0.15);
shelterGeometry.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 1, 0));
const shelterLocation = new THREE.Mesh(shelterGeometry, new THREE.MeshNormalMaterial({
  transparent: true,
  opacity: 0
}));
shelterLocation.position.set(this.shelterPosition.x, this.shelterPosition.y, this.shelterPosition.z);
shelterLocation.rotateY(Math.PI);
scene.add(shelterLocation);
// 基地模型
gltfLoader.load(Shelter, mesh => {
  mesh.scene.traverse(child => {
    child.castShadow = true;
  });
  mesh.scene.scale.set(5, 5, 5);
  mesh.scene.position.y = -.5;
  shelterLocation.add(mesh.scene)
});
// 基地点光源
var shelterPointLight = new THREE.PointLight(0x1089ff, 2);
shelterPointLight.position.set(0, 0, 0);
shelterLocation.add(shelterPointLight);
var shelterLight = new THREE.DirectionalLight(0xffffff, 0);
shelterLight.position.set(0, 0, 0);
shelterLight.castShadow = true;
shelterLight.target = shelterLocation;
scene.add(shelterLight);
```

### 添加目标

```js
var geometry = new THREE.BoxBufferGeometry(.5, 1, .5);
geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(0, .5, 0));
const target = new THREE.Mesh(geometry, new THREE.MeshNormalMaterial({
  transparent: true,
  opacity: 0
}));
scene.add(target);
var directionalLight = new THREE.DirectionalLight(new THREE.Color(0xffffff), .5);
directionalLight.position.set(0, 1, 0);
directionalLight.castShadow = true;
directionalLight.target = target;
target.add(directionalLight);
```

### 创建阿狸模型

```js
var mixers = [], clip1, clip2;
const gltfLoader = new GLTFLoader(loadingManager);
gltfLoader.load(foxModel, mesh => {
  mesh.scene.traverse(child => {
    if (child.isMesh) {
      child.castShadow = true;
      child.material.side = THREE.DoubleSide;
    }
  });
  var player = mesh.scene;
  player.position.set(this.playPosition.x, this.playPosition.y, this.playPosition.z);
  player.scale.set(.008, .008, .008);
  target.add(player);
  this.target = target;
  this.player = player;
  var mixer = new THREE.AnimationMixer(player);
  clip1 = mixer.clipAction(mesh.animations[0]);
  clip2 = mixer.clipAction(mesh.animations[1]);
  clip2.timeScale = 1.6;
  mixers.push(mixer);
});
```

### 控制阿狸运动

轮盘控制器

```js
var setup = { forward: 0, turn: 0 };
new JoyStick({ onMove: (forward, turn) => {
  setup.forward = forward;
  setup.turn = -turn;
}});
const updateDrive = (forward = setup.forward, turn = setup.turn) => {
  let maxSteerVal = 0.05;
  let maxForce = .15;
  let force = maxForce * forward;
  let steer = maxSteerVal * turn;
  if (forward !== 0) {
    target.translateZ(force);
    clip2 && clip2.play();
    clip1 && clip1.stop();
  } else {
    clip2 && clip2.stop();
    clip1 && clip1.play();
  }
  target.rotateY(steer);
  // 显示成功结果
  if ((target.position.x > 90 && target.position.x < 96) && (target.position.y > -2.5 && target.position.y < 2.5) && (target.position.z > 20 && target.position.z < 28)) {
    !this.state.freeDiscover && this.setState({
      resultText: '成功',
      showResult: true
    });
  }
}
// 第三人称视角
const followCamera = new THREE.Object3D();
followCamera.position.copy(camera.position);
scene.add(followCamera);
followCamera.parent = target;
const updateCamera = () => {
  if (followCamera) {
    camera.position.lerp(followCamera.getWorldPosition(new THREE.Vector3()), 0.1);
    camera.lookAt(target.position.x, target.position.y + .5, target.position.z);
  }
}
```

### 动画更新

```js
var clock = new THREE.Clock();
var lastTime;
var fixedTimeStep = 1.0 / 60.0;
const animate = () => {
  updateCamera();
  updateDrive();
  let delta = clock.getDelta();
  mixers.map(x => x.update(delta));
  let now = Date.now();
  lastTime === undefined && (lastTime = now);
  let dt = (Date.now() - lastTime) / 1000.0;
  lastTime = now;
  world.step(fixedTimeStep, dt);
  cannonHelper.updateBodies(world);
  check && check();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
};
```

### 页面缩放适配

```js
window.addEventListener('resize', () => {
  var width = window.innerWidth;
  var height = window.innerHeight;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}, false);
```

### 添加游戏逻辑

```js
resetGame = () => {
  this.player.position.set(this.playPosition.x, this.playPosition.y, this.playPosition.z);
  this.camera.position.set(1, 1, -1);
  this.target.position.set(0, 0, 0);
  this.target.rotation.set(0, 0, 0);
  this.startGame();
}
startGame = () => {
  this.setState({
    showLoading : false,
    showResult: false,
    countdown: 60,
    resultText: '失败',
    freeDiscover: false
  },() => {
    this.interval = setInterval(() => {
      if (this.state.countdown > 0) {
        let countdown = this.state.countdown;
        this.setState({
          countdown: --countdown
        });
      } else {
        clearInterval(this.interval)
        this.setState({
          showResult: true
        });
      }
    }, 1000);
  });
}
discover = () => {
  this.setState({
    freeDiscover: true,
    showResult: false,
    countdown: 60
  }, () => {
    clearInterval(this.interval);
  });
}
```

> 想了解场景初始化、光照、阴影、基础几何体、网格、材质及其他**Three.js**的相关知识，可阅读我往期文章。**转载请注明原文地址和作者**。如果觉得文章对你有帮助，不要忘了**一键三连哦 👍**。

## 附录

* [1]. [Three.js 火焰效果实现艾尔登法环动态logo](https://juejin.cn/post/7077726955528781832)
* [2]. [Three.js 实现神奇的3D文字悬浮效果](https://juejin.cn/post/7072899771819622413)
* [3]. [Three.js 实现让二维图片具有3D效果](https://juejin.cn/post/7067344398912061454)
* [4]. [Three.js 实现2022冬奥主题3D趣味页面，冰墩墩 🐼](https://juejin.cn/post/7060292943608807460)
* [5]. [Three.js 制作一个专属3D奖牌](https://juejin.cn/post/7055079293247815711)
* [6]. [Three.js 实现虎年春节3D创意页面](https://juejin.cn/post/7051745314914435102)
* [7]. [Three.js 实现脸书元宇宙3D动态Logo](https://juejin.cn/post/7031893833163997220)
* [8]. [Three.js 实现3D全景侦探小游戏](https://juejin.cn/post/7042298964468564005)
* [9]. [Three.js 实现炫酷的酸性风格3D页面](https://juejin.cn/post/7012996721693163528)
