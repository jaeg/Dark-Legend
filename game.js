//GLOBALS
//Canvas
var gameCanvas = document.getElementById('game');
var gameCtx = gameCanvas.getContext("2d");
var darknessCanvas = document.getElementById('darkness');
var darknessCtx = darknessCanvas.getContext("2d");

//SPRITES
var tilesImage = new Image();
tilesImage.src = "img/tiles.png";
var charactersImage = new Image();
charactersImage.src = "img/player.png";

//MAPS
tileSize = 32;
var mapArray = [
    [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
    [3,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
    [3,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
    [3,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
    [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
    [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,3],
    [3,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
    [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
    [3,0,0,0,1,0,0,0,0,0,0,0,0,0,3,3,3,3,3,0,0,0,0,1,0,0,0,0,0,0,0,0,3],
    [3,0,0,0,1,0,0,0,0,0,0,0,0,3,3,3,3,3,3,3,0,0,0,0,0,0,0,0,0,0,0,0,3],
    [3,0,0,0,1,0,0,0,0,0,0,0,0,0,3,3,3,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
    [3,0,0,0,1,0,0,0,0,0,0,0,0,0,0,3,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
    [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
    [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,3],
    [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
    [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
    [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
    [3,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
    [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
    
]

gameCanvas.width = 640;//mapArray[0].length*tileSize;
gameCanvas.height = 480;//mapArray.length*tileSize;
darknessCanvas.width = gameCanvas.width;
darknessCanvas.height = gameCanvas.height;

var unPassibleTiles = [-1,3];


var screenOffset = {x: 0, y: 0};

//CLASSES
//Standard Circular Light
function Light(ctx, radius, position,initalBrightness)
{
     this.position = position;
     this.radius = radius;
     this.brightness = initalBrightness;
     this.targetBrightness = initalBrightness;
     this.fadeSpeed = 0;
     this.ctx = ctx;

     this.draw =  function(){
        if (this.brightness  < this.targetBrightness)
	    this.brightness  += this.fadeSpeed;
        else if (this.brightness > this.targetBrightness)
            this.brightness -= this.fadeSpeed;
	else
	    this.brightness = this.targetBrightness;
        var gradient = this.ctx.createRadialGradient(this.position.x + screenOffset.x, this.position.y + screenOffset.y, 
                                                     this.radius, this.position.x + screenOffset.x, this.position.y + screenOffset.y, 0);  
        gradient.addColorStop(1, "#000");  
         //gradient.addColorStop(0, "white");  
        gradient.addColorStop(0, "transparent");  
        this.ctx.fillStyle = gradient;
        this.ctx.globalAlpha = this.brightness;
        this.ctx.fillRect(0, 0, 640, 480);  
	this.ctx.globalAlpha = 1;
     };
    this.place = function(x, y)
    {
        this.position.x = x;
        this.position.y = y;
    }

    this.adjustBrightness = function(newBrightness, speed) 
    {
      this.targetBrightness = newBrightness;
      this.fadeSpeed = speed;

    }

    this.isAdjusting = function()
    {
      return (this.brightness == this.targetBrightness);
    }

    

}

Array.prototype.contains = function(obj) {
    var i = this.length;
    while (i--) {
        if (this[i] === obj) {
            return true;
        }
    }
    return false;
}

//Player Entity
function Player() {
    that = this;
    this.isMoving = false;
    this.position = {x:tileSize, y:tileSize};
    this.frame = 0;
    this.moveSpeed = Math.ceil(tileSize/5);
    this.keys = {left:false,right:false,up:false,down:false};
    this.flashlight = new Light(darknessCtx, 100, {x:0,y:0},.5);
    this.flashlight.adjustBrightness(1,.01);
    this.flashlightActive = true;
    this.flashlightBattery = 100;
    this.eyeAdjustment = 0;
    this.mousePos = {x:0,y:0};
    this.mouseClicked = false;
    this.rotation = 0;
 
    this.update = function() {
        if (this.keys.up == true)
            this.move(0,-this.moveSpeed); 
        if (this.keys.left == true) 
            this.move(-this.moveSpeed,0);
        if (this.keys.down == true) 
            this.move(0,this.moveSpeed);
        if (this.keys.right == true) 
            this.move(this.moveSpeed,0);
        if (this.flashlightActive)
        {
            this.flashlightBattery -=.1;
            this.eyeAdjustment = 0;
        }
        else if (this.eyeAdjustment < .2)
            this.eyeAdjustment += .005;
        if (this.flashlightBattery <= 0)
            this.flashlightActive = false;
        this.flashlight.place(this.position.x+tileSize/2,this.position.y+tileSize/2);
        this.rotation  = Math.atan2(this.mousePos.x - screenOffset.x - this.position.x, this.position.y - this.mousePos.y + screenOffset.y) - 3.14/2;
    };
    this.draw = function(){

	gameCtx.save();
	gameCtx.translate(this.position.x + screenOffset.x + tileSize/2,this.position.y+screenOffset.y+tileSize/2);
	gameCtx.rotate(this.rotation);
        gameCtx.drawImage(charactersImage,0,0,16,16,-tileSize/2,-tileSize/2,tileSize,tileSize);
	gameCtx.restore();

        if(this.flashlightActive)
            this.flashlight.draw();
    };
    this.move = function(xSpeed, ySpeed){
        this.position.x += xSpeed;
        this.position.y += ySpeed;
        
        var tileX = Math.floor(this.position.x / tileSize);
        var tileY = Math.floor(this.position.y / tileSize);
        var xOverlap = this.position.x%tileSize;
        var yOverlap = this.position.y%tileSize;
        //unPassibleTiles.contains(mapArray[tileY][tileX])

        if (xSpeed > 0)  //Moving Right
        {
                if((unPassibleTiles.contains(mapArray[tileY][tileX+1]) && !unPassibleTiles.contains(mapArray[tileY][tileX])) || (unPassibleTiles.contains(mapArray[tileY+1][tileX+1]) && !unPassibleTiles.contains(mapArray[tileY+1][tileX]) && yOverlap))
                {
                    this.position.x=tileX*tileSize;
                }
        }
        
        if (xSpeed < 0) //Moving Left
        {
                if((!unPassibleTiles.contains(mapArray[tileY][tileX+1]) && unPassibleTiles.contains(mapArray[tileY][tileX])) || (!unPassibleTiles.contains(mapArray[tileY+1][tileX+1]) && unPassibleTiles.contains(mapArray[tileY+1][tileX]) && yOverlap))
                {
                    this.position.x=(tileX+1)*tileSize;
                }
        }
        
        var tileX = Math.floor(this.position.x / tileSize);
        var tileY = Math.floor(this.position.y / tileSize);
        var xOverlap = this.position.x%tileSize;
        var yOverlap = this.position.y%tileSize;
        if (ySpeed > 0) // Moving Down
        {
                if((unPassibleTiles.contains(mapArray[tileY+1][tileX]) && !unPassibleTiles.contains(mapArray[tileY][tileX])) || (unPassibleTiles.contains(mapArray[tileY+1][tileX+1]) && !unPassibleTiles.contains(mapArray[tileY][tileX+1]) && xOverlap))
                {
                    this.position.y=tileY*tileSize;
                }
        }
        
        if (ySpeed < 0) //Moving Up
        {
                if((!unPassibleTiles.contains(mapArray[tileY+1][tileX]) && unPassibleTiles.contains(mapArray[tileY][tileX])) || (!unPassibleTiles.contains(mapArray[tileY+1][tileX+1]) && unPassibleTiles.contains(mapArray[tileY][tileX+1]) && xOverlap))
                {
                    this.position.y=(tileY+1)*tileSize;
                }
        }   
        
        //Screen move
        if (this.position.x + screenOffset.x+tileSize > gameCanvas.width)
            screenOffset.x -= this.moveSpeed;
        if (this.position.x + screenOffset.x < 0)
            screenOffset.x += this.moveSpeed;
        if (this.position.y + screenOffset.y + tileSize > gameCanvas.height)
            screenOffset.y -= this.moveSpeed;
        if (this.position.y + screenOffset.y < 0)
            screenOffset.y += this.moveSpeed;
        
    };
    this.handleKeyPressed = function(e){    
        switch(String.fromCharCode(e.keyCode))
        {
            case 'W': that.keys.up = true;break;
            case 'A': that.keys.left = true;break;
            case 'S': that.keys.down = true;break;
            case 'D': that.keys.right = true;break;
            case 'F': if (that.flashlightBattery > 0)
                    that.flashlightActive = !that.flashlightActive;break;
        }
       
    };
    this.handleKeyReleased = function(e){
        switch(String.fromCharCode(e.keyCode))
        {
            case 'W': that.keys.up = false; break;
            case 'A': that.keys.left = false;break;
            case 'S': that.keys.down = false;break;
            case 'D': that.keys.right = false;break;
        }
    };
    //Listeners 
    darknessCanvas.addEventListener('mousemove', function(evt) {
        var mousePos = getMousePos(darknessCanvas, evt);
    
        player.mousePos = mousePos;
    
    }, false);
    darknessCanvas.addEventListener('mousedown',function(evt) {
       this.mouseClicked = true;
    }, false);
    darknessCanvas.addEventListener('mouseup',function(evt) {
      this.mouseClicked = false;
    }, false);
    document.addEventListener("keydown",this.handleKeyPressed, false);
    document.addEventListener("keyup",this.handleKeyReleased, false);
}


function Enemy(type)
{
    this.type = type;
    this.position = {x:0, y:0};
    this.health = 10;
    this.update = function() {
        
    }
    this.draw = function() {
        
    }
    
}


//Initialization
var player = new Player();
var gameState = "death";
document.addEventListener("keydown",function(e) { if (e.keyCode == 13 && gameState != "play") {start();}}, false);

function start()
{
    player = new Player();
    gameState = "play";
    
}


//Game functions
function update()
{
    if (gameState == "play")
    {
        player.update();
    }
}
function draw()
{
    if (gameState == "menu")
    {
        darknessCanvas.width = darknessCanvas.width;
        darknessCtx.fillStyle = "black";
        darknessCtx.fillRect(0,0,darknessCanvas.width, darknessCanvas.height);
        darknessCtx.fillStyle = "white";
        darknessCtx.font="20px Courier New";
        darknessCtx.fillText("Hit Enter To Start",240,240);
    }
    if (gameState == "death")
    {
        darknessCanvas.width = darknessCanvas.width;
        darknessCtx.fillStyle = "black";
        darknessCtx.fillRect(0,0,darknessCanvas.width, darknessCanvas.height);
        darknessCtx.fillStyle = "white";
        darknessCtx.font="20px Courier New";
        darknessCtx.fillText("Game Over... Hit Enter To Start",150,240);
    }
    if (gameState == "play")
    {
        //Fill the darkness out
        darknessCanvas.width = darknessCanvas.width;
        darknessCtx.globalCompositeOperation = 'source-over'; 
        darknessCtx.fillStyle = "rgba(0, 0, 0, " + (1 - player.eyeAdjustment) + ")"; 
        darknessCtx.fillRect(0,0,darknessCanvas.width,darknessCanvas.height); 
        darknessCtx.globalCompositeOperation = 'destination-out'; 

        for (var i=0; i < mapArray.length; i++)
        {
            for(var j=0; j < mapArray[i].length; j++)
            {
            /*
                var offSetX, offSetY;
                if (mapArray[i][j] == 0) {
                    offSetX = 0;
                    offSetY = 5;
                }
                if (mapArray[i][j] == 1) {
                    offSetX = 0;
                    offSetY = 0;
                }
                if (mapArray[i][j] == 3) {
                    offSetX = 3;
                    offSetY = 0;
                }

                gameCtx.drawImage(tilesImage,16*offSetX,16*offSetY,16,16,j*tileSize+screenOffset.x,i*tileSize+screenOffset.y,tileSize,tileSize);*/


                if (mapArray[i][j] == 0) {
            gameCtx.fillStyle = "#1DB835";

                }
                if (mapArray[i][j] == 1) {
            gameCtx.fillStyle = "#37B84B";
                }
                if (mapArray[i][j] == 3) {
                    gameCtx.fillStyle = "#79807A";
                }
                gameCtx.fillRect(j*tileSize+screenOffset.x,i*tileSize+screenOffset.y,tileSize,tileSize);
            }
        }

        player.draw();
    }
}

//Main Loop
var mainloop = function() {
    update();
    draw();
};

var animFrame = window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        null ;

var recursiveAnim = function() {
    mainloop();
    animFrame( recursiveAnim );
};

// start the mainloop
animFrame( recursiveAnim );


//Utility Functions
function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}


