const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;
let particleArray = [];
let adjustX = 0;
let adjustY = -100;

function onWindowResize() {
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
}
window.addEventListener('resize', onWindowResize, false);

//* MOUSE
const mouse = {
    x: null,
    y: null,
    radius: 100,
}
window.addEventListener('mousemove', function(event){
    mouse.x = event.x;
    mouse.y = event.y;
    // console.log(mouse.x, mouse.y);
});

ctx.fillStyle = 'white';
ctx.font = '30px Squada One';
ctx.fillText('JS', 10, 30);

const textCoordinates = ctx.getImageData(0, 0, canvas.width, canvas.height);
// console.log(textCoordinates);

class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.floor(Math.random()*1+4);
        //* We save the original x and y coordinates, so that each particle can return to its original position
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
        // let distance = Math.sqrt( distanceX*distanceX + distanceY*distanceY );
        let distance = Math.hypot( distanceX, distanceY );
        //let relativeForce = (mouse.radius - distance) / mouse.radius;
        // let forceDirectionX = distanceX * this.density * relativeForce;
        let forceDirectionX = distanceX / distance;
        let forceDirectionY = distanceY / distance;
        let maxDistance = mouse.radius;
        //* force is a number between 0 and 1. Particle with distance 0 from the mouse have max-force
        let force = (maxDistance - distance) / maxDistance;
        let directionX = force * forceDirectionX * this.density;
        let directionY = force * forceDirectionY * this.density;
        if (distance < mouse.radius) {
            // this.size = this.baseSize * 5;
            
            //* PUSH IN
            // this.x += directionX;
            // this.y += directionY;
        
            //* PUSH AWAY
            this.x -= directionX;
            this.y -= directionY;
        
        } else if (distance > mouse.radius) {
            // this.size = this.baseSize;
            if (this.x !== this.baseX) {
                let dx = this.x - this.baseX;
                this.x -= dx/20;
                // let dx = this.baseX - this.x;
                // this.x += dx/20;
            }
            if (this.y !== this.baseY) {
                let dy = this.y - this.baseY;
                this.y -= dy/20;
            }
        }

    }
}

function init() {
    particleArray = [];

    //* Random particles
    /* let particleArraySize = 600;
    for(let i = 0; i < particleArraySize; i++) {
        positionX = Math.floor(Math.random() * canvas.width);
        positionY = Math.floor(Math.random() * canvas.height);
        particleArray.push(new Particle(positionX, positionY));
    } */

    for (let y = 0; y < textCoordinates.height; y++) {
        for (let x = 0; x < textCoordinates.width; x++) {
            if (textCoordinates.data[(y * 4 * textCoordinates.width) + (x * 4) + 3] > 128){
                let positionX = (x * 20) + adjustX;
                let positionY = (y * 20) + adjustY;
                // console.log(positionX, positionY);
                particleArray.push(new Particle(positionX, positionY));
            }
        }
    }
}
init();
// console.log(particleArray);

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for(let i = 0; i < particleArray.length; i++) {
        particleArray[i].draw();
        particleArray[i].update();
    }
    connect();
    requestAnimationFrame(animate);
}
animate();

//* We create lines to connect particles that are close enough
function connect() {
    let opacity = 1;
    for (let p1 = 0; p1 < particleArray.length - 1; p1++) {
        for (let p2 = p1+1; p2 < particleArray.length; p2++) {
            let dx = particleArray[p1].x - particleArray[p2].x;
            let dy = particleArray[p1].y - particleArray[p2].y;
            let distance = Math.hypot(dx, dy);
            if (distance < 30) {
                let opacity = 1 - (distance/60);
                ctx.strokeStyle = 'rgb(255,255,255,' + opacity + ')';
                ctx.lineWidth = 1;
                // ctx.lineWidth = 2*(1-(distance/20));
                //* Lines, like arcs, are considered path, so to start drawing we have to call beginPath
                ctx.beginPath();
                //* To set starting x and y coordinates
                ctx.moveTo(particleArray[p1].x, particleArray[p1].y);
                //* To set target x and y coordinates
                ctx.lineTo(particleArray[p2].x, particleArray[p2].y);
                ctx.stroke();
                //* Start and End of path in canvas are defined by beginPath and closePath methods call
            }
        }
    }
}