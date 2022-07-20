import '@/containers/Earth/index.styl';
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
    const frustumSize = 96;
    const aspect = window.innerWidth / window.innerHeight;
    const camera = new THREE.OrthographicCamera(-frustumSize * aspect, frustumSize * aspect, frustumSize, -frustumSize, 1, 1000);
    camera.position.set(0, 20, 200);
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

    // 🌏
    const textLoader = new THREE.TextureLoader();
    const planet = new THREE.Mesh(new THREE.SphereGeometry(10, 64, 64), new THREE.MeshStandardMaterial({
      map: textLoader.load(require('@/containers/Earth/images/earth_basic.jpeg')),
      normalMap: textLoader.load(require('@/containers/Earth/images/earth_normal.jpeg')),
      roughnessMap: textLoader.load(require('@/containers/Earth/images/earth_rough.jpeg')),
      normalScale: new THREE.Vector2(10, 10),
      metalness: .1
    }));
    planet.rotation.y = -Math.PI;
    const atmosphere = new THREE.Mesh(new THREE.SphereGeometry(10.6, 64, 64), new THREE.MeshLambertMaterial({
      alphaMap: textLoader.load(require('@/containers/Earth/images/clouds.jpeg')),
      transparent: true,
      opacity: .4,
      depthTest: true
    }))
    earth.add(planet);
    earth.add(atmosphere);
    earth.scale.set(6, 6, 6)
    scene.add(earth);

    // 🌑
    const moon = new THREE.Mesh(new THREE.SphereGeometry(2, 32, 32), new THREE.MeshStandardMaterial({
      map: textLoader.load(require('@/containers/Earth/images/moon_basic.jpeg')),
      normalMap: textLoader.load(require('@/containers/Earth/images/moon_normal.jpeg')),
      roughnessMap: textLoader.load(require('@/containers/Earth/images/moon_roughness.jpeg')),
      normalScale: new THREE.Vector2(10, 10),
      metalness: .1
    }));
    moon.position.set(-120, 0, -120);
    moon.scale.set(6, 6, 6);
    scene.add(moon);

    const clock = new THREE.Clock();
    const animate = () => {
      const elapsedTime = clock.getElapsedTime()
      requestAnimationFrame(animate);
      earth && (earth.rotation.y += 0.002)
      atmosphere && (atmosphere.rotation.y += 0.004)
      atmosphere && (atmosphere.rotation.x += 0.002)
      // stats && stats.update();
      controls && controls.update();
      // 公转
      moon && (moon.position.x = Math.sin(elapsedTime * .5) * -120);
      moon && (moon.position.z = Math.cos(elapsedTime * .5) * -120);
      renderer.render(scene, camera);
    }
    animate();
  }

  render () {
    return (
      <div className='earth_page'>
        <canvas className='webgl'></canvas>
      </div>
    )
  }
}