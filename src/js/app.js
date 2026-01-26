import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Pane } from 'tweakpane';
import nipplejs from 'nipplejs';
import { Path } from './path.js';
import { Light } from './light.js'
import { AIRobot } from './characters.js';
import RAPIER from '@dimforge/rapier3d';
import { RapierHelper } from 'three/addons/helpers/RapierHelper.js';

// Initialising 
const path = new Path('../');

// World
const world = new RAPIER.World({ x: 0, y: -9.81, z: 0 });

// Settings
const settings = new Pane({
   title: 'Settings',
   //container: document.body,
   expanded: true,
});

// Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//Light
const light = new Light();
scene.add(light);

// Light Settings
const lightSettings = settings.addFolder({
   title: 'Light',
   expanded: true
});

// Sunlight
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

lightSettings.addFolder({ title: 'Sunlight', expanded: true }).addBinding(sunSettings, 'intensity', sunSettings.desc).on('change', (v) => {
   let key = v.target.key;
   light.sun[key] = v.value;
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

lightSettings.addFolder({ title: 'Ambient Light', expanded: true }).addBinding(ambientSettings, 'intensity', ambientSettings.desc).on('change', (v) => {
   let key = v.target.key;
   light.ambient[key] = v.value;
});

// Controls 
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 0); // center to orbit around
controls.update();

//Joystick
const joystick = nipplejs.create({
   zone: document.getElementById('joystick-zone'),
   mode: 'static',      // static or dynamic
   position: { left: '50px', bottom: '50px' },
   color: 'blue',
});

// Listen for movement
let inputVector = { x: 0, z: 0 };
joystick.on('move', (evt, data) => {
   if (data && data.vector) {
      inputVector.x = data.vector.x; // -1 to 1
      inputVector.z = data.vector.y; // -1 to 1
   }
});

joystick.on('end', () => {
   inputVector.x = 0;
   inputVector.z = 0;
});

// Character 

// Mesh
const character = new AIRobot();
await character.init();
character.mesh.scale.set(4,4,4)
character.mesh.position.set(0, -1, 0)
scene.add(character.mesh)

// Physics Body
const bodyX = character.mesh.position.x;
const bodyY = character.mesh.position.y;
const bodyZ = character.mesh.position.z;
const characterBody = world.createRigidBody(
   RAPIER.RigidBodyDesc.kinematicPositionBased().setTranslation(bodyX, bodyY, bodyZ)
   );
   
   const box = new THREE.Box3().setFromObject(character.mesh);
   const size = new THREE.Vector3();
   box.getSize(size);
   
   const boxHelper = new THREE.Box3Helper(box, 0xff0000); // red color
   scene.add(boxHelper);
   
   const colliderWidth = (1 * size.z /2) + (0.05 * size.x);
   const colliderHeight = 0.15 * size.y;
   const collider = world.createCollider(
      RAPIER.ColliderDesc.capsule(colliderHeight, colliderWidth).setTranslation(0, (size.y / 2), (0.05 * size.z)),
      characterBody
      );
      const pos = characterBody.translation();
      characterBody.setTranslation({
         x: pos.x,
         y: pos.y,
         z: pos.z
      });
      
      // Debug Visualisor
      const { vertices, colors } = world.debugRender();
      
      // Use THREE.LineSegments + BufferGeometry
      const geom = new THREE.BufferGeometry();
      geom.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
      geom.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
      const lines = new THREE.LineSegments(geom, new THREE.LineBasicMaterial({ vertexColors: true }));
      scene.add(lines);
      
      function debuglines() {
         const data = world.debugRender();
         geom.attributes.position.array.set(data.vertices);
         geom.attributes.color.array.set(data.colors);
         geom.attributes.position.needsUpdate = true;
         geom.attributes.color.needsUpdate = true;
      }
      
      // Showcase character
      let bodyYRotation =0;
      let idle = true;
      function showCase() {
         // Compute quaternion manually from Euler Y angle
         const half = bodyYRotation * 0.5;
         const sinHalf = Math.sin(half);
         const cosHalf = Math.cos(half);
         const quat = {
            x: 0,
            y: sinHalf,
            z: 0,
            w: cosHalf
         };
         
         //characterBody.setNextKinematicTranslation({ x: newX, y: newY, z: newZ });
         //if(idle){bodyYRotation += 0.005; } else { bodyYRotation = 0;}
         characterBody.setNextKinematicRotation(quat);
         box.setFromObject(character.mesh);
         boxHelper.updateMatrixWorld()
         
         // Sync mesh with physics body
         const t = characterBody.translation();
         const r = characterBody.rotation();
         character.mesh.position.set(t.x, (t.y), t.z);
         character.mesh.quaternion.set(r.x, r.y, r.z, r.w);
         
      }
      
      function updateCharacter(dt) {
         const speed = 5;
         const dx = inputVector.x * speed * dt;
         const dz = inputVector.z * speed * dt;
         const pos = characterBody.translation();
         
         showCase();
         if (dx === 0 && dz === 0) {
            return;
         } else { idle = false; }
         
         // Update kinematic body
         characterBody.setTranslation({
            x: pos.x + dx,
            y: pos.y,
            z: pos.z - dz,
            w: 10
         });
         
         //Sync
         
         // Rotate mesh to face movement
         character.mesh.rotation.y = Math.PI + Math.atan2(dx, dz);
         
      }
      
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
      
      // Physics Timer
      const step = 1/60; // ⏱️ Fixed rate (physics at 60Hz)
      let accumulator = 0; // ⏳ Time accumulator
      let lastTime = performance.now() / 1000; // 📍 Track last frame time
      
      function deltaTime() {
         // ⏱ Compute how much time has passed
         const now = performance.now() / 1000; // 🕒 Current time in seconds
         let delta = now - lastTime; 
         
         delta = Math.min(delta, 0.25); // 🔒 Cap delta to avoid giant chunks after pauses
         accumulator += delta; // 📥 Accumulator
         lastTime = now;
         
         while (accumulator >= step) {
            // 🔁 Run physics in fixed chunks
            world.step(); // Rapier physics tick
            accumulator -= step;
         }
      };
      
      // Animation loop
      let errorLimit = 3;
      let lastTimedt = 0;
      function animate() {
         // 🌀 Loop
         requestAnimationFrame(animate);
         deltaTime();
         
         const nowdt = performance.now() / 1000;
         const dt = Math.min(nowdt - lastTimedt, 0.1); // cap delta
         lastTimedt = nowdt;
         
         try {
            
            updateCharacter(dt);
            debuglines(); // updates outlines each frame
            renderer.render(scene, camera); // Render the scene
            
         } catch (e) {
            
            if(errorLimit > 0) {
               //console.error('Render failed', e);
               alert('Render failed \n' + e);
               errorLimit--;
            }
            
         }
      }
      animate();