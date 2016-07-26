function cpu(memory) {
  const ADDRESS_MODE_ACCUMULATOR = 0;
  const ADDRESS_MODE_ABSOLUTE = 1;
  const ADDRESS_MODE_ABSOLUTE_X_INDEXED = 2;
  const ADDRESS_MODE_ABSOLUTE_Y_INDEXED = 3;
  const ADDRESS_MODE_IMMEDIATE = 4;
  const ADDRESS_MODE_IMPLIED = 5;
  const ADDRESS_MODE_INDIRECT = 6;
  const ADDRESS_MODE_X_INDEXED_INDIRECT = 7;
  const ADDRESS_MODE_INDIRECT_Y_INDEXED = 8;
  const ADDRESS_MODE_RELATIVE = 9;
  const ADDRESS_MODE_ZERO_PAGE = 10;
  const ADDRESS_MODE_ZERO_PAGE_X_INDEXED = 11;
  const ADDRESS_MODE_ZERO_PAGE_Y_INDEXED = 12;

const addressModes = [5, 7, 0, 0, 0, 10, 10, 0, 5, 4, 0, 0, 0, 1, 1, 0, 
9, 8, 0, 0, 0, 11, 11, 0, 5, 3, 0, 0, 0, 2, 2, 0, 
1, 7, 0, 0, 10, 10, 10, 0, 5, 4, 0, 0, 1, 1, 1, 0, 
9, 8, 0, 0, 0, 11, 11, 0, 5, 3, 0, 0, 0, 2, 2, 0, 
5, 7, 0, 0, 0, 10, 10, 0, 5, 4, 0, 0, 1, 1, 1, 0, 
9, 8, 0, 0, 0, 11, 11, 0, 5, 3, 0, 0, 0, 2, 2, 0, 
5, 7, 0, 0, 0, 10, 10, 0, 5, 4, 0, 0, 6, 1, 1, 0, 
9, 8, 0, 0, 0, 11, 11, 0, 5, 3, 0, 0, 0, 2, 2, 0, 
0, 7, 0, 0, 10, 10, 10, 0, 5, 0, 5, 0, 1, 1, 1, 0, 
9, 8, 0, 0, 11, 11, 12, 0, 5, 3, 5, 0, 0, 2, 0, 0, 
4, 7, 4, 0, 10, 10, 10, 0, 5, 4, 5, 0, 1, 1, 1, 0, 
9, 8, 0, 0, 11, 11, 12, 0, 5, 3, 5, 0, 2, 2, 3, 0, 
4, 7, 0, 0, 10, 10, 10, 0, 5, 4, 5, 0, 1, 1, 1, 0, 
9, 8, 0, 0, 0, 11, 11, 0, 5, 3, 0, 0, 0, 2, 2, 0, 
4, 7, 0, 0, 10, 10, 10, 0, 5, 4, 5, 0, 1, 1, 1, 0, 
9, 8, 0, 0, 0, 11, 11, 0, 5, 3, 0, 0, 0, 2, 2, 0];

const instructionLengths = [1, 2, 0, 0, 0, 2, 2, 0, 1, 2, 1, 0, 0, 3, 3, 0, 
2, 2, 0, 0, 0, 2, 2, 0, 1, 3, 0, 0, 0, 3, 3, 0, 
3, 2, 0, 0, 2, 2, 2, 0, 1, 2, 1, 0, 3, 3, 3, 0, 
2, 2, 0, 0, 0, 2, 2, 0, 1, 3, 0, 0, 0, 3, 3, 0, 
1, 2, 0, 0, 0, 2, 2, 0, 1, 2, 1, 0, 3, 3, 3, 0, 
2, 2, 0, 0, 0, 2, 2, 0, 1, 3, 0, 0, 0, 3, 3, 0, 
1, 2, 0, 0, 0, 2, 2, 0, 1, 2, 1, 0, 3, 3, 3, 0, 
2, 2, 0, 0, 0, 2, 2, 0, 1, 3, 0, 0, 0, 3, 3, 0, 
0, 2, 0, 0, 2, 2, 2, 0, 1, 0, 1, 0, 3, 3, 3, 0, 
2, 2, 0, 0, 2, 2, 2, 0, 1, 3, 1, 0, 0, 3, 0, 0, 
2, 2, 2, 0, 2, 2, 2, 0, 1, 2, 1, 0, 3, 3, 3, 0, 
2, 2, 0, 0, 2, 2, 2, 0, 1, 3, 1, 0, 3, 3, 3, 0, 
2, 2, 0, 0, 2, 2, 2, 0, 1, 2, 1, 0, 3, 3, 3, 0, 
2, 2, 0, 0, 0, 2, 2, 0, 1, 3, 0, 0, 0, 3, 3, 0, 
2, 2, 0, 0, 2, 2, 2, 0, 1, 2, 1, 0, 3, 3, 3, 0, 
2, 2, 0, 0, 0, 2, 2, 0, 1, 3, 0, 0, 0, 3, 3, 0];

const instructionCycles = [7, 6, 0, 0, 0, 3, 5, 0, 3, 2, 2, 0, 0, 4, 6, 0, 
2, 5, 0, 0, 0, 4, 6, 0, 2, 4, 0, 0, 0, 4, 7, 0, 
6, 6, 0, 0, 3, 3, 5, 0, 4, 2, 2, 0, 4, 4, 6, 0, 
2, 5, 0, 0, 0, 4, 6, 0, 2, 4, 0, 0, 0, 4, 7, 0, 
6, 6, 0, 0, 0, 3, 5, 0, 3, 2, 2, 0, 3, 4, 6, 0, 
2, 5, 0, 0, 0, 4, 6, 0, 2, 4, 0, 0, 0, 4, 7, 0, 
6, 6, 0, 0, 0, 3, 5, 0, 4, 2, 2, 0, 5, 4, 6, 0, 
2, 5, 0, 0, 0, 4, 6, 0, 2, 4, 0, 0, 0, 4, 7, 0, 
0, 6, 0, 0, 3, 3, 3, 0, 2, 0, 2, 0, 4, 4, 4, 0, 
2, 6, 0, 0, 4, 4, 4, 0, 2, 5, 2, 0, 0, 5, 0, 0, 
2, 6, 2, 0, 3, 3, 3, 0, 2, 2, 2, 0, 4, 4, 4, 0, 
2, 5, 0, 0, 4, 4, 4, 0, 2, 4, 2, 0, 4, 4, 4, 0, 
2, 6, 0, 0, 3, 3, 5, 0, 2, 2, 2, 0, 4, 4, 3, 0, 
2, 5, 0, 0, 0, 4, 6, 0, 2, 4, 0, 0, 0, 4, 7, 0, 
2, 6, 0, 0, 3, 3, 5, 0, 2, 2, 2, 0, 4, 4, 6, 0, 
2, 5, 0, 0, 0, 4, 6, 0, 2, 4, 0, 0, 0, 4, 7, 0];

const opCodeDesc = 
["BRK", "ORA", "", "", "", "ORA", "ASL", "", "PHP", "ORA", "ASL", "", "", "ORA", "ASL", "", 
"BPL", "ORA", "", "", "", "ORA", "ASL", "", "CLC", "ORA", "", "", "", "ORA", "ASL", "", 
"JSR", "AND", "", "", "BIT", "AND", "ROL", "", "PLP", "AND", "ROL", "", "BIT", "AND", "ROL", "", 
"BMI", "AND", "", "", "", "AND", "ROL", "", "SEC", "AND", "", "", "", "AND", "ROL", "", 
"RTI", "EOR", "", "", "", "EOR", "LSR", "", "PHA", "EOR", "LSR", "", "JMP", "EOR", "LSR", "", 
"BVC", "EOR", "", "", "", "EOR", "LSR", "", "CLI", "EOR", "", "", "", "EOR", "LSR", "", 
"RTS", "ADC", "", "", "", "ADC", "ROR", "", "PLA", "ADC", "ROR", "", "JMP", "ADC", "ROR", "", 
"BVC", "ADC", "", "", "", "ADC", "ROR", "", "SEI", "ADC", "", "", "", "ADC", "ROR", "", 
"", "STA", "", "", "STY", "STA", "STX", "", "DEY", "", "TXA", "", "STY", "STA", "STX", "", 
"BCC", "STA", "", "", "STY", "STA", "STX", "", "TYA", "STA", "TXS", "", "", "STA", "", "", 
"LDY", "LDA", "LDX", "", "LDY", "LDA", "LDX", "", "TAY", "LDA", "TAX", "", "LDY", "LDA", "LDX", "", 
"BCS", "LDA", "", "", "LDY", "LDA", "LDX", "", "CLV", "LDA", "TSX", "", "LDY", "LDA", "LDX", "", 
"CPY", "CMP", "", "", "CPY", "CMP", "DEC", "", "INY", "CMP", "DEX", "", "CPY", "CMP", "DEC", "", 
"BNE", "CMP", "", "", "", "CMP", "DEC", "", "CLD", "CMP", "", "", "", "CMP", "DEC", "", 
"CPX", "SBC", "", "", "CPX", "SBC", "INC", "", "INX", "SBC", "NOP", "", "CPX", "SBC", "INC", "", 
"BEQ", "SBC", "", "", "", "SBC", "INC", "", "SED", "SBC", "", "", "", "SBC", "INC", ""];

  var localMem = memory;
  var acc = 0;
  var x = 0;
  var y = 0;
  var pc = 0x400;
  var sp = 0xff;
  var zeroflag = 0;
  var negativeflag = 0;
  var carryflag =0;
  var overflowflag =0; 
  var decimalflag = 0;
  var interruptflag = 1;
  var breakflag = 1;
  var cycleCount = 0;
  var interruptOcurred = 0;
  var myInterruptController;
  var myvideo;
  var allowLogging = false;

  this.setInterruptController = function (interruptController) {
    myInterruptController = interruptController;
  }

    this.getCycleCount = function() {
      return cycleCount;
    }

    this.setInterrupt = function () {
      interruptOcurred = 1;
    }

  this.setVideo = function (video) {
    myvideo = video;
  }

    this.getPc = function () {
      return pc;
    }

    this.reset = function () {
      pc = localMem.readMem(0xfffc);
      pc = pc + localMem.readMem(0xfffd) * 256;
    }

  this.setAllowLogging = function(flag) {
    allowLogging = flag;
  }

  function log_debug(value) {
    if (allowLogging) {
      console.log(value);
    }
  }

    function adcDecimal(operand) { 
    	        var l = 0; 
                var h = 0;
                var result = 0;
    	        l = (acc & 0x0f) + (operand & 0x0f) + carryflag;
    	        if ((l & 0xff) > 9) l += 6; 
    	        h = (acc >> 4) + (operand >> 4) + (l > 15 ? 1 : 0);
    	        if ((h & 0xff) > 9) h += 6; 
    	        result = (l & 0x0f) | (h << 4);
    	        result &= 0xff; 
    	        carryflag = (h > 15) ? 1 : 0;
    	        zeroflag = (result == 0) ? 1 : 0;
                negativeflag = 0;
                overflowflag = 0;
    	        return result;     	 
    	    } 

    function ADC(operand1, operand2) {
      temp = operand1 + operand2 + carryflag;
      carryflag = ((temp & 0x100) == 0x100) ? 1 : 0;
      overflowflag = (((operand1^temp) & (operand2^temp) & 0x80) == 0x80) ? 1 : 0;
      temp = temp & 0xff;
      return temp;
    }

    function sbcDecimal(operand) {
        var l = 0;
        var h = 0; 
        var result = 0;
        l = (acc & 0x0f) - (operand & 0x0f) - (1 - carryflag);
        if ((l & 0x10) != 0) l -= 6;
        h = (acc >> 4) - (operand >> 4) - ((l & 0x10) != 0 ? 1 : 0);
        if ((h & 0x10) != 0) h -= 6;
        result = (l & 0x0f) | (h << 4);
        carryflag = ((h & 0xff) < 15) ? 1 : 0;
    	        zeroflag = (result == 0) ? 1 : 0;
                negativeflag = 0;
                overflowflag = 0;
        return (result & 0xff);
    }



   function SBC(operand1, operand2) {
      operand2 = ~operand2 & 0xff;
      //operand2 = operand2 + (1 - carryflag);
      temp = operand1 + operand2 + carryflag;
      carryflag = ((temp & 0x100) == 0x100) ? 1 : 0;
      overflowflag = (((operand1^temp) & (operand2^temp) & 0x80) == 0x80) ? 1 : 0;
      temp = temp & 0xff;
      return temp;
    }

   function CMP(operand1, operand2) {
      operand2 = ~operand2 & 0xff;
      operand2 = operand2 + 1;
      temp = operand1 + operand2;
      carryflag = ((temp & 0x100) == 0x100) ? 1 : 0;
      temp = temp & 0xff;
      zeroflag = (temp == 0) ? 1 : 0;
      negativeflag = ((temp & 0x80) != 0) ? 1 : 0;
    }

    function Push(value) {
      localMem.writeMem((sp | 0x100), value);
      sp--;
      sp = sp & 0xff;
    }

    function Pop() {
      sp++;
      sp = sp & 0xff;
      var result = localMem.readMem(sp | 0x100);
      return result;
    }

    function getStatusFlagsAsByte() {
      var result = (negativeflag << 7) | (overflowflag << 6) | (1 << 5) | (breakflag << 4) | (decimalflag << 3) | (interruptflag << 2) | (zeroflag << 1) |
        (carryflag);
      return result;
    }

    function setStatusFlagsAsByte(value) {
      negativeflag = (value >> 7) & 1;
      overflowflag = (value >> 6) & 1;
      decimalflag = (value >> 3) & 1;
      interruptflag = (value >> 2) & 1;
      zeroflag = (value >> 1) & 1;
      carryflag = (value) & 1;
    }

 function calculateEffevtiveAdd(mode, argbyte1, argbyte2) {

    var tempAddress = 0;
    switch (mode)
    {
      case ADDRESS_MODE_ACCUMULATOR: return 0; 
      break;

      case ADDRESS_MODE_ABSOLUTE: return (argbyte2 * 256 + argbyte1);
      break;

      case ADDRESS_MODE_ABSOLUTE_X_INDEXED: tempAddress = (argbyte2 * 256 + argbyte1);
        tempAddress = tempAddress + x;
        return tempAddress;
      break;

      case ADDRESS_MODE_ABSOLUTE_Y_INDEXED: tempAddress = (argbyte2 * 256 + argbyte1);
        tempAddress = tempAddress + y;
        return tempAddress;
      break;

      case ADDRESS_MODE_IMMEDIATE: 
      break;

      case ADDRESS_MODE_IMPLIED:
      break;

      case ADDRESS_MODE_INDIRECT:
        tempAddress = (argbyte2 * 256 + argbyte1);
        return (localMem.readMem(tempAddress + 1) * 256 + localMem.readMem(tempAddress));
      break;

      case ADDRESS_MODE_X_INDEXED_INDIRECT:
        tempAddress = (argbyte1 + x) & 0xff;
        return (localMem.readMem(tempAddress + 1) * 256 + localMem.readMem(tempAddress));
      break;

      case ADDRESS_MODE_INDIRECT_Y_INDEXED:
        tempAddress = localMem.readMem(argbyte1 + 1) * 256 + localMem.readMem(argbyte1) + y;
        return tempAddress;
      break;

      case ADDRESS_MODE_RELATIVE:
        tempAddress = (argbyte1 > 127) ? (argbyte1 - 256) : argbyte1;
        tempAddress = tempAddress + pc;
        return tempAddress;
      break;

      case ADDRESS_MODE_ZERO_PAGE:
         return argbyte1;
      break;

      case ADDRESS_MODE_ZERO_PAGE_X_INDEXED:
        return (argbyte1 + x) & 0xff;
      break;

      case ADDRESS_MODE_ZERO_PAGE_Y_INDEXED:
        return (argbyte1 + y) & 0xff;
      break;
    }
  }

  function getAsTwoDigit(number) {
    result = "00" + number.toString(16);
    result = result.slice(-2);
    return result;
  }

  function getAsFourDigit(number) {
    result = "0000" + number.toString(16);
    result = result.slice(-4);
    return result;
  }

  
  this.getDecodedStr = function () {
    opCode = localMem.readMem (pc);
    mode = addressModes[opCode];
    numArgs = instructionLengths[opCode] - 1;
    if (numArgs > 0) {
      argbyte1 = localMem.readMem (pc + 1);
    }

    if (numArgs > 1) {
      argbyte2 = localMem.readMem (pc + 2);
    }
    
    
    address = 0;
    addrStr = "";
    var result = getAsFourDigit(pc);
    result = result + " " + opCodeDesc[opCode] + " ";
    switch (mode) {
      case ADDRESS_MODE_ACCUMULATOR: return 0; 
      break;

      case ADDRESS_MODE_ABSOLUTE: addrStr = getAsFourDigit(argbyte2 * 256 + argbyte1);
        result = result + "$" + addrStr;
        return result;
      break;

      case ADDRESS_MODE_ABSOLUTE_X_INDEXED: addrStr = getAsFourDigit(argbyte2 * 256 + argbyte1);
        result = result + "$" + addrStr + ",X";
        return result;
      break;

      case ADDRESS_MODE_ABSOLUTE_Y_INDEXED: addrStr = getAsFourDigit(argbyte2 * 256 + argbyte1);
        result = result + "$" + addrStr + ",Y";
        return result;
      break;

      case ADDRESS_MODE_IMMEDIATE: addrStr = getAsTwoDigit(argbyte1);
        result = result + "#$" + addrStr;
        return result; 
      break;

      case ADDRESS_MODE_IMPLIED:
        return result;
      break;

      case ADDRESS_MODE_INDIRECT:
        tempAddress = (argbyte2 * 256 + argbyte1);
        return (localMem.readMem(tempAddress + 1) * 256 + localMem.readMem(tempAddress));
      break;

      case ADDRESS_MODE_X_INDEXED_INDIRECT:
        addrStr = getAsTwoDigit(argbyte2 * 256 + argbyte1);
        result = result + "($" + addrStr + ",X)";
        return result;      break;

      case ADDRESS_MODE_INDIRECT_Y_INDEXED:
        addrStr = getAsTwoDigit(argbyte1);
        result = result + "($" + addrStr + "),Y";
        return result;
      break;

      case ADDRESS_MODE_RELATIVE:
        addrStr = getAsFourDigit(((argbyte1 > 127) ? (argbyte1 - 256) : argbyte1) + pc + 2);
        result = result + "$" + addrStr;
        return result;
      break;

      case ADDRESS_MODE_ZERO_PAGE:
        addrStr = getAsTwoDigit(argbyte1);
        result = result + "$" + addrStr;
        return result;
      break;

      case ADDRESS_MODE_ZERO_PAGE_X_INDEXED:
        addrStr = getAsTwoDigit(argbyte1);
        result = result + "$" + addrStr + ",X";
        return result;
      break;

      case ADDRESS_MODE_ZERO_PAGE_Y_INDEXED:
        addrStr = getAsTwoDigit(argbyte1);
        result = result + "$" + addrStr + ",Y";
        return result;
      break;

    }
  }

  this.getDebugReg = function ()  {
    var astr = "00" + acc.toString(16); astr = astr.slice(-2);
    var xstr = "00" + x.toString(16); xstr = xstr.slice(-2);
    var ystr = "00" + y.toString(16); ystr = ystr.slice(-2);
    var pcstr = "0000" + pc.toString(16); pcstr = pcstr.slice(-4);
    var spstr = "00" + sp.toString(16); spstr = spstr.slice(-2);
    var result = "";
    result = result + "Acc:" + astr + " X:" + xstr + " Y:" + ystr + "SP: " + spstr +" PC:" + pcstr;
    result = result + " Z:" + zeroflag.toString();
    result = result + " N:" + negativeflag.toString();
    result = result + " C:" + carryflag.toString();
    result = result + " V:" + overflowflag.toString();
    result = result + " D:" + decimalflag.toString();
    return result;
  }


  this.step = function () {
    log_debug(this.getDecodedStr() + "  " + this.getDebugReg());
    if ((myInterruptController.getCpuInterruptOcurred() | myvideo.vicIntOccured()) & (interruptflag == 0)) {
        interruptOcurred = 0;
        Push(pc >> 8);
        Push(pc & 0xff);
        breakflag = 0;
        Push(getStatusFlagsAsByte());
        breakflag = 1;
        interruptflag = 1;
        tempVal = localMem.readMem(0xffff) * 256;
        tempVal = tempVal + localMem.readMem(0xfffe);
        pc = tempVal;
    }

    var opcode = localMem.readMem(pc);
    pc = pc + 1;
    var iLen = instructionLengths[opcode];
    var arg1 = 0;
    var arg2 = 0;
    var effectiveAdrress = 0;
    cycleCount = cycleCount + instructionCycles[opcode];
    if (iLen > 1) {
      arg1 = localMem.readMem(pc);
      pc = pc + 1;
    }    

    if (iLen > 2) {
      arg2 = localMem.readMem(pc);
      pc = pc + 1;
    }    

    effectiveAdrress = calculateEffevtiveAdd(addressModes[opcode], arg1, arg2);

    switch (opcode)
    {
/*LDA  Load Accumulator with Memory

     M -> A                           N Z C I D V
                                      + + - - - -

     addressing    assembler    opc  bytes  cyles
     --------------------------------------------
     immediate     LDA #oper     A9    2     2
     zeropage      LDA oper      A5    2     3
     zeropage,X    LDA oper,X    B5    2     4
     absolute      LDA oper      AD    3     4
     absolute,X    LDA oper,X    BD    3     4*
     absolute,Y    LDA oper,Y    B9    3     4*
     (indirect,X)  LDA (oper,X)  A1    2     6
     (indirect),Y  LDA (oper),Y  B1    2     5* */

      case 0xa9:
        acc = arg1;
        zeroflag = (acc == 0) ? 1 : 0;
        negativeflag = ((acc & 0x80) != 0) ? 1 : 0;
      break;
      case 0xA5:
      case 0xB5:
      case 0xAD:
      case 0xBD:
      case 0xB9:
      case 0xA1:
      case 0xB1:
        acc = localMem.readMem(effectiveAdrress);
        zeroflag = (acc == 0) ? 1 : 0;
        negativeflag = ((acc & 0x80) != 0) ? 1 : 0;
      break;

/*LDX  Load Index X with Memory

     M -> X                           N Z C I D V
                                      + + - - - -

     addressing    assembler    opc  bytes  cyles
     --------------------------------------------
     immediate     LDX #oper     A2    2     2
     zeropage      LDX oper      A6    2     3
     zeropage,Y    LDX oper,Y    B6    2     4
     absolute      LDX oper      AE    3     4
     absolute,Y    LDX oper,Y    BE    3     4**/

      case 0xA2:
        x = arg1;
        zeroflag = (x == 0) ? 1 : 0;
        negativeflag = ((x & 0x80) != 0) ? 1 : 0;
      break;

      case 0xA6:
      case 0xB6:
      case 0xAE:
      case 0xBE:
        x = localMem.readMem(effectiveAdrress);
        zeroflag = (x == 0) ? 1 : 0;
        negativeflag = ((x & 0x80) != 0) ? 1 : 0;


break;



/*LDY  Load Index Y with Memory

     M -> Y                           N Z C I D V
                                      + + - - - -

     addressing    assembler    opc  bytes  cyles
     --------------------------------------------
     immediate     LDY #oper     A0    2     2
     zeropage      LDY oper      A4    2     3
     zeropage,X    LDY oper,X    B4    2     4
     absolute      LDY oper      AC    3     4
     absolute,X    LDY oper,X    BC    3     4*/


      case 0xA0:
        y = arg1;
        zeroflag = (y == 0) ? 1 : 0;
        negativeflag = ((y & 0x80) != 0) ? 1 : 0;
      break;

      case 0xA4:
      case 0xB4:
      case 0xAC:
      case 0xBC:
        y = localMem.readMem(effectiveAdrress);
        zeroflag = (y == 0) ? 1 : 0;
        negativeflag = ((y & 0x80) != 0) ? 1 : 0;
      break;
 
/*STA  Store Accumulator in Memory

     A -> M                           N Z C I D V
                                      - - - - - -

     addressing    assembler    opc  bytes  cyles
     --------------------------------------------
     zeropage      STA oper      85    2     3
     zeropage,X    STA oper,X    95    2     4
     absolute      STA oper      8D    3     4
     absolute,X    STA oper,X    9D    3     5
     absolute,Y    STA oper,Y    99    3     5
     (indirect,X)  STA (oper,X)  81    2     6
     (indirect),Y  STA (oper),Y  91    2     6  */

      case 0x85:
      case 0x95:
      case 0x8D:
      case 0x9D:
      case 0x99:
      case 0x81:
      case 0x91:
        localMem.writeMem(effectiveAdrress, acc);


break;


/*STX  Store Index X in Memory

     X -> M                           N Z C I D V
                                      - - - - - -

     addressing    assembler    opc  bytes  cyles
     --------------------------------------------
     zeropage      STX oper      86    2     3
     zeropage,Y    STX oper,Y    96    2     4
     absolute      STX oper      8E    3     4  */

      case 0x86:
      case 0x96:
      case 0x8E:

        localMem.writeMem(effectiveAdrress, x);


break;
/*STY  Sore Index Y in Memory

     Y -> M                           N Z C I D V
                                      - - - - - -

     addressing    assembler    opc  bytes  cyles
     --------------------------------------------
     zeropage      STY oper      84    2     3
     zeropage,X    STY oper,X    94    2     4
     absolute      STY oper      8C    3     4  */

      case 0x84:
      case 0x94:
      case 0x8C:
        localMem.writeMem(effectiveAdrress, y);
break;

/*ADC  Add Memory to Accumulator with Carry

     A + M + C -> A, C                N Z C I D V
                                      + + + - - +

     addressing    assembler    opc  bytes  cyles
     --------------------------------------------
     immediate     ADC #oper     69    2     2
     zeropage      ADC oper      65    2     3
     zeropage,X    ADC oper,X    75    2     4
     absolute      ADC oper      6D    3     4
     absolute,X    ADC oper,X    7D    3     4*
     absolute,Y    ADC oper,Y    79    3     4*
     (indirect,X)  ADC (oper,X)  61    2     6
     (indirect),Y  ADC (oper),Y  71    2     5* */

      case 0x69:
        if (decimalflag == 0) {
          acc = ADC (acc, arg1);
          zeroflag = (acc == 0) ? 1 : 0;
          negativeflag = ((acc & 0x80) != 0) ? 1 : 0;
        } else {
          acc = adcDecimal(arg1);
        }
      break;
      case 0x65:
      case 0x75:
      case 0x6D:
      case 0x7D:
      case 0x79:
      case 0x61:
      case 0x71:
        if (decimalflag == 0) {
          acc = ADC (acc, localMem.readMem(effectiveAdrress));
          zeroflag = (acc == 0) ? 1 : 0;
          negativeflag = ((acc & 0x80) != 0) ? 1 : 0;
        } else {
          acc = adcDecimal(localMem.readMem(effectiveAdrress));
        }
      break;

/*SBC  Subtract Memory from Accumulator with Borrow

     A - M - C -> A                   N Z C I D V
                                      + + + - - +

     addressing    assembler    opc  bytes  cyles
     --------------------------------------------
     immediate     SBC #oper     E9    2     2
     zeropage      SBC oper      E5    2     3
     zeropage,X    SBC oper,X    F5    2     4
     absolute      SBC oper      ED    3     4
     absolute,X    SBC oper,X    FD    3     4*
     absolute,Y    SBC oper,Y    F9    3     4*
     (indirect,X)  SBC (oper,X)  E1    2     6
     (indirect),Y  SBC (oper),Y  F1    2     5*  */

      case 0xE9:
        if (decimalflag == 0) {
          acc = SBC (acc, arg1);
          zeroflag = (acc == 0) ? 1 : 0;
          negativeflag = ((acc & 0x80) != 0) ? 1 : 0;
        } else {
          acc = sbcDecimal(arg1);
        }
      break;
      case 0xE5:
      case 0xF5:
      case 0xED:
      case 0xFD:
      case 0xF9:
      case 0xE1:
      case 0xF1:
        if (decimalflag == 0) {
          acc = SBC (acc, localMem.readMem(effectiveAdrress));
          zeroflag = (acc == 0) ? 1 : 0;
          negativeflag = ((acc & 0x80) != 0) ? 1 : 0;
        } else {
          acc = sbcDecimal(localMem.readMem(effectiveAdrress));
        }
      break;

/*INC  Increment Memory by One

     M + 1 -> M                       N Z C I D V
                                      + + - - - -

     addressing    assembler    opc  bytes  cyles
     --------------------------------------------
     zeropage      INC oper      E6    2     5
     zeropage,X    INC oper,X    F6    2     6
     absolut      INC oper      EE    3     6
     absolute,X    INC oper,X    FE    3     7 */
 
      case 0xE6:
      case 0xF6:
      case 0xEE:
      case 0xFE:
        var tempVal = localMem.readMem(effectiveAdrress);
        tempVal++; tempVal = tempVal & 0xff;        
        localMem.writeMem(effectiveAdrress, tempVal);
        zeroflag = (tempVal == 0) ? 1 : 0;
        negativeflag = ((tempVal & 0x80) != 0) ? 1 : 0;
      break;

/*INX  Increment Index X by One

     X + 1 -> X                       N Z C I D V
                                      + + - - - -

     addressing    assembler    opc  bytes  cyles
     --------------------------------------------
     implied       INX           E8    1     2*/
 
      case 0xE8:

        x++; x = x & 0xff;        
        zeroflag = (x == 0) ? 1 : 0;
        negativeflag = ((x & 0x80) != 0) ? 1 : 0;
      break;

/*INY  Increment Index Y by One

     Y + 1 -> Y                       N Z C I D V
                                      + + - - - -

     addressing    assembler    opc  bytes  cyles
     --------------------------------------------
     implied       INY           C8    1     2*/
 
      case 0xC8:

        y++; y = y & 0xff;        
        zeroflag = (y == 0) ? 1 : 0;
        negativeflag = ((y & 0x80) != 0) ? 1 : 0;
      break;

/*DEC  Decrement Memory by One

     M - 1 -> M                       N Z C I D V
                                      + + - - - -

     addressing    assembler    opc  bytes  cyles
     --------------------------------------------
     zeropage      DEC oper      C6    2     5
     zeropage,X    DEC oper,X    D6    2     6
     absolute      DEC oper      CE    3     3
     absolute,X    DEC oper,X    DE    3     7 */
 
      case 0xC6:
      case 0xD6:
      case 0xCE:
      case 0xDE:
        var tempVal = localMem.readMem(effectiveAdrress);
        tempVal--; tempVal = tempVal & 0xff;        
        localMem.writeMem(effectiveAdrress, tempVal);
        zeroflag = (tempVal == 0) ? 1 : 0;
        negativeflag = ((tempVal & 0x80) != 0) ? 1 : 0;
      break;

/*DEX  Decrement Index X by One

     X - 1 -> X                       N Z C I D V
                                      + + - - - -

     addressing    assembler    opc  bytes  cyles
     --------------------------------------------
     implied       DEC           CA    1     2*/
 
      case 0xCA:

        x--; x = x & 0xff;        
        zeroflag = (x == 0) ? 1 : 0;
        negativeflag = ((x & 0x80) != 0) ? 1 : 0;
      break;

/*DEY  Decrement Index Y by One

     Y - 1 -> Y                       N Z C I D V
                                      + + - - - -

     addressing    assembler    opc  bytes  cyles
     --------------------------------------------
     implied       DEC           88    1     2*/
 
      case 0x88:

        y--; y = y & 0xff;        
        zeroflag = (y == 0) ? 1 : 0;
        negativeflag = ((y & 0x80) != 0) ? 1 : 0;
      break;

/*CMP  Compare Memory with Accumulator

     A - M                            N Z C I D V
                                    + + + - - -

     addressing    assembler    opc  bytes  cyles
     --------------------------------------------
     immediate     CMP #oper     C9    2     2
     zeropage      CMP oper      C5    2     3
     zeropage,X    CMP oper,X    D5    2     4
     absolute      CMP oper      CD    3     4
     absolute,X    CMP oper,X    DD    3     4*
     absolute,Y    CMP oper,Y    D9    3     4*
     (indirect,X)  CMP (oper,X)  C1    2     6
     (indirect),Y  CMP (oper),Y  D1    2     5* */

      case 0xc9:
        CMP(acc, arg1);
      break;
      case 0xc5:
      case 0xd5:
      case 0xcd:
      case 0xdD:
      case 0xd9:
      case 0xc1:
      case 0xd1:
        CMP(acc, localMem.readMem(effectiveAdrress));
      break;

/*CPX  Compare Memory and Index X

     X - M                            N Z C I D V
                                      + + + - - -

     addressing    assembler    opc  bytes  cyles
     --------------------------------------------
     immediate     CPX #oper     E0    2     2
     zeropage      CPX oper      E4    2     3
     absolute      CPX oper      EC    3     4
*/

      case 0xe0:
        CMP(x, arg1);
      break;
      case 0xe4:
      case 0xec:
        CMP(x, localMem.readMem(effectiveAdrress));
      break;

/*CPY  Compare Memory and Index Y

     Y - M                            N Z C I D V
                                      + + + - - -

     addressing    assembler    opc  bytes  cyles
     --------------------------------------------
     immediate     CPY #oper     C0    2     2
     zeropage      CPY oper      C4    2     3
     absolute      CPY oper      CC    3     4*/

      case 0xc0:
        CMP(y, arg1);
      break;
      case 0xc4:
      case 0xcc:
        CMP(y, localMem.readMem(effectiveAdrress));
      break;

/*BCC  Branch on Carry Clear

     branch on C = 0                  N Z C I D V
                                      - - - - - -

     addressing    assembler    opc  bytes  cyles
     --------------------------------------------
     relative      BCC oper      90    2     2** */

      case 0x90:
        if (carryflag == 0)
          pc = effectiveAdrress;
      break;


/*BCS  Branch on Carry Set

     branch on C = 1                  N Z C I D V
                                      - - - - - -

     addressing    assembler    opc  bytes  cyles
     --------------------------------------------
     relative      BCS oper      B0    2     2** */

      case 0xB0:
        if (carryflag == 1)
          pc = effectiveAdrress;
      break;


/*BEQ  Branch on Result Zero

     branch on Z = 1                  N Z C I D V
                                      - - - - - -

     addressing    assembler    opc  bytes  cyles
     --------------------------------------------
     relative      BEQ oper      F0    2     2** */

      case 0xF0:
        if (zeroflag == 1)
          pc = effectiveAdrress;
      break;



/*BMI  Branch on Result Minus

     branch on N = 1                  N Z C I D V
                                      - - - - - -

     addressing    assembler    opc  bytes  cyles
     --------------------------------------------
     relative      BMI oper      30    2     2** */

      case 0x30:
        if (negativeflag == 1)
          pc = effectiveAdrress;
      break;


/*BNE  Branch on Result not Zero

     branch on Z = 0                  N Z C I D V
                                      - - - - - -

     addressing    assembler    opc  bytes  cyles
     --------------------------------------------
     relative      BNE oper      D0    2     2**/

      case 0xD0:
        if (zeroflag == 0)
          pc = effectiveAdrress;
      break;



/*BPL  Branch on Result Plus

     branch on N = 0                  N Z C I D V
                                      - - - - - -

     addressing    assembler    opc  bytes  cyles
     --------------------------------------------
     relative      BPL oper      10    2     2** */

      case 0x10:
        if (negativeflag == 0)
          pc = effectiveAdrress;
      break;



/*BVC  Branch on Overflow Clear

     branch on V = 0                  N Z C I D V
                                      - - - - - -

     addressing    assembler    opc  bytes  cyles
     --------------------------------------------
     relative      BVC oper      50    2     2** */

      case 0x50:
        if (overflowflag == 0)
          pc = effectiveAdrress;
      break;

/*BVS  Branch on Overflow Set

     branch on V = 1                  N Z C I D V
                                      - - - - - -

     addressing    assembler    opc  bytes  cyles
     --------------------------------------------
     relative      BVC oper      70    2     2** */

      case 0x70:
        if (overflowflag == 1)
          pc = effectiveAdrress;
      break;

/*JMP  Jump to New Location

     (PC+1) -> PCL                    N Z C I D V
     (PC+2) -> PCH                    - - - - - -

     addressing    assembler    opc  bytes  cyles
     --------------------------------------------
     absolute      JMP oper      4C    3     3
     indirect      JMP (oper)    6C    3     5 */

      case 0x4C:

      case 0x6C:
          pc = effectiveAdrress;
      break;

/*PHA  Push Accumulator on Stack

     push A                           N Z C I D V
                                      - - - - - -

     addressing    assembler    opc  bytes  cyles
     --------------------------------------------
     implied       PHA           48    1     3 */

      case 0x48:
        Push(acc);
      break;


/*PHP  Push Processor Status on Stack

     push SR                          N Z C I D V
                                      - - - - - -

     addressing    assembler    opc  bytes  cyles
     --------------------------------------------
     implied       PHP           08    1     3 */

      case 0x08:
        Push(getStatusFlagsAsByte());
      break;


/*PLA  Pull Accumulator from Stack

     pull A                           N Z C I D V
                                      + + - - - -

     addressing    assembler    opc  bytes  cyles
     --------------------------------------------
     implied       PLA           68    1     4 */

      case 0x68:
        acc = Pop();
        zeroflag = (acc == 0) ? 1 : 0;
        negativeflag = ((acc & 0x80) != 0) ? 1 : 0;
      break;



/*PLP  Pull Processor Status from Stack

     pull SR                          N Z C I D V
                                      from stack

     addressing    assembler    opc  bytes  cyles
     --------------------------------------------
     implied       PLP           28    1     4 */

      case 0x28:
        setStatusFlagsAsByte(Pop());
      break;

/*JSR  Jump to New Location Saving Return Address

     push (PC+2),                     N Z C I D V
     (PC+1) -&gt; PCL                    - - - - - -
     (PC+2) -&gt; PCH

     addressing    assembler    opc  bytes  cyles
     --------------------------------------------
     absolute      JSR oper      20    3     6 */

      case 0x20:
        var tempVal = pc - 1;
        Push((tempVal >> 8) & 0xff);
        Push(tempVal & 0xff);
        pc = effectiveAdrress;
      break;

/*RTS  Return from Subroutine

     pull PC, PC+1 -&gt; PC              N Z C I D V
                                      - - - - - -

     addressing    assembler    opc  bytes  cyles
     --------------------------------------------
     implied       RTS           60    1     6 */

      case 0x60:
        var tempVal = Pop();
        tempVal = tempVal + Pop() * 256;
        pc = tempVal + 1;
      break;

/*AND  AND Memory with Accumulator

     A AND M -> A                     N Z C I D V
                                      + + - - - -

     addressing    assembler    opc  bytes  cyles
     --------------------------------------------
     immediate     AND #oper     29    2     2
     zeropage      AND oper      25    2     3
     zeropage,X    AND oper,X    35    2     4
     absolute      AND oper      2D    3     4
     absolute,X    AND oper,X    3D    3     4*
     absolute,Y    AND oper,Y    39    3     4*
     (indirect,X)  AND (oper,X)  21    2     6
     (indirect),Y  AND (oper),Y  31    2     5* */


      case 0x29:  acc = acc & arg1;
          zeroflag = (acc == 0) ? 1 : 0;
          negativeflag = ((acc & 0x80) != 0) ? 1 : 0;
        break;
      case 0x25:
      case 0x35:
      case 0x2D:
      case 0x3D:
      case 0x39:
      case 0x21:
      case 0x31: acc = acc & localMem.readMem(effectiveAdrress);
          zeroflag = (acc == 0) ? 1 : 0;
          negativeflag = ((acc & 0x80) != 0) ? 1 : 0;
        break;



/*EOR  Exclusive-OR Memory with Accumulator

     A EOR M -> A                     N Z C I D V
                                      + + - - - -

     addressing    assembler    opc  bytes  cyles
     --------------------------------------------
     immediate     EOR #oper     49    2     2
     zeropage      EOR oper      45    2     3
     zeropage,X    EOR oper,X    55    2     4
     absolute      EOR oper      4D    3     4
     absolute,X    EOR oper,X    5D    3     4*
     absolute,Y    EOR oper,Y    59    3     4*
     (indirect,X)  EOR (oper,X)  41    2     6
     (indirect),Y  EOR (oper),Y  51    2     5* */

      case 0x49:  acc = acc ^ arg1;
          zeroflag = (acc == 0) ? 1 : 0;
          negativeflag = ((acc & 0x80) != 0) ? 1 : 0;
        break;
      case 0x45:
      case 0x55:
      case 0x4D:
      case 0x5D:
      case 0x59:
      case 0x41:
      case 0x51: acc = acc ^ localMem.readMem(effectiveAdrress);
          zeroflag = (acc == 0) ? 1 : 0;
          negativeflag = ((acc & 0x80) != 0) ? 1 : 0;
        break;


/*ORA  OR Memory with Accumulator

     A OR M -> A                      N Z C I D V
                                      + + - - - -

     addressing    assembler    opc  bytes  cyles
     --------------------------------------------
     immediate     ORA #oper     09    2     2
     zeropage      ORA oper      05    2     3
     zeropage,X    ORA oper,X    15    2     4
     absolute      ORA oper      0D    3     4
     absolute,X    ORA oper,X    1D    3     4*
     absolute,Y    ORA oper,Y    19    3     4*
     (indirect,X)  ORA (oper,X)  01    2     6
     (indirect),Y  ORA (oper),Y  11    2     5* */

      case 0x09:  acc = acc | arg1;
          zeroflag = (acc == 0) ? 1 : 0;
          negativeflag = ((acc & 0x80) != 0) ? 1 : 0;
        break;
      case 0x05:
      case 0x15:
      case 0x0D:
      case 0x1D:
      case 0x19:
      case 0x01:
      case 0x11: acc = acc | localMem.readMem(effectiveAdrress);
          zeroflag = (acc == 0) ? 1 : 0;
          negativeflag = ((acc & 0x80) != 0) ? 1 : 0;
        break;

/*CLC  Clear Carry Flag

     0 -> C                           N Z C I D V
                                      - - 0 - - -

     addressing    assembler    opc  bytes  cyles
     --------------------------------------------
     implied       CLC           18    1     2 */

      case 0x18: 
          carryflag = 0;
        break;



/*CLV  Clear Overflow Flag

     0 -> V                           N Z C I D V
                                      - - - - - 0

     addressing    assembler    opc  bytes  cyles
     --------------------------------------------
     implied       CLV           B8    1     2 */

      case 0xB8: 
          overflowflag = 0;
        break;

/*CLD  Clear Decimal Mode

     0 -> D                           N Z C I D V
                                      - - - - 0 -

     addressing    assembler    opc  bytes  cyles
     --------------------------------------------
     implied       CLD           D8    1     2 */

       case 0xD8:
         decimalflag = 0;
       break;

/*SEC  Set Carry Flag

     1 -> C                           N Z C I D V
                                      - - 1 - - -

     addressing    assembler    opc  bytes  cyles
     --------------------------------------------
     implied       SEC           38    1     2 */

      case 0x38: 
          carryflag = 1;
        break;

/*SED  Set Decimal Flag

     1 -> D                           N Z C I D V
                                      - - - - 1 - 

     addressing    assembler    opc  bytes  cyles
     --------------------------------------------
     implied       SED           F8    1     2  */

      case 0xF8:
        decimalflag = 1;
      break;


/*TAX  Transfer Accumulator to Index X

     A -> X                           N Z C I D V
                                      + + - - - -

     addressing    assembler    opc  bytes  cyles
     --------------------------------------------
     implied       TAX           AA    1     2 */

      case 0xAA: 
          x = acc;
          zeroflag = (x == 0) ? 1 : 0;
          negativeflag = ((x & 0x80) != 0) ? 1 : 0;
        break;


/*TAY  Transfer Accumulator to Index Y

     A -> Y                           N Z C I D V
                                      + + - - - -

     addressing    assembler    opc  bytes  cyles
     --------------------------------------------
     implied       TAY           A8    1     2 */

      case 0xA8: 
          y = acc;
          zeroflag = (y == 0) ? 1 : 0;
          negativeflag = ((y & 0x80) != 0) ? 1 : 0;
        break;


/*TSX  Transfer Stack Pointer to Index X

     SP -> X                          N Z C I D V
                                      + + - - - -

     addressing    assembler    opc  bytes  cyles
     --------------------------------------------
     implied       TSX           BA    1     2 */

      case 0xBA: 
          x = sp;
          zeroflag = (x == 0) ? 1 : 0;
          negativeflag = ((x & 0x80) != 0) ? 1 : 0;
        break;



/*TXA  Transfer Index X to Accumulator

     X -> A                           N Z C I D V
                                      + + - - - -

     addressing    assembler    opc  bytes  cyles
     --------------------------------------------
     implied       TXA           8A    1     2 */

      case 0x8A: 
          acc = x;
          zeroflag = (acc == 0) ? 1 : 0;
          negativeflag = ((acc & 0x80) != 0) ? 1 : 0;
        break;


/*TXS  Transfer Index X to Stack Register

     X -> SP                          N Z C I D V
                                      + + - - - -

     addressing    assembler    opc  bytes  cyles
     --------------------------------------------
     implied       TXS           9A    1     2 */

      case 0x9A: 
          sp = x;
          //zeroflag = (sp == 0) ? 1 : 0;
          //negativeflag = ((sp & 0x80) != 0) ? 1 : 0;
        break;



/*TYA  Transfer Index Y to Accumulator

     Y -> A                           N Z C I D V
                                      + + - - - -

     addressing    assembler    opc  bytes  cyles
     --------------------------------------------
     implied       TYA           98    1     2 */

      case 0x98: 
          acc = y;
          zeroflag = (acc == 0) ? 1 : 0;
          negativeflag = ((acc & 0x80) != 0) ? 1 : 0;
        break;

/*BIT  Test Bits in Memory with Accumulator

     bits 7 and 6 of operand are transfered to bit 7 and 6 of SR (N,V);
     the zeroflag is set to the result of operand AND accumulator.

     A AND M, M7 -> N, M6 -> V        N Z C I D V
                                     M7 + - - - M6

     addressing    assembler    opc  bytes  cyles
     --------------------------------------------
     zeropage      BIT oper      24    2     3
     absolute      BIT oper      2C    3     4 */

      case 0x24: 
      case 0x2C: 
          var tempVal = localMem.readMem(effectiveAdrress);
          negativeflag = ((tempVal & 0x80) != 0) ? 1 : 0;
          overflowflag = ((tempVal & 0x40) != 0) ? 1 : 0;
          zeroflag = ((acc & tempVal) == 0) ? 1 : 0;
        break;


/*ASL  Shift Left One Bit (Memory or Accumulator)

     C <- [76543210] <- 0             N Z C I D V
                                      + + + - - -

     addressing    assembler    opc  bytes  cyles
     --------------------------------------------
     accumulator   ASL A         0A    1     2
     zeropage      ASL oper      06    2     5
     zeropage,X    ASL oper,X    16    2     6
     absolute      ASL oper      0E    3     6
     absolute,X    ASL oper,X    1E    3     7 */

      case 0x0A: 
          acc = acc << 1;
          carryflag = ((acc & 0x100) != 0) ? 1 : 0;
          acc = acc & 0xff;
          negativeflag = ((acc & 0x80) != 0) ? 1 : 0;
          zeroflag = (acc == 0) ? 1 : 0;
         break;
      case 0x06: 
      case 0x16: 
      case 0x0E: 
      case 0x1E: 
          var tempVal = localMem.readMem(effectiveAdrress);
          tempVal = tempVal << 1;
          carryflag = ((tempVal & 0x100) != 0) ? 1 : 0;
          tempVal = tempVal & 0xff;
          negativeflag = ((tempVal & 0x80) != 0) ? 1 : 0;
          zeroflag = (tempVal == 0) ? 1 : 0;
          localMem.writeMem(effectiveAdrress, tempVal);
        break;



/*LSR  Shift One Bit Right (Memory or Accumulator)

     0 -> [76543210] -> C             N Z C I D V
                                      - + + - - -

     addressing    assembler    opc  bytes  cyles
     --------------------------------------------
     accumulator   LSR A         4A    1     2
     zeropage      LSR oper      46    2     5
     zeropage,X    LSR oper,X    56    2     6
     absolute      LSR oper      4E    3     6
     absolute,X    LSR oper,X    5E    3     7 */

      case 0x4A: 
          carryflag = ((acc & 0x1) != 0) ? 1 : 0;
          acc = acc >> 1;
          acc = acc & 0xff;
          zeroflag = (acc == 0) ? 1 : 0;
          negativeflag = 0;
        break;
      case 0x46: 
      case 0x56: 
      case 0x4E: 
      case 0x5E: 
          var tempVal = localMem.readMem(effectiveAdrress);
          carryflag = ((tempVal & 0x1) != 0) ? 1 : 0;
          tempVal = tempVal >> 1;
          tempVal = tempVal & 0xff;
          zeroflag = (tempVal == 0) ? 1 : 0;
          localMem.writeMem(effectiveAdrress, tempVal);
          negativeflag = 0;
        break;


/*ROL  Rotate One Bit Left (Memory or Accumulator)

     C <- [76543210] <- C             N Z C I D V
                                      + + + - - -

     addressing    assembler    opc  bytes  cyles
     --------------------------------------------
     accumulator   ROL A         2A    1     2
     zeropage      ROL oper      26    2     5
     zeropage,X    ROL oper,X    36    2     6
     absolute      ROL oper      2E    3     6
     absolute,X    ROL oper,X    3E    3     7 */


      case 0x2A: 
          acc = acc << 1;
          acc = acc | carryflag;
          carryflag = ((acc & 0x100) != 0) ? 1 : 0;
          acc = acc & 0xff;
          zeroflag = (acc == 0) ? 1 : 0;
          negativeflag = ((acc & 0x80) != 0) ? 1 : 0;
      break;

      case 0x26: 
      case 0x36: 
      case 0x2E: 
      case 0x3E: 
          var tempVal = localMem.readMem(effectiveAdrress);
          tempVal = tempVal << 1;
          tempVal = tempVal | carryflag;
          carryflag = ((tempVal & 0x100) != 0) ? 1 : 0;
          tempVal = tempVal & 0xff;
          zeroflag = (tempVal == 0) ? 1 : 0;
          negativeflag = ((tempVal & 0x80) != 0) ? 1 : 0;
          localMem.writeMem(effectiveAdrress,tempVal);
      break;

/*ROR  Rotate One Bit Right (Memory or Accumulator)

     C -> [76543210] -> C             N Z C I D V
                                      + + + - - -

     addressing    assembler    opc  bytes  cyles
     --------------------------------------------
     accumulator   ROR A         6A    1     2
     zeropage      ROR oper      66    2     5
     zeropage,X    ROR oper,X    76    2     6
     absolute      ROR oper      6E    3     6
     absolute,X    ROR oper,X    7E    3     7 */

      case 0x6A: 
          acc = acc | (carryflag << 8);
          carryflag = ((acc & 0x1) != 0) ? 1 : 0;
          acc = acc >> 1;
          acc = acc & 0xff;
          zeroflag = (acc == 0) ? 1 : 0;
          negativeflag = ((acc & 0x80) != 0) ? 1 : 0;
      break;
      case 0x66: 
      case 0x76: 
      case 0x6E: 
      case 0x7E: 
          var tempVal = localMem.readMem(effectiveAdrress);
          tempVal = tempVal | (carryflag << 8);
          carryflag = ((tempVal & 0x1) != 0) ? 1 : 0;
          tempVal = tempVal >> 1;
          tempVal = tempVal & 0xff;
          zeroflag = (tempVal == 0) ? 1 : 0;
          negativeflag = ((tempVal & 0x80) != 0) ? 1 : 0;
          localMem.writeMem(effectiveAdrress, tempVal);
      break;

/*NOP  No Operation

     ---                              N Z C I D V
                                      - - - - - -

     addressing    assembler    opc  bytes  cyles
     --------------------------------------------
     implied       NOP           EA    1     2 */

     case 0xEA:
     break;

/*BRK  Force Break

     interrupt,                       N Z C I D V
     push PC+2, push SR               - - - 1 - -

     addressing    assembler    opc  bytes  cyles
     --------------------------------------------
     implied       BRK           00    1     7 */
       
      case 0x00:
        var tempVal = pc + 1;
        Push(tempVal >> 8);
        Push(tempVal & 0xff);
        Push(getStatusFlagsAsByte());
        interruptflag = 1;
        tempVal = localMem.readMem(0xffff) * 256;
        tempVal = tempVal + localMem.readMem(0xfffe);
        pc = tempVal;
      break;

/*RTI  Return from Interrupt

     pull SR, pull PC                 N Z C I D V
                                      from stack

     addressing    assembler    opc  bytes  cyles
     --------------------------------------------
     implied       RTI           40    1     6 */
      
      case 0x40: 
        setStatusFlagsAsByte(Pop());
        var tempVal = Pop();
        tempVal = (Pop() << 8) + tempVal;
        pc = tempVal;
      break;

/*CLI  Clear Interrupt Disable Bit

     0 -> I                           N Z C I D V
                                      - - - 0 - -

     addressing    assembler    opc  bytes  cyles
     --------------------------------------------
     implied       CLI           58    1     2 */

      case 0x58: 
        interruptflag = 0;        
      break;

/*SEI  Set Interrupt Disable Status

     1 -> I                           N Z C I D V
                                      - - - 1 - -

     addressing    assembler    opc  bytes  cyles
     --------------------------------------------
     implied       SEI           78    1     2 */

      case 0x78: 
        interruptflag = 1;                
      break;

      default: alert("Op code "+opcode+" not implemented. PC = "+pc.toString(16));
    }
  }
} 
