function keyboard() {
  this.onkeydown = function(event) {
    alert("hallo "+event.keyCode);
  }

  this.onkeyup = function(event) {
    alert("cheers "+event.keyCode);
  }

}
