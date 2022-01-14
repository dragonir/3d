/* eslint-disable */
import React from 'react';
import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { TWEEN } from "three/examples/jsm/libs/tween.module.min.js";
import Stats from "three/examples/jsm/libs/stats.module";
import linkModel from './models/link.fbx';
import Animations from '../../assets/utils/animations';
import './index.css';

export default class Zelda extends React.Component {

  constructor(props) {
    super(props);
  }

  state = {
    loadingProcess: 0
  }

  componentDidMount() {
    this.initThree()
  }

  initThree = () => {
    var container, controls, stats;
    var camera, scene, renderer, light, meshes = [];
    var _this = this;
    init();
    animate();
    function init() {
      container = document.getElementById('container');
      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.needsUpdate = true;
      renderer.outputEncoding = THREE.sRGBEncoding;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;

      container.appendChild(renderer.domElement);

      scene = new THREE.Scene();
      scene.background = new THREE.Color(0x000000);
      camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.set(0, 10, 20);
      camera.lookAt(new THREE.Vector3(0, 0, 0));

      var axes = new THREE.AxisHelper(30);
      scene.add(axes);

      const cubeGeometry = new THREE.BoxGeometry(0.001, 0.001, 0.001);
      const cubeMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
      const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
      cube.position.set(0, 0, 0);
      light = new THREE.DirectionalLight(0xffffff, 1);
      light.intensity = .1;
      light.position.set(12, 16, 6);
      light.castShadow = true;
      light.target = cube;
      light.shadow.mapSize.width = 512 * 12;
      light.shadow.mapSize.height = 512 * 12;
      light.shadow.camera.top = 10;
      light.shadow.camera.bottom = - 10;
      light.shadow.camera.left = - 10;
      light.shadow.camera.right = 10;
      // scene.add(light);

      const lightHelper = new THREE.DirectionalLightHelper(light, 1, 'red');
      scene.add(lightHelper);
      const lightCameraHelper = new THREE.CameraHelper(light.shadow.camera);
      scene.add(lightCameraHelper);

      var ambientLight = new THREE.AmbientLight(0xffffff);
      scene.add(ambientLight);

      const manager = new THREE.LoadingManager();
      manager.onStart = (url, loaded, total) => {};
      manager.onLoad = () => {};
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

      const fbxLoader = new FBXLoader(manager);
      fbxLoader.load(linkModel, mesh => {
        mesh.traverse(child => {
          if (child.isMesh) {
            meshes.push(mesh);
          }
        });
        mesh.position.set(0, -5, 0);
        mesh.scale.set(.075, .075, .075);
        scene.add(mesh);
      });

      controls = new OrbitControls(camera, renderer.domElement);
      controls.target.set(0, 0, 0);
      controls.enableDamping = true;
      window.addEventListener('resize', onWindowResize, false);

      // 性能工具
      stats = new Stats();
      document.documentElement.appendChild(stats.dom);

      // 增加点击事件，声明raycaster和mouse变量
      var raycaster = new THREE.Raycaster();
      var mouse = new THREE.Vector3();
      function onMouseClick(event) {
        // 通过鼠标点击的位置计算出raycaster所需要的点的位置，以屏幕中心为原点，值的范围为-1到1.
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
        // 通过鼠标点的位置和当前相机的矩阵计算出raycaster
        // 屏幕坐标转标准设备坐标
        const x1 = ( event.clientX / window.innerWidth ) * 2 - 1;
        const y1 = -( event.clientX / window.innerHeight ) * 2 + 1;
        //标准设备坐标(z=0.5这个值比较靠经验)
        const stdVector = new THREE.Vector3(x1, y1, 0.5);
        //世界坐标
        const worldVector = stdVector.unproject(camera);
        console.log(worldVector);
        raycaster.setFromCamera(mouse, camera);
        // 获取raycaster直线和所有模型相交的数组集合
        var intersects = raycaster.intersectObjects(meshes);
        if (intersects.length > 0) {
          console.log(intersects[0].object);
        }
      }
      window.addEventListener('click', onMouseClick, false);

      console.log(scene)
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
    }
  }

  render () {
    return (
      <div>
        <div id="container"></div>
        {this.state.loadingProcess === 100 ? '' : (
          <div className="car_loading">
            <div className="box">{this.state.loadingProcess} %</div>
          </div>
        )
      }
      </div>
    )
  }
}