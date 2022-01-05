/* eslint-disable */
import React from 'react';
import * as THREE from "three";
import Stats from "three/examples/jsm/libs/stats.module";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { TWEEN } from "three/examples/jsm/libs/tween.module.min.js";
import bgTexture from './images/bg.png';
import textModel from './models/text.fbx';
import tigerModel from './models/tiger.gltf';
import Animations from '../../assets/utils/animations';
import './index.css';
export default class Lunar extends React.Component {

  constructor(props) {
    super(props);
  }

  state = {
    // 页面模型加载进度，0：未加载，100：加载完成
    loadingProcess: 0
  }

  componentDidMount() {
    this.initThree()
  }

  initThree = () => {
    var container, controls, stats, mixer;
    var camera, scene, renderer, light, meshes = [];
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
      scene.background = new THREE.TextureLoader().load(bgTexture);
      camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.set(100, 100, 100);
      camera.lookAt(new THREE.Vector3(0, 0, 0));

      // 网格
      var grid = new THREE.GridHelper(100, 100, 0xfffc00, 0xfffc00);
      grid.position.set(0, -10, 0)
      grid.material.opacity = 0.1;
      grid.material.transparent = true;
      scene.add(grid);

      // 创建地面
      var planeGeometry = new THREE.PlaneGeometry(100, 100);
      // 透明材质显示阴影
      var planeMaterial = new THREE.ShadowMaterial({ opacity: .5 });
      var plane = new THREE.Mesh(planeGeometry, planeMaterial);
      plane.rotation.x = -0.5 * Math.PI;
      plane.position.set(0, -10, 0);
      plane.receiveShadow = true;
      scene.add(plane);

      const cubeGeometry = new THREE.BoxGeometry(0.001, 0.001, 0.001);
      const cubeMaterial = new THREE.MeshLambertMaterial({ color: 0xdc161a });
      const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
      cube.position.set(0, 0, 0);
      light = new THREE.DirectionalLight(0xffffff, 1);
      light.intensity = 1.5;
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

      const ambientLight = new THREE.AmbientLight(0xefefef);
      scene.add(ambientLight);

      // 文字模型
      const fbxLoader = new FBXLoader();
      fbxLoader.load(textModel, mesh => {
        mesh.traverse(child => {
          if (child.isMesh) {
            meshes.push(mesh);
            child.castShadow = true;
            child.receiveShadow = true;
            child.material.metalness = 0;
            child.material.roughness = 1;
            child.material.color = new THREE.Color(0x111111);
          }
        });
        mesh.position.set(4, 6, -6);
        mesh.rotation.set(-80, 0, 0);
        mesh.scale.set(.3, .3, .3);
        group.add(mesh);
      });

      // 老虎模型
      const manager = new THREE.LoadingManager();
      manager.onStart = (url, loaded, total) => {};
      manager.onLoad = () => {
        console.log('Loading complete!');
        // 镜头动画
      };
      manager.onProgress = async(url, loaded, total) => {
        if (Math.floor(loaded / total * 100) === 100) {
          _this.loadingProcessTimeout && clearTimeout(_this.loadingProcessTimeout);
          _this.loadingProcessTimeout = setTimeout(() => {
            _this.setState({ loadingProcess: Math.floor(loaded / total * 100) });
            Animations.animateCamera(camera, controls, { x: 0, y: 5, z: 21 }, { x: 0, y: 0, z: 0 }, 2400, () => {});
          }, 800);
        } else {
          _this.setState({ loadingProcess: Math.floor(loaded / total * 100) });
        }
      };

      const gltfLoader = new GLTFLoader(manager);
      gltfLoader.load(tigerModel, mesh => {
        mesh.scene.traverse(child => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            child.material.metalness = 0;
            child.material.roughness = 1;
            console.log(child)
          }
        });
        mesh.scene.rotation.y = Math.PI * 9 / 8;
        mesh.scene.position.set(0, -4, 2);
        mesh.scene.scale.set(.75, .75, .75);

        let meshAnimation = mesh.animations[0];
        mixer = new THREE.AnimationMixer(mesh.scene);
        let animationClip = meshAnimation;
        let clipAction = mixer.clipAction(animationClip).play();
        animationClip = clipAction.getClip();
        group.add(mesh.scene);
        scene.add(group)
      });

      controls = new OrbitControls(camera, renderer.domElement);
      controls.target.set(0, 0, 0);
      // 开启缓动动画
      controls.enableDamping = true;
      // controls.dampingFactor = 0.25;
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
        {this.state.loadingProcess === 100 ? '' : (
          <div className="lunar_loading">
            <div className="box">{this.state.loadingProcess} %</div>
          </div>
        )
      }
      </div>
    )
  }
}