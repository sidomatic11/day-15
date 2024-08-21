import * as THREE from "three";

/* SECTION - Scene Setup */

/* Canvas */
const canvas = document.querySelector("canvas.webgl");

/* Scene */
const scene = new THREE.Scene();

/* Sizes */
const sizes = {
	width: window.innerWidth,
	height: window.innerHeight,
};

window.addEventListener("resize", () => {
	/* Update sizes */
	sizes.width = window.innerWidth;
	sizes.height = window.innerHeight;

	/* Update camera */
	camera.aspect = sizes.width / sizes.height; // for Perspective camera
	camera.updateProjectionMatrix();

	/* Update renderer */
	renderer.setSize(sizes.width, sizes.height);
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/* window.addEventListener("dblclick", () => {
	if (!document.fullscreenElement) {
		console.log("go full");
		renderer.domElement.requestFullscreen();
	} else {
		console.log("leave full");
		document.exitFullscreen();
	}
}); */

/* ANCHOR Lights */
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(0, 0, 5);
// scene.add(directionalLight);
const light = new THREE.PointLight(0xffffff, 35, 20);
light.position.set(0, 0, 0);

/* ANCHOR Camera */
const camera = new THREE.PerspectiveCamera(
	75,
	sizes.width / sizes.height,
	0.1,
	100
);
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 2;
camera.lookAt(0, 0, 0);
scene.add(camera);

camera.add(light);

/* ANCHOR Fog */
const fogColor = new THREE.Color(0x000000); // Black color
const fogNear = 1;
const fogFar = 12;
scene.fog = new THREE.Fog(fogColor, fogNear, fogFar);

/* ANCHOR Renderer */
const renderer = new THREE.WebGLRenderer({
	canvas: canvas,
	// alpha: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/*!SECTION */

/* SECTION - Objects */

const loadingManager = new THREE.LoadingManager();
const textureLoader = new THREE.TextureLoader(loadingManager);

const textureSea = textureLoader.load("images/sea.png");
textureSea.colorSpace = THREE.SRGBColorSpace;
textureSea.center.set(0.5, 0.5);

const textureSun = textureLoader.load("images/sun.png");
textureSun.colorSpace = THREE.SRGBColorSpace;

const textureSky = textureLoader.load("images/sky.png");
textureSky.colorSpace = THREE.SRGBColorSpace;

const textureGrassPatch = textureLoader.load("images/grass-patch.png");
textureGrassPatch.colorSpace = THREE.SRGBColorSpace;
textureGrassPatch.center.set(0.5, 0.5);

//ANCHOR - Direction Vector
let directionVector = new THREE.Vector3(0, 0, 1);

let allRings = [];
let allPlanes = [];
const ringCount = 10;

const planeDimension = 1.61;
const planeGeometry = new THREE.PlaneGeometry(planeDimension, planeDimension);
const planeMaterial1 = new THREE.MeshStandardMaterial({
	map: textureSea,
	side: THREE.DoubleSide,
});
const planeMaterial2 = new THREE.MeshStandardMaterial({
	map: textureGrassPatch,
	side: THREE.DoubleSide,
});
const planeMaterialSun = new THREE.MeshStandardMaterial({
	map: textureSun,
	side: THREE.DoubleSide,
});
const planeMaterialSky = new THREE.MeshStandardMaterial({
	map: textureSky,
	side: THREE.DoubleSide,
});

let radius = 2;
let angle = 0;
let distanceBetweenRings = 1.69;

let lastRingPosition = directionVector.clone();

for (let i = 0; i < ringCount; i++) {
	let planeRing = new THREE.Group();

	for (let j = 0; j < 8; j++) {
		let x = radius * Math.cos(angle);
		let y = radius * Math.sin(angle);
		let z = 0;

		let material;

		if (y <= -1) {
			//Grass
			material = planeMaterial2;
		} else if (y > 1) {
			//Sun and sky
			if (Math.abs(x) < 0.1) {
				material = planeMaterialSun;
			} else {
				material = planeMaterialSky;
			}
		} else {
			//Sea
			material = planeMaterial1;
		}

		const plane = new THREE.Mesh(planeGeometry, material);

		plane.position.x = x;
		plane.position.y = y;
		plane.position.z = z;

		plane.lookAt(0, 0, 0);

		planeRing.add(plane);
		allPlanes.push(plane);

		angle += Math.PI / 4;
	}
	planeRing.position.copy(lastRingPosition);
	lastRingPosition.addScaledVector(directionVector, distanceBetweenRings);
	scene.add(planeRing);
	allRings.push(planeRing);
}

/*!SECTION */

/* SECTION - Render */
const clock = new THREE.Clock();
let cameraMovementSpeed = 0.03;

const tick = (t) => {
	const elapsedTime = clock.getElapsedTime();

	const rotationAngle = Math.sin(elapsedTime) * (10 * (Math.PI / 180)); // 25 degrees in radians

	allRings[0].children[0].material.map.rotation = rotationAngle;

	camera.position.addScaledVector(directionVector, cameraMovementSpeed);

	if (directionVector.z < 0) {
		if (allRings[0].position.z > camera.position.z) {
			let removedRing = allRings.shift();
			let lastRing = allRings[allRings.length - 1];
			allRings.push(removedRing);
			removedRing.position.copy(lastRing.position);
			removedRing.position.addScaledVector(
				directionVector,
				distanceBetweenRings
			);

			if (removedRing.userData.hasCube) {
				changeCubePosition(removedRing);
			}
		}
	} else {
		if (allRings[allRings.length - 1].position.z < camera.position.z) {
			//when camera goes behind the last ring
			let removedRing = allRings.shift(); //remove the first ring
			let lastRing = allRings[allRings.length - 1]; //get the last ring
			allRings.push(removedRing); //add the removed ring to the end of the array
			removedRing.position.copy(lastRing.position);
			removedRing.position.addScaledVector(
				directionVector,
				distanceBetweenRings
			); //adjust position of the removed ring
		}
	}

	/* Render */
	renderer.render(scene, camera);

	/* Call tick again on the next frame */
	window.requestAnimationFrame(tick);
};

tick();

/* !SECTION */
