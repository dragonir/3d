import './index.styl';
import React from 'react';
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';
// import * as dat from 'dat.gui';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
// 官方的 UnrealBloomPass 有问题，会导致scene背景设置失效
import { UnrealBloomPass } from '@/containers/RickAndMorty/libs/UnrealBloompass.min.js';
import portalVertexShader from '@/containers/RickAndMorty/shaders/portal/vertex.glsl';
import portalFragmentShader from '@/containers/RickAndMorty/shaders/portal/fragment.glsl';

console.log(UnrealBloomPass)

export default class RickAndMorty extends React.Component {

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
      antialias: true,
      alpha: true
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(sizes.width, sizes.height);
    renderer.autoClear = false;
    renderer.setClearAlpha(0);
    renderer.physicallyCorrectLights = true;
    renderer.toneMapping = THREE.CineonToneMapping;
    renderer.toneMappingExposure = 2;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, .1, 10000);
    camera.position.set(0, 1, 5);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enablePan = false;
    // 最大仰角
    controls.minPolarAngle = .5;
    controls.maxPolarAngle = 2.5;
    // 水平旋转角度限制
    controls.minAzimuthAngle = -1;
    controls.maxAzimuthAngle = 1;

    // 页面缩放事件监听
    window.addEventListener('resize', () => {
      sizes.width = window.innerWidth;
      sizes.height = window.innerHeight;
      // 更新渲染
      renderer.setSize(sizes.width, sizes.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      // 更新相机
      camera.aspect = sizes.width / sizes.height;
      camera.updateProjectionMatrix();
    });

    // 光照
    const light = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(light);

    const directionalLight = new THREE.DirectionalLight('#ffffff', 4);
    directionalLight.castShadow = true;
    directionalLight.shadow.camera.far = 15;
    directionalLight.shadow.mapSize.set(1024, 1024);
    directionalLight.shadow.normalBias = 0.05;
    directionalLight.position.set(.25, 3, -1.25);
    scene.add(directionalLight);

    // 设置后期效果
    const options = {
      exposure: 2.8,
      bloomStrength: 2.39,
      bloomThreshold: 0,
      bloomRadius: 0.38,
      color0: [1, 5, 1],
      color1: [2, 20, 2],
      color2: [44, 97, 15],
      color3: [14, 28, 5],
      color4: [255, 255, 255],
      color5: [74, 145, 0],
    };

    const textureLoader = new THREE.TextureLoader();
    // 创建网格
    const portalGeometry = new THREE.PlaneBufferGeometry(8, 8, 1, 1);
    const portalMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: {
          type: 'f',
          value: 0.0,
        },
        perlinnoise: {
          type: 't',
          value: textureLoader.load(require('@/containers/RickAndMorty/images/perlinnoise.png')),
        },
        sparknoise: {
          type: 't',
          value: textureLoader.load(require('@/containers/RickAndMorty/images/sparknoise.png')),
        },
        waterturbulence: {
          type: 't',
          value: textureLoader.load(require('@/containers/RickAndMorty/images/waterturbulence.png')),
        },
        noiseTex: {
          type: 't',
          value: textureLoader.load(require('@/containers/RickAndMorty/images/noise.png')),
        },
        color5: {
          value: new THREE.Vector3(...options.color5),
        },
        color4: {
          value: new THREE.Vector3(...options.color4),
        },
        color3: {
          value: new THREE.Vector3(...options.color3),
        },
        color2: {
          value: new THREE.Vector3(...options.color2),
        },
        color1: {
          value: new THREE.Vector3(...options.color1),
        },
        color0: {
          value: new THREE.Vector3(...options.color0),
        },
        resolution: {
          value: new THREE.Vector2(sizes.width, sizes.height)
        }
      },
      fragmentShader: portalFragmentShader,
      vertexShader: portalVertexShader
    });
    const portal = new THREE.Mesh(portalGeometry, portalMaterial);
    portal.layers.set(1);
    scene.add(portal);

    // 更新材质
    const updateShaderMaterial = deltaTime => {
      portalMaterial.uniforms.time.value = deltaTime / 5000;
      portalMaterial.uniforms.color5.value = new THREE.Vector3(...options.color5);
      portalMaterial.uniforms.color4.value = new THREE.Vector3(...options.color4);
      portalMaterial.uniforms.color3.value = new THREE.Vector3(...options.color3);
      portalMaterial.uniforms.color2.value = new THREE.Vector3(...options.color2);
      portalMaterial.uniforms.color1.value = new THREE.Vector3(...options.color1);
      portalMaterial.uniforms.color0.value = new THREE.Vector3(...options.color0);
    }

    // 辉光效果
    const renderScene = new RenderPass(scene, camera);
    const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, .4, .85);
    bloomPass.threshold = options.bloomThreshold;
    bloomPass.strength = options.bloomStrength;
    bloomPass.radius = options.bloomRadius;
    const bloomComposer = new EffectComposer(renderer);
    bloomComposer.renderToScreen = true;
    bloomComposer.addPass(renderScene);
    bloomComposer.addPass(bloomPass);

    // dat.gui
    // const gui = new dat.GUI();
    // const bloom = gui.addFolder('bloom');
    // bloom.add(options, 'bloomStrength', 0.0, 5.0).name('bloomStrength').listen();
    // bloom.add(options, 'bloomRadius', .1, 2.0).name('bloomRadius').listen();
    // bloom.open();
    // const colors = gui.addFolder('Colors');
    // colors.addColor(options, 'color0').name('layer0');
    // colors.addColor(options, 'color1').name('layer1');
    // colors.addColor(options, 'color2').name('layer2');
    // colors.addColor(options, 'color3').name('layer3');
    // colors.addColor(options, 'color4').name('layer4');
    // colors.addColor(options, 'color5').name('layer5');
    // colors.open();
    // gui.hide();

    const loadingManager = new THREE.LoadingManager();
    loadingManager.onProgress = async(url, loaded, total) => {};

    // 使用 dracoLoader 加载用blender压缩过的模型
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('libs/draco/');
    dracoLoader.setDecoderConfig({ type: 'js' });
    const loader = new GLTFLoader(loadingManager);
    loader.setDRACOLoader(dracoLoader);

    // 模型加载
    let model = null;
    loader.load(require('@/containers/RickAndMorty/models/rickAndMorty.glb'), mesh => {
      if (mesh.scene) {
        mesh.scene.scale.set(.02, .02, .02);
        mesh.scene.position.x = -.5;
        mesh.scene.rotation.y = Math.PI;
        mesh.scene.layers.set(0);
        scene.add(mesh.scene);
        model = mesh.scene;
      }
    });

    const clock = new THREE.Clock();
    const tick = deltaTime => {

      updateShaderMaterial(deltaTime);
      renderer.clear();
      camera.layers.set(1);
      bloomComposer.render();

      renderer.clearDepth();
      camera.layers.set(0);
      renderer.render(scene, camera);

      const elapsedTime = clock.getElapsedTime()
      const ghost1Angle = elapsedTime * 0.5
      if (model) {
        model.rotation.x = Math.cos(ghost1Angle) * .2
        model.rotation.z = Math.sin(ghost1Angle) * .1
        model.position.z += Math.cos(ghost1Angle) * .005
      }

      const scale = Math.cos(ghost1Angle) * 2 + 3;
      portal && portal.scale.set(scale, scale, scale);

      // 页面重绘时调用自身
      controls && controls.update();
      TWEEN && TWEEN.update();
      window.requestAnimationFrame(tick);
    }
    tick();
  }

  render () {
    return (
      <div className='rick_and_morty_page'>
        <canvas className='webgl'></canvas>
        <i className="logo"></i>
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