import './index.styl';
import React from 'react';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Road from '@/containers/Car/scripts/road';
import Cybertruck from '@/containers/Car/scripts/cybertruck';
import licenseTexture from '@/containers/Car/images/license.png';
import grassTileTexture from '@/containers/Car/images/grass.jpg';
import roadTileTexture from '@/containers/Car/images/road.jpg';
import * as dat from 'dat.gui';

const THREE = global.THREE;

export default class Car extends React.Component {

  componentDidMount() {
    this.initThree()
  }

  initThree = () => {
    const textureLoader = new THREE.TextureLoader();
    let licensePlate = textureLoader.load(licenseTexture), grassTile = textureLoader.load(grassTileTexture), roadTile = textureLoader.load(roadTileTexture);
    const renderer = new THREE.WebGLRenderer({
      canvas: document.querySelector('canvas.webgl'),
      antialias: true,
      logarithmicDepthBuffer: false
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;

    const scene = new THREE.Scene();
    const fogColor = { h: 215, s: 80, l: 80 };
    scene.fog = new THREE.Fog(`hsl(${fogColor.h},${fogColor.s}%,${fogColor.l}%)`, 0.01, 272);
    renderer.setClearColor(scene.fog.color.getStyle());

    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(20, 10, 20);
    camera.lookAt(scene.position);

    let controls = new OrbitControls(camera,renderer.domElement);
    controls.enablePan = false;

    // 路
    const road = new Road(grassTile, roadTile);

    // 车
    const cybertruck = new Cybertruck(licensePlate);
    cybertruck.mesh.name = "Cybertruck";
    cybertruck.mesh.position.y = cybertruck.height / 2;

    // 环境光
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    // 点光源
    const daylight = new THREE.PointLight(0xffffff, ambientLight.intensity * 2);
    daylight.position.set(0, 64, 0);
    daylight.castShadow = true;
    scene.add(daylight);

    window.addEventListener('load', () => {
      scene.add(road.mesh);
      scene.add(cybertruck.mesh);
    }, false);

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }, false);

    controls = {
      daylight: ambientLight.intensity,
      speed: cybertruck.speed,
      resetCam: () => {
        controls.reset();
      }
    };

    const gui = new dat.GUI();
    document.querySelector('.cybertruck').appendChild(gui.domElement)
    gui.add(controls, 'daylight', 0.1, 1, 0.01).name('Daylight').onChange(e => {
      let newVal = controls.daylight;
      cybertruck.headlight.intensity = (1 - newVal) * 2;
      cybertruck.rearlight.intensity = (1 - newVal) * 2;
      ambientLight.intensity = newVal;
      daylight.intensity = newVal * 2;
      let h = fogColor.h, s = fogColor.s, l = newVal * 100;
      fogColor.l = l * 0.8;
      let daylightColorStr = `hsl(${h},${s}%,${l.toFixed(0)}%)`, fogColorStr = `hsl(${h},${s}%,${(fogColor.l).toFixed(0)}%)`;
      daylight.color = new THREE.Color(daylightColorStr);
      renderer.setClearColor(fogColorStr);
      scene.fog.color.set(fogColorStr);
    });
    gui.add(controls, 'speed', 0, 60, 1).name('Speed (MPH)').onChange(e => {
      cybertruck.speed = controls.speed;
    });
    gui.add(controls, 'resetCam').name('Reset Camera');
    const tick = () => {
      if (scene.getObjectByName(cybertruck.mesh.name)) {
        cybertruck.move();
        if (cybertruck.mesh.position.z > road.tileSize)
          cybertruck.mesh.position.z -= road.tileSize;
        let cybertruckZ = cybertruck.mesh.position.z;
        daylight.position.z = cybertruckZ;
        scene.position.z = -cybertruckZ;
      }
      renderer.render(scene, camera);
      requestAnimationFrame(tick);
    }
    tick();
  }

  render() {
    return (
      <div className='cybertruck'>
        <canvas className='webgl'></canvas>
      </div>
    )
  }
}