import '@/containers/Human/index.styl';
import React from 'react';
import Stats from "three/examples/jsm/libs/stats.module";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import './libs/CTMLoader';
import headModal from './models/Head_02.ctm';
import mapTexture from './images/Head_02_Diffuse_2k.jpg';
import bumpMapTexture from './images/Head_02_Bump_2k.jpg';
import normalMapTexture from './images/Head_02_Gloss_2k.jpg';
import eyeModel from './models/EyeRight.ctm';
import eyeMapTexture from './images/Eye_Blue2_1k.jpg';
import eyeBumpMapTexture from './images/Eye_Bump2_1k.jpg';

const THREE = window.THREE;

export default class Human extends React.Component {

  componentDidMount() {
    this.initThree()
  }

  initThree = () => {
    const stats = new Stats();
    // document.documentElement.appendChild(stats.dom);

    var frustumSize = 96, meshes = [];
    const renderer = new THREE.WebGLRenderer({
      canvas: document.querySelector('canvas.webgl'),
      antialias: true
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(window.innerWidth, window.innerHeight);

    renderer.physicallyCorrectLights = true;
    renderer.toneMapping = THREE.LinearToneMapping;
    renderer.toneMappingExposure = 2;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    let aspect = window.innerWidth / window.innerHeight;
    const camera = new THREE.OrthographicCamera(-frustumSize * aspect, frustumSize * aspect, frustumSize, -frustumSize, 1, 1000);
    camera.position.set(0, 0, 600);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    const directionalLight = new THREE.DirectionalLight('#ffffff', 2)
    directionalLight.castShadow = true
    directionalLight.shadow.camera.far = 15
    directionalLight.shadow.mapSize.set(1024, 1024)
    directionalLight.shadow.normalBias = 0.05
    directionalLight.position.set(.25, 0, -.2)
    scene.add(directionalLight)

    // 环境光
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    const headGroup = new THREE.Group();
    // 头部模型
    const ctmLoader = new THREE.CTMLoader();
    ctmLoader.load(headModal, geometry => {
      //创建纹理
      let mesh = new THREE.Mesh(geometry,  new THREE.MeshStandardMaterial ({
        map: new THREE.TextureLoader().load(mapTexture),
        bumpMap: new THREE.TextureLoader().load(bumpMapTexture),
        bumpScale: 1.2,
        roughnessMap: new THREE.TextureLoader().load(normalMapTexture),
        roughness: 2
      }));
      console.log(mesh)
      mesh.rotation.set(0, -Math.PI, 0)
      mesh.scale.set(66, 66, 66);
      mesh.position.set(-40, -200, 0);
      headGroup.add(mesh);
    });

    // 眼睛
    ctmLoader.load(eyeModel, geometry => {
      //创建纹理
      let rightEye = new THREE.Mesh(geometry, new THREE.MeshPhysicalMaterial({
        map: new THREE.TextureLoader().load(eyeMapTexture),
        bumpMap: new THREE.TextureLoader().load(eyeBumpMapTexture),
        bumpScale: 2,
        roughness: .1,
        metalness: .1
      }));
      rightEye.rotation.set(0, -Math.PI, 0)
      rightEye.scale.set(66, 66, 66);
      rightEye.position.set(4, -202, -1.2);
      headGroup.add(rightEye);
      meshes.push(rightEye);

      let leftEye = rightEye.clone();
      rightEye.position.set(-42, -202, -1.2);
      headGroup.add(leftEye);
      scene.add(headGroup);
    });

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0, 0);
    // 开启缓动动画
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.enableZoom = false;
    // 最大仰角
    controls.minPolarAngle = 1.36;
    controls.maxPolarAngle = 1.5;
    window.addEventListener('resize', () => {
      let aspect = window.innerWidth / window.innerHeight;
      camera.left = -frustumSize * aspect;
      camera.right = frustumSize * aspect;
      camera.top = frustumSize;
      camera.bottom = -frustumSize;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }, false);

    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
      stats && stats.update();
      controls && controls.update();
    }
    animate();
  }

  render () {
    return (
      <div className='human_page'>
        <canvas className='webgl'></canvas>
      </div>
    )
  }
}