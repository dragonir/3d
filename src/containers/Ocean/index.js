import '@/containers/Ocean/index.styl';
import React from 'react';
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Water } from 'three/examples/jsm/objects/Water';
import { Sky } from 'three/examples/jsm/objects/Sky';
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';
import { Lensflare, LensflareElement } from 'three/examples/jsm/objects/Lensflare.js';
import waterTexture from '@/containers/Ocean/images/waternormals.jpg';
import islandModel from '@/containers/Ocean/models/island.glb';
import flamingoModel from '@/containers/Ocean/models/flamingo.glb';
import Animations from '@/assets/utils/animations';
import vertexShader from '@/containers/Ocean/shaders/rainbow/vertex.glsl';
import fragmentShader from '@/containers/Ocean/shaders/rainbow/fragment.glsl';
import lensflareTexture0 from '@/containers/Ocean/images/lensflare0.png';
import lensflareTexture1 from '@/containers/Ocean/images/lensflare1.png';
// import Stats from "three/examples/jsm/libs/stats.module";

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
    const clock = new THREE.Clock();

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
    controls.target.set(0, 0, 0);
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.maxPolarAngle = 1.5;
    controls.minDistance = 50;
    controls.maxDistance = 1200;

    // const stats = new Stats();
    // document.documentElement.appendChild(stats.dom);

    const ambientLight = new THREE.AmbientLight(0xffffff, .8);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.color.setHSL(.1, 1, .95);
    dirLight.position.set(-1, 1.75, 1);
    dirLight.position.multiplyScalar(30);
    scene.add(dirLight);

    // 太阳点光源
    const pointLight = new THREE.PointLight(0xffffff, 1.2, 2000);
    pointLight.color.setHSL(.995, .5, .9);
    pointLight.position.set(0, 45, -2000);
    const textureLoader = new THREE.TextureLoader();
    const textureFlare0 = textureLoader.load(lensflareTexture0);
    const textureFlare1 = textureLoader.load(lensflareTexture1);
    // 镜头光晕
    const lensflare = new Lensflare();
    lensflare.addElement(new LensflareElement( textureFlare0, 600, 0, pointLight.color));
    lensflare.addElement(new LensflareElement( textureFlare1, 60, .6));
    lensflare.addElement(new LensflareElement( textureFlare1, 70, .7));
    lensflare.addElement(new LensflareElement( textureFlare1, 120, .9));
    lensflare.addElement(new LensflareElement( textureFlare1, 70, 1));
    pointLight.add(lensflare);
    scene.add(pointLight);

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }, false);

    // 海
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
    scene.add(sky);
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
        Animations.animateCamera(camera, controls, { x: 0, y: 40, z: 140 }, { x: 0, y: 0, z: 0 }, 4000, () => {
          this.setState({ sceneReady: true });
        });
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

    // 点
    const raycaster = new THREE.Raycaster()
    const points = [
      {
        position: new THREE.Vector3(10, 46, 0),
        element: document.querySelector('.point-0')
      },
      {
        position: new THREE.Vector3(-10, 8, 24),
        element: document.querySelector('.point-1')
      },
      {
        position: new THREE.Vector3(30, 10, 70),
        element: document.querySelector('.point-2')
      },
      {
        position: new THREE.Vector3(-100, 50, -300),
        element: document.querySelector('.point-3')
      },
      {
        position: new THREE.Vector3(-120, 50, -100),
        element: document.querySelector('.point-4')
      }
    ];

    document.querySelectorAll('.point').forEach(item => {
      item.addEventListener('click', event => {
        let className = event.target.classList[event.target.classList.length - 1];
        switch(className) {
          case 'label-0':
            Animations.animateCamera(camera, controls, { x: -15, y: 80, z: 60 }, { x: 0, y: 0, z: 0 }, 1600, () => {});
            break;
          case 'label-1':
            Animations.animateCamera(camera, controls, { x: -20, y: 10, z: 60 }, { x: 0, y: 0, z: 0 }, 1600, () => {});
            break;
          case 'label-2':
            Animations.animateCamera(camera, controls, { x: 30, y: 10, z: 100 }, { x: 0, y: 0, z: 0 }, 1600, () => {});
            break;
          default:
            Animations.animateCamera(camera, controls, { x: 0, y: 40, z: 140 }, { x: 0, y: 0, z: 0 }, 1600, () => {});
            break;
        }
      }, false);
    });

    const animate = () => {
      requestAnimationFrame(animate);
      water.material.uniforms[ 'time' ].value += 1.0 / 60.0;
      // stats && stats.update();
      controls && controls.update();
      const delta = clock.getDelta();
      this.mixers && this.mixers.forEach(item => {
        item.update(delta);
      });
      const timer = Date.now() * 0.0005;
      TWEEN && TWEEN.update();
      camera && (camera.position.y += Math.sin(timer) * .05);
      if (this.state.sceneReady) {
        // 遍历每个点
        for (const point of points) {
          // 获取2D屏幕位置
          const screenPosition = point.position.clone();
          screenPosition.project(camera);
          raycaster.setFromCamera(screenPosition, camera);
          const intersects = raycaster.intersectObjects(scene.children, true);
          if (intersects.length === 0) {
            // 未找到相交点，显示
            point.element.classList.add('visible');
          } else {
            // 找到相交点
            // 获取相交点的距离和点的距离
            const intersectionDistance = intersects[0].distance;
            const pointDistance = point.position.distanceTo(camera.position);
            // 相交点距离比点距离近，隐藏；相交点距离比点距离远，显示
            intersectionDistance < pointDistance ? point.element.classList.remove('visible') :  point.element.classList.add('visible');
          }
          const translateX = screenPosition.x * sizes.width * 0.5;
          const translateY = - screenPosition.y * sizes.height * 0.5;
          point.element.style.transform = `translateX(${translateX}px) translateY(${translateY}px)`;
        }
      }
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
        <div className="point point-0">
          <div className="label label-0">1</div>
          <div className="text">灯塔：矗立在海岸的岩石之上，白色的塔身以及红色的塔屋，在湛蓝色的天空和深蓝色大海的映衬下，显得如此醒目和美丽。</div>
        </div>
        <div className="point point-1">
          <div className="label label-1">2</div>
          <div className="text">小船：梦中又见那宁静的大海，我前进了，驶向远方，我知道我是船，只属于远方。这一天，我用奋斗作为白帆，要和明天一起飘扬，呼喊。</div>
        </div>
        <div className="point point-2">
          <div className="label label-2">3</div>
          <div className="text">沙滩：宇宙展开的一小角。不想说来这里是暗自疗伤，那过于矫情，只想对每一粒沙子，每一朵浪花问声你们好吗</div>
        </div>
        <div className="point point-3">
          <div className="label label-3">4</div>
          <div className="text">飞鸟：在苍茫的大海上，狂风卷集着乌云。在乌云和大海之间，海燕像黑色的闪电，在高傲地飞翔。</div>
        </div>
        <div className="point point-4">
          <div className="label label-4">5</div>
          <div className="text">礁石：寂寞又怎么样？礁石都不说话，但是水流过去之后，礁石留下。</div>
        </div>
      </div>
    )
  }
}