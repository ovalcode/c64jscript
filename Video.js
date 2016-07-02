function video(mycanvas, mem, cpu) {
  var localMem = mem;
  var ctx = mycanvas.getContext("2d");
  var mycpu = cpu;
  var cpuCycles = 0;
  var cycleInLine = 0;
  var cycleline = 0;
  var charPosInMem = 0;  
  var posInCanvas = 0;
  var imgData = ctx.createImageData(400, 284);


  const colors = [[0, 0, 0],
                  [255, 255, 255],
                  [136, 0, 0],
                  [170, 255, 238],
                  [204, 68, 204],
                  [0, 204, 85],
                  [0, 0, 170],
                  [238, 238, 119],
                  [221, 136, 85],
                  [102, 68, 0],
                  [255, 119, 119],
                  [51, 51, 51],
                  [119, 119, 119],
                  [170, 255, 102],
                  [0, 136, 255],
                  [187, 187, 187]];

  this.getCurrentLine = function() {
    return cycleline;
  }

  this.processpixels = function() {
    var numBytes = mycpu.getCycleCount() - cpuCycles;
    cpuCycles = mycpu.getCycleCount();
    var i;
    for (i = 0; i < numBytes; i++) {
      if (isVisibleArea()) {
        if (isPixelArea() & displayEnabled()) {
          drawCharline();
        } else {
          fillBorderColor();
        }
      }

      cycleInLine++;

      if (cycleInLine > 63) {
        cycleInLine = 0;
        cycleline++;
        updateCharPos();
      }
      if (cycleline > 311) {
        cycleline = 0;
        ctx.putImageData(imgData,0,0);
        posInCanvas = 0;
        charPosInMem = 0;
        //imgData = ctx.createImageData(400, 284);
        return true;
      }


    }
      return false;
  }

  function displayEnabled() {
    return ((localMem.readMem(0xd011) & 0x10) != 0)
  }

  function updateCharPos() {
    if ( !((cycleline > 41) & (cycleline < (42 + 200))) )
      return;
    var lineInScreen = cycleline - 42;
    if (lineInScreen == 0) {
      charPosInMem = 0;
      return;
    }
    if ((lineInScreen & 7) == 0) {
      charPosInMem = charPosInMem + 40;
    }
  }


  function drawCharline() {
    var screenCode = localMem.readMem(1024 + charPosInMem + cycleInLine - 5);
    var currentLine = localMem.readCharRom((screenCode << 3) + ((cycleline - 42) & 7));
    var textColor = localMem.readMem(0xd800 + charPosInMem + cycleInLine - 5);
    var backgroundColor = localMem.readMem(0xd021);
    for (currentCol = 0; currentCol < 8; currentCol++) {
      var pixelSet = (currentLine & 0x80) == 0x80;
      if (pixelSet) {
        imgData.data[posInCanvas + 0] = colors[textColor][0];
        imgData.data[posInCanvas + 1] = colors[textColor][1];
        imgData.data[posInCanvas + 2] = colors[textColor][2];
        imgData.data[posInCanvas + 3] = 255;
      } else {
        imgData.data[posInCanvas + 0] = colors[backgroundColor][0];
        imgData.data[posInCanvas + 1] = colors[backgroundColor][1];
        imgData.data[posInCanvas + 2] = colors[backgroundColor][2];
        imgData.data[posInCanvas + 3] = 255;
      }
      currentLine = currentLine << 1;
      posInCanvas = posInCanvas + 4;
   }
  }

  function fillBorderColor() {
    var borderColor = localMem.readMem(0xd020) & 0xf;
    var i;
    for (i = 0; i < 8; i++ ) {
      imgData.data[posInCanvas + 0] = colors[borderColor][0];
      imgData.data[posInCanvas + 1] = colors[borderColor][1];
      imgData.data[posInCanvas + 2] = colors[borderColor][2];
      imgData.data[posInCanvas + 3] = 255;
      posInCanvas = posInCanvas + 4;
    }

  }

  function isVisibleArea() {
    return (cycleInLine < 50) & (cycleline < 284);
  }

  function isPixelArea() {
    var visibleColumn = (cycleInLine > 4) & (cycleInLine < (5+40));
    var visibleRow = (cycleline > 41) & (cycleline < (42 + 200));
    return (visibleColumn & visibleRow);
  }

}



