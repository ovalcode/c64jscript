function memory(allDownloadedCallback, keyboard, timerA, timerB, interruptController,tape)

{
  var mainMem = new Uint8Array(65536);
  mainMem[1] = 3;
  var basicRom = new Uint8Array(8192);
  var kernalRom = new Uint8Array(8192);
  var charRom = new Uint8Array(4192);
  var outstandingDownloads = 3;
  var simulateKeypress = false;
  var keyboardInstance = keyboard;
  var mytimerA = timerA;
  var mytimerB = timerB;
  var myinterruptController = interruptController;
  var mytape = tape;
  var playPressed = false;

  this.togglePlayPresed = function() {
    playPressed = !playPressed;
  }

  function downloadCompleted() {
    outstandingDownloads--;
    if (outstandingDownloads == 0)
      allDownloadedCallback();
  }

  this.setSimulateKeypress = function () {
    simulateKeypress = true;
  }


//------------------------------------------------------------------------

var oReqBasic = new XMLHttpRequest();
oReqBasic.open("GET", "basic.bin", true);
oReqBasic.responseType = "arraybuffer";

oReqBasic.onload = function (oEvent) {
  var arrayBuffer = oReqBasic.response; // Note: not oReq.responseText
  if (arrayBuffer) {
    basicRom = new Uint8Array(arrayBuffer);
    downloadCompleted();
  }
};

oReqBasic.send(null);

//------------------------------------------------------------------------

var oReqKernal = new XMLHttpRequest();
oReqKernal.open("GET", "kernal.bin", true);
oReqKernal.responseType = "arraybuffer";

oReqKernal.onload = function (oEvent) {
  var arrayBuffer = oReqKernal.response; // Note: not oReq.responseText
  if (arrayBuffer) {
    kernalRom = new Uint8Array(arrayBuffer);
    downloadCompleted();
  }
};

oReqKernal.send(null);

//------------------------------------------------------------------------

var oReqChar = new XMLHttpRequest();
oReqChar.open("GET", "characters.bin", true);
oReqChar.responseType = "arraybuffer";

oReqChar.onload = function (oEvent) {
  var arrayBuffer = oReqChar.response; // Note: not oReq.responseText
  if (arrayBuffer) {
    charRom = new Uint8Array(arrayBuffer);
    downloadCompleted();
  }
};

oReqChar.send(null);


//------------------------------------------------------------------------

  this.readCharRom = function (address) {
    return charRom[address];
  }

  function ciaRead(address) {
    if (address == 0xdc01) {
      return keyboardInstance.getColumnByte(mainMem[0xdc00]);
    } else if (address == 0xdc04) {
      return mytimerA.getTimerLow();
    } else if (address == 0xdc05) {
      return mytimerA.getTimerHigh();
    } else if (address == 0xdc06) {
      return mytimerB.getTimerLow();
    } else if (address == 0xdc07) {
      return mytimerB.getTimerHigh();
    } else if (address == 0xdc0d) {
      return myinterruptController.getInterrupts();
    } else if (address == 0xdc0e) {
      return mytimerA.getControlRegister();
    } else if (address == 0xdc0f) {
      return mytimerB.getControlRegister();
    } else {
      return mainMem[address];
    }

  }

  function ciaWrite(address, byteValue) {
    if (address == 0xdc04) {
      return mytimerA.setTimerLow(byteValue);
    } else if (address == 0xdc05) {
      return mytimerA.setTimerHigh(byteValue);
    } else if (address == 0xdc06) {
      return mytimerB.setTimerLow(byteValue);
    } else if (address == 0xdc07) {
      return mytimerB.setTimerHigh(byteValue);
    } else if (address == 0xdc0d) {
      return myinterruptController.setInterruptMask(byteValue);
    } else if (address == 0xdc0e) {
      return mytimerA.setControlRegister(byteValue);
    } else if (address == 0xdc0f) {
      return mytimerB.setControlRegister(byteValue);
    } else {
      mainMem[address] = byteValue;
    }
    
  }

  function kernelEnabled() {
    temp = mainMem[1] & 3;
    return (temp >= 2);
  }

  this.readMem = function (address) {
    if ((address >= 0xa000) & (address <=0xbfff))
      return basicRom[address & 0x1fff];
    else if ((address >= 0xe000) & (address <=0xffff) & kernelEnabled())
      return kernalRom[address & 0x1fff];
    else if ((address >= 0xdc00) & (address <= 0xdcff)) {
      return ciaRead(address);
    } else if (address == 1) {
      var temp = mainMem[address] & 239;
      if (!playPressed)
        temp = temp | 16;
      return temp;
    }
    return mainMem[address];
  }

  this.writeMem = function (address, byteval) {
    if ((address >= 0xdc00) & (address <= 0xdcff)) {
      ciaWrite(address, byteval);
      return;
    } else if (address == 1) {
      var temp = byteval & 32;
      temp = temp >> 5;
      tape.setMotorOn(temp);
    }      
    mainMem[address] = byteval;
  }

}


