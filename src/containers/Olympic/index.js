/* eslint-disable */
import React from 'react';
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Stats from "three/examples/jsm/libs/stats.module";

export default class Olympic extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.initThree()
  }

  initThree = () => {
    var container, controls, stats;
    var camera, scene, renderer, light, earth = null, meshes = [];
    var fiveCyclesGroup = new THREE.Group();
    var mouseX = 0, mouseY = 0;
    var windowHalfX = window.innerWidth / 2;
    var windowHalfY = window.innerHeight / 2;
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

      var axes = new THREE.AxisHelper(30);
      scene.add(axes);

      // 性能工具
      stats = new Stats();
      document.documentElement.appendChild(stats.dom);

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

      // 创建五环
      const fiveCycles = [
        {
          key: 'cycle_0',
          color: 0x0885c2,
          position: { x: -250, y: 0, z: 0 }
        },
        {
          key: 'cycle_1',
          color: 0x000000,
          position: { x: -10, y: 0, z: 5 }
        },
        {
          key: 'cycle_2',
          color: 0xed334e,
          position: { x: 230, y: 0, z: 0 }
        },
        {
          key: 'cycle_3',
          color: 0xfbb132,
          position: { x: -125, y: -100, z: -5 }
        },
        {
          key: 'cycle_4',
          color: 0x1c8b3c,
          position: { x: 115, y: -100, z: 10 }
        }
      ];

      fiveCycles.map(item => {
        let cycleMesh = new THREE.Mesh(new THREE.TorusGeometry(100, 10, 10, 50), new THREE.MeshLambertMaterial({
          color: new THREE.Color(item.color),
          side: THREE.DoubleSide
        }));
        cycleMesh.position.set(item.position.x, item.position.y, item.position.z);
        meshes.push(cycleMesh);
        fiveCyclesGroup.add(cycleMesh);
      });
      fiveCyclesGroup.scale.set(.025, .025, .025)
      fiveCyclesGroup.position.set(0, 0, 0)
      scene.add(fiveCyclesGroup)

      controls = new OrbitControls(camera, renderer.domElement);
      controls.target.set(0, 0, 0);
      controls.enableDamping = true;
      window.addEventListener('resize', onWindowResize, false);
      // window.addEventListener('mousemove', onDocumentMouseMove, false);
    }

    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function onDocumentMouseMove( event ) {
      mouseX = event.clientX - windowHalfX;
      mouseY = event.clientY - windowHalfY;
    }

    function animate() {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
      stats && stats.update();
      controls && controls.update();

      // camera.position.x += (mouseX - camera.position.x) * 0.005;
      // camera.position.y += (-mouseY - camera.position.y) * 0.005;
      // camera.lookAt(scene.position);
    }
  }

  render () {
    return (
      <div id="container"></div>
    )
  }
}