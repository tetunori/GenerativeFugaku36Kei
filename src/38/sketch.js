let pictImg;
let backgroundImg;

function preload() {
  pictImg = loadImage('image.png');
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
  const H = (W / pictImg.width) * pictImg.height;
  const orderColumn = floor(random(2, 40));

  // Prepare mask
  const maskGraphics = createGraphics(W, H);
  maskGraphics.noStroke();
  maskGraphics.fill(0);

  const truchetTile = new TruchetTile(maskGraphics);
  const unit = W / orderColumn;
  for (let i = 0; i < H / unit; i++) {
    for (let j = 0; j < W / unit; j++) {
      truchetTile.draw(Math.floor(random(0, 4)), j * unit, i * unit, unit);
    }
  }

  const mask = maskGraphics.get(0, 0, W, H);

  // Prepare image
  const copiedPictImg = pictImg.get();
  copiedPictImg.mask(mask);
  const g = createGraphics(W, H);
  
  const baseImg = pictImg.get();
  g.push();
  {
    baseImg.filter(POSTERIZE ,2);
    g.image(baseImg, 0, 0, W, H);
  }
  g.pop();  
  g.image(copiedPictImg, 0, 0, W, H);

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


class TruchetTile {
  // Set parent. Default is window
  constructor(parent = window) {
    // parent.
    this._pnt = parent;
  }

  // draw single tile
  // index varies 0 to 3.
  draw(index, x, y, size) {
    const hs = size / 2;
    const s = size;
    const p = this._pnt;

    p.push();
    {
      p.beginShape();
      [0, 1, 2].forEach((i) => {
        const v = p5.Vector.fromAngle(((2 * i + 1) * PI) / 4 + (index * PI) / 2);
        v.mult(s / Math.sqrt(2));
        p.vertex(x + hs + v.x, y + hs + v.y);
      });
      p.endShape(CLOSE);
    }
    p.pop();
  }
}
