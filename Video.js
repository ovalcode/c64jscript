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
  var spriteColorLine = new Uint8Array(48 * 4);
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


  function processSprites() {
    var i = 0;
    var spriteBit = 0x80;
    var lineSegmentStart = cycleInLine << 3;
    var lineSegmentStop = lineSegmentStart | 7;
    for (i = 0; i < 8; i++) {
      var currentSprite = 7 - i;
      spriteBit = 0x80 >> i;
      if ((registers[0x15] & spriteBit) == 0)
        continue;
      var xExpanded = (registers[0x1d] & spriteBit) != 0;
      var yExpanded = (registers[0x17] & spriteBit) != 0;
      var xDimension = xExpanded ? 48: 24;
      var yDimension = yExpanded ? 42: 21;
      var spritePosX = registers[currentSprite << 1];
      if ((registers[0x10] & spriteBit) != 0) {
        spritePosX = spritePosX | 0x100;
      }
      var spritePosY = registers[(currentSprite << 1) | 1];
      if (!((cycleline >= spritePosY) & (cycleline < (spritePosY + yDimension))))
        continue;
      var lineScenario = 0;
      if (((lineSegmentStart >= spritePosX) & (lineSegmentStart < (spritePosX + xDimension))))
        lineScenario = 2;

      if (((lineSegmentStop >= spritePosX) & (lineSegmentStop < (spritePosX + xDimension))))
        lineScenario = lineScenario | 1;

      if (lineScenario == 0)
        continue;

      var requiredLineInSprite = cycleline - spritePosY;
      if (yExpanded)
        requiredLineInSprite = requiredLineInSprite >> 1;
      
      var spriteIsMultiColor = (registers[0x1c] & spriteBit) != 0
      if (xExpanded) {
        if (spriteIsMultiColor) {
          populateSpriteMultiColorLineExpanded(currentSprite, requiredLineInSprite);
        } else {
          populateSpriteColorLineExpanded(currentSprite, requiredLineInSprite);
        }
      } else {
        if (spriteIsMultiColor) {
          populateSpriteMultiColorLine(currentSprite, requiredLineInSprite);
        } else {
          populateSpriteColorLine(currentSprite, requiredLineInSprite);
        }
      }

      
      var canvasForSprite;
      if ((registers[0x1b] & spriteBit) == 0) {
        canvasForSprite = spriteForegroundData;
      } else {
        canvasForSprite = spriteBackgroundData;
      }
      var posInSpriteCanvas = posInCanvas - 8;
      if (lineScenario == 1) { 
        var startInLineSeg = (spritePosX & 7) << 2;
        posInSpriteCanvas = posInSpriteCanvas + startInLineSeg;
        var j = 0;
        var posInSpriteColorLine = 0;
        for (j = startInLineSeg; j < 32; j = j + 4) {
          canvasForSprite.data[posInSpriteCanvas + 0] = spriteColorLine[posInSpriteColorLine+0];
          canvasForSprite.data[posInSpriteCanvas + 1] = spriteColorLine[posInSpriteColorLine+1];
          canvasForSprite.data[posInSpriteCanvas + 2] = spriteColorLine[posInSpriteColorLine+2];
          canvasForSprite.data[posInSpriteCanvas + 3] = spriteColorLine[posInSpriteColorLine+3];

          posInSpriteCanvas = posInSpriteCanvas + 4;
          posInSpriteColorLine = posInSpriteColorLine + 4;
        }

      } else if (lineScenario == 2) {
        var startInLineSeg = 0;
        var endInLineSeg = (spritePosX & 7) << 2;
        var j = 0;
        var posInSpriteColorLine = (xDimension - (spritePosX & 7)) << 2;
        for (j = 0; j < endInLineSeg; j = j + 4) {
          canvasForSprite.data[posInSpriteCanvas + 0] = spriteColorLine[posInSpriteColorLine+0];
          canvasForSprite.data[posInSpriteCanvas + 1] = spriteColorLine[posInSpriteColorLine+1];
          canvasForSprite.data[posInSpriteCanvas + 2] = spriteColorLine[posInSpriteColorLine+2];
          canvasForSprite.data[posInSpriteCanvas + 3] = spriteColorLine[posInSpriteColorLine+3];

          posInSpriteCanvas = posInSpriteCanvas + 4;
          posInSpriteColorLine = posInSpriteColorLine + 4;
        }

      } else {
        var j = 0;
        var posInSpriteColorLine = (lineSegmentStart - spritePosX) << 2;
        for (j = 0; j < 32; j = j + 4) {
          canvasForSprite.data[posInSpriteCanvas + 0] = spriteColorLine[posInSpriteColorLine+0];
          canvasForSprite.data[posInSpriteCanvas + 1] = spriteColorLine[posInSpriteColorLine+1];
          canvasForSprite.data[posInSpriteCanvas + 2] = spriteColorLine[posInSpriteColorLine+2];
          canvasForSprite.data[posInSpriteCanvas + 3] = spriteColorLine[posInSpriteColorLine+3];

          posInSpriteCanvas = posInSpriteCanvas + 4;
          posInSpriteColorLine = posInSpriteColorLine + 4;
        }


      }

//TODO: getspritecolor data
//call this method
//clear sprite canvasses beginning of each runBatch
//change code to use additional 


    }
  }

  this.initForNextFrame = function() {
    var i;
    for (i = 0; i < spriteBackgroundData.data.length; i++) {
      spriteBackgroundData.data[i] = 0;
    }
    for (i = 0; i < spriteForegroundData.data.length; i++) {
      spriteForegroundData.data[i] = 0;
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
          processSprites();
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
        ctxBackground.putImageData(backgroundData,0,0);
        ctxSpriteBackground.putImageData(spriteBackgroundData,0,0);
        ctxForeground.putImageData(foregroundData,0,0);
        ctxSpriteForeground.putImageData(spriteForegroundData,0,0);
        posInCanvas = 0;
        charPosInMem = 0;


        //imgData = ctx.createImageData(400, 284);
        return true;
      }


    }
      return false;
  }

  function getSpriteLineData (spriteNumber, spriteLine) {
  //sprites 1-8 data -> 7f8 -7ff
  //blocknumber * 64

    var spritePointerAdd = (registers[0x18] >> 4) & 0xf;    
    spritePointerAdd = spritePointerAdd << 10;
    spritePointerAdd = spritePointerAdd + 0x3f8 + spriteNumber;
    spriteBaseAdd = localMem.vicRead(spritePointerAdd) << 6;
    posInSpriteData = spriteLine * 3 + spriteBaseAdd;
    spriteDataByte0 = localMem.vicRead(posInSpriteData + 0);
    spriteDataByte1 = localMem.vicRead(posInSpriteData + 1);
    spriteDataByte2 = localMem.vicRead(posInSpriteData + 2);
    return (spriteDataByte0 << 16) | (spriteDataByte1 << 8) | (spriteDataByte2 << 0);
  }

  function populateSpriteColorLine (spriteNumber, spriteLine) {
    var spriteData = getSpriteLineData(spriteNumber, spriteLine);
    var spriteColor = registers[0x27 + spriteNumber] & 0xf;
    var i = 0;
    posInColorLine = 0;
    for (i = 0; i < 24; i++) {
      var currentBit = (spriteData >> 23) & 1;
      if (currentBit == 1) {
        spriteColorLine [posInColorLine + 0] = colors[spriteColor][0];
        spriteColorLine [posInColorLine + 1] = colors[spriteColor][1];
        spriteColorLine [posInColorLine + 2] = colors[spriteColor][2];
        spriteColorLine [posInColorLine + 3] = 255;
      } else {
        spriteColorLine [posInColorLine + 0] = 0;
        spriteColorLine [posInColorLine + 1] = 0;
        spriteColorLine [posInColorLine + 2] = 0;
        spriteColorLine [posInColorLine + 3] = 0;
      }
      posInColorLine = posInColorLine + 4;
      spriteData = (spriteData << 1) & 0xffffff;
    }
  }


  function populateSpriteMultiColorLine (spriteNumber, spriteLine) {
    var spriteData = getSpriteLineData(spriteNumber, spriteLine);

    var spriteColor = registers[0x27 + spriteNumber] & 0xf;
    var multicolorPalette = [-1, (registers[0x25] & 0xf), spriteColor, (registers[0x26] & 0xf)];
    var i = 0;
    posInColorLine = 0;
    for (i = 0; i < 12; i++) {
      var currentBits = (spriteData >> 22) & 3;
      if (currentBits > 0) {
        spriteColorLine [posInColorLine + 0] = colors[multicolorPalette[currentBits]][0];
        spriteColorLine [posInColorLine + 1] = colors[multicolorPalette[currentBits]][1];
        spriteColorLine [posInColorLine + 2] = colors[multicolorPalette[currentBits]][2];
        spriteColorLine [posInColorLine + 3] = 255;
        spriteColorLine [posInColorLine + 4] = colors[multicolorPalette[currentBits]][0];
        spriteColorLine [posInColorLine + 5] = colors[multicolorPalette[currentBits]][1];
        spriteColorLine [posInColorLine + 6] = colors[multicolorPalette[currentBits]][2];
        spriteColorLine [posInColorLine + 7] = 255;

      } else {
        spriteColorLine [posInColorLine + 0] = 0;
        spriteColorLine [posInColorLine + 1] = 0;
        spriteColorLine [posInColorLine + 2] = 0;
        spriteColorLine [posInColorLine + 3] = 0;
        spriteColorLine [posInColorLine + 4] = 0;
        spriteColorLine [posInColorLine + 5] = 0;
        spriteColorLine [posInColorLine + 6] = 0;
        spriteColorLine [posInColorLine + 7] = 0;

      }
      posInColorLine = posInColorLine + 8;
      spriteData = (spriteData << 2) & 0xffffff;
    }
  }

  function populateSpriteColorLineExpanded (spriteNumber, spriteLine) {
    var spriteData = getSpriteLineData(spriteNumber, spriteLine);
    var spriteColor = registers[0x27 + spriteNumber] & 0xf;
    var i = 0;
    posInColorLine = 0;
    for (i = 0; i < 24; i++) {
      var currentBit = (spriteData >> 23) & 1;
      if (currentBit == 1) {
        spriteColorLine [posInColorLine + 0] = colors[spriteColor][0];
        spriteColorLine [posInColorLine + 1] = colors[spriteColor][1];
        spriteColorLine [posInColorLine + 2] = colors[spriteColor][2];
        spriteColorLine [posInColorLine + 3] = 255;
        spriteColorLine [posInColorLine + 4] = colors[spriteColor][0];
        spriteColorLine [posInColorLine + 5] = colors[spriteColor][1];
        spriteColorLine [posInColorLine + 6] = colors[spriteColor][2];
        spriteColorLine [posInColorLine + 7] = 255;

      } else {
        spriteColorLine [posInColorLine + 0] = 0;
        spriteColorLine [posInColorLine + 1] = 0;
        spriteColorLine [posInColorLine + 2] = 0;
        spriteColorLine [posInColorLine + 3] = 0;
        spriteColorLine [posInColorLine + 4] = 0;
        spriteColorLine [posInColorLine + 5] = 0;
        spriteColorLine [posInColorLine + 6] = 0;
        spriteColorLine [posInColorLine + 7] = 0;
      }
      posInColorLine = posInColorLine + 8;
      spriteData = (spriteData << 1) & 0xffffff;
    }
  }

  function populateSpriteMultiColorLineExpanded (spriteNumber, spriteLine) {
    var spriteData = getSpriteLineData(spriteNumber, spriteLine);

    var spriteColor = registers[0x27 + spriteNumber] & 0xf;
    var multicolorPalette = [-1, (registers[0x25] & 0xf), spriteColor, (registers[0x26] & 0xf)];
    var i = 0;
    posInColorLine = 0;
    for (i = 0; i < 12; i++) {
      var currentBits = (spriteData >> 22) & 3;
      if (currentBits > 0) {
        spriteColorLine [posInColorLine + 0] = colors[multicolorPalette[currentBits]][0];
        spriteColorLine [posInColorLine + 1] = colors[multicolorPalette[currentBits]][1];
        spriteColorLine [posInColorLine + 2] = colors[multicolorPalette[currentBits]][2];
        spriteColorLine [posInColorLine + 3] = 255;
        spriteColorLine [posInColorLine + 4] = colors[multicolorPalette[currentBits]][0];
        spriteColorLine [posInColorLine + 5] = colors[multicolorPalette[currentBits]][1];
        spriteColorLine [posInColorLine + 6] = colors[multicolorPalette[currentBits]][2];
        spriteColorLine [posInColorLine + 7] = 255;
        spriteColorLine [posInColorLine + 8] = colors[multicolorPalette[currentBits]][0];
        spriteColorLine [posInColorLine + 9] = colors[multicolorPalette[currentBits]][1];
        spriteColorLine [posInColorLine + 10] = colors[multicolorPalette[currentBits]][2];
        spriteColorLine [posInColorLine + 11] = 255;
        spriteColorLine [posInColorLine + 12] = colors[multicolorPalette[currentBits]][0];
        spriteColorLine [posInColorLine + 13] = colors[multicolorPalette[currentBits]][1];
        spriteColorLine [posInColorLine + 14] = colors[multicolorPalette[currentBits]][2];
        spriteColorLine [posInColorLine + 15] = 255;

      } else {
        spriteColorLine [posInColorLine + 0] = 0;
        spriteColorLine [posInColorLine + 1] = 0;
        spriteColorLine [posInColorLine + 2] = 0;
        spriteColorLine [posInColorLine + 3] = 0;
        spriteColorLine [posInColorLine + 4] = 0;
        spriteColorLine [posInColorLine + 5] = 0;
        spriteColorLine [posInColorLine + 6] = 0;
        spriteColorLine [posInColorLine + 7] = 0;
        spriteColorLine [posInColorLine + 8] = 0;
        spriteColorLine [posInColorLine + 9] = 0;
        spriteColorLine [posInColorLine + 10] = 0;
        spriteColorLine [posInColorLine + 11] = 0;
        spriteColorLine [posInColorLine + 12] = 0;
        spriteColorLine [posInColorLine + 13] = 0;
        spriteColorLine [posInColorLine + 14] = 0;
        spriteColorLine [posInColorLine + 15] = 0;

      }
      posInColorLine = posInColorLine + 16;
      spriteData = (spriteData << 2) & 0xffffff;
    }
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
        foregroundData.data[posInCanvas + 3] = 0;
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
    textColor = textColor & 7;
    var backgroundColor = registers[0x21];
    var color1 = registers[0x22];
    var color2 = registers[0x23];
    var color3 = textColor;
    var colorArray = [backgroundColor, color1, color2, color3];
    var pixPair = 0;
    for (pixPair = 0; pixPair < 4; pixPair++) {
      var colorValue = (currentLine >> 6) & 3;
      if (colorArray >= 2) {
        foregroundData.data[posInCanvas + 0] = colors[colorArray[colorValue]][0];
        foregroundData.data[posInCanvas + 1] = colors[colorArray[colorValue]][1];
        foregroundData.data[posInCanvas + 2] = colors[colorArray[colorValue]][2];
        foregroundData.data[posInCanvas + 3] = 255;
        foregroundData.data[posInCanvas + 4] = colors[colorArray[colorValue]][0];
        foregroundData.data[posInCanvas + 5] = colors[colorArray[colorValue]][1];
        foregroundData.data[posInCanvas + 6] = colors[colorArray[colorValue]][2];
        foregroundData.data[posInCanvas + 7] = 255;
      } else {
        backgroundData.data[posInCanvas + 0] = colors[colorArray[colorValue]][0];
        backgroundData.data[posInCanvas + 1] = colors[colorArray[colorValue]][1];
        backgroundData.data[posInCanvas + 2] = colors[colorArray[colorValue]][2];
        backgroundData.data[posInCanvas + 3] = 255;
        foregroundData.data[posInCanvas + 3] = 0;
        backgroundData.data[posInCanvas + 4] = colors[colorArray[colorValue]][0];
        backgroundData.data[posInCanvas + 5] = colors[colorArray[colorValue]][1];
        backgroundData.data[posInCanvas + 6] = colors[colorArray[colorValue]][2];
        backgroundData.data[posInCanvas + 7] = 255;
        foregroundData.data[posInCanvas + 7] = 0;
      }

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



