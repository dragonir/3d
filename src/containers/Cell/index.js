/* eslint-disable */
import React from 'react';
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import plantCellModel from './models/plant_cell.glb';
import AnimalCellModel from './models/animal_cell.glb';
import './index.css';

export default class Cell extends React.Component {

  constructor(props) {
    super(props);
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
    var camera, scene, renderer, light, earthMeshes = [];
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

      const cubeGeometry = new THREE.BoxGeometry(0.001, 0.001, 0.001);
      const cubeMaterial = new THREE.MeshLambertMaterial({ color: 0xdc161a });
      const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
      cube.position.set(0, 0, 0,);
      light = new THREE.DirectionalLight(0x03c03c, 1);
      light.intensity = 1.2;
      light.position.set(-5, 10, 3);
      light.castShadow = true;
      light.target = cube;
      light.shadow.mapSize.width = 512 * 12;
      light.shadow.mapSize.height = 512 * 12;
      light.shadow.camera.top = 10;
      light.shadow.camera.bottom = - 5;
      light.shadow.camera.left = - 5;
      light.shadow.camera.right = 10;
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
            earthMeshes.push(child)
            child.castShadow = true;
            child.receiveShadow = true;
            child.material.metalness = 1;
            child.material.roughness = 0;
          }
        });
        mesh.scene.position.set(0, 0, 0);
        mesh.scene.scale.set(40, 40, 40);
        _this.plantCell = mesh.scene;
        scene.add(mesh.scene);
      });
      // 动物细胞
      loader.load(AnimalCellModel, function (mesh) {
        mesh.scene.traverse(function (child) {
          if (child.isMesh) {
            earthMeshes.push(child)
            child.castShadow = true;
            child.receiveShadow = true;
            child.material.metalness = 1;
            child.material.roughness = 0;
          }
        });
        mesh.scene.position.set(0, -8, 0);
        mesh.scene.scale.set(120, 120, 120);
        _this.animalCell = mesh.scene;
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
  }

  handleToggle = () => {
    this.scene.remove(this.state.showAnimal ? this.animalCell : this.plantCell);
    this.scene.add(this.state.showAnimal ? this.plantCell : this.animalCell);
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