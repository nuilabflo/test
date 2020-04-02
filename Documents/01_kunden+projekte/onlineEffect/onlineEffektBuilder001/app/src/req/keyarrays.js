let envelopFunction01 = function(xx, ep) {
  let pitch = (ep[1] - ep[0]) / 2;
  let axisSection = ep[1] - 2 * pitch;
  return xx * pitch + axisSection;
};

let envelopFunction02 = function(xx, ep) {
  let pitch = (ep[1][0] - ep[0][0]) / (ep[1][1] - ep[0][1]);
  let axisSection = ep[1][0] - ep[1][1] * pitch;
  return xx * pitch + axisSection;
};

let envArray = values => {
  let myEnvArray = [];
  let one, two;
  for (let i = 0; i < values.length - 1; i++) {
    one = values[i];
    two = values[i + 1];

    let ep = [[one.top + 4, one.left + 4], [two.top + 4, two.left + 4]];
    //[[(50-(one.top))/50,(50-(one.left))/50],[(50-(two.top))/50,(50-(two.left))/50]];

    for (let ii = one.left + 4; ii < two.left + 4; ii += 0.01) {
      myEnvArray.push(envelopFunction02(ii, ep));
    }
  }

  return [myEnvArray, two.left + 4];
};

let getKeyArray = (type, c, ep, fileBuffer) => {
  // return 2+x
  let count, p, o, x, y;
  let bufferSound = [];
  count = c;
  p = 500.0 / count;

  //console.log(type);

  switch (type) {
    case "sinus":
      o = 500;
      function sinY(x) {
        return Math.sin(x);
      }

      for (x = 0; x < 500; x += 0.01) {
        let mypi = (x / p) * 2 * Math.PI;
        y = sinY(mypi);
        y *= -250;
        y *= envelopFunction01(x / 250, ep);
        bufferSound.push(y / 250);
        y += 250;
      }
      break;
    case "rect":
      o = 250;
      let oo;
      function squareY(x) {
        let pp = p / 2;
        if (Math.round(x * 500) % Math.round(pp * 500) === 0) {
          if (o === 250) {
            o = -250;
          } else {
            o = 250;
          }

          if (Math.round(x) === 500) {
            o = 0;
          }

          if (ep[0] <= ep[1]) {
            oo = o * Math.abs(envelopFunction01(x / 250, ep));
          } else {
            oo = o * Math.abs(envelopFunction01((x + p / 2) / 250, ep));
          }
          //console.log(oo);
        }

        return oo;
      }
      for (x = 0; x < 500; x += 0.01) {
        y = squareY(x); //-50;
        bufferSound.push(y / 250);
        // y*=(envelopFunction(x/50,ep))
        y += 250;
        //analyzePath.add(new myScope.Point(x,y))
      }
      break;
    case "saw":
      count = c;
      p = 500.0 / count;
      let i = 0;
      function sawY(xx) {
        xx -= (i * p) / 2;
        return xx * -1 * count;
      }
      for (let ii = 0; ii <= count; ii++) {
        let start = ii * p;
        let stop = start + p;
        for (x = start; x < stop; x += 0.01) {
          y = sawY(x - ii * p - (i * p) / 2) + 250;
          y *= envelopFunction01((x - p / 2) / 250, ep);
          if (x - p / 2 >= 0 && x - p / 2 <= 500) {
            bufferSound.push(y / 250);
          }
          y += 250;
          //analyzePath.add(new myScope.Point(x-(p/2),y))
        }
        i = 0;
      }
      break;
    case "triangle":
      count = c;
      p = 500.0 / count;
      o = 500;
      function triY(x) {
        return (Math.abs((x % p) - p / 2) * 1000) / p;
      }

      for (x = 0; x < 500 + p; x += 0.01) {
        y = triY(x) - 250;
        y *= envelopFunction01((x - p / 4) / 250, ep);
        if (x - p / 4 > 0 && x - p / 4 <= 500) {
          bufferSound.push(y / 250);
        }
        y += 250;
      }
      break;
    case "file":
      if (fileBuffer) {
        bufferSound = fileBuffer;
      }
      break;
    default:
      bufferSound = [type];
  }

  return bufferSound;
};

module.exports = {
  getKeyArray,
  envArray
};
