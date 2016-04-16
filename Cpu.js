function cpu(memory) {
  var localMem = memory;
  var acc = 0;
  var x = 0;
  var y = 0;
  var pc = 0;
  var zeroflag = 0;
  var negativeflag = 0;

  this.step = function () {
    var opcode = localMem.readMem(pc);
    pc = pc + 1;
    switch (opcode)
    {
      case 0xa9:
        acc = localMem.readMem(pc);
        zeroflag = (acc == 0) ? 1 : 0;
        negativeflag = ((acc & 0x80) != 0) ? 1 : 0;
        pc = pc + 1;
      break;

      case 0x85:
        address = localMem.readMem(pc);
        localMem.writeMem(address, acc);
        pc = pc + 1;
      break;
    }
  }
} 
