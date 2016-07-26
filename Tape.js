function tape(alarmManager, interruptManager) {
  var myAlarmManager = alarmManager;
  var myInterruptManager = interruptManager;
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
    ticksBeforeExpiry = tapeData[posInTape] << 3;
    posInTape++;
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
    myInterruptManager.interruptFlag1();
    scheduleNextTrigger();
  }

}



