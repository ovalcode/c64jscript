function alarmManager() {
  var myCpu;
  var alarms = [];
  var lastCycleCount = 0;

  this.setCpu = function (cpu) {
    myCpu = cpu;
  }

  this.addAlarm = function (alarmObject) {
    alarms.push(alarmObject);
  }

  this.processAlarms = function () {
    var i;
    var numTicks = myCpu.getCycleCount() - lastCycleCount;
    lastCycleCount = myCpu.getCycleCount();
    for (i = 0; i < alarms.length; i++) {
      var currentAlarm = alarms[i];
      if (currentAlarm.getIsEnabled()) {
        var ticksBeforeExpiry = currentAlarm.getTicksBeforeExpiry() - numTicks;
        if (ticksBeforeExpiry > 0) {
          currentAlarm.setTicksBeforeExpiry(ticksBeforeExpiry);
        } else {
          currentAlarm.setTicksBeforeExpiry(0);
          currentAlarm.trigger();
        }
      }
    }
  }
}
