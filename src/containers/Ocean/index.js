import '@/containers/Ocean/index.styl';
import React from 'react';
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Water } from 'three/examples/jsm/objects/Water';
import { Sky } from 'three/examples/jsm/objects/Sky';
import { TWEEN } from "three/examples/jsm/libs/tween.module.min.js";
import waterTexture from '@/containers/Ocean/images/waternormals.jpg';
import islandModel from '@/containers/Ocean/models/island.glb';
import flamingoModel from '@/containers/Ocean/models/flamingo.glb';
import Animations from '@/assets/utils/animations';
import vertexShader from '@/containers/Ocean/shaders/rainbow/vertex.glsl'
import fragmentShader from '@/containers/Ocean/shaders/rainbow/fragment.glsl'
// import Stats from "three/examples/jsm/libs/stats.module";

export default class Earth extends React.Component {
  constructor() {
    super();
    this.mixers = [];
  }

  state = {
    loadingProcess: 0
  }

  componentDidMount() {
    this.initThree()
  }

  initThree = () => {
    const renderer = new THREE.WebGLRenderer({
      canvas: document.querySelector('canvas.webgl'),
      antialias: true
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 1, 20000);
    camera.position.set(0, 600, 1600);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0, 0);
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.enableZoom = false;
    controls.minPolarAngle = .5;
    controls.maxPolarAngle = 1.4;

    // const stats = new Stats();
    // document.documentElement.appendChild(stats.dom);

    const ambientLight = new THREE.AmbientLight(0xffffff, .8);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, .8);
    dirLight.color.setHSL(.1, 1, .95);
    dirLight.position.set(-1, 1.75, 1);
    dirLight.position.multiplyScalar(30);
    scene.add(dirLight);

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }, false);

    // 水
    const waterGeometry = new THREE.PlaneGeometry(10000, 10000);
		const water = new Water(waterGeometry, {
      textureWidth: 512,
      textureHeight: 512,
      waterNormals: new THREE.TextureLoader().load(waterTexture,  texture => {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      }),
      sunDirection: new THREE.Vector3(),
      sunColor: 0xffffff,
      waterColor: 0x0072ff,
      distortionScale: 4,
      fog: scene.fog !== undefined
    });
    water.rotation.x = - Math.PI / 2;
    scene.add(water);

    // 天空
    const sky = new Sky();
    sky.scale.setScalar(10000);
    scene.add( sky );
    const skyUniforms = sky.material.uniforms;
    skyUniforms['turbidity'].value = 20;
    skyUniforms['rayleigh'].value = 2;
    skyUniforms['mieCoefficient'].value = 0.005;
    skyUniforms['mieDirectionalG'].value = 0.8;

    // 太阳
    const sun = new THREE.Vector3();
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const phi = THREE.MathUtils.degToRad(88);
    const theta = THREE.MathUtils.degToRad(180);
    sun.setFromSphericalCoords( 1, phi, theta );
    sky.material.uniforms['sunPosition'].value.copy( sun );
    water.material.uniforms['sunDirection'].value.copy(sun).normalize();
    scene.environment = pmremGenerator.fromScene(sky).texture;

    const manager = new THREE.LoadingManager();
    manager.onProgress = async(url, loaded, total) => {
      if (Math.floor(loaded / total * 100) === 100) {
        this.setState({ loadingProcess: Math.floor(loaded / total * 100) });
        Animations.animateCamera(camera, controls, { x: 0, y: 40, z: 140 }, { x: 0, y: 0, z: 0 }, 4000, () => {});
      } else {
        this.setState({ loadingProcess: Math.floor(loaded / total * 100) });
      }
    };

    // 岛
    const loader = new GLTFLoader(manager);
    loader.load(islandModel, mesh => {
      mesh.scene.traverse(child => {
        if (child.isMesh) {
          child.material.metalness = .4;
          child.material.roughness = .6;
        }
      })
      mesh.scene.position.set(0, -2, 0);
      mesh.scene.scale.set(33, 33, 33);
      scene.add(mesh.scene);
    });

    // 鸟
    loader.load(flamingoModel, gltf => {
      const mesh = gltf.scene.children[0];
      mesh.scale.set(.35, .35, .35);
      mesh.position.set(-100, 80, -300);
      mesh.rotation.y = - 1;
      mesh.castShadow = true;
      scene.add(mesh);

      const bird2 = mesh.clone();
      bird2.position.set(150, 80, -500);
      scene.add(bird2);

      const mixer = new THREE.AnimationMixer(mesh);
      mixer.clipAction(gltf.animations[0]).setDuration(1.2).play();
      this.mixers.push(mixer);

      const mixer2 = new THREE.AnimationMixer(bird2);
      mixer2.clipAction(gltf.animations[0]).setDuration(1.8).play();
      this.mixers.push(mixer2);
    });

    // 虹
    const material = new THREE.ShaderMaterial({
      side: THREE.DoubleSide,
      transparent: true,
      uniforms: {},
      vertexShader: vertexShader,
      fragmentShader: fragmentShader
    });
    const geometry = new THREE.TorusGeometry(200, 10, 50, 100);
    const torus = new THREE.Mesh(geometry, material);
    torus.opacity = .1;
    torus.position.set(0, -50, -400);
    scene.add(torus);

    const clock = new THREE.Clock();
    const animate = () => {
      requestAnimationFrame(animate);
      water.material.uniforms[ 'time' ].value += 1.0 / 60.0;
      // stats && stats.update();
      controls && controls.update();
      const delta = clock.getDelta();
      this.mixers && this.mixers.map(item => {
        item.update(delta);
        return true;
      });
      const timer = Date.now() * 0.0005;
      TWEEN && TWEEN.update();
      camera && (camera.position.y += Math.sin(timer) * .05);
      renderer.render(scene, camera);
    }
    animate();
  }

  render () {
    return (
      <div className='ocean'>
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