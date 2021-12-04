/* 
 * Garg : Generates A Resembling Generativemasks.
 * 
 * Version : 0.1a
 * Auther  : deconbatch (https://www.deconbatch.com/)
 * Revise  : tetunori   
 * License : Creative Commons Attribution Non-Commercial Share Alike license.
 *
 * Usage :
 *         const gg = new Garg(shadow, texture, bgColor);
 *         gg.setPalette(cPalette);
 *         image(gg.createMask(maskID, maskSize), 0, 0);
 *
 * Change log :
 *   2021.04.Dec
 *     Add remove procedure to internal graphics. Add remove() method to the Garg class.
 *   2021.16.Oct
 *     Forked from sketch.js of 2021.Aug.27 version on https://github.com/Generativemasks/generativemasks.github.io
 *     The author of the original Generativemasks is Shunsuke Takawo (https://generativemasks.on.fleek.co/).
 *
 */

class Garg {

	inst; // this instance
	cSize; // canvas size
	sRadius; // mask shape radius
	needShadow // apply shadow or not
	needTexture // apply texture or not
	needBackdrop // paint background or not
	palette; // selected palette

	constructor(_shadow, _texture, _back) {

		// define this instance canvas
		this.inst = createGraphics(0, 0);
		this.inst.colorMode(RGB, 255);

		// it must draw a mask on 1600x1600 canvas
		this.cSize = 1600;
		const offset = this.cSize / 10;
		this.sRadius = (this.cSize - offset * 2) * 3 / 4;

		// switches
		this.needShadow = _shadow;
		this.needTexture = _texture;
		this.needBackdrop = _back;

		// set random palette
		this.setRandomPalette();

	}


	/*
	 * setPalette : sets color palette from "rrggbb-rrggbb-rrggbb-rrggbb-rrggbb" style parameter.
	 */
	setPalette(_rgbStrings) {

		const rgbStr = _rgbStrings.replace(/.*\//g, ""); // can use coolors url directly

		if (this.chkRgbStrings(rgbStr)) {
			this.palette = this.getPalette(rgbStr);
		} else {
			// if _rgbStrings was invalid set random palette
			this.setRandomPalette();
		}
	}


	/*
	 * setRandomPalette : sets random color palette.
	 */
	setRandomPalette() {

		const defaultRGBs = [
			"202c39-283845-b8b08d-f2d492-f29559",
			"1f2041-4b3f72-ffc857-119da4-19647e",
			"2f4858-33658a-86bbd8-f6ae2d-f26419",
			"ffac81-ff928b-fec3a6-efe9ae-cdeac0",
			"f79256-fbd1a2-7dcfb6-00b2ca-1d4e89",
			"e27396-ea9ab2-efcfe3-eaf2d7-b3dee2",
			"966b9d-c98686-f2b880-fff4ec-e7cfbc",
			"50514f-f25f5c-ffe066-247ba0-70c1b3",
			"177e89-084c61-db3a34-ffc857-323031",
			"390099-9e0059-ff0054-ff5400-ffbd00",
			"0d3b66-faf0ca-f4d35e-ee964b-f95738",
			"177e89-084c61-db3a34-ffc857-323031",
			"780000-c1121f-fdf0d5-003049-669bbc",
			"eae4e9-fff1e6-fde2e4-fad2e1-e2ece9-bee1e6-f0efeb-dfe7fd-cddafd",
			"f94144-f3722c-f8961e-f9c74f-90be6d-43aa8b-577590",
			"555b6e-89b0ae-bee3db-faf9f9-ffd6ba",
			"9b5de5-f15bb5-fee440-00bbf9-00f5d4",
			"ef476f-ffd166-06d6a0-118ab2-073b4c",
			"006466-065a60-0b525b-144552-1b3a4b-212f45-272640-312244-3e1f47-4d194d",
			"f94144-f3722c-f8961e-f9844a-f9c74f-90be6d-43aa8b-4d908e-577590-277da1",
			"f6bd60-f7ede2-f5cac3-84a59d-f28482",
			"0081a7-00afb9-fdfcdc-fed9b7-f07167",
			"f4f1de-e07a5f-3d405b-81b29a-f2cc8f",
			"50514f-f25f5c-ffe066-247ba0-70c1b3",
			"001219-005f73-0a9396-94d2bd-e9d8a6-ee9b00-ca6702-bb3e03-ae2012-9b2226",
			"ef476f-ffd166-06d6a0-118ab2-073b4c",
			"fec5bb-fcd5ce-fae1dd-f8edeb-e8e8e4-d8e2dc-ece4db-ffe5d9-ffd7ba-fec89a",
			"e63946-f1faee-a8dadc-457b9d-1d3557",
			"264653-2a9d8f-e9c46a-f4a261-e76f51",
		];

		// this random must be free from setting the randomSeed
		this.palette = this.getPalette(this.inst.random(defaultRGBs));

	}


	/*
	 * getPalette : returns color palette.
	 * rgbStrings must be "rrggbb-rrggbb-rrggbb" style, at least 3 colors.
	 */
	getPalette(_rgbStrings) {

		const arr = _rgbStrings.split("-");
		for (let i = 0; i < arr.length; i++) {
			arr[i] = this.inst.color("#" + arr[i]);
		}

		// this shuffle must be free from setting the randomSeed
		return this.inst.shuffle(arr, true);
	}


	/*
	 * chkRgbStrings : returns RGB strings check result.
	 * true : check OK, false : error
	 */
	chkRgbStrings(_rgbStrings) {

		const rgbStr = _rgbStrings.replace(/.*\//g, ""); // can use coolors url directly
		const checker = new RegExp(/^(([0-9]|[a-fA-F]){6}-){2,}([0-9]|[a-fA-F]){6}$/);
		if (checker.test(rgbStr)) {
			return true;
		} else {
			return false;
		}
	}


	/*
	 * createMask : returns _size resized Generativemasks (ID = _id) on p5.Graphics.
	 */
	createMask(_id, _size) {
		// set color palette
		const c = this.palette[0];
		const shifted = this.palette.shift(); // without this, affect pattern

		// define mask canvas
		const maskCv = createGraphics(_size, _size);
		maskCv.pixelDensity(1);
		maskCv.colorMode(RGB, 255);
		maskCv.angleMode(DEGREES);
		maskCv.clear(); // transparent background
		maskCv.fill(c);
		maskCv.stroke(c);
		maskCv.strokeWeight(30);
		maskCv.scale(_size / this.cSize); // resize

		// set mask id
		maskCv.randomSeed(_id);
		maskCv.noiseSeed(_id);

		// draw shape and pattern
		const nScale = maskCv.random(60, 200); // must be 60 - 200
		this.drawShape(this.cSize / 2, this.cSize / 2, this.sRadius, nScale, maskCv);

		// repair palette
		this.palette.push(shifted);

		// return resized canvas
		const sizedPg = createGraphics(_size, _size);
		if (this.needBackdrop) {
			sizedPg.background(this.inst.random(this.palette));
		} else {
			sizedPg.clear();
		}
		if (this.needShadow) {
			sizedPg.drawingContext.shadowColor = this.inst.color(0, 128);
			sizedPg.drawingContext.shadowBlur = _size / 20;
			sizedPg.drawingContext.shadowOffsetY = _size / 40;
		}
		sizedPg.image(maskCv, 0, 0);
    maskCv.remove();
		if (this.needTexture) {
			sizedPg.scale(_size / this.cSize); // resize
      const texture = this.getTexture(this.cSize);
			sizedPg.image(texture, 0, 0);
      texture.remove();
		}
    
		return sizedPg;
	}


	/*
	 * drawShape : clip the shape on the center of p5.Graphics g.
	 */
	drawShape(cx, cy, r, nPhase, target) {

		const vertexPV = new Array();

		// calculate the shape
		let minX = this.cSize;
		let maxX = -this.cSize;
		let minY = this.cSize;
		let maxY = -this.cSize;
		for (let angle = 0; angle < 360; angle += 1) {
			let nr = map(target.noise(cx, cy, (angle - 180) / nPhase), 0, 1, (r * 1) / 8, r);
			nr = constrain(nr, 0, this.cSize / 2);
			let x = target.cos(angle) * nr;
			let y = target.sin(angle) * nr;
			vertexPV.push(createVector(x, y));
			minX = min(minX, x);
			maxX = max(maxX, x);
			minY = min(minY, y);
			maxY = max(maxY, y);
		}

		// draw shape on the center of canvas
		const divX = lerp(minX, maxX, 0.5);
		const divY = lerp(minY, maxY, 0.5);
		target.push();
		//	target.translate(cx, cy, r);
		target.translate(cx, cy);
		target.rotate(90);
		target.beginShape();
		for (let p of vertexPV) {
			vertex(p.x - divX, p.y - divY);
		}
		target.endShape(CLOSE);
		target.pop();

		// clip shape
		target.drawingContext.clip();

		this.drawGraphic(-divY, -divX, this.cSize, this.cSize, this.palette, target);

	}


	/*
	 * drawGraphic : draw graphics on p5.Graphics target.
	 */
	drawGraphic(x, y, w, h, colors, target) {
		let g = createGraphics(w / 2, h);
		g.angleMode(DEGREES);
		g.translate(x, y);
		let gx = 0;
		let gy = 0;
		let gxStep, gyStep;

		if (target.random() > 0.5) {
			while (gy < g.height) {
				gyStep = target.random(g.height / 100, g.height / 5);
				if (gy + gyStep > g.height || g.height - (gy + gyStep) < g.height / 20) {
					gyStep = g.height - gy;
				}
				gx = 0;
				while (gx < g.width) {
					gxStep = gyStep;
					if (gx + gxStep > g.width || g.width - (gx + gxStep) < g.width / 10) {
						gxStep = g.width - gx;
					}
					// g.ellipse(gx+gxStep/2,gy+gyStep/2,gxStep,gyStep);
					this.drawPattern(g, gx, gy, gxStep, gyStep, colors, target);
					gx += gxStep;
				}
				gy += gyStep;
			}
		} else {
			while (gx < g.width) {
				gxStep = target.random(g.width / 100, g.width / 5);
				if (gx + gxStep > g.width || g.width - (gx + gxStep) < g.width / 20) {
					gxStep = g.width - gx;
				}
				gy = 0;
				while (gy < g.height) {
					gyStep = gxStep;
					if (gy + gyStep > g.height || g.height - (gy + gyStep) < g.height / 10) {
						gyStep = g.height - gy;
					}
					// g.ellipse(gx+gxStep/2,gy+gyStep/2,gxStep,gyStep);
					this.drawPattern(g, gx, gy, gxStep, gyStep, colors, target);
					gy += gyStep;
				}
				gx += gxStep;
			}
		}

		target.push();
		//	target.translate(x + w / 2, y + h / 2);
		target.translate(w / 2, h / 2);
		target.imageMode(CENTER);
		target.scale(1, 1);
		target.image(g, -g.width / 2, 0);
		target.scale(-1, 1);
		target.image(g, -g.width / 2, 0);
		target.pop();

    g.remove();
	}


	/*
	 * drawPattern : draw patterns on p5.Graphics g.
	 */
	drawPattern(g, x, y, w, h, colors, target) {
		let rotate_num = (int(target.random(4)) * 360) / 4;
		g.push();
		g.translate(x + w / 2, y + h / 2);
		g.rotate(rotate_num);
		if (rotate_num % 180 == 90) {
			let tmp = w;
			w = h;
			h = tmp;
		}
		g.translate(-w / 2, -h / 2);
		if (this.needShadow) {
			g.drawingContext.shadowColor = this.inst.color(0, 84);
			g.drawingContext.shadowBlur = max(w, h) / 5;
		}
		let sep = int(target.random(1, 6));

		let c = -1,
			pc = -1;
		g.stroke(0, (20 / 100) * 255);

		switch (int(target.random(8))) {
			case 0:
				for (let i = 1; i > 0; i -= 1 / sep) {
					while (pc == c) {
						c = target.random(colors);
					}
					pc = c;
					g.push();
					g.scale(i);
					g.strokeWeight(1 / i);
					g.fill(c);
					g.arc(0, 0, w * 2, h * 2, 0, 90);
					g.pop();
				}
				break;
			case 1:
				for (let i = 1; i > 0; i -= 1 / sep) {
					while (pc == c) {
						c = target.random(colors);
					}
					pc = c;
					g.push();
					g.fill(c);

					g.push();
					g.translate(w / 2, 0);
					g.scale(i);
					g.strokeWeight(1 / i);
					g.arc(0, 0, w, h, 0, 180);
					g.pop();

					g.push();
					g.translate(w / 2, h);
					g.scale(i);
					g.strokeWeight(1 / i);
					g.arc(0, 0, w, h, 0 + 180, 180 + 180);
					g.pop();
					g.pop();
				}
				break;
			case 2:
				for (let i = 1; i > 0; i -= 1 / sep) {
					while (pc == c) {
						c = target.random(colors);
					}
					pc = c;
					g.push();
					g.fill(c);

					g.push();
					g.scale(i);
					g.strokeWeight(1 / i);
					g.arc(0, 0, w * sqrt(2), h * sqrt(2), 0, 90);
					g.pop();

					g.push();
					g.translate(w, h);
					g.scale(i);
					g.strokeWeight(1 / i);
					g.arc(0, 0, w * sqrt(2), h * sqrt(2), 0 + 180, 90 + 180);
					g.pop();

					g.pop();
				}
				break;
			case 3:
				for (let i = 1; i > 0; i -= 1 / sep) {
					while (pc == c) {
						c = target.random(colors);
					}
					pc = c;
					g.push();
					g.translate(w / 2, h / 2);
					g.scale(i);
					g.strokeWeight(1 / i);
					g.fill(c);
					g.ellipse(0, 0, w, h);
					g.pop();
				}
				break;
			case 4:
				for (let i = 1; i > 0; i -= 1 / sep) {
					while (pc == c) {
						c = target.random(colors);
					}
					pc = c;
					g.push();
					g.scale(i);
					g.strokeWeight(1 / i);
					g.fill(c);
					g.triangle(0, 0, w, 0, 0, h);
					g.pop();
				}
				break;
			case 5:
				for (let i = 1; i > 0; i -= 1 / sep) {
					while (pc == c) {
						c = target.random(colors);
					}
					pc = c;
					g.push();
					g.fill(c);

					g.push();
					g.translate(w / 2, 0);
					g.scale(i);
					g.strokeWeight(1 / i);
					g.triangle(-w / 2, 0, w / 2, 0, 0, h / 2);
					g.pop();

					g.push();
					g.translate(w / 2, h);
					g.scale(i);
					g.strokeWeight(1 / i);
					g.triangle(-w / 2, 0, w / 2, 0, 0, -h / 2);
					g.pop();
					g.pop();
				}
				break;
			case 6:
				for (let i = 1; i > 0; i -= 1 / sep) {
					while (pc == c) {
						c = target.random(colors);
					}
					pc = c;
					g.push();
					g.fill(c);

					g.push();
					g.scale(i);
					g.strokeWeight(1 / i);
					g.triangle(0, 0, w * sqrt(2), 0, 0, h * sqrt(2));
					g.pop();

					g.push();
					g.translate(w, h);
					g.scale(i);
					g.strokeWeight(1 / i);
					g.arc(0, 0, -w * sqrt(2), 0, 0, -h * sqrt(2));
					g.pop();

					g.pop();
				}
				break;
			case 7:
				for (let i = 1; i > 0; i -= 1 / sep) {
					while (pc == c) {
						c = target.random(colors);
					}
					pc = c;
					g.push();
					g.translate(w / 2, h / 2);
					g.rotate(45);
					g.scale(i);
					g.strokeWeight(1 / i);
					g.fill(c);
					g.rectMode(CENTER);
					g.square(0, 0, sqrt(sq(w) + sq(h)));
					g.pop();
				}
				break;
		}
		g.pop();
	}


	/*
	 * getTexture : returns texture image on _size x _size p5.Graphics.
	 */
	getTexture(_size) {
		const tex = createGraphics(_size, _size);
		tex.colorMode(HSB, 360, 100, 100, 100);
		tex.angleMode(DEGREES);

		tex.strokeWeight(0.1);
		for (let x = 0; x < _size; x += 20) {
			for (let y = 0; y < _size; y += 20) {
				let angle = tex.random(75, 105);
				let d = _size / 3; //10;
				tex.stroke(0, 0, 0, tex.random(20));
				tex.line(
					x + tex.cos(angle) * d,
					y + tex.sin(angle) * d,
					x + tex.cos(angle + 180) * d,
					y + tex.sin(angle + 180) * d
				);
			}
		}

		return tex;
	}

  /*
	 * remove : remove resources on p5.Graphics.
	 */
	remove() {
		this.inst.remove();
	}

}