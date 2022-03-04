import React from 'react';
import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
import './index.styl';

export default class Earth extends React.Component {

  componentDidMount() {
    this.initThree()
  }

  initThree = () => {
    var canvas, stats, camera, scene, renderer, mouseX = 0, mouseY = 0;
    const group = new THREE.Group(), textMesh = new THREE.Mesh(), nearDist = 0.1, farDist = 10000;
    init();
    animate();
    function init() {
      canvas = document.getElementById('canvas');
      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
      renderer.setSize(window.innerWidth, window.innerHeight);
      canvas.appendChild(renderer.domElement);

      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, nearDist, farDist);
      camera.position.set(-2 * farDist, 0, 500);

      window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      }, false);

      // BufferAttribute 允许更有效地将数据传递到 GPU
      const octahedronGeometry = new THREE.OctahedronBufferGeometry(80);
      const material = new THREE.MeshNormalMaterial();
      for (let i = 0; i < 100; i++) {
        const mesh = new THREE.Mesh(octahedronGeometry, material);
        const dist = farDist / 3;
        const distDouble = dist * 2;
        const tau = 2 * Math.PI; // One turn
        mesh.position.x = Math.random() * distDouble - dist;
        mesh.position.y = Math.random() * distDouble - dist;
        mesh.position.z = Math.random() * distDouble - dist;
        mesh.rotation.x = Math.random() * tau;
        mesh.rotation.y = Math.random() * tau;
        mesh.rotation.z = Math.random() * tau;
        // 手动控制何时重新计算 3D 变换以获得更好的性能
        mesh.matrixAutoUpdate = false;
        mesh.updateMatrix();
        group.add(mesh);
      }

      const torusGeometry = new THREE.TorusBufferGeometry(40, 26, 16, 40)
      for (let i=0; i < 100; i++) {
        const mesh = new THREE.Mesh(torusGeometry, material);
        const dist = farDist / 3;
        const distDouble = dist * 2;
        mesh.position.x = Math.random() * distDouble - dist;
        mesh.position.y = Math.random() * distDouble - dist;
        mesh.position.z = Math.random() * distDouble - dist;
        mesh.rotation.x = Math.random() * 2 * Math.PI;
        mesh.rotation.y = Math.random() * 2 * Math.PI;
        mesh.rotation.z = Math.random() * 2 * Math.PI;
        mesh.matrixAutoUpdate = false;
        mesh.updateMatrix();
        group.add(mesh);
      }
      scene.add(group);

      const coneGeometry = new THREE.ConeBufferGeometry(40, 80, 80)
      for (let i=0; i < 100; i++) {
        const mesh = new THREE.Mesh(coneGeometry, material);
        const dist = farDist / 3;
        const distDouble = dist * 2;
        const tau = 2 * Math.PI;
        mesh.position.x = Math.random() * distDouble - dist;
        mesh.position.y = Math.random() * distDouble - dist;
        mesh.position.z = Math.random() * distDouble - dist;
        mesh.rotation.x = Math.random() * tau;
        mesh.rotation.y = Math.random() * tau;
        mesh.rotation.z = Math.random() * tau;
        mesh.matrixAutoUpdate = false;
        mesh.updateMatrix();
        group.add(mesh);
      }
      scene.add(group);

      // 字体
      const loader = new FontLoader();
      loader.load('./fonts/helvetiker_regular.typeface.json', font => {
        textMesh.geometry = new TextGeometry('@dragonir\nfantastic\nthree.js\nart', {
          font: font,
          size: 120,
          height: 120 / 2,
          curveSegments: 12,
          bevelEnabled: true,
          bevelThickness: 10,
          bevelSize: 6,
          bevelOffset: 1,
          bevelSegments: 8
        });
        textMesh.material = material;
        textMesh.position.x = 120 * -2;
        textMesh.position.z = 120 * -1;
        scene.add(textMesh);
      });
    }

    const mouseFX = {
      windowHalfX: window.innerWidth / 2,
      windowHalfY: window.innerHeight / 2,
      coordinates: (coordX, coordY) => {
        mouseX = (coordX - mouseFX.windowHalfX) * 10;
        mouseY = (coordY - mouseFX.windowHalfY) * 10;
      },
      onMouseMove: e => { mouseFX.coordinates(e.clientX, e.clientY) },
      onTouchMove: e => { mouseFX.coordinates(e.changedTouches[0].clientX, e.changedTouches[0].clientY)}
    };
    document.addEventListener('mousemove', mouseFX.onMouseMove, false);
    document.addEventListener('touchmove', mouseFX.onTouchMove, false);

    function animate() {
      requestAnimationFrame(animate);
      camera.position.x += (mouseX - camera.position.x) * 0.05;
      camera.position.y += (mouseY * -1 - camera.position.y) * 0.05;
      // 旋转世界空间中的每一个网格
      camera.lookAt(scene.position);
      const t = Date.now() * 0.001;
      const rx = Math.sin(t * 0.7) * 0.5;
      const ry = Math.sin(t * 0.3) * 0.5;
      const rz = Math.sin(t * 0.2) * 0.5;
      group.rotation.x = rx;
      group.rotation.y = ry;
      group.rotation.z = rz;
      textMesh.rotation.x = rx;
      textMesh.rotation.y = ry;
      textMesh.rotation.z = rx;
      renderer.render(scene, camera);
      stats && stats.update();
    }
  }
  render () {
    return (
      <div className='floating_page'>
        <div id="canvas"></div>
        <input className='color_pick' type="color" />
      </div>
    )
  }
}