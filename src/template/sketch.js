
let pictImg; // original image

let backgroundImg;

// Image width/height size
let W;
let H;

function preload() {
  pictImg = loadImage('image.jpg');
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
}

function draw() {
  // clear with background image.
  image(backgroundImg, 0, 0, width, height);

  const g = createGraphics(W, H);

  //// Draw main sketch
  funcfunc(g);

  // Use PictureFrame Class
  const pF = new PictureFrame(g);
  g.remove();

  pF.draw((width - pF.width) / 2, (height - pF.height) / 2);
}

// 
const funcfunc = (g) => {
  g.image(pictImg, 0, 0, W, H);
};

