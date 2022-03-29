import './index.styl';
import React from 'react';
import * as THREE from './libs/three.module';
import { GLTFLoader } from './libs/GLTFLoader';
import { img2matrix, randnum } from './scripts/Utils';
import CANNON from 'cannon';
import CannonHelper from './scripts/CannonHelper';
import JoyStick from './scripts/JoyStick';
import foxModel from './models/Fox.glb';
import Shelter from './models/Shelter.glb';
import heightMapImage from './images/Heightmap.png';
import snowflakeTexture from './images/snowflake.png';
import Stats from "three/examples/jsm/libs/stats.module";

export default class Metaverse extends React.Component {
  constructor(props) {
    super(props);
    this.scene = null;
  }

  componentDidMount() {
    this.initThree();
  }

  componentWillUnmount () {
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
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMapSoft = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    const scene = new THREE.Scene();
    this.scene = scene;
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, .01, 100000);
    camera.position.set(1, 1, -1);
    camera.lookAt(scene.position);

    window.addEventListener('resize', () => {
      var width = window.innerWidth;
      var height = window.innerHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    }, false);

    const ambientLight = new THREE.AmbientLight(0xffffff, .4);
    scene.add(ambientLight)

    // cannon
    var fixedTimeStep = 1.0 / 60.0;
    const helper = new CannonHelper(scene);
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
    // 给世界添加 contactMaterial
    world.addContactMaterial(wheelGroundContactMaterial);

    // 添加 front & back 光源
    var light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(1, 1, 1).normalize();
    scene.add(light);

    // target
    var geometry = new THREE.BoxBufferGeometry(.5, 1, .5);
    geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 0.5, 0));
    const target = new THREE.Mesh(geometry, new THREE.MeshNormalMaterial({
      transparent: true,
      opacity: 0
    }));
    scene.add(target);

    var directionalLight = new THREE.DirectionalLight(new THREE.Color('white'), .5);
    directionalLight.position.set(0, 1, 0);
    directionalLight.castShadow = true;
    directionalLight.target = target;
    target.add(directionalLight);

    // 添加狐狸模型
    var mixers = [], clip1, clip2;
    const gltfLoader = new GLTFLoader();
    gltfLoader.load(foxModel, mesh => {
      mesh.scene.traverse(child => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true;
          child.material.side = THREE.DoubleSide;
        }
      });
      var player = mesh.scene;
      player.position.set(0, -.01, 0);
      player.scale.set(.008, .008, .008);
      target.add(player);
      var mixer = new THREE.AnimationMixer(player);
      clip1 = mixer.clipAction(mesh.animations[0]);
      clip2 = mixer.clipAction(mesh.animations[1]);
      clip2.timeScale = 1.6;
      mixers.push(mixer);
    });

    // 添加地形
    var sizeX = 128, sizeY = 128, minHeight = 0, maxHeight = 60, check = null;
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
      check = () => {
        var raycaster = new THREE.Raycaster(target.position, new THREE.Vector3(0, -1, 0));
        var intersects = raycaster.intersectObject(terrainBody.threemesh.children[0]);
        if (intersects.length > 0) {
          raycastHelperMesh.position.set(0, 0, 0);
          raycastHelperMesh.lookAt(intersects[0].face.normal);
          raycastHelperMesh.position.copy(intersects[0].point);
        }
        // 将模型放置在地形上
        target.position.y = intersects && intersects[0] ? intersects[0].point.y + 0.1 : 30;
        // 标志避难所
        var raycaster2 = new THREE.Raycaster(shelterLocation.position, new THREE.Vector3(0, -1, 0));
        var intersects2 = raycaster2.intersectObject(terrainBody.threemesh.children[0]);
        shelterLocation.position.y = intersects2 && intersects2[0] ? intersects2[0].point.y + .5 : 30;
        shelterLight.position.y = shelterLocation.position.y + 50;
        shelterLight.position.x = shelterLocation.position.x + 5
        shelterLight.position.z = shelterLocation.position.z;
      }
    });

    // 避难所
    const shelterGeometry = new THREE.BoxBufferGeometry(0.15, 2, 0.15);
    shelterGeometry.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 1, 0));
    const shelterLocation = new THREE.Mesh(shelterGeometry, new THREE.MeshNormalMaterial({
      transparent: true,
      opacity: 0
    }));
    shelterLocation.position.x = 10;
    shelterLocation.position.z = 50;
    shelterLocation.rotateY(Math.PI);
    scene.add(shelterLocation);

    // 避难所模型
    gltfLoader.load(Shelter, mesh => {
      mesh.scene.traverse(child => {
        child.castShadow = true;
      });
      mesh.scene.scale.set(5, 5, 5);
      mesh.scene.position.y = -.5;
      shelterLocation.add(mesh.scene)
    })

    // 避难所点光源
    var shelterPointLight = new THREE.PointLight(0x1089ff, 2);
    shelterPointLight.position.set(0, 0, 0);
    shelterLocation.add(shelterPointLight);
    var shelterLight = new THREE.DirectionalLight(0xffffff, 0);
    shelterLight.position.set(0, 0, 0);
    shelterLight.castShadow = true;
    shelterLight.target = shelterLocation;
    scene.add(shelterLight);

    // 星空粒子
    const textureLoader = new THREE.TextureLoader();
    const imageSrc = textureLoader.load(snowflakeTexture);
    const shaderPoint = THREE.ShaderLib.points;
    const uniforms = THREE.UniformsUtils.clone(shaderPoint.uniforms);
    uniforms.map.value = imageSrc;
    var geo = new THREE.Geometry();
    for (var i = 0; i < 1000; i++) {
      var star = new THREE.Vector3();
      geo.vertices.push(star);
    }
    const sparks = new THREE.Points(geo, new THREE.PointsMaterial({
      size: 2,
      color: new THREE.Color(0xffffff),
      map: uniforms.map.value,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      transparent: true,
      opacity: 0.75
    }));
    sparks.scale.set(1, 1, 1);
    scene.add(sparks);
    sparks.geometry.vertices.map(spark => {
      spark.y = randnum(30, 40);
      spark.x = randnum(-500, 500);
      spark.z = randnum(-500, 500);
      return true;
    });

    // 轮盘控制器
    var setup = { forward: 0, turn: 0 };
    new JoyStick({ onMove: (forward, turn) => {
      setup.forward = forward;
      setup.turn = -turn;
    }});

    const updateDrive = (forward = setup.forward, turn = setup.turn) => {
      let maxSteerVal = 0.05;
      let maxForce = .15;
      let force = maxForce * forward;
      let steer = maxSteerVal * turn;
      if (forward !== 0) {
        target.translateZ(force);
        clip2 && clip2.play();
        clip1 && clip1.stop();
      } else {
        clip2 && clip2.stop();
        clip1 && clip1.play();
      }
      target.rotateY(steer);
    }

    // 第三人称视角
    const followCamera = new THREE.Object3D();
    followCamera.position.copy(camera.position);
    scene.add(followCamera);
    followCamera.parent = target;

    const updateCamera = () => {
      if (followCamera) {
        camera.position.lerp(followCamera.getWorldPosition(new THREE.Vector3()), 0.1);
        camera.lookAt(target.position.x, target.position.y + .5, target.position.z);
      }
    }

    // 动画
    const info = document.getElementById('info');
    var clock = new THREE.Clock();
    var lastTime;
    const animate = () => {
      updateCamera();
      updateDrive();
      let delta = clock.getDelta();
      mixers.map(x => x.update(delta));
      let now = Date.now();
      lastTime === undefined && (lastTime = now);
      let dt = (Date.now() - lastTime) / 1000.0;
      lastTime = now;
      world.step(fixedTimeStep, dt);
      helper.updateBodies(world);
      check && check();
      info.innerHTML = `<span>X: </span>${target.position.x.toFixed(2)}, &nbsp;&nbsp;&nbsp; <span>Y: </span>${target.position.y.toFixed(2)}, &nbsp;&nbsp;&nbsp; <span>Z: </span>${target.position.z.toFixed(2)}`
      stats && stats.update();
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();
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