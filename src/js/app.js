import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Pane } from 'tweakpane';
import { AIRobot } from './characters.js';

// Settings
const settings = new Pane({
	title: 'Settings',
	//container: document.body,
	expanded: true,
});

// Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(
  75, window.innerWidth / window.innerHeight, 0.1, 1000
);
camera.position.z = 5;

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//Light

// Light Settings
const lightSettings = settings.addFolder({
	title: 'Light',
	expanded: true
});

// Directional Light
const sunSettings = {
	color: 0,
	intensity: 2,
	desc: {
		label: 'Intensity',
		description: 'Sun Light',
		min: 0,
		max: 10,
		step: 0.1
	}
};

const sunLight = new THREE.DirectionalLight(0xffffff, sunSettings.intensity);
sunLight.position.set(5, 10, 5);
scene.add(sunLight);

lightSettings.addBinding(sunSettings, 'intensity', sunSettings.desc).on('change', (v) => {
  let key = v.target.key;
  sunLight[key] = v.value;
});

// Ambient Light
const ambientSettings = {
	color: 0,
	intensity: 1,
	desc: {
		label: 'Intensity',
		description: 'Natural Light',
		min: 0,
		max: 10,
		step: 0.1
	}
};

const ambientLight = new THREE.AmbientLight(0xffffff, ambientSettings.intensity); 
scene.add(ambientLight);

lightSettings.addBinding(ambientSettings, 'intensity', ambientSettings.desc).on('change', (v) => {
  let key = v.target.key;
  ambientLight[key] = v.value;
});


// Fill light
const fill = new THREE.DirectionalLight(0xffffff, 0.3);
fill.position.set(-5, 5, -5);
//scene.add(fill);

// Controls 
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 0); // center to orbit around
controls.update();

// Character 
const character = new AIRobot();
await character.init();
character.mesh.scale.set(4,4,4)
character.mesh.position.set(0, -1, 0)
scene.add(character.mesh)

//Platform
const circleRadius = 3;
const bridgeWidth = 2;
const bridgeLength = 10;
const rectHeight = 10;
const L = bridgeWidth;
const r = circleRadius;
const h = Math.sqrt((r * r) - (L/2)*(L/2));
const theta = 2 * Math.asin(bridgeWidth / (2 * circleRadius));
const rectZ = rectHeight/2 + bridgeLength + h;

// Circle platform
const circleGeo = new THREE.CircleGeometry(circleRadius, 64, 0, 2 * Math.PI);
const circleMat = new THREE.MeshStandardMaterial({ 
	color: 0x8888ff,
	wireframe: true,
	side: THREE.DoubleSide
});
const circlePlatform = new THREE.Mesh(circleGeo, circleMat);
circlePlatform.rotation.x = -Math.PI / 2;
circlePlatform.position.set(0, -1, 0);
scene.add(circlePlatform);

// Rectangle platform
const rectGeo = new THREE.PlaneGeometry(10, rectHeight, 10, 10);
const rectMat = new THREE.MeshStandardMaterial({
	color: 0x8888ff,
	wireframe: true,
	side: THREE.DoubleSide
});
const rectPlatform = new THREE.Mesh(rectGeo, rectMat);
rectPlatform.rotation.x = -Math.PI / 2;
rectPlatform.position.set(0, -1, -rectZ); // shift along X
scene.add(rectPlatform);

// Bridge
const bridgeGeo = new THREE.PlaneGeometry(bridgeWidth, bridgeLength, 6, 20);
const bridgeMat = new THREE.MeshStandardMaterial({ 
	color: 0x8888ff,
	wireframe: true,
	side: THREE.DoubleSide
});
const bridge = new THREE.Mesh(bridgeGeo, bridgeMat);
bridge.rotation.x = -Math.PI / 2;

// Position bridge between circle and rectangle
const bridgeZ = bridgeLength/2 + h;
bridge.position.set(0, -1, -bridgeZ); 
scene.add(bridge);

/*
//Segment prototype
const arcPoints = hole.getPoints(64);
const arcGeo = new THREE.BufferGeometry().setFromPoints(
  arcPoints.map(p => new THREE.Vector3(p.x, 0, p.y))
);

const arcLine = new THREE.Line(
  arcGeo,
  new THREE.LineBasicMaterial({ color: 0x00ff00 })
);

arcLine.position.set(0, -1, 0);
scene.add(arcLine);*/

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  character.mesh.rotation.y += 0.005;
  renderer.render(scene, camera);
}
animate();