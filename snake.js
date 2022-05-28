const stateRunning=1;
const boardWidth=50;
const boardHeight=50;
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
    snake:null,
    direction:{x:1,y:0},
    prey: {x:0,y:0},
    growing:0,
    runState:stateRunning
}
function randomXY(){
    return {
        x:Math.floor(Math.random()*boardWidth),
        y:Math.floor(Math.random()*boardHeight)
    }
};
function tick(){
    const head=state.snake[0];
    const dx=state.direction.x;
    const dy=state.direction.y;
    const heighestIndex=state.snake.length-1;
    let tail={};
    let interval=TICK;
    Object.assign(tail,state.snake[state.snake.length-1]);
    let didScore=(
        head.x===state.prey.x &&
        head.y===state.prey.y
    );
    if(state.runState=stateRunning){
        for(let idx=heighestIndex;idx>-1;idx--){
            const sq =state.snake[idx];
            if(idx===0){
                sq.x+=dx;
                sq.y+=dy;
            }else{
                sq.x=state.snake[idx-1].x;
                sq.y=state.snake[idx-1].y;
            }
        }
    }else if(state.runState===stateLosing){
        interval=10;
        if(state.snake.length>0){state.snake.splice(0,1)};
        if(state.snake.length===0){
            state.runState=stateLosing;
            state.snake.push(randomXY());
            state.prey=randomXY();
        }
    }
    if(detectCollision()){
        state.runState=stateLosing;
        state.growing=0;
    }
    if(didScore){
        state.growing+=growScale;
        state.prey=randomXY();
    }
    if(state.growing>0){
        state.snake.push(tail);
        state.growing--;
    }
    requestAnimationFrame(draw);
    setTimeout(tick,interval);
}
function detectCollision(){
    const head=state.snake[0];
    if(head.x<0||head.x>=boardWidth||head.y<0||head.y>=boardHeight){
        return true;
    }
    for(let idx=1;idx<state.snake.length;idx++){
        const sq=state.snake[idx];
        if(sq.x===head.x&&sq.y===head.y){
            return true;
        }
    }
    return false;
}
function drawPixel(color,x,y){
    state.ctx.fillStyle=color;
    state.ctx.fillRect(x*squareSize,y*squareSize,squareSize,squareSize);
}
function draw(){
    state.ctx.clearRect(0,0,state.canvas.width,state.canvas.height);
    for(let idx=0;idx<state.snake.length;idx++){
        const {x,y}=state.snake[idx];
        drawPixel('red',x,y);
    }
    const {x,y}=state.prey;
    drawPixel('yellow',x,y);
}
window.onload=function(){
    state.canvas=document.getElementById('games');
    state.ctx=state.canvas.getContext('2d');
    window.onkeydown=function(e){
        const direction = directionMap[e.key];
        if(direction){
            const [x,y]=direction;
            if(-x !==state.direction.x && -y !==state.direction.y){
                state.direction.x=x;
                state.direction.y=y;
            }
        }
    }
};