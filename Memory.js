function memory(allDownloadedCallback, keyboard, timerA, timerB, interruptController,tape)

{
  var mainMem = new Uint8Array ([0xa9, 0x20, 0x85, 0x08, 0, 0, 0, 0, 0, 0]);
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
    return mainMem[address];
  }

  this.writeMem = function (address, byteval) {
    mainMem[address] = byteval;
  }

}


