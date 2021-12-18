let pictImg;
let backgroundImg;

let colors = [];

const colorOptions = [
  ['cyan', 'red'],
  ['lime', 'magenta'],
  ['yellow', 'blue'],
];

// Image width/height size
let W;
let H;

function preload() {
  pictImg = loadImage('image.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();

  W = 720;
  H = floor((W / pictImg.width) * pictImg.height);
  // console.log({W, H});

  // Draw background with fine block noise.
  background('#DECBB7');
  for (let i = 0; i < height / 10; i++) {
    for (let j = 0; j < width / 10; j++) {
      fill(noise(j / 100, i / 100) * 255, 50);
      rect(j * 10, i * 10, 10, 10);
    }
  }

  // Evacuate background image for each draw() calling.
  backgroundImg = get();

  // Choose colors
  colors = random(colorOptions);

  // noLoop();
}

function draw() {
  // clear with background image.
  image(backgroundImg, 0, 0, width, height);

  const g = createGraphics(W, H);

  //// Draw main sketch
  glitchColor(g);
  randomSlice(g);
  addNoise(g);
  addScanline(g);

  // Use PictureFrame Class
  const pF = new PictureFrame(g);
  g.remove();

  pF.draw((width - pF.width) / 2, (height - pF.height) / 2);
}

const glitchColor = ( g ) => {
  const gapMax = 10;
  // noise value within -gapMax to gapMax.
  const gap = noise(frameCount / 20) * gapMax * 2 - gapMax;

  // ColorA: magnify the image a little bit
  const imgColorA = createGraphics(W, H);
  imgColorA.imageMode(CENTER);
  const mag = 0.01;
  imgColorA.scale(1 + mag);
  imgColorA.tint(colors[0]);
  const xCenter = W / 2 - (mag / 2) * W;
  const yCenter = H / 2 - (mag / 2) * H;
  imgColorA.image(pictImg, xCenter, yCenter, W, H);

  // ColorB: translate image with gap value
  const imgColorB = createGraphics(W, H);
  imgColorB.imageMode(CENTER);
  imgColorB.tint(colors[1]);
  imgColorB.image(pictImg, W / 2 + gap, H / 2 + gap, W, H);

  g.background(0);

  push();
  {
    g.blendMode(ADD);

    const targetWidth = W - gapMax * 2;
    const targetHeight = H * (targetWidth / W);

    g.image(imgColorA, 0, 0, W, H, gapMax, gapMax, targetWidth, targetHeight);
    g.image(imgColorB, 0, 0, W, H, gapMax, gapMax, targetWidth, targetHeight);
  
    g.blendMode(BLEND);
  }
  pop();

  // Remove resources for Graphics.
  imgColorA.remove();
  imgColorB.remove();

}


// Reference https://gin-graphic.hatenablog.com/entry/2021/12/17/000000
const randomSlice = ( g ) => {
  const shift_size = 10;

  for(let i=0;i<10;i++){
    let sx = random(W*0.5);
    let sy = random(H*0.05);
    let x = random(W - sx*0.5);
    let y = random(H - sy*0.5);
    let ix = x + random(-1, 1)*shift_size;
    let iy = y;

    g.image( g, ix, iy, sx, sy, x, y, sx, sy);
  }

}

const addNoise = ( g ) => {

}

const addScanline = ( g ) => {

}
