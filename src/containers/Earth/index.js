import React from 'react';
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Stats from "three/examples/jsm/libs/stats.module";
import earthModel from './models/earth.glb';

export default class Earth extends React.Component {
  componentDidMount() {
    this.initThree()
  }

  initThree = () => {
    const container = document.getElementById('container');
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xfffc00);
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 10, 20);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0, 0);
    controls.enableDamping = true;

    const stats = new Stats();
    document.documentElement.appendChild(stats.dom);

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }, false);

    const cubeGeometry = new THREE.BoxGeometry(0.001, 0.001, 0.001);
    const cubeMaterial = new THREE.MeshLambertMaterial({ color: 0xdc161a });
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.set(0, 0, 0,);
    const light = new THREE.DirectionalLight(0xdddddd, 1);
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

    const ambientLight = new THREE.AmbientLight(0xdddddd);
    scene.add(ambientLight);

    var earth = null, earthMeshes = [];
    const loader = new GLTFLoader();
    loader.load(earthModel, function (mesh) {
      mesh.scene.traverse(function (child) {
        if (child.isMesh) {
          earthMeshes.push(child)
          child.castShadow = true;
          child.receiveShadow = true;
          child.material.metalness = .2;
          child.material.roughness = .2;
        }
      });
      mesh.scene.position.set(0, -10, 0);
      mesh.scene.scale.set(.25, .25, .25);
      earth = mesh.scene;
      scene.add(earth);
    });

    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
      earth && (earth.rotation.y += 0.002)
      stats && stats.update();
      controls && controls.update();
    }
    animate();
  }

  render () {
    return (
      <div id="container"></div>
    )
  }
}