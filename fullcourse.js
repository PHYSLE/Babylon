function Course() {
    return {
        current: 0,
        get currentHole() {
            return this.holes[this.current-1]
        },
        holes: [
        {
            name:'Test',
            par:1,
            strokes:0,
            offset:{x:0,y:0,z:0},
            complete:false,
            start:function(golf) {
                golf.addBall(0+this.offset.x,2+this.offset.y,100+this.offset.z);
            },
            build:function(golf) {
                golf.addCorner(0+this.offset.x,0+this.offset.y,100+this.offset.z,{rotation:-Math.PI/2});
                golf.addCorner(0+this.offset.x,0+this.offset.y,160+this.offset.z);
                golf.addCorner(60+this.offset.x,0+this.offset.y,100+this.offset.z,{rotation:Math.PI});
                var m = golf.addCorner(60+this.offset.x,0+this.offset.y,160+this.offset.z,{rotation:Math.PI/2});
                golf.addHole(m);
            }
        },
        {
            name:'Bird\'s Eye',
            par:2,
            strokes:0,
            offset:{x:0,y:0,z:150},
            complete:false,
            start:function(golf) {
                golf.addBall(0+this.offset.x,2+this.offset.y,100+this.offset.z);
            },
            build:function(golf) {

                golf.addGround(0+this.offset.x,0+this.offset.y,100+this.offset.z,{bumpers:"0011"});
                golf.addCorner(0+this.offset.x,0+this.offset.y,160+this.offset.z);
                golf.addCorner(60+this.offset.x,0+this.offset.y,100+this.offset.z,{rotation:Math.PI});
                golf.addBarrier(30+this.offset.x,0+this.offset.y,130+this.offset.z,{shape:"circle",size:20});
                var m = golf.addGround(60+this.offset.x+this.offset.y,0,160+this.offset.z,{bumpers:"1100"});
                golf.addHole(m);
            }
        },
        {
            name:'Horse Shoe',
            par:3,
            strokes:0,
            offset:{x:150,y:0,z:150},
            complete:false,
            start:function(golf) {
                golf.addBall(0+this.offset.x,2+this.offset.y,100+this.offset.z);
            },
            build:function(golf) {
                golf.addGround(0+this.offset.x,0+this.offset.y,100+this.offset.z,{bumpers:"0011"});
                golf.addCorner(0+this.offset.x,0+this.offset.y,160+this.offset.z);
                var m = golf.addGround(60+this.offset.x,0+this.offset.y,100+this.offset.z,{bumpers:"0111"});
                golf.addCorner(60+this.offset.x,0+this.offset.y,160+this.offset.z,{rotation:Math.PI/2});
                golf.addHole(m);
            }
        },
        {
            name:'Bullseye',
            par:2,
            strokes:0,
            offset:{x:150,y:0,z:0},
            complete:false,
            start:function(golf) {
                golf.addBall(0+this.offset.x,2+this.offset.y,100+this.offset.z);
            },
            build:function(golf) {
                golf.addCorner(0+this.offset.x,0+this.offset.y,100+this.offset.z,{rotation:-Math.PI/2});
                golf.addCorner(0+this.offset.x,0+this.offset.y,160+this.offset.z);
                golf.addCorner(60+this.offset.x,0+this.offset.y,100+this.offset.z,{rotation:Math.PI});
                golf.addBarrier(30+this.offset.x,0+this.offset.y,130+this.offset.z,{shape:"bump",size:30});
                var m = golf.addCorner(60+this.offset.x,0+this.offset.y,160+this.offset.z,{rotation:Math.PI/2});
                golf.addHole(m);
            }
        }
        /*
        ,
        {
            name:'Dog Leg',
            par:2,
            strokes:0,
            offset:{x:0,y:0,z:0},
            complete:false,
            build:function(golf) {
                golf.addBall(0,2,100);
                golf.addGround(0,0,100,{bumpers:"0111"});
                golf.addCorner(0,0,160);
                golf.addGround(59,-6,160,{bumpers:"1010", rotation:{x:0,y:0,z:-.2}});
                var m = golf.addGround(117,-12,160,{bumpers:"1110"});
                golf.addHole(m);
            }
        },
        {
            name:'Rabbit Hole',
            par:3,
            strokes:0,
            offset:{x:0,y:0,z:0},
            complete:false,
            build:function(golf) {
                golf.addBall(0,2,80);
                golf.addGround(0,0,100,{bumpers:"0111"});
                golf.addGround(0,0,160,{bumpers:"0101"});
                golf.addBarrier(0,0,130,{shape:"circle",size:20});
                var t = golf.addTunnel(25.5, -14, 160,{rotation:-Math.PI/2});
                golf.addTunnel(0,0,186, {target: t});
                golf.addGround(60,-14,160,{bumpers:"1100"});
                var m = golf.addGround(60,-14,100,{bumpers:"0111"});
                golf.addHole(m);
            }
        },
        {
            name:'Leap Frog',
            par:2,
            strokes:0,
            offset:{x:0,y:0,z:0},
            complete:false,
            build:function(golf) {
                golf.addBall(30,2,95);
                golf.addGround(45,0,100,{bumpers:"0110",mesh:"narrow"});
                golf.addCorner(0,0,100,{rotation:-Math.PI/2});
                golf.addBarrier(38,0,124,{shape:"box",size:17});
                golf.addBarrier(52,0,124,{shape:"box",size:17});
                golf.addBarrier(38,-7,124,{shape:"box",size:17});
                golf.addBarrier(52,-7,124,{shape:"box",size:17});
                golf.addGround(0,6,158,{bumpers:"0101", rotation:{x:-.2,y:0,z:0}});
                var m = golf.addGround(0,12,216,{bumpers:"1101"});
                golf.addHole(m);
            }
        },
        {
            name:'Cat Nap',
            par:2,
            strokes:0,
            offset:{x:0,y:0,z:0},
            complete:false,
            build:function(golf) {
                golf.addBall(50,2,80);
                golf.addGround(45,0,100,{bumpers:"0010", mesh:"narrow"});
                golf.addCorner(0,0,100,{rotation:-Math.PI/2});                
                golf.addCorner(90,0,100,{rotation:Math.PI});

                golf.addBarrier(38,0,124,{shape:"box",size:17});
                golf.addBarrier(52,0,124,{shape:"box",size:17});
                golf.addBarrier(38,-7,124,{shape:"box",size:17});
                golf.addBarrier(52,-7,124,{shape:"box",size:17});
                
                golf.addBarrier(38,-7,187.5,{shape:"box",size:17});
                golf.addBarrier(52,-7,187.5,{shape:"box",size:17});
                golf.addBarrier(38,-14,187.5,{shape:"box",size:17});
                golf.addBarrier(52,-14,187.5,{shape:"box",size:17});

                
                golf.addBumper(90,3,195.5);
                golf.addBumper(75,-5,195.5, {half:true});

                var t = golf.addTunnel(115.5, 3, 216,{rotation:Math.PI/2});
                golf.addTunnel(90,12,191, {target: t});

                golf.addGround(0,-6,158,{bumpers:"0101", rotation:{x:.2,y:0,z:0}});
                golf.addGround(90,6,158,{bumpers:"0101", rotation:{x:-.2,y:0,z:0}});
                golf.addBumper(60,0,165,{rotation:{x:0,y:Math.PI/2,z:0}});
                
                var m = golf.addCorner(0,-12,216);

                golf.addGround(60,-12,216,{bumpers:"1000"});
                golf.addGround(88,-4.5,216,{bumpers:"1010", rotation:{x:0,y:0,z:.25}});
                golf.addHole(m);
            }
        },
        {
            name:'Snake Bite',
            par:4,
            strokes:0,
            offset:{x:0,y:0,z:0},
            complete:false,
            build:function(golf) {
                golf.addBall(0,2,100);
                var m = golf.addGround(60,0,100,{bumpers:"0111"});

                golf.addBumper(-30,0,145,{half:true,rotation:{x:0,y:Math.PI/2,z:0}});
                golf.addBumper(30,0,145,{half:true,rotation:{x:0,y:Math.PI/2,z:0}});
                golf.addBumper(-30,0,205,{half:true,rotation:{x:0,y:Math.PI/2,z:0}});
                golf.addBumper(30,0,205,{half:true,rotation:{x:0,y:Math.PI/2,z:0}});
                golf.addCorner(0,0,100,{rotation:-Math.PI/2});
                golf.addGround(0,0,131,{rotation:{x:-.24,y:0,z:0}});
                golf.addGround(0,0,219,{rotation:{x:+.24,y:0,z:0}});

                golf.addBumper(0,0,190,);
                golf.addBumper(0,0,160,);

                golf.addCorner(0,0,246,{rotation:Math.PI/2});
                golf.addGround(-60,0,246,{bumpers:"1001"});
                golf.addCorner(-60,0,190,{rotation:-Math.PI/2});
                golf.addGround(0,0,175);

                golf.addCorner(60,0,160,{rotation:Math.PI/2});
                golf.addHole(m);
            }
        },
        {
            name:'Ant Hill',
            par:3,
            strokes:0,
            offset:{x:0,y:0,z:0},
            complete:false,
            build:function(golf) {
                golf.addBall(0,22,80);

                golf.addBumper(0,6,70,{bumpers:"0111"});
                golf.addGround(0,20,100,{bumpers:"0111"});
                golf.addGround(0,20,160,{bumpers:"0101"});
                golf.addBarrier(0,20,112,{shape:"box",size:15, rotation:{x:0,y:Math.PI/4,z:0}});
                golf.addBarrier(-25,20,75,{shape:"box",size:10});
                golf.addBarrier(25,20,75,{shape:"box",size:10});

                var r1 = golf.addTunnel(25.5, 6, 100,{rotation:-Math.PI/2});
                var r2 = golf.addTunnel(85,0,220, {rotation:Math.PI/2});
                var l1 = golf.addTunnel(-25.5, 6, 100,{rotation:Math.PI/2});
                var l2 = golf.addTunnel(-85,0,220, {rotation:-Math.PI/2});
                var c1 = golf.addTunnel(0,1,186, {rotation:Math.PI});

                golf.addTunnel(-25,20,110, {target: l1, rotation:-Math.PI/2});
                golf.addTunnel(25,20,110, {target: r1, rotation:Math.PI/2});
                golf.addTunnel(0,20,186, {target: c1});

                golf.addGround(60,6,160,{bumpers:"0101"});
                golf.addGround(60,6,100,{bumpers:"0110"});
                golf.addTunnel(60,6,186, {target: r2});

                golf.addGround(-60,6,160,{bumpers:"0101"});
                golf.addGround(-60,6,100,{bumpers:"0011"});
                golf.addTunnel(-60,6,186, {target: l2});

                golf.addBumper(0,15,190.5,{bumpers:"0111"});

                golf.addGround(-60,0,220,{bumpers:"1010"});
                var m = golf.addGround(0,0,220,{bumpers:"1000"});
                golf.addHole(m);

                golf.addGround(60,0,220,{bumpers:"1010"});
            }
        }
            */
      ]
    }
}
