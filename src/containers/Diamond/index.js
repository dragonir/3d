/* eslint-disable */
import React from 'react';
import * as THREE from "three";
import Stats from "three/examples/jsm/libs/stats.module";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { TWEEN } from "three/examples/jsm/libs/tween.module.min.js";
import textModel from './models/dm.fbx';
import texture1 from './images/texture.png';
import texture2 from './images/texture2.png';

export default class Diamond extends React.Component {

    constructor(props) {
    super(props);
    this.cube = null;
    this.showTexture1 = true;
  }

  componentDidMount() {
    this.initThree()
  }

  initThree = () => {
    var container, controls, stats, mixer;
    var camera, scene, renderer, light, meshes = [], cycle = null;;
    var clock = new THREE.Clock(), group = new THREE.Group;
    var _this = this;
    init();
    animate();
    function init() {
      container = document.getElementById('container');
      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.shadowMap.enabled = true;
      container.appendChild(renderer.domElement);

      scene = new THREE.Scene();
      scene.background = new THREE.Color(0x2d2d2d);
      camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.set(100, 100, 100);
      camera.lookAt(new THREE.Vector3(0, 0, 0));

      // 网格
      // var grid = new THREE.GridHelper(100, 100, 0xefefef, 0xefefef);
      // grid.position.set(0, -8, 0);
      // grid.material.opacity = 0.2;
      // grid.material.transparent = true;
      // scene.add(grid);

      const cubeGeometry = new THREE.BoxGeometry(0.001, 0.001, 0.001);
      const cubeMaterial = new THREE.MeshLambertMaterial({ color: 0xdc161a });
      const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
      cube.position.set(0, 0, 0);
      light = new THREE.DirectionalLight(0xffffff, 1);
      light.intensity = 1;
      light.position.set(20, 20, 8);
      light.castShadow = true;
      light.target = cube;
      light.shadow.mapSize.width = 512 * 12;
      light.shadow.mapSize.height = 512 * 12;
      light.shadow.camera.top = 80;
      light.shadow.camera.bottom = -30;
      light.shadow.camera.left = -30;
      light.shadow.camera.right = 80;
      scene.add(light);

      // const lightHelper = new THREE.DirectionalLightHelper(light, 1, 'red');
      // scene.add(lightHelper);
      // const lightCameraHelper = new THREE.CameraHelper(light.shadow.camera);
      // scene.add(lightCameraHelper);

      // 环境光
      const ambientLight = new THREE.AmbientLight(0xffffff);
      scene.add(ambientLight);

      // 文字模型
      const fbxLoader = new FBXLoader();
      fbxLoader.load(textModel, mesh => {
        mesh.traverse(child => {
          if (child.isMesh) {
            meshes.push(mesh);
            // child.castShadow = true;
            // child.receiveShadow = true;
            // child.material.metalness = .2;
            // child.material.roughness = .8;
            // child.material.color = new THREE.Color(0x111111);
            if (child.name === 'pCone1') {
              child.material.transparent = true;
              child.material.opacity = .5;
            }
            if (child.name === 'Cube') {
              _this.cube = child;
              // setInterval(() => {
              child.material.map = new THREE.TextureLoader().load(texture1)
              // }, 1000);
            }
          }
        });
        mesh.position.set(0, 0, 0);
        mesh.scale.set(50, 50, 50);
        scene.add(mesh);
      }, () => {
        setInterval(() => {
          _this.cube.material.map = new THREE.TextureLoader().load(_this.showTexture1 ? texture1 : texture2);
          _this.showTexture1 = !_this.showTexture1;
        }, 1000)
      });

      controls = new OrbitControls(camera, renderer.domElement);
      controls.target.set(0, 0, 0);
      // 开启缓动动画
      controls.enableDamping = true;
      controls.maxDistance = 160;
      window.addEventListener('resize', onWindowResize, false);
      // 性能工具
      stats = new Stats();
      document.documentElement.appendChild(stats.dom);
    }

    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function animate() {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
      _this.cube && (_this.cube.rotation.z += .05);
      stats && stats.update();
      let time = clock.getDelta();
      mixer && mixer.update(time);
      TWEEN && TWEEN.update();
      controls && controls.update();
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

  render () {
    return (
      <div>
        <div id="container"></div>
      </div>
    )
  }
}