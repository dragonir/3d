import React from 'react';
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import Stats from "three/examples/jsm/libs/stats.module";
import { Water } from 'three/examples/jsm/objects/Water';
import waterTexture from '@/containers/Ocean/images/waternormals.jpg';
import { Sky } from 'three/examples/jsm/objects/Sky';
import islandModel from '@/containers/Ocean/models/island.glb';
import flamingoModel from '@/containers/Ocean/models/flamingo.glb';

export default class Earth extends React.Component {
  componentDidMount() {
    this.initThree()
  }

  initThree = () => {
    const renderer = new THREE.WebGLRenderer({
      canvas: document.querySelector('canvas.webgl'),
      antialias: true
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    // renderer.outputEncoding = THREE.sRGBEncoding;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 1, 20000);
    camera.position.set(0, 35, 140);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0, 0);
    controls.enableDamping = true;

    const stats = new Stats();
    document.documentElement.appendChild(stats.dom);

    const ambientLight = new THREE.AmbientLight(0xffffff, .8);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, .8);
    dirLight.color.setHSL( 0.1, 1, 0.95 );
    dirLight.position.set( - 1, 1.75, 1 );
    dirLight.position.multiplyScalar( 30 );
    scene.add( dirLight );

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
    });
    water.rotation.x = - Math.PI / 2;
    scene.add( water );

    // 太阳
    const sun = new THREE.Vector3();

    // 天空
    const sky = new Sky();
    sky.scale.setScalar(10000);
    scene.add( sky );
    const skyUniforms = sky.material.uniforms;
    skyUniforms[ 'turbidity' ].value = 20;
    skyUniforms[ 'rayleigh' ].value = 2;
    skyUniforms[ 'mieCoefficient' ].value = 0.005;
    skyUniforms[ 'mieDirectionalG' ].value = 0.8;

    const parameters = {
      elevation: 2,
      azimuth: 180
    };

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const updateSun = () => {
      const phi = THREE.MathUtils.degToRad( 90 - parameters.elevation );
      const theta = THREE.MathUtils.degToRad( parameters.azimuth );
      sun.setFromSphericalCoords( 1, phi, theta );
      sky.material.uniforms[ 'sunPosition' ].value.copy( sun );
      water.material.uniforms[ 'sunDirection' ].value.copy(sun).normalize();
      scene.environment = pmremGenerator.fromScene(sky).texture;
    }
    updateSun();

    // 岛
    const loader = new GLTFLoader();
    loader.load(islandModel, mesh => {
      mesh.scene.traverse(child => {
        if (child.isMesh) {
          child.material.metalness = .4;
          child.material.roughness = .6;
        }
      })
      mesh.scene.position.set(0, -2, 0);
      mesh.scene.scale.set(33, 33, 33);
      scene.add(mesh.scene);
    });

    // 鸟
    var mixers = [];
    loader.load(flamingoModel, gltf => {
      const mesh = gltf.scene.children[0];
      const s = 0.35;
      mesh.scale.set( s, s, s );
      mesh.position.set(-100, 80, -300);
      mesh.rotation.y = - 1;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      scene.add(mesh);

      const bird2 = mesh.clone();
      console.log(bird2)
      bird2.position.set(150, 80, -500);
      bird2.material.color = new THREE.Color('#ffffff')
      scene.add(bird2);

      const mixer = new THREE.AnimationMixer(mesh);
      mixer.clipAction(gltf.animations[0]).setDuration(1.2).play();
      mixers.push(mixer);

      const mixer2 = new THREE.AnimationMixer(bird2);
      mixer2.clipAction(gltf.animations[0]).setDuration(1.8).play();
      mixers.push(mixer2);
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
        'vec4 c = vec4( abs( vNormal ) + vec3(vUV, 0.0), 0.1);',
        'gl_FragColor = c;',
        '}'
      ].join('\n')
    });
    const geometry = new THREE.TorusGeometry(200, 10, 50, 100);
    const torus = new THREE.Mesh(geometry, material);
    console.log(torus)
    torus.opacity = .1;
    torus.position.set(0, -50, -400);
    scene.add(torus);

    const clock = new THREE.Clock();
    const animate = () => {
      requestAnimationFrame(animate);
      water.material.uniforms[ 'time' ].value += 1.0 / 60.0;
      stats && stats.update();
      controls && controls.update();

      const delta = clock.getDelta();

				for ( let i = 0; i < mixers.length; i ++ ) {

					mixers[ i ].update( delta );

				}
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