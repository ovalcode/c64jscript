function memory()

{
  var mainMem = new Uint8Array(65536);
  mainMem.set([0xA9, 0x52,
0x48,
0xA9, 0x07,
0x20, 0x0A, 0x00,
0x68,
0x00,
0xE9, 0x06,
0x60
]);



  this.readMem = function (address) {
    return mainMem[address];
  }

  this.writeMem = function (address, byteval) {
    mainMem[address] = byteval;
  }

}


