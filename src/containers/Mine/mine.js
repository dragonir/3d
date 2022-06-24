/**
* Author: Vinces
* Website: https://vinces.io
* v.0.1
* Three.js -  Low Poly Floating Island in Threejs geometry only
* Work In Progress
* -----
*/
/**
* DEFAULTS
* ------------------------------------------------------------------------
*/
var container = { width: window.innerWidth, height: window.innerHeight };

/**
* HELPERS
* ------------------------------------------------------------------------
*/
// Rotate arms / legs
const degreesToRadians = (degrees) => { 
  return degrees * (Math.PI / 180); 
};
// Add shadow support to object
const shadowSupport = (group) => {
  group.traverse((object) => {
    if (object instanceof THREE.Mesh) {
      object.castShadow = true;
      object.receiveShadow = true;
    }
  });
};
// Get random number
const randomize = (min, max, float = false) => {
  const val = Math.random() * (max - min) + min;
  if (float) {
    return val;
  }
  return Math.floor(val);
};
// Box Helper 
const boxHelperSupport = (group) => {
  const box = new THREE.BoxHelper(group, 0xffff00);
  scene.add(box);
};
// Random MORE VERTICES
const map = (val, smin, smax, emin, emax) => ((emax - emin) * (val - smin)) / (smax - smin) + emin;
const jitter = (geo, per) => geo.vertices.forEach((v) => {
    v.x += map(Math.random(), 0, 1, -per, per);
    v.y += map(Math.random(), 0, 1, -per, per);
    v.z += map(Math.random(), 0, 1, -per, per);
});
// Cut Object helpers
const chopBottom = (geo, bottom) => geo.vertices.forEach((v) => (v.y = Math.max(v.y, bottom)));
const chopTop = (geo, top) => geo.vertices.forEach((v) => (v.y = Math.min(v.y, top)));



/**
* OBJECTS : SCENE, ISLAND, BBLOCK
* ------------------------------------------------------------------------
*/
class Scene {
  constructor(params) {
		this.params = {
			x: 0,
			y: 0,
			z: 0,
      aspectRatio: container.width / container.height,
      fieldOfView: 60,
      nearPlane: 0.1,
      farPlane: 3000,
			...params
		}
    this.camera;
    this.scene;
    this.controls;
    this.renderer;
	}
  initStats(){
    // STATS
    this.stats = new Stats();
    this.stats.setMode(0); // 0: fps, 1: ms, 2: mb, 3+: custom
    // align top-left
    this.stats.domElement.style.position = "absolute";
    this.stats.domElement.style.left = "0px";
    this.stats.domElement.style.top = "0px";
    document.body.appendChild(this.stats.domElement);
  }
  initScene(){
    this.scene = new THREE.Scene();
    this.scene.background = null; /*new THREE.Color(0xa3e2ff)*/
    this.scene.fog = new THREE.FogExp2( 0x6dd5fa, 0.015 );
  }
  initCamera(){
    this.camera = new THREE.PerspectiveCamera(
      this.params.fieldOfView,
      this.params.aspectRatio,
      this.params.nearPlane,
      this.params.farPlane
    );
    //this.camera.position.set(0, 3.5, 22);
    this.camera.updateProjectionMatrix();
    this.camera.position.set(6, 8.5, 25);
    this.camera.lookAt(this.scene.position);
  }
  initControls(){
    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    // Force control
    // controls.minPolarAngle = -Math.PI*.45;
    // controls.maxPolarAngle = Math.PI*.45;
    this.controls.minDistance = 10;
    this.controls.maxDistance = 10000;
    this.controls.autoRotate = true;
    this.controls.autoRotateSpeed = -3;
  }
  initRenderer(){
    let pixelRatio = window.devicePixelRatio
    let AA = true
    if (pixelRatio > 1) { AA = false }
    const canvas = document.querySelector("[data-canvas]");
    this.renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: AA, powerPreference: "high-performance" });
    this.renderer.setSize(container.width, container.height);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    //renderer.setClearColor(0xc5f5f5, 0);
    this.renderer.physicallyCorrectLights; /*accurate lighting that uses SI units.*/
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.soft = true;
  }
  initLights(){
    this.directionalLight = new THREE.DirectionalLight(0xffffff, 0.4, 100);
    this.light = new THREE.HemisphereLight(0xffffff, 0xb3858c, 0.9);

    this.scene.add(this.light);
    this.scene.add(this.directionalLight);

    this.directionalLight.position.set(10, 12, 8);
    this.directionalLight.castShadow = true;
    this.directionalLight.receiveShadow = true;
    this.directionalLight.shadow.mapSize.width = 512; // default
    this.directionalLight.shadow.mapSize.height = 512; // default
    this.directionalLight.shadow.camera.near = 0.5; // default
    this.directionalLight.shadow.camera.far = 500;
  }
  render(){
    this.stats.begin();
    requestAnimationFrame(this.render.bind(this));
    this.renderer.render(this.scene, this.camera);
    this.stats.end();
  }
  init() {
    this.initStats();
    this.initScene();
    this.initCamera();
    this.initRenderer();
    this.initControls();
    this.initLights();
  }
}

class Island {
  constructor(scenesss, params) {
		this.params = {
			x: 0,
			y: 0,
			z: 0,
      herbs: 2,
			...params
		}
		
		// Create group and add to scene
		this.island = new THREE.Group()
		scenesss.add(this.island)
		
		// Position according to params
		this.island.position.x = this.params.x
		this.island.position.y = this.params.y
		this.island.position.z = this.params.z
    
    // TEXTURES
    this.cloudMaterial = new THREE.MeshPhongMaterial({ color: 0xdef9ff, transparent: true, opacity: 0.8, flatShading: true });
    this.greenMaterial = new THREE.MeshPhongMaterial({ color: 0x379351, flatShading: true });
    this.earthMaterial = new THREE.MeshPhongMaterial({ color: 0x664e31, flatShading: true });
    this.stoneMaterial = new THREE.MeshLambertMaterial({ color: 0x9eaeac });
	}
  drawGround() {
    this.ground = new THREE.Group();
    const geoGround = new THREE.CylinderGeometry(7, 2, 9, 12, 5);
    jitter(geoGround, 0.6);
    geoGround.translate(0, -0.5, 0);
    const earth = new THREE.Mesh(geoGround, this.earthMaterial);

    const geoGreen = new THREE.CylinderGeometry(7.4, 5.5, 3.7, 30, 2);
    jitter(geoGreen, 0.2);
    geoGreen.translate(0, 3.1, 0);
    const green = new THREE.Mesh(geoGreen, this.greenMaterial);
    
    const geoGroundParticule = new THREE.TetrahedronGeometry(randomize(0.5, 1.5), randomize(2, 3));
    jitter(geoGroundParticule, 0.2);
    //geoGroundParticule.translate(-5, randomize(-4, -1, true), randomize(-2, 2, true));
    const particule = new THREE.Mesh(geoGroundParticule, this.earthMaterial);
    particule.scale.set(randomize(1, 1.5, true), randomize(1, 1.8, true), randomize(1, 1.5, true));
    particule.position.set(-5, randomize(-4, -1, true), randomize(-2, 2, true));
    this.ground.add(particule);
    
    this.ground.add(earth);
    this.ground.add(green);
    this.ground.position.y = -5.6;
    shadowSupport(this.ground);
    this.island.add(this.ground);
  }
  drawCloud() {
    this.clouds = new THREE.Group();

    const geoCloud = new THREE.SphereGeometry(2, 6, 6);
    jitter(geoCloud, 0.2);
    const cloud = new THREE.Mesh(geoCloud, this.cloudMaterial);
    cloud.scale.set(1, 0.8, 1);

    const cloud2 = cloud.clone();
    cloud2.scale.set(0.75, 0.5, 1);
    cloud2.position.set(1.95, -0.5, 0);

    const cloud3 = cloud.clone();
    cloud3.scale.set(0.75, 0.5, 1);
    cloud3.position.set(-1.85, -1, 0);

    this.clouds.add(cloud);
    this.clouds.add(cloud2);
    this.clouds.add(cloud3);

    shadowSupport(this.clouds);

    this.clouds.position.x = -5;
    this.clouds.position.y = 8;
    this.clouds.position.z = -4.6;

    this.island.add(this.clouds);

    const cloneCloudGroup = this.clouds.clone();
    cloneCloudGroup.scale.set(1, 1.2, 1.2);
    cloneCloudGroup.position.x = 6;
    cloneCloudGroup.position.y = -9;
    cloneCloudGroup.position.z = 4;

    this.island.add(cloneCloudGroup);
  }
  drawRocks() {
    this.rocks = new THREE.Group();
    const geoRocks = new THREE.DodecahedronGeometry(1, 0);
    //jitter(geometry,0.6) /*chopTop(geometry,2)*/
    //geometry.translate(0,0,0);
    const rock = new THREE.Mesh(geoRocks, this.stoneMaterial);
    rock.scale.set(randomize(0.8, 1.2, true), randomize(0.5, 3, true), 1);
    const rock2 = rock.clone();
    rock2.scale.set(randomize(0.8, 1.2, true), randomize(0.5, 3, true), 1);
    rock2.position.set(1.2, 0, -1.3);

    this.rocks.add(rock);
    this.rocks.add(rock2);
    this.rocks.position.x = -5;
    this.rocks.position.y = 0;
    this.rocks.position.z = -2.5;
    
    shadowSupport(this.rocks);
    this.island.add(this.rocks);
  }
  drawHerbs(position = {x: 1.1, y: 0, z: 2}) {
    const width = 0.2;
    this.herbs = new THREE.Group();
    const geoHerbs = new THREE.ConeBufferGeometry(width, 1, 6);
    const herb = new THREE.Mesh(geoHerbs, this.greenMaterial);
    herb.position.set(0, -0.40, 0);
    herb.rotation.set(0, randomize(-0.7, 0.7, true), 0);
    this.herbs.add(herb);
    
    let i;

    for (i = 0; i < 2; i++) {
      const herbX = herb.clone();
      herbX.position.set(randomize(-0.5, 0.5, true), -0.40, randomize(-0.5, 0.5, true));
      herbX.rotation.set(randomize(-0.2, 0.2, true), randomize(-0.7, 0.7, true), randomize(-0.2, 0.2, true));
      this.herbs.add(herbX);
    }
  
    this.herbs.position.x = position.x;
    this.herbs.position.y = position.y;
    this.herbs.position.z = position.z;
    shadowSupport(this.herbs);
    this.island.add(this.herbs);
  }
  init() {
    this.drawGround();
    this.drawCloud();
    this.drawRocks();
  
    this.drawHerbs();
    let i;
    for (i = 0; i < this.params.herbs; i++) {
      this.drawHerbs({x: randomize(-5, 5, true), y: 0, z: randomize(-5, 5, true)});
    }
  }
}

class Bblock {
  constructor(scenesss, params) {
		this.params = {
			x: 0,
			y: 0,
			z: 0,
			...params
		}
    // Create group and add to scene
		this.bblock = new THREE.Group()
		scenesss.add(this.bblock)
    
    // Position according to params
		this.bblock.position.x = this.params.x
		this.bblock.position.y = this.params.y
		this.bblock.position.z = this.params.z
    
    this.arms = [];
    this.legs = [];
    
        // TEXTURES
    this.skinMaterial = new THREE.MeshPhongMaterial({ color: 0xffdbac, flatShading: false });
    this.hairMaterial = new THREE.MeshPhongMaterial({ color: 0x543f3a, flatShading: false });
    this.pantsMaterial = new THREE.MeshPhongMaterial({ color: 0x333333, flatShading: false });
    this.sweatMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff, flatShading: false });
    this.shoesMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff, flatShading: false });
  }
  drawHead(){
    // cube = new THREE.Mesh(new THREE.CubeGeometry(2, 2, 2), new THREE.MeshNormalMaterial());
    this.head = new THREE.Mesh(new THREE.BoxBufferGeometry(2.5, 2.5, 2.5), this.skinMaterial);
    this.head.castShadow = true;
    this.head.receiveShadow = true;
    this.head.position.set(0, 4.8, 0);

    this.hair = new THREE.Mesh(new THREE.BoxBufferGeometry(2.95, 2.5, 2.3), this.hairMaterial);
    this.hair.castShadow = true;
    this.hair.receiveShadow = true;
    this.hair.position.set(0, 5.3, -0.3);

    this.hairFront = new THREE.Mesh(new THREE.BoxBufferGeometry(1.5, 0.5, 0.8), this.hairMaterial);
    this.hairFront.castShadow = true;
    this.hairFront.receiveShadow = true;
    this.hairFront.position.set(0, 6.3, 0.85);

    const geoHairBun = new THREE.Geometry();
    const tuft1 = new THREE.BoxGeometry(1.3, 1.3, 1.3).translate(0, 0, 0);
    const tuft2 = new THREE.BoxGeometry(0.8, 0.8, 0.8).translate(0, 0.5, -0.5);
    geoHairBun.merge(tuft1);
    geoHairBun.merge(tuft2);

    this.hairBun = new THREE.Mesh(geoHairBun, this.hairMaterial);
    this.hairBun.position.set(0, 6.3, -1.3);
    shadowSupport(this.hairBun);

    this.bblock.add(this.head);
    this.bblock.add(this.hair);
    this.bblock.add(this.hairFront);
    this.bblock.add(this.hairBun);
  }
  drawEyes() {
    this.retines = new THREE.Group();
    this.eyesbrow = new THREE.Group();
    const geoRetine = new THREE.BoxBufferGeometry(0.2, 0.5, 0.1);
    const geoEyebrow = new THREE.BoxBufferGeometry(0.8, 0.25, 0.1);

    let i;

    for (i = 0; i < 2; i++) {
      const retine = new THREE.Mesh(geoRetine, this.pantsMaterial);
      const eyebrow = new THREE.Mesh(geoEyebrow, this.hairMaterial);

      this.retines.add(retine);
      this.eyesbrow.add(eyebrow);

      const m = i % 2 === 0 ? 0.5 : -0.5;
      retine.position.x = m;
      eyebrow.position.x = m;
    }

    this.head.add(this.retines);
    this.head.add(this.eyesbrow);
    
    shadowSupport(this.eyesbrow);

    this.retines.position.y = 0;
    this.retines.position.z = 1.30;
    this.eyesbrow.position.y = 0.7;
    this.eyesbrow.position.z = 1.30;
  }
  drawBody(){
    this.body = new THREE.Mesh(new THREE.BoxBufferGeometry(2.3, 2, 2.2), this.sweatMaterial);
    this.body.castShadow = true;
    this.body.receiveShadow = true;
    this.body.position.set(0, 2.5, 0);
    this.bblock.add(this.body);
  }
  drawArms() {
    const height = 1.9;
    const geoArms = new THREE.BoxBufferGeometry(0.45, height, 0.85);
    const geoHands = new THREE.BoxBufferGeometry(0.45, 0.2, 0.65);

    let i;

    for (i = 0; i < 2; i++) {
      const armGroup = new THREE.Group()
      const arm = new THREE.Mesh(geoArms, this.sweatMaterial);
      const hand = new THREE.Mesh(geoHands, this.skinMaterial);

      armGroup.add(arm);
      armGroup.add(hand);
      this.arms.push(armGroup);
      this.bblock.add(armGroup);

      shadowSupport(armGroup);
      
      const m = i % 2 === 0 ? 1 : -1;
      armGroup.position.x = m * 1.4;
      armGroup.position.y = 3.5;
      arm.position.y = height * -0.5;
      hand.position.y = -height - 0.1;
    }
  }
  drawLegs() {
    const height = 1.8;
    const geoPants = new THREE.BoxBufferGeometry(0.9, height, 1.6);
    const geoFoot = new THREE.BoxBufferGeometry(0.75, 0.45, 1.9);

    let i;

    for (i = 0; i < 2; i++) {
      const legGroup = new THREE.Group();
      const leg = new THREE.Mesh(geoPants, this.pantsMaterial);
      const foot = new THREE.Mesh(geoFoot, this.shoesMaterial);
      
      legGroup.add(leg);
      legGroup.add(foot);
      this.legs.push(legGroup);
      this.bblock.add(legGroup)
      
      shadowSupport(legGroup);
      
      const m = i % 2 === 0 ? 0.5 : -0.5;
      legGroup.position.x = m;
      legGroup.position.y = 1.4;
      leg.position.y = height * -0.45;
      foot.position.y = -height - 0.1;
      foot.position.z = 0.2;
    }
  }
  moveArms(angle) {
    this.arms.forEach((arm, i) => {
      const m = i % 2 === 0 ? 1 : -1;
      arm.rotation.x = degreesToRadians(angle * m);
    });
  }
  moveLegs(angle) {
    this.legs.forEach((leg, i) => {
      const m = i % 2 === 0 ? 1 : -1;
      leg.rotation.x = degreesToRadians(angle * m);
    });
  }
  init() {
    this.drawHead();
    this.drawEyes();
    this.drawBody();
    this.drawArms();
    this.drawLegs();
  }
}  



/**
* GENERATOR
* ------------------------------------------------------------------------
*/
// Generate Scene
const scene = new Scene();
scene.init();
scene.render();

// Generate Island
const island = new Island(scene.scene, {x: 0,y: 0,z: 0, herbs: 10});
island.init();
// Generate Bblock
const bblock = new Bblock(scene.scene);
bblock.init();

// Other Island Example
const island2 = new Island(scene.scene, {x: 25,y: -40, z:-70, herbs: 10});
island2.init();
const bblock2 = new Bblock(scene.scene, {x: 25,y: -40, z:-70, herbs: 10});
bblock2.init();


const island3 = new Island(scene.scene, {x: -70,y: 20, z:-100, herbs: 10});
island3.init();
const bblock3 = new Bblock(scene.scene, {x: -70,y: 20, z:-100, herbs: 10});
bblock3.init();


// Trigger
const inputboth = document.querySelector("[data-input-both]");
inputboth.addEventListener("input", (e) => {
  bblock.moveArms(-e.target.value);
  bblock.moveLegs(e.target.value);
});
// Resize
window.addEventListener('resize', () => {
  container.width = window.innerWidth;
  container.height = window.innerHeight;
  scene.camera.aspect = container.width / container.height;
  scene.camera.updateProjectionMatrix();
  scene.renderer.setSize(window.innerWidth, window.innerHeight);
})
    



