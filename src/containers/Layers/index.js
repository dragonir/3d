/* eslint-disable */
import React from 'react';
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import layer_0 from './images/layer_0.png';
import layer_1 from './images/layer_1.png';
import layerImage from './images/layer_n.png';


// 画框、背景、人、灯笼、文字

export default class Earth extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.initThree()
  }

  initThree = () => {
    var container, controls, stats;
    var camera, scene, renderer, light, earth = null, earthMeshes = [];
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
      scene.background = new THREE.Color(0x2d2d2d);
      camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.set(0, 10, 20);
      camera.lookAt(new THREE.Vector3(0, 0, 0));

      const cubeGeometry = new THREE.BoxGeometry(0.001, 0.001, 0.001);
      const cubeMaterial = new THREE.MeshLambertMaterial({ color: 0xdc161a });
      const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
      cube.position.set(0, 0, 0,);
      light = new THREE.DirectionalLight(0xdddddd, 1);
      light.intensity = 1.2;
      light.position.set(-5, 8, 3);
      light.castShadow = true;
      light.target = cube;
      light.shadow.mapSize.width = 512 * 12;
      light.shadow.mapSize.height = 512 * 12;
      light.shadow.camera.top = 10;
      light.shadow.camera.bottom = - 5;
      light.shadow.camera.left = - 5;
      light.shadow.camera.right = 10;
      scene.add(light);

      var ambientLight = new THREE.AmbientLight(0xdddddd);
      scene.add(ambientLight);


      // 创建5个面
      const layers = [
        { position: { x :0, y: 0, z: 0 }, map:  new THREE.TextureLoader().load(layer_0) },
        { position: { x :0, y: 0, z: -2.5 }, map:  new THREE.TextureLoader().load(layer_1) },
        { position: { x :0, y: 0, z: -5 }, map:  new THREE.TextureLoader().load(layerImage) },
        { position: { x :0, y: 0, z: -7.5 }, map:  new THREE.TextureLoader().load(layerImage) },
        { position: { x :0, y: 0, z: -10 }, map:  new THREE.TextureLoader().load(layerImage) }
      ];

      const layerGroup = new THREE.Group();
      layers.map(layer => {
        let mesh = new THREE.Mesh(new THREE.PlaneGeometry(20, 12.5), new THREE.MeshBasicMaterial({
          map: layer.map,
          transparent: true
        }))
        mesh.position.set(layer.position.x, layer.position.y, layer.position.z);
        layerGroup.add(mesh);
      });
      scene.add(layerGroup);


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
      earth && (earth.rotation.y += 0.002)
      stats && stats.update();
      controls && controls.update();
    }
  }

  render () {
    return (
      <div id="container"></div>
    )
  }
}