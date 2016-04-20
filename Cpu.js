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
"JSR", "AND", "", "", "BIT", "AND", "ROL", "", "PHP", "AND", "ROL", "", "BIT", "AND", "ROL", "", 
"BMI", "AND", "", "", "", "AND", "ROL", "", "SEC", "AND", "", "", "", "AND", "ROL", "", 
"RTI", "EOR", "", "", "", "EOR", "LSR", "", "PHA", "EOR", "LSR", "", "JMP", "EOR", "LSR", "", 
"BVC", "EOR", "", "", "", "EOR", "LSR", "", "CLI", "EOR", "", "", "", "EOR", "LSR", "", 
"RTS", "ADC", "", "", "", "ADC", "ROR", "", "PLA", "ADC", "ROR", "", "JMP", "ADC", "ROR", "", 
"BVC", "ADC", "", "", "", "ADC", "ROR", "", "SEI", "ADC", "", "", "", "ADC", "ROR", "", 
"", "STA", "", "", "STY", "STA", "STX", "", "DEC", "", "TXA", "", "STY", "STA", "STX", "", 
"BCC", "STA", "", "", "STY", "STA", "STX", "", "TYA", "STA", "TXS", "", "", "STA", "", "", 
"LDY", "LDA", "LDX", "", "LDY", "LDA", "LDX", "", "TAY", "LDA", "TAX", "", "LDY", "LDA", "LDX", "", 
"BCS", "LDA", "", "", "LDY", "LDA", "LDX", "", "CLV", "LDA", "TSX", "", "LDY", "LDA", "LDX", "", 
"CPY", "CMP", "", "", "CPY", "CMP", "DEC", "", "INY", "CMP", "DEC", "", "CPY", "CMP", "DEC", "", 
"BNE", "CMP", "", "", "", "CMP", "DEC", "", "CLD", "CMP", "", "", "", "CMP", "DEC", "", 
"CPX", "SBC", "", "", "CPX", "SBC", "INC", "", "INX", "SBC", "NOP", "", "CPX", "SBC", "INC", "", 
"BEQ", "SBC", "", "", "", "SBC", "INC", "", "SED", "SBC", "", "", "", "SBC", "INC", ""];

  var localMem = memory;
  var acc = 0;
  var x = 0;
  var y = 0;
  var pc = 0;
  var zeroflag = 0;
  var negativeflag = 0;

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
      break;

      case ADDRESS_MODE_INDIRECT:
        tempAddress = (argbyte2 * 256 + argbyte1);
        return (localMem.readMem(tempAddress + 1) * 256 + localMem.readMem(tempAddress));
      break;

      case ADDRESS_MODE_X_INDEXED_INDIRECT:
        addrStr = getAsFourDigit(argbyte2 * 256 + argbyte1);
        result = result + "($" + addrStr + ")";
        return result;      break;

      case ADDRESS_MODE_INDIRECT_Y_INDEXED:
        addrStr = getAsTwoDigit(argbyte1);
        result = result + "($" + addrStr + "),Y";
        return result;
      break;

      case ADDRESS_MODE_RELATIVE:
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
    var result = "";
    result = result + "Acc:" + astr + " X:" + xstr + " Y:" + ystr + " PC:" + pcstr;
    return result;
  }


  this.step = function () {
    var opcode = localMem.readMem(pc);
    pc = pc + 1;
    var iLen = instructionLengths[opcode];
    var arg1 = 0;
    var arg2 = 0;
    var effectiveAdrress = 0;
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
     immidiate     LDA #oper     A9    2     2
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
     immidiate     LDX #oper     A2    2     2
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
     immidiate     LDY #oper     A0    2     2
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

    }
  }
} 
