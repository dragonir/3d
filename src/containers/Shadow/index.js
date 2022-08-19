import './index.styl';
import React from 'react';
import { Clock, Scene, LoadingManager, WebGLRenderer, sRGBEncoding, Group, PerspectiveCamera, DirectionalLight, PointLight, MeshPhongMaterial } from 'three';
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import Stats from "three/examples/jsm/libs/stats.module";

export default class Earth extends React.Component {

  constructor () {
    super();
    this.secondContainer = false;
  }

  componentDidMount() {
    this.initThree();
    this.handleMenu();
  }

  componentWillUnmount() {
    this.setState = () => {
      return;
    }
  }

  initThree = () => {
    // webgl加载容器
    const container = document.getElementById('canvas-container');
    const containerDetails = document.getElementById('canvas-container-details');

    // 通用变量
    let oldMaterial;
    let width = container.clientWidth;
    let height = container.clientHeight;

    // 创建场景
    const scene = new Scene();

    // 渲染配置
    const renderer = new WebGLRenderer({
      canvas: document.querySelector('#canvas-container'),
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    });
    renderer.autoClear = true;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1));
    renderer.setSize(width, height);
    renderer.outputEncoding = sRGBEncoding;

    const renderer2 = new WebGLRenderer({
      canvas: document.querySelector('#canvas-container-details'),
      antialias: false
    });
    renderer2.setPixelRatio(Math.min(window.devicePixelRatio, 1));
    renderer2.setSize(width, height);
    renderer2.outputEncoding = sRGBEncoding;

    // 相机配置
    const cameraGroup = new Group();
    scene.add(cameraGroup);

    const camera = new PerspectiveCamera(35, width / height, 1, 100);
    camera.position.set(19, 1.54, -0.1);
    cameraGroup.add(camera);

    const camera2 = new PerspectiveCamera(35, containerDetails.clientWidth / containerDetails.clientHeight, 1, 100);
    camera2.position.set(3.2, 2.8, 3.2);
    camera2.rotation.set(0, 1, 0);
    scene.add(camera2);

    const stats = new Stats();
    document.documentElement.appendChild(stats.dom);

    // 页面缩放事件监听
    window.addEventListener('resize', () => {
      camera.aspect = container.clientWidth / container.clientHeight
      camera.updateProjectionMatrix();

      camera2.aspect = containerDetails.clientWidth / containerDetails.clientHeight;
      camera2.updateProjectionMatrix();

      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer2.setSize(containerDetails.clientWidth, containerDetails.clientHeight);

      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1));
      renderer2.setPixelRatio(Math.min(window.devicePixelRatio, 1));
    });

    // 直射光
    const sunLight = new DirectionalLight(0x435c72, 0.08);
    sunLight.position.set(-100, 0, -100);
    scene.add(sunLight);
    // 点光源
    const fillLight = new PointLight(0x88b2d9, 2.7, 4, 3);
    fillLight.position.set(30, 3, 1.8);
    scene.add(fillLight);

    // 加载管理
    const ftsLoader = document.querySelector('.lds-roller')
    const looadingCover = document.getElementById('loading-text-intro')
    const loadingManager = new LoadingManager()
    loadingManager.onLoad = function () {
      document.querySelector('.content').style.visibility = 'visible'
      // document.querySelector('body').style.overflow = 'hidden auto'
      const yPosition = { y: 0 }
      new TWEEN.Tween(yPosition).to({y: 100
        }, 900).easing(TWEEN.Easing.Quadratic.InOut).start()
        .onUpdate(function () {
          looadingCover.style.setProperty('transform', `translate( 0, ${yPosition.y}%)`)
        })
        .onComplete(function () {
          looadingCover.parentNode.removeChild(document.getElementById('loading-text-intro'));
          TWEEN.remove(this)
        })
      introAnimation()
      ftsLoader.parentNode.removeChild(ftsLoader)
      window.scroll(0, 0)
    }

    // 使用 dracoLoader 加载用blender压缩过的模型
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('libs/draco/');
    dracoLoader.setDecoderConfig({ type: 'js' });
    const loader = new GLTFLoader(loadingManager);
    loader.setDRACOLoader(dracoLoader);

    // 模型加载
    loader.load(require('@/containers/Shadow/models/kas.glb'), function (gltf) {
      gltf.scene.traverse((obj) => {
        if (obj.isMesh) {
          oldMaterial = obj.material;
          obj.material = new MeshPhongMaterial({
            shininess: 45
          })
        }
      })
      scene.add(gltf.scene);
      oldMaterial.dispose();
      renderer.renderLists.dispose();
    });

    // 使用Tween给相机添加入场动画
    function introAnimation() {
      new TWEEN.Tween(
        camera.position.set(0, 4, 2))
        .to({ x: 0, y: 2.4, z: 6.8 }, 3500)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .start()
        .onComplete(function () {
          TWEEN.remove(this)
          document.querySelector('.header').classList.add('ended')
          document.querySelector('.first>p').classList.add('ended')
        })
    }

    // 页面点击事件监听
    document.getElementById('aglaea').addEventListener('click', () => {
      document.getElementById('aglaea').classList.add('active')
      document.getElementById('euphre').classList.remove('active')
      document.getElementById('thalia').classList.remove('active')
      document.getElementById('content').innerHTML = 'She was venerated as the goddess of beauty, splendor, glory, magnificence, and adornment. She is the youngest of the Charites according to Hesiod. Aglaea is one of three daughters of Zeus and either the Oceanid Eurynome, or of Eunomia, the goddess of good order and lawful conduct.'
      animateCamera({ x: 3.2, y: 2.8, z: 3.2 }, { y: 1 });
    });

    document.getElementById('thalia').addEventListener('click', () => {
      document.getElementById('thalia').classList.add('active')
      document.getElementById('aglaea').classList.remove('active')
      document.getElementById('euphre').classList.remove('active')
      document.getElementById('content').innerHTML = 'Thalia, in Greek religion, one of the nine Muses, patron of comedy; also, according to the Greek poet Hesiod, a Grace (one of a group of goddesses of fertility). She is the mother of the Corybantes, celebrants of the Great Mother of the Gods, Cybele, the father being Apollo, a god related to music and dance. In her hands she carried the comic mask and the shepherd’s staff.'
      animateCamera({ x: -1.4, y: 2.8, z: 4.4 }, { y: -0.1 });
    });

    document.getElementById('euphre').addEventListener('click', () => {
      document.getElementById('euphre').classList.add('active')
      document.getElementById('aglaea').classList.remove('active')
      document.getElementById('thalia').classList.remove('active')
      document.getElementById('content').innerHTML = 'Euphrosyne is a Goddess of Good Cheer, Joy and Mirth. Her name is the female version of a Greek word euphrosynos, which means "merriment". The Greek poet Pindar states that these goddesses were created to fill the world with pleasant moments and good will. Usually the Charites attended the goddess of beauty Aphrodite.'
      animateCamera({ x: -4.8, y: 2.9, z: 3.2 }, { y: -0.75 });
    });

    // 相机动画
    function animateCamera(position, rotation) {
      new TWEEN.Tween(camera2.position)
        .to(position, 1800)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .start()
        .onComplete(function () {
          TWEEN.remove(this)
        })
      new TWEEN.Tween(camera2.rotation).to(rotation, 1800).easing(TWEEN.Easing.Quadratic.InOut).start()
        .onComplete(function () {
          TWEEN.remove(this)
        })
    }

    // 鼠标样式配置
    const cursor = {
      x: 0,
      y: 0
    }
    const clock = new Clock()
    let previousTime = 0

    // 页面重绘动画
    const rendeLoop = () => {
      TWEEN.update()
      if (this.secondContainer) {
        renderer2.render(scene, camera2)
      } else {
        renderer.render(scene, camera)
      }
      const elapsedTime = clock.getElapsedTime()
      const deltaTime = elapsedTime - previousTime
      previousTime = elapsedTime
      const parallaxY = cursor.y
      fillLight.position.y -= (parallaxY * 9 + fillLight.position.y - 2) * deltaTime
      const parallaxX = cursor.x
      fillLight.position.x += (parallaxX * 8 - fillLight.position.x) * 2 * deltaTime
      cameraGroup.position.z -= (parallaxY / 3 + cameraGroup.position.z) * 2 * deltaTime
      cameraGroup.position.x += (parallaxX / 3 - cameraGroup.position.x) * 2 * deltaTime
      stats && stats.update();
      requestAnimationFrame(rendeLoop);
    }
    rendeLoop();

    // 鼠标移动时获取相机位置
    document.addEventListener('mousemove', (event) => {
      event.preventDefault()
      cursor.x = event.clientX / window.innerWidth - 0.5
      cursor.y = event.clientY / window.innerHeight - 0.5
      handleCursor(event)
    }, false)

    const customCursor = document.querySelector('.cursor');
    const handleCursor = (e) => {
      const x = e.clientX
      const y = e.clientY
      customCursor.style.cssText = `left: ${x}px; top: ${y}px;`
    }

  }

  handleMenu = () => {
    const obCallback = payload => {
      if (payload[0].intersectionRatio > 0.05) {
        this.secondContainer = true
      } else {
        this.secondContainer = false
      }
    }
    // 基于容器视图禁用渲染器
    const ob = new IntersectionObserver(obCallback, { threshold: 0.05 });
    const watchedSection = document.querySelector('.second');
    ob.observe(watchedSection);
    const btn = document.querySelectorAll('nav > .a')
    function update(e) {
      const span = this.querySelector('span')
      if (e.type === 'mouseleave') {
        span.style.cssText = ''
      } else {
        const { offsetX: x, offsetY: y } = e, { offsetWidth: width, offsetHeight: height } = this,
        walk = 20, xWalk = (x / width) * (walk * 2) - walk, yWalk = (y / height) * (walk * 2) - walk
        span.style.cssText = `transform: translate(${xWalk}px, ${yWalk}px);`
      }
    }
    // 点击菜单
    btn.forEach(b => b.addEventListener('mousemove', update));
    btn.forEach(b => b.addEventListener('mouseleave', update));
  }

  render () {
    return (
      <div className='shadow_page'>
        <div className="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
          <div id="loading-text-intro"><p>Loading</p></div>
          <div className="content" style={{'visibility': 'hidden'}}>
            <nav className="header">
              <b className="active a"><span>首页</span></b>
              <b className="a"><span>关于</span></b>
              <b className="a"><span>作品</span></b>
              <b className="a"><span>我的</span></b>
              <b className="a"><span>了解更多</span></b>
              <div className="cursor"></div>
            </nav>
            <section className="first">
              <h2 className='name'>DRAGONIR</h2>
              <h1 className='title'>KING OF KINGS</h1>
              <p className='description'>My name is Ozymandies, king of kings. Look on my works, ye mighty, and despair. Nothing beside remains. Round the decay. Of that colossal wreck, boudless and bare. The lone and level sands stretch far away.</p>
            </section>
            <section className="section second">
              <div className="second-container">
                <ul>
                  <li id="aglaea" className="active">Aglaea</li>
                  <li id="thalia"><b>Thalia</b></li>
                  <li id="euphre">Euphre</li>
                </ul>
                <p id="content">She was venerated as the goddess of beauty, splendor, glory, magnificence, and adornment. She is the youngest of the Charites according to Hesiod. Aglaea is one of three daughters of Zeus and either the Oceanid Eurynome, or of Eunomia, the goddess of good order and lawful conduct.</p>
              </div>
              <canvas id='canvas-container-details' className='webgl'></canvas>
            </section>
            <section className="third">
              <h1>The Making</h1>
              <p>Canova's assistants roughly blocked out the marble, leaving Canova to perform the final carving and shape the stone to highlight the Graces soft flesh. This was a trademark of the artist, and the piece shows a strong allegiance to the Neo-Classical movement in sculpture, of which Canova is the prime exponent.<br/><br/> The three goddesses are shown nude, huddled together, their heads almost touching in what many have referred to as an erotically charged piece. They stand, leaning slightly inward — perhaps discussing a common issue, or simply enjoying their closeness. Their hair-styles are similar, braided atop their heads.</p>
            </section>
            <canvas id='canvas-container' className='webgl'></canvas>
            <h4 className="footer">Created by Anderson Mancini based on Tom Bogner Design. Free model credits</h4>
        </div>
        <a className='github' href='https://github.com/dragonir/3d' target='_blank' rel='noreferrer' title='dragonir'>
          <svg height='36' aria-hidden='true' viewBox='0 0 16 16' version='1.1' width='36' data-view-component='true'>
            <path fill='#FFFFFF' fillRule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
          </svg>
        </a>
      </div>
    )
  }
}