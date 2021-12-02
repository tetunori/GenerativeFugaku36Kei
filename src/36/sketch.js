let pictImg;
let pictureMaskImg;
let backgroundImg;

function preload() {
  pictImg = loadImage('image.png');
  pictureMaskImg = loadImage('mask.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(0.5);
  noStroke();

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

  // Call 1st draw.
  draw();
}

function draw() {
  // clear with background image.
  image(backgroundImg, 0, 0, width, height);

  // Image width/height size
  const W = 640;
  const H = floor((W / pictImg.width) * pictImg.height);

  const g = createGraphics(W, H);
  const baseImg = pictImg.get();
  g.image(baseImg, 0, 0, W, H);

  // Prepare Garg image
  const gargInstance = new Garg(false, true, false);
  gargInstance.setPalette(
    '9db09d-223042-e9c770-594b3a-6a6d54-6b6539-ab985d-648f97-448ca2-f6e4b1-a5383d'
  );
  const gMask = gargInstance.createMask(floor(random(0, 9999)), 3 * W);

  // Draw mask graphic
  const maskGraphics = createGraphics(3 * W, 3 * H);
  maskGraphics.image(gMask, (3 * W) / 5, 0, (3 * W) / 2, (3 * W) / 2);
  const maskedMaskImg = maskGraphics.get();
  maskedMaskImg.mask(pictureMaskImg);
  g.image(maskedMaskImg, 0, 0, W, H);

  // Use PictureFrame Class
  const pF = new PictureFrame(g);
  pF.draw((width - pF.width) / 2, (height - pF.height) / 2);
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
