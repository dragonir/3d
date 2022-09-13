import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { Vector3, MeshMatcapMaterial, SmoothShading, Mesh } from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import gsap from 'gsap';

export default class Text {
	constructor(options = {}) {
		this.parent = options.parent;
		this.text = options.text;
		this.position = options.position || new Vector3();
		this.material = options.material;
		this.textOptions = options.textOptions;
		this.animation = options.animation;
		this.initializeDelay = options.initializeDelay || 2;
		this.onLoad = options.onLoad;
		this.meshes = [];
		this.loadFont();
	}

	loadFont() {
    const loader = new FontLoader();
    loader.load('./fonts/helvetiker_regular.typeface.json', font => {
      this.font = font;
      this.init();
      if (typeof this.onLoad === 'function') this.onLoad();
    });
	}

	init() {
		const characters = this.text.split('');
		const charDistance = this.textOptions.spacing;
		const charSize = this.textOptions.size;
		const totalTextSize =
					(((charSize * charDistance) / 100) * characters.length) / 2;

		for (let i = 0; i < characters.length; i++) {
			this.addLetter({
				text: characters[i],
				position: new Vector3(
					this.position.x + (i * charDistance - totalTextSize),
					this.position.y,
					this.position.z
				),
				textOptions: {
					font: this.font,
					size: charSize,
					height: charSize / 4,
					curveSegments: 100,
          bevelEnabled: true,
          bevelThickness: 10,
          bevelSize: 10,
          bevelOffset: 2,
          bevelSegments: 10
				},
			});
		}

		this.meshesPosition = this.meshes.map((mesh) => mesh.position);
		this.meshesRotation = this.meshes.map((mesh) => mesh.rotation);

		this.initAnimation();
	}

	addLetter(options = {}) {
		const textGeometry = new TextGeometry(
			options.text,
			options.textOptions
		);
		textGeometry.center();

		const textMaterial = new MeshMatcapMaterial({
			...this.material,
			flatShading: SmoothShading,
		});

		const textMesh = new Mesh(textGeometry, textMaterial);
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
				ease: 'elastic.out(1, .75)',
				stagger: 0.1,
			},
			onComplete: () => {
				this[this.animation]();
			},
		});

		tl
		.from(this.meshesPosition, { z: 1000 }, 'start')
		.from(this.meshesRotation, { x: Math.PI * 2 }, 'start');
	}

	upDownFlip() {
		gsap.timeline({
			repeat: -1,
			defaults: {
				duration: 2,
				ease: 'elastic.out(1, .75)',
				stagger: 0.1,
			},
		})
		.to(this.meshesPosition, { y: this.meshesPosition[0].y - 30 }, 'start')
		.to(this.meshesRotation, { x: Math.PI * 2 }, 'start')
		.to(this.meshesPosition, { y: this.meshesPosition[0].y }, 'end')
		.to(this.meshesRotation, { x: Math.PI * 4 }, 'end');
	}

	zoomAndFlip() {
		gsap.timeline({
			repeat: -1,
			defaults: {
				duration: 2,
				ease: 'elastic.out(1.2, 1)',
				stagger: 0.1,
			},
		})
		.to(this.meshesPosition, { z: this.meshesPosition[0].z + 100 }, 'start')
		.to(this.meshesRotation, { duration: 2, y: Math.PI * 2 }, 'start')
		.to(this.meshesRotation, { duration: 2, y: Math.PI * 4 }, 'end')
		.to(this.meshesPosition, { z: this.meshesPosition[0].z }, 'end');
	}
}
