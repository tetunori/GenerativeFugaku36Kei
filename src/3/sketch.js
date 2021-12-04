let pictImg;
let backgroundImg;

// Image width/height size
let W;
let H;

function preload() {
  pictImg = loadImage('image.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  // frameRate(10);

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

  noLoop();
  
}

let t = 0;
function draw() {
  // clear with background image.
  image(backgroundImg, 0, 0, width, height);

  const g = createGraphics(W, H);
  g.background(0);

  t += .3;
  // const ratio = floor(1 + ((sin(t) + 1) / 2) * 8);
  const ratio = 6;
  // console.log(ratio);
  const asciiart_width = floor(W / ratio);
  const asciiart_height = asciiart_width / 2;
  const asciiartGfx = createGraphics(asciiart_width, asciiart_height);

  asciiartGfx.image(pictImg, 0, 0, asciiartGfx.width, asciiartGfx.height);
  // asciiartGfx.filter(POSTERIZE, 2+(sin(t)+1)/2*7);
  // asciiartGfx.filter(DILATE );
  asciiartGfx.filter(POSTERIZE, 3); // For displaying green color
  asciiartGfx.filter(POSTERIZE, 2);
  const myAsciiArt = new AsciiArt(this);
  const ascii_arr = myAsciiArt.convert(asciiartGfx, asciiart_width, asciiart_height);
  asciiartGfx.remove();

  const typedGfx = createGraphics(W, H);
  typedGfx.textAlign(CENTER, CENTER);
  // typedGfx.textFont('monospace', 13+(sin(t)+1)/2*6);
  // typedGfx.textFont('monospace', 4+(sin(t)+1)/2*6);
  typedGfx.textFont('monospace', 8);
  typedGfx.textStyle(BOLD);

  myAsciiArt.typeArray2d(ascii_arr, typedGfx, 0, 0, W, H);
  // image(myAsciiArt.__graphics,0,0,W,H);

  myAsciiArt.__graphics.remove();  // avoid memory leak of createGraphics.
  const copiedPictImg = pictImg.get();
  copiedPictImg.mask(typedGfx, W, H);
  typedGfx.remove();
  g.image(copiedPictImg, 0, 0, W, H);

  // Use PictureFrame Class
  const pF = new PictureFrame(g);
  g.remove();

  pF.draw((width - pF.width) / 2, (height - pF.height) / 2);

}
