const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;
let particleArray = [];

//* MOUSE
const mouse = {
    x: null,
    y: null,
    radius: 100
}
window.addEventListener('mousemove', function(event){
    mouse.x = event.x;
    mouse.y = event.y;
    // console.log(mouse.x, mouse.y);
})

ctx.fillStyle = ('white');
ctx.font = ('50px Verdana');
ctx.fillText('TEXT ANIMATION', 50, 100);

const textCoordinates = ctx.getImageData(0, 0, canvas.width, canvas.height);

class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.floor(Math.random()*3+1);
        this.baseX = this.x;
        this.baseY = this.y;
        this.baseSize = this.size;
        this.density = this.size * 10;
    }
    draw(){
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI *2);
        ctx.closePath();
        ctx.fill();
    }
    update() {
        let distanceX = mouse.x - this.x;
        let distanceY = mouse.y - this.y;
        let distance = Math.sqrt( distanceX*distanceX + distanceY*distanceY );
        //let distance = Math.hypot( distanceX, distanceY );
        if (distance < mouse.radius) {
            this.size = this.baseSize * 5; 
        } else {
            this.size = this.baseSize;
        }

    }
}

function init() {
    particleArray = [];
    particleArraySize = 600;
    for(let i = 0; i < particleArraySize; i++) {
        positionX = Math.floor(Math.random() * canvas.width);
        positionY = Math.floor(Math.random() * canvas.height);
        particleArray.push(new Particle(positionX, positionY));
    }
}
init();
console.log(particleArray);

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for(let i = 0; i < particleArray.length; i++) {
       particleArray[i].draw();
       particleArray[i].update();
    }
    requestAnimationFrame(animate);
}
animate();