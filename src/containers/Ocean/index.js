import React from 'react';
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import Stats from "three/examples/jsm/libs/stats.module";
import { Water } from 'three/examples/jsm/objects/Water';
import waterTexture from '@/containers/Ocean/images/waternormals.jpg';
import { Sky } from 'three/examples/jsm/objects/Sky';
import islandModel from '@/containers/Ocean/models/island.glb';

export default class Earth extends React.Component {
  componentDidMount() {
    this.initThree()
  }

  initThree = () => {
    const renderer = new THREE.WebGLRenderer({
      canvas: document.querySelector('canvas.webgl'),
      alpha: true
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 1, 20000 );
    camera.position.set(0, 30, 120);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0, 0);
    controls.enableDamping = true;

    const stats = new Stats();
    document.documentElement.appendChild(stats.dom);

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }, false);

    // 水
    const waterGeometry = new THREE.PlaneGeometry(10000, 10000);
		const water = new Water(waterGeometry, {
        textureWidth: 512,
        textureHeight: 512,
        waterNormals: new THREE.TextureLoader().load(waterTexture, function ( texture ) {
          texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        }),
        sunDirection: new THREE.Vector3(),
        sunColor: 0xffffff,
        waterColor: 0x001e0f,
        distortionScale: 3.7,
        fog: scene.fog !== undefined
      }
    );
    water.rotation.x = - Math.PI / 2;
    scene.add( water );

    // 太阳
    const sun = new THREE.Vector3();

    // 天空
    const sky = new Sky();
    sky.scale.setScalar( 10000 );
    scene.add( sky );
    const skyUniforms = sky.material.uniforms;
    skyUniforms[ 'turbidity' ].value = 10;
    skyUniforms[ 'rayleigh' ].value = 2;
    skyUniforms[ 'mieCoefficient' ].value = 0.005;
    skyUniforms[ 'mieDirectionalG' ].value = 0.8;

    const parameters = {
      elevation: 2,
      azimuth: 180
    };

    const pmremGenerator = new THREE.PMREMGenerator( renderer );

    const updateSun = () => {
      const phi = THREE.MathUtils.degToRad( 90 - parameters.elevation );
      const theta = THREE.MathUtils.degToRad( parameters.azimuth );
      sun.setFromSphericalCoords( 1, phi, theta );
      sky.material.uniforms[ 'sunPosition' ].value.copy( sun );
      water.material.uniforms[ 'sunDirection' ].value.copy( sun ).normalize();
      scene.environment = pmremGenerator.fromScene( sky ).texture;
    }
    updateSun();

    // 岛
    const loader = new GLTFLoader();
    loader.load(islandModel, mesh => {
      mesh.scene.position.set(0, -2, 0);
      mesh.scene.scale.set(30, 30, 30);
      scene.add(mesh.scene);
    });

    // 虹
    const material = new THREE.ShaderMaterial({
      side: THREE.DoubleSide,
      transparent: true,
      uniforms: {},
      vertexShader: [
        'varying vec2 vUV;',
        'varying vec3 vNormal;',
        'void main() {',
        'vUV = uv;',
        'vNormal = vec3( normal );',
        'gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',
        '}'
      ].join('\n'),

      fragmentShader: [
        'varying vec2 vUV;',
        'varying vec3 vNormal;',
        'void main() {',
        'vec4 c = vec4( abs( vNormal ) + vec3(vUV, 0.0), 0.3);',
        'gl_FragColor = c;',
        '}'
      ].join('\n')
    });
    const geometry = new THREE.TorusGeometry(120, 10, 50, 100);
    const torus = new THREE.Mesh(geometry, material);
    console.log(torus)
    torus.opacity = .1;
    torus.position.set(0, -10, -250);
    scene.add(torus);

    const animate = () => {
      requestAnimationFrame(animate);
      water.material.uniforms[ 'time' ].value += 1.0 / 60.0;
      stats && stats.update();
      controls && controls.update();
      renderer.render(scene, camera);
    }
    animate();
  }

  render () {
    return (
      <canvas className='webgl'></canvas>
    )
  }
}