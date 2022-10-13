import './index.styl';
import React from 'react';
import * as THREE from "three";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import astronautModel from '@/containers/Gravity/models/astronaut.glb';
import texture from '@/containers/Gravity/images/particle.png';

if (window.location.hash.split('/')[1] === 'gravity') {
  (function (e, t) { var i = document, n = window; var l = i.documentElement; var r, a; var d, o = document.createElement("style"); var s; function m() { var i = l.getBoundingClientRect().width; if (!t) { t = 540 } if (i > t) { i = t } var n = i * 100 / e; o.innerHTML = "html{font-size:" + n + "px;}" } r = i.querySelector('meta[name="viewport"]'); a = "width=device-width,initial-scale=1,maximum-scale=1.0,user-scalable=no,viewport-fit=cover"; if (r) { r.setAttribute("content", a) } else { r = i.createElement("meta"); r.setAttribute("name", "viewport"); r.setAttribute("content", a); if (l.firstElementChild) { l.firstElementChild.appendChild(r) } else { var c = i.createElement("div"); c.appendChild(r); i.write(c.innerHTML); c = null } } m(); if (l.firstElementChild) { l.firstElementChild.appendChild(o) } else { var c = i.createElement("div"); c.appendChild(o); i.write(c.innerHTML); c = null } n.addEventListener("resize", function () { clearTimeout(s); s = setTimeout(m, 300) }, false); n.addEventListener("pageshow", function (e) { if (e.persisted) { clearTimeout(s); s = setTimeout(m, 300) } }, false); if (i.readyState === "complete") { i.body.style.fontSize = "16px" } else { i.addEventListener("DOMContentLoaded", function (e) { i.body.style.fontSize = "16px" }, false) } })(750, 750);
}

export default class Gravity extends React.Component {

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
      antialias: true
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(sizes.width, sizes.height);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, .1, 1000);
    camera.position.z = 150
    camera.lookAt(new THREE.Vector3(0, 0, 0))
    scene.add(camera);

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

    const rand = (min, max) => min + Math.random() * (max - min);
    const P_COUNT = 1000;
    let astronaut = null, t = 0;
    // 雾化效果
    scene.fog = new THREE.FogExp2(0x000000, 0.005);
    // 初始化粒子系统
    const geom = new THREE.BufferGeometry();
    const material = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 10,
      alphaTest: .8,
      map: new THREE.TextureLoader().load(texture)
    });
    let veticsFloat32Array = []
    let veticsColors = []
    for (let p = 0; p < P_COUNT; p++) {
      veticsFloat32Array.push(
        rand(20, 30) * Math.cos(p),
        rand(20, 30) * Math.sin(p),
        rand(-1500, 0)
      );
      const randomColor = new THREE.Color(Math.random() * 0xffffff);
      veticsColors.push(randomColor.r, randomColor.g, randomColor.b);
    }
    const vertices = new THREE.Float32BufferAttribute(veticsFloat32Array, 3);
    const colors = new THREE.Float32BufferAttribute(veticsColors, 3);
    geom.attributes.position = vertices;
    geom.attributes.color = colors;
    const particleSystem = new THREE.Points(geom, material);
    scene.add(particleSystem);

    // 宇航员模型
    const loader = new GLTFLoader();
    loader.load(astronautModel, mesh => {
      astronaut = mesh.scene;
      astronaut.material = new THREE.MeshLambertMaterial();
      astronaut.scale.set(.0005, .0005, .0005);
      astronaut.position.z = -10;
      scene.add(astronaut);
    });

    // 设置光照
    let light = new THREE.PointLight(0xFFFFFF, 0.5);
    light.position.x = -50;
    light.position.y = -50;
    light.position.z = 75;
    scene.add(light);

    light = new THREE.PointLight(0xFFFFFF, 0.5);
    light.position.x = 50;
    light.position.y = 50;
    light.position.z = 75;
    scene.add(light);

    light = new THREE.PointLight(0xFFFFFF, 0.3);
    light.position.x = 25;
    light.position.y = 50;
    light.position.z = 200;
    scene.add(light);

    light = new THREE.AmbientLight(0xFFFFFF, 0.02);
    scene.add(light);

    function updateParticles() {
      particleSystem.position.x = 0.2 * Math.cos(t);
      particleSystem.position.y = 0.2 * Math.cos(t);
      particleSystem.rotation.z += 0.015;
      camera.lookAt(particleSystem.position);

      for (let i=0; i<veticsFloat32Array.length; i++) {
        if ((i+1) % 3 === 0) {
          const dist = veticsFloat32Array[i] -camera.position.z;
          if (dist >= 0) veticsFloat32Array[i] = rand(-1000, -500);
          veticsFloat32Array[i] += 2.5;
          const _vertices = new THREE.Float32BufferAttribute(veticsFloat32Array, 3);
          geom.attributes.position = _vertices;
        }
      }

      particleSystem.geometry.verticesNeedUpdate = true;
    }

    function updateMeshes() {
      if (astronaut) {
        astronaut.position.z = 0.08 * Math.sin(t) + (camera.position.z - 0.2);
        astronaut.rotation.x += 0.015;
        astronaut.rotation.y += 0.015;
        astronaut.rotation.z += 0.01;
      }
    }

    function updateRendererDim() {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const needResize = canvas.width !== width || canvas.height !== height;
      if (needResize) {
        renderer.setSize(width, height, false);
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
      }
    }

    function tick() {
      updateParticles();
      updateMeshes();
      updateRendererDim();
      renderer.render(scene, camera);
      requestAnimationFrame(tick);
      t += 0.01;
    }
    tick();

    window.addEventListener('mousemove', e => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const dx = -1 * ((cx - e.clientX) / cx);
      const dy = -1 * ((cy - e.clientY) / cy);
      camera.position.x = dx * 5;
      camera.position.y = dy * 5;
      astronaut.position.x = dx * 5;
      astronaut.position.y = dy * 5;
    });
  }

  render () {
    return (
      <div className='gravrity_page'>
        <canvas className='webgl'></canvas>
        <div className="title-zone">
          <h1 className="title">GRAVITY</h1>
          <h2 className="subtitle">迷失太空</h2>
        </div>
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