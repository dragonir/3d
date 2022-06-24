import * as THREE from 'three';

export default class Road {
	constructor(grassTexture,roadTexture) {
		this.tileSize = 32;
		this.worldSize = this.tileSize * 16;
		this.mesh = new THREE.Object3D();
		this.mesh.rotation.x = -Math.PI/2;

		// 草
		let grassGeo = new THREE.PlaneBufferGeometry(this.worldSize,this.worldSize),
			grassMat = new THREE.MeshLambertMaterial({
				color: 0xc0ea3b,
				map: grassTexture
			});

		grassMat.map.wrapS = THREE.RepeatWrapping;
		grassMat.map.wrapT = THREE.RepeatWrapping;
		grassMat.map.repeat.set(128,128);

		let grass = new THREE.Mesh(grassGeo,grassMat);
		grass.position.z = -0.02;
		this.mesh.add(grass);

		// road
		let roadGeo = new THREE.PlaneBufferGeometry(this.tileSize,this.worldSize),
			roadMat = new THREE.MeshPhongMaterial({
				color: 0xffffff,
				map: roadTexture
			});

		roadMat.map.wrapS = THREE.RepeatWrapping;
		roadMat.map.wrapT = THREE.RepeatWrapping;
		roadMat.map.repeat.set(1,16);

		let road = new THREE.Mesh(roadGeo,roadMat);
		road.position.x = 7;
		road.receiveShadow = true;
		this.mesh.add(road);
	}
}