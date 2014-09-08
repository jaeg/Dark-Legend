function Light(e,t,n,r){this.position=n;this.radius=t;this.brightness=r;this.targetBrightness=r;this.fadeSpeed=0;this.ctx=e;this.draw=function(){if(this.brightness<this.targetBrightness)this.brightness+=this.fadeSpeed;else if(this.brightness>this.targetBrightness)this.brightness-=this.fadeSpeed;else this.brightness=this.targetBrightness;var e=this.ctx.createRadialGradient(this.position.x+screenOffset.x,this.position.y+screenOffset.y,this.radius,this.position.x+screenOffset.x,this.position.y+screenOffset.y,0);e.addColorStop(1,"#000");e.addColorStop(0,"transparent");this.ctx.fillStyle=e;this.ctx.globalAlpha=this.brightness;this.ctx.fillRect(0,0,640,480);this.ctx.globalAlpha=1};this.place=function(e,t){this.position.x=e;this.position.y=t};this.adjustBrightness=function(e,t){this.targetBrightness=e;this.fadeSpeed=t};this.isAdjusting=function(){return this.brightness==this.targetBrightness}}function Player(){that=this;this.isMoving=false;this.position={x:tileSize,y:tileSize};this.frame=0;this.moveSpeed=Math.ceil(tileSize/5);this.keys={left:false,right:false,up:false,down:false};this.flashlight=new Light(darknessCtx,100,{x:0,y:0},.5);this.flashlight.adjustBrightness(1,.01);this.flashlightActive=true;this.flashlightBattery=100;this.eyeAdjustment=0;this.mousePos={x:0,y:0};this.mouseClicked=false;this.rotation=0;this.update=function(){if(this.keys.up==true)this.move(0,-this.moveSpeed);if(this.keys.left==true)this.move(-this.moveSpeed,0);if(this.keys.down==true)this.move(0,this.moveSpeed);if(this.keys.right==true)this.move(this.moveSpeed,0);if(this.flashlightActive){this.flashlightBattery-=.1;this.eyeAdjustment=0}else if(this.eyeAdjustment<.2)this.eyeAdjustment+=.005;if(this.flashlightBattery<=0)this.flashlightActive=false;this.flashlight.place(this.position.x+tileSize/2,this.position.y+tileSize/2);this.rotation=Math.atan2(this.mousePos.x-screenOffset.x-this.position.x,this.position.y-this.mousePos.y+screenOffset.y)-3.14/2};this.draw=function(){gameCtx.save();gameCtx.translate(this.position.x+screenOffset.x+tileSize/2,this.position.y+screenOffset.y+tileSize/2);gameCtx.rotate(this.rotation);gameCtx.drawImage(charactersImage,0,0,16,16,-tileSize/2,-tileSize/2,tileSize,tileSize);gameCtx.restore();if(this.flashlightActive)this.flashlight.draw()};this.move=function(e,t){this.position.x+=e;this.position.y+=t;var n=Math.floor(this.position.x/tileSize);var r=Math.floor(this.position.y/tileSize);var i=this.position.x%tileSize;var s=this.position.y%tileSize;if(e>0){if(unPassibleTiles.contains(mapArray[r][n+1])&&!unPassibleTiles.contains(mapArray[r][n])||unPassibleTiles.contains(mapArray[r+1][n+1])&&!unPassibleTiles.contains(mapArray[r+1][n])&&s){this.position.x=n*tileSize}}if(e<0){if(!unPassibleTiles.contains(mapArray[r][n+1])&&unPassibleTiles.contains(mapArray[r][n])||!unPassibleTiles.contains(mapArray[r+1][n+1])&&unPassibleTiles.contains(mapArray[r+1][n])&&s){this.position.x=(n+1)*tileSize}}var n=Math.floor(this.position.x/tileSize);var r=Math.floor(this.position.y/tileSize);var i=this.position.x%tileSize;var s=this.position.y%tileSize;if(t>0){if(unPassibleTiles.contains(mapArray[r+1][n])&&!unPassibleTiles.contains(mapArray[r][n])||unPassibleTiles.contains(mapArray[r+1][n+1])&&!unPassibleTiles.contains(mapArray[r][n+1])&&i){this.position.y=r*tileSize}}if(t<0){if(!unPassibleTiles.contains(mapArray[r+1][n])&&unPassibleTiles.contains(mapArray[r][n])||!unPassibleTiles.contains(mapArray[r+1][n+1])&&unPassibleTiles.contains(mapArray[r][n+1])&&i){this.position.y=(r+1)*tileSize}}if(this.position.x+screenOffset.x+tileSize>gameCanvas.width)screenOffset.x-=this.moveSpeed;if(this.position.x+screenOffset.x<0)screenOffset.x+=this.moveSpeed;if(this.position.y+screenOffset.y+tileSize>gameCanvas.height)screenOffset.y-=this.moveSpeed;if(this.position.y+screenOffset.y<0)screenOffset.y+=this.moveSpeed};this.handleKeyPressed=function(e){switch(String.fromCharCode(e.keyCode)){case"W":that.keys.up=true;break;case"A":that.keys.left=true;break;case"S":that.keys.down=true;break;case"D":that.keys.right=true;break;case"F":if(that.flashlightBattery>0)that.flashlightActive=!that.flashlightActive;break}};this.handleKeyReleased=function(e){switch(String.fromCharCode(e.keyCode)){case"W":that.keys.up=false;break;case"A":that.keys.left=false;break;case"S":that.keys.down=false;break;case"D":that.keys.right=false;break}};darknessCanvas.addEventListener("mousemove",function(e){var t=getMousePos(darknessCanvas,e);player.mousePos=t},false);darknessCanvas.addEventListener("mousedown",function(e){this.mouseClicked=true},false);darknessCanvas.addEventListener("mouseup",function(e){this.mouseClicked=false},false);document.addEventListener("keydown",this.handleKeyPressed,false);document.addEventListener("keyup",this.handleKeyReleased,false)}function Enemy(e){this.type=e;this.position={x:0,y:0};this.health=10;this.update=function(){};this.draw=function(){}}function start(){player=new Player;gameState="play"}function update(){if(gameState=="play"){player.update()}}function draw(){if(gameState=="menu"){darknessCanvas.width=darknessCanvas.width;darknessCtx.fillStyle="black";darknessCtx.fillRect(0,0,darknessCanvas.width,darknessCanvas.height);darknessCtx.fillStyle="white";darknessCtx.font="20px Courier New";darknessCtx.fillText("Hit Enter To Start",240,240)}if(gameState=="death"){darknessCanvas.width=darknessCanvas.width;darknessCtx.fillStyle="black";darknessCtx.fillRect(0,0,darknessCanvas.width,darknessCanvas.height);darknessCtx.fillStyle="white";darknessCtx.font="20px Courier New";darknessCtx.fillText("Game Over... Hit Enter To Start",150,240)}if(gameState=="play"){darknessCanvas.width=darknessCanvas.width;darknessCtx.globalCompositeOperation="source-over";darknessCtx.fillStyle="rgba(0, 0, 0, "+(1-player.eyeAdjustment)+")";darknessCtx.fillRect(0,0,darknessCanvas.width,darknessCanvas.height);darknessCtx.globalCompositeOperation="destination-out";for(var e=0;e<mapArray.length;e++){for(var t=0;t<mapArray[e].length;t++){if(mapArray[e][t]==0){gameCtx.fillStyle="#1DB835"}if(mapArray[e][t]==1){gameCtx.fillStyle="#37B84B"}if(mapArray[e][t]==3){gameCtx.fillStyle="#79807A"}gameCtx.fillRect(t*tileSize+screenOffset.x,e*tileSize+screenOffset.y,tileSize,tileSize)}}player.draw()}}function getMousePos(e,t){var n=e.getBoundingClientRect();return{x:t.clientX-n.left,y:t.clientY-n.top}}var gameCanvas=document.getElementById("game");var gameCtx=gameCanvas.getContext("2d");var darknessCanvas=document.getElementById("darkness");var darknessCtx=darknessCanvas.getContext("2d");var tilesImage=new Image;tilesImage.src="img/tiles.png";var charactersImage=new Image;charactersImage.src="img/player.png";tileSize=32;var mapArray=[[3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],[3,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],[3,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],[3,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],[3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],[3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,3],[3,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],[3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],[3,0,0,0,1,0,0,0,0,0,0,0,0,0,3,3,3,3,3,0,0,0,0,1,0,0,0,0,0,0,0,0,3],[3,0,0,0,1,0,0,0,0,0,0,0,0,3,3,3,3,3,3,3,0,0,0,0,0,0,0,0,0,0,0,0,3],[3,0,0,0,1,0,0,0,0,0,0,0,0,0,3,3,3,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,3],[3,0,0,0,1,0,0,0,0,0,0,0,0,0,0,3,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],[3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],[3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,3],[3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],[3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],[3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],[3,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],[3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3]];gameCanvas.width=640;gameCanvas.height=480;darknessCanvas.width=gameCanvas.width;darknessCanvas.height=gameCanvas.height;var unPassibleTiles=[-1,3];var screenOffset={x:0,y:0};Array.prototype.contains=function(e){var t=this.length;while(t--){if(this[t]===e){return true}}return false};var player=new Player;var gameState="death";document.addEventListener("keydown",function(e){if(e.keyCode==13&&gameState!="play"){start()}},false);var mainloop=function(){update();draw()};var animFrame=window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||null;var recursiveAnim=function(){mainloop();animFrame(recursiveAnim)};animFrame(recursiveAnim)