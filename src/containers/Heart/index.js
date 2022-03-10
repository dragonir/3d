import React from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import heartModal from './models/heart.glb';

export default class Heart extends React.Component {

  constructor(props) {
    super(props)
    this.renderer = null;
    this.scene = null;
    this.camera = null;
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.mouseX = 0;
    this.mouseY = 0;
    this.targetmouseX = 0;
    this.targetmouseY = 0;
  }

  componentDidMount() {
    this.initThree()
  }

  initThree = () => {
    const container = document.getElementById('container');
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    this.renderer = renderer;
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xDDDDDD);
    this.scene = scene;
    const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.001, 1000);
    camera.position.set(0, 0, 7);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    this.camera = camera;

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

    var ambientLight = new THREE.AmbientLight(0xdddddd);
    scene.add(ambientLight);

    const gltfLoader = new GLTFLoader();
    gltfLoader.load(heartModal, function (mesh) {
      // mesh.scene.traverse(function (child) {
      // });
      mesh.scene.position.set(0, 0, 0);
      mesh.scene.scale.set(1.2, 1.2, 1.2);
      scene.add(mesh.scene);
    });

    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    }
    animate();
  }

  render () {
    return (
      <div id="container"></div>
    )
  }
}