import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const loader = new GLTFLoader();

export class AIRobot {
  constructor() {
    this.url = '../assets/ai_robot.glb';
    this.mesh = null;
    this.mixer = null;
    this.animations = null;
  }

  async init() {
    return new Promise((resolve, reject) => {
      loader.load(
        this.url,
        (gltf) => {
          this.mesh = gltf.scene;

          if (gltf.animations && gltf.animations.length > 0) {
            this.mixer = new THREE.AnimationMixer(this.mesh);
            this.animations = gltf.animations;
          }

          resolve();
        },
        undefined,
        (err) => reject(err)
      );
    });
  }

  playAnimation(name) {
    if (!this.mixer) return;
    const clip = this.animations.find(a => a.name === name);
    if (clip) {
      const action = this.mixer.clipAction(clip);
      action.reset().play();
    }
  }

  update(delta) {
    if (this.mixer) this.mixer.update(delta);
  }
}