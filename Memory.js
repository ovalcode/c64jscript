function memory()

{
  var mainMem = new Uint8Array(65536);
  mainMem.set([0xA9, 0xFB, 0xC9, 0x05, 0xA9, 0x05, 0xC9, 0xFB, 0xA9, 0xE2, 0xC9, 0x64, 0xA2, 0x40, 0xCA, 0xE0, 0x3A, 0xD0, 0xFB, 0xA0, 0x10, 0xC0, 0x23, 0xB0, 0x04, 0xC8, 0x4C, 0x15, 0x00, 0x00 ]);



  this.readMem = function (address) {
    return mainMem[address];
  }

  this.writeMem = function (address, byteval) {
    mainMem[address] = byteval;
  }

}


