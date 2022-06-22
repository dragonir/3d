import React from 'react';
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';
import Animations from '@/assets/utils/animations';
import Stats from "three/examples/jsm/libs/stats.module";

export default class Earth extends React.Component {
  constructor() {
    super();
    this.mixers = [];
  }

  state = {
    loadingProcess: 0,
    sceneReady: false
  }

  componentDidMount() {
    this.initThree();
  }

  componentWillUnmount() {
    this.setState = () => {
      return;
    }
  }

  initThree = () => {
    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight
    }

    const renderer = new THREE.WebGLRenderer({
      canvas: document.querySelector('canvas.webgl'),
      antialias: true
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(sizes.width, sizes.height);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, sizes.width / sizes.height, 1, 20000);
    camera.position.set(0, 600, 1600);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    const stats = new Stats();
    document.documentElement.appendChild(stats.dom);

    const manager = new THREE.LoadingManager();
    manager.onProgress = async(url, loaded, total) => {
      if (Math.floor(loaded / total * 100) === 100) {
        this.setState({ loadingProcess: Math.floor(loaded / total * 100) });
        Animations.animateCamera(camera, controls, { x: 0, y: 40, z: 140 }, { x: 0, y: 0, z: 0 }, 4000, () => {
          this.setState({ sceneReady: true });
        });
      } else {
        this.setState({ loadingProcess: Math.floor(loaded / total * 100) });
      }
    };

    const animate = () => {
      requestAnimationFrame(animate);
      stats && stats.update();
      controls && controls.update();
      TWEEN && TWEEN.update();
      renderer.render(scene, camera);
    }
    animate();
  }

  render () {
    return (
      <div className='demo'>
        <canvas className='webgl'></canvas>
        {this.state.loadingProcess === 100 ? '' : (
          <div className='loading'>
            <span className='progress'>{this.state.loadingProcess} %</span>
          </div>
        )}
        <a className='github' href='https://github.com/dragonir/3d' target='_blank' rel='noreferrer'>
          <svg height='36' aria-hidden='true' viewBox='0 0 16 16' version='1.1' width='36' data-view-component='true'>
            <path fill='#FFFFFF' fillRule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
          </svg>
          <span className='author'>@dragonir</span>
        </a>
      </div>
    )
  }
}