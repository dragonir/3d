import './index.styl';
import React from 'react';
import * as THREE from './libs/three.module';
import { GLTFLoader } from './libs/GLTFLoader';
import { ModifierStack, Cloth } from './libs/modifier';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { CopyShader } from 'three/examples/jsm/shaders/CopyShader';
import { HorizontalTiltShiftShader } from 'three/examples/jsm/shaders/HorizontalTiltShiftShader';
import CANNON from 'cannon';
import CannonHelper from './scripts/CannonHelper';
import JoyStick from './scripts/JoyStick';
import { img2matrix, randnum } from './scripts/Utils';
import foxModel from './models/Fox.glb';
import heightMapImage from './images/Heightmap.png';
import flagTexture from './images/flag.png';
import snowflakeTexture from './images/snowflake.png';
import Stats from "three/examples/jsm/libs/stats.module";

export default class Metaverse extends React.Component {
  componentDidMount() {
    this.initThree();
  }

  initThree = () => {
    const stats = new Stats();
    document.documentElement.appendChild(stats.dom);

    const canvas = document.querySelector('canvas.webgl');
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      alpha: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMapSoft = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, .01, 100000);
    camera.position.set(1, 1, -1);
    camera.lookAt(scene.position);

    window.addEventListener('resize', () => {
      var width = window.innerWidth;
      var height = window.innerHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    }, false);

    const AmbientLigh = new THREE.AmbientLight(0xffffff, 1);
    scene.add(AmbientLigh)

    // cannon
    var fixedTimeStep = 1.0 / 60.0;
    var helper = new CannonHelper(scene);
    const world = new CANNON.World();
    world.broadphase = new CANNON.SAPBroadphase(world);
    world.gravity.set(0, -10, 0);
    world.defaultContactMaterial.friction = 0;
    const groundMaterial = new CANNON.Material("groundMaterial");
    const wheelMaterial = new CANNON.Material("wheelMaterial");
    const wheelGroundContactMaterial = new CANNON.ContactMaterial(wheelMaterial, groundMaterial, {
      friction: 0,
      restitution: 0,
      contactEquationStiffness: 1000
    });
    // 给世界添加contactMaterial
    world.addContactMaterial(wheelGroundContactMaterial);

    // 添加 front & back 光源
    var light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(1, 1, 1).normalize();
    scene.add(light);

    // 后期特效
    var SCALE = 2;
    var hTilt = new ShaderPass(HorizontalTiltShiftShader);
    hTilt.enabled = false;
    hTilt.uniforms.h.value = 4 / (SCALE * window.innerHeight);

    var renderPass = new RenderPass(scene, camera);
    var effectCopy = new ShaderPass(CopyShader);
    effectCopy.renderToScreen = true;

    var composer = new EffectComposer(renderer);
    composer.addPass(renderPass);
    composer.addPass(hTilt);
    composer.addPass(effectCopy);

    //===================================================== model
    var geometry = new THREE.BoxBufferGeometry(.5, 1, .5);
    geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 0.5, 0));
    var material = new THREE.MeshNormalMaterial({
      transparent: true,
      opacity: 0
    });
    var mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    var directionalLight = new THREE.DirectionalLight(new THREE.Color('white'), .5);
    directionalLight.position.set(0, 1, 0);
    directionalLight.castShadow = true;
    directionalLight.target = mesh;
    mesh.add(directionalLight);

    // 添加模型
    var mixers = [];
    var clip1;
    var clip2;
    var loader = new GLTFLoader();
    loader.load(foxModel, function (object) {
      object.scene.traverse(function (node) {
        if (node instanceof THREE.Mesh) {
          node.castShadow = true;
          node.material.side = THREE.DoubleSide;
        }
      });
      var player = object.scene;
      player.position.set(0, -.1, 0);
      player.scale.set(.008, .008, .008);
      mesh.add(player);

      var mixer = new THREE.AnimationMixer(player);
      clip1 = mixer.clipAction(object.animations[0]);
      clip2 = mixer.clipAction(object.animations[1]);
      clip2.timeScale = 1.6;
      mixers.push(mixer);
    });

    // 添加地形
    var sizeX = 128,
      sizeY = 128,
      minHeight = 0,
      maxHeight = 60;
    // can add an array if things
    var check;
    Promise.all([
      img2matrix.fromUrl(heightMapImage, sizeX, sizeY, minHeight, maxHeight)(),
    ]).then(function (data) {
      var matrix = data[0];
      const terrainShape = new CANNON.Heightfield(matrix, { elementSize: 10 });
      const terrainBody = new CANNON.Body({ mass: 0 });
      terrainBody.addShape(terrainShape);
      terrainBody.position.set(-sizeX * terrainShape.elementSize / 2, -10, sizeY * terrainShape.elementSize / 2);
      terrainBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
      world.add(terrainBody);
      helper.addVisual(terrainBody, 'landscape');
      var raycastHelperGeometry = new THREE.CylinderGeometry(0, 1, 5, 1.5);
      raycastHelperGeometry.translate(0, 0, 0);
      raycastHelperGeometry.rotateX(Math.PI / 2);
      var raycastHelperMesh = new THREE.Mesh(raycastHelperGeometry, new THREE.MeshNormalMaterial());
      scene.add(raycastHelperMesh);
      check = function () {
        var raycaster = new THREE.Raycaster(mesh.position, new THREE.Vector3(0, -1, 0));
        var intersects = raycaster.intersectObject(terrainBody.threemesh.children[0]);
        if (intersects.length > 0) {
          raycastHelperMesh.position.set(0, 0, 0);
          raycastHelperMesh.lookAt(intersects[0].face.normal);
          raycastHelperMesh.position.copy(intersects[0].point);
        }
        // 将模型放置在地形上
        mesh.position.y = intersects && intersects[0] ? intersects[0].point.y + 0.1 : 30;
        // 标志旗帜
        var raycaster2 = new THREE.Raycaster(flagLocation.position, new THREE.Vector3(0, -1, 0));
        var intersects2 = raycaster2.intersectObject(terrainBody.threemesh.children[0]);
        flagLocation.position.y = intersects2 && intersects2[0] ? intersects2[0].point.y + .5 : 30;
        flagLight.position.y = flagLocation.position.y + 50;
        flagLight.position.x = flagLocation.position.x + 5
        flagLight.position.z = flagLocation.position.z;
      }
    });

    // 旗帜
    var flagGeometry = new THREE.BoxBufferGeometry(0.15, 2, 0.15);
    flagGeometry.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 1, 0));
    var flagMaterial = new THREE.MeshNormalMaterial({
      transparent: true,
      opacity: 0
    });
    var flagLocation = new THREE.Mesh(flagGeometry, flagMaterial);
    scene.add(flagLocation);
    flagLocation.position.x = 10;
    flagLocation.position.z = 50;
    flagLocation.rotateY(Math.PI);

    // 旗帜点
    var flagPoleGeometry = new THREE.CylinderGeometry(.03, .03, 4, 32);
    var flagPloeMaterial = new THREE.MeshPhongMaterial({
      color: new THREE.Color('gray')
    });
    var cylinder = new THREE.Mesh(flagPoleGeometry, flagPloeMaterial);
    cylinder.geometry.center();
    cylinder.castShadow = true;
    flagLocation.add(cylinder);

    // 旗帜点光源
    var pointflagLight = new THREE.PointLight(new THREE.Color('red'), 1.5, 5);
    pointflagLight.position.set(0, 0, 0);
    flagLocation.add(pointflagLight);
    var flagLight = new THREE.DirectionalLight(new THREE.Color('white'), 0);
    flagLight.position.set(0, 0, 0);
    flagLight.castShadow = true;
    flagLight.target = flagLocation;
    scene.add(flagLight);
    // 旗帜
    var plane = new THREE.Mesh(new THREE.PlaneGeometry(600, 430, 20, 20, true), new THREE.MeshBasicMaterial({
      map: new THREE.TextureLoader().load(flagTexture),
      side: THREE.DoubleSide
    }));
    plane.scale.set(.0025, .0025, .0025);
    plane.position.set(0, 1.5, 0);
    plane.position.x = .75;
    plane.castShadow = true;
    flagLocation.add(plane);
    addModifier(plane);

    // 旗帜摆动动画
    var modifier, cloth;
    function addModifier(mesh) {
      modifier = new ModifierStack(mesh);
      cloth = new Cloth(3, 0);
      cloth.setForce(0.2, -0.2, -0.2);
    }
    modifier.addModifier(cloth);
    cloth.lockXMin(0);

    // 星空粒子
    var textureLoader = new THREE.TextureLoader();
    const imageSrc = textureLoader.load(snowflakeTexture);
    const shaderPoint = THREE.ShaderLib.points;
    var uniforms = THREE.UniformsUtils.clone(shaderPoint.uniforms);
    uniforms.map.value = imageSrc;
    var matts = new THREE.PointsMaterial({
      size: 2,
      color: new THREE.Color(0xffffff),
      map: uniforms.map.value,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      transparent: true,
      opacity: 0.75
    });
    var geo = new THREE.Geometry();
    for (var i = 0; i < 1000; i++) {
      var star = new THREE.Vector3();
      geo.vertices.push(star);
    }
    var sparks = new THREE.Points(geo, matts);
    sparks.scale.set(1, 1, 1);
    scene.add(sparks);
    sparks.geometry.vertices.map((d, i) => {
      d.y = randnum(30, 40);
      d.x = randnum(-500, 500);
      d.z = randnum(-500, 500);
      return true;
    });

    // 轮盘控制器
    var setup = { forward: 0, turn: 0 };
    new JoyStick({ onMove: joystickCallback });
    function joystickCallback(forward, turn) {
      setup.forward = forward;
      setup.turn = -turn;
    }
    function updateDrive(forward = setup.forward, turn = setup.turn) {
      const maxSteerVal = 0.05;
      const maxForce = .15;
      const force = maxForce * forward;
      const steer = maxSteerVal * turn;
      if (forward !== 0) {
        mesh.translateZ(force);
        clip2 && clip2.play();
        clip1 && clip1.stop();
      } else {
        clip2 && clip2.stop();
        clip1 && clip1.play();
      }
      mesh.rotateY(steer);
    }

    // 第三人称视角
    var followCam = new THREE.Object3D();
    followCam.position.copy(camera.position);
    scene.add(followCam);
    followCam.parent = mesh;
    function updateCamera() {
      if (followCam) {
        camera.position.lerp(followCam.getWorldPosition(new THREE.Vector3()), 0.05);
        camera.lookAt(mesh.position.x, mesh.position.y + .5, mesh.position.z);
      }
    }

    // 动画
    const info = document.getElementById('info');
    var clock = new THREE.Clock();
    var lastTime;
    (function animate() {
      requestAnimationFrame(animate);
      updateCamera();
      updateDrive();
      renderer.render(scene, camera);
      composer.render();
      let delta = clock.getDelta();
      mixers.map(x => x.update(delta));
      const now = Date.now();
      if (lastTime === undefined) lastTime = now;
      const dt = (Date.now() - lastTime) / 1000.0;
      lastTime = now;
      world.step(fixedTimeStep, dt);
      helper.updateBodies(world);
      check && check();
      // 显示坐标
      info.innerHTML = `<span>X: </span>${mesh.position.x.toFixed(2)}, &nbsp;&nbsp;&nbsp; <span>Y: </span>${mesh.position.y.toFixed(2)}, &nbsp;&nbsp;&nbsp; <span>Z: </span>${mesh.position.z.toFixed(2)}`
      // 旗帜
      modifier && modifier.apply();
      stats && stats.update();
    })();
  }

  render () {
    return (
      <div id="metaverse">
        <canvas className='webgl'></canvas>
        <div id='info'></div>
      </div>
    )
  }
}