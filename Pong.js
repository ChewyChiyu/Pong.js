


class GameObject{
	constructor(x,y,w,h,dx,dy){
		this.x = x
		this.y = y
		this.w = w;
		this.h = h;
		this.dx = dx
		this.dy = dy

		this.canContact = true

	}

	verbose(arg){
		console.log(arg)
	}

	move(){
		this.x+=this.dx
		this.y+=this.dy
	}

	isOverlapping(x,y,w,h) {
		
		var rect1 = {x: this.x, y: this.y, width: this.w, height: this.h}
		var rect2 = {x: x, y: y, width: w, height: h}

		if (rect1.x < rect2.x + rect2.width &&
			rect1.x + rect1.width > rect2.x &&
			rect1.y < rect2.y + rect2.height &&
			rect1.height + rect1.y > rect2.y) {
			return true
		}

		return false
		
	}

	

}
class Paddle extends GameObject{
	constructor(x,y,w,h,dy,dx){
		super(x,y,w,h,dy,dx)

		this.speed = 4
	}

}

class Ball extends GameObject{
	constructor(x,y,w,h,dx,dy){
		super(x,y,w,h,dx,dy)
		this.respawnX = x
		this.respawnY = y
		this.respawnDY = dy
	}

	respawn(){
		this.x = this.respawnX
		this.y = this.respawnY

		//giving ball to loser
		this.dy = this.respawnDY
		this.dx *= -1
	}
}


//global vars
const canvas = document.getElementById("Pong")
const context = canvas.getContext("2d")
const MAX_FPS = 50;
//GAME VARS
var paddleLeft 
var paddleRight
var ball
var scoreL
var scoreR

//keys
window.addEventListener("keydown", function (event) {
	if (event.defaultPrevented) {
    //return; 
}
switch(event.key){
	case "w":
	paddleLeft.dy = -paddleLeft.speed
	break;
	case "s":
	paddleLeft.dy = paddleLeft.speed
	break;
	case "o":
	paddleRight.dy = -paddleLeft.speed
	break;
	case "l":
	paddleRight.dy = paddleLeft.speed
	break;
	default:
	break;
}


event.preventDefault();
}, true);

window.addEventListener("keyup", function (event) {
	if (event.defaultPrevented) {
    //return; 
}
switch(event.key){
	case "w":
	paddleLeft.dy = 0
	break;
	case "s":
	paddleLeft.dy = 0
	break;
	case "o":
	paddleRight.dy = 0
	break;
	case "l":
	paddleRight.dy = 0
	break;
	default:
	break;
}

event.preventDefault();
}, true);


function run(){ //game loop with MAX_FPS limiter
	update()
	draw()
}

function update(){
	//checking paddle bounds
	if((paddleLeft.y < 0 && paddleLeft.dy < 0 ) || ((paddleLeft.y + canvas.height*.2) > canvas.height && paddleLeft.dy > 0)){
		paddleLeft.dy = 0;
	}
	if((paddleRight.y < 0 && paddleRight.dy < 0 ) || ((paddleRight.y + canvas.height*.2) > canvas.height && paddleRight.dy > 0)){
		paddleRight.dy = 0;
	}

	//physics of ball
	if(ball.y < 0 || ball.y > canvas.height){ //walls
		ball.dy *= -1
	}

	if(paddleLeft.isOverlapping(ball.x ,ball.y , ball.w, ball.h) || paddleRight.isOverlapping(ball.x ,ball.y, ball.w, ball.h)){
		ball.dx *= -1
	}

	//check for winner
	if(ball.x < 0){ //paddleRight score
		scoreR++
		ball.respawn()
	}

	if(ball.x > canvas.width){ //paddleLeft score
		scoreL++
		ball.respawn()
	}


	//check for game over
	if(scoreL > 11 || scoreR > 11){
		loadNewGame()
	}


	// //moving paddles
	paddleLeft.move()
	paddleRight.move()
	ball.move()

}

function draw(){
	//redrawing
	context.fillStyle="#000000";
	//coloring backgrounds
	context.fillRect(0,0,canvas.width,canvas.height)
	//drawing paddles and balls
	context.fillStyle="#FFFFFF";
	context.fillRect(paddleLeft.x,paddleLeft.y,paddleLeft.w,paddleLeft.h)
	context.fillRect(paddleRight.x,paddleRight.y,paddleRight.w,paddleRight.h)
	//drawing ball
	context.beginPath();
	context.arc(ball.x, ball.y, ball.w, 0, 2 * Math.PI);
	context.fill();
	//drawing score
	context.font = "26px Comic Sans MS";
	context.fillText(scoreL + "           " + scoreR,canvas.width*.43,canvas.height*.1);	
}

//loading vars for new game
function loadNewGame(){
	paddleLeft = new Paddle(canvas.width * .05, canvas.height /2 - canvas.height*.2/2,canvas.width*.015,canvas.height*.2, 0,0)
	paddleRight = new Paddle(canvas.width * .95, canvas.height /2 - canvas.height*.2/2,canvas.width*.015, canvas.height*.2, 0,0)
	ball = new Ball(canvas.width/2,canvas.height/2,(canvas.height *.02),(canvas.height*.02),-6,6) //move towards left player
	scoreL = 0
	scoreR = 0
}
function verbose(args){
	console.log(args)
}
// Start the game loop

intervalId = setInterval(run, 1000 / MAX_FPS);
loadNewGame() //loading new Game



// To stop the game, use the following:
//clearInterval(intervalId);