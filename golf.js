function Game() {
    const game = {
        engine: null,
        scene: null,
        camera: null,
        ball: null, 
        ballAggregate: null,
        impulseTime: 0,
        shots: 0,
        globals: {
            restitution: .5,
            friction: .75,
            gravity: -9.8,
            damping: .34,
            impulseModifier: 10,
            maxImpulse: 120
        },
        materials: {
            ground: null
        },
        init: async function() {
            const canvas = document.getElementById("canvas");

            this.engine = new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true, disableWebGL2Support: false });
            this.scene = new BABYLON.Scene(this.engine);
        
            // create a light aiming at 0,1,0
            const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), this.scene);
            light.intensity = 0.7; // dim light
        
            // create a camera
            this.camera = new BABYLON.ArcRotateCamera("camera", Math.PI/4, Math.PI/4, 10, new BABYLON.Vector3(0,0,0));   
            this.camera.setPosition(new BABYLON.Vector3(0, 140, -100));
            this.camera.attachControl(canvas, true); 

            // enable Havok
            const havok = await HavokPhysics();
            this.scene.enablePhysics(new BABYLON.Vector3(0, this.globals.gravity, 0), new BABYLON.HavokPlugin(true, havok));
        
            // create ground material
            this.materials.ground = new BABYLON.StandardMaterial("groundMat");
            this.materials.ground.diffuseColor = new BABYLON.Color3(0, .8, 0);
        },
        addGround: function(template, x, y, z) {
            const ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 40, height: 40 }, this.scene);
            ground.position = new BABYLON.Vector3(x, y, z);
            ground.material = this.materials.ground;

            const aggregate = new BABYLON.PhysicsAggregate(ground, BABYLON.PhysicsShapeType.BOX, { 
                mass: 0, 
                restitution: 0, 
                friction: 0 }, this.scene);
            return ground;
        },
        addBall: function(x, y, z) {
            const ball = BABYLON.MeshBuilder.CreateSphere("ball", { diameter: 4, segments: 16 }, this.scene);
            ball.position = new BABYLON.Vector3(x, y, z);

            const aggregate = new BABYLON.PhysicsAggregate(ball, BABYLON.PhysicsShapeType.SPHERE, { 
                mass: 2, 
                restitution: this.globals.restitution, 
                friction: this.globals.friction }, this.scene);
            aggregate.body.setLinearDamping(game.globals.damping);
            this.ball = ball
            this.ballAggregate = aggregate.body;
            this.camera.lockedTarget = ball; 
            return ball;
        },
        addHole: function(mesh) {
            const tube = BABYLON.MeshBuilder.CreateCylinder("tube", {
                height:8, 
                diameterTop:8, 
                diameterBottom:8, 
                tessellation:16, 
                subdivisions:1
              }, this.scene);

              tube.position = mesh.position;
      
              // use Constructive Solid Geometry to subtract tube from ground
              // @TODO - use CSG2 instead (CSG2 not working-  Error while creating the CSG: Not manifold)
              var groundCSG = BABYLON.CSG.FromMesh(mesh);
              var tubeCSG = BABYLON.CSG.FromMesh(tube);

              var hole = groundCSG.subtract(tubeCSG).toMesh("hole", null, this.scene);
              hole.position = mesh.position;
              hole.material = this.materials.ground;

              const aggregate = new BABYLON.PhysicsAggregate(hole, BABYLON.PhysicsShapeType.MESH, { 
                mass: 0, 
                restitution: 0, 
                friction: 0 }, this.scene);

              tube.dispose();
              mesh.dispose();
              return hole;
        },
        shoot: function() {
            let impulseAmount = 50; // todo
            let angle  = this.camera.getDirection(this.ball.position);
            // this only looks like it works when ball is at x=0
            angle.y = 0; // Discard the y component
            angle.normalize(); // Make it of length 1 
            let impulse = new BABYLON.Vector3(impulseAmount * angle.x, 0, impulseAmount * angle.z);
            //this.ballAggregate.applyImpulse(impulse, this.ball.getAbsolutePosition());
            this.ballAggregate.applyImpulse(impulse, this.ball.position);
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