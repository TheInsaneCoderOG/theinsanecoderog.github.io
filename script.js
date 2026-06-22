const ui = document.getElementById("ui");
const buttonClose = document.getElementById("closeUI");
const buttonOpen = document.getElementById("openUI");
requestAnimationFrame(loop);

function closeUI() {
  ui.hidden = true;
  buttonClose.hidden = true;
  buttonOpen.hidden = false;
}

function openUI() {
  ui.hidden = false;
  buttonClose.hidden = false;
  buttonOpen.hidden = true;
}

function loop() {
  requestAnimationFrame(loop);
}
