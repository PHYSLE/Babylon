var game = {


       ////////////  WiP ///////////
       predictor:null,
       predictorVerts:[],
       predictPath: function() {
           
           // this.predictor = BABYLON.MeshBuilder.CreateSphere("predictor", { diameter: 4, segments: 16 }, this.scene);
           this.predictor = this.ball.mesh.clone("predictor");
           this.predictor.position = this.ball.mesh.position.add(new BABYLON.Vector3(4,0,4));
           let shape = new BABYLON.PhysicsShape({  
               type: BABYLON.PhysicsShapeType.SPHERE}, this.scene)

           //shape.setCollisionCallbackEnabled(false);
           //shape.setShapeFilterCollideMask(9);// 9 = whatever
           const aggregate = new BABYLON.PhysicsAggregate(this.predictor, 
             shape, {
             // BABYLON.PhysicsShapeType.SPHERE, { 
               mass: 2, 
               restitution: this.globals.restitution, 
               friction: this.globals.friction }, this.scene);


           aggregate.body.setLinearDamping(game.globals.damping);


           let a = this.globals.maxImpulse;
           let angle = this.camera.alpha + Math.PI;
           let impulse = new BABYLON.Vector3(a * Math.cos(angle), 0, a * Math.sin(angle));
           aggregate.body.applyImpulse(impulse, this.predictor.position);
           
       }
       ///////////////
}