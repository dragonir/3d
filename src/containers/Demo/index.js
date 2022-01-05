import * as THREE from "three/build/three.module.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";

const Demo = () => {
  let scene, camera, renderer, composer;
  const params = {
    exposure: 0,
    bloomStrength: 1.5,
    bloomThreshold: 0,
    bloomRadius: 0,
  };
  const init = () => {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 100000);
    camera.position.set(50, 50, 50);
    camera.position.y = 50;
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    // 环境光
    const light = new THREE.AmbientLight(0xffffff, 0.6);
    light.layers.enable(0);
    light.layers.enable(1);
    scene.add(light);
    // 控制器
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.update();
    scene.add(new THREE.AxesHelper(100));
    window.onresize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    };
  };
  const initComposer = () => {
    composer = new EffectComposer(renderer);
    const renderScene = new RenderPass(scene, camera);
    // 光晕
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      1.5,
      0.4,
      0.85
    );
    bloomPass.threshold = params.bloomThreshold;
    bloomPass.strength = params.bloomStrength;
    bloomPass.radius = params.bloomRadius;
    composer.addPass(renderScene);
    composer.addPass(bloomPass);
  };
  const main = () => {
    const geometry = new THREE.BoxGeometry(20, 20, 10);
    // 正常方块
    const normalMtl = new THREE.MeshLambertMaterial({
      color: 0xfffc00
    });
    const normalBox = new THREE.Mesh(geometry, normalMtl);
    normalBox.position.z = -5;
    normalBox.layers.set(0);
    scene.add(normalBox);
    // 发光方块
    const bloomMtl = new THREE.MeshLambertMaterial({
      color: 0x03c03c
    });
    const bloomBox = new THREE.Mesh(geometry, bloomMtl);
    bloomBox.position.z = 5;
    bloomBox.layers.set(1);
    scene.add(bloomBox);
  };
  const render = () => {
    renderer.autoClear = false;
    renderer.clear();
    camera.layers.set(1);
    composer.render();
    // 清除深度缓存
    renderer.clearDepth();
    camera.layers.set(0);
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  };
  init();
  initComposer();
  main();
  render();
}
export default Demo;
