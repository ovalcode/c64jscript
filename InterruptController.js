function interruptController() {
  var mycpu;
  var interruptMask = 0;
  var interruptsOccured = 0;
  var interruptTrip = false;

  this.setCpu = function(cpu) {
    mycpu = cpu;
  } 

  this.setInterruptMask = function(mask) {
    interruptMask = mask;
  }

  this.getInterrupts = function() {
    var temp = interruptsOccured;
    interruptsOccured = 0;
    interruptTrip = false;
    return temp;
  }

  this.interruptFlag1 = function() {
    interruptsOccured = interruptsOccured | 16;
    if (interruptTrip)
      return;
    if ((interruptMask & 16) == 0) 
      return;
    interruptTrip = true;
    mycpu.setInterrupt();
  }

  this.interruptTimerA = function() {
    interruptsOccured = interruptsOccured | 1;
    if (interruptTrip)
      return;
    if ((interruptMask & 1) == 0) 
      return;
    interruptTrip = true;
    mycpu.setInterrupt();
  }
}
