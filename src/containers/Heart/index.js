import React from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { mergeBufferGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils';
import heartModal from './models/heart.glb';
import fragment from './shader/fragment.glsl';
import vertex from './shader/vertexHeart.glsl';

export default class Heart extends React.Component {

  constructor(props) {
    super(props)
    this.renderer = null;
    this.scene = null;
    this.camera = null;
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.mouseX = 0;
    this.mouseY = 0;
    this.targetmouseX = 0;
    this.targetmouseY = 0;
    this.heart = null;
    this.textureCube = null;
    this.material = null;
    this.material1 = null;
    this.progress = 0;
    this.inverted = false;
  }

  componentDidMount() {
    this.initThree()
  }

  initThree = () => {
    const container = document.getElementById('container');
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(this.width, this.height);
    renderer.shadowMap.enabled = true;
    this.renderer = renderer;
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xDDDDDD);
    this.scene = scene;
    const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.001, 1000);
    camera.position.set(0, 0, 7);
    this.camera = camera;

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }, false);

    const cubeGeometry = new THREE.BoxGeometry(0.001, 0.001, 0.001);
    const cubeMaterial = new THREE.MeshLambertMaterial({ color: 0xdc161a });
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.set(0, 0, 0,);
    const light = new THREE.DirectionalLight(0xdddddd, 1);
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

    const setupcubeTexture = () => {
      this.textureCube = new THREE.CubeTextureLoader().load([
        require('./images/sky/px.jpg'),
        require('./images/sky/nx.jpg'),
        require('./images/sky/py.jpg'),
        require('./images/sky/ny.jpg'),
        require('./images/sky/pz.jpg'),
        require('./images/sky/nz.jpg'),
      ])
    };

    const getRandomAxis = () => {
      return new THREE.Vector3(
        Math.random() - .5,
        Math.random() - .5,
        Math.random() - .5
      ).normalize();
    }

    const getCentroid = geometry => {
      let arr = geometry.attributes.position.array;
      let len = arr.length;
      let x = 0, y = 0, z = 0;
      for (let i=0; i< len; i = i + 3) {
        x += arr[i];
        y += arr[i + 1];
        z += arr[i + 2];
      }
      return {
        x: (3 * x) / len,
        y: (3 * y) / len,
        z: (3 * z) / len
      }
    }

    const addObjects = () => {
      this.material = new THREE.ShaderMaterial({
        extensions: {
          derivatives: '#extension GL_OES_standard_derivatives : enable'
        },
        side: THREE.DoubleSide,
        uniforms: {
          time: { type: 'f', value: 0 },
          progress: { type: 'f', value: 0 },
          inside: { type: 'f', value: 0 },
          surfaceColor: { type: 'v3', value: this.surfaceColor },
          insideColor: { type: 'v3', value: this.insideColor },
          tCube: { value: this.textureCube },
          pixels: {
            type: 'v2',
            value: new THREE.Vector2(this.width, this.height)
          },
          uvRate1: { value: new THREE.Vector2(1, 1) }
        },
        vertexShader: vertex,
        fragmentShader: fragment
      });
      this.material1 = this.material.clone();
      this.material1.uniforms.inside.value = 1;
    }

    const animate = () => {
      this.heart && (this.heart.rotation.y += .01);
      this.time += .05;
      this.mouseX += (this.targetmouseX - this.mouseX) * .05;
      this.material && (this.material.uniforms.progress.value = Math.abs(this.progress));
      this.material1 && (this.material1.uniforms.progress.value = Math.abs(this.progress));
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };

    const processSurface = (v, j) => {
      let position = v.position;
      let vtemp, vtemp1;

      vtemp = v.children[0].geometry.clone();
      vtemp = vtemp.applyMatrix(new THREE.Matrix4().makeTranslation(position.x, position.y, position.z));

      vtemp1 = v.children[1].geometry;
      vtemp1 = vtemp1.clone().applyMatrix(new THREE.Matrix4().makeTranslation(position.x, position.y, position.z));

      let len = v.children[0].geometry.attributes.position.array.length / 3;
      let len1 = v.children[1].geometry.attributes.position.array.length / 3;

      let offset = new Array(len).fill(j / 100);
      vtemp.addAttribute('offset', new THREE.BufferAttribute(new Float32Array(offset), 1));

      let offset1 = new Array(len1).fill(j / 100);
      vtemp1.addAttribute('offset', new THREE.BufferAttribute(new Float32Array(offset1), 1));

      let axis = getRandomAxis();
      let axes = new Array(len * 3).fill(0);
      let axes1 = new Array(len1 * 3).fill(0);
      for (let i=0; i<len * 3; i = i + 3) {
        axes[i] = axis.x;
        axes[i + 1] = axis.y;
        axes[i + 2] = axis.z;
      }

      vtemp.addAttribute('axis', new THREE.BufferAttribute(new Float32Array(axes), 3));

      for (let i=0; i<len1 * 3; i = i + 3) {
        axes1[i] = axis.x;
        axes1[i + 1] = axis.y;
        axes1[i + 2] = axis.z;
      }

      vtemp1.addAttribute('axis', new THREE.BufferAttribute(new Float32Array(axes1), 3));

      let centroIdVector = getCentroid(vtemp);
      let centroId = new Array(len * 3).fill(0);
      let centroId1 = new Array(len1 * 3).fill(0);
      for (let i=0; i< len * 3; i = i + 3) {
        centroId[i] = centroIdVector.x;
        centroId[i + 1] = centroIdVector.y;
        centroId[i + 2] = centroIdVector.z
      }
      for (let i=0; i< len1 * 3; i = i + 3) {
        centroId1[i] = centroIdVector.x;
        centroId1[i + 1] = centroIdVector.y;
        centroId1[i + 2] = centroIdVector.z;
      }
      vtemp.addAttribute('centroId', new THREE.BufferAttribute(new Float32Array(centroId), 3));
      vtemp1.addAttribute('centroId', new THREE.BufferAttribute(new Float32Array(centroId1), 3));

      return {
        surface: vtemp,
        volume: vtemp1
      }
    }

    const load = () => {
      let voron = [];
      let geoms = [];
      let geoms1 = [];
      let num = 0;
      const gltfLoader = new GLTFLoader();
      gltfLoader.load(heartModal, mesh => {
        mesh.scene.traverse(child => {
          if (child.name === 'Voronoi_Fracture') {
            if (child.children[0].children.length > 2) {
              child.children.forEach(item => {
                item.children.forEach(_item => {
                  voron.push(_item.clone());
                });
              });
            } else {
              child.children.forEach(item => {
                voron.push(item.clone());
              });
            }
          }
        });

        voron.filter(item => {
          if (item.isMesh) {
            return false;
          } else {
            num++;
            let vtempo = processSurface(item, num);
            if (this.inverted) {
              geoms1.push(vtempo.surface);
              geoms.push(vtempo.volume);
            } else {
              geoms.push(vtempo.surface);
              geoms1.push(vtempo.volume);
            }
            return true;
          }
        });

        let _mesh = new THREE.Mesh(mergeBufferGeometries(geoms, false), this.material);
        _mesh.frustumCulled = false;
        // scene.add(_mesh);

        let _mesh1 = new THREE.Mesh(mergeBufferGeometries(geoms1, false), this.material);
        _mesh1.frustumCulled = false;
        // scene.add(_mesh1);

        // mesh.scene.position.set(0, 0, 0);
        // mesh.scene.scale.set(1.2, 1.2, 1.2);
        scene.add(mesh.scene);
        this.heart = mesh.scene;
        // console.log(this.heart)
      });
    }

    setupcubeTexture();
    addObjects();
    load();
    animate();
  }

  render () {
    return (
      <div id="container"></div>
    )
  }
}