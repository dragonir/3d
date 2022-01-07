/* eslint-disable */
import React from 'react';
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import plantCellModel from './models/plant_cell.glb';
import AnimalCellModel from './models/animal_cell.glb';
import Stats from "three/examples/jsm/libs/stats.module";
import { makeCycleTextSprite } from '../../assets/utils/common';
import './index.css';

export default class Cell extends React.Component {

  constructor(props) {
    super(props);
    this.plantCell = null;
    this.plantGroup = new THREE.Group;
    this.plantPoint = [
      { key: '1', value: '细胞壁', location: { x: 0, y: 4.2, z: -1 }},
      { key: '2', value: '细胞壁', location: { x: -7, y: 4, z: -1.6 }},
      { key: '3', value: '细胞壁', location: { x: 5, y: 10, z: -10 }},
      { key: '4', value: '细胞壁', location: { x: 0, y: 16, z: 10 }},
      { key: '5', value: '细胞壁', location: { x: 0, y: 10, z: 0 }},
      { key: '6', value: '细胞壁', location: { x: 3, y: 10, z: 2 }},
      { key: '7', value: '细胞壁', location: { x: 0, y: 15, z: 0 }},
      { key: '8', value: '细胞壁', location: { x: 8, y: 8, z: 8 }},
    ]
    this.animalCell = null;
    this.animalGroup = new THREE.Group;
  }

  state = {
    // 页面模型加载进度，0：未加载，100：加载完成
    loadingProcess: 0,
    showAnimal: false
  }

  componentDidMount() {
    this.initThree()
  }

  initThree = () => {
    var container, controls, stats;
    var camera, scene, renderer, light, interactableMeshes = [];
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
      scene.background = new THREE.Color(0x03c03c);
      _this.scene = scene;
      camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.set(0, 16, 18);
      camera.lookAt(new THREE.Vector3(0, 0, 0));

      // threejs中采用的是右手坐标系，红线是X轴，绿线是Y轴，蓝线是Z轴
      var axes = new THREE.AxisHelper(30);
      scene.add(axes);

      const cubeGeometry = new THREE.BoxGeometry(0.001, 0.001, 0.001);
      const cubeMaterial = new THREE.MeshLambertMaterial({ color: 0xdc161a });
      const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
      cube.position.set(0, 0, 0,);
      light = new THREE.DirectionalLight(0x03c03c, 1);
      light.intensity = 1.2;
      light.position.set(-5, 10, 3);
      light.target = cube;
      scene.add(light);

      var ambientLight = new THREE.AmbientLight(0xffffff);
      ambientLight.intensity = 1.2;
      scene.add(ambientLight);

      // 模型加载进度管理
      const manager = new THREE.LoadingManager();
      manager.onStart = (url, loaded, total) => {};
      manager.onLoad = () => {};
      manager.onProgress = async(url, loaded, total) => {
        if (Math.floor(loaded / total * 100) === 100) {
          _this.loadingProcessTimeout && clearTimeout(_this.loadingProcessTimeout);
          _this.loadingProcessTimeout = setTimeout(() => {
            _this.setState({ loadingProcess: Math.floor(loaded / total * 100) });
          }, 800);
        } else {
          _this.setState({ loadingProcess: Math.floor(loaded / total * 100) });
        }
      };

      var loader = new GLTFLoader(manager);
      // 植物细胞
      loader.load(plantCellModel, function (mesh) {
        mesh.scene.traverse(function (child) {
          if (child.isMesh) {
            child.material.metalness = 1;
            child.material.roughness = 0;
          }
        });
        mesh.scene.position.set(0, 0, 0);
        mesh.scene.scale.set(40, 40, 40);
        _this.plantCell = mesh.scene;
        _this.plantGroup.add(mesh.scene);

        _this.plantPoint.map(item => {
          let point = makeCycleTextSprite(item.key);
          point.name = item.value;
          point.scale.set(1, 1, 1);
          point.position.set(item.location.x, item.location.y, item.location.z);
          _this.plantGroup.add(point);
          interactableMeshes.push(point);
        });

        scene.add(_this.plantGroup);
      });
      // 动物细胞
      loader.load(AnimalCellModel, function (mesh) {
        mesh.scene.traverse(function (child) {
          if (child.isMesh) {
            child.material.metalness = 1;
            child.material.roughness = 0;
          }
        });
        mesh.scene.position.set(0, -8, 0);
        mesh.scene.scale.set(120, 120, 120);
        _this.animalCell = mesh.scene;
        _this.animalGroup.add(mesh.scene);
      });

      controls = new OrbitControls(camera, renderer.domElement);
      controls.target.set(0, 0, 0);
      controls.enableDamping = true;
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
    }

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
      var intersects = raycaster.intersectObjects(interactableMeshes);
      if (intersects.length > 0) {
        console.log(intersects[0].object);
      }
    }
    window.addEventListener('click', onMouseClick, false);
  }

  handleToggle = () => {
    this.scene.remove(this.state.showAnimal ? this.animalGroup : this.plantGroup);
    this.scene.add(this.state.showAnimal ? this.plantGroup : this.animalGroup);
    this.setState({
      showAnimal: !this.state.showAnimal
    })
  }

  render () {
    return (
      <div>
        <div id="container"></div>
    <button className="toggle_button" onClick={this.handleToggle}>查看{this.state.showAnimal ? '植物🌲' : '动物🐼'}细胞</button>
        {this.state.loadingProcess === 100 ? '' : (
          <div className="cell_loading">
            <div className="box">{this.state.loadingProcess} %</div>
          </div>
        )
      }
      </div>
    )
  }
}