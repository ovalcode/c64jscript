function interruptController() {
  var mycpu;
  var interruptMask = 0;
  var interruptsOccured = 0;

  this.setCpu = function(cpu) {
    mycpu = cpu;
  } 

  this.setInterruptMask = function(mask) {
    if (mask > 127) {
      interruptMask = interruptMask | mask;
    } else {
      interruptMask = interruptMask & (~mask & 0xff);
    }

  }

  this.getInterrupts = function() {
    var temp = interruptsOccured;
    interruptsOccured = 0;
    return temp;
  }

  this.interruptFlag1 = function() {
    interruptsOccured = interruptsOccured | 16 | 128;
    if ((interruptMask & 16) == 0) 
      return;
    mycpu.setInterrupt();
  }

  this.interruptTimerA = function() {
    interruptsOccured = interruptsOccured | 1 | 128;
    if ((interruptMask & 1) == 0) 
      return;
    mycpu.setInterrupt();
  }

  this.interruptTimerB = function() {
    interruptsOccured = interruptsOccured | 2 | 128;
    if ((interruptMask & 2) == 0) 
      return;
    mycpu.setInterrupt();
  }

}
