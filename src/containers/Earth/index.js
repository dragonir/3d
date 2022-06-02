import React from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// import Stats from 'three/examples/jsm/libs/stats.module';

export default class Earth extends React.Component {
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
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.toneMapping = THREE.CineonToneMapping;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 10, 22);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    const earth = new THREE.Group();

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // const stats = new Stats();
    // document.documentElement.appendChild(stats.dom);

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }, false);

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.intensity = 1.2;
    light.position.set(-10, 10, 5);
    light.castShadow = true;
    light.target = earth;
    light.shadow.mapSize.width = 512;
    light.shadow.mapSize.height = 512;
    light.shadow.camera.top = 10;
    light.shadow.camera.bottom = - 5;
    light.shadow.camera.left = - 5;
    light.shadow.camera.right = 10;
    scene.add(light);

    const ambientLight = new THREE.AmbientLight(0xffffff, .8);
    scene.add(ambientLight);

    const textLoader = new THREE.TextureLoader();
    const planet = new THREE.Mesh(new THREE.SphereGeometry(10, 64, 64), new THREE.MeshStandardMaterial({
      map: textLoader.load(require('@/containers/Earth/images/earth_basic.png')),
      normalMap: textLoader.load(require('@/containers/Earth/images/earth_normal.png')),
      roughnessMap: textLoader.load(require('@/containers/Earth/images/earth_rough.png')),
      normalScale: new THREE.Vector2(10, 10),
      metalness: .1
    }));
    planet.rotation.y = -Math.PI;
    const atmosphere = new THREE.Mesh(new THREE.SphereGeometry(10.6, 64, 64), new THREE.MeshLambertMaterial({
      alphaMap: textLoader.load(require('@/containers/Earth/images/clouds.png')),
      transparent: true,
      opacity: .4,
      depthTest: true
    }))
    console.log(atmosphere)
    earth.add(planet);
    earth.add(atmosphere);
    scene.add(earth);

    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
      earth && (earth.rotation.y += 0.001)
      atmosphere && (atmosphere.rotation.y += 0.002)
      atmosphere && (atmosphere.rotation.x += 0.001)
      // stats && stats.update();
      controls && controls.update();
    }
    animate();
  }

  render () {
    return (
      <canvas className='webgl'></canvas>
    )
  }
}