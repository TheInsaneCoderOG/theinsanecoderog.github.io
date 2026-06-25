const canvas = document.getElementById('stage');
const canvasBoundRect = canvas.getBoundingClientRect();
const ctx = canvas.getContext('2d');
const totalBlobs = 5;
const blobsArray = [];
const cellSize = 80;
let spatialGrid = {};
let mouseX = 0;
let mouseY = 0;
let gravity = 0;
let simDensity = 0;

canvas.addEventListener('mousemove',function(event) {
  mouseX = event.pageX-(canvasBoundRect.left+window.scrollX);
  mouseY = event.pageY-(canvasBoundRect.top+window.scrollY);
})

class Blob {
  constructor(canvasWidth,canvasHeight) {
    this.id = Blob.nextId++;
    this.size = 20;
    this.x = Math.random()*(canvasWidth-this.size);
    this.y = Math.random()*(canvasHeight-this.size);
    this.cx = Math.floor(blob.x/cellSize);
    this.cy = Math.floor(blob.y/cellSize);
    this.speedX = (Math.random()-0.5)*4; 
    this.speedY = (Math.random()-0.5)*4;
    this.speedXi = 0;
    this.speedYi = 0;
    this.color = `hsl(${Math.random()*360},80%,60%)`;
    this.ela = 1;
    this.density = Math.random()*5+10;
    this.area = Math.PI*Math.pow(this.size,2);
    this.mass = this.area*this.density;
    this.termVel = 50;
  }
  
  updateSpeed(canvasWidth,canvasHeight) {
    this.speedY += gravity;
    let neighbors = getNeighbors(this);
    for (let other of neighbors) {
      if (other === this) continue;
      if (this.id >= other.id) continue;
      
      let dx = other.x-this.x;
      let dy = other.y-this.y;
      let distSq = dx*dx+dy*dy;
      let minDist = this.size+other.size;
      if (distSq > 0.0001 && distSq-minDist*minDist <= 0) {
        let dist = Math.sqrt(distSq);
        let nx = dx/dist;
        let ny = dy/dist;
        this.speedXi = (this.speedX*nx)+(this.speedY*ny);
        other.speedXi = (other.speedX*nx)+(other.speedY*ny);
        let ela = (this.ela+other.ela)/2;
        if (distSq-minDist*minDist < 0) {
          let overlap = minDist-dist;
          let totalMass = this.mass+other.mass;
          this.x -= nx*overlap*(other.mass/totalMass);
          this.y -= ny*overlap*(other.mass/totalMass);
          other.x += nx*overlap*(this.mass/totalMass);
          other.y += ny*overlap*(this.mass/totalMass);
        }
        let tspeedF = ((this.mass-ela*other.mass)*this.speedXi+other.mass*(1+ela)*other.speedXi)/(this.mass+other.mass);
        let ospeedF = (this.mass*(1+ela)*this.speedXi+(other.mass-ela*this.mass)*other.speedXi)/(this.mass+other.mass);
        let tdeltaV = tspeedF-this.speedXi;
        let odeltaV = ospeedF-other.speedXi;
        this.speedX += tdeltaV*nx;
        this.speedY += tdeltaV*ny;
        other.speedX += odeltaV*nx;
        other.speedY += odeltaV*ny;
      }
    }
    if (this.x <= this.size || this.x+this.size >= canvasWidth) {
      this.x = Math.abs(this.x) < this.size ? this.size : canvasWidth-this.size;
      this.speedX *= -1*this.ela;
    }
    if (this.y <= this.size || this.y+this.size >= canvasHeight) {
      this.y = Math.abs(this.y) < this.size ? this.size : canvasHeight-this.size;
      this.speedY *= -1*this.ela;
    }
    if (Math.abs(this.speedX) > this.termVel) {
      this.speedX = this.speedX > this.termVel ? this.termVel : -this.termVel;
    }
    if (Math.abs(this.speedY) > this.termVel) {
      this.speedY = this.speedY > this.termVel ? this.termVel : -this.termVel;
    }
  }
  
  updatePos(canvasWidth,canvasHeight) {
    this.x += this.speedX;
    this.y += this.speedY;
    this.cx = Math.floor(blob.x/cellSize);
    this.cy = Math.floor(blob.y/cellSize);
  }
  
  draw(context) {
    context.fillStyle = this.color;
    context.beginPath();
    context.arc(this.x,this.y,this.size,0,2*Math.PI);
    context.fill();
    context.closePath();
  }
}

Blob.nextId = 0;

function insertBlob(blob) {
  let key = blob.cx+','+blob.cy;
  if (!spatialGrid[key]) spatialGrid[key] = [];
  spatialGrid[key].push(blob);
}

function getNeighbors(blob) {
  let result = [];
  for (let x = blob.cx-1; x <= blob.cx+1; x++) {
    for (let y = blob.cy-1; y <= blob.cy+1; y++) {
      let key = x+','+y;
      if (spatialGrid[key]) result.push(...spatialGrid[key]);
    }
  }
  return result;
}

function init() {
  for (let i = 0; i < totalBlobs; i++) {
    blobsArray.push(new Blob(canvas.width,canvas.height));
  }
}

function animate() {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle = "red";
  ctx.beginPath();
  ctx.arc(mouseX,mouseY,10,0,2*Math.PI);
  ctx.fill();
  ctx.closePath();
  spatialGrid = {};
  for (let i = 0; i < blobsArray.length; i++) {
    insertBlob(blobsArray[i]);
  }
  for (let i = 0; i < blobsArray.length; i++) {
    blobsArray[i].updateSpeed(canvas.width,canvas.height);
    blobsArray[i].updatePos(canvas.width,canvas.height);
    blobsArray[i].draw(ctx);
  }
  requestAnimationFrame(animate);
}

init();
animate();
