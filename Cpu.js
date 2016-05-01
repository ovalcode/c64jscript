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
  var pc = 0;
  var zeroflag = 0;
  var negativeflag = 0;
  var carryflag =0;
  var overflowflag =0; 

    function ADC(operand1, operand2) {
      temp = operand1 + operand2 + carryflag;
      carryflag = ((temp & 0x100) == 0x100) ? 1 : 0;
      overflowflag = (((operand1^temp) & (operand2^temp) & 0x80) == 0x80) ? 1 : 0;
      temp = temp & 0xff;
      return temp;
    }

   function SBC(operand1, operand2) {
      operand2 = ~operand2 & 0xff;
      operand2 = operand2 + (1 - carryflag);
      temp = operand1 + operand2;
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
    var result = "";
    result = result + "Acc:" + astr + " X:" + xstr + " Y:" + ystr + " PC:" + pcstr;
    result = result + " Z:" + zeroflag.toString();
    result = result + " N:" + negativeflag.toString();
    result = result + " C:" + carryflag.toString();
    result = result + " V:" + overflowflag.toString();
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

/*ADC  Add Memory to Accumulator with Carry

     A + M + C -> A, C                N Z C I D V
                                      + + + - - +

     addressing    assembler    opc  bytes  cyles
     --------------------------------------------
     immidiate     ADC #oper     69    2     2
     zeropage      ADC oper      65    2     3
     zeropage,X    ADC oper,X    75    2     4
     absolute      ADC oper      6D    3     4
     absolute,X    ADC oper,X    7D    3     4*
     absolute,Y    ADC oper,Y    79    3     4*
     (indirect,X)  ADC (oper,X)  61    2     6
     (indirect),Y  ADC (oper),Y  71    2     5* */

      case 0x69:
        acc = ADC (acc, arg1);
        zeroflag = (acc == 0) ? 1 : 0;
        negativeflag = ((acc & 0x80) != 0) ? 1 : 0;
      break;
      case 0x65:
      case 0x75:
      case 0x6D:
      case 0x7D:
      case 0x79:
      case 0x61:
      case 0x71:
        acc = ADC (acc, localMem.readMem(effectiveAdrress));
        zeroflag = (acc == 0) ? 1 : 0;
        negativeflag = ((acc & 0x80) != 0) ? 1 : 0;
      break;

/*SBC  Subtract Memory from Accumulator with Borrow

     A - M - C -> A                   N Z C I D V
                                      + + + - - +

     addressing    assembler    opc  bytes  cyles
     --------------------------------------------
     immidiate     SBC #oper     E9    2     2
     zeropage      SBC oper      E5    2     3
     zeropage,X    SBC oper,X    F5    2     4
     absolute      SBC oper      ED    3     4
     absolute,X    SBC oper,X    FD    3     4*
     absolute,Y    SBC oper,Y    F9    3     4*
     (indirect,X)  SBC (oper,X)  E1    2     6
     (indirect),Y  SBC (oper),Y  F1    2     5*  */

      case 0xE9:
        acc = SBC (acc, arg1);
        zeroflag = (acc == 0) ? 1 : 0;
        negativeflag = ((acc & 0x80) != 0) ? 1 : 0;
      break;
      case 0xE5:
      case 0xF5:
      case 0xED:
      case 0xFD:
      case 0xF9:
      case 0xE1:
      case 0xF1:
        acc = SBC (acc, localMem.readMem(effectiveAdrress));
        zeroflag = (acc == 0) ? 1 : 0;
        negativeflag = ((acc & 0x80) != 0) ? 1 : 0;
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
     immidiate     CMP #oper     C9    2     2
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
     immidiate     CPX #oper     E0    2     2
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
     immidiate     CPY #oper     C0    2     2
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



    }
  }
} 
