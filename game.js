const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const WORLD_SIZE = 4000;
const LEVEL_GOAL = 700;
const START_SIZE = 25;

let camera = {x:0,y:0};
let mouse = {x:0,y:0};

document.addEventListener("mousemove",(e)=>{
mouse.x = e.clientX;
mouse.y = e.clientY;
});

let player = {
name:"You",
x:WORLD_SIZE/2,
y:WORLD_SIZE/2,
r:START_SIZE,
color:"cyan"
};

let difficultyLevel = 1;
let foodCounter = 0;
let foodNeeded = 1;

let levelUpTimer = 0;
let levelUpText = "";

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

spawnBots(10);

function dist(a,b){
let dx=a.x-b.x;
let dy=a.y-b.y;
return Math.sqrt(dx*dx+dy*dy);
}

function levelUp(){

difficultyLevel++;

foodNeeded = Math.pow(2,difficultyLevel-1);

levelUpTimer = 120;
levelUpText = "LEVEL " + difficultyLevel;

// reset size
player.r = START_SIZE;

foodCounter = 0;

}

function update(){

// LEVEL CHECK
if(player.r >= LEVEL_GOAL){
levelUp();
}

let dx = mouse.x - canvas.width/2;
let dy = mouse.y - canvas.height/2;

player.x += dx*0.01;
player.y += dy*0.01;

player.x = Math.max(0,Math.min(WORLD_SIZE,player.x));
player.y = Math.max(0,Math.min(WORLD_SIZE,player.y));

camera.x = player.x - canvas.width/2;
camera.y = player.y - canvas.height/2;

food.forEach((f,i)=>{

if(dist(player,f) < player.r){

foodCounter++;

if(foodCounter >= foodNeeded){
player.r += 1;
foodCounter = 0;
}

food.splice(i,1);

}

});

bots.forEach(b=>{

let target = null;
let bestDist = Infinity;

food.forEach(f=>{
let d = dist(b,f);
if(d < bestDist){
bestDist = d;
target = f;
}
});

if(target){

let dx = target.x - b.x;
let dy = target.y - b.y;
let d = Math.sqrt(dx*dx+dy*dy);

b.x += (dx/d)*b.speed;
b.y += (dy/d)*b.speed;

}

food.forEach((f,i)=>{
if(dist(b,f) < b.r){
b.r += 0.2;
food.splice(i,1);
}
});

});

bots.forEach((b,i)=>{

if(player.r > b.r*1.1 && dist(player,b) < player.r){

player.r += b.r*0.3;

bots.splice(i,1);
spawnBots(1);

}

});

bots.forEach(b=>{

if(b.r > player.r*1.1 && dist(player,b) < b.r){

alert("Game Over");
location.reload();

}

});

if(food.length < 400){
spawnFood(100);
}

}

function drawGrid(){

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

if(obj.name){

ctx.fillStyle="white";
ctx.textAlign="center";
ctx.font="12px Arial";

ctx.fillText(obj.name,obj.x-camera.x,obj.y-camera.y);

}

}

function drawLeaderboard(){

let list=[player,...bots];

list.sort((a,b)=>b.r-a.r);

ctx.fillStyle="white";
ctx.font="16px Arial";

ctx.fillText("Leaderboard",canvas.width-170,40);

for(let i=0;i<5;i++){

if(list[i]){

let size = Math.round(list[i].r);

ctx.fillText(
(i+1)+". "+list[i].name+" ("+size+")",
canvas.width-170,
70+i*20
);

}

}

}

function drawDifficulty(){

ctx.fillStyle="white";
ctx.font="18px Arial";

ctx.fillText(
"Level: "+difficultyLevel+
" | Goal: "+LEVEL_GOAL+
" | Food/Size: "+foodNeeded,
20,
30
);

}

function drawMinimap(){

let size = 150;

let x = canvas.width - size - 20;
let y = canvas.height - size - 20;

ctx.fillStyle="#000";
ctx.fillRect(x,y,size,size);

ctx.strokeStyle="white";
ctx.strokeRect(x,y,size,size);

let scale = size / WORLD_SIZE;

ctx.fillStyle="cyan";
ctx.beginPath();
ctx.arc(
x + player.x*scale,
y + player.y*scale,
4,
0,
Math.PI*2
);
ctx.fill();

ctx.fillStyle="red";
bots.forEach(b=>{
ctx.beginPath();
ctx.arc(
x + b.x*scale,
y + b.y*scale,
3,
0,
Math.PI*2
);
ctx.fill();
});

}

function drawLevelUp(){

if(levelUpTimer > 0){

ctx.fillStyle="rgba(0,0,0,0.5)";
ctx.fillRect(0,0,canvas.width,canvas.height);

ctx.fillStyle="yellow";
ctx.textAlign="center";
ctx.font="60px Arial";

ctx.fillText(
"LEVEL UP!",
canvas.width/2,
canvas.height/2-40
);

ctx.font="40px Arial";

ctx.fillText(
levelUpText,
canvas.width/2,
canvas.height/2+20
);

levelUpTimer--;

}

}

function draw(){

ctx.clearRect(0,0,canvas.width,canvas.height);

drawGrid();

food.forEach(f=>drawCircle(f));
bots.forEach(b=>drawCircle(b));
drawCircle(player);

drawLeaderboard();
drawMinimap();
drawDifficulty();
drawLevelUp();

}

function gameLoop(){
update();
draw();
requestAnimationFrame(gameLoop);
}

gameLoop();

function generateSave(){

const data={
x:player.x,
y:player.y,
level:difficultyLevel
};

return btoa(JSON.stringify(data));

}

function loadSave(code){

try{

let data=JSON.parse(atob(code));

player.x=data.x;
player.y=data.y;

difficultyLevel=data.level || 1;

foodNeeded = Math.pow(2,difficultyLevel-1);

player.r = START_SIZE;

}catch{

alert("Invalid save");

}

}

function saveGame(){
document.getElementById("saveBox").value = generateSave();
}

function loadGame(){
loadSave(document.getElementById("saveBox").value);
}