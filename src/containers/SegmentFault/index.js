import './index.css';
import React from 'react';
import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { TWEEN } from "three/examples/jsm/libs/tween.module.min.js";
import textModel from './models/text.fbx';
import segmentTexture from './images/texture.png';
import normalMapTexture from './images/normalMap.png';
import metalTexture from './images/metal.png';
import backgroundTexture from './images/bg.webp';
import Animations from '../../assets/utils/animations';
// import Stats from "three/examples/jsm/libs/stats.module";

export default class SegmentFault extends React.Component {

  state = {
    loadingProcess: 0
  }

  componentDidMount() {
    this.initThree();
  }

  initThree = () => {
    var container, controls;
    // var stats;
    var camera, scene, renderer, light, box = null, meshes = [];
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
      container.appendChild(renderer.domElement);

      scene = new THREE.Scene();
      scene.background = new THREE.TextureLoader().load(backgroundTexture);
      camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.set(0, 0, 0);
      camera.lookAt(new THREE.Vector3(0, 0, 0));

      // 直射光
      const cubeGeometry = new THREE.BoxGeometry(0.001, 0.001, 0.001);
      const cubeMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
      const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
      cube.position.set(0, 0, 0);
      light = new THREE.DirectionalLight(0xffffff, 1);
      light.intensity = 1;
      light.position.set(18, 20, 60);
      light.castShadow = true;
      light.target = cube;
      light.shadow.mapSize.width = 512 * 12;
      light.shadow.mapSize.height = 512 * 12;
      light.shadow.camera.top = 80;
      light.shadow.camera.bottom = -80;
      light.shadow.camera.left = -80;
      light.shadow.camera.right = 80;
      scene.add(light);
      // 半球光
      const ambientLight = new THREE.AmbientLight(0xffffff);
      ambientLight.intensity = .8;
      scene.add(ambientLight);
      // 环境光
      const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0xfffc00);
      hemisphereLight.intensity = .3;
      scene.add(hemisphereLight);

      controls = new OrbitControls(camera, renderer.domElement);
      controls.target.set(0, 0, 0);
      controls.enableDamping = true;
      controls.enableZoom = false;
      controls.enablePan = false;
      controls.rotateSpeed = .2;
      window.addEventListener('resize', onWindowResize, false);

      // 性能工具
      // stats = new Stats();
      // document.documentElement.appendChild(stats.dom);

      // 网格
      const grid = new THREE.GridHelper(200, 200, 0xffffff, 0xffffff);
      grid.position.set(0, -30, -50);
      grid.material.transparent = true;
      grid.material.opacity = 0.1;
      scene.add(grid);

      // 创建地面
      var planeGeometry = new THREE.PlaneGeometry(200, 200);
      // 透明材质显示阴影
      var planeMaterial = new THREE.ShadowMaterial({ opacity: .5 });
      var plane = new THREE.Mesh(planeGeometry, planeMaterial);
      plane.rotation.x = -0.5 * Math.PI;
      plane.position.set(0, -30, -50);
      plane.receiveShadow = true;
      scene.add(plane);

      // 添加自定义模型
      let segmentMap = new THREE.MeshPhysicalMaterial({map: new THREE.TextureLoader().load(segmentTexture), normalMap: new THREE.TextureLoader().load(normalMapTexture) });
      let metalMap = new THREE.MeshPhysicalMaterial({map: new THREE.TextureLoader().load(metalTexture)});
      //创建纹理数组
      const boxMaps = [metalMap, metalMap, metalMap, metalMap, segmentMap, segmentMap];
      box = new THREE.Mesh(new THREE.BoxGeometry(297, 456, 12), boxMaps);
      box.material.map(item => {
        item.metalness = .5;
        item.roughness = .4;
        item.refractionRatio = 1;
        return item;
      });
      box.scale.set(0.085, 0.085, 0.085);
      box.position.set(-22, 2, 0);
      box.castShadow = true;
      meshes.push(box);
      scene.add(box);

      // 加载文字模型
      const manager = new THREE.LoadingManager();
      manager.onProgress = async(url, loaded, total) => {
        if (Math.floor(loaded / total * 100) === 100) {
          _this.loadingProcessTimeout && clearTimeout(_this.loadingProcessTimeout);
          _this.loadingProcessTimeout = setTimeout(() => {
            _this.setState({ loadingProcess: Math.floor(loaded / total * 100) });
            Animations.animateCamera(camera, controls, { x: 0, y: 4, z: 60 }, { x: 0, y: 0, z: 0 }, 3600, () => {});
          }, 800);
        } else {
          _this.setState({ loadingProcess: Math.floor(loaded / total * 100) });
        }
      };
      const fbxLoader = new FBXLoader(manager);
      fbxLoader.load(textModel, mesh => {
        mesh.traverse(child => {
          if (child.isMesh) {
            child.castShadow = true;
            child.material.metalness = 1;
            child.material.roughness = .2;
            meshes.push(mesh);
          }
        });
        mesh.position.set(16, -4, 0);
        mesh.rotation.x = Math.PI / 2
        mesh.scale.set(.08, .08, .08);
        scene.add(mesh);
      });
    }

    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function animate() {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
      // stats && stats.update();
      controls && controls.update();
      TWEEN && TWEEN.update();
      box && (box.rotation.y += .04);
    }
  }

  render () {
    return (
      <div className="segment_fault_page">
        <div id="container"></div>
        {this.state.loadingProcess === 100 ? '' : (
          <div className="segment_fault_loading">
            <div className="box">{this.state.loadingProcess} %</div>
          </div>
        )}
        <div className="firework_1"></div>
        <div className="firework_2"></div>
        <div className="firework_3"></div>
        <div className="firework_4"></div>
        <div className="firework_5"></div>
        <div className="firework_6"></div>
        <div className="firework_7"></div>
        <div className="firework_8"></div>
        <div className="firework_9"></div>
        <div className="firework_10"></div>
      </div>
    )
  }
}