import './index.styl';
import React from 'react';
import * as THREE from './libs/three.module.js';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import astronautModel from './models/astronaut.glb';
import CANNON from 'cannon';
import heightMapImage from './images/Heightmap.png';
import CannonHelper from './CannonHelper';
import JoyStick from './JoyStick';
import { ModifierStack, Cloth } from './libs/modifier';
import flagTexture from './images/flag.png';
import snowflakeTexture from './images/snowflake.png';

// import './libs/EffectComposer.js';
// import './libs/ShaderPass.js';
// import './libs/RenderPass.js';
// import './libs/MaskPass.js';

import './libs/LegacyJSONLoader.js';
import './libs/CopyShader.js';
import './libs/HorizontalTiltShiftShader.js';

export default class Metaverse extends React.Component {
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
    renderer.shadowMap.enabled = true;
    renderer.shadowMapSoft = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    const scene = new THREE.Scene();

    // 相机
    const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, .01, 100000)
    camera.position.set(1, 1, -1);
    camera.lookAt(scene.position);

    // cannon
    var fixedTimeStep = 1.0 / 60.0;
    var helper = new CannonHelper(scene);
    // var physics = {};/

    // world
    const world = new CANNON.World();
    world.broadphase = new CANNON.SAPBroadphase(world);
    world.gravity.set(0, -10, 0);
    world.defaultContactMaterial.friction = 0;
    console.log(world)
    const groundMaterial = new CANNON.Material('groundMaterial');
    const wheelMaterial = new CANNON.Material('wheelMaterial');
    const wheelGroundContactMaterial = new CANNON.ContactMaterial(wheelMaterial, groundMaterial, {
      friction: 0,
      restitution: 0,
      contactEquationStiffness: 1000
    });
    world.addContactMaterial(wheelGroundContactMaterial);

    var light = new THREE.DirectionalLight(new THREE.Color("gray"), 1);
    light.position.set(1, 1, 1).normalize();
    scene.add(light);

    // mesh
    var geometry = new THREE.BoxBufferGeometry(.5, 1, .5);
    geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(0, .5, 0));
    var material = new THREE.MeshNormalMaterial({
      transparent: true,
      opacity: 0
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // 光源
    var directionalLight = new THREE.DirectionalLight(0xffffff, .5);
    directionalLight.position.set(0, 1, 0);
    directionalLight.castShadow = true;
    directionalLight.target = mesh;
    mesh.add(directionalLight);

    // 模型
    const mixers = [];
    var clip1, clip2;
    const loader = new GLTFLoader();
    loader.load(astronautModel, mesh => {
      mesh.scene.traverse(child => {
        if (child.isMesh) {
          child.castShadow = true;
          child.material.side = THREE.DoubleSide;
        }
      });
      let player = mesh.scene;
      player.position.set(0, -.1, 0);
      player.scale.set(.25, .25, .25);
      scene.add(mesh.scene);

      let mixer = new THREE.AnimationMixer(player);
      clip1 = mixer.clipAction(mesh.animations[0]);
      clip2 = mixer.clipAction(mesh.animations[1]);
    });

    // add tweening
    Object.defineProperties(THREE.Object3D.prototype, {
      x: {
        get: () => {
          return this.position.x;
        },
        set: v => {
          this.position.x = v;
        }
      },
      y: {
        get: () => {
          return this.position.y;
        },
        set: v => {
          this.position.y = v;
        }
      },
      z: {
        get: () => {
          return this.position.z;
        },
        set: v => {
          this.position.z = v;
        }
      },
      rotationX: {
        get: () => {
          return this.rotation.x;
        },
        set: v => {
          this.rotation.x = v;
        }
      },
      rotationY : {
        get: () => {
          return this.rotation.y;
        },
        set: v => {
          this.rotation.y = v;
        }
      },
      rotationZ: {
        get: () => {
          return this.rotation.z;
        },
        set: v => {
          this.rotation.z = v;
        }
      }
    });

    // 添加地形
    var sizeX = 128, sizeY = 128, minHeight = 0, maxHeight = 60;
    // var startPosition = new CANNON.Vec3(0, maxHeight - 3, sizeY * .5 - 10);
    const img2matrix = {
      fromImage: (image, width, depth, minHeight, maxHeight) => {
        width = width | 0;
        depth = depth | 0;
        var i, j;
        var matrix = [];
        var canvas = document.createElement('canvas'), ctx = canvas.getContext('2d');
        var imgData, pixel, channels = 4;
        var heightRange = maxHeight - minHeight;
        var heightData;

        canvas.width = width;
        canvas.height = depth;

        ctx.drawImage(image, 0, 0, width, depth);
        imgData = ctx.getImageData(0, 0, width, depth).data;
        for(i=0 | 0; i< depth; i=(i+1) | 0) {
          matrix.push([]);
          for(j=0 | 0; j< width; j=(j+1) | 0) {
            pixel = i * depth + j;
            heightData = imgData[pixel * channels] / 255 * heightRange + minHeight;
            matrix[i].push(heightData);
          }
        }
        return matrix;
      },
      fromUrl: (url, width, depth, minHeight, maxHeight) => {
        return () => {
          return new Promise((onFulfilled, onRejeted) => {
            var image = new Image();
            image.crossOrigin = 'anonymous';
            image.onload = () => {
              var matrix = img2matrix.fromImage(image, width, depth, minHeight, maxHeight);
              onFulfilled(matrix);
            };
            image.src = url;
          })
        }
      }
    }

    // 旗帜
    var flagGeometry = new THREE.BoxBufferGeometry(.15, 2, .15);
    flagGeometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 1, 0));
    var flagMaterial = new THREE.MeshNormalMaterial({
      transparent: true,
      opacity: 0
    });
    var flagLocation = new THREE.Mesh(flagGeometry, flagMaterial);
    scene.add(flagLocation);
    flagLocation.position.x = 10;
    flagLocation.position.z = 50;
    flagLocation.rotateY(Math.PI);

    //flag pole
    var flagPoleGeometry = new THREE.CylinderGeometry(.03, .03, 4, 32);
    var flagPoleMaterial = new THREE.MeshPhongMaterial({
      color: new THREE.Color('gray')
    });
    var cylinder = new THREE.Mesh(flagPoleGeometry, flagPoleMaterial);
    cylinder.geometry.center();
    cylinder.castShadow = true;
    flagLocation.add(cylinder);

    //flag light
    var pointflagLight = new THREE.PointLight(new THREE.Color('red'), 1.5, 5);
    pointflagLight.position.set(0, 0, 0);
    flagLocation.add(pointflagLight);

    var flagLight = new THREE.DirectionalLight(new THREE.Color('white'), 0);
    flagLight.position.set(0, 0, 0);
    flagLight.castShadow = true;
    flagLight.target = flagLocation;
    scene.add(flagLight);

    //flag
    var texture = new THREE.TextureLoader().load(flagTexture);
    var plane = new THREE.Mesh(new THREE.PlaneGeometry(600, 430, 20, 20, true), new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.DoubleSide
    }));
    plane.scale.set(.0025, .0025, .0025);
    plane.position.set(0, 1.5, 0);
    plane.position.x = .75;
    plane.castShadow = true;

    flagLocation.add(plane);
    addModifier(plane);

    // 天空
    var textureLoader = new THREE.TextureLoader();
    textureLoader.crossOrigin = '';

    const imageSrc = textureLoader.load(snowflakeTexture);
    const shaderPoint = THREE.ShaderLib.points;

    var uniforms = THREE.UniformsUtils.clone(shaderPoint.uniforms);
    uniforms.map.value = imageSrc;

    var matts = new THREE.PointsMaterial({
      size: 2,
      color: new THREE.Color('white'),
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

    const randnum = (min, max) => Math.round(Math.random() * (max - min) + min);

    sparks.geometry.vertices.map((d, i) => {
      d.y = randnum(30, 40);
      d.x = randnum(-500, 500);
      d.z = randnum(-500, 500);
      return true;
    });

    //flag wave animation
    var modifier, cloth;
    function addModifier(mesh) {
      modifier = new ModifierStack(mesh);
      cloth = new Cloth(3, 0);
      cloth.setForce(0.2, -0.2, -0.2);
    }
    modifier.addModifier(cloth);
    cloth.lockXMin(0);

    var check;
    Promise.all([
      img2matrix.fromUrl(heightMapImage, sizeX, sizeY, minHeight, maxHeight)()
    ]).then(data => {
      let matrix = data[0];
      const terrainShape = new CANNON.Heightfield(matrix, { elementSize: 10 });
      const terrainBody = new CANNON.Body({ mass: 0 });

      terrainBody.position.set(-sizeX * terrainShape.elementSize / 2, -10, sizeY * terrainBody.elementSize / 2);
      terrainBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
      world.add(terrainBody);
      helper.addVisual(terrainBody, 'landscape');

      var raycastHelperGeometry = new THREE.CylinderBufferGeometry(0, 1, 5, 1.5);
      raycastHelperGeometry.translate(0, 0, 0);
      raycastHelperGeometry.rotateX(Math.PI / 2);
      const raycastHelperMesh = new THREE.Mesh(raycastHelperGeometry, new THREE.MeshNormalMaterial());
      scene.add(raycastHelperMesh);

      check = function () {
        var raycaster = new THREE.Raycaster(mesh.position, new THREE.Vector3(0, -1, 0));
        var intersects = raycaster.intersectObject(terrainBody.threemesh.children[0]);
        if (intersects.length > 0) {
          raycastHelperMesh.position.set(0, 0, 0);
          raycastHelperMesh.lookAt(intersects[0].face.normal);
          raycastHelperMesh.position.copy(intersects[0].point);
        }
        mesh.position.y = intersects && intersects[0] ? intersects[0].point.y + .1 : 30;

        var raycaster2 = new THREE.Raycaster(flagLocation.position, new THREE.Vector3(0, -1, 0));
        var intersects2 = raycaster2.intersectObject(terrainBody.threemesh.children[0]);
        flagLocation.position.y = intersects2 && intersects2[0] ? intersects2[0].point.y + .5 : 30;
        flagLight.position.x = flagLocation.position.x + 5;
        flagLight.position.y = flagLocation.position.y + 50;
        flagLight.position.z = flagLocation.position.z;
      }
    });

    // joystick 控制器
    var js = { forward: 0, turn: 0 };
    new JoyStick({
      onMove: joystickCallback
    });
    function joystickCallback(forward, turn) {
      js.forward = forward;
      js.turn = -turn;
    }
    function updateDrive(forward = js.forward, turn = js.turn) {
      const maxSteerVal = .05;
      const maxForce = .15;
      const force = maxForce * forward;
      const steer = maxSteerVal * turn;
      if (forward !== 0) {
        mesh.translateZ(force);
        if (clip2) clip2.play();
        if (clip1) clip1.stop();
      } else {
        if (clip2) clip2.stop();
        if (clip1) clip1.play();
      }
      mesh.rotateY(steer);
    }

    // 第三人称视角
    var followCam = new THREE.Object3D();
    followCam.position.copy(camera.position);
    scene.add(followCam);
    followCam.parent = mesh;

    function updateCamera () {
      if (followCam) {
        camera.position.lerp(followCam.getWorldPosition(new THREE.Vector3()), .05);
        camera.lookAt(mesh.position.x, mesh.position.y + .5, mesh.position.z);
      }
    }

    // 缩放监听
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }, false);

    // 特效
    // var SCALE = 2;
    // var hTilt = new THREE.ShaderPass(THREE.HorizontalTiltShiftShader);
    // hTilt.enabled = false;
    // hTilt.uniforms.h.value = 4 / (SCALE * window.innerHeight);

    // var renderPass = new THREE.RenderPass(scene, camera);
    // var effectCopy = new THREE.ShaderPass(THREE.CopyShader);
    // effectCopy.renderToScreen = true;

    // var composer = new THREE.EffectComposer(renderer);
    // composer.addPass(renderPass);
    // composer.addPass(hTilt);
    // composer.addPass(effectCopy);

    // var controls = new function () {
    //   this.hTilt = false;
    //   this.hTiltR = 0.5;
    //   this.onChange = function () {
    //     hTilt.enabled = controls.hTilt;
    //     hTilt.uniforms.r.value = controls.hTiltR;
    //   }
    // };

    const clock = new THREE.Clock();
    var lastTime;
    const animate = () => {
      updateCamera();
      updateDrive();
      renderer.render(scene, camera);
      requestAnimationFrame(animate);

      let delta = clock.getDelta();
      mixers.map(x => x.update(delta));
      const now = Date.now();
      if (lastTime === undefined) lastTime = now;
      const dt = (Date.now() - lastTime) / 1000.0;
      lastTime = now;
      world.step(fixedTimeStep, dt);
      helper.updateBodies(world);
      if (check) check();
      // display coordinates
      // info.innerHTML = `<span>X: </span>${mesh.position.x.toFixed(2)}, &nbsp;&nbsp;&nbsp; <span>Y: </span>${mesh.position.y.toFixed(2)}, &nbsp;&nbsp;&nbsp; <span>Z: </span>${mesh.position.z.toFixed(2)}`
      // flag
      modifier && modifier.apply();
    }
    animate();
  }

  render () {
    return (
      <div id="metaverse">
        <canvas className='webgl'></canvas>
      </div>
    )
  }
}