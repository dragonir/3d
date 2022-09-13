import { PlaneBufferGeometry, MeshBasicMaterial, Color, DoubleSide, Mesh } from 'three';
import { palettes } from '@/assets/utils/palettes';
import gsap from 'gsap';
const physics2D = require('./physics2D');
gsap.registerPlugin(physics2D.Physics2DPlugin);
const _ = require('lodash');
const DECAY = 6;
const SPREAD = 30;
const GRAVITY = 1600;

function getDegAngle(x0, y0, x1, y1) {
	const y = y1 - y0;
	const x = x1 - x0;
	return Math.atan2(y, x) * (180 / Math.PI);
}

export default class Confetti {
	constructor(options = {}) {
		this.parent = options.parent;
		this.confettiPoints = options.points;
		this.firstPopDuration = options.firstPopDuration || 2;
		this.confettiSpriteIds = [];
		this.confettiSprites = {};
		this.meshes = {};
		this.geometry = new PlaneBufferGeometry(5, 5, 6);
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

			this.material = new MeshBasicMaterial({
				color: new Color(color),
				side: DoubleSide,
			});
			const confettiParticle = new Mesh(
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
			ease: 'power4.easeIn',
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
      return true;
		});
	}
}
