function keyboard() {

  const KEY_A = 65;
  const KEY_B = 66;
  const KEY_C = 67;
  const KEY_D = 68;
  const KEY_E = 69;
  const KEY_F = 70;
  const KEY_G = 71;
  const KEY_H = 72;
  const KEY_I = 73;
  const KEY_J = 74;
  const KEY_K = 75;
  const KEY_L = 76;
  const KEY_M = 77;
  const KEY_N = 78;
  const KEY_O = 79;
  const KEY_P = 80;
  const KEY_Q = 81;
  const KEY_R = 82;
  const KEY_S = 83;
  const KEY_T = 84;
  const KEY_U = 85;
  const KEY_V = 86;
  const KEY_W = 87;
  const KEY_X = 88;
  const KEY_Y = 89;
  const KEY_Z = 90;
  const KEY_SPACE = 32;
  const KEY_SHIFT = 16;
  const KEY_ENTER = 13;
  const KEY_0 = 48;
  const KEY_1 = 49;
  const KEY_2 = 50;
  const KEY_3 = 51;
  const KEY_4 = 52;
  const KEY_5 = 53;
  const KEY_6 = 54;
  const KEY_7 = 55;
  const KEY_8 = 56;
  const KEY_9 = 57;


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
    switch (chr) {
      case KEY_A:
        return 10;
      break;
      case KEY_B:
        return 28;
      break;
      case KEY_C:
        return 20;
      break;
      case KEY_D:
        return 18;
      break;
      case KEY_E:
        return 14;
      break;
      case KEY_F:
        return 21;
      break;
      case KEY_G:
        return 26;
      break;
      case KEY_H:
        return 29;
      break;
      case KEY_I:
        return 33;
      break;
      case KEY_J:
        return 34;
      break;
      case KEY_K:
        return 37;
      break;
      case KEY_L:
        return 42;
      break;
      case KEY_M:
        return 36;
      break;
      case KEY_N:
        return 39;
      break;
      case KEY_O:
        return 38;
      break;
      case KEY_P:
        return 41;
      break;
      case KEY_Q:
        return 62;
      break;
      case KEY_R:
        return 17;
      break;
      case KEY_S:
        return 13;
      break;
      case KEY_T:
        return 22;
      break;
      case KEY_U:
        return 30;
      break;
      case KEY_V:
        return 31;
      break;
      case KEY_W:
        return 9;
      break;
      case KEY_X:
        return 23;
      break;
      case KEY_Y:
        return 25;
      break;
      case KEY_Z:
        return 12;
      break;

      case KEY_SPACE:
        return 60;
      break;
      case KEY_SHIFT:
        return 15;
      break;
      case KEY_ENTER:
        return 1;
      break;

      case KEY_0:
        return 35;
      break;
      case KEY_1:
        return 56;
      break;
      case KEY_2:
        return 59;
      break;
      case KEY_3:
        return 8;
      break;
      case KEY_4:
        return 11;
      break;
      case KEY_5:
        return 16;
      break;
      case KEY_6:
        return 19;
      break;
      case KEY_7:
        return 24;
      break;
      case KEY_8:
        return 27;
      break;
      case KEY_9:
        return 32;
      break;

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
