# Three.js实现3D冬奥主题会创意页面

![banner](./images/banner.gif)


<!--  -->

## 背景

迎冬奥，一起向未来！**2022冬奥会**马上就要开始了，本文使用 `Three.js + React` 技术栈，用3D实现冬日元素和奥运元素，并将它们和谐地添加到页面上，制作充满趣味和纪念意义的冬奥主题3D页面。本文涉及到的知识点主要包括：

## 效果

实现效果如以下动图所示，页面主要由 `2022冬奥会` 吉祥物 `冰墩墩` 、奥运五环、舞动的旗帜 `🚩`、树木 `🌲` 以及下雪效果 `❄️` 等组成。按住鼠标左键移动可以改为相机位置，预览到模型的不同视图。

![move](./images/move.gif)

> `👀` 在线预览：<https://dragonir.github.io/3d/#/olympic>

## 实现

### 引入资源

首先引入开发页面所需要的库和外部资源，`OrbitControls` 用于镜头轨道控制、`TWEEN` 用于补间动画实现、`GLTFLoader` 用于加载 `glb` 或 `gltf` 格式的 `3D` 模型、以及一些其他模型、贴图等资源。

```js
import React from 'react';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { TWEEN } from "three/examples/jsm/libs/tween.module.min.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import bingdundunModel from './models/bingdundun.glb';
// ...
```

### 页面DOM结构

页面 `DOM` 结构非常简单，只有渲染 `3D` 元素的 `#container` 容器和显示加载进度的 `.olympic_loading`元素。

```js
render () {
  return (
    <div>
      <div id="container"></div>
      {this.state.loadingProcess === 100 ? '' : (
        <div className="olympic_loading">
          <div className="box">{this.state.loadingProcess} %</div>
        </div>
      )
    }
    </div>
  )
}
```

### 场景初始化

初始化渲染容器、场景、相机。关于这部分内容的详细知识点，可以查阅我往期的文章，本文中不再赘述。

```js
container = document.getElementById('container');
renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
container.appendChild(renderer.domElement);
scene = new THREE.Scene();
scene.background = new THREE.TextureLoader().load(skyTexture);
camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 30, 100);
camera.lookAt(new THREE.Vector3(0, 0, 0));
```

```js
      const cubeGeometry = new THREE.BoxGeometry(0.001, 0.001, 0.001);
      const cubeMaterial = new THREE.MeshLambertMaterial({ color: 0xdc161a });
      const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
      cube.position.set(0, 0, 0);
      light = new THREE.DirectionalLight(0xffffff, 1);
      light.intensity = 1;
      light.position.set(16, 16, 8);
      light.castShadow = true;
      light.target = cube;
      light.shadow.mapSize.width = 512 * 12;
      light.shadow.mapSize.height = 512 * 12;
      light.shadow.camera.top = 40;
      light.shadow.camera.bottom = -40;
      light.shadow.camera.left = -40;
      light.shadow.camera.right = 40;
      scene.add(light);

      // const lightHelper = new THREE.DirectionalLightHelper(light, 1, 'red');
      // scene.add(lightHelper);
      // const lightCameraHelper = new THREE.CameraHelper(light.shadow.camera);
      // scene.add(lightCameraHelper);

      var ambientLight = new THREE.AmbientLight(0xcfffff);
      ambientLight.intensity = 1;
      scene.add(ambientLight);

      const manager = new THREE.LoadingManager();
      manager.onStart = (url, loaded, total) => {};
      manager.onLoad = () => { console.log('Loading complete!')};
      manager.onProgress = async(url, loaded, total) => {
        if (Math.floor(loaded / total * 100) === 100) {
          _this.loadingProcessTimeout && clearTimeout(_this.loadingProcessTimeout);
          _this.loadingProcessTimeout = setTimeout(() => {
            _this.setState({ loadingProcess: Math.floor(loaded / total * 100) });
            Animations.animateCamera(camera, controls, { x: 0, y: -1, z: 20 }, { x: 0, y: 0, z: 0 }, 3600, () => {});
          }, 800);
        } else {
          _this.setState({ loadingProcess: Math.floor(loaded / total * 100) });
        }
      };

      // 添加地面
      var loader = new THREE.GLTFLoader(manager);
      loader.load(landModel, function (mesh) {
        mesh.scene.traverse(function (child) {
          if (child.isMesh) {
            meshes.push(child)
            child.material.metalness = .1;
            child.material.roughness = .8;
            // 地面
            if (child.name === 'Mesh_2') {
              child.material.metalness = .5;
              child.receiveShadow = true;
            }
            // 围巾
            if (child.name === 'Mesh_17') {
              child.material.metalness = .2;
              child.material.roughness = .8;
            }
            // 帽子
            if (child.name === 'Mesh_17') {}
          }
        });
        mesh.scene.rotation.y = Math.PI / 4;
        mesh.scene.position.set(15, -20, 0);
        mesh.scene.scale.set(.9, .9, .9);
        land = mesh.scene;
        scene.add(land);
      });

      // 旗帜
      loader.load(flagModel, mesh => {
        mesh.scene.traverse(child => {
          if (child.isMesh) {
            meshes.push(child)
            child.castShadow = true;
            // 旗帜
            if (child.name === 'mesh_0001') {
              child.material.metalness = .1;
              child.material.roughness = .1;
              child.material.map = new THREE.TextureLoader().load(flagTexture);
            }
            // 旗杆
            if (child.name === '柱体') {
              child.material.metalness = .6;
              child.material.roughness = 0;
              child.material.refractionRatio = 1;
              child.material.color = new THREE.Color(0xeeeeee);
            }
          }
        });
        mesh.scene.rotation.y = Math.PI / 24;
        mesh.scene.position.set(2, -7, -1);
        mesh.scene.scale.set(4, 4, 4);
        // 动画
        let meshAnimation = mesh.animations[0];
        mixer = new THREE.AnimationMixer(mesh.scene);
        let animationClip = meshAnimation;
        let clipAction = mixer.clipAction(animationClip).play();
        animationClip = clipAction.getClip();
        scene.add(mesh.scene);
      });

      // bingdundun
      loader.load(bingdundunModel, function (mesh) {
        mesh.scene.traverse(function (child) {
          if (child.isMesh) {
            meshes.push(child)
            if (child.name === 'oldtiger001') {
              child.material.metalness = .5
              child.material.roughness = .8
            }
            if (child.name === 'oldtiger002') {
              child.material.transparent = true;
              child.material.opacity = .5
              child.material.metalness = .2
              child.material.roughness = 0
              child.material.refractionRatio = 1
              child.castShadow = true;
            }
          }
        });
        mesh.scene.rotation.y = Math.PI / 24;
        mesh.scene.position.set(-8, -12, 0);
        mesh.scene.scale.set(24, 24, 24);
        scene.add(mesh.scene);
      });

      // 添加树
      let treeMaterial = new THREE.MeshPhysicalMaterial({
        map: new THREE.TextureLoader().load(treeTexture),
        transparent: true,
        side: THREE.DoubleSide,
        metalness: .2,
        roughness: .8,
        depthTest: true,
        depthWrite: false,
        skinning: false,
        fog: false,
        reflectivity: 0.1,
        refractionRatio: 0,
      });
      let treeCustomDepthMaterial = new THREE.MeshDepthMaterial({
        depthPacking: THREE.RGBADepthPacking,
        map: new THREE.TextureLoader().load(treeTexture),
        alphaTest: 0.5
      });
      loader.load(treeModel, function (mesh) {
        mesh.scene.traverse(function (child) {
          if (child.isMesh) {
            meshes.push(child)
            child.material = treeMaterial;
            child.custromMaterial = treeCustomDepthMaterial;
          }
        });
        mesh.scene.position.set(14, -9, 0);
        mesh.scene.scale.set(16, 16, 16);
        scene.add(mesh.scene);
        let tree2 = mesh.scene.clone();
        tree2.position.set(10, -8, -15);
        tree2.scale.set(18, 18, 18);
        scene.add(tree2)
        let tree3 = mesh.scene.clone();
        tree3.position.set(-18, -8, -16);
        tree3.scale.set(22, 22, 22);
        scene.add(tree3)
      });

      // 创建五环
      const fiveCycles = [
        { key: 'cycle_0', color: 0x0885c2, position: { x: -250, y: 0, z: 0 }},
        { key: 'cycle_1', color: 0x000000, position: { x: -10, y: 0, z: 5 }},
        { key: 'cycle_2', color: 0xed334e, position: { x: 230, y: 0, z: 0 }},
        { key: 'cycle_3', color: 0xfbb132, position: { x: -125, y: -100, z: -5 }},
        { key: 'cycle_4', color: 0x1c8b3c, position: { x: 115, y: -100, z: 10 }}
      ];
      fiveCycles.map(item => {
        let cycleMesh = new THREE.Mesh(new THREE.TorusGeometry(100, 10, 10, 50), new THREE.MeshLambertMaterial({
          color: new THREE.Color(item.color),
          side: THREE.DoubleSide
        }));
        cycleMesh.castShadow = true;
        cycleMesh.position.set(item.position.x, item.position.y, item.position.z);
        meshes.push(cycleMesh);
        fiveCyclesGroup.add(cycleMesh);
      });
      fiveCyclesGroup.scale.set(.036, .036, .036);
      fiveCyclesGroup.position.set(0, 10, -8);
      scene.add(fiveCyclesGroup);

      // 创建雪花
      let texture = new THREE.TextureLoader().load(snowTexture);
      let geometry = new THREE.Geometry();
      let pointsMaterial = new THREE.PointsMaterial({
        size: 1,
        transparent: true,
        opacity: 0.8,
        map: texture,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true,
        depthTest: false
      });
      let range = 100;
      let vertices = []
      for (let i = 0; i < 1500; i++) {
        let vertice = new THREE.Vector3(Math.random() * range - range / 2, Math.random() * range * 1.5, Math.random() * range - range / 2);
        // 纵向移动速度
        vertice.velocityY = 0.1 + Math.random() / 3;
        // 横向移动速度
        vertice.velocityX = (Math.random() - 0.5) / 3;
        // 将顶点加入几何
        geometry.vertices.push(vertice);
      }
      geometry.center();
      points = new THREE.Points(geometry, pointsMaterial);
      points.position.y = -30;
      scene.add(points);

      controls = new OrbitControls(camera, renderer.domElement);
      controls.target.set(0, 0, 0);
      controls.enableDamping = true;
      controls.enablePan = false;
      controls.enableZoom = false;
      // 垂直旋转角度限制
      controls.minPolarAngle = 1.4;
      controls.maxPolarAngle = 1.8;
      // 水平旋转角度限制
      controls.minAzimuthAngle = -.6;
      controls.maxAzimuthAngle = .6;
      window.addEventListener('resize', onWindowResize, false);
    }

    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function animate() {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
      stats && stats.update();
      controls && controls.update();
      TWEEN && TWEEN.update();
      fiveCyclesGroup && (fiveCyclesGroup.rotation.y += .01);
      let vertices = points.geometry.vertices;
      vertices.forEach(function (v) {
        v.y = v.y - (v.velocityY);
        v.x = v.x - (v.velocityX);
        if (v.y <= 0) v.y = 60;
        if (v.x <= -20 || v.x >= 20) v.velocityX = v.velocityX * -1;
      });
      // 顶点变动之后需要更新，否则无法实现雨滴特效
      points.geometry.verticesNeedUpdate = true;
      let time = clock.getDelta();
      mixer && mixer.update(time);
    }

    // 增加点击事件，声明raycaster和mouse变量
    var raycaster = new THREE.Raycaster();
    var mouse = new THREE.Vector2();
    function onMouseClick(event) {
      // 通过鼠标点击的位置计算出raycaster所需要的点的位置，以屏幕中心为原点，值的范围为-1到1.
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
      // 通过鼠标点的位置和当前相机的矩阵计算出raycaster
      raycaster.setFromCamera(mouse, camera);
      // 获取raycaster直线和所有模型相交的数组集合
      var intersects = raycaster.intersectObjects(meshes);
      if (intersects.length > 0) {
        console.log(intersects[0].object)
      }
    }
    window.addEventListener('click', onMouseClick, false);
  }
```

### 加载进度管理

## 总结

本文中主要包含的知识点包括：

进一步优化的空间

* 添加更多的交互功能；
* 吉祥物冰墩墩添加骨骼动画，并可以通过鼠标和键盘控制其移动和交互；
* 界面样式进一步优化。

## 附录

* [1]. [1000粉！使用Three.js制作一个专属3D奖牌🥇](https://juejin.cn/post/7055079293247815711)
* [2]. [Three.js 实现虎年春节3D创意页面](https://juejin.cn/post/7051745314914435102)
* [3]. [Three.js 实现脸书元宇宙3D动态Logo](https://juejin.cn/post/7031893833163997220)
* [4]. [Three.js 实现3D全景侦探小游戏](https://juejin.cn/post/7042298964468564005)
* [5]. [Three.js实现炫酷的酸性风格3D页面](https://juejin.cn/post/7012996721693163528)

**下期预告**：

* 《Metahuman元人类！记一次Three.js人像优化》
* 《y2k！3D千年虫风格，y2k的事你少管》
* 《喜羊羊你可真厉害，沸羊羊我讨厌你》


冰墩墩模型来源 https://www.justeasy.cn/3dmodel/OGxVUFg4Zy9UWnJYZkoxQXBwSndJZz09.html

3dx

模型转换
https://anyconv.com/tw/max-zhuan-obj/

在blender2.8中怎么给模型贴图
blender 模型贴图 https://jingyan.baidu.com/article/363872ecf6367f2f4ba16f95.html