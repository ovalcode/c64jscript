function disk(alarmManager) {
  var myAlarmManager = alarmManager;
  var isEnabled = true;
  var ticksBeforeExpiry = 500;
  var atnbit = 0;
  var c64databit = 0;
  var clkbit = 0;
  var localData = 0;
  var localClk = 0;
  var started = false;
  var state = 0;

  myAlarmManager.addAlarm(this);
 
  this.getIsEnabled = function() {
    return isEnabled;
  }

  this.write = function(byteval) {
    atnbit = (byteval & 8) ? 1 : 0;
    c64databit = (byteval & 32) ? 1 : 0;
    clkbit = (byteval & 16) ? 1 : 0;
    console.log(byteval.toString(2));
  }

  this.getTicksBeforeExpiry = function() {
    return ticksBeforeExpiry;
  }

  this.readPin = function() {
    return localClk | (localData<<1);
  }

  this.setTicksBeforeExpiry = function(ticks) {
    ticksBeforeExpiry = ticks;
  }

  this.trigger = function() {
    if (state == 0) {
      if (clkbit == 1)
        state = 1;
    } else if (state == 1) {
      if (!clkbit) {
        started = true;
        localData = 1;
        state = 2;
      }
    } else if (state == 2) {
    }


    //if (clkbit) {
      //console.log("In Disk atn");
      //started = true;
      //localData = 1;
    //}
    ticksBeforeExpiry = 500;
  }

}



