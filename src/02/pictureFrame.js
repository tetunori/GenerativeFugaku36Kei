/*
  Class for Drawing picture frame mounting your image.

  Usage example.
  ```
    const pF = new PictureFrame(img);  
    pF.draw(0, 0);
  ```

  Reference: ツカモトsan(@tkmts5)'s tweet https://twitter.com/tkmts5/status/1459877788861620225
*/

class PictureFrame {
  // Syntax
  //   PictureFrame(img, [marginSize], [bezelSize], [bezelColor], [marginColor])
  // Parameters
  //   img: p5.Image: image to be mounted.
  //   marginSize: Number: size of margin. Optional and default value is 80;
  //   marginColor:  p5.Color|gray scale etc... : color of margin Optional and default value is '#f1ece6';
  //   bezelSize: Number: size of bezel. Optional and default value is 20;
  //   bezelColor:  p5.Color|gray scale etc... : color of bezel. Optional and default value is 50(=dark gray);
  constructor(img, marginSize = 80, marginColor = '#f1ece6', bezelSize = 20, bezelColor = 50) {
    this.img = img;

    // Parameters for frame
    this.marginSize = marginSize;
    this.marginColor = marginColor;
    this.bezelSize = bezelSize;
    this.bezelColor = bezelColor;

    // Whole picture frame width/heigth size
    this.width = this.img.width + 2 * this.marginSize;
    this.height = this.img.height + 2 * this.marginSize;
  }

  // Syntax
  //   draw(x, y, [w],[h])
  // Parameters
  //   x: Number: x-coordinate of the frame.
  //   y: Number: y-coordinate of the frame.
  //   w: Number: width of the frame. (Optional) Default value is image width + both margin.
  //   h: Number: height of the frame. (Optional) Default value is image height + both margin.
  draw(x, y, w = this.img.width + 2 * this.marginSize, h = this.img.height + 2 * this.marginSize) {
    push();
    {
      // Draw frame(by stroke!)
      stroke(this.bezelColor);
      strokeWeight(this.bezelSize);
      drawingContext.shadowBlur = 10;
      drawingContext.shadowColor = '#00000055';
      drawingContext.shadowOffsetX = 5;
      drawingContext.shadowOffsetY = 5;

      // Draw margin
      fill(this.marginColor);
      rect(x, y, w, h);
    }
    pop();

    // Mount image.
    const imageWidth = w - 2 * this.marginSize;
    const imageHeight = h - 2 * this.marginSize;
    image(this.img, x + this.marginSize, y + this.marginSize, imageWidth, imageHeight);
  }
}
