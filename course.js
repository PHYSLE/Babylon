function Course() {
    return {
      current: 1,
      get currentHole() {
        return this.holes[this.current-1]
      },
      holes: [
      {
          name:'Rabbit Hole',
          par:3,
          strokes:0,
          complete:false,
          build:function(golf) {
              golf.addBall(0,2,80);
              golf.addGround(0,0,100,{bumpers:"0111"});
              golf.addGround(0,0,160,{bumpers:"0101"});
              golf.addBarrier(0,0,130,{shape:"circle",size:20});
              var t = golf.addTunnel(25.5, -14, 160,{rotation:-Math.PI/2});
              golf.addTunnel(0,0,186, {target: t});
              golf.addTunnel(-25,0,100, {target: t, rotation:-Math.PI/2});
              golf.addGround(60,-14,160,{bumpers:"1100"});
              var m = golf.addGround(60,-14,100,{bumpers:"0111"});
              golf.addHole(m);
          }
      },
      {
          name:'Around and Down',
          par:2,
          strokes:0,
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
          name:'Bird\'s Eye',
          par:2,
          strokes:0,
          complete:false,
          build:function(golf) {
              golf.addBall(0,2,100);
              golf.addGround(0,0,100,{bumpers:"0011"});
              golf.addCorner(0,0,160);
              golf.addCorner(60,0,100,{rotation:Math.PI});
              golf.addBarrier(30,0,130,{shape:"circle",size:20});
              var m = golf.addGround(60,0,160,{bumpers:"1100"});
              golf.addHole(m);
          }
      },
      {
          name:'Up Hill Drive',
          par:2,
          strokes:0,
          complete:false,
          build:function(golf) {
              golf.addBall(0,2,100);
              golf.addGround(0,0,100,{bumpers:"0111"});
              golf.addGround(0,6,158,{bumpers:"0101", rotation:{x:-.2,y:0,z:0}});
              var m = golf.addGround(0,12,216,{bumpers:"1101"});
              golf.addHole(m);
          }
      },

      {
          name:'U-Turn',
          par:3,
          strokes:0,
          complete:false,
          build:function(golf) {
              golf.addBall(0,2,100);
              golf.addGround(0,0,100,{bumpers:"0011"});
              golf.addCorner(0,0,160);
              var m = golf.addGround(60,0,100,{bumpers:"0111"});
              golf.addCorner(60,0,160,{rotation:Math.PI/2});
              golf.addHole(m);
          }
      }
      ]
    }
}
