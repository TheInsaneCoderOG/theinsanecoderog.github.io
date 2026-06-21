const ui = document.getElementById("ui")
const buttonClose = document.getElementById("closeUI")
const buttonOpen = document.getElementById("openUI")
requestAnimationFrame(loop)

function closeUI() {
  ui.hidden
  buttonClose.hidden
  buttonOpen.hidden = false
}

function openUI() {
  ui.hidden = false
  buttonClose.hidden = false
  buttonOpen.hidden
}

function loop() {
  requestAnimationFrame(loop)
}
