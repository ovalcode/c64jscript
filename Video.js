function video(mycanvas, mem) {
  var localMem = mem;
  var ctx = mycanvas.getContext("2d");
  this.updateCanvas = function() {
    var imgData = ctx.createImageData(320, 200);
    var i, currentScreenPos;
    for (currentScreenPos = 0; currentScreenPos < 1000; currentScreenPos++) {
      var screenCode = localMem.readMem(1024 + currentScreenPos);
      var currentRow, currentCol;
      for (currentRow = 0; currentRow < 8; currentRow++) {
        var currentLine = localMem.readCharRom((screenCode << 3) + currentRow);
        for (currentCol = 0; currentCol < 8; currentCol++) {
          Boolean s;
        }
      }
    }
    for (i = 0; i < 200000; i += 4) {
      imgData.data[i + 0] = 255;
      imgData.data[i + 1] = 0;
      imgData.data[i + 2] = 0;
      imgData.data[i + 3] = 255;
    }
    ctx.putImageData(imgData,0,0);
  }
}
