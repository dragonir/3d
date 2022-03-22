import './index.styl';
import React from 'react';
import * as THREE from "three";
import gradientImage from './images/5.jpg';
import gsap from 'gsap';

export default class Scroll extends React.Component {
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
      alpha: true
    });
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    const scene = new THREE.Scene();

    // 光源
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 0)
    scene.add(directionalLight);

    // 相机
    // 相机组
    const cameraGroup = new THREE.Group();
    scene.add(cameraGroup);
    // 基础相机
    const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
    camera.position.set(0, 0, 6);
    cameraGroup.add(camera);

    // 缩放监听
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }, false);

    // 滚动监听
    let scrollY = window.scrollY;
    let currentSection = 0;
    window.addEventListener('scroll', () => {
      scrollY = window.scrollY;
      const newSection = Math.round(scrollY / sizes.height);
      if (newSection !== currentSection) {
        currentSection = newSection;
        gsap.to(sectionMeshes[currentSection].rotation, {
          duration: 1.5,
          ease: 'power2.inOut',
          x: '+=6',
          y: '+=3',
          z: '+=1.5'
        })
      }
    }, false);

    const ambientLight = new THREE.AmbientLight(0xdddddd);
    scene.add(ambientLight);

    // 贴图
    const textureLoader = new THREE.TextureLoader();
    const gradientTexture = textureLoader.load(gradientImage);
    gradientTexture.magFilter = THREE.NearestFilter;
    // 材质
    const material = new THREE.MeshToonMaterial({
      color: '#03c03c',
      gradientMap: gradientTexture
    });
    // 网格立方体
    const objectDistance = 4;
    const mesh1 = new THREE.Mesh(new THREE.TorusBufferGeometry(1, .4, 16, 60), material);
    const mesh2 = new THREE.Mesh(new THREE.OctahedronBufferGeometry(1.6), material);
    const mesh3 = new THREE.Mesh(new THREE.TorusKnotBufferGeometry(.8, .35, 100, 16), material);
    mesh1.position.x = 2;
    mesh2.position.x = -2;
    mesh3.position.x = 2;

    mesh1.position.y = - objectDistance * 0;
    mesh2.position.y = - objectDistance * 1;
    mesh3.position.y = - objectDistance * 2;

    scene.add(mesh1, mesh2, mesh3);
    const sectionMeshes = [mesh1, mesh2, mesh3];

    // 粒子
    const particlesCount = 200;
    const positions = new Float32Array(particlesCount * 3);
    for (let i=0; i<particlesCount; i++) {
      positions[i * 3 + 0] = (Math.random() - .5) * 10;
      positions[i * 3 + 1] = objectDistance * .5 - Math.random() * objectDistance * sectionMeshes.length;
      positions[i * 3 +2] = (Math.random() - .5) * 10;
    }
    const particlesGeometry = new THREE.BufferGeometry();
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particlesMaterial = new THREE.PointsMaterial({
      color: '#f5f5f5',
      sizeAttenuation: textureLoader,
      size: .03
    });
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    // 鼠标
    const cursor = {}
    cursor.x = 0
    cursor.y = 0
    // 鼠标移动监听
    window.addEventListener('mousemove', event => {
      cursor.x = event.clientX / sizes.width - .5;
      cursor.y = -(event.clientY / sizes.height - .5);
    });

    const clock = new THREE.Clock();
    let previousTime = 0;
    const animate = () => {
      const elapsedTime = clock.getElapsedTime();
      const deltaTime = elapsedTime - previousTime;
      previousTime = elapsedTime;
      // 相机动画
      camera.position.y = -scrollY / sizes.height * objectDistance;
      const parallaxX = cursor.x * .5;
      const parallaxY = cursor.y * .5;
      cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * 5 * deltaTime;
      cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * 5 * deltaTime;
      // 模型动画
      for (const mesh of sectionMeshes) {
        mesh.rotation.x += deltaTime * .1
        mesh.rotation.y += deltaTime * .12
      }
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }
    animate();
  }

  render () {
    return (
      <div id="scroll">
        <canvas className='webgl'></canvas>
        <section className='section'>
          <h1>HELLO Three.js</h1>
        </section>
        <section className='section'>
          <h2>My Projects</h2>
        </section>
        <section className='section'>
          <h1>Contact Me</h1>
        </section>
      </div>
    )
  }
}