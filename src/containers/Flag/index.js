import './index.styl';
import React from 'react';
import { WebGLRenderer, Scene, PerspectiveCamera, PlaneBufferGeometry, BufferAttribute, TextureLoader, ShaderMaterial, DoubleSide, Vector2, Color, Mesh, Clock } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui';
import vertexShader from './shader/vertex.glsl';
import fragmentShader from './shader/fragment.glsl';
import flagTexture from './images/flag.png';

export default class Earth extends React.Component {

  componentDidMount() {
    this.initThree();
  }

  initThree = () => {
    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight
    }

    // 初始化渲染器
    const canvas = document.querySelector('canvas.webgl');
    const renderer = new WebGLRenderer({ canvas: canvas });
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // 初始化场景
    const scene = new Scene();

    // 初始化相机
    const camera = new PerspectiveCamera(75, sizes.width / sizes.height, .1, 100);
    camera.position.set(.15, 0, .65);
    scene.add(camera);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

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

    // 几何体
    const geometry = new PlaneBufferGeometry(1, 1, 32, 32);
    const count = geometry.attributes.position.count;
    const randoms = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      randoms[i] = Math.random();
    }
    geometry.setAttribute('aRandom', new BufferAttribute(randoms, 1));
    const textureLoader = new TextureLoader();

    // 着色器材质 ShaderMaterial
    const material = new ShaderMaterial({
      side: DoubleSide,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      uniforms: {
        uFrequency: { value: new Vector2(10, 5) },
        uTime: { value: 0 },
        uColor: { value: new Color('orange') },
        uTexture: { value: textureLoader.load(flagTexture) }
      }
    });

    // 创建网格
    const mesh = new Mesh(geometry, material);
    mesh.scale.y = 2 / 3;
    scene.add(mesh);

    const gui = new dat.GUI();
    gui.add(material.uniforms.uFrequency.value, 'x').min(0).max(20).step(.01).name('frequencyX');
    gui.add(material.uniforms.uFrequency.value, 'y').min(0).max(20).step(.01).name('frequencyY');

    // 动画
    const clock = new Clock();
    const tick = () => {
      const elapsedTime = clock.getElapsedTime();
      // 更新材质
      material.uniforms.uTime.value = elapsedTime;
      // 更新控制器
      controls.update();
      // 更新渲染器
      renderer.render(scene, camera);
      // 重绘动画调用
      window.requestAnimationFrame(tick);
    }
    tick();
  }

  render () {
    return (
      <div className='flag_page'>
        <canvas className='webgl'></canvas>
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