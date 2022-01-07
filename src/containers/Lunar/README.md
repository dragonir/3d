# Three.js

THREE.OrbitControls参数控制
// Set to false to disable this control
//鼠标控制是否可用
	this.enabled = true;

// "target" sets the location of focus, where the object orbits around
//聚焦坐标
	this.target = new THREE.Vector3();

// How far you can dolly in and out ( PerspectiveCamera only )
//最大最小相机移动距离(景深相机)
	this.minDistance = 0;
	this.maxDistance = Infinity;

// How far you can zoom in and out ( OrthographicCamera only )
//最大最小鼠标缩放大小（正交相机）
	this.minZoom = 0;
	this.maxZoom = Infinity;

// How far you can orbit vertically, upper and lower limits.
// Range is 0 to Math.PI radians.
//最大仰视角和俯视角
	this.minPolarAngle = 0; // radians
	this.maxPolarAngle = Math.PI; // radians

// How far you can orbit horizontally, upper and lower limits.
// If set, must be a sub-interval of the interval [ - Math.PI, Math.PI ].
//水平方向视角限制
	this.minAzimuthAngle = - Infinity; // radians
	this.maxAzimuthAngle = Infinity; // radians

// Set to true to enable damping (inertia)
// If damping is enabled, you must call controls.update() in your animation loop
//惯性滑动，滑动大小默认0.25
	this.enableDamping = false;
	this.dampingFactor = 0.25;

// This option actually enables dollying in and out; left as "zoom" for backwards compatibility.
// Set to false to disable zooming
//滚轮是否可控制zoom，zoom速度默认1
	this.enableZoom = true;
	this.zoomSpeed = 1.0;

// Set to false to disable rotating
//是否可旋转，旋转速度
	this.enableRotate = true;
	this.rotateSpeed = 1.0;

// Set to false to disable panning
//是否可平移，默认移动速度为7px
	this.enablePan = true;
	this.keyPanSpeed = 7.0;	// pixels moved per arrow key push

// Set to true to automatically rotate around the target
// If auto-rotate is enabled, you must call controls.update() in your animation loop
//是否自动旋转，自动旋转速度。默认每秒30圈
	this.autoRotate = false;
	this.autoRotateSpeed = 2.0; // 30 seconds per round when fps is 60

// Set to false to disable use of the keys
//是否能使用键盘
	this.enableKeys = true;

// The four arrow keys
//默认键盘控制上下左右的键
	this.keys = { LEFT: 37, UP: 38, RIGHT: 39, BOTTOM: 40 };

// Mouse buttons
//鼠标点击按钮
	this.mouseButtons = { ORBIT: THREE.MOUSE.LEFT, ZOOM: THREE.MOUSE.MIDDLE, PAN: THREE.MOUSE.RIGHT };