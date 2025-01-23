function Game() {
    const game = {
        globals: {
            restitution: .5,
            friction: .75,
            gravity: -9.8,
            damping: .34,
            impulseModifier: 10,
            maxImpulse: 120,
            tileSize: 60,
            bumperHeight: 12
        },
        engine: null,
        scene: null,
        camera: null,
        ball: {
            diameter: 4,
            mesh: null,
            body: null,
            events: new EventTarget(),
            stopped: true,
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
            green: null,
            bumper: null
        },
        shadows:[],
        init: async function() {
            const canvas = document.getElementById("canvas");

            this.engine = new BABYLON.Engine(canvas, true, { 
                preserveDrawingBuffer: true, 
                stencil: true, 
                disableWebGL2Support: false });
            this.scene = new BABYLON.Scene(this.engine);
        
            //const light1 = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), this.scene);
            const light1 = new BABYLON.DirectionalLight("light", new BABYLON.Vector3(0, -5, 5), this.scene);
            const light2 = new BABYLON.DirectionalLight("light", new BABYLON.Vector3(5, -4, 1), this.scene);
            light1.intensity = 0.7; // dim light
            light2.intensity = 0.7; // dim light

            //this.shadows.push(new BABYLON.ShadowGenerator(1024, light1));
            this.shadows.push(new BABYLON.ShadowGenerator(1024, light2));
        
            // create a camera
            this.camera = new BABYLON.ArcRotateCamera("camera", Math.PI/4, Math.PI/4, 10, new BABYLON.Vector3(0,0,0));   
            this.camera.setPosition(new BABYLON.Vector3(0, 140, -100));
            this.camera.attachControl(canvas, true); 

            // enable Havok
            const havok = await HavokPhysics();
            this.scene.enablePhysics(new BABYLON.Vector3(0, this.globals.gravity, 0), new BABYLON.HavokPlugin(true, havok));
        
            // create materials
            this.materials.green = new BABYLON.StandardMaterial("greenmat");
            this.materials.green.diffuseColor = new BABYLON.Color3(.6, .8, .6);
            this.materials.green.diffuseTexture = new BABYLON.Texture("/assets/green-seamless.jpg");
            this.materials.green.diffuseTexture.uScale = 1;
            this.materials.green.diffuseTexture.vScale = 1;

            this.materials.bumper = new BABYLON.StandardMaterial("bumpermat");
            this.materials.bumper.diffuseColor = new BABYLON.Color3(.2, .4, .15);



            this.bumperRoot = BABYLON.MeshBuilder.CreateBox("bumper", {
                height: this.globals.bumperHeight, width:this.globals.tileSize, depth: 1}, this.scene);
            this.bumperRoot.material = this.materials.bumper;
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
        addGround: function(x, y, z, bumpers="0000", pitch=0, mesh="ground") {
            const ground = BABYLON.MeshBuilder.CreateGround("ground", { 
                width: this.globals.tileSize, 
                height: this.globals.tileSize }, this.scene);
            ground.position = new BABYLON.Vector3(x, y, z);
            ground.material = this.materials.green;
            ground.receiveShadows = true;
            if (pitch != 0) {
                ground.rotation = new BABYLON.Vector3(pitch, 0, 0);
            }

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
            const ground = BABYLON.MeshBuilder.CreateGround("ground", { 
                width: this.globals.tileSize, 
                height: this.globals.tileSize }, this.scene);
            ground.position = new BABYLON.Vector3(x, y, z);
            ground.material = this.materials.green;
            ground.receiveShadows = true;

            new BABYLON.PhysicsAggregate(ground, BABYLON.PhysicsShapeType.MESH, { 
                mass: 0, 
                restitution: 0, 
                friction: 0 }, this.scene);

            const box = BABYLON.MeshBuilder.CreateBox("box", { 
                width: this.globals.tileSize+1, 
                height: this.globals.bumperHeight,
                depth: this.globals.tileSize+1 }, this.scene);
            box.position = new BABYLON.Vector3(x, y, z);
            box.material = this.materials.ground;
            
            const cylinder = BABYLON.MeshBuilder.CreateCylinder("tube", {
                height:15, 
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
            corner.material = this.materials.bumper;
            corner.receiveShadows = true;

            new BABYLON.PhysicsAggregate(corner, BABYLON.PhysicsShapeType.MESH, { 
                mass: 0, 
                restitution: 0, 
                friction: 0 }, this.scene);

            // delete the cylinder and original mesh 
            cylinder.dispose();           
            box.dispose();   
        },
        addBarrier: function(x, y, z, shape, size) {
            var mesh = null
            var physicsShape = null;
            switch(shape) {
                case "circle":
                    mesh = BABYLON.MeshBuilder.CreateCylinder("barrier", {
                        height:this.globals.bumperHeight/2, 
                        diameterTop:size, 
                        diameterBottom:size, 
                        tessellation:size < 20 ? 24 : 32, 
                        subdivisions:1
                    }, this.scene);
                    physicsShape = BABYLON.PhysicsShapeType.CYLINDER;
                break;
                case "box":
                    mesh = BABYLON.MeshBuilder.CreateBox("barrier", {
                        height:this.globals.bumperHeight/2, width: size, depth: size
                    }, this.scene);
                    physicsShape = BABYLON.PhysicsShapeType.BOX;

                break; 
            }
            mesh.position = new BABYLON.Vector3(x, this.globals.bumperHeight/4, z);
            mesh.material = this.materials.bumper;
            const aggregate = new BABYLON.PhysicsAggregate(mesh, physicsShape, { 
                mass: 0, 
                restitution: 0, 
                friction: 0 }, this.scene);

        },
        addBall: function(x, y, z) {
            const ball = BABYLON.MeshBuilder.CreateSphere("ball", { 
                diameter: this.ball.diameter, 
                segments: 16 }, this.scene);
            ball.position = new BABYLON.Vector3(x, y, z);
            this.camera.lockedTarget = ball; 
            this.ball.mesh = ball;

            const aggregate = new BABYLON.PhysicsAggregate(ball, BABYLON.PhysicsShapeType.SPHERE, { 
                mass: 2, 
                restitution: this.globals.restitution, 
                friction: this.globals.friction }, this.scene);
            aggregate.body.setLinearDamping(game.globals.damping);
            this.ball.body = aggregate.body;
            for(let i=0; i<this.shadows.length; i++) {
                this.shadows[i].getShadowMap().renderList.push(ball);
            }

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
            hole.material = this.materials.green;
            hole.receiveShadows = true;

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

        aimLine: [],
        renderAimLine: false,
        disposeAimLine: function() {
            console.log('disposing ' + this.aimLine.length + ' segments')
            if (this.aimLine.length > 0) {
                for(let i=0; i<this.aimLine.length; i++) {
                    this.aimLine[i].dispose();
                }
                this.aimLine = [];
            }
        },
        refreshAimLine: function() {
            let aimLineSegments = 10; 
            let a = (this.getImpulseAmount() * (1 + this.globals.damping)) / aimLineSegments;
            let angle = this.camera.alpha + Math.PI;
            let len = new BABYLON.Vector3(a * Math.cos(angle), 0, a * Math.sin(angle));
            let offset = BABYLON.Vector3.Zero();
            let distance = this.ball.diameter + 1; // start aim line this far from ball
            let padding = new BABYLON.Vector3(distance * Math.cos(angle), 0, distance * Math.sin(angle));

            for(let i=0; i<aimLineSegments; i++) {
                offset = len.multiply(new BABYLON.Vector3(i, 0, i));
                let start = this.ball.mesh.position.add(offset).add(padding);
                let end = start.add(len);

                const options = {
                    useVertexAlpha: true,
                    points: [start, end],
                    updatable: true, // may not need this because we can't add points
                };
                let line = BABYLON.MeshBuilder.CreateLines("line", options, this.scene);    
                line.alpha = 1-(i/aimLineSegments);
                this.aimLine.push(line);
            } 
            // dispose after create to avoid blinking
            if (this.aimLine.length > aimLineSegments * 2) {
                for(let i=0; i<aimLineSegments; i++) {
                    this.aimLine[0].dispose();
                    this.aimLine.shift();
                }
            }
        },
     
        swing: function() {
            if (this.ball.stopped) {
                this.impulseTime = new Date();
                this.renderAimLine = true;
                // this.predictPath(); WiP prediction.js
            }
        },
        strike: function() {
            if (this.ball.stopped) {
                this.renderAimLine = false;
                this.disposeAimLine();
                clearInterval(this.aimLineInterval);
                let a = this.getImpulseAmount()
                let angle = this.camera.alpha + Math.PI;
                let impulse = new BABYLON.Vector3(a * Math.cos(angle), 0, a * Math.sin(angle));
                
                this.ball.stopped = false;
                this.ball.body.applyImpulse(impulse, this.ball.mesh.position);
                game.strokes++;
            }
        },
        run: function() {
            game.scene.actionManager = new BABYLON.ActionManager(game.scene);

            game.scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction({
                trigger: BABYLON.ActionManager.OnEveryFrameTrigger }, 
                () => { // set a min threshold for velocity          
                    if (!game.ball.stopped && game.ball.velocity < 1) {
                        game.ball.stop();
                    }
                }
            ));

            game.engine.runRenderLoop(function () {
                var step = 0;
                if (game.scene) {
                    game.scene.render();
                    if (game.renderAimLine) {
                        if (step % 200 == 0) {
                            game.refreshAimLine();
                        }
                    }
                    step++;
                }
            });  
        },
        addEventListener:function(type, callback, options = {}) {
            this.ball.events.addEventListener(type, callback, options);
        },
    }

    return game;
}