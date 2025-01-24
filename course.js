function Course() {
    return {
      current: 1,
      get currentHole() {
        return this.holes[this.current-1]
      },
      holes: [
        {
            name:'Dog Leg',
            par:3,
            strokes:0,
            complete:false,
            build:function(golf) {
                golf.addBall(0,2,100);
                golf.addGround(0,0,100,"0011");
                golf.addCorner(0,0,160,0);
                var m = golf.addGround(60,0,100,"0111");
                //golf.addBarrier(30,0,130,"circle",20);
                golf.addCorner(60,0,160,Math.PI/2);
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
                golf.addGround(0,0,100,"0011");
                golf.addCorner(0,0,160,0);
                golf.addCorner(60,0,100,Math.PI);
                golf.addBarrier(30,0,130,"circle",20);
                var m = golf.addGround(60,0,160,"1100");
                golf.addHole(m);       
            }
        },
      ]
    }
  }