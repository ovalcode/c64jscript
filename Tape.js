function tape(alarmManager, interruptController) {
  var myAlarmManager = alarmManager;
  var myInterruptController = interruptController;
  var tapeData;
  var posInTape;
  var isEnabled = false;
  var ticksBeforeExpiry = 0;
  myAlarmManager.addAlarm(this);

  this.attachTape = function(file) {
       var reader = new FileReader();
       reader.onload = function(e) {
         var arrayBuffer = reader.result;
         tapeData = new Uint8Array(arrayBuffer);
         posInTape = 0x14;
         scheduleNextTrigger();
         alert("Tape attached");
       }
       reader.readAsArrayBuffer(file);

  }

  this.setMotorOn = function(bit) {
    isEnabled = (bit == 0) ? true : false;
  }

  function scheduleNextTrigger() {
    if (tapeData[posInTape] == 0) {
      ticksBeforeExpiry = tapeData[posInTape + 1] | (tapeData[posInTape + 2] << 8) | (tapeData[posInTape + 3] << 16)
      posInTape = posInTape + 4;
    } else {
      ticksBeforeExpiry = tapeData[posInTape] << 3;
      posInTape++;
    }
  }

  this.getIsEnabled = function() {
    return isEnabled;
  }

  this.getTicksBeforeExpiry = function() {
    return ticksBeforeExpiry;
  }

  this.setTicksBeforeExpiry = function(ticks) {
    ticksBeforeExpiry = ticks;
  }

  this.trigger = function() {
    myInterruptController.interruptFlag1();
    scheduleNextTrigger();
  }

}
