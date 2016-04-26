function memory()

{
  var mainMem = new Uint8Array(65536);
  mainMem.set([0xa9, 0x0a, 0x69, 0x0f, 0xa9, 0x32, 0x69, 0xce, 0xa9, 0xe7, 0x69, 0xce, 0xa9, 0x88, 0x69, 0xec, 0xa9, 0x43, 0x69, 0x3c, 0xa9, 0x0f, 0xe9, 0x0a, 0xa9, 0x0a, 0xe9, 0x0d, 0xa9, 0x78, 0xe9, 0xf9, 0xa9, 0x88, 0xe9, 0xf8, 0xa9, 0xfe, 0xe8, 0xe8, 0xca, 0xca, 0xa9, 0xfe, 0x85, 0x64, 0xe6, 0x64, 0xe6, 0x64, 0xc6, 0x64, 0xc6, 0x64]);



  this.readMem = function (address) {
    return mainMem[address];
  }

  this.writeMem = function (address, byteval) {
    mainMem[address] = byteval;
  }

}


