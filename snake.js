const stateRunning=1;
const stateLosing=2;
const TICK=80;
const squareSize=20;
const growScale=10;
const directionMap={
    'A':[-1,0],
    'D':[1,0],
    'W':[0,-1],
    'S':[0,1],
    'a':[-1,0],
    'd':[1,0],
    'w':[0,-1],
    's':[0,1]
}
let state={
    canvas:null,
    context:null,
    snake:[{x:0,y:0}],
    direction:{x:1,y:0},
    prey: {x:0,y:0},
    growing:0,
    runState:stateRunning
}
function randomXY(){
    return {
        x:parseInt(Math.floor(Math.random()*state.canvas.width)),
        y:parseInt(Math.floor(Math.random()*state.canvas.height))
    }
}
function ticking(){
    const head=state.snake[0];
    const dx=state.direction.x;
    const dy=state.direction.y;
    const heighestIndex=state.snake.length-1;
    let tail={};
    let interval=TICK;
    Object.assign(tail,state.snake[state.snake.length-1]);
    let didScore=(
        head.x==state.prey.x &&
        head.y==state.prey.y
    );
    if(state.runState===stateRunning){
        for(let idx=heighestIndex;idx>-1;idx--){
            const sq=state.snake[idx];
            if(idx===0){
                sq.x+=dx;
                sq.y+=dy;
            }else{
                // Object.assign(sq,tail);
                // sq.x=tail.x;
                // sq.y=tail.y;
                sq.x=state.snake[idx-1].x;
                sq.y=state.snake[idx-1].y;
            }
        }
    }
    if(didScore){
        state.growing+=growScale;
        state.prey=randomXY();
    }
    requestAnimationFrame(draw);
    setTimeout(ticking,interval);
}
function detectCollision(){
    const head=state.snake[0];
    if(
        head.x<0 ||
        head.x>=state.canvas.width ||
        head.y<0 ||
        head.y>=state.canvas.height
    ){
        return true;
    }
    for(let idx=1;idx<state.snake.length;idx++){
        const sq=state.snake[idx];
        if(
            sq.x==head.x &&
            sq.y==head.y
        ){
            return true;
        }
    };
    return false;
}
function drawPixel(color,x,y){
    state.context.fillStyle=color;
    state.context.fillRect(50*x,50*y,50,50);
    state.context.fill();
}
function draw(){
    state.context.clearRect(0,0,state.canvas.width,state.canvas.height);
    for(let idx=0;idx<state.snake.length;idx++){
        const {x,y}=state.snake[idx];
        drawPixel('red',x,y);
    }
    const {x,y}=state.prey;
    drawPixel('yellow',x/100,y/100);
}
window.onload=function(){
    state.canvas=document.getElementById('games');
    state.context=state.canvas.getContext('2d');
    state.canvas.width=window.innerWidth;
    state.canvas.height=window.innerHeight;
    window.onkeydown=function(e){
        const direction=directionMap[e.key];
        const [x,y]=direction;
        if(direction){
            const [x,y]=direction;
            if(
                x!=state.direction.x ||
                y!=state.direction.y
            ){
                state.direction.x=x;
                state.direction.y=y;
            }
        }
    }
    ticking();
}