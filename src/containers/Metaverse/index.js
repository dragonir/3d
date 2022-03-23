import './index.styl';
import React from 'react';
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import astronautModel from './models/astronaut.glb';
import CANNON from 'cannon';

export default class Metaverse extends React.Component {
  componentDidMount() {
    this.initThree();
  }

  initThree = () => {
    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight
    }

    const canvas = document.querySelector('canvas.webgl');
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true
    });
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMapSoft = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    const scene = new THREE.Scene();

    // 相机
    const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, .01, 100000)
    camera.position.set(1, 1, -1);
    camera.lookAt(scene.position);

    // mesh
    const geometry = new THREE.BoxBufferGeometry(.5, 1, .5);
    geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(0, .5, 0));
    const material = new THREE.MeshNormalMaterial({
      transparent: true,
      opacity: 0
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // 光源
    const light = new THREE.DirectionalLight(0xffffff, .5);
    light.position.set(0, 1, 0);
    light.castShadow = true;
    light.target = mesh;
    mesh.add(light);

    // 模型
    const loader = new GLTFLoader();
    loader.load(astronautModel, mesh => {
      mesh.scene.traverse(child => {
        if (child.isMesh) {
          child.castShadow = true;
          child.material.side = THREE.DoubleSide;
        }
      });
      let player = mesh.scene;
      player.position.set(0, -.1, 0);
      player.scale.set(.25, .25, .25);
      scene.add(mesh.scene);
    });

    // world
    const world = new CANNON.World();
    world.broadphase = new CANNON.SAPBroadphase(world);
    world.gravity.set(0, -10, 0);
    world.defaultContactMaterial.friction = 0;
    console.log(world)
    const groundMaterial = new CANNON.Material('groundMaterial');
    const wheelMaterial = new CANNON.Material('wheelMaterial');
    const wheelGroundContactMaterial = new CANNON.ContactMaterial(wheelMaterial, groundMaterial, {
      friction: 0,
      restitution: 0,
      contactEquationStiffness: 1000
    });
    world.addContactMaterial(wheelGroundContactMaterial);

    // 缩放监听
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }, false);

    const ambientLight = new THREE.AmbientLight(0xdddddd);
    scene.add(ambientLight);

    // const clock = new THREE.Clock();
    const animate = () => {
      // const elapsedTime = clock.getElapsedTime();
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }
    animate();
  }

  render () {
    return (
      <div id="metaverse">
        <canvas className='webgl'></canvas>
      </div>
    )
  }
}