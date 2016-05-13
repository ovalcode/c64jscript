function video(mycanvas) {
  var ctx = mycanvas.getContext("2d");
  this.updateCanvas = function() {
    var imgData = ctx.createImageData(320, 200);
    var i;
    for (i = 0; i < 200000; i += 4) {
      imgData.data[i + 0] = 255;
      imgData.data[i + 1] = 0;
      imgData.data[i + 2] = 0;
      imgData.data[i + 3] = 255;
    }
    ctx.putImageData(imgData,0,0);
  }
}
