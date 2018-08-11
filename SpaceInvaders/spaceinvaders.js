window.addEventListener("load", keyPress, false);

function keyPress(){
	window.addEventListener("keydown", init, false);
}
//highscore - 6790
window.level = 1;
window.lives = 3;
window.score = 0;

function init(){
	
	window.removeEventListener("keydown", init, false);
	document.getElementById("overlay").innerHTML = "<br/> <canvas id='canvas' tabindex='1' class='visible'></canvas>";
	
	window.canvas = document.getElementById("canvas");
	window.ctx = canvas.getContext("2d");
	
	setCanvasDimensions();
	
	window.counter = 0;
	window.gameSpeed = Math.ceil(250/level);
	window.shootingSpeed = Math.ceil(500/level);
	
	window.threshold = 400;
	
	window.alienState = 1;
	window.alienSize = 30;
	window.alienArray =   [ [3,3,3,3,3,3,3,3,3,3,3],
							[2,2,2,2,2,2,2,2,2,2,2],
							[2,2,2,2,2,2,2,2,2,2,2],
							[1,1,1,1,1,1,1,1,1,1,1],
							[1,1,1,1,1,1,1,1,1,1,1] ]
	
	window.furthestLeft;
	window.furthestRight;
	window.furthestBottom;
	window.minX;
	window.maxX;
	window.maxY;
	window.direction = "right";
	window.spaceBullets = [];
	
	
	window.gameOver = false;
	
	loadImages();
	
	window.bullet;
	window.bulletX;
	window.bulletY;
	window.bulletSpeed = 2;
	window.bulletWidth = 6;
	window.bulletHeight = 10;
	window.bulletShot = false;
	
	window.shipY = 410;
	window.shipWidth = 45;
	window.shipHeight = 30;
	window.shipX = 0;
	window.shipSpeed = 1;
	window.leftActive = false;
	window.rightActive = false;
		
	window.curXShift = (shipWidth-alienSize)/2;
	window.curYShift = 0;
	window.alienSpeed = curXShift;
	window.jumpDistance = alienSize;
		
	window.addEventListener("keydown", getInput, false);
	window.updater = setInterval(function () { updateGame()}, 5);
	window.addEventListener("keyup", release, false);
	
	updateGameData()
}

function release(e){
	if(e.keyCode == 37){
		leftActive = false;	
	}else if(e.keyCode == 39){
		rightActive = false;
	}
}

function alienShot(){
	var availableShooters = [];
	var transposed = new Array(11);
	
	for(var i=0;i<transposed.length;i++){
		transposed[i] = new Array(5);	
	}
		
	for(var i =0;i<alienArray.length;i++){
		for(var k = 0;k<alienArray[i].length;k++){
			transposed[k][i] = alienArray[i][k];
		}
	}
	
	for(var i=0;i<transposed.length;i++){		
		if(transposed[i].lastIndexOf(0) == -1){
			var temp = [4,i];
			availableShooters.push(temp);
		}else if(transposed[i].lastIndexOf(1) != -1){
			var temp = [transposed[i].lastIndexOf(1),i];
			availableShooters.push(temp);
		}else if(transposed[i].lastIndexOf(2) != -1){
			var temp = [transposed[i].lastIndexOf(2),i];
			availableShooters.push(temp);
		}else if(transposed[i].lastIndexOf(3) != -1){
			var temp = [transposed[i].lastIndexOf(3),i];
			availableShooters.push(temp);
		}
	}
		
	var rand = Math.floor(Math.random()*availableShooters.length);
	
	var speed;
		
	switch(alienArray[availableShooters[rand][0]][availableShooters[rand][1]]){
		case 1: speed = 0.5; break;
		case 2: speed = 1; break;
		case 3: speed = 2; break;
	}
	
	var bulletX = availableShooters[rand][1]*(alienSize+1.5*bulletWidth) + curXShift + 0.5*alienSize;
	var bulletY = availableShooters[rand][0]*(alienSize+bulletWidth) + curYShift + alienSize;
		
	spaceBullets.push([bulletX,bulletY, speed]);
}

function updateGame(){
	checkLevelEnd();
	counter++;
	drawLine();
	move();
	if(counter%gameSpeed == 0){
		moveAliens();
		alienState = alienState%2 + 1;	
	}
	if(counter%shootingSpeed == 0){
		alienShot();	
	}
	checkHit();
	draw();
}

function checkLevelEnd(){
	for(var i=0;i<alienArray.length;i++){
		for(var k = 0;k<alienArray[i].length;k++){
			if(alienArray[i][k] != 0){
				return;	
			}
		}
	}
	
	nextLevel();
}

function moveAliens(){
	var currentAliens = [];
	
	for(var i=0;i<alienArray.length;i++){
		for(var k = 0;k<alienArray[i].length;k++){
			if(alienArray[i][k] != 0){
				var temp = [i,k]
				currentAliens.push(temp);
			}
		}
	}
	
	findFurthest(currentAliens);
	
	minX = (0-furthestLeft)*(alienSize+1.5*bulletWidth)+(shipWidth-alienSize)/2;
	maxX = canvas.width - (shipWidth+alienSize)/2 - (furthestRight) * (alienSize + 1.5*bulletWidth);
	maxY = threshold - alienSize * (furthestBottom + 1);

	if(curYShift + jumpDistance > maxY){
		endGame();
	}

	if(direction == "left"){
		if(curXShift - alienSpeed >= minX){
			curXShift -= alienSpeed;
		}else{
			direction = "right";
			curYShift += jumpDistance;	
		}
	}else if(direction == "right"){
		if(curXShift + alienSpeed <= maxX){
			curXShift += alienSpeed;	
		}else{
			direction = "left";
			curYShift += jumpDistance;	
		}
	}		
}

function endGame(){
	document.getElementById("overlay").innerHTML = " <br /> Game Over <br /> <img src='Images/gg.png'/>";
	clearInterval(updater);
	document.getElementById("wrapper").innerHTML += " </br> <a href='../index.html'><p> Click here to go back to the arcade </p></a>";	
}

function checkHit(){
	if(bulletShot){
		if(bulletY < 0){
			bulletShot = false;	
		}
				
		for(var i = 0;i<alienArray.length;i++){
			for(var k = 0;k<alienArray[i].length;k++){
				
				if(alienArray[i][k] != 0){
					var x1 = k*(alienSize+1.5*bulletWidth) + curXShift - bulletWidth;
					var x2 = k*(alienSize+1.5*bulletWidth) + curXShift + alienSize;
					var y = i*(alienSize+bulletWidth) + curYShift + alienSize;
					
					if(bulletX>x1 && bulletX < x2 && bulletY == y){
						bulletShot = false;
						
						switch(alienArray[i][k]){
							case 1: score += 10; break;
							case 2: score += 20; break;
							case 3: score += 30; break;
						}
						
						alienArray[i][k] = 0;
						updateGameData();	
					}
				}				
			}
		}
	}
		
	if(spaceBullets.length > 0){
						
		for(var i = 0;i<spaceBullets.length;i++){
						
			if(spaceBullets[i][1]>canvas.height){
				spaceBullets.splice(i, 1);
			}
			
		}
		
	}
	
	if(spaceBullets.length > 0){
		
		for(var i = 0;i<spaceBullets.length;i++){
			
			if(spaceBullets[i][0] + 0.5*bulletWidth > shipX && spaceBullets[i][0] + 0.5*bulletWidth < shipX+shipWidth && spaceBullets[i][1] + bulletHeight == shipY){
				lives--;
				spaceBullets.splice(i, 1);
				shipX = 0;
				updateGameData();

				if(lives == 0){
					endGame();	
				}
			}
		}
	}
	
}

function move(){
	if(leftActive && shipX - shipSpeed > 0){
		shipX -= shipSpeed;
	}else if(rightActive && shipX + shipSpeed < canvas.width-shipWidth){
		shipX += shipSpeed;
	}
	
	if(bulletShot){
		bulletY -= bulletSpeed; 	
	}
	
	if(spaceBullets.length > 0){
		for(var i =0;i<spaceBullets.length;i++){
			spaceBullets[i][1] += spaceBullets[i][2];
		}
	}
}

function findFurthest(aliens){
	var cols = [];
	var rows = [];
	
	for(var i = 0;i<aliens.length;i++){
		cols.push(aliens[i][1]);
		rows.push(aliens[i][0]);
	}
		
	furthestLeft = Math.min.apply(null,cols);
	furthestRight = Math.max.apply(null,cols);
	furthestBottom = Math.max.apply(null,rows);	
}

function getInput(e){
	
	e.preventDefault();

	var key = e.keyCode;
	
	switch(key){
		case 37: leftActive = true; rightActive = false; break;
		case 39: rightActive = true; leftActive = false; break;	
	}
	
	if(key == 32 && !bulletShot){
		shoot();
	}
}

function shoot(){
	bulletShot = true;
	bulletX = shipX + shipWidth/2 - bulletWidth/2;
	bulletY = shipY;
}

function drawLine(){
	ctx.clearRect(0,0,canvas.width, canvas.height);
	ctx.beginPath();
	ctx.moveTo(0,threshold);
	ctx.lineTo(600,threshold);
	ctx.strokeStyle = "#FFFFFF";
	ctx.stroke();
}

function setCanvasDimensions(){
	document.getElementById("canvas").setAttribute("width", "600px");
	document.getElementById("canvas").setAttribute("height", "450px");
	document.getElementById("gameData").setAttribute("width", "600px");
}

function draw(){	
	ctx.drawImage(ship, shipX,shipY,shipWidth,shipHeight);
	if(bulletShot){
		ctx.drawImage(bullet, bulletX, bulletY, bulletWidth, bulletHeight);
	}
		
	if(spaceBullets.length > 0){
		for(var i = 0;i<spaceBullets.length;i++){
			ctx.drawImage(missile, spaceBullets[i][0], spaceBullets[i][1], bulletWidth, bulletHeight);	
		}
	}
		
	if(alienState == 1){
		for(var i = 0;i<alienArray.length;i++){
			for(var k = 0;k<alienArray[i].length;k++){
				
				var x = k*(alienSize+1.5*bulletWidth) + curXShift;
				var y = i*(alienSize+bulletWidth) + curYShift;
				
									
				switch(alienArray[i][k]){					
					case 1:
						ctx.drawImage(alienA_1,x,y, alienSize, alienSize);
						break
					case 2:
						ctx.drawImage(alienB_1,x,y, alienSize, alienSize);
						break;
					case 3:	
						ctx.drawImage(alienC_1,x,y, alienSize, alienSize);
						break;
				}
			}
		}
	}else if(alienState == 2){
		for(var i = 0;i<alienArray.length;i++){
			for(var k = 0;k<alienArray[i].length;k++){
				
			 	var x = k*(alienSize+1.5*bulletWidth) + curXShift;
				var y = i*(alienSize+bulletWidth) + curYShift;
					
				switch(alienArray[i][k]){				
					case 1:
						ctx.drawImage(alienA_2,x,y, alienSize, alienSize);
						break
					case 2:
						ctx.drawImage(alienB_2,x,y, alienSize, alienSize);
						break;
					case 3:	
						ctx.drawImage(alienC_2,x,y, alienSize, alienSize);
						break;
				}
			}
		}
	}
}

function loadImages(){
	window.ship = new Image();
	 
	 ship.onload =  new function (ship) {
		 return function(){
		 }
	 }(ship);
	 
	 ship.src = "Images/ship.png";
	 
	 window.bullet = new Image();
	 
	 bullet.onload =  new function (bullet) {
		 return function(){
		 }
	 }(bullet);
	 
	 bullet.src = "Images/bullet.png";
	 
	 window.missile = new Image();
	 
	 missile.onload =  new function (missile) {
		 return function(){
		 }
	 }(missile);
	 
	 missile.src = "Images/missile.png";
	 
	 window.alienA_1 = new Image();
	 
	 alienA_1.onload =  new function (alienA_1) {
		 return function(){
		 }
	 }(alienA_1);
	 
	 alienA_1.src = "Images/alienA_1.png";
	 
	  window.alienA_2 = new Image();
	 
	 alienA_2.onload =  new function (alienA_2) {
		 return function(){
		 }
	 }(alienA_2);
	 
	 alienA_2.src = "Images/alienA_2.png";	
	 
	 window.alienB_1 = new Image();
	 
	 alienB_1.onload =  new function (alienB_1) {
		 return function(){
		 }
	 }(alienB_1);
	 
	 alienB_1.src = "Images/alienB_1.png";
	 
	 window.alienB_2 = new Image();
	 
	 alienB_2.onload =  new function (alienB_2) {
		 return function(){
		 }
	 }(alienB_2);
	 
	 alienB_2.src = "Images/alienB_2.png";	
	 
	 window.alienC_1 = new Image();
	 
	 alienC_1.onload =  new function (alienC_1) {
		 return function(){
		 }
	 }(alienC_1);
	 
	 alienC_1.src = "Images/alienC_1.png";
	 
	 window.alienC_2 = new Image();
	 
	 alienC_2.onload =  new function (alienC_2) {
		 return function(){
		 }
	 }(alienC_2);
	 
	 alienC_2.src = "Images/alienC_2.png"; 
}

function updateGameData(){	
	document.getElementById("score").innerHTML = "Score: " + score;
	document.getElementById("lives").innerHTML = "Lives: <img id='livesDisplay'/>";
	document.getElementById("livesDisplay").setAttribute("src", "Images/" + lives + "_lives.png");
	document.getElementById("level").innerHTML = "Level: " + level;
}

function nextLevel(){
	level++;
	updateGameData();
	clearInterval(updater);
	init()	
}