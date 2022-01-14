/* eslint-disable */
import React from 'react';
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { TWEEN } from "three/examples/jsm/libs/tween.module.min.js";
import Stats from "three/examples/jsm/libs/stats.module";
import carModel from './models/car.gltf';
import Animations from '../../assets/utils/animations';
import './index.css';

export default class Car extends React.Component {

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
    var camera, scene, renderer, light, car = null, carMeshes = [];
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
      scene.background = new THREE.Color(0xdddddd);
      camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.set(0, 10, 20);
      camera.lookAt(new THREE.Vector3(0, 0, 0));

      var axes = new THREE.AxisHelper(30);
      scene.add(axes);

      const cubeGeometry = new THREE.BoxGeometry(0.001, 0.001, 0.001);
      const cubeMaterial = new THREE.MeshLambertMaterial({ color: 0xdc161a });
      const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
      cube.position.set(0, 0, 0,);
      light = new THREE.DirectionalLight(0xffffff, 1);
      light.intensity = 1.2;
      light.position.set(-5, 8, 3);
      scene.add(light);

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

      var loader = new GLTFLoader(manager);
      loader.load(carModel, function (mesh) {
        mesh.scene.traverse(function (child) {
          if (child.isMesh) {
            carMeshes.push(child)
            // child.castShadow = true;
            // child.receiveShadow = true;
            // child.material.metalness = .2;
            // child.material.roughness = .2;
          }
        });
        mesh.scene.position.set(0, 0, 0);
        mesh.scene.scale.set(5, 5, 5);
        car = mesh.scene;
        scene.add(car);
      });

      controls = new OrbitControls(camera, renderer.domElement);
      controls.target.set(0, 0, 0);
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