/* eslint-disable */
import React from 'react';
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Stats from "three/examples/jsm/libs/stats.module";
import Animations from '../../assets/utils/animations';
import { Barrage, barrageList } from '../../assets/utils/barrage';
import { TWEEN } from "three/examples/jsm/libs/tween.module.min.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import './index.css';
import MikuModel from './models/Miku.glb';
import heartModel from './models/heart.glb';
import logoModel from './models/logo.glb';
import Button from '@mui/material/Button';
import Input from '@mui/material/Input';

export default class Live extends React.Component {

  constructor(props) {
    super(props);
    this.scene = null;
    this.renderer = null;
    this.camera = null;
    this.stats = null;
    this.mixer = null;
    this.controls = null;
    this.clock = new THREE.Clock();
    this.miku = null;
    this.barrageList = barrageList;
    this.heart = null;
    this.gltfLoader = new GLTFLoader();
  }

  state = {
    loadingProcess: 0,
    inputValue: ''
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
    let _this = this;
    var container;
    var camera, scene, renderer, light, interactableMeshes = [];
    init();
    function init() {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(600, 600);
      renderer.setClearAlpha(0);
      renderer.shadowMap.enabled = true;
      _this.renderer = renderer;
      container = document.getElementById('miku');
      container.appendChild(renderer.domElement);
      // 场景
      scene = new THREE.Scene();
      scene.fog = new THREE.Fog(0xeeeeee, 0, 100);
      _this.scene = scene;
      // 透视相机：视场、长宽比、近面、远面
      camera = new THREE.PerspectiveCamera(60, 600 / 600, 0.1, 1000);
      camera.position.set(4, 0, 20);
      camera.lookAt(new THREE.Vector3(0, 0, 0));
      _this.camera = camera;

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

      // 环境光
      var ambientLight = new THREE.AmbientLight(0xffffff);
      scene.add(ambientLight);

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
            interactableMeshes.push(child)
            if (child.name === 'mesh_0') {
              child.material.metalness = 0;
              child.material.roughness = .3;
            }
            if (child.name === 'mesh_1') {
              child.material.metalness = .6;
              child.material.roughness = .4;
              child.material.emissiveIntensity = 1.6;
            }
          }
        });
        mesh.scene.position.set(2, -11, 0);
        mesh.scene.scale.set(10, 10, 10);
        scene.add(mesh.scene);
        _this.miku = mesh;
        _this.playAnimation(5);
      });

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.target.set(0, 0, 0);
      controls.enablePan = false;
      controls.enableZoom = false;
      _this.controls = controls;

      // const stats = new Stats();
      // _this.stats = stats
      // document.documentElement.appendChild(stats.dom);
      _this.animate();
    }

    // 增加点击事件，声明raycaster和mouse变量
    var raycaster = new THREE.Raycaster();
    var mouse = new THREE.Vector2();
    renderer.domElement.style.touchAction = 'none';
    renderer.domElement.addEventListener('click', event => {
      // 通过鼠标点击的位置计算出raycaster所需要的点的位置，以屏幕中心为原点，值的范围为-1到1.
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
      // 通过鼠标点的位置和当前相机的矩阵计算出raycaster
      raycaster.setFromCamera(mouse, camera);
      // 获取raycaster直线和所有模型相交的数组集合
      var intersects = raycaster.intersectObjects(interactableMeshes);
      _this.playAnimation(Math.floor(Math.random() * (5 - 0 + 1)) + 0)
    }, false);
    this.loadLogo();
    this.loadHeart();
  }

  loadLogo = () => {
    let logo = null;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(250, 250);
    renderer.setClearAlpha(0);
    document.getElementById('logo').appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, 250 / 250, 0.1, 1000);
    camera.position.set(0, 0, 10);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    new GLTFLoader().load(logoModel, mesh => {
      mesh.scene.traverse(child => {
        if (child.isMesh) {
          child.material.metalness = .2;
          child.material.roughness = .4;
          child.material.color = new THREE.Color(0x00a1ff);
        }
      });
      mesh.scene.position.set(-1, 2, 0);
      mesh.scene.scale.set(.012, .012, .012);
      logo = mesh.scene;
      scene.add(mesh.scene)
    });
    const ambientLight = new THREE.AmbientLight(0xffffff);
    ambientLight.intensity = 1.2;
    scene.add(ambientLight);
    const animate = () => {
      requestAnimationFrame( animate );
      renderer.render(scene, camera);
      logo && (logo.rotation.y += .008);
    }
    animate();
  }

  loadHeart = () => {
    let heart = null;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(250, 250);
    renderer.setClearAlpha(0);
    document.getElementById('heart').appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, 250 / 250, 0.1, 1000);
    camera.position.set(0, 0, 10);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    new GLTFLoader().load(heartModel, mesh => {
      mesh.scene.traverse(child => {
        if (child.name === 'mesh_0') {
          child.material.metalness = .6;
          child.material.roughness = .4;
          child.material.color = new THREE.Color(0xfe3f47)
          child.material.emissiveIntensity = 1.6;
        }
      });
      mesh.scene.position.set(-2, -4, 0);
      mesh.scene.scale.set(.05, .05, .05);
      scene.add(mesh.scene);
      heart = mesh.scene;
    });
    const ambientLight = new THREE.AmbientLight(0xffffff);
    scene.add(ambientLight);
    const animate = () => {
      requestAnimationFrame( animate );
      renderer.render(scene, camera);
      heart && (heart.rotation.y += .04)
    }
    animate();
  }

  animate = () => {
    requestAnimationFrame(this.animate);
    this.renderer.render(this.scene, this.camera);
    this.stats && this.stats.update();
    TWEEN && TWEEN.update();
    this.mixer && this.mixer.update(this.clock.getDelta());
    this.controls && this.controls.update();
    this.heart && (this.heart.rotation.y += 0.05);
  }

  playAnimation = (animationIndex) => {
    let meshAnimation = this.miku.animations[animationIndex];
    this.mixer = new THREE.AnimationMixer(this.miku.scene);
    let animationClip = meshAnimation;
    let clipAction = this.mixer.clipAction(animationClip).play();
    animationClip = clipAction.getClip();
  }

  handleInputChange = (e) => {
    this.setState({
      inputValue: e.target.value
    });
  }

  handleInputKeypress = (e) => {
    console.log(e)
    if (e.charCode === 13 || e.keyCode === 13) {
      this.handleSend();
    }
  }

  handleSend = () => {
    let val = this.state.inputValue;
    // 发送弹幕
    this.barrageList.push({
      value: '随机循环播放',
      color: 'red',
      range: [.2, 1]
    });
    // 触发动画
    let keywordMap = ['慢直播', '虚拟主播', '初音未来', '安可', '元宇宙', '卡哇伊'];
    keywordMap.map((item, index) => {
      if (val.includes(item)) {
        this.playAnimation(index);
      }
    });
    // 清空输入
    this.setState({
      inputValue: ''
    })
  }

  render () {
    return (
      <div className='live'>
        <video id='video' className='video' src={require('./videos/demo.mp4')} muted autoPlay loop></video>
        <canvas id="barrage" className="barrage"></canvas>
        <div id="miku" className='three'></div>
        <div id="heart" className='three'></div>
        <div id="logo" className='three'></div>
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
          <div className='tips'><b>1566</b>人正在看，已填装<b>8896</b>条弹幕！</div>
          <Input
            className='input'
            placeholder='输入“慢直播、虚拟主播、初音未来、安可、元宇宙、卡哇伊 ❤”等字样可以触发彩蛋哦！'
            onChange={this.handleInputChange.bind(this)}
            onKeyPress={this.handleInputKeypress.bind(this)}
            value={this.state.inputValue}
            variant="contained"
          />
          <Button className='send_button' onClick={this.handleSend} variant="contained">发送</Button>
        </div>
      </div>
    )
  }
}