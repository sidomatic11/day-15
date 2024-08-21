import * as THREE from "three";
import gsap from "gsap";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

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

/* Controls */
// const controls = new OrbitControls(camera, canvas);
// controls.enableDamping = true;

/*!SECTION */

/* SECTION - Objects */

const loadingManager = new THREE.LoadingManager();
const textureLoader = new THREE.TextureLoader(loadingManager);

const textureVerticalSea = textureLoader.load("images/vertical-sea.png");
textureVerticalSea.colorSpace = THREE.SRGBColorSpace;
textureVerticalSea.center.set(0.5, 0.5);

const textureVerticalDuck = textureLoader.load("images/vertical-duck.png");
textureVerticalDuck.colorSpace = THREE.SRGBColorSpace;

const textureSun = textureLoader.load("images/sun.png");
textureSun.colorSpace = THREE.SRGBColorSpace;

const textureSky = textureLoader.load("images/sky.png");
textureSky.colorSpace = THREE.SRGBColorSpace;

const textureGrassPatch = textureLoader.load("images/grass-patch.png");
textureGrassPatch.colorSpace = THREE.SRGBColorSpace;
textureGrassPatch.center.set(0.5, 0.5);

const textureOrangeX = textureLoader.load("images/orange-x.png");
textureOrangeX.colorSpace = THREE.SRGBColorSpace;
let repeat = 1;
textureOrangeX.repeat.set(repeat, repeat);
textureOrangeX.wrapS = THREE.RepeatWrapping;
textureOrangeX.wrapT = THREE.RepeatWrapping;
// textureOrangeX.center.set(0.5, 0.5);

const textureCircleDiamond = textureLoader.load("images/circle-diamond.png");
textureCircleDiamond.colorSpace = THREE.SRGBColorSpace;
textureCircleDiamond.repeat.set(repeat, repeat);
textureCircleDiamond.wrapS = THREE.MirroredRepeatWrapping;
textureCircleDiamond.wrapT = THREE.RepeatWrapping;

const textureDotSun = textureLoader.load("images/dot-sun.png");
textureDotSun.colorSpace = THREE.SRGBColorSpace;
textureDotSun.center.set(0.5, 0.5);
textureDotSun.repeat.set(repeat, repeat);
textureDotSun.wrapS = THREE.RepeatWrapping;
textureDotSun.wrapT = THREE.RepeatWrapping;

const textureDuckWaddle = textureLoader.load("images/duck-waddling.gif");
textureDuckWaddle.colorSpace = THREE.SRGBColorSpace;
// textureDuckWaddle.repeat.set(repeat, repeat);
// textureDuckWaddle.wrapS = THREE.RepeatWrapping;
// textureDuckWaddle.wrapT = THREE.RepeatWrapping;

/* ANCHOR: Background */
let cubeSize = 0.7;
const geometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
const material = new THREE.MeshStandardMaterial({ map: textureVerticalDuck });
const cube = new THREE.Mesh(geometry, material);
// scene.add(cube);
cube.position.set(0, 0, cubeSize / 2);

// const chessboardSize = 8; // 8x8 chessboard
// const cubeSize = 1;
// const spacing = 0.1; // Small gap between cubes
// const totalSize = chessboardSize * (cubeSize + spacing) - spacing;
// const offset = totalSize / 2 - cubeSize / 2;

// for (let i = 0; i < chessboardSize; i++) {
// 	for (let j = 0; j < chessboardSize; j++) {
// 		const x = i * (cubeSize + spacing) - offset;
// 		const y = j * (cubeSize + spacing) - offset;

// 		const chessCube = new THREE.Mesh(
// 			new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize),
// 			new THREE.MeshStandardMaterial({
// 				map: (i + j) % 2 === 0 ? textureOrangeX : textureCircleDiamond,
// 			})
// 		);

// 		chessCube.position.set(x, y, 0);
// 		scene.add(chessCube);
// 	}
// }

// Create a plane
const duckPlaneGeometry = new THREE.PlaneGeometry(1, 1);
const duckPlaneMaterial = new THREE.MeshStandardMaterial({
	map: textureDuckWaddle,
	side: THREE.DoubleSide,
});
const duckPlane = new THREE.Mesh(duckPlaneGeometry, duckPlaneMaterial);
// duckPlane.rotation.x = Math.PI / 2; // Rotate to be horizontal
duckPlane.position.y = -1; // Position slightly below the origin
// scene.add(duckPlane);

//ANCHOR - Direction Vector
let directionVector = new THREE.Vector3(0, 0, 1);

let allRings = [];
let allPlanes = [];
const ringCount = 10;

const planeDimension = 1.61;
const planeGeometry = new THREE.PlaneGeometry(planeDimension, planeDimension);
const planeMaterial1 = new THREE.MeshStandardMaterial({
	map: textureVerticalSea,
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
			material = planeMaterial2;
		} else if (y > 1) {
			if (Math.abs(x) < 0.1) {
				material = planeMaterialSun;
			} else {
				material = planeMaterialSky;
			}
		} else {
			material = planeMaterial1;
		}

		const plane = new THREE.Mesh(planeGeometry, material);

		// plane.rotation.y = Math.PI / 2; // Rotate the plane to be horizontal
		// plane.rotation.z = angle;
		// plane.lookAt(0, 0, 0);

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

// Load the GLTF model
let kawaiiMeka;
const mekaPath = "models/kawaiimeka/source/KawaiiMeka.glb";
const mekaScale = 0.15;
let glbObject = new THREE.Object3D();

const squidPath = "models/squid/scene.gltf";
const squidScale = 5;
let squidObject = new THREE.Object3D();
// scene.add(glbObject);
// scene.add(squidObject);

const chickenPath = "models/chicken/source/model.gltf";
const chickenScale = 0.25;
let chickenObject = new THREE.Object3D();
// scene.add(chickenObject);
// chickenObject.position.set(0, -0.5, 0);
// chickenObject.lookAt(0, 0, -5);

const duckPath = "models/rubber_duck/scene.gltf";
const duckScale = 1;
let duckObject = new THREE.Object3D();
// scene.add(duckObject);
// duckObject.position.set(0, -0.5, 0);

const loader = new GLTFLoader();
// loadModel(mekaPath, glbObject, mekaScale);
// loadModel(squidPath, squidObject, squidScale);
// loadModel(chickenPath, chickenObject, chickenScale);
// loadModel(duckPath, duckObject, duckScale);
// Select a random plane from allPlanes
let randomPlane =
	allRings[0].children[Math.floor(Math.random() * allRings[0].children.length)];
randomPlane.add(glbObject);
glbObject.position.set(0, 0, -0.01);
glbObject.rotation.set(Math.PI / 2, -Math.PI / 2, 0);
allRings[0].userData.hasCube = true;

// let randomPlane2 =
// 	allRings[1].children[Math.floor(Math.random() * allRings[1].children.length)];
// randomPlane2.add(squidObject);
// squidObject.position.set(0, 0, -0.01);
// squidObject.rotation.set(Math.PI / 2, -Math.PI / 2, 0);
// allRings[0].userData.hasCube = true;

function changeCubePosition(ring) {
	randomPlane.remove(glbObject);
	randomPlane = ring.children[Math.floor(Math.random() * ring.children.length)];
	randomPlane.add(glbObject);
}

function loadModel(modelPath, parentObject, scale) {
	loader.load(
		modelPath,
		(gltf) => {
			const model = gltf.scene;
			model.scale.set(scale, scale, scale);
			parentObject.add(model);

			const mixer = new THREE.AnimationMixer(model);
			gltf.animations.forEach((clip) => {
				mixer.clipAction(clip).play();
			});

			// Set the animation loop
			function animate() {
				requestAnimationFrame(animate);
				mixer.update(0.01); // Update the animation
				renderer.render(scene, camera);
			}
			animate();
		},
		(xhr) => {
			console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
		},
		(error) => {
			console.error("An error happened", error);
		}
	);
}

/*!SECTION */

/* SECTION - Render */
const clock = new THREE.Clock();
let cameraMovementSpeed = 0.03;

const tick = (t) => {
	const elapsedTime = clock.getElapsedTime();

	// chickenObject.rotation.y += 0.01;

	// cube.material.map.rotation += 0.01;
	const rotationAngle = Math.sin(elapsedTime) * (10 * (Math.PI / 180)); // 25 degrees in radians
	allRings[0].children[0].material.map.rotation = rotationAngle;

	// Rotate by right angles in random direction every half second
	// if (elapsedTime % 2 < 0.016) {
	// 	// Check if half a second has passed (assuming 60 FPS)
	// 	// const randomAngle = (Math.PI / 2) * Math.floor(Math.random() * 4); // 0, 90, 180, or 270 degrees
	// 	planeMaterial2.map.rotation -= Math.PI / 2;
	// }

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

	/* Update controls */
	// controls.update();

	/* Render */
	renderer.render(scene, camera);

	/* Call tick again on the next frame */
	window.requestAnimationFrame(tick);
};

tick();

/* !SECTION */

/* SECTION - Audio */

// const playButton = document.getElementById("play");
// let audioContext;
// let audio1 = new Audio();
// audio1.src = "sounds/mg-someday-clip.mp3";

// playButton.addEventListener("click", () => {
// 	audio1.play();
// 	console.log(audio1.data);
// });

// document.getElementById("audio").addEventListener("change", (event) => {
// 	// Get the selected file
// 	const file = event.target.files[0];
// 	console.log(file);

// 	// Create a new FileReader instance
// 	const reader = new FileReader();

// 	// Add event listener to the FileReader instance
// 	reader.addEventListener("load", (event) => {
// 		// Get the array buffer from the file
// 		const arrayBuffer = event.target.result;
// 		console.log(arrayBuffer);

// 		// Create a new AudioContext instance
// 		audioContext = new (window.AudioContext || window.webkitAudioContext)();

// 		// Decode the audio data
// 		audioContext.decodeAudioData(arrayBuffer, (audioBuffer) => {
// 			// Visualize the audio data
// 			visualize(audioBuffer, audioContext);
// 		});
// 	});

// 	// Read the file as an array buffer
// 	reader.readAsArrayBuffer(file);
// });

// function visualize(audioBuffer, audioContext) {
// 	console.log(audioBuffer);

// 	const channel0Data = audioBuffer.getChannelData(0); //using single channel data only

// 	/* Visualizing the audio structure */
// 	const numberOfChunks = 100;
// 	const chunkSize = Math.ceil(channel0Data.length / numberOfChunks);

// 	for (let i = 0; i < numberOfChunks; i++) {
// 		const chunk = channel0Data.slice(i * chunkSize, (i + 1) * chunkSize);
// 		const min = Math.min(...chunk);
// 		const max = Math.max(...chunk);

// 		const cubeLength = (max - min) / 2;
// 		// audioCubes[i].scale.z = cubeLength;
// 	}

// 	/* Visualizing the live audio waveform */
// 	const analyser = audioContext.createAnalyser();
// 	analyser.fftSize = 256;

// 	const frequencyBufferLength = analyser.frequencyBinCount;
// 	const frequencyData = new Uint8Array(frequencyBufferLength);

// 	const source = audioContext.createBufferSource();
// 	source.buffer = audioBuffer;
// 	source.connect(analyser);
// 	analyser.connect(audioContext.destination);
// 	source.start();
// }

/* !SECTION */

/* SECTION - Animations */

window.addEventListener("click", () => {
	// repeatMore();
	changePattern();
});

function repeatMore() {
	repeat++;
	cube.material.map.repeat.set(repeat, repeat);
	cube.material.map.needsUpdate = true;
	// material.needsUpdate = true;
}

function changePattern() {
	console.log("change pattern");
	/* Change character */

	/* Change background */

	/* Change audio */
}

/* !SECTION */
