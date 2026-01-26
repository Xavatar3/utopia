export class Path {
   #root;

   constructor(root = '') {
      this.#root = String(root).endsWith('/') ? root : root + '/';
   }

   // Base directories
   get base() {
      return {
         models: `${this.#root}assets/models/`,
         textures: `${this.#root}assets/textures/`,
         sounds: `${this.#root}assets/sounds/`,
         scripts: `${this.#root}js/scripts/`
      };
   }

   // Models
   get models() {
      return {
         character: this.base.models + 'ai_robot.glb'
      };
   }

   // Textures
   get textures() {
      return {
         metal: this.base.textures + 'metal.jpg',
         glass: this.base.textures + 'glass.png'
      };
   }

   // Sounds
   get sounds() {
      return {
         bgMusic: this.base.sounds + 'background.mp3'
      };
   }

   // Scripts
   get scripts() {
      return {
         characters: this.base.scripts + 'characters.js'
      };
   }
}