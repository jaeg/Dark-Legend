//Standard Circular Light
function Light(ctx, radius, position)
{
     this.position = position;
     this.radius = radius;
     this.ctx = ctx;
     this.draw =  function(){
        var gradient = this.ctx.createRadialGradient(this.position.x, this.position.y, 
                                                     this.radius, this.position.x, this.position.y, 0);  
        gradient.addColorStop(1, "#000");  
         //gradient.addColorStop(0, "white");  
        gradient.addColorStop(0, "transparent");  
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, 640, 480);  
     };
    this.place = function(x, y)
    {
        this.position.x = x;
        this.position.y = y;
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

//Canvas
var gameCanvas = document.getElementById('game');
var gameCtx = gameCanvas.getContext("2d");
var darknessCanvas = document.getElementById('darkness');
var darknessCtx = darknessCanvas.getContext("2d");

//SPRITES
var tilesImage = new Image();
tilesImage.src = "img/tiles.png";
var charactersImage = new Image();
charactersImage.src = "img/characters.png";

//MAPS
tileSize = 32;
var mapArray = [
    [3,3,3,3,3,3,3,3,3,3,3,3,3],
    [3,0,0,3,1,0,0,0,0,0,0,0,3],
    [3,0,0,0,0,0,3,0,1,0,0,3,3],
    [3,0,1,0,0,0,3,0,0,0,3,0,3],
    [3,0,0,0,0,0,0,0,3,3,0,0,3],
    [3,0,0,0,0,0,1,0,3,3,0,0,3],
    [3,3,3,3,3,3,3,3,3,3,3,3,3]
]

gameCanvas.width = mapArray[0].length*tileSize;
gameCanvas.height = mapArray.length*tileSize;
darknessCanvas.width = gameCanvas.width;
darknessCanvas.height = gameCanvas.height;

var unPassibleTiles = [3];

//Player Entity
function Player() {                
    var that = {
    isMoving: false,
    position: {x:tileSize, y:tileSize},
    frame: 0,
    update: function() {

    },
    render: function(){
        gameCtx.drawImage(charactersImage,0,0,16,16,that.position.x,that.position.y,tileSize,tileSize);
    },
    move: function(xSpeed, ySpeed){
        that.position.x += xSpeed;
        that.position.y += ySpeed;
        
        var tileX = Math.floor(that.position.x / tileSize);
        var tileY = Math.floor(that.position.y / tileSize);
        var xOverlap = that.position.x%tileSize;
        var yOverlap = that.position.y%tileSize;
        //unPassibleTiles.contains(mapArray[tileY][tileX])


        
        if (xSpeed > 0)  //Moving Right
        {
                if((unPassibleTiles.contains(mapArray[tileY][tileX+1]) && !unPassibleTiles.contains(mapArray[tileY][tileX])) || (unPassibleTiles.contains(mapArray[tileY+1][tileX+1]) && !unPassibleTiles.contains(mapArray[tileY+1][tileX]) && xOverlap))
                {
                    that.position.x -= xSpeed;
                }
        }
        
        if (xSpeed < 0) //Moving Left
        {
                if((!unPassibleTiles.contains(mapArray[tileY][tileX+1]) && unPassibleTiles.contains(mapArray[tileY][tileX])) || (!unPassibleTiles.contains(mapArray[tileY+1][tileX+1]) && unPassibleTiles.contains(mapArray[tileY+1][tileX]) && xOverlap))
                {
                    that.position.x  -= xSpeed;
                }
        }
        
        
        var tileX = Math.floor(that.position.x / tileSize);
        var tileY = Math.floor(that.position.y / tileSize);
        var xOverlap = that.position.x%tileSize;
        var yOverlap = that.position.y%tileSize;
        if (ySpeed > 0) // Moving Down
        {
                if((unPassibleTiles.contains(mapArray[tileY+1][tileX]) && !unPassibleTiles.contains(mapArray[tileY][tileX])) || (unPassibleTiles.contains(mapArray[tileY+1][tileX+1]) && !unPassibleTiles.contains(mapArray[tileY][tileX+1]) && yOverlap))
                {
                    that.position.y -= ySpeed;
                }
        }
        
        if (ySpeed < 0) //Moving Up
        {
                if((!unPassibleTiles.contains(mapArray[tileY+1][tileX]) && unPassibleTiles.contains(mapArray[tileY][tileX])) || (!unPassibleTiles.contains(mapArray[tileY+1][tileX+1]) && unPassibleTiles.contains(mapArray[tileY][tileX+1]) && yOverlap))
                {
                    that.position.y -= ySpeed;
                }
        }
        
            
    },
    handleKey: function(e){
       var moveSpeed = Math.ceil(tileSize/5);
       if (that.isMoving == false) {
        switch(String.fromCharCode(e.keyCode))
        {
            case 'w': that.move(0,-moveSpeed); break;
            case 'a': that.move(-moveSpeed,0);break;
            case 's': that.move(0,moveSpeed);break;
            case 'd': that.move(moveSpeed,0);break;
        }
       }
    },

    }
    window.addEventListener("keypress",that.handleKey, false);
    return that;


}
var player = Player();

//Test lights
var position = {x:50, y:50};
var light =  new Light(darknessCtx, 100, position);
light.draw();

//Test Text
gameCtx.fillStyle="red";
gameCtx.font="20px Georgia";
gameCtx.fillText("Hello World!",10,50);


//Game functions
function update()
{
    player.update();
    light.place(player.position.x+tileSize/2,player.position.y+tileSize/2);
}
function draw()
{
    //Fill the darkness out
    darknessCtx.globalCompositeOperation = 'source-over'; 
    darknessCtx.fillStyle = "black"; 
    //darknessCtx.fillRect(0,0,darknessCanvas.width,darknessCanvas.height); 
    darknessCtx.globalCompositeOperation = 'destination-out'; 
    light.draw();
    
    for (var i=0; i < mapArray.length; i++)
    {
        for(var j=0; j < mapArray[i].length; j++)
        {
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

            gameCtx.drawImage(tilesImage,16*offSetX,16*offSetY,16,16,j*tileSize,i*tileSize,tileSize,tileSize);
        }
    }

    player.render();
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

//Listeners 
darknessCanvas.addEventListener('mousemove', function(evt) {
    var mousePos = getMousePos(darknessCanvas, evt);
    
}, false);
