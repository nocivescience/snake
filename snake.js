const gamesEl=document.getElementById('games');
const ctx=gamesEl.getContext('2d');
const stateRunning=1;
const stateLosing=2;
const statePausing=3;
const squareSize=40;
const state={
    snake:[{x:0,y:0}],
    direction:{x:1,y:0},
    prey:{x:0,y:0},
    growing:0,
    runState:stateRunning,
}
gamesEl.width=window.innerWidth;
gamesEl.height=window.innerHeight;
function randomXY(){
    return {
        x:Math.floor(Math.random()*gamesEl.width/squareSize),
        y:Math.floor(Math.random()*gamesEl.height/squareSize)
    }
}
function randomColor(){
    return `rgb(${Math.floor(Math.random()*255)},${Math.floor(Math.random()*255)},${Math.floor(Math.random()*255)},${Math.random()})`;
}
function tick(){;
    const head=state.snake[0];
    const dx=state.direction.x;
    const dy=state.direction.y;
    const highestIndex=state.snake.length-1;
    let tail={};
    let interval=80;
    Object.assign(tail,state.snake[highestIndex-1]);
    let didScore=head.x===state.prey.x&&head.y===state.prey.y;
    if(state.runState===stateRunning){
        for(let i=highestIndex;i>-1;i--){
            const current=state.snake[i];
            if(i===0){
                current.x+=dx;
                current.y+=dy;
            }else{
                current.x=state.snake[i-1].x;
                current.y=state.snake[i-1].y;
            }
        }
    }else if(state.runState===stateLosing){
        interval=1000;
        if(state.snake.length>0){
            state.snake.splice(0,1);
        }
        if(state.snake.length===0){
            state.runState=stateRunning;
            state.snake.push(randomXY());
        }
    }
    if(didScore){
        state.growing+=10;
        state.prey=randomXY();
    }
    if(state.growing>0){
        state.growing--;
        state.snake.push(tail);
    }
    if(detecColision()){
        state.runState=stateLosing;
        state.growing=0;
    };
    requestAnimationFrame(drawSnake);
    setTimeout(tick,500);
}
function detecColision(){
    const head=state.snake[0];
    if(
        head.x<0||
        head.x>=gamesEl.width/squareSize||
        head.y<0||
        head.y>=gamesEl.height/squareSize
    ){
        return true;
    }
    for(let i=1;i<state.snake.length;i++){
        const current=state.snake[i];
        if(head.x===current.x&&head.y===current.y){
            return true;
        }
    }
}
function drawPixel(x,y,color){
    ctx.fillStyle=color;
    ctx.strokeStyle='black';
    ctx.fillRect(squareSize*x,squareSize*y,squareSize,squareSize);
    ctx.strokeRect(squareSize*x,squareSize*y,squareSize,squareSize);
}
function drawSnake(){
    ctx.clearRect(0,0,gamesEl.width,gamesEl.height);
    for(let i=0;i<state.snake.length;i++){
        const {x,y}=state.snake[i];
        drawPixel(x,y,`${i%3===0?'grey':'red'}`);
    }
    drawPixel(state.prey.x,state.prey.y,'green');
}
document.addEventListener('keydown',(e)=>{
    switch(e.key){
        case 'a':
            state.direction.x=-1;
            state.direction.y=0;
            break;
        case 'd':
            state.direction.x=1;
            state.direction.y=0;
            break;
        case 'w':
            state.direction.x=0;
            state.direction.y=-1;
            break;
        case 's':
            state.direction.x=0;
            state.direction.y=1;
            break;
    }
});
tick();