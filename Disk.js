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
  var bitCounter = 0;
  var dataByte = 0;
  var prevClk = 0;
  var receiveFileName = false;

  myAlarmManager.addAlarm(this);
 
  this.getIsEnabled = function() {
    return isEnabled;
  }
  
  function parseCommandByte(commandByte) {
    if (commandByte == 0xf0) {
      //console.log("Byte received");
      //isEnabled = true;
      state = 1;
      //ticksBeforeExpiry = 500;
      //localData = 1;
      //dataByte = 0;
      //bitCounter = 8;
      receiveFileName = true;                
    }
  }

  this.write = function(byteval) {
    atnbit = (byteval & 8) ? 1 : 0;
    c64databit = (byteval & 32) ? 1 : 0;
    clkbit = (byteval & 16) ? 1 : 0;
    //console.log(byteval.toString(2));
    if (state == 2) {
      if (clkbit) {
        state = 3; //receive data on clock high
        prevClk = clkbit;
      }
      sheduleTimeout(250);
    } else if (state == 3) {
      if ((prevClk != clkbit) & !clkbit) {
        console.log("Data bit captured: "+ c64databit);
        dataByte = (dataByte >> 1) | (!c64databit ? 0x80 : 0);
        bitCounter--;
        sheduleTimeout(250);
        if (!bitCounter) {          
          console.log("Byte received: " + dataByte+ " atn: " + atnbit);
          //if (!receiveFileName) {
            isEnabled = true;
            state = 1;
            ticksBeforeExpiry = 500;
            localData = 0;
          //} else {
          //  state = 2;
          //  ticksBeforeExpiry = 500;
          //  localData = 1;
          //  dataByte = 0;
          //  bitCounter = 8;                
          //}
          if (atnbit)
            parseCommandByte(dataByte);                
        }
      }
      prevClk = clkbit;
    }
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

  function sheduleTimeout(cycles) {
    ticksBeforeExpiry = cycles;
  }

  this.trigger = function() {
    if (state == 0) {
      if (clkbit == 1)
        state = 1;
      ticksBeforeExpiry = 500;
    } else if (state == 1) {
      if (!clkbit) {
        started = true;
        localData = 1;
        state = 2;
        //isEnabled = false;
        bitCounter = 8;
        dataByte = 0;
        sheduleTimeout(250);
      }
      //ticksBeforeExpiry = 500;
    } else if (state == 100) {
      //start listening for data from host @every 30 cycles
      //wait for clock high -> on c64 this is zero
      //if clock high then read data and display
      //wait for clock low and repeat
    } else if (state == 2) {
      localData = 0;
      sheduleTimeout (80);
      state = 1;
    } else if (state == 3) {
      localData = 0;
      sheduleTimeout (80);
      state = 1;
    }


    //if (clkbit) {
      //console.log("In Disk atn");
      //started = true;
      //localData = 1;
    //}
    //ticksBeforeExpiry = 500;
  }

}



