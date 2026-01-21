import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

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
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 10, 5);
scene.add(light);

// Controls 
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 0); // center to orbit around
controls.update();

// Sample cube
const cubeGeometry = new THREE.BoxGeometry();
const cubeMaterial = new THREE.MeshNormalMaterial();
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube.position.set(0, 0, 0);
scene.add(cube);

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
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  renderer.render(scene, camera);
}
animate();