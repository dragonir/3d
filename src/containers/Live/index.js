/* eslint-disable */
import React from 'react';
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Stats from "three/examples/jsm/libs/stats.module";
import MikuModel from './models/Miku.glb';
import Animations from '../../assets/utils/animations';
import { Barrage } from '../../assets/utils/barrage';
import { TWEEN } from "three/examples/jsm/libs/tween.module.min.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import './index.css';

const barrageList = [{
    value: "使用的是静态死数据",
    color: "blue",
    range: [0, 0.5]
  },
  {
    value: "随机循环播放",
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
    value: "基于canvas实现",
    color: "black",
    range: [0.2, 0.9]
  },
  {
    value: "因此IE9+浏览器才支持",
    color: "black",
    range: [0.2, 1]
  },
  {
    value: "可以设置边框颜色",
    color: "black",
    range: [0.2, 1]
  },
  {
    value: "文字颜色默认都是白色",
    color: "black",
    range: [0.2, 0.9]
  },
  {
    value: "若文字颜色不想白色",
    color: "black",
    range: [0.2, 1]
  },
  {
    value: "需要自己调整下JS",
    color: "black",
    range: [0.6, 0.7]
  },
  {
    value: "如果需要的是真实和视频交互的弹幕",
    color: "black",
    range: [0.2, 1]
  },
  {
    value: "可以回到原文",
    color: "black",
    range: [0, 0.9]
  },
  {
    value: "查看另外一个demo",
    color: "black",
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
    color: "orange",
    range: [0.5, 0.9]
  },
  {
    value: "前方高能预警！！！",
    color: "orange",
    range: [0, 1]
  },
  {
    value: "前方高能预警！！！",
    color: "orange",
    range: [0, 1]
  }
];

export default class Live extends React.Component {

  constructor(props) {
    super(props);
    this.scene = null;
    this.renderer = null;
  }

  state = {
    // 页面模型加载进度，0：未加载，100：加载完成
    loadingProcess: 0
  }

  componentDidMount() {
    this.initThree();
    Barrage("#barrage", barrageList);
  }

  componentWillUnmount () {
    this.renderer.forceContextLoss();
    this.renderer.dispose();
    this.scene.clear();
  }

  initThree = () => {
    var container, controls, stats, mixer;
    var camera, scene, renderer, light, interactableMeshes = [];
    var clock = new THREE.Clock();
    let _this = this;
    init();
    animate();
    function init() {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setClearAlpha(0);
      renderer.shadowMap.enabled = true;
      _this.renderer = renderer;
      container = document.getElementById('container');
      container.appendChild(renderer.domElement);

      // 场景
      scene = new THREE.Scene();
    //   scene.background = new THREE.Color(0x582424);
      scene.fog = new THREE.Fog(0xeeeeee, 0, 100);
      _this.scene = scene;
      // 透视相机：视场、长宽比、近面、远面
      camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.set(0, 0, 20);
      camera.lookAt(new THREE.Vector3(0, 0, 0));

      // threejs中采用的是右手坐标系，红线是X轴，绿线是Y轴，蓝线是Z轴
      const axes = new THREE.AxesHelper(100);
      scene.add(axes);

      // 半球光源：创建室外效果更加自然的光源
      const cubeGeometry = new THREE.BoxGeometry(0.001, 0.001, 0.001);
      const cubeMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
      const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
      light = new THREE.DirectionalLight(0xb5b1c1, 1);
      light.intensity = 1.4;
      light.position.set(20, 20, 20);
      light.castShadow = true;
      light.target = cube;
      light.shadow.mapSize.width = 512 * 12;
      light.shadow.mapSize.height = 512 * 12;
      light.shadow.camera.top = 130;
      light.shadow.camera.bottom = -80;
      light.shadow.camera.left = -70;
      light.shadow.camera.right = 80;
      scene.add(light);

      const lightHelper = new THREE.DirectionalLightHelper(light, 1, 'red');
      scene.add(lightHelper);
      const lightCameraHelper = new THREE.CameraHelper(light.shadow.camera);
      scene.add(lightCameraHelper);

      // 环境光
      var ambientLight = new THREE.AmbientLight(0xffffff);
      scene.add(ambientLight);

      // 网格
      // var grid = new THREE.GridHelper(50, 100, 0x000000, 0x000000);
      // grid.position.set(0, 0, 0)
      // grid.material.opacity = 0.2;
      // grid.material.transparent = true;
      // scene.add(grid);

      // 加载模型
      // 模型加载进度管理
      const manager = new THREE.LoadingManager();
      manager.onStart = (url, loaded, total) => {};
      manager.onLoad = () => {};
      manager.onProgress = async (url, loaded, total) => {
        if (Math.floor(loaded / total * 100) === 100) {
          _this.loadingProcessTimeout && clearTimeout(_this.loadingProcessTimeout);
          _this.loadingProcessTimeout = setTimeout(() => {
            _this.setState({ loadingProcess: Math.floor(loaded / total * 100) });
            // Animations.animateCamera(camera, controls, { x: 0, y: 5, z: 21 }, {x: 0, y: 0, z: 0 }, 2400, () => {});
          }, 800);
        } else {
          _this.setState({
            loadingProcess: Math.floor(loaded / total * 100)
          });
        }
      };
      const gltfLoader = new GLTFLoader(manager);
      gltfLoader.load(MikuModel, mesh => {
        mesh.scene.traverse(child => {
          if (child.isMesh) {
            console.log(child)
            interactableMeshes.push(child)
            if (child.name === 'body') {
              child.material.metalness = 0;
              child.material.roughness = .3;
            }
            if (child.name === 'ts_bot205_wp') {
              child.material.metalness = .6;
              child.material.roughness = .4;
              child.material.emissiveIntensity = 1.6;
            }
          }
        });
        mesh.scene.position.set(9, -9, 0);
        mesh.scene.scale.set(600, 600, 600);
        console.log(mesh)
        let meshAnimation = mesh.animations[0];
        mixer = new THREE.AnimationMixer(mesh.scene);
        let animationClip = meshAnimation;
        let clipAction = mixer.clipAction(animationClip).play();
        animationClip = clipAction.getClip();
        scene.add(mesh.scene)
      });

      controls = new OrbitControls(camera, renderer.domElement);
      controls.target.set(0, 0, 0);
      controls.enableDamping = true;
      window.addEventListener('resize', onWindowResize, false);

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
      stats && stats.update();
      TWEEN && TWEEN.update();
      let time = clock.getDelta();
      mixer && mixer.update(time);
      controls && controls.update();
    }

    // 增加点击事件，声明raycaster和mouse变量
    var raycaster = new THREE.Raycaster();
    var mouse = new THREE.Vector2();
    function handleMouseClick(event) {
      // 通过鼠标点击的位置计算出raycaster所需要的点的位置，以屏幕中心为原点，值的范围为-1到1.
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
      // 通过鼠标点的位置和当前相机的矩阵计算出raycaster
      raycaster.setFromCamera(mouse, camera);
      // 获取raycaster直线和所有模型相交的数组集合
      var intersects = raycaster.intersectObjects(interactableMeshes);
      if (intersects.length > 0) {
        console.log(intersects[0])
      }
    }
    renderer.domElement.style.touchAction = 'none';
    renderer.domElement.addEventListener('click', handleMouseClick, false);
  }

  render () {
    return (
      <div className='live'>
        <video id='video' className='video' src={require('./videos/video.mp4')} muted autoPlay loop></video>
        {/* 弹幕 */}
        <canvas id="barrage" className="barrage"></canvas>
        <div id="container" className='three'></div>
        {this.state.loadingProcess === 100 ? '' : (
          <div className='live_loading'>
            <div className="box">{this.state.loadingProcess} %</div>
          </div>)
        }
        <div className='decorate'>
          <i className='live_icon'>LIVE</i>
          <div className='live_banner'>
            <i className='icon'></i>
            <div className='title'>
              <span className='text'>慢直播：香港夜景是世界三大夜景之一，其中维多利亚港夜景、太平山顶夜景景色最为壮观动人。</span></div>
          </div>
        </div>
        <div className='input_zone'>
          <div className='tips'>1566人正在看，已填装8896条弹幕！</div>
          <input className='input' placeholder='输入“慢直播、初音未来、安可”等字样可以触发彩蛋哦！' />
          <button className='send_button'>发送</button>
        </div>
      </div>
    )
  }
}