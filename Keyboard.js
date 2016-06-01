function keyboard() {
  var keyarray = [];

  this.onkeydown = function(event) {
    if (event.keyCode == 32)
      event.preventDefault();

    if (keyarray.indexOf(event.keyCode) == -1)
      keyarray.push(event.keyCode);
  }

  this.onkeyup = function(event) {
    var ind = keyarray.indexOf(event.keyCode);
    keyarray.splice(ind,1);
  }

  function getScanCode(chr) {
    if (chr == 65) {
      return 10;
    } else if (chr == 66) {
      return 28;
    } else if (chr == 32) {
      return 60;
    }
  }

  this.getColumnByte = function(rowByte) {
    var rowArray = [0,0,0,0,0,0,0,0];
    rowByte = ~rowByte;
    rowByte = rowByte & 0xff;
    var i;
    for (i = 0; i < keyarray.length; i++) {
      var scanCode = getScanCode(keyarray[i]);
      var rowNum = (scanCode & 0x38) >> 3;
      rowArray[rowNum] = rowArray[rowNum] | (1 << (scanCode & 7));
    }
    var resultByte = 0;
    for (i = 0; i < 8; i++) {
      var currentRowEnabled = ((1 << i) & rowByte) != 0;
      if (currentRowEnabled)
        resultByte = resultByte | rowArray[i];
    }
    resultByte = ~resultByte;
    resultByte = resultByte & 0xff;
    return resultByte;
  }

}
