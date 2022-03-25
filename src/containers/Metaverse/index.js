import './index.styl';
import React from 'react';
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import astronautModel from './models/astronaut.glb';
import CANNON from 'cannon';
import heightMapImage from './images/Heightmap.png';

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

    // mesh
    const geometry = new THREE.BoxBufferGeometry(.5, 1, .5);
    geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(0, .5, 0));
    const material = new THREE.MeshNormalMaterial({
      transparent: true,
      opacity: 0
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // 光源
    const light = new THREE.DirectionalLight(0xffffff, .5);
    light.position.set(0, 1, 0);
    light.castShadow = true;
    light.target = mesh;
    mesh.add(light);

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
    // Object.defineProperty(THREE.Object3D.prototype, {
    //   x: {
    //     get: () => {
    //       return this.position.x;
    //     },
    //     set: v => {
    //       this.position.x = v;
    //     }
    //   },
    //   y: {
    //     get: () => {
    //       return this.position.y;
    //     },
    //     set: v => {
    //       this.position.y = v;
    //     }
    //   },
    //   z: {
    //     get: () => {
    //       return this.position.z;
    //     },
    //     set: v => {
    //       this.position.z = v;
    //     }
    //   },
    //   rotationX: {
    //     get: () => {
    //       return this.rotation.x;
    //     },
    //     set: v => {
    //       this.rotation.x = v;
    //     }
    //   },
    //   rotationY : {
    //     get: () => {
    //       return this.rotation.y;
    //     },
    //     set: v => {
    //       this.rotation.y = v;
    //     }
    //   },
    //   rotationZ: {
    //     get: () => {
    //       return this.rotation.z;
    //     },
    //     set: v => {
    //       this.rotation.z = v;
    //     }
    //   }
    // });

    // 添加地形
    var sizeX = 128, sizeY = 128, minHeight = 0, maxHeight = 60;
    var startPosition = new CANNON.Vec3(0, maxHeight - 3, sizeY * .5 - 10);
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

      var raycastHelperGeometry = new THREE.CylinderBufferGeometry(0, 1, 5, 1.5);
      raycastHelperGeometry.translate(0, 0, 0);
      raycastHelperGeometry.rotateX(Math.PI / 2);
      const raycastHelperMesh = new THREE.Mesh(raycastHelperGeometry, new THREE.MeshNormalMaterial());
      scene.add(raycastHelperMesh);

      // const check = () => {
      //   var raycaster = new THREE.Raycaster(mesh.position, new THREE.Vector3(0, -1, 0));
      //   var intersects = raycaster.intersectObject(terrainBody.threemesh.children[0]);
      //   if (intersects.length > 0) {
      //     raycastHelperMesh.position.set(0, 0, 0);
      //     raycastHelperMesh.lookAt(intersects[0].face.normal);
      //     raycastHelperMesh.position.copy(intersects[0].point);
      //   }
      //   mesh.position.y = intersects && intersects[0] ? intersects[0].point.y + .1 : 30;

      //   var raycaster2 = new THREE.Raycaster(flagLocation.position, new THREE.Vector3(0, -1, 0));
      //   var intersects2 = raycaster2.intersectObject(terrainBody.threemesh.children[0]);
      //   flagLocation.position.y = intersects2 && intersects2[0] ? intersects2[0].point.y + .5 : 30;
      //   flagLight.position.x = flagLocation.position.x + 5;
      //   flagLight.position.y = flagLocation.position.y + 50;
      //   flagLight.position.z = flagLocation.position.z;
      // }
    });



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

    // 缩放监听
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }, false);

    const ambientLight = new THREE.AmbientLight(0xdddddd);
    scene.add(ambientLight);

    // const clock = new THREE.Clock();
    const animate = () => {
      // const elapsedTime = clock.getElapsedTime();
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
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