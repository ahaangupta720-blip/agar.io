const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let player = {
x: canvas.width/2,
y: canvas.height/2,
r: 20,
speed: 3
};

let mouse = {x:player.x,y:player.y};

document.addEventListener("mousemove",(e)=>{
mouse.x = e.clientX;
mouse.y = e.clientY;
});

let food = [];

for(let i=0;i<200;i++){
food.push({
x: Math.random()*canvas.width,
y: Math.random()*canvas.height,
r:5
});
}

let enemies = [];

for(let i=0;i<5;i++){
enemies.push({
x: Math.random()*canvas.width,
y: Math.random()*canvas.height,
r:20+Math.random()*20
});
}

function update(){

player.x += (mouse.x-player.x)*0.02;
player.y += (mouse.y-player.y)*0.02;

food.forEach((f,i)=>{

let dx = player.x - f.x;
let dy = player.y - f.y;

let dist = Math.sqrt(dx*dx + dy*dy);

if(dist < player.r){

player.r += 0.2;
food.splice(i,1);

}

});

enemies.forEach(e=>{

e.x += (Math.random()-0.5)*2;
e.y += (Math.random()-0.5)*2;

});

}

function draw(){

ctx.clearRect(0,0,canvas.width,canvas.height);

ctx.fillStyle="lime";

food.forEach(f=>{
ctx.beginPath();
ctx.arc(f.x,f.y,f.r,0,Math.PI*2);
ctx.fill();
});

ctx.fillStyle="red";

enemies.forEach(e=>{
ctx.beginPath();
ctx.arc(e.x,e.y,e.r,0,Math.PI*2);
ctx.fill();
});

ctx.fillStyle="cyan";

ctx.beginPath();
ctx.arc(player.x,player.y,player.r,0,Math.PI*2);
ctx.fill();

}

function gameLoop(){

update();
draw();

requestAnimationFrame(gameLoop);

}

gameLoop();