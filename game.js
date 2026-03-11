const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const WORLD_SIZE = 4000;

let camera = {x:0,y:0};

let mouse = {x:0,y:0};

document.addEventListener("mousemove",e=>{
mouse.x = e.clientX;
mouse.y = e.clientY;
});

let player = {
name:"You",
x:WORLD_SIZE/2,
y:WORLD_SIZE/2,
r:25,
speed:4,
color:"cyan"
};

let food = [];
let bots = [];

function spawnFood(n){

for(let i=0;i<n;i++){

food.push({
x:Math.random()*WORLD_SIZE,
y:Math.random()*WORLD_SIZE,
r:5,
color:"lime"
});

}

}

spawnFood(500);

function spawnBots(n){

for(let i=0;i<n;i++){

bots.push({
name:"Bot"+i,
x:Math.random()*WORLD_SIZE,
y:Math.random()*WORLD_SIZE,
r:20+Math.random()*20,
speed:1.5,
color:"red"
});

}

}

spawnBots(12);

function dist(a,b){

let dx=a.x-b.x;
let dy=a.y-b.y;

return Math.sqrt(dx*dx+dy*dy);

}

function update(){

// player movement
let dx = mouse.x - canvas.width/2;
let dy = mouse.y - canvas.height/2;

player.x += dx*0.01*player.speed;
player.y += dy*0.01*player.speed;

// world bounds
player.x = Math.max(0,Math.min(WORLD_SIZE,player.x));
player.y = Math.max(0,Math.min(WORLD_SIZE,player.y));

// camera follow
camera.x = player.x - canvas.width/2;
camera.y = player.y - canvas.height/2;

// player eats food
food.forEach((f,i)=>{

if(dist(player,f) < player.r){

player.r += 0.4;
food.splice(i,1);

}

});

// bot AI
bots.forEach(b=>{

let target = null;
let bestDist = Infinity;

// chase food
food.forEach(f=>{

let d = dist(b,f);

if(d < bestDist){

bestDist = d;
target = f;

}

});

// avoid bigger players
if(player.r > b.r*1.2){

let dx = b.x-player.x;
let dy = b.y-player.y;

let d = Math.sqrt(dx*dx+dy*dy);

if(d < 300){

b.x += (dx/d)*b.speed*3;
b.y += (dy/d)*b.speed*3;

return;

}

}

// move toward target food
if(target){

let dx = target.x-b.x;
let dy = target.y-b.y;

let d = Math.sqrt(dx*dx+dy*dy);

b.x += (dx/d)*b.speed;
b.y += (dy/d)*b.speed;

}

// bot eats food
food.forEach((f,i)=>{

if(dist(b,f) < b.r){

b.r += 0.2;
food.splice(i,1);

}

});

});

// player eats bots
bots.forEach((b,i)=>{

if(player.r > b.r*1.1 && dist(player,b) < player.r){

player.r += b.r*0.2;

bots.splice(i,1);

spawnBots(1);

}

});

// bots eat player
bots.forEach(b=>{

if(b.r > player.r*1.1 && dist(player,b) < b.r){

alert("Game Over");

location.reload();

}

});

// keep food count stable
if(food.length < 400){

spawnFood(100);

}

}

function drawWorld(){

ctx.strokeStyle="#222";

for(let x=0;x<WORLD_SIZE;x+=100){

ctx.beginPath();
ctx.moveTo(x-camera.x,0-camera.y);
ctx.lineTo(x-camera.x,WORLD_SIZE-camera.y);
ctx.stroke();

}

for(let y=0;y<WORLD_SIZE;y+=100){

ctx.beginPath();
ctx.moveTo(0-camera.x,y-camera.y);
ctx.lineTo(WORLD_SIZE-camera.x,y-camera.y);
ctx.stroke();

}

}

function drawCircle(obj){

ctx.fillStyle=obj.color;

ctx.beginPath();
ctx.arc(obj.x-camera.x,obj.y-camera.y,obj.r,0,Math.PI*2);
ctx.fill();

ctx.fillStyle="white";
ctx.font="12px Arial";
ctx.textAlign="center";

ctx.fillText(obj.name,obj.x-camera.x,obj.y-camera.y);

}

function draw(){

ctx.clearRect(0,0,canvas.width,canvas.height);

drawWorld();

food.forEach(f=>drawCircle(f));

bots.forEach(b=>drawCircle(b));

drawCircle(player);

drawLeaderboard();

}

function drawLeaderboard(){

let list = [player,...bots];

list.sort((a,b)=>b.r-a.r);

ctx.fillStyle="white";
ctx.font="16px Arial";

ctx.fillText("Leaderboard",canvas.width-140,40);

for(let i=0;i<5;i++){

if(list[i]){

ctx.fillText(
(i+1)+". "+list[i].name,
canvas.width-140,
70+i*20
);

}

}

}

function gameLoop(){

update();
draw();

requestAnimationFrame(gameLoop);

}

gameLoop();

function generateSave(){

const data = {
x:player.x,
y:player.y,
r:player.r
};

return btoa(JSON.stringify(data));

}

function loadSave(code){

try{

let data = JSON.parse(atob(code));

player.x=data.x;
player.y=data.y;
player.r=data.r;

}catch{

alert("Invalid save");

}

}