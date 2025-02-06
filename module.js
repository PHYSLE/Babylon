import * as BABYLON from '/node_modules/@babylonjs/core/index.js';
import * as SkyMaterial from '/node_modules/@babylonjs/materials/sky/skyMaterial.js';

function Game() {
    const game = {
        version:"0.0.1",
        scene: null,
        camera: null,
        engine: null,
        sky: null,
        init: async function() {
            const canvas = document.getElementById("canvas");
            this.engine = new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true, disableWebGL2Support: false });
            this.scene = new BABYLON.Scene(this.engine);
            this.camera = new BABYLON.ArcRotateCamera("camera", Math.PI/4, Math.PI/4, 10, new BABYLON.Vector3(0,0,0));
            this.camera.setPosition(new BABYLON.Vector3(0, 140, -100));
            this.camera.attachControl(canvas, true);
            this.sky = new BABYLON.SkyMaterial("skymat", this.scene);
            this.sky.backFaceCulling = false;

            const skybox = BABYLON.MeshBuilder.CreateBox("sky", { size: 1000.0 }, this.scene);
            skybox.material = this.materials.sky;
        },
        run: function() {
            game.engine.runRenderLoop(function () {
                if (game.scene) {
                    game.scene.render();
                }
            });
        }
    }
    return game;
}

export default Game;