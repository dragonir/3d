/* eslint-disable */
import React from 'react';
import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Stats from "three/examples/jsm/libs/stats.module";
import cityModel from './models/city.fbx';
import Animations from '../../assets/utils/animations';
import { TWEEN } from "three/examples/jsm/libs/tween.module.min.js";
import './index.css';

export default class City extends React.Component {

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
    var container, controls, stats;
    var camera, scene, renderer, light, cityMeshes = [];
    let _this = this;
    init();
    animate();
    function init() {
      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.shadowMap.enabled = true;
      container = document.getElementById('container');
      container.appendChild(renderer.domElement);
      // 场景
      scene = new THREE.Scene();
      scene.background = new THREE.Color(0x582424);
      scene.fog = new THREE.Fog(0xeeeeee, 0, 100);
      // 透视相机：视场、长宽比、近面、远面
      camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.set(120, 100, 100);
      camera.lookAt(new THREE.Vector3(0, 0, 0));
      // 半球光源：创建室外效果更加自然的光源
      const cubeGeometry = new THREE.BoxGeometry(0.001, 0.001, 0.001);
      const cubeMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
      const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
      light = new THREE.DirectionalLight(0xb5b1c1, 1);
      light.intensity = 1.2;
      light.position.set(20, 20, 5);
      light.castShadow = true;
      light.target = cube;
      light.shadow.mapSize.width = 512 * 12;
      light.shadow.mapSize.height = 512 * 12;
      light.shadow.camera.top = 130;
      light.shadow.camera.bottom = - 80;
      light.shadow.camera.left = - 70;
      light.shadow.camera.right = 80;
      scene.add(light);

      // const lightHelper = new THREE.DirectionalLightHelper(light, 1, 'red');
      // scene.add(lightHelper);
      // const lightCameraHelper = new THREE.CameraHelper(light.shadow.camera);
      // scene.add(lightCameraHelper);

      // 环境光
      var ambientLight = new THREE.AmbientLight(0x605a64);
      scene.add(ambientLight);

      // 网格
      // var grid = new THREE.GridHelper(50, 100, 0x000000, 0x000000);
      // grid.position.set(0, 0, 0)
      // grid.material.opacity = 0.2;
      // grid.material.transparent = true;
      // scene.add(grid);

      // 加载模型
      var loader = new FBXLoader();
      loader.load(cityModel, mesh => {
        mesh.traverse(function (child) {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            cityMeshes.push(child)
            if (child.material.length > 1) {
              child.material.map(item => {
                item.metalness = .5;
                item.specular = item.color;
                item.shininess = 50;
                if (/green|pink|cyan|black/i.test(item.name)) {
                  item.emissive = item.color;
                }
                if (item.name.includes('DarkGray')) {
                  item.metalness = 1;
                  item.fog = false;
                  item.emissive = new THREE.Color(0x000000);
                }
              })
            }
          }
        });
        mesh.rotation.y = Math.PI / 2;
        mesh.position.set(40, 0, -50);
        mesh.scale.set(1, 1, 1);
        scene.add(mesh);
      }, res => {
        if (Number((res.loaded / res.total * 100).toFixed(0)) === 100) {
          Animations.animateCamera(camera, controls, { x: 0, y: 10, z: 20 }, { x: 0, y: 0, z: 0 }, 4000, () => {});
        }
        _this.setState({ loadingProcess: Math.floor(res.loaded / res.total * 100) });
      }, err => {
        console.log(err);
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
      var intersects = raycaster.intersectObjects(cityMeshes);
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
          <div id="loading">
            <div className="box">{this.state.loadingProcess} %</div>
          </div>
        )
      }
      </div>
    )
  }
}