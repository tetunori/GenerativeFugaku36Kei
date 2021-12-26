let pictImg; // original image

let backgroundImg;

let dynamicFrameRate = 20;
const maxFrameRate = 30;
const thFrameCount = 40;

const unitSize = 5;
let dotData = [];

// Image width/height size
let W;
let H;

function preload() {
  pictImg = loadImage('image.jpg');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  frameRate(dynamicFrameRate);

  W = 720;
  H = floor((W / pictImg.width) * pictImg.height);
  H -= H % 10; // resize with 1st ditit being 0.
  // console.log({ W, H });

  // Draw background with fine block noise.
  background('#DECBB7');
  for (let i = 0; i < height / 10; i++) {
    for (let j = 0; j < width / 10; j++) {
      fill(noise(j / 100, i / 100) * 255, 50);
      rect(j * 10, i * 10, 10, 10);
    }
  }

  // Create base dot data
  createDotData();

  // Evacuate background image for each draw() calling.
  backgroundImg = get();
}

function draw() {
  // clear with background image.
  image(backgroundImg, 0, 0, width, height);

  const g = createGraphics(W, H);

  //// Draw main sketch
  g.noStroke();
  drawDotData(g);

  // For slow start of life game
  if (thFrameCount === frameCount) {
    dynamicFrameRate = 1;
  }

  if (thFrameCount > frameCount) {
    drawOriginalImage(g);
  } else {
    if (dynamicFrameRate < maxFrameRate) {
      dynamicFrameRate++;
    }
    frameRate(dynamicFrameRate);

    updateDotData();
  }

  // Use PictureFrame Class
  const pF = new PictureFrame(g);
  g.remove();

  pF.draw((width - pF.width) / 2, (height - pF.height) / 2);
}

// Draw dot data
const drawDotData = (g) => {
  dotData.forEach((column, j) => {
    column.forEach((dot, i) => {
      g.fill(dot === 1 ? 0 : 255);
      g.square(unitSize * j, unitSize * i, unitSize);
    });
  });
};

// Create dot data from image
const createDotData = () => {
  const columns = W / unitSize;
  const rows = H / unitSize;

  const resizedImg = createImage(W, H);
  resizedImg.copy(pictImg, 0, 0, pictImg.width, pictImg.height, 0, 0, W, H);
  resizedImg.filter(POSTERIZE, 2);
  resizedImg.filter(GRAY);

  for (let i = 0; i < columns; i++) {
    const column = [];
    for (let j = 0; j < rows; j++) {
      const p = resizedImg.get(unitSize * i, unitSize * j);
      column.push(p[0] > 200 ? 0 : 1);
    }
    dotData.push(column);
  }

  // For random data testing 
  // dotData = make2DArray(columns, rows);
  // for (let i = 0; i < columns; i++) {
  //   for (let j = 0; j < rows; j++) {
  //     dotData[i][j] = floor(random(2));
  //   }
  // }

  // console.log(dotData);
};

// Draw original Image
const drawOriginalImage = (g) => {
  g.tint(255, 255, 255, map(frameCount, thFrameCount / 2, thFrameCount, 255, 0));
  g.image(pictImg, 0, 0, W, H);
};

// Update Dot cell data
const updateDotData = () => {

  const cols = W / unitSize;
  const rows = H / unitSize;
  const next = make2DArray(cols, rows);

  // Compute next based on dotData
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      const state = dotData[i][j];

      // Count live neighbors!
      let neighbors = countNeighbours(dotData, i, j);

      if (state === 0 && neighbors === 3) {
        next[i][j] = 1;
      } else if (state === 1 && (neighbors < 2 || neighbors > 3)) {
        next[i][j] = 0;
      } else {
        next[i][j] = state;
      }
    }
  }

  dotData = next;
};

// Reference : "Coding Challenge #85: The Game of Life"
// https://youtu.be/FWSR_7kZuYg

const make2DArray = (cols, rows) => {
  let arr = new Array(cols);
  for (let i = 0; i < arr.length; i++) {
    arr[i] = new Array(rows);
  }

  return arr;
};

const countNeighbours = (data, x, y) => {
  let sum = 0;
  const cols = W / unitSize;
  const rows = H / unitSize;
  // console.log({cols, rows});

  for (let i = -1; i < 2; i++) {
    for (let j = -1; j < 2; j++) {
      let col = (cols + x + i) % cols;
      let row = (rows + y + j) % rows;

      sum += data[col][row];
    }
  }

  sum -= data[x][y];

  return sum;
};
