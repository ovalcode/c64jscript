function video(backgroundCanvas, spriteBackgroundCanvas, foregroundCanvas, spriteforegroundCanvas, mem, cpu) {
  var localMem = mem;
  var ctxBackground = backgroundCanvas.getContext("2d");
  var ctxSpriteBackground = spriteBackgroundCanvas.getContext("2d");
  var ctxForeground = foregroundCanvas.getContext("2d");
  var ctxSpriteForeground = spriteforegroundCanvas.getContext("2d");

  var mycpu = cpu;
  var cpuCycles = 0;
  var cycleInLine = 0;
  var cycleline = 0;
  var charPosInMem = 0;  
  var registers = new Uint8Array(0x2e);
  var colorRAM = new Uint8Array(1000);
  var posInCanvas = 0;

  var backgroundData = ctxBackground.createImageData(400, 284);
  var spriteBackgroundData = ctxSpriteBackground.createImageData(400, 284);
  var foregroundData = ctxForeground.createImageData(400, 284);
  var spriteForegroundData = ctxSpriteForeground.createImageData(400, 284);


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

  this.vicIntOccured = function() {
    return registers[0x19] >= 128;
  }

  this.writeReg = function (number, value) {
    if (number == 0x19) {
      var temp = ~value & registers[number];
      temp = temp & 0xf;
      registers[number] = (temp > 0) ? (temp | 128) : 0;
    } else {
      registers[number] = value;
    }
  }

  this.readReg = function (number) {
    if (number == 0x11) {
      var bit8 = (cycleline & 0x100) >> 1;
      var temp = (registers[number] & 0x7f) | bit8;
      return temp;
    } else if (number == 0x12) {
      return (cycleline & 0xff);    } else {
      return registers[number];
    }
  }

  this.writeColorRAM = function(number, value) {
    colorRAM[number] = value;
  }

  this.readColorRAM = function(number) {
    return colorRAM[number];
  }

  //sprites 1-8 data -> 7f8 -7ff
  //blocknumber * 64

  function processSprites() {
    i = 0;
    for (i = 0; i < 8; i++) {
      //if sprite enabled
        //if current line fall within sprite line
          //determine which of two points in current line seg falls within sprite
          //cycle in line << 3 for pixel address
          //do case
          //00 -> exit
          //01 -> from = set, to = 7, start at bit zero of 24
          //10 -> from = 0, to = set, move set bits back from 24 and that is start bit, and 7
          //11 -> from = 0, to = 7???
    }
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
        if (targetRasterReached() & rasterIntEnabled()) {
          registers[0x19] = registers[0x19] | 1 | 128;
        }
        updateCharPos();
      }
      if (cycleline > 311) {
        cycleline = 0;
        ctxForeground.putImageData(foregroundData,0,0);
        ctxBackground.putImageData(backgroundData,0,0);

        posInCanvas = 0;
        charPosInMem = 0;


        //imgData = ctx.createImageData(400, 284);
        return true;
      }


    }
      return false;
  }

  function rasterIntEnabled() {
    return (registers[0x1a] & 1) == 1;
  }

  function targetRasterReached() {
    var temp = registers[0x11] & 0x80;
    temp = temp << 1;
    temp = temp | (registers[0x12]);
    var tempCurrentLine = (cycleline == 312) ? 0 : cycleline;
    return (temp == tempCurrentLine);
  }

  function displayEnabled() {
    return ((registers[0x11] & 0x10) != 0)
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
    var bitmapMode = ((registers[0x11] & 0x20) != 0) ? 1 : 0;
    var multicolorMode = ((registers[0x16] & 0x10) != 0) ? 1 : 0;
    var screenMode = (multicolorMode << 1) | bitmapMode;
    switch (screenMode) {
      //text mode, normal
      case 0:
        drawTextModeNormal(charPosInMem + cycleInLine - 5);
      break;

      //bitmap mode, normal
      case 1:
      break;
      
      //text mode, multi color
      case 2:
        drawTextModeMultiColor(charPosInMem + cycleInLine - 5);
      break;

      //bitmap mode, multi color
      case 3:
        drawBitmapModeMultiColor(charPosInMem + cycleInLine - 5);
      break;
    }
  }

  function drawTextModeNormal(charPos) {

    var baseCharAdd = (registers[0x18] >> 1) & 7;    
    baseCharAdd = baseCharAdd << 11;    
    var baseScreenAdd = (registers[0x18] >> 4) & 0xf;    
    baseScreenAdd = baseScreenAdd << 10;    
    var screenCode = localMem.vicRead(baseScreenAdd + charPos);
    var currentLine = localMem.vicRead(baseCharAdd + (screenCode << 3) + ((cycleline - 42) & 7));
    var textColor = colorRAM[charPos] & 0xf;
    var backgroundColor = registers[0x21] & 0xf;
    var currentCol = 0;
    for (currentCol = 0; currentCol < 8; currentCol++) {
      var pixelSet = (currentLine & 0x80) == 0x80;
      if (pixelSet) {
        foregroundData.data[posInCanvas + 0] = colors[textColor][0];
        foregroundData.data[posInCanvas + 1] = colors[textColor][1];
        foregroundData.data[posInCanvas + 2] = colors[textColor][2];
        foregroundData.data[posInCanvas + 3] = 255;
      } else {
        foregroundData.data[posInCanvas + 0] = 0;
        foregroundData.data[posInCanvas + 1] = 0;
        foregroundData.data[posInCanvas + 2] = 0;
        foregroundData.data[posInCanvas + 3] = 50;

        backgroundData.data[posInCanvas + 0] = colors[backgroundColor][0];
        backgroundData.data[posInCanvas + 1] = colors[backgroundColor][1];
        backgroundData.data[posInCanvas + 2] = colors[backgroundColor][2];
        backgroundData.data[posInCanvas + 3] = 255;
      }
      currentLine = currentLine << 1;
      posInCanvas = posInCanvas + 4;
   }

  }

  function drawTextModeMultiColor(charPos) {
  //var foregroundData = ctxForeground.createImageData(400, 284);
  //var backgroundData = ctxBackground.createImageData(400, 284);

    var baseCharAdd = (registers[0x18] >> 1) & 7;
    baseCharAdd = baseCharAdd << 11;
    var baseScreenAdd = (registers[0x18] >> 4) & 0xf;
    baseScreenAdd = baseScreenAdd << 10;
    var screenCode = localMem.vicRead(baseScreenAdd + charPos);
    var currentLine = localMem.vicRead(baseCharAdd + (screenCode << 3) + ((cycleline - 42) & 7));
    var textColor = colorRAM[charPos] & 0xf;
    if ((textColor & 8) == 0)
      return drawTextModeNormal(charPos);
    var backgroundColor = registers[0x21];
    var color1 = registers[0x22];
    var color2 = registers[0x23];
    var color3 = textColor;
    var colorArray = [backgroundColor, color1, color2, color3];
    var pixPair = 0;
    for (pixPair = 0; pixPair < 4; pixPair++) {
      var colorValue = (currentLine >> 6) & 3;
      foregroundData.data[posInCanvas + 0] = colors[colorArray[colorValue]][0];
      foregroundData.data[posInCanvas + 1] = colors[colorArray[colorValue]][1];
      foregroundData.data[posInCanvas + 2] = colors[colorArray[colorValue]][2];
      foregroundData.data[posInCanvas + 3] = 255;
      foregroundData.data[posInCanvas + 4] = colors[colorArray[colorValue]][0];
      foregroundData.data[posInCanvas + 5] = colors[colorArray[colorValue]][1];
      foregroundData.data[posInCanvas + 6] = colors[colorArray[colorValue]][2];
      foregroundData.data[posInCanvas + 7] = 255;

      currentLine = currentLine << 2;
      posInCanvas = posInCanvas + 8;
   }
  }

  function drawBitmapModeMultiColor(charPos) {
    var baseCharAdd = (registers[0x18] >> 1) & 7;    
    baseCharAdd = baseCharAdd << 11;    
    var baseScreenAdd = (registers[0x18] >> 4) & 0xf;    
    baseScreenAdd = baseScreenAdd << 10;    
    var currentLine = localMem.vicRead(baseCharAdd+(charPos << 3) + ((cycleline - 42) & 7));
    var textColor = colorRAM[charPos];
    var backgroundColor = registers[0x21];
    var color1 = (localMem.vicRead(baseScreenAdd + charPos) & 0xf0) >> 4;
    var color2 = localMem.vicRead(baseScreenAdd + charPos) & 0xf;
    var color3 = colorRAM[charPos] & 0xf;
    var colorArray = [backgroundColor, color1, color2, color3];
    var pixPair = 0;
    for (pixPair = 0; pixPair < 4; pixPair++) {
      var colorValue = (currentLine >> 6) & 3;
      foregroundData.data[posInCanvas + 0] = colors[colorArray[colorValue]][0];
      foregroundData.data[posInCanvas + 1] = colors[colorArray[colorValue]][1];
      foregroundData.data[posInCanvas + 2] = colors[colorArray[colorValue]][2];
      foregroundData.data[posInCanvas + 3] = 255;
      foregroundData.data[posInCanvas + 4] = colors[colorArray[colorValue]][0];
      foregroundData.data[posInCanvas + 5] = colors[colorArray[colorValue]][1];
      foregroundData.data[posInCanvas + 6] = colors[colorArray[colorValue]][2];
      foregroundData.data[posInCanvas + 7] = 255;

      currentLine = currentLine << 2;
      posInCanvas = posInCanvas + 8;
   }

  }


  function fillBorderColor() {
    var borderColor = registers[0x20] & 0xf;
    var i;
    for (i = 0; i < 8; i++ ) {
      foregroundData.data[posInCanvas + 0] = colors[borderColor][0];
      foregroundData.data[posInCanvas + 1] = colors[borderColor][1];
      foregroundData.data[posInCanvas + 2] = colors[borderColor][2];
      foregroundData.data[posInCanvas + 3] = 255;
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



