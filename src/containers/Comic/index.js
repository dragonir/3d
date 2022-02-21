import React from 'react';
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { TWEEN } from "three/examples/jsm/libs/tween.module.min.js";
import Animations from '../../assets/utils/animations';
import layer_0 from './images/layer_0.png';
import layer_1 from './images/layer_1.png';
import layer_2 from './images/layer_2.png';
import layer_3 from './images/layer_3.png';
import layer_4 from './images/layer_4.png';
import layer_5 from './images/layer_5.png';
import layer_6 from './images/layer_6.png';
import layer_7 from './images/layer_7.png';
import background from './images/background.png';
import boomImage from './images/boom.png';
import './index.css'

export default class Comic extends React.Component {

  componentDidMount() {
    this.initThree()
  }

  initThree = () => {
    var container, controls, stats, camera, scene, renderer, light, animateLayer = null, step = 0, layerGroup = new THREE.Group();
    var layers = [layer_0, layer_1, layer_2, layer_3, layer_4, layer_5, layer_6, layer_7];
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
      scene.background = new THREE.TextureLoader().load(background);
      camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.set(-12, 0, 0);
      camera.lookAt(new THREE.Vector3(0, 0, 0));

      const cube = new THREE.Mesh(new THREE.BoxGeometry(0.001, 0.001, 0.001), new THREE.MeshLambertMaterial({}));
      cube.position.set(0, 0, 0,);
      light = new THREE.DirectionalLight(0xffffff, 1);
      light.intensity = .2;
      light.position.set(10, 10, 30);
      light.castShadow = true;
      light.target = cube;
      light.shadow.mapSize.width = 512 * 12;
      light.shadow.mapSize.height = 512 * 12;
      light.shadow.camera.top = 100;
      light.shadow.camera.bottom = - 50;
      light.shadow.camera.left = - 50;
      light.shadow.camera.right = 100;
      scene.add(light);

      const ambientLight = new THREE.AmbientLight(0xdddddd);
      scene.add(ambientLight);

      // 创建8个面
      let aspect = 18;
      for (let i=0; i<layers.length; i++) {
        let mesh = new THREE.Mesh(new THREE.PlaneGeometry(10.41, 16), new THREE.MeshPhysicalMaterial({
          map: new THREE.TextureLoader().load(layers[i]),
          transparent: true,
          side: THREE.DoubleSide
        }));
        mesh.position.set(0, 0, i);
        mesh.scale.set(1 - (i / aspect), 1 - (i / aspect), 1 - (i / aspect));
        layerGroup.add(mesh);
        // 文字
        if (i === 5) {
          mesh.material.metalness = .6;
          mesh.material.emissive = new THREE.Color(0x55cfff);
          mesh.material.emissiveIntensity = 1.6;
          mesh.material.opacity = .9;
        }
        // 会话框
        if (i === 6) {
          mesh.scale.set(1.5, 1.5, 1.5);
          animateLayer = mesh;
        }
      }
      layerGroup.scale.set(1.2, 1.2, 1.2);
      // 创建boom背景
      const boom = new THREE.Mesh(new THREE.PlaneGeometry(36.76, 27.05), new THREE.MeshPhongMaterial({
        map: new THREE.TextureLoader().load(boomImage),
        transparent: true,
        shininess: 160,
        specular: new THREE.Color(0xff6d00),
        opacity: .7
      }));
      boom.scale.set(.8, .8, .8);
      boom.position.set(0, 0, -3);
      layerGroup.add(boom)
      scene.add(layerGroup);

      controls = new OrbitControls(camera, renderer.domElement);
      controls.target.set(0, 0, 0);
      controls.enableDamping = true;
      controls.enablePan = false;
      controls.enableZoom = false;
      // 垂直旋转角度限制
      controls.minPolarAngle = 1.2;
      controls.maxPolarAngle = 1.8;
      // 水平旋转角度限制
      controls.minAzimuthAngle = -.6;
      controls.maxAzimuthAngle = .6;
      window.addEventListener('resize', onWindowResize, false);
      Animations.animateCamera(camera, controls, { x: 0, y: 0, z: 20 }, { x: 0, y: 0, z: 0 }, 3600, () => { });
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
      step += 0.01;
      animateLayer.position.x = 2.4 + Math.cos(step);
      animateLayer.position.y = .4 + Math.abs(Math.sin(step));
    }
  }

  render () {
    return (
      <div id="container"></div>
    )
  }
}