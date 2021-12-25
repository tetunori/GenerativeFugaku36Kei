// References
//   Neon: http://blog.livedoor.jp/reona396/archives/55853620.html
//         and https://openprocessing.org/sketch/951912
//   filter_sobel.js: https://www.rand-on.com/projects/2018_edge_detection/edge_detection.html

let pictImg; // original image
let edgeImg; // edge detection
let edgeBlurImg; // edge detection + blur

let backgroundImg;

let charScales = [];
let randomChars = [];

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

  // Create images for neon effect
  edgeImg = createImage(W, H);
  edgeImg.copy(pictImg, 0, 0, pictImg.width, pictImg.height, 0, 0, W, H);
  apply_sobel_filter(edgeImg);

  edgeBlurImg = createImage(W, H);
  edgeBlurImg.copy(edgeImg, 0, 0, W, H, 0, 0, W, H);
  edgeBlurImg.filter(BLUR, 5);

  // Prepare chars for code rain
  prepareChars();

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

// Prepare characters for code rain
const prepareChars = () => {
  const chars = [];
  // const uCodeKatakanaStart = 0x30A1;
  // const uCodeKatakanaEnd = 0x30F6;
  const uCodeKatakanaStart = 0xff61;
  const uCodeKatakanaEnd = 0xff9f;
  const uCodeAlphabetStart = 0x0041;
  const uCodeAlphabetEnd = 0x005a;
  const uCodeNumberStart = 0x0030;
  const uCodeNumberEnd = 0x0039;

  for (let i = 0; i < uCodeKatakanaEnd - uCodeKatakanaStart + 1; i++) {
    chars.push(String.fromCharCode(uCodeKatakanaStart + i));
  }
  for (let i = 0; i < uCodeAlphabetEnd - uCodeAlphabetStart + 1; i++) {
    chars.push(String.fromCharCode(uCodeAlphabetStart + i));
  }
  for (let i = 0; i < uCodeNumberEnd - uCodeNumberStart + 1; i++) {
    chars.push(String.fromCharCode(uCodeNumberStart + i));
  }

  // Random characters
  for (let i = 0; i < 60; i++) {
    const charArray = [];
    for (let j = 0; j < 60; j++) {
      charArray.push(chars[floor(random(0, chars.length))]);
    }
    randomChars.push(charArray);
  }

  // Character scale
  for (let i = 0; i < 60; i++) {
    charScales.push(floor(random(8, 25)));
  }
};

function draw() {
  // clear with background image.
  image(backgroundImg, 0, 0, width, height);

  const g = createGraphics(W, H);

  //// Draw main sketch
  drawNeonImage(g);
  drawCodeRain(g);
  drawOriginalImage(g);

  // Use PictureFrame Class
  const pF = new PictureFrame(g);
  g.remove();

  pF.draw((width - pF.width) / 2, (height - pF.height) / 2);
}

// Neon Image
const drawNeonImage = (g) => {
  g.push();
  {
    g.blendMode(ADD);
    g.tint(0, 255, 0);
    g.image(edgeBlurImg, 0, 0, W, H);

    g.tint(255, 255, 255, 100);
    g.image(edgeImg, 0, 0, W, H);
  }
  g.pop();
};

let t = 0;
const drawCodeRain = (g) => {
  const gfx = createGraphics(W, H);
  gfx.drawingContext.shadowBlur = 10;
  gfx.textAlign(CENTER);
  gfx.textFont('monospace');

  for (j = 0; j < 60; j++) {
    const tSize = charScales[j];
    gfx.textSize(tSize);

    for (i = 0; i < 60; i++) {
      if (floor(t - i + j * j * j * 13) % 60 === 0) {
        // latest char
        let codeRainColor = '#CAFFCA';
        gfx.drawingContext.shadowColor = codeRainColor;
        gfx.fill(codeRainColor);
        gfx.text(randomChars[j][i], 12 * j, tSize * i);

        // old chars with alpha
        const numChars = 10;
        for (let k = 1; k < numChars; k++) {
          codeRainColor = color('#00FF00');
          codeRainColor.setAlpha(map(k, 1, numChars, 255, 20));
          gfx.drawingContext.shadowColor = codeRainColor;
          gfx.fill(codeRainColor);
          gfx.text(randomChars[j][i - k], 12 * j, tSize * (i - k));
        }
      }
    }
  }

  g.push();
  {
    g.imageMode(CENTER);
    g.scale(-1, 1);
    g.image(gfx, -W / 2, H / 2, W, H);
  }
  g.pop();
  gfx.remove();

  t += 1;
};

// Original Image
const drawOriginalImage = (g) => {
  g.tint(255, 255, 255, map(cos(frameCount / 30), -1, 1, 0, 255));
  g.image(pictImg, 0, 0, W, H);
};
