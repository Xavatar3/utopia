import * as THREE from 'three';

export class Light extends THREE.Group {
   constructor() {
      super();
      
      // Components
      const components = [];
      this.components = components;
      
      // Directional Light
      const sun = new THREE.DirectionalLight(0xffffff, 2);
      sun.position.set(5, 10, 5);
      this.sun = sun;
      components.push(sun);
      this.add(sun);
      
      // Point Light
      const point = new THREE.PointLight(0x00ff00, 10, 100);
      point.position.set(0, 1, 1);
      this.point = point;
      components.push(point);
      this.add(point)
      
      // Ambient Light
      const ambient = new THREE.AmbientLight(0xffffff, 0.5);
      this.ambient = ambient;
      components.push(ambient);
      this.add(ambient);
   };
}

/*
// Optional: adjust intensity of all lights at once
setIntensity(value) {
Object.values(this.lights).forEach(light => {
if (light.intensity !== undefined) light.intensity = value;
});
}
*/


/*
export class LightRig extends THREE.Group {

applyPreset(preset) {
this.intensity = preset.intensity;
this.color = preset.color;
this.sync();
}

sync() {
this.sun.intensity = this.intensity;
this.sun.color.set(this.color);
}

lerpTo(preset, t) {
this.intensity = THREE.MathUtils.lerp(
this.intensity,
preset.intensity,
t
);

this.color = new THREE.Color(this.color)
.lerp(new THREE.Color(preset.color), t)
.getHex();

this.sync();
}
}

const LIGHT_PRESETS = {
noon: {
intensity: 1.5,
color: 0xffffff,
},
sunset: {
intensity: 0.8,
color: 0xff8844,
},
night: {
intensity: 0.25,
color: 0x334466,
},
};
*/