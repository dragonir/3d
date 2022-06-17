import './index.styl';
import React from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';
import { mergeBufferGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils';
import * as dat from 'dat.gui';
import imgData from '@/containers/EarthDigital/images/earth.jpg';
import lineFragmentShader from '@/containers/EarthDigital/shaders/line/fragment.glsl';

export default class Earth extends React.Component {
  componentDidMount() {
    this.initThree()
  }

  initThree = () => {
    let o;
    let scene = new THREE.Scene();
    scene.background = new THREE.Color(0.0, 0.0, 0.125);
    let camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 50);
    camera.position.set(0, 10, 10);

    const renderer = new THREE.WebGLRenderer({
      canvas: document.querySelector('canvas.webgl'),
      antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    let controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enablePan = false;

    let params = {
      colors: {
        base: "#555fff",
        gradInner: "#64ff64",
        gradOuter: "#64ffff"
      },
      reset: () => {controls.reset()}
    }

    let maxImpactAmount = 40;
    let impacts = [];
    let trails = [];
    for (let i = 0; i < maxImpactAmount; i++) {
      impacts.push({
        impactPosition: new THREE.Vector3().random().subScalar(0.5).setLength(5),
        impactMaxRadius: 5 * THREE.Math.randFloat(0.5, 0.75),
        impactRatio: 0,
        prevPosition: new THREE.Vector3().random().subScalar(0.5).setLength(5),
        trailRatio: {value: 0},
        trailLength: {value: 0}
      });
      makeTrail(i);
    }

    let uniforms = {
      impacts: {value: impacts},
      maxSize: {value: 0.04},
      minSize: {value: 0.03},
      waveHeight: {value: 0.125},
      scaling: {value: 2},
      gradInner: {value: new THREE.Color(params.colors.gradInner)},
      gradOuter: {value: new THREE.Color(params.colors.gradOuter)}
    }

    console.log(uniforms.gradInner)

    var tweens = [];

    for (let i = 0; i < maxImpactAmount; i++) {
      tweens.push({
        runTween: () => {
          let path = trails[i];
          let speed = 3;
          let len = path.geometry.attributes.lineDistance.array[99];
          let dur = len / speed;
          let tweenTrail = new TWEEN.Tween({value: 0})
            .to({value: 1}, dur * 1000)
            .onUpdate( val => {
              impacts[i].trailRatio.value = val.value;
            });
            var tweenImpact = new TWEEN.Tween({ value: 0 })
            .to({ value: 1 }, THREE.Math.randInt(2500, 5000))
            .onUpdate(val => {
              uniforms.impacts.value[i].impactRatio = val.value;
            })
            .onComplete(val => {
              impacts[i].prevPosition.copy(impacts[i].impactPosition);
              impacts[i].impactPosition.random().subScalar(0.5).setLength(5);
              setPath(path, impacts[i].prevPosition, impacts[i].impactPosition, 1);
              uniforms.impacts.value[i].impactMaxRadius = 5 * THREE.Math.randFloat(0.5, 0.75);
              tweens[i].runTween();
            });
          tweenTrail.chain(tweenImpact);
          tweenTrail.start();
        }
      });
    }

    tweens.forEach(t => {t.runTween();})
    makeGlobeOfPoints();
    window.addEventListener( 'resize', onWindowResize );

    const gui = new dat.GUI();
    console.log(gui)
    gui.add(uniforms.maxSize, "value", 0.01, 0.06).step(0.001).name("land");
    gui.add(uniforms.minSize, "value", 0.01, 0.06).step(0.001).name("ocean");
    gui.add(uniforms.waveHeight, "value", 0.1, 1).step(0.001).name("waveHeight");
    gui.add(uniforms.scaling, "value", 1, 5).step(0.01).name("scaling");
    gui.addColor(params.colors, "base").name("base color").onChange(val => {
      if (o) o.material.color.set(val);
    });
    gui.addColor(params.colors, "gradInner").name("inner").onChange(val => {
      uniforms.gradInner.value.set(val);
    });
    gui.addColor(params.colors, "gradOuter").name("outer").onChange(val => {
      uniforms.gradOuter.value.set(val);
    });
    gui.add(params, "reset").name("Reset Controls");
    gui.close();
    // gui.hide();

    renderer.setAnimationLoop( _ => {
      TWEEN.update();
      o.rotation.y += 0.001;
      renderer.render(scene, camera);
    })

    function makeGlobeOfPoints(){
      let dummyObj = new THREE.Object3D();
      let p = new THREE.Vector3();
      let sph = new THREE.Spherical();
      let geoms = [];
      let tex = new THREE.TextureLoader().load(imgData);
      let counter = 75000;
      let rad = 5;
      let r = 0;
      let dlong = Math.PI * (3 - Math.sqrt(5));
      let dz = 2 / counter;
      let long = 0;
      let z = 1 - dz / 2;
      for (let i = 0; i < counter; i++) {
        r = Math.sqrt(1 - z * z);
        p.set( Math.cos(long) * r, z, -Math.sin(long) * r).multiplyScalar(rad);
        z = z - dz;
        long = long + dlong;
        sph.setFromVector3(p);
        dummyObj.lookAt(p);
        dummyObj.updateMatrix();
        let g =  new THREE.PlaneGeometry(1, 1);
        g.applyMatrix4(dummyObj.matrix);
        g.translate(p.x, p.y, p.z);
        let centers = [
          p.x, p.y, p.z,
          p.x, p.y, p.z,
          p.x, p.y, p.z,
          p.x, p.y, p.z
        ];
        let uv = new THREE.Vector2(
          (sph.theta + Math.PI) / (Math.PI * 2),
          1. - sph.phi / Math.PI
        );
        let uvs = [
          uv.x, uv.y,
          uv.x, uv.y,
          uv.x, uv.y,
          uv.x, uv.y
        ];
        g.setAttribute("center", new THREE.Float32BufferAttribute(centers, 3));
        g.setAttribute("baseUv", new THREE.Float32BufferAttribute(uvs, 2));
        geoms.push(g);
      }
      let g = mergeBufferGeometries(geoms);
      let m = new THREE.MeshBasicMaterial({
        color: new THREE.Color(params.colors.base),
        onBeforeCompile: shader => {
          shader.uniforms.impacts = uniforms.impacts;
          shader.uniforms.maxSize = uniforms.maxSize;
          shader.uniforms.minSize = uniforms.minSize;
          shader.uniforms.waveHeight = uniforms.waveHeight;
          shader.uniforms.scaling = uniforms.scaling;
          shader.uniforms.gradInner = uniforms.gradInner;
          shader.uniforms.gradOuter = uniforms.gradOuter;
          shader.uniforms.tex = {value: tex};
          shader.vertexShader = `
            struct impact {
              vec3 impactPosition;
              float impactMaxRadius;
              float impactRatio;
            };
            uniform impact impacts[${maxImpactAmount}];
            uniform sampler2D tex;
            uniform float maxSize;
            uniform float minSize;
            uniform float waveHeight;
            uniform float scaling;

            attribute vec3 center;
            attribute vec2 baseUv;

            varying float vFinalStep;
            varying float vMap;

            ${shader.vertexShader}
          `.replace(
            `#include <begin_vertex>`,
            `#include <begin_vertex>
            float finalStep = 0.0;
            for (int i = 0; i < ${maxImpactAmount};i++){
              float dist = distance(center, impacts[i].impactPosition);
              float curRadius = impacts[i].impactMaxRadius * impacts[i].impactRatio;
              float sstep = smoothstep(0., curRadius, dist) - smoothstep(curRadius - ( 0.25 * impacts[i].impactRatio ), curRadius, dist);
              sstep *= 1. - impacts[i].impactRatio;
              finalStep += sstep;
            }
            finalStep = clamp(finalStep, 0., 1.);
            vFinalStep = finalStep;

            float map = texture(tex, baseUv).g;
            vMap = map;
            float pSize = map < 0.5 ? maxSize : minSize;
            float scale = scaling;

            transformed = (position - center) * pSize * mix(1., scale * 1.25, finalStep) + center; // scale on wave
            transformed += normal * finalStep * waveHeight; // lift on wave
            `
          );
          shader.fragmentShader = `
            uniform vec3 gradInner;
            uniform vec3 gradOuter;
            varying float vFinalStep;
            varying float vMap;
            ${shader.fragmentShader}
            `.replace(
            `vec4 diffuseColor = vec4( diffuse, opacity );`,
            `
            // shaping the point, pretty much from The Book of Shaders
            vec2 hUv = (vUv - 0.5);
            int N = 8;
            float a = atan(hUv.x,hUv.y);
            float r = PI2/float(N);
            float d = cos(floor(.5+a/r)*r-a)*length(hUv);
            float f = cos(PI / float(N)) * 0.5;
            if (d > f) discard;

            vec3 grad = mix(gradInner, gradOuter, clamp( d / f, 0., 1.)); // gradient
            vec3 diffuseMap = diffuse * ((vMap > 0.5) ? 0.5 : 1.);
            vec3 col = mix(diffuseMap, grad, vFinalStep); // color on wave
            //if (!gl_FrontFacing) col *= 0.25; // moderate the color on backside
            vec4 diffuseColor = vec4( col , opacity );
            `
          );
        }
      });
      m.defines = {"USE_UV":""};
      o = new THREE.Mesh(g, m);
      o.rotation.y = Math.PI;
      trails.forEach(t => {o.add(t)});
      o.add(new THREE.Mesh(new THREE.SphereGeometry(4.9995, 72, 36), new THREE.MeshBasicMaterial({color: scene.background})));
      scene.add(o);
    }

    function makeTrail(idx){
      let pts = new Array(100 * 3).fill(0);
      let g = new THREE.BufferGeometry();
      g.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
      let m = new THREE.LineDashedMaterial({
        color: params.colors.gradOuter,
        transparent: true,
        onBeforeCompile: shader => {
          shader.uniforms.actionRatio = impacts[idx].trailRatio;
          shader.uniforms.lineLength = impacts[idx].trailLength;
          shader.fragmentShader = lineFragmentShader;
        }
      });
      let l = new THREE.Line(g, m);
      l.userData.idx = idx;
      setPath(l, impacts[idx].prevPosition, impacts[idx].impactPosition, 1);
      trails.push(l);
    }

    function setPath(l, startPoint, endPoint, peakHeight, cycles) {
      let pos = l.geometry.attributes.position;
      let division = pos.count - 1;
      let cycle = cycles || 1;
      let peak = peakHeight || 1;
      let radius = startPoint.length();
      let angle = startPoint.angleTo(endPoint);
      let arcLength = radius * angle;
      let diameterMinor = arcLength / Math.PI;
      let radiusMinor = (diameterMinor * 0.5) / cycle;
      let peakRatio = peak / diameterMinor;
      let radiusMajor = startPoint.length() + radiusMinor;
      let basisMajor = new THREE.Vector3().copy(startPoint).setLength(radiusMajor);
      let basisMinor = new THREE.Vector3().copy(startPoint).negate().setLength(radiusMinor);
      let tri = new THREE.Triangle(startPoint, endPoint, new THREE.Vector3());
      let nrm = new THREE.Vector3();
      tri.getNormal(nrm);
      let v3Major = new THREE.Vector3();
      let v3Minor = new THREE.Vector3();
      let v3Inter = new THREE.Vector3();
      let vFinal = new THREE.Vector3();
      for (let i = 0; i <= division; i++) {
        let divisionRatio = i / division;
        let angleValue = angle * divisionRatio;
        v3Major.copy(basisMajor).applyAxisAngle(nrm, angleValue);
        v3Minor.copy(basisMinor).applyAxisAngle(nrm, angleValue + Math.PI * 2 * divisionRatio * cycle);
        v3Inter.addVectors(v3Major, v3Minor);
        let newLength = ((v3Inter.length() - radius) * peakRatio) + radius;
        vFinal.copy(v3Inter).setLength(newLength);
        pos.setXYZ(i, vFinal.x, vFinal.y, vFinal.z);
      }
      pos.needsUpdate = true;
      l.computeLineDistances();
      l.geometry.attributes.lineDistance.needsUpdate = true;
      impacts[l.userData.idx].trailLength.value = l.geometry.attributes.lineDistance.array[99];
      l.material.dashSize = 3;
    }

    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize( window.innerWidth, window.innerHeight );
    }
  }

  render () {
    return (
      <div className='earth_digital'>
        <canvas className='webgl'></canvas>
      </div>
    )
  }
}