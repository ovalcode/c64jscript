function timer(alarmManager, interruptController) {
  var myAlarmManager = alarmManager;
  var isEnabled = false;
  var ticksBeforeExpiry = 0;
  myAlarmManager.addAlarm(this);
  var timerHigh = 0;
  var timerLow = 0;
  var continious = false;
 
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
    //trigger interrupt
    ticksBeforeExpiry = (timerHigh << 8) | timerLow;
    if (!continious)
      isEnabled = false;
  }

  this.setTimerHigh = function(high) {
    timerHigh = high;
  }

  this.setTimerLow = function(low) {
    timerHigh = low;
  }

  this.getTimerHigh = function() {
    return (ticksBeforeExpiry >> 8);
  }

  this.getTimerLow = function() {
    return (ticksBeforeExpiry & 0xff);
  }

  this.setControlRegister = function (byteValue) {
    if ((byteValue & (1 << 4)) != 0)
      ticksBeforeExpiry = (timerHigh << 8) | timerLow;

    continious = ((byteValue & (1 << 3)) == 0) ? true : false;

    isEnabled = ((byteValue & 1) == 1) ? true : false;
  
  }

  this.getControlRegister = function() {
    var tempValue = 0;
    if (continious)
      tempValue = tempValue | 1 << 3;
    if (isEnabled)
      tempValue = tempValue | 1;
    return tempValue;
  }

}
