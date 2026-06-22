const ui = document.getElementById("ui");
const buttonClose = document.getElementById("closeUI");
const buttonOpen = document.getElementById("openUI");
requestAnimationFrame(loop);

function closeUI() {
  console.log("Ran 'closeUI' function");
  ui.hidden;
  buttonClose.hidden;
  buttonOpen.hidden = false;
}

function openUI() {
  console.log("Ran 'openUI' function");
  ui.hidden = false;
  buttonClose.hidden = false;
  buttonOpen.hidden;
}

function loop() {
  requestAnimationFrame(loop);
}
