'use strict';

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var width = canvas.width = window.innerWidth;
var height = canvas.height = window.innerHeight;

var bubbles = [];

var mouseX, mouseY;

function random(min,max) {
    var num = Math.floor(Math.random()*(max-min)) + min;
    return num;
}

class Bubble {
    constructor(x, y, velX, velY, color, size, uid) {
        this.x = x;
        this.y = y;
        this.velX = velX;
        this.velY = velY;
        this.color = color;
        this.size = size;
        this.uid = uid;
    }
    draw() {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
    }
    update() {        
        if ((this.x + this.size) >= width || (this.x - this.size) <= 0) {
            this.velX = -(this.velX);
        }
        if ((this.y + this.size) >= height || (this.y - this.size) <= 0) {
            this.velY = -(this.velY);
        }
        this.x += this.velX;
        this.y += this.velY;
    }
    isTouched() {
        var touchedBubble = bubbles.findIndex(bubble => bubble.uid === this.uid);
        bubbles.splice(touchedBubble, 1);
        var audio = new Audio('pop.mp3');
        audio.play();
    }
}

document.addEventListener("mousemove", mouseOver, false);
function mouseOver(e) {
    var mouseX = e.x;
    var mouseY = e.y;

    for (var i = 0; i < bubbles.length; i++) {
        if (mouseX >= (bubbles[i].x - bubbles[i].size) && mouseX <= (bubbles[i].x + bubbles[i].size) &&
            mouseY >= (bubbles[i].y - bubbles[i].size) && mouseY <= (bubbles[i].y + bubbles[i].size)) {
            bubbles[i].isTouched();
        }
    }    
    
    return mouseX, mouseY;
}

function loop() {
    ctx.fillStyle = 'rgba(225, 225, 225, 0.25)';
    ctx.fillRect(0, 0, width, height);

    while (bubbles.length < 10) {
        var size = 80;//random(50,60);
        var bubble = new Bubble(
            random(0 + size, width - size),
            random(0 + size, height - size),
            random(-1,1),
            random(-1,1),
            'rgba(0, 200, 255, 0.25)',
            size,
            random(0,100000000000)
        );
        if (bubble.velX == 0 || bubble.velY == 0) {
            bubble.velX = 1;
            bubble.velY = 1;
        }
        bubbles.push(bubble);
    }

    for (var i = 0; i < bubbles.length; i++) {
        bubbles[i].draw();
        bubbles[i].update();
    }

    requestAnimationFrame(loop);
}

loop();