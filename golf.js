function Game() {
    const game = {
        globals: {
            restitution: .5,
            friction: .75,
            gravity: -9.8,
            damping: .34,
            impulseModifier: 10,
            maxImpulse: 120,
            tileSize: 60
        },
        engine: null,
        scene: null,
        camera: null,
        ball: {
            mesh: null,
            body: null,
            events: new EventTarget(),
            stopped: false,
            strike: function(impulse) {
                this.stopped = false;
                this.body.applyImpulse(impulse, this.mesh.position);
            },
            stop:function() {  
                this.stopped = true;
                this.body.setAngularVelocity(BABYLON.Vector3.Zero());
                this.body.setLinearVelocity(BABYLON.Vector3.Zero());   
                this.events.dispatchEvent(new Event('stop'));
            },
            get velocity() {
                let v = this.body.getLinearVelocity();
                return (Math.abs(v.x) + Math.abs(v.z));
            }
        }, 
        physicsBody: null,
        bumperRoot: null,
        impulseTime: 0,
        getImpulseAmount: function() {
            let amount= (new Date() - this.impulseTime) / this.globals.impulseModifier;
            if (amount > this.globals.maxImpulse) {
                amount = this.globals.maxImpulse;
            }
            return amount;
        },
        strokes: 0,

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

            this.bumperRoot = BABYLON.MeshBuilder.CreateBox("bumper", {height: 10, width:this.globals.tileSize, depth: 1}, this.scene);
            this.bumperRoot.material = this.materials.ground;
            this.bumperRoot.isVisible = false;
        },
        addBumper: function(x, y, z, rotation) {
            const bumper = this.bumperRoot.createInstance("bumper");
            bumper.position = new BABYLON.Vector3(x, y, z);
            bumper.rotation = new BABYLON.Vector3(0, rotation, 0);
            
            const aggregate = new BABYLON.PhysicsAggregate(bumper, BABYLON.PhysicsShapeType.BOX, { 
                mass: 0, 
                restitution: 0, 
                friction: 0 }, this.scene);
        },
        addGround: function(template, x, y, z, bumpers="0000") {
            const ground = BABYLON.MeshBuilder.CreateGround("ground", { 
                width: this.globals.tileSize, 
                height: this.globals.tileSize }, this.scene);
            ground.position = new BABYLON.Vector3(x, y, z);
            ground.material = this.materials.ground;

            const aggregate = new BABYLON.PhysicsAggregate(ground, BABYLON.PhysicsShapeType.BOX, { 
                mass: 0, 
                restitution: 0, 
                friction: 0 }, this.scene);

            /* top | right | bottom | left */
            for(let i=0; i<4; i++) {
                if (bumpers[i]=="1") {
                    switch(i) {
                        case 0: this.addBumper(x, y, z + this.globals.tileSize/2, 0);
                            break;
                        case 1: this.addBumper(x + this.globals.tileSize/2, y, z, Math.PI/2);
                            break;
                        case 2: this.addBumper(x, y, z - this.globals.tileSize/2, 0);                    
                            break;
                        case 3: this.addBumper(x - this.globals.tileSize/2, y, z, Math.PI/2);
                            break;
                    }
                }
            }
            return ground;
        },
        addCorner: function(x, y, z, rotation) {
            const box = BABYLON.MeshBuilder.CreateBox("box", { 
                width: this.globals.tileSize+1, 
                height: 10,
                depth: this.globals.tileSize+1 }, this.scene);
            box.position = new BABYLON.Vector3(x, y, z);
            box.material = this.materials.ground;
            
            const cylinder = BABYLON.MeshBuilder.CreateCylinder("tube", {
                height:10, 
                diameterTop:this.globals.tileSize * 2-1, 
                diameterBottom:this.globals.tileSize * 2-1, 
                tessellation:64, 
                subdivisions:1
            }, this.scene);

            cylinder.position = new BABYLON.Vector3(x+this.globals.tileSize/2, y+5, z-this.globals.tileSize/2);
            var boxCSG = BABYLON.CSG.FromMesh(box);
            var cylinderCSG = BABYLON.CSG.FromMesh(cylinder);

            var corner = boxCSG.subtract(cylinderCSG).toMesh("corner", null, this.scene);
            corner.position = new BABYLON.Vector3(x, y, z);
            corner.rotation = new BABYLON.Vector3(0, rotation, 0);
            corner.material = this.materials.ground;

            const aggregate = new BABYLON.PhysicsAggregate(corner, BABYLON.PhysicsShapeType.MESH, { 
                mass: 0, 
                restitution: 0, 
                friction: 0 }, this.scene);

            // delete the cylinder and original mesh 
            cylinder.dispose();           
            box.dispose();   
        },
        addBall: function(x, y, z) {
            const ball = BABYLON.MeshBuilder.CreateSphere("ball", { diameter: 4, segments: 16 }, this.scene);
            ball.position = new BABYLON.Vector3(x, y, z);
            this.camera.lockedTarget = ball; 
            this.ball.mesh = ball;

            const aggregate = new BABYLON.PhysicsAggregate(ball, BABYLON.PhysicsShapeType.SPHERE, { 
                mass: 2, 
                restitution: this.globals.restitution, 
                friction: this.globals.friction }, this.scene);
            aggregate.body.setLinearDamping(game.globals.damping);
            this.ball.body = aggregate.body;

            return ball;
        },
        addHole: function(mesh) {
            const cylinder = BABYLON.MeshBuilder.CreateCylinder("tube", {
                height:10, 
                diameterTop:8, 
                diameterBottom:8, 
                tessellation:16, 
                subdivisions:1
            }, this.scene);

            cylinder.position = mesh.position;
    
            // use Constructive Solid Geometry to subtract tube from ground
            // @TODO - use CSG2 instead (CSG2 not working-  Error while creating the CSG: Not manifold)
            var groundCSG = BABYLON.CSG.FromMesh(mesh);
            var cylinderCSG = BABYLON.CSG.FromMesh(cylinder);

            var hole = groundCSG.subtract(cylinderCSG).toMesh("hole", null, this.scene);
            hole.position = mesh.position;
            hole.material = this.materials.ground;

            const aggregate = new BABYLON.PhysicsAggregate(hole, BABYLON.PhysicsShapeType.MESH, { 
                mass: 0, 
                restitution: 0, 
                friction: 0 }, this.scene);

            cylinder.dispose();
            mesh.dispose(); // delete the original mesh    
            
            const trigger = BABYLON.MeshBuilder.CreateBox("trigger", {height: 1, width:8, depth:8}, this.scene);
            trigger.position = new BABYLON.Vector3(hole.position.x, -5, hole.position.z);
            trigger.actionManager = new BABYLON.ActionManager(this.scene);
            
            trigger.actionManager.registerAction(new BABYLON.ExecuteCodeAction({
                    trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
                    parameter: this.ball
                }, () => {
                  setTimeout(() => {
                    this.ball.stop();
                    this.ball.events.dispatchEvent(new Event('hole'))
                  }, "1000");
                },
            ));
                       
            return hole;
        },
        swing: function() {
            this.impulseTime = new Date();
        },
        strike: function() {
            if (this.ball.stopped) {
                let a = this.getImpulseAmount()
                let angle = this.camera.alpha + Math.PI;
                let impulse = new BABYLON.Vector3(a * Math.cos(angle), 0, a * Math.sin(angle));
                this.ball.strike(impulse);
                game.strokes++;
            }
        },
        run: function() {
            game.scene.actionManager = new BABYLON.ActionManager(game.scene);

            game.scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction({
                trigger: BABYLON.ActionManager.OnEveryFrameTrigger }, 
                () => {
                    //console.log('velocity = ' + game.ball.velocity);
                    if (!game.ball.stopped && game.ball.velocity < 1) {
                        game.ball.stop();
                    }
                }
            ));

            game.engine.runRenderLoop(function () {
                if (game.scene) {
                    game.scene.render();
                }
            });  
        },
        addEventListener:function(type, callback, options = {}) {
            this.ball.events.addEventListener(type, callback, options);
        },
    }

    return game;
}