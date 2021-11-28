
// Reference https://github.com/pzp1997/p5-matter/blob/master/examples/draw-barriers/draw-barriers.js

let pictImg;
let maskImg;
let backgroundImg;

let barriers = [];
let balls = [];
let moutainBalls = [];




function preload() {
  pictImg = loadImage('image.png');
}

function addBall() {

  if(balls.length < 90){
    //  balls.push(matter.makeBall(random(0, width), 20, random(40,100),{
  balls.push(matter.makeBall(800, 80, random(40,100),{
  // balls.push(matter.makeSign('🌑', 830, 80, {
    restitution: .2,
  }));
  }
 

  // if(moutainBalls.length <90){
  // moutainBalls.push(matter.makeBall(830, 200, random(40,100),{
  //   restitution: .2,
  // }));

  // }

}


function setup() {
  createCanvas(windowWidth, windowHeight);
  textSize(72);
  // noStroke();
  matter.init();
  noFill();
  strokeWeight(2);
  addBall();
  setInterval(addBall,10);

  const len = pathData.length;
  for(let i=0; i< len-1;i++){
    let x = (pathData[i].x + pathData[i+1].x) / 2;
    let y = (pathData[i].y + pathData[i+1].y) / 2;
    let length = dist(pathData[i].x, pathData[i].y, pathData[i+1].x, pathData[i+1].y);
    let theta = atan2(pathData[i+1].y - pathData[i].y, pathData[i+1].x - pathData[i].x);
    let barrier = matter.makeBarrier(x, y, length + 10, 4, {
      angle: theta
    });
    barriers.push(barrier);
  }



  // beginShape();
  // pathData.forEach( v => {
  //   vertex(v.x,v.y);
  // });
  // endShape();

  // // Draw background with fine block noise.
  // background('#DECBB7');
  // for (let i = 0; i < height / 10; i++) {
  //   for (let j = 0; j < width / 10; j++) {
  //     fill(noise(j / 100, i / 100) * 255, 50);
  //     rect(j * 10, i * 10, 10, 10);
  //   }
  // }

  // // Evacuate background image for each draw() calling.
  // backgroundImg = get();

  // // Call 1st draw.
  // draw();
}

function draw() {

  background('white');

  image(pictImg,0,0,pictImg.width,pictImg.height);
  noStroke();

  noFill();
  for (let i = 0; i < barriers.length; i++) {
    barriers[i].show();
  }

  fill('#40037d');
  drawingContext.fillStyle = `rgb(
        ${Math.floor(255 - 42.5 * 0)},
        ${Math.floor(255 - 42.5 * 0)},
        0)`;
  noStroke();
  stroke('black')

  for (var j = balls.length - 1; j >= 0; j--) {
    var ball = balls[j];
    ball.show();
    if (ball.isOffCanvas()) {
      matter.forget(ball);
    }
  }

  for (var j = moutainBalls.length - 1; j >= 0; j--) {
    var ball = moutainBalls[j];
    ball.show();
    if (ball.isOffCanvas()) {
      matter.forget(ball);
    }
  }
  // // clear with background image.
  // image(backgroundImg, 0, 0, width, height);

  // // Image width/height size
  // const W = 640;
  // const H = (W / pictImg.width) * pictImg.height;

  // // p5.pattern settings
  // const PALETTE = shuffle(['#40037d', '#0041cd', '#cac600', '#009b17', '#e1036b', '#b96301'], true);

  // // Prepare image
  // pictImg.mask(maskImg);
  // const g = createGraphics(W, H);
  // g.patternColors(PALETTE);
  // g.pattern(randPattern(W * 0.2));
  // g.rectPattern(0, 0, W, H - 2);
  // g.image(pictImg, 0, 0, W, H);

  // // Use PictureFrame Class
  // const pF = new PictureFrame(g);
  // pF.draw((width - pF.width) / 2, (height - pF.height) / 2);
}

// p5.pattern randam pattern function
function randPattern(t) {
  const ptArr = [
    PTN.noiseGrad(0.4),
    PTN.wave(t / int(random(1, 3)), t / int(random(10, 20)), t / 5, t / 10),
    PTN.dot(t / 10, (t / 10) * random(0.2, 1)),
  ];
  return random(ptArr);
}

function keyTyped() {
  if (key === 's') {
    saveImage();
  } 
}

// Save generated image
const saveImage = () => {
  const name = getYYYYMMDD_hhmmss(true) + '.png';
  saveCanvas(name, 'png');
};

// get Timestamp string
const getYYYYMMDD_hhmmss = (isNeedUS) => {
  const now = new Date();
  let retVal = '';

  // YYMMDD
  retVal += now.getFullYear();
  retVal += padZero2Digit(now.getMonth() + 1);
  retVal += padZero2Digit(now.getDate());

  if (isNeedUS) {
    retVal += '_';
  }

  // hhmmss
  retVal += padZero2Digit(now.getHours());
  retVal += padZero2Digit(now.getMinutes());
  retVal += padZero2Digit(now.getSeconds());

  return retVal;
};

// padding function
const padZero2Digit = (num) => {
  return (num < 10 ? '0' : '') + num;
};
