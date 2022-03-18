# Three.js 火焰效果实现艾尔登法环动态logo 🔥

![banner](./images/banner.gif)

## 背景

的时刻NHK

## 效果

![mobile](./images/mobile.png)

**在线预览**：

* `👀` 地址1：<https://3d-dragonir.vercel.app/#/ring>
* `👀` 地址2：<https://dragonir.github.io/3d/#/ring>

## 实现

在threejs中有一个为我们提供了可以实现火焰和烟雾效果的包，我们可以直接引用这个包，通过设置某些参数实现需要的效果。（已经从新版中移除）

```txt
常用方法：

clearSources()
清除资源
addSource(u, v, radius, density, windX, windY);
添加资源
setSourceMap(texture)
设置贴图


可选属性参数：

var params={
    //基本火焰参数设置
    color1:'#ffffff',//内焰
    color2:'#ffa000',//外焰
    color3:'#000000',//烟雾
    colorBias:0.8,//颜色偏差
    burnRate:0.35,//燃烧率
    diffuse:1.33,//扩散
    viscosity:0.25,//粘度
    expansion:-0.25,//膨胀
    swirl:50.0,//旋转
    drag:0.35,//拖拽
    airSpeed:12.0,//空气速度
    windX:0.0,//风向X
    windY:0.75,//风向Y
    speed:500.0,//火焰速度
    massConservation:false,//质量守恒
    }

```

![fire](./images/fire.png)

```js
import './index.styl';
import React from 'react';
import * as THREE from './libs/three.module.js';
import { Fire } from './libs/Fire.js';
import { TWEEN } from "three/examples/jsm/libs/tween.module.min.js";
import Animations from '../../assets/utils/animations';
import ringTexture from './images/ring.png';

export default class Ring extends React.Component {
  componentDidMount() {
    this.initThree()
  }

  initThree = () => {
    const container = document.getElementById('container');
    const renderer = new THREE.WebGLRenderer({ antialias: true,  alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);
    renderer.setClearAlpha(0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 100);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }, false);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    const ring = new Fire(new THREE.PlaneBufferGeometry(20, 25), {
      textureWidth: 800,
      textureHeight: 1000,
      debug: false,
    });
    ring.setSourceMap(new THREE.TextureLoader().load(ringTexture));
    ring.color1 = new THREE.Color(0xffffff);
    ring.color2 = new THREE.Color(0xf59e00);
    ring.color3 = new THREE.Color(0x08120a);
    ring.colorBias = .6;
    // 燃烧效果
    ring.burnRate = 10;
    // 模糊效果ring
    ring.diffuse = 1;
    ring.viscosity = .5;
    ring.expansion = -1.6;
    ring.swirl = 10;
    ring.drag = 0.4;
    ring.airSpeed = 18;
    ring.windX = 0.1;
    ring.windY = 0.2;
    ring.speed = 100;
    ring.massConservation = false;
    ring.position.y = 4;
    ring.position.z = -6;
    scene.add(ring)

    const controls = new OrbitControls(camera, renderer.domElement);
    Animations.animateCamera(camera, controls, { x: 0, y: 0, z: 22 }, { x: 0, y: 0, z: 0 }, 2400, () => {
      controls.enabled = false;
    });

    let step = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
      stats && stats.update();
      TWEEN && TWEEN.update();
      step += .03;
      ring && (ring.position.y = Math.abs(2.2 + Math.sin(step)))
    }
    animate();
  }

  render () {
    return (
      <div className='ring_page' id="container"></div>
    )
  }
}
```

![texture](./images/texture.png)

> `🔗` 完整代码：<https://github.com/dragonir/3d/tree/master/src/containers/Ring>

## 总结

本文知识点主要包含的的新知识：

> 想了解场景初始化、光照、阴影、基础几何体、网格、材质及其他**Three.js**的相关知识，可阅读我往期文章。**转载请注明原文地址和作者**。如果觉得文章对你有帮助，不要忘了**一键三连哦 👍**。

## 附录

* [1]. [Three.js 实现神奇的3D文字悬浮效果](https://juejin.cn/post/7072899771819622413)
* [2]. [Three.js 实现让二维图片具有3D效果](https://juejin.cn/post/7067344398912061454)
* [3]. [Three.js 实现2022冬奥主题3D趣味页面，冰墩墩 🐼](https://juejin.cn/post/7060292943608807460)
* [4]. [Three.js 制作一个专属3D奖牌](https://juejin.cn/post/7055079293247815711)
* [5]. [Three.js 实现虎年春节3D创意页面](https://juejin.cn/post/7051745314914435102)
* [6]. [Three.js 实现脸书元宇宙3D动态Logo](https://juejin.cn/post/7031893833163997220)
* [7]. [Three.js 实现3D全景侦探小游戏](https://juejin.cn/post/7042298964468564005)
* [8]. [Three.js 实现炫酷的酸性风格3D页面](https://juejin.cn/post/7012996721693163528)