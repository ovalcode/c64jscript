function memory(allDownloadedCallback)

{
  var mainMem = new Uint8Array(65536);
  var basicRom = new Uint8Array(8192);
  var kernalRom = new Uint8Array(8192);
  var charRom = new Uint8Array(4192);
  var outstandingDownloads = 3;

  function downloadCompleted() {
    outstandingDownloads--;
    if (outstandingDownloads == 0)
      allDownloadedCallback();
  }

//------------------------------------------------------------------------

var oReqBasic = new XMLHttpRequest();
oReqBasic.open("GET", "basic.bin", true);
oReqBasic.responseType = "arraybuffer";

oReqBasic.onload = function (oEvent) {
  var arrayBuffer = oReqBasic.response; // Note: not oReq.responseText
  if (arrayBuffer) {
    basicRom = new Uint8Array(arrayBuffer);
    downloadCompleted();
  }
};

oReqBasic.send(null);

//------------------------------------------------------------------------

var oReqKernal = new XMLHttpRequest();
oReqKernal.open("GET", "kernal.bin", true);
oReqKernal.responseType = "arraybuffer";

oReqKernal.onload = function (oEvent) {
  var arrayBuffer = oReqKernal.response; // Note: not oReq.responseText
  if (arrayBuffer) {
    kernalRom = new Uint8Array(arrayBuffer);
    downloadCompleted();
  }
};

oReqKernal.send(null);

//------------------------------------------------------------------------

var oReqChar = new XMLHttpRequest();
oReqChar.open("GET", "characters.bin", true);
oReqChar.responseType = "arraybuffer";

oReqChar.onload = function (oEvent) {
  var arrayBuffer = oReqChar.response; // Note: not oReq.responseText
  if (arrayBuffer) {
    charRom = new Uint8Array(arrayBuffer);
    downloadCompleted();
  }
};

oReqChar.send(null);


//------------------------------------------------------------------------

  this.readCharRom = function (address) {
    return charRom[address];
  }

  this.readMem = function (address) {
    if ((address >= 0xa000) & (address <=0xbfff))
      return basicRom[address & 0x1fff];
    else if ((address >= 0xe000) & (address <=0xffff))
      return kernalRom[address & 0x1fff];
    return mainMem[address];
  }

  this.writeMem = function (address, byteval) {
    mainMem[address] = byteval;
  }

}


