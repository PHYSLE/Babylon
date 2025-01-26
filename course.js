function Course() {
    return {
      current: 1,
      get currentHole() {
        return this.holes[this.current-1]
      },
      holes: [
        {
            name:'Hole One',
            par:1,
            strokes:0,
            complete:false,
            build:function(golf) {
                golf.addBall(0,2,80);
                var m = golf.addGround(0,0,100,{bumpers:"1111"});
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
      ]
    }
  }
