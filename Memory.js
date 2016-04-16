function memory()

{
  var mainMem = new Uint8Array ([0xa9, 0x20, 0x85, 0x08, 0, 0, 0, 0, 0, 0]);

  this.readMem = function (address) {
    return mainMem[address];
  }

  this.writeMem = function (address, byteval) {
    mainMem[address] = byteval;
  }

}


