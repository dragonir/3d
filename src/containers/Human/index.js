/* eslint-disable */
import React from 'react';
import Stats from "three/examples/jsm/libs/stats.module";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { TWEEN } from "three/examples/jsm/libs/tween.module.min.js";
import './libs/CTMLoader';
import headModal from './models/Head_02.ctm';
import mapTexture from './images/Head_02_Diffuse_2k.jpg';
import bumpMapTexture from './images/Head_02_Bump_2k.jpg';
import normalMapTexture from './images/Head_02_Gloss_2k.jpg';
import eyeModel from './models/EyeRight.ctm';
import eyeMapTexture from './images/Eye_Blue2_1k.jpg';
import eyeBumpMapTexture from './images/Eye_Bump2_1k.jpg';

export default class Human extends React.Component {

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
      scene.background = new THREE.Color(0x000000);
      camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.set(0, 8.5, 30);
      camera.lookAt(new THREE.Vector3(0, 0, 0));

      var axes = new THREE.AxisHelper(30);
      scene.add(axes);

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
      const ambientLight = new THREE.AmbientLight(0x8d8389);
      scene.add(ambientLight);

      // 头部模型
      const ctmLoader = new THREE.CTMLoader();
      ctmLoader.load(headModal, geometry => {
        //创建纹理
        let mat = new THREE.MeshPhysicalMaterial({
          map: new THREE.TextureLoader().load(mapTexture),
          bumpMap: new THREE.TextureLoader().load(bumpMapTexture),
          bumpScale: .05,
          specularMap: new THREE.TextureLoader().load(normalMapTexture)
        });
        let mesh = new THREE.Mesh(geometry, mat);
        mesh.receiveShadow = true;
        mesh.rotation.set(0, -Math.PI, 0)
        mesh.scale.set(10, 10, 10);
        mesh.position.set(-5, -28, 0);
        scene.add(mesh);
        meshes.push(scene);
      });

      // 眼睛
      ctmLoader.load(eyeModel, geometry => {
        //创建纹理
        let mat = new THREE.MeshPhysicalMaterial({
          map: new THREE.TextureLoader().load(eyeMapTexture),
          bumpMap: new THREE.TextureLoader().load(eyeBumpMapTexture),
          bumpScale: .01,
          // specularMap: new THREE.TextureLoader().load(normalMapTexture)
        });
        let rightEye = new THREE.Mesh(geometry, mat);
        rightEye.rotation.set(0, -Math.PI, 0)
        rightEye.scale.set(9, 9, 9);
        rightEye.position.set(1.8, -24.88, 0);
        scene.add(rightEye);
        meshes.push(rightEye);

        let leftEye = rightEye.clone();
        rightEye.position.set(-5.2, -24.88, 0);
        scene.add(leftEye);
        meshes.push(leftEye);
      });

      controls = new OrbitControls(camera, renderer.domElement);
      controls.target.set(0, 0, 0);
      // 开启缓动动画
      controls.enableDamping = true;
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