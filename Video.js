function video(mycanvas, mem, cpu) {
  var localMem = mem;
  var ctx = mycanvas.getContext("2d");
  var mycpu = cpu;
  var cpuCycles = 0;
  var cycleInLine = 0;
  var cycleline = 0;
  var charPosInMem = 0;  
  var posInCanvas = 0;
  var imgData = ctx.createImageData(320, 200);


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


  this.processpixels = function() {
    var numBytes = mycpu.getCycleCount() - cpuCycles;
    cpuCycles = mycpu.getCycleCount();
    var i;
    for (i = 0; i < numBytes; i++) {
      if (isVisibleArea) {
        if (isPixelArea) {
          drawCharline();
        } else {
          fillBorderColor();
        }
      }

      cycleInLine++;

      if (cycleInLine > 63) {
        cycleInLine = 0;
        cycleline++;
        if ((((cycleline - 42) & 7) == 0) & (cycleline < (42 + 200))) {
         charPosInMem = charPosInMem + 40;
         if (charPosInMem > 999)
           charPosInMem = 0;
        } 
      }
      if (cycleline > 311) {
        cycleline = 0;
      }

      
    }
    //TODO:
    //When number of lines finished
    //force draw
    //recreate frame
    //remove call to update canvas in runbatch method
    //call putimage method
    //return boolean indicating runbatch must exit
    //change runbatch to exit if above rteurn true
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
    var borderColor = localMem.readMem(0xd020);
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

  this.updateCanvas = function() {
    var imgData = ctx.createImageData(320, 200);
    var i, currentScreenPos;
    var currentScreenX = 0;
    var currentScreenY = 0;
    for (currentScreenPos = 0; currentScreenPos < 1000; currentScreenPos++) {
      var screenCode = localMem.readMem(1024 + currentScreenPos);
      if (currentScreenX == 40) {
        currentScreenX = 0;
        currentScreenY++;
      }
      var currentRow, currentCol;
      for (currentRow = 0; currentRow < 8; currentRow++) {
        var currentLine = localMem.readCharRom((screenCode << 3) + currentRow);
        for (currentCol = 0; currentCol < 8; currentCol++) {
          var pixelSet = (currentLine & 0x80) == 0x80;
          var pixelPosX = (currentScreenX << 3) + currentCol;
          var pixelPosY = (currentScreenY << 3) + currentRow;
          var posInBuffer = (pixelPosY * 320 + pixelPosX) << 2;
          if (pixelSet) {
            imgData.data[posInBuffer + 0] = 0;
            imgData.data[posInBuffer + 1] = 0;
            imgData.data[posInBuffer + 2] = 0;
            imgData.data[posInBuffer + 3] = 255;
          } else {
            imgData.data[posInBuffer + 0] = 255;
            imgData.data[posInBuffer + 1] = 255;
            imgData.data[posInBuffer + 2] = 255;
            imgData.data[posInBuffer + 3] = 255;

          }
          currentLine = currentLine << 1;
        }
      }
      currentScreenX++;
    }
    ctx.putImageData(imgData,0,0);
  }
}
