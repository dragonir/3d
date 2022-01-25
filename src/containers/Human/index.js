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

import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";

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
    var camera, frustumSize = 96, scene, renderer, composer, light, meshes = [];
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
      // renderer.toneMapping = THREE.ReinhardToneMapping;
      container.appendChild(renderer.domElement);

      scene = new THREE.Scene();
      scene.background = new THREE.Color(0x000000);
      let aspect = window.innerWidth / window.innerHeight;
      camera = new THREE.OrthographicCamera(-frustumSize * aspect, frustumSize * aspect, frustumSize, -frustumSize, 1, 1000);
      camera.position.set(0, 0, 600);
      camera.lookAt(new THREE.Vector3(0, 0, 0));

      // 全局辉光
      const params = {
        exposure: .2,
        bloomStrength: .1,
        bloomThreshold: .2,
        bloomRadius: 0
      };
      const renderScene = new RenderPass(scene, camera);
      const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight ), 1.5, .4, .85);
      bloomPass.threshold = params.bloomThreshold;
      bloomPass.strength = params.bloomStrength;
      bloomPass.radius = params.bloomRadius;
      composer = new EffectComposer(renderer);
      composer.addPass(renderScene);
      composer.addPass(bloomPass);

      // var axes = new THREE.AxisHelper(30);
      // scene.add(axes);

      const cubeGeometry = new THREE.BoxGeometry(0.001, 0.001, 0.001);
      const cubeMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
      const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
      cube.position.set(0, 0, 0);
      light = new THREE.DirectionalLight(0xffffff, 1);
      light.intensity = .8;
      light.position.set(70, 4, 5);
      light.castShadow = true;
      light.target = cube;
      light.shadow.mapSize.width = 512 * 12;
      light.shadow.mapSize.height = 512 * 12;
      light.shadow.camera.top = 160;
      light.shadow.camera.bottom = -80;
      light.shadow.camera.left = -80;
      light.shadow.camera.right = 160;
      scene.add(light);

      // const lightHelper = new THREE.DirectionalLightHelper(light, 1, 'red');
      // scene.add(lightHelper);
      // const lightCameraHelper = new THREE.CameraHelper(light.shadow.camera);
      // scene.add(lightCameraHelper);

      // 环境光
      const ambientLight = new THREE.AmbientLight(0x9d9398);
      ambientLight.intensity = 1;
      scene.add(ambientLight);

      // 头部模型
      const ctmLoader = new THREE.CTMLoader();
      ctmLoader.load(headModal, geometry => {
        //创建纹理
        let mat = new THREE.MeshPhysicalMaterial({
          map: new THREE.TextureLoader().load(mapTexture),
          bumpMap: new THREE.TextureLoader().load(bumpMapTexture),
          bumpScale: .8,
          specularMap: new THREE.TextureLoader().load(normalMapTexture)
        });
        let mesh = new THREE.Mesh(geometry, mat);
        mesh.rotation.set(0, -Math.PI, 0)
        mesh.scale.set(66, 66, 66);
        mesh.position.set(-40, -200, 0);
        scene.add(mesh);
        meshes.push(scene);
      });

      // 眼睛
      ctmLoader.load(eyeModel, geometry => {
        //创建纹理
        let mat = new THREE.MeshPhysicalMaterial({
          map: new THREE.TextureLoader().load(eyeMapTexture),
          bumpMap: new THREE.TextureLoader().load(eyeBumpMapTexture),
          bumpScale: .8,
          // specularMap: new THREE.TextureLoader().load(normalMapTexture)
        });
        let rightEye = new THREE.Mesh(geometry, mat);
        rightEye.rotation.set(0, -Math.PI, 0)
        rightEye.scale.set(66, 66, 66);
        rightEye.position.set(4, -202, -2);
        scene.add(rightEye);
        meshes.push(rightEye);

        let leftEye = rightEye.clone();
        rightEye.position.set(-42, -202, -2);
        scene.add(leftEye);
        meshes.push(leftEye);
      });

      controls = new OrbitControls(camera, renderer.domElement);
      controls.target.set(0, 0, 0);
      // 开启缓动动画
      controls.enableDamping = true;
      controls.enablePan = false;
      controls.enableZoom = false;
      // 最大仰角
      controls.minPolarAngle = 1.36;
      controls.maxPolarAngle = 1.5;
      window.addEventListener('resize', onWindowResize, false);
      // 性能工具
      stats = new Stats();
      document.documentElement.appendChild(stats.dom);
    }

    function onWindowResize() {
      let aspect = window.innerWidth / window.innerHeight;
      camera.left = -frustumSize * aspect;
      camera.right = frustumSize * aspect;
      camera.top = frustumSize;
      camera.bottom = -frustumSize;
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
      composer && composer.render();
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