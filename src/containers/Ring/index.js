import './index.styl';
import React from 'react';
import * as THREE from './libs/three.module.js';
import { Fire } from './libs/Fire.js';
import { TWEEN } from "three/examples/jsm/libs/tween.module.min.js";
import Animations from '../../assets/utils/animations';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Stats from 'three/examples/jsm/libs/stats.module';
import ringTexture from './images/ring.png';

export default class Ring extends React.Component {
  componentDidMount() {
    this.initThree()
  }

  initThree = () => {
    const container = document.getElementById('container');
    const renderer = new THREE.WebGLRenderer({ antialias: true,  alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);
    renderer.setClearAlpha(0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 100);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    const stats = new Stats();
    document.documentElement.appendChild(stats.dom);

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }, false);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    const ring = new Fire(new THREE.PlaneBufferGeometry(20, 25), {
      textureWidth: 800,
      textureHeight: 1000,
      debug:false
    })
    ring.setSourceMap(new THREE.TextureLoader().load(ringTexture));
    ring.color1 = new THREE.Color(0xdddddd);
    ring.color2 = new THREE.Color(0xffa000);
    ring.color3 = new THREE.Color(0x081919);
    ring.colorBias = .4;
    // 燃烧效果
    ring.burnRate = 10;
    // 模糊效果ring
    ring.diffuse = 1.2;
    ring.viscosity = .5;
    ring.expansion = -1;
    ring.swirl = 50;
    ring.drag = 0.35;
    ring.airSpeed = 20;
    ring.windX = 0;
		ring.windY = 0.1;
	  ring.speed = 120;
	  ring.massConservation = false;
    ring.position.y = 4;
    ring.position.z = -6;
    scene.add(ring)

    const controls = new OrbitControls(camera, renderer.domElement);
    Animations.animateCamera(camera, controls, { x: 0, y: 0, z: 22 }, { x: 0, y: 0, z: 0 }, 2400, () => {
      controls.enabled = false;
    });

    let step = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
      stats && stats.update();
      TWEEN && TWEEN.update();
      step += .03;
      ring && ( ring.position.y = Math.abs(1 + Math.sin(step)))
    }
    animate();
  }

  render () {
    return (
      <div className='ring_page' id="container"></div>
    )
  }
}