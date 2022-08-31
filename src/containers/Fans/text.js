// Recreating the confetti from scratch would have been so much pain, Thank god this was already done by someone on codepen. 
// Thats why I love Codepen so much, so many Demos.
// copied the confetti from here -> https://codepen.io/jscottsmith/pen/VjPaLO


console.clear();

gsap.registerPlugin(Physics2DPlugin);

let palettes;
const DECAY = 6;
const SPREAD = 30;
const GRAVITY = 1600;


class App {
	constructor() {
		this.width = window.innerWidth;
		this.height = window.innerHeight;

		this.sceneGroup = new THREE.Group();

		this.mousePosition = new THREE.Vector2(
			window.innerWidth / 2,
			window.innerHeight / 2
		);

		this.lerpedMouse2d = {
			previous: new THREE.Vector2(),
			current: new THREE.Vector2(),
			amount: 0.05,
		};
		this.lerpedMouse3d = {
			previous: new THREE.Vector2(0, -10, 0),
			current: new THREE.Vector2(),
			amount: 0.065,
		};

		this.cameraPosition = new THREE.Vector3(0, 0, 700);

		this.ticker = 0;
	}

	init() {
		this.createScene();
		this.createCamera();
		this.addLights();
		this.addConfettiPoppers();
		this.addTexts();
		this.addBackgroundObjects();
		this.add3dMouse();
		this.initEvents();
		this.render();
	}

	createScene() {
		this.scene = new THREE.Scene();
		this.scene.background = new THREE.Color(0xabf7f9);
		this.scene.add(this.sceneGroup);

		this.renderer = new THREE.WebGLRenderer({ antialias: true });
		this.renderer.setPixelRatio(window.devicePixelRatio);
		this.renderer.setSize(window.innerWidth, window.innerHeight);

		document.body.appendChild(this.renderer.domElement);
	}

	createCamera() {
		this.camera = new THREE.PerspectiveCamera(
			50,
			this.width / this.height,
			0.1,
			2000
		);
		this.camera.position.set(
			this.cameraPosition.x,
			this.cameraPosition.y,
			this.cameraPosition.z
		);
		this.camera.lookAt(new THREE.Vector3());
		this.scene.add(this.camera);
	}

	addLights() {
		const directionalLight1 = new THREE.DirectionalLight(0xffffff, 2);
		const directionalLight2 = new THREE.DirectionalLight(0xffffff, 2);
		directionalLight1.position.set(-10, 10, -10);
		directionalLight2.position.set(10, 10, 10);

		this.sceneGroup.add(new THREE.AmbientLight(0xffffff, 0.75));
		this.sceneGroup.add(directionalLight1);
		this.sceneGroup.add(directionalLight2);
		this.camera.add(new THREE.PointLight(0xffeabc, 0.35));
	}

	add3dMouse() {
		this.mouse3dGroup = new THREE.Group();
		this.mouseParticles = new THREE.Group();

		const sphere = new THREE.SphereGeometry(10, 16, 16);
		const icosahedron = new THREE.IcosahedronGeometry(5, 0);
		const material = new THREE.MeshNormalMaterial();

		this.mouse3dGroup.add(new THREE.Mesh(sphere, material));

		for (let i = 0; i < 4; i++)
			this.mouseParticles.add(new THREE.Mesh(icosahedron, material));

		this.mouse3dGroup.add(this.mouseParticles);
		this.scene.add(this.mouse3dGroup);
	}

	addConfettiPoppers() {
		this.confetti = new Confetti({
			parent: this.sceneGroup,
			points: [
				new THREE.Vector3(-300, 300, 100),
				new THREE.Vector3(0, 300, 100),
				new THREE.Vector3(300, 300, 100),
			],
			firstPopDuration: 3.5,
		});
	}

	addTexts() {
		this.textGroup = new THREE.Group();

		const DEFAULTS = {
			parent: this.textGroup,
			initializeDelay: 3,
		};

		new Text({
			...DEFAULTS,
			text: "1000",
			position: new THREE.Vector3(55, 50, 0),
			textOptions: {
				size: 100,
				spacing: 100,
			},
			material: {
				color: new THREE.Color(0x1389e7),
				metalness: 0.5,
				roughness: 0.35,
			},
			animation: "zoomAndFlip",
			onLoad: () => {
				this.confetti.pop(2);
			},
		});
		new Text({
			...DEFAULTS,
			text: "THANK YOU",
			position: new THREE.Vector3(-80, -50, 0),
			textOptions: {
				size: 40,
				spacing: 40,
			},
			material: {
				color: new THREE.Color(0xee9be4),
				metalness: 0.6,
				roughness: 0.3,
			},
			animation: "upDownFlip",
		});

		this.sceneGroup.add(this.textGroup);
	}

	addBackgroundObjects() {
		this.backgroundObjectsGroup = new THREE.Group();

		const positions = [
			new THREE.Vector3(-300, 300, -100),
			new THREE.Vector3(300, 200, 150),
			new THREE.Vector3(-400, -300, -200),
			new THREE.Vector3(200, -200, 100),
			new THREE.Vector3(-250, -100, -450),
			new THREE.Vector3(150, 50, -150),
		];
		const shapes = [
			new THREE.IcosahedronGeometry(20, 0),
			new THREE.BoxGeometry(25, 25, 25),
			new THREE.TorusGeometry(20, 5, 12, 30),
			new THREE.BoxGeometry(15, 15, 10),
			new THREE.SphereGeometry(20, 12, 12),
			new THREE.TorusGeometry(10, 3, 12, 30),
		];

		const material = new THREE.MeshNormalMaterial();

		for (let i = 0; i < shapes.length; i++) {
			const mesh = new THREE.Mesh(shapes[i], material);
			mesh.position.set(positions[i].x, positions[i].y, positions[i].z);
			mesh.rotation.set(_.random(20, 80), _.random(30, 50), _.random(60, 120));
			this.backgroundObjectsGroup.add(mesh);
		}
		this.sceneGroup.add(this.backgroundObjectsGroup);

		gsap.from(this.backgroundObjectsGroup.children.map((c) => c.position), {
			delay: 1,
			duration: 2,
			z: 1000,
			ease: "elastic.out(1, 0.75)",
		});
	}

	initEvents() {
		const handlePointerMove = (e) => {
			e.preventDefault();
			this.mousePosition.x = e.clientX;
			this.mousePosition.y = e.clientY;
		};

		const handlePointerDown = (e) => {
			e.preventDefault();
			this.confetti && this.confetti.pop();
		};

		const onResize = () => {
			this.width = window.innerWidth;
			this.height = window.innerHeight;

			this.camera.aspect = this.width / this.height;
			this.camera.updateProjectionMatrix();

			this.renderer.setPixelRatio(window.devicePixelRatio);
			this.renderer.setSize(this.width, this.height);
		};

		window.addEventListener("pointermove", handlePointerMove);
		window.addEventListener("pointerdown", handlePointerDown);
		window.addEventListener("resize", onResize, { passive: true });
	}

	updateSceneGroupRotation() {
		const angle = new THREE.Vector2(
			map(
				this.lerpedMouse2d.previous.x,
				0,
				window.innerWidth,
				Math.PI * 8,
				-Math.PI * 8
			),
			map(
				this.lerpedMouse2d.previous.y,
				0,
				window.innerHeight,
				Math.PI * 6,
				-Math.PI * 6
			)
		);

		this.sceneGroup.rotation.y = THREE.MathUtils.degToRad(angle.x);
		this.sceneGroup.rotation.x = THREE.MathUtils.degToRad(angle.y);
	}

	updateLerpedProps() {
		this.lerpedMouse2d.current.x = this.mousePosition.x;
		this.lerpedMouse2d.current.y = this.mousePosition.y;

		const mouse3d = new THREE.Vector2(
			(this.mousePosition.x / window.innerWidth) * 2 - 1,
			-(this.mousePosition.y / window.innerHeight) * 2 + 1
		);

		this.lerpedMouse3d.current.x = mouse3d.x;
		this.lerpedMouse3d.current.y = mouse3d.y;

		this.lerpedMouse2d.previous.x = lerp(
			this.lerpedMouse2d.previous.x,
			this.lerpedMouse2d.current.x,
			this.lerpedMouse2d.amount
		);
		this.lerpedMouse2d.previous.y = lerp(
			this.lerpedMouse2d.previous.y,
			this.lerpedMouse2d.current.y,
			this.lerpedMouse2d.amount
		);

		this.lerpedMouse3d.previous.x = lerp(
			this.lerpedMouse3d.previous.x,
			this.lerpedMouse3d.current.x,
			this.lerpedMouse3d.amount
		);
		this.lerpedMouse3d.previous.y = lerp(
			this.lerpedMouse3d.previous.y,
			this.lerpedMouse3d.current.y,
			this.lerpedMouse3d.amount
		);
	}

	update3dMouse() {
		const mouse3d = this.mouse3dGroup.children[0];
		const radius = mouse3d.geometry.parameters.radius * 2;

		this.mouseParticles.children.forEach((particle, index) => {
			const offsetAngle = index % 2 == 0 ? Math.PI : 0;
			const rotaionAxis = index == 0 || index == 1 ? "y" : "z";
			const rotationFactor = index == 0 || index == 1 ? Math.PI / 2 : 0;

			particle.position.x =
				radius *
				Math.sin(this.ticker * 0.04 + offsetAngle + rotationFactor);
			particle.position[rotaionAxis] =
				radius *
				Math.cos(this.ticker * 0.04 + offsetAngle + rotationFactor);

			particle.rotation.x = this.ticker * 0.0002;
		});

		this.mouse3dGroup.rotation.z = this.ticker * 0.0025;

		const vector = new THREE.Vector3(
			this.lerpedMouse3d.previous.x,
			this.lerpedMouse3d.previous.y,
			0.5
		);
		vector.unproject(this.camera);
		const dir = vector.sub(this.camera.position).normalize();
		const distance = -this.camera.position.z / dir.z;
		const pos = this.camera.position
		.clone()
		.add(dir.multiplyScalar(distance));

		this.mouse3dGroup.position.copy(pos);

		this.mouse3dGroup.position.z = -100;
	}

	animateBackgroupObjects() {
		const childrens = this.backgroundObjectsGroup.children;
		childrens.forEach((children) => {
			children.rotation.x += 0.01;
			children.rotation.y -= 0.01;
			children.rotation.z += 0.01;
		});
	}

	render() {
		this.raf = requestAnimationFrame(this.render.bind(this));

		this.updateLerpedProps();
		this.animateBackgroupObjects();
		this.updateSceneGroupRotation();
		this.update3dMouse();

		this.renderer.render(this.scene, this.camera);

		this.ticker++;
	}
}

class Confetti {
	constructor(options = {}) {
		this.parent = options.parent;
		this.confettiPoints = options.points;
		this.firstPopDuration = options.firstPopDuration || 2;

		this.confettiSpriteIds = [];
		this.confettiSprites = {};
		this.meshes = {};

		this.geometry = new THREE.PlaneGeometry(5, 5, 6);

		this.init();
	}

	init() {
		this.render = this.render.bind(this);
		this.pop = this.pop.bind(this);
		gsap.ticker.add(this.render);
	}

	pop(delay = 0) {
		setTimeout(() => {
			for (let i = 0; i < this.confettiPoints.length; i++) {
				const amount = _.random(100, 150);
				const velocity = _.random(3500, 5000);
				const position = this.confettiPoints[i];
				const angle = getDegAngle(
					this.confettiPoints[i].x,
					this.confettiPoints[i].y,
					this.confettiPoints[i].x,
					this.confettiPoints[i].y - 500
				);
				this.addConfettiParticles({
					amount,
					angle,
					velocity,
					position,
				});
			}
		}, delay * 1000);
	}

	addConfettiParticles({ amount, angle, velocity, position }) {
		const confettiGroup = new THREE.Group();
		for (let i = 0; i < amount; i++) {
			const r = _.random(4, 6);
			const palatte = _.sample(palettes);
			const color = _.sample(palatte);
			const tilt = _.random(10, -10);
			const tiltAngleIncremental = _.random(0.07, 0.05);
			const tiltAngle = 0;
			const id = _.uniqueId();
			const sprite = {
				[id]: {
					angle: angle,
					velocity: velocity,
					x: position.x,
					y: position.y,
					r,
					color,
					tilt,
					tiltAngleIncremental,
					tiltAngle,
				},
			};

			Object.assign(this.confettiSprites, sprite);
			this.confettiSpriteIds.push(id);
			this.tweenConfettiParticle(id);

			this.material = new THREE.MeshBasicMaterial({
				color: new THREE.Color(color),
				side: THREE.DoubleSide,
			});
			const confettiParticle = new THREE.Mesh(
				this.geometry,
				this.material
			);

			confettiParticle.scale.set(_.random(1.2, 1.5), _.random(1.2, 1.5), 1);
			confettiParticle.rotation.set(
				_.random(20, 40),
				_.random(50, 80),
				_.random(30, 60)
			);

			this.parent.add(confettiParticle);

			this.meshes = {
				...this.meshes,
				[id]: confettiParticle,
			};
		}
	}

	tweenConfettiParticle(id) {
		const minAngle = this.confettiSprites[id].angle - SPREAD / 2;
		const maxAngle = this.confettiSprites[id].angle + SPREAD / 2;
		const minVelocity = this.confettiSprites[id].velocity / 4;
		const maxVelocity = this.confettiSprites[id].velocity;
		const velocity = _.random(minVelocity, maxVelocity);
		const angle = _.random(minAngle, maxAngle);
		const gravity = GRAVITY;
		const friction = _.random(0.1, 0.25);

		gsap.to(this.confettiSprites[id], DECAY, {
			physics2D: {
				velocity,
				angle,
				gravity,
				friction,
			},
			ease: "power4.easeIn",
			onComplete: () => {
				_.pull(this.confettiSpriteIds, id);
				this.parent.remove(this.meshes[id]);
				this.meshes[id].material.dispose();
				delete this.confettiSprites[id];
			},
		});
	}

	updateConfettiParticle(id) {
		const sprite = this.confettiSprites[id];
		const tiltAngle = 0.0005 * sprite.r;
		sprite.angle += 0.01;
		sprite.tiltAngle += tiltAngle;
		sprite.tiltAngle += sprite.tiltAngleIncremental;
		sprite.tilt = Math.sin(sprite.tiltAngle - sprite.r / 2) * sprite.r * 2;
	}

	render() {
		this.confettiSpriteIds.map((id) => {
			const sprite = this.confettiSprites[id];
			this.meshes[id].position.x = sprite.x;
			this.meshes[id].position.y = -sprite.y;
			this.meshes[id].rotation.x = sprite.angle;
			this.meshes[id].rotation.y = sprite.angle + sprite.tilt / 4;
			this.meshes[id].rotation.z = sprite.angle;
			this.updateConfettiParticle(id);
		});
	}
}

class Text {
	constructor(options = {}) {
		this.parent = options.parent;
		this.text = options.text;
		this.position = options.position || new THREE.Vector3();
		this.material = options.material;
		this.textOptions = options.textOptions;
		this.animation = options.animation;
		this.initializeDelay = options.initializeDelay || 2;
		this.onLoad = options.onLoad;

		this.meshes = [];

		this.loadFont();
	}

	loadFont() {
		// const loader = new THREE.FontLoader();
		// loader.load(FONT_URL, (font) => {

		this.font = new THREE.Font(FONT_JSON); 
		// here FONT_JSON is loaded through another pen which is embedded in js section of this pen
		this.init();
		if (typeof this.onLoad === "function") this.onLoad();

		// });
	}

	init() {
		const characters = this.text.split("");
		const charDistance = this.textOptions.spacing;
		const charSize = this.textOptions.size;

		const totalTextSize =
					(((charSize * charDistance) / 100) * characters.length) / 2;

		for (let i = 0; i < characters.length; i++) {
			this.addLetter({
				text: characters[i],
				position: new THREE.Vector3(
					this.position.x + (i * charDistance - totalTextSize),
					this.position.y,
					this.position.z
				),
				textOptions: {
					font: this.font,
					size: charSize,
					height: charSize / 4,
					curveSegments: 100,
				},
			});
		}

		this.meshesPosition = this.meshes.map((mesh) => mesh.position);
		this.meshesRotation = this.meshes.map((mesh) => mesh.rotation);

		this.initAnimation();
	}

	addLetter(options = {}) {
		const textGeometry = new THREE.TextBufferGeometry(
			options.text,
			options.textOptions
		);
		textGeometry.center();

		const textMaterial = new THREE.MeshStandardMaterial({
			...this.material,
			flatShading: THREE.SmoothShading,
		});

		const textMesh = new THREE.Mesh(textGeometry, textMaterial);
		textMesh.position.set(
			options.position.x,
			options.position.y,
			options.position.z
		);

		this.parent.add(textMesh);
		this.meshes.push(textMesh);
	}

	initAnimation() {
		let tl = gsap.timeline({
			delay: 1,
			defaults: {
				duration: this.initializeDelay,
				ease: "elastic.out(1, .75)",
				stagger: 0.1,
			},
			onComplete: () => {
				this[this.animation]();
			},
		});

		tl.from(
			this.meshesPosition,
			{
				z: 1000,
			},
			"start"
		).from(
			this.meshesRotation,
			{
				x: Math.PI * 2,
			},
			"start"
		);
	}

	upDownFlip() {
		gsap.timeline({
			repeat: -1,
			defaults: {
				duration: 2,
				ease: "elastic.out(1, .75)",
				stagger: 0.1,
			},
		})
			.to(
			this.meshesPosition,
			{
				y: this.meshesPosition[0].y - 30,
			},
			"start"
		)
			.to(
			this.meshesRotation,
			{
				x: Math.PI * 2,
			},
			"start"
		)
			.to(
			this.meshesPosition,
			{
				y: this.meshesPosition[0].y,
			},
			"end"
		)
			.to(
			this.meshesRotation,
			{
				x: Math.PI * 4,
			},
			"end"
		);
	}

	zoomAndFlip() {
		gsap.timeline({
			repeat: -1,
			defaults: {
				duration: 2,
				ease: "elastic.out(1.2, 1)",
				stagger: 0.1,
			},
		})
			.to(
			this.meshesPosition,
			{
				z: this.meshesPosition[0].z + 100,
			},
			"start"
		)
			.to(
			this.meshesRotation,
			{
				duration: 2,
				y: Math.PI * 2,
			},
			"start"
		)
			.to(
			this.meshesRotation,
			{
				duration: 2,
				y: Math.PI * 4,
			},
			"end"
		)
			.to(
			this.meshesPosition,
			{
				z: this.meshesPosition[0].z,
			},
			"end"
		);
	}
}


const app = new App();
loadPalettes(() => app.init());

// utils
function getDegAngle(x0, y0, x1, y1) {
	const y = y1 - y0;
	const x = x1 - x0;
	return Math.atan2(y, x) * (180 / Math.PI);
}

function map(n, start1, stop1, start2, stop2) {
	return ((n - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
}

function lerp(v0, v1, t) {
	return v0 * (1 - t) + v1 * t;
}

async function loadPalettes(callback) {
	const fetched = await fetch(
		"https://cdn.jsdelivr.net/npm/nice-color-palettes/100.json"
	);
	const data = await fetched.json();
	palettes = data;
	callback();
}
