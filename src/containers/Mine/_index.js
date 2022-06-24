const worldDOM = document.createElement('div');
worldDOM.setAttribute('id', 'world');
document.body.appendChild(worldDOM);

const titleDOM = document.createElement('h1');
const text = document.createTextNode('3D可视化概述');
titleDOM.appendChild(text);
document.body.appendChild(titleDOM);

var Colors = {
	red: 0xf25346,
	yellow: 0xfffc00,
	white: 0xd8d0d1,
	brown: 0x59332e,
	pink: 0xF5986E,
	brownDark: 0x23190f,
	blue: 0x68c3c0,
	green: 0x458248,
	purple: 0x551A8B,
	lightgreen: 0x629265,
};

var scene, camera, fieldOfView, aspectRatio, nearPlane, farPlane, HEIGHT, WIDTH, renderer, container;

// 创建场景
function createScene() {
	HEIGHT = window.innerHeight;
	WIDTH = window.innerWidth;
	scene = new THREE.Scene();
  // 添加雾化效果
	scene.fog = new THREE.Fog('rgba(255, 250, 168, .1)', 300, 1000);
	// 创建摄像机
	aspectRatio = WIDTH / HEIGHT;
	fieldOfView = 60;
	nearPlane = 1;
	farPlane = 10000;
	camera = new THREE.PerspectiveCamera(
		fieldOfView,
		aspectRatio,
		nearPlane,
		farPlane
	);
	// 设置摄像机位置
	camera.position.x = 0;
	camera.position.y = 150;
	camera.position.z = 100;	

	// 创建renderer
	renderer = new THREE.WebGLRenderer ({
		alpha: true,
		antialias:true
	});
	// 将renderer尺寸设置为全屏
	renderer.setSize (WIDTH, HEIGHT);
	// 开启阴影
	renderer.shadowMap.enabled = true;
	// 将Renderer绑定到DOM中.
	container = document.getElementById('world');
	container.appendChild (renderer.domElement);
	// 屏幕自适应监听
	window.addEventListener('resize', handleWindowResize, false);
}

// 屏幕自适应
function handleWindowResize() {
	HEIGHT = window.innerHeight;
	WIDTH = window.innerWidth;
	renderer.setSize(WIDTH, HEIGHT);
	camera.aspect = WIDTH / HEIGHT;
	camera.updateProjectionMatrix();
}

var hemispshereLight, shadowLight;
function createLights(){
	// 设置环境光：天空、地面、强度
	hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x333333, .9)
	// 平行光
	shadowLight = new THREE.DirectionalLight(0xffffff, .9);
	shadowLight.position.set(0,350,350);
	shadowLight.castShadow = true;
	// 定义投影阴影的可见区域
	shadowLight.shadow.camera.left = -650;
	shadowLight.shadow.camera.right = 650;
	shadowLight.shadow.camera.top = 650;
	shadowLight.shadow.camera.bottom = -650;
	shadowLight.shadow.camera.near = 1;
	shadowLight.shadow.camera.far = 1000;
	// 阴影地图尺寸
	shadowLight.shadow.mapSize.width = 2048;
	shadowLight.shadow.mapSize.height = 2048;
	// 将所有光源添加到场景中
	scene.add(hemisphereLight);  
	scene.add(shadowLight);
}	

// 地面
Land = function(){
	var geom = new THREE.CylinderGeometry(600,600,1700,40,10);
	// 在x轴旋转
	geom.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI/2));
	// 创建材质
	var mat = new THREE.MeshPhongMaterial({
		color: Colors.lightgreen,
		shading:THREE.FlatShading,
	});
	// 创建对象的网格
	this.mesh = new THREE.Mesh(geom, mat);
	// 接收阴影
	this.mesh.receiveShadow = true;
}

// 轨道
Orbit = function(){
	var geom =new THREE.Object3D();
	this.mesh = geom;
}

// 太阳
Sun = function(){
	this.mesh = new THREE.Object3D();
	var sunGeom = new THREE.SphereGeometry(400, 20, 20 );
	var sunMat = new THREE.MeshPhongMaterial({
		color: Colors.yellow,
		shading:THREE.FlatShading,
	});
	var sun = new THREE.Mesh(sunGeom, sunMat);
	sun.castShadow = false;
	sun.receiveShadow = false;
	this.mesh.add(sun);
}

// 云
Cloud = function(){
	// 为云层创建新的容器
	this.mesh = new THREE.Object3D();
	// 立方体几何形状和材质
	var geom = new THREE.DodecahedronGeometry(20,0);
	var mat = new THREE.MeshPhongMaterial({
		color:Colors.white,  
	});
	var nBlocs = 3+Math.floor(Math.random()*3);
	for (var i=0; i<nBlocs; i++ ){
		// 克隆网格几何体
		var m = new THREE.Mesh(geom, mat);
			// 随机定位
			m.position.x = i*15;
			m.position.y = Math.random()*10;
			m.position.z = Math.random()*10;
			m.rotation.z = Math.random()*Math.PI*2;
			m.rotation.y = Math.random()*Math.PI*2;
			// 随机大小
			var s = .1 + Math.random()*.9;
			m.scale.set(s,s,s);
			this.mesh.add(m);
	}
}

Sky = function(){
	this.mesh = new THREE.Object3D();
	// 云 groups的数量
	this.nClouds = 25;
	// 间隔一致
	var stepAngle = Math.PI*2 / this.nClouds;
	// 创建云
	for(var i=0; i<this.nClouds; i++){
		var c = new Cloud();
		// 使用三角函数设置旋转和位置
		var a = stepAngle * i;
		// 这是轴中心和云本身之间的距离
		var h = 800 + Math.random()*200;
		c.mesh.position.y = Math.sin(a)*h;
		c.mesh.position.x = Math.cos(a)*h;		
		// 根据其位置旋转云
		c.mesh.rotation.z = a + Math.PI/2;
		// z 轴上云的随机深度
		c.mesh.position.z = -400-Math.random()*400;
		// 每个云的随机比例
		var s = 1+Math.random()*2;
		c.mesh.scale.set(s,s,s);
		this.mesh.add(c.mesh);
	}
}

Tree = function () {
	this.mesh = new THREE.Object3D();
	var matTreeLeaves = new THREE.MeshPhongMaterial( { color:Colors.green, shading:THREE.FlatShading});
	var geonTreeBase = new THREE.BoxGeometry( 10,20,10 );
	var matTreeBase = new THREE.MeshBasicMaterial( { color:Colors.brown});
	var treeBase = new THREE.Mesh(geonTreeBase,matTreeBase);
	treeBase.castShadow = true;
	treeBase.receiveShadow = true;
	this.mesh.add(treeBase);
	var geomTreeLeaves1 = new THREE.CylinderGeometry(1, 12*3, 12*3, 4 );
	var treeLeaves1 = new THREE.Mesh(geomTreeLeaves1,matTreeLeaves);
	treeLeaves1.castShadow = true;
	treeLeaves1.receiveShadow = true;
	treeLeaves1.position.y = 20
	this.mesh.add(treeLeaves1);
	var geomTreeLeaves2 = new THREE.CylinderGeometry( 1, 9*3, 9*3, 4 );
	var treeLeaves2 = new THREE.Mesh(geomTreeLeaves2,matTreeLeaves);
	treeLeaves2.castShadow = true;
	treeLeaves2.position.y = 40;
	treeLeaves2.receiveShadow = true;
	this.mesh.add(treeLeaves2);
	var geomTreeLeaves3 = new THREE.CylinderGeometry( 1, 6*3, 6*3, 4);
	var treeLeaves3 = new THREE.Mesh(geomTreeLeaves3,matTreeLeaves);
	treeLeaves3.castShadow = true;
	treeLeaves3.position.y = 55;
	treeLeaves3.receiveShadow = true;
	this.mesh.add(treeLeaves3);
}

Flower = function () {
	this.mesh = new THREE.Object3D();
	var geomStem = new THREE.BoxGeometry( 5,50,5,1,1,1 );
	var matStem = new THREE.MeshPhongMaterial( { color:Colors.green, shading:THREE.FlatShading});
	var stem = new THREE.Mesh(geomStem,matStem);
	stem.castShadow = false;
	stem.receiveShadow = true;
	this.mesh.add(stem);
	var geomPetalCore = new THREE.BoxGeometry(10,10,10,1,1,1);
	var matPetalCore = new THREE.MeshPhongMaterial({color:Colors.yellow, shading:THREE.FlatShading});
	petalCore = new THREE.Mesh(geomPetalCore, matPetalCore);
	petalCore.castShadow = false;
	petalCore.receiveShadow = true;
	var petalColor = petalColors [Math.floor(Math.random()*3)];
	var geomPetal = new THREE.BoxGeometry( 15,20,5,1,1,1 );
	var matPetal = new THREE.MeshBasicMaterial( { color:petalColor});
	geomPetal.vertices[5].y-=4;
	geomPetal.vertices[4].y-=4;
	geomPetal.vertices[7].y+=4;
	geomPetal.vertices[6].y+=4;
	geomPetal.translate(12.5,0,3);
  var petals = [];
  for(var i=0; i<4; i++){	
    petals[i]=new THREE.Mesh(geomPetal,matPetal);
    petals[i].rotation.z = i*Math.PI/2;
    petals[i].castShadow = true;
    petals[i].receiveShadow = true;
  }
	petalCore.add(petals[0],petals[1],petals[2],petals[3]);
	petalCore.position.y = 25;
	petalCore.position.z = 3;
	this.mesh.add(petalCore);
}

var petalColors = [Colors.red, Colors.yellow, Colors.blue];

// 森林
Forest = function(){
	this.mesh = new THREE.Object3D();
	// 树的数量
	this.nTrees = 300;
	// 间隔一致
	var stepAngle = Math.PI*2 / this.nTrees;
	// 创建树木
	for(var i=0; i<this.nTrees; i++){
		var t = new Tree();
		// 使用三角函数设置旋转和位置
		var a = stepAngle*i;
		// 这是轴中心和树本身之间的距离
		var h = 605;
		t.mesh.position.y = Math.sin(a)*h;
		t.mesh.position.x = Math.cos(a)*h;		
		// 根据其位置旋转树
		t.mesh.rotation.z = a + (Math.PI/2)*3;
		// z 轴上树的随机深度
		t.mesh.position.z = 0-Math.random()*600;
		// 随机设置每棵树的scale
		var s = .3+Math.random()*.75;
		t.mesh.scale.set(s,s,s);
		this.mesh.add(t.mesh);
	}

	// 树的数量
	this.nFlowers = 350;
	var stepAngle = Math.PI*2 / this.nFlowers;
	for(var i=0; i<this.nFlowers; i++){	
		var f = new Flower();
		var a = stepAngle*i;
		var h = 605;
		f.mesh.position.y = Math.sin(a)*h;
		f.mesh.position.x = Math.cos(a)*h;		
		f.mesh.rotation.z = a + (Math.PI/2)*3;
		f.mesh.position.z = 0-Math.random()*600;
		var s = .1+Math.random()*.3;
		f.mesh.scale.set(s,s,s);
		this.mesh.add(f.mesh);
	}
}

var AirPlane = function() {
	this.mesh = new THREE.Object3D();
	var geomCockpit = new THREE.BoxGeometry(80,50,50,1,1,1);
	var matCockpit = new THREE.MeshPhongMaterial({color:Colors.red, shading:THREE.FlatShading});
	geomCockpit.vertices[4].y-=10;
	geomCockpit.vertices[4].z+=20;
	geomCockpit.vertices[5].y-=10;
	geomCockpit.vertices[5].z-=20;
	geomCockpit.vertices[6].y+=30;
	geomCockpit.vertices[6].z+=20;
	geomCockpit.vertices[7].y+=30;
	geomCockpit.vertices[7].z-=20;
	var cockpit = new THREE.Mesh(geomCockpit, matCockpit);
	cockpit.castShadow = true;
	cockpit.receiveShadow = true;
	this.mesh.add(cockpit);
	// 创建引擎
	var geomEngine = new THREE.BoxGeometry(20,50,50,1,1,1);
	var matEngine = new THREE.MeshPhongMaterial({color:Colors.white, shading:THREE.FlatShading});
	var engine = new THREE.Mesh(geomEngine, matEngine);
	engine.position.x = 40;
	engine.castShadow = true;
	engine.receiveShadow = true;
	this.mesh.add(engine);
	// 创建尾巴
	var geomTailPlane = new THREE.BoxGeometry(15,20,5,1,1,1);
	var matTailPlane = new THREE.MeshPhongMaterial({color:Colors.red, shading:THREE.FlatShading});
	var tailPlane = new THREE.Mesh(geomTailPlane, matTailPlane);
	tailPlane.position.set(-35,25,0);
	tailPlane.castShadow = true;
	tailPlane.receiveShadow = true;
	this.mesh.add(tailPlane);
	// 创建机翼
	var geomSideWing = new THREE.BoxGeometry(40,4,150,1,1,1);
	var matSideWing = new THREE.MeshPhongMaterial({color:Colors.red, shading:THREE.FlatShading});
	var sideWingTop = new THREE.Mesh(geomSideWing, matSideWing);
	var sideWingBottom = new THREE.Mesh(geomSideWing, matSideWing);
	sideWingTop.castShadow = true;
	sideWingTop.receiveShadow = true;
	sideWingBottom.castShadow = true;
	sideWingBottom.receiveShadow = true;
	sideWingTop.position.set(20,12,0);
	sideWingBottom.position.set(20,-3,0);
	this.mesh.add(sideWingTop);
	this.mesh.add(sideWingBottom);
	var geomWindshield = new THREE.BoxGeometry(3,15,20,1,1,1);
	var matWindshield = new THREE.MeshPhongMaterial({color:Colors.white,transparent:true, opacity:.3, shading:THREE.FlatShading});;
	var windshield = new THREE.Mesh(geomWindshield, matWindshield);
	windshield.position.set(5,27,0);
	windshield.castShadow = true;
	windshield.receiveShadow = true;
	this.mesh.add(windshield);
	var geomPropeller = new THREE.BoxGeometry(20,10,10,1,1,1);
	geomPropeller.vertices[4].y-=5;
	geomPropeller.vertices[4].z+=5;
	geomPropeller.vertices[5].y-=5;
	geomPropeller.vertices[5].z-=5;
	geomPropeller.vertices[6].y+=5;
	geomPropeller.vertices[6].z+=5;
	geomPropeller.vertices[7].y+=5;
	geomPropeller.vertices[7].z-=5;
	var matPropeller = new THREE.MeshPhongMaterial({color:Colors.brown, shading:THREE.FlatShading});
	this.propeller = new THREE.Mesh(geomPropeller, matPropeller);
	this.propeller.castShadow = true;
	this.propeller.receiveShadow = true;
	var geomBlade1 = new THREE.BoxGeometry(1,100,10,1,1,1);
	var geomBlade2 = new THREE.BoxGeometry(1,10,100,1,1,1);
	var matBlade = new THREE.MeshPhongMaterial({color:Colors.brownDark, shading:THREE.FlatShading});
	var blade1 = new THREE.Mesh(geomBlade1, matBlade);
	blade1.position.set(8,0,0);
	blade1.castShadow = true;
	blade1.receiveShadow = true;
	var blade2 = new THREE.Mesh(geomBlade2, matBlade);
	blade2.position.set(8,0,0);
	blade2.castShadow = true;
	blade2.receiveShadow = true;
	this.propeller.add(blade1, blade2);
	this.propeller.position.set(50,0,0);
	this.mesh.add(this.propeller);
	var wheelProtecGeom = new THREE.BoxGeometry(30,15,10,1,1,1);
	var wheelProtecMat = new THREE.MeshPhongMaterial({color:Colors.white, shading:THREE.FlatShading});
	var wheelProtecR = new THREE.Mesh(wheelProtecGeom,wheelProtecMat);
	wheelProtecR.position.set(25,-20,25);
	this.mesh.add(wheelProtecR);
	var wheelTireGeom = new THREE.BoxGeometry(24,24,4);
	var wheelTireMat = new THREE.MeshPhongMaterial({color:Colors.brownDark, shading:THREE.FlatShading});
	var wheelTireR = new THREE.Mesh(wheelTireGeom,wheelTireMat);
	wheelTireR.position.set(25,-28,25);
	var wheelAxisGeom = new THREE.BoxGeometry(10,10,6);
	var wheelAxisMat = new THREE.MeshPhongMaterial({color:Colors.brown, shading:THREE.FlatShading});
	var wheelAxis = new THREE.Mesh(wheelAxisGeom,wheelAxisMat);
	wheelTireR.add(wheelAxis);
	this.mesh.add(wheelTireR);
	var wheelProtecL = wheelProtecR.clone();
	wheelProtecL.position.z = -wheelProtecR.position.z ;
	this.mesh.add(wheelProtecL);
	var wheelTireL = wheelTireR.clone();
	wheelTireL.position.z = -wheelTireR.position.z;
	this.mesh.add(wheelTireL);
	var wheelTireB = wheelTireR.clone();
	wheelTireB.scale.set(.5,.5,.5);
	wheelTireB.position.set(-35,-5,0);
	this.mesh.add(wheelTireB);
	var suspensionGeom = new THREE.BoxGeometry(4,20,4);
	suspensionGeom.applyMatrix(new THREE.Matrix4().makeTranslation(0,10,0))
	var suspensionMat = new THREE.MeshPhongMaterial({color:Colors.red, shading:THREE.FlatShading});
	var suspension = new THREE.Mesh(suspensionGeom,suspensionMat);
	suspension.position.set(-35,-5,0);
	suspension.rotation.z = -.3;
	this.mesh.add(suspension);
};

var sky, forest, land, orbit, airplane, sun;
var mousePos={x:0, y:0};
var offSet = -600;

function createSky(){
  sky = new Sky();
  sky.mesh.position.y = offSet;
  scene.add(sky.mesh);
}

function createLand(){
  land = new Land();
  land.mesh.position.y = offSet;
  scene.add(land.mesh);
}

function createOrbit(){
  orbit = new Orbit();
  orbit.mesh.position.y = offSet;
  orbit.mesh.rotation.z = -Math.PI/6; 
  scene.add(orbit.mesh);
}

function createForest(){
  forest = new Forest();
  forest.mesh.position.y = offSet;
  scene.add(forest.mesh);
}

function createSun(){ 
	sun = new Sun();
	sun.mesh.scale.set(1,1,.3);
	sun.mesh.position.set(0,-36,-850);
	scene.add(sun.mesh);
}

function createPlane(){ 
	airplane = new AirPlane();
	airplane.mesh.scale.set(.35,.35,.35);
	airplane.mesh.position.set(-40,110,-250);
	scene.add(airplane.mesh);
}

function updatePlane() {
	var targetY = normalize(mousePos.y,-.75,.75, 50, 190);
	var targetX = normalize(mousePos.x,-.75,.75,-100, -20);
	// 通过添加剩余距离的一小部分，在每一帧移动平面
	airplane.mesh.position.y += (targetY-airplane.mesh.position.y)*0.1;
	airplane.mesh.position.x += (targetX-airplane.mesh.position.x)*0.1;
	// Rotate the plane proportionally to the remaining distance
	airplane.mesh.rotation.z = (targetY-airplane.mesh.position.y)*0.0128;
	airplane.mesh.rotation.x = (airplane.mesh.position.y-targetY)*0.0064;
	airplane.mesh.rotation.y = (airplane.mesh.position.x-targetX)*0.0064;
	airplane.propeller.rotation.x += 0.3;
}

function normalize(v,vmin,vmax,tmin, tmax){
	var nv = Math.max(Math.min(v,vmax), vmin);
	var dv = vmax-vmin;
	var pc = (nv-vmin)/dv;
	var dt = tmax-tmin;
	var tv = tmin + (pc*dt);
	return tv;
}

function loop(){
  land.mesh.rotation.z += .001;
  orbit.mesh.rotation.z += .001;
  sky.mesh.rotation.z += .001;
  forest.mesh.rotation.z += .0012;
  updatePlane();
  renderer.render(scene, camera);
  requestAnimationFrame(loop);
}

function handleMouseMove (event) {
	var tx = -1 + (event.clientX / WIDTH)*2;
	var ty = 1 - (event.clientY / HEIGHT)*2;
	mousePos = {x:tx, y:ty};	
}

function init(event) {
	createScene();
	createLights();
	createPlane();
	createOrbit();
	createSun();
	createLand();
	createForest();
	createSky();
	document.addEventListener('mousemove', handleMouseMove, false);
	loop();
}

window.addEventListener('load', init, false);