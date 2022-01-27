/* eslint-disable */
import React from 'react';
import Stats from "three/examples/jsm/libs/stats.module";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import landModel from './models/land.glb';
import pandaModel from './models/panda.gltf';
import bingdundunModel from './models/bingdundun.glb';
import skyTexture from './images/sky.jpg';
import snowTexture from './images/snow.png';
import treeTexture from './images/tree.png';

export default class Olympic extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.initThree()
  }

  initThree = () => {
    var container, controls, stats;
    var camera, scene, renderer, light, land = null, meshes = [], points = [];
    var fiveCyclesGroup = new THREE.Group();
    var mouseX = 0, mouseY = 0;
    var windowHalfX = window.innerWidth / 2;
    var windowHalfY = window.innerHeight / 2;

    init();
    animate();
    function init() {
      container = document.getElementById('container');
      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.shadowMap.enabled = true;
      container.appendChild(renderer.domElement);

      scene = new THREE.Scene();
      scene.background = new THREE.TextureLoader().load(skyTexture);
      camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.set(0, -2, 20);
      camera.lookAt(new THREE.Vector3(0, 0, 0));

      // var axes = new THREE.AxisHelper(30);
      // scene.add(axes);

      // 性能工具
      stats = new Stats();
      document.documentElement.appendChild(stats.dom);

      const cubeGeometry = new THREE.BoxGeometry(0.001, 0.001, 0.001);
      const cubeMaterial = new THREE.MeshLambertMaterial({ color: 0xdc161a });
      const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
      cube.position.set(0, 0, 0,);
      light = new THREE.DirectionalLight(0xdddddd, 1);
      light.intensity = 1.2;
      light.position.set(-5, 8, 3);
      light.castShadow = true;
      light.target = cube;
      light.shadow.mapSize.width = 512 * 12;
      light.shadow.mapSize.height = 512 * 12;
      light.shadow.camera.top = 10;
      light.shadow.camera.bottom = - 5;
      light.shadow.camera.left = - 5;
      light.shadow.camera.right = 10;
      scene.add(light);

      var ambientLight = new THREE.AmbientLight(0xdddddd);
      scene.add(ambientLight);

      // 添加地面
      var loader = new GLTFLoader();
      loader.load(landModel, function (mesh) {
        mesh.scene.traverse(function (child) {
          if (child.isMesh) {
            meshes.push(child)
            if (child.name === 'Mesh_2') {
              child.material.metalness = .1
              child.material.roughness = .8
              child.material.color = new THREE.Color(0xffffff)
            }
          }
        });
        mesh.scene.rotation.y = Math.PI / 4;
        mesh.scene.position.set(15, -20, 0);
        mesh.scene.scale.set(.9, .9, .9);
        land = mesh.scene;
        scene.add(land);
      });

      // bingdundun
      loader.load(bingdundunModel, function (mesh) {
        mesh.scene.traverse(function (child) {
          if (child.isMesh) {
            meshes.push(child)
            if (child.name === 'oldtiger001') {
              child.material.metalness = .5
            }
            if (child.name === 'oldtiger002') {
              child.material.transparent = true;
              child.material.opacity = .5
            }
          }
        });
        mesh.scene.rotation.y = Math.PI / 24;
        mesh.scene.position.set(-8, -10, 0);
        mesh.scene.scale.set(24, 24, 24);
        scene.add(mesh.scene);
      });

      // 添加树
      let pandaMaterial = new THREE.MeshPhysicalMaterial({
          map: new THREE.TextureLoader().load(treeTexture),
          transparent: true,
          side: THREE.DoubleSide,
          metalness: .2,
          roughness: .8,
          depthTest: true,
          depthWrite: false,
          skinning: false,
          fog: false,
          reflectivity: 0.1,
          refractionRatio: 0,
      });
      let pandaCustomDepthMaterial = new THREE.MeshDepthMaterial({
          depthPacking: THREE.RGBADepthPacking,
          map: new THREE.TextureLoader().load(treeTexture),
          alphaTest: 0.5
      });
      loader.load(pandaModel, function (mesh) {
        mesh.scene.traverse(function (child) {
          if (child.isMesh) {
            meshes.push(child)
            child.material = pandaMaterial
            child.custromMaterial = pandaCustomDepthMaterial
          }
        });
        mesh.scene.position.set(14, -8, 0);
        mesh.scene.scale.set(16, 16, 16);
        scene.add(mesh.scene);
        let tree2 = mesh.scene.clone();
        tree2.position.set(8, -8, -14);
        tree2.scale.set(18, 18, 18);
        scene.add(tree2)

        let tree3 = mesh.scene.clone();
        tree3.position.set(-16, -8, -16);
        tree3.scale.set(18, 18, 18);
        scene.add(tree3)
      });

      // 创建五环
      const fiveCycles = [
        {
          key: 'cycle_0',
          color: 0x0885c2,
          position: { x: -250, y: 0, z: 0 }
        },
        {
          key: 'cycle_1',
          color: 0x000000,
          position: { x: -10, y: 0, z: 5 }
        },
        {
          key: 'cycle_2',
          color: 0xed334e,
          position: { x: 230, y: 0, z: 0 }
        },
        {
          key: 'cycle_3',
          color: 0xfbb132,
          position: { x: -125, y: -100, z: -5 }
        },
        {
          key: 'cycle_4',
          color: 0x1c8b3c,
          position: { x: 115, y: -100, z: 10 }
        }
      ];
      fiveCycles.map(item => {
        let cycleMesh = new THREE.Mesh(new THREE.TorusGeometry(100, 10, 10, 50), new THREE.MeshLambertMaterial({
          color: new THREE.Color(item.color),
          side: THREE.DoubleSide
        }));
        cycleMesh.position.set(item.position.x, item.position.y, item.position.z);
        meshes.push(cycleMesh);
        fiveCyclesGroup.add(cycleMesh);
      });
      fiveCyclesGroup.scale.set(.03, .03, .03);
      fiveCyclesGroup.position.set(0, 8, -5);
      scene.add(fiveCyclesGroup);

      // 创建雪花
      let texture = new THREE.TextureLoader().load(snowTexture);
      let geometry = new THREE.Geometry();
      let pointsMaterial = new THREE.PointsMaterial({
        size: 1,
        transparent: true,
        opacity: 0.8,
        map: texture,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true,
        depthTest: false
      });
      let range = 100;
      let vertices = []
      for (let i = 0; i < 1500; i++) {
        let vertice = new THREE.Vector3(Math.random() * range - range / 2, Math.random() * range * 1.5, Math.random() * range - range / 2);
        // 纵向移动速度
        vertice.velocityY = 0.1 + Math.random() / 3;
        // 横向移动速度
        vertice.velocityX = (Math.random() - 0.5) / 3;
        // 将顶点加入几何
        geometry.vertices.push(vertice);
      }
      geometry.center();
      points = new THREE.Points(geometry, pointsMaterial);
      points.position.y = -30;
      scene.add(points);

      controls = new OrbitControls(camera, renderer.domElement);
      controls.target.set(0, 0, 0);
      controls.enableDamping = true;
      controls.enablePan = false;
      controls.enableZoom = false;
      // 最大仰角
      controls.minPolarAngle = 1.4;
      controls.maxPolarAngle = 1.8;
      window.addEventListener('resize', onWindowResize, false);
    }

    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function onDocumentMouseMove( event ) {
      mouseX = event.clientX - windowHalfX;
      mouseY = event.clientY - windowHalfY;
    }

    function animate() {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
      stats && stats.update();
      controls && controls.update();
      fiveCyclesGroup && (fiveCyclesGroup.rotation.y += .01)
      let vertices = points.geometry.vertices;
      vertices.forEach(function (v) {
        v.y = v.y - (v.velocityY);
        v.x = v.x - (v.velocityX);
        if (v.y <= 0) v.y = 60;
        if (v.x <= -20 || v.x >= 20) v.velocityX = v.velocityX * -1;
      });
      // 顶点变动之后需要更新，否则无法实现雨滴特效
      points.geometry.verticesNeedUpdate = true;
    }

    // 增加点击事件，声明raycaster和mouse变量
    var raycaster = new THREE.Raycaster();
    var mouse = new THREE.Vector2();
    function onMouseClick(event) {
      // 通过鼠标点击的位置计算出raycaster所需要的点的位置，以屏幕中心为原点，值的范围为-1到1.
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
      // 通过鼠标点的位置和当前相机的矩阵计算出raycaster
      raycaster.setFromCamera(mouse, camera);
      // 获取raycaster直线和所有模型相交的数组集合
      var intersects = raycaster.intersectObjects(meshes);
      if (intersects.length > 0) {
        console.log(intersects[0].object)
      }
    }
    window.addEventListener('click', onMouseClick, false);
  }

  render () {
    return (
      <div id="container"></div>
    )
  }
}