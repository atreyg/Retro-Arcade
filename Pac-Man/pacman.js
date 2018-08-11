loadImages();
loadSounds();
loadScores();

window.addEventListener("load", keyPress, false);

function keyPress(){
	window.addEventListener("keydown", init, false);
	document.getElementById("sound").addEventListener("click", toggleSound, false);
	window.show = true;
	
	window.forFlash = setInterval(function() { makeItFlash() }, 500);
}

function toggleSound(){
	soundOn = !soundOn;
	document.getElementById("sound").src = (soundOn == true ? "Images/sound.png" : "Images/soundoff.png");
}	

function makeItFlash(){

	if(show){
		document.getElementById("flasher").className = "visible";	
	}else{
		document.getElementById("flasher").className = "hidden";	
	}
	
	show = !show;
}

window.level = 1;
window.lives = 3; 
window.score = 0;

function init(){
	
	if(startBGM.currentTime.toFixed(2) != 5.38){
		startBGM.pause();
	}
		
	clearInterval(forFlash);
	
	window.removeEventListener("keydown", init, false);
	document.getElementById("overlay").innerHTML = "<canvas id='canvas' tabindex='1' class='hidden'></canvas> <div id='instructions' class='hidden'> </div> <div id='countdown' class='hidden'> </div>";
	document.getElementById("instructions").innerHTML = "<p>Use the arrow keys to manuover Pacman around the maze. complete the level by eating all the dots. Avoid the monsters, if they catch you you will lose a life. </br> </br> (Press 'P' to return)</p>";

	
	window.map =   [[[2],[2],[2],[2],[2],[2],[2],[2],[2],[2],[2],[2],[2],[2],[2],[2],[2],[2],[2]],
					[[2],[1],[1],[1],[1],[1],[1],[1],[1],[2],[1],[1],[1],[1],[1],[1],[1],[1],[2]],
					[[2],[1.5],[2],[2],[1],[2],[2],[2],[1],[2],[1],[2],[2],[2],[1],[2],[2],[1.5],[2]],
					[[2],[1],[2],[2],[1],[2],[2],[2],[1],[2],[1],[2],[2],[2],[1],[2],[2],[1],[2]],
					[[2],[1],[1],[1],[1],[1],[1],[1],[1],[1],[1],[1],[1],[1],[1],[1],[1],[1],[2]],
					[[2],[1],[2],[2],[1],[2],[1],[2],[2],[2],[2],[2],[1],[2],[1],[2],[2],[1],[2]],
					[[2],[1],[1],[1],[1],[2],[1],[1],[1],[2],[1],[1],[1],[2],[1],[1],[1],[1],[2]],
					[[2],[2],[2],[2],[1],[2],[2],[2],[1],[2],[1],[2],[2],[2],[1],[2],[2],[2],[2]],
					[[2],[2],[2],[2],[1],[2],[1],[1],[1],[1],[1],[1],[1],[2],[1],[2],[2],[2],[2]],
					[[2],[2],[2],[2],[1],[2],[1],[2],[2],[4],[2],[2],[1],[2],[1],[2],[2],[2],[2]],
					[[1],[1],[1],[1],[1],[1],[1],[2],[7],[5],[6],[2],[1],[1],[1],[1],[1],[1],[1]],
					[[2],[2],[2],[2],[1],[2],[1],[2],[2],[2],[2],[2],[1],[2],[1],[2],[2],[2],[2]],
					[[2],[2],[2],[2],[1],[2],[1],[1],[1],[1],[1],[1],[1],[2],[1],[2],[2],[2],[2]],
					[[2],[2],[2],[2],[1],[2],[1],[2],[2],[2],[2],[2],[1],[2],[1],[2],[2],[2],[2]],
					[[2],[1],[1],[1],[1],[1],[1],[1],[1],[2],[1],[1],[1],[1],[1],[1],[1],[1],[2]],
					[[2],[1],[2],[2],[1],[2],[2],[2],[1],[2],[1],[2],[2],[2],[1],[2],[2],[1],[2]],
					[[2],[1],[1],[2],[1],[1],[1],[1],[1],[3],[1],[1],[1],[1],[1],[2],[1],[1],[2]],
					[[2],[2],[1],[2],[1],[2],[1],[2],[2],[2],[2],[2],[1],[2],[1],[2],[1],[2],[2]],
					[[2],[1],[1],[1],[1],[2],[1],[1],[1],[2],[1],[1],[1],[2],[1],[1],[1],[1],[2]],
					[[2],[1.5],[2],[2],[2],[2],[2],[2],[1],[2],[1],[2],[2],[2],[2],[2],[2],[1.5],[2]],
					[[2],[1],[1],[1],[1],[1],[1],[1],[1],[1],[1],[1],[1],[1],[1],[1],[1],[1],[2]],
					[[2],[2],[2],[2],[2],[2],[2],[2],[2],[2],[2],[2],[2],[2],[2],[2],[2],[2],[2]]];
	
	window.ROWS = 22;
	window.COLS = 19;
	window.BLOCK_SIZE = 25;  
	window.GAME_SPEED = 250;	
	
	window.key = "right";
	window.prevKey = "right";
	window.pause = false;
	
	window.pacMove = 0;
	window.ghostMove = 0;
	window.pacCatch = false;
	window.animationNum = 2;
	
	window.startingPos = finder(3,"pos");
	window.currentPos = startingPos;																																																												
	
 	window.ghostStartingPos = [finder(4, "pos"), finder(5, "pos"), finder(6,"pos"), finder(7,"pos")];													
	window.ghostCurrentPos = [ghostStartingPos[0], ghostStartingPos[1], ghostStartingPos[2], ghostStartingPos[3]];										
																																					
	window.curDirection = ["right","left","left","right"];
	window.squareHolds = [[0],[0],[0],[0]];

	window.canvas = document.getElementById("canvas");
	window.ctx = canvas.getContext("2d");
	
	window.rollOut = [true, false, false, false]
	window.counter = 0;
	window.chase = true;
	window.targetTile = [];
	window.CHASE_TIMER = level + 15;
	window.count = 5;
	window.ultra = false;
	window.ultraCounter = 0;
	window.killed = [false, false, false, false];
	window.entry = true;

	setCanvasDimensions();
	
	createMap();

	window.timer = setInterval(function() { countdown() }, 900);
}

function countdown(){
	if(lives != 0){
		if(soundOn){
			start.play();
		}
		document.getElementById("countdown").className = "visible";
		document.getElementById("countdown").innerHTML = count;
		
		if(count == 0){
			clearInterval(timer);
			document.getElementById("countdown").className = "hidden";
			window.addEventListener("keydown", move, false);
			window.updateGame = setInterval(function() {updater()},GAME_SPEED);
			count = 5;
		}else{
			count--;
		}
	}
}

function updater(){
	if(!pause){
		
		newUpdate();

		findTargetTiles();
				
		if(key == "left" || key == "up" || key == "right" ||key == "down"){
			movePac(key);
		}
		
		if(!pacCatch){
			moveGhost();
		}else{
			pacCatch = false;	
		}
		
		checkGameEnd();	
	}
}

function newUpdate(){
	counter++;
	eating.pause();
	eating.currentTime = 0.5;
	
	if(ultra){
		ultraCounter++;	
		if(ultraCounter > 20){
			ultra = false;	
		}
	}
	
	if(counter == 10){
		rollOut[1] = true;	
	}else if(counter == 20){
		rollOut[2] = true;	
	}else if(counter == 30){
		rollOut[3] = true;	
	} //If its time to let each individual ghost be able to move out of its home
	
	var targetedHome = false;
	
	for(var i  = 0;i<targetTile.length;i++){
		if(targetTile[i].toString() == [11,9].toString()){
			targetedHome = true;
		}
	}
	
	if(targetedHome && !entry){
		map[9][9] = [0];
		entry = true;	
	}else if(entry && !targetedHome && map[10][8].toString() == [0].toString() && map [10][9].toString() == [0].toString() && map [10][10].toString() == [0].toString() && map[9][9].toString() == [0].toString()){
		map[9][9] = [2];
		entry = false;
	} //If there are no ghosts in the center 'T' area, seal it off
	
	if(counter%30 < CHASE_TIMER){
		chase = true;
	}else{
		chase = false;	
	} //Sets whether the ghosts are actively chasing or not
	
	ghostCurrentPos = [finder(4, "pos"),finder(5, "pos"), finder(6,"pos"), finder(7,"pos")];
	currentPos = finder(3, "pos"); //Updates object positions
	
	for(var i = 0;i<4;i++){
		if(killed[i] && ghostCurrentPos[i].toString() == [10,9].toString()){
			killed[i] = false;
		}
	}
}

function findTargetTiles(){
	
	targetTile = [];
	
	for(var i = 0;i<rollOut.length;i++){
		if(killed[i]){
			targetTile.push([11,9]);
		} else if(ultra){
			switch(i){
				case 0: targetTile.push([0,18]); break;
				case 1: targetTile.push([0,0]); break;
				case 2: targetTile.push([21,0]); break;
				case 3: targetTile.push([21,18]); break;
			}
		}else if(rollOut[i]){
			switch(i){
				case 0: if(chase) { targetTile.push(findBlinkyTile()); } else { targetTile.push([0,18]); }  break;
				case 1: if(chase) { targetTile.push(findPinkyTile()); } else { targetTile.push([0,0]); } break;
				case 2: if(chase) { targetTile.push(findInkyTile()); } else { targetTile.push([21,0]); } break;
				case 3: if(chase) { targetTile.push(findClydeTile()); } else { targetTile.push([21,18]); } break;
			}
		}else{
			targetTile.push([11,9]);
		}
	}	//Determines what tile on the map each ghost is trying to reach
}

function findBlinkyTile(){
	return currentPos;	 //Algorithm for blinky
}

function findPinkyTile(){
	switch(key){
		case "left":
			return [currentPos[0], currentPos[1]-3];
		case "right":
			return [currentPos[0], currentPos[1]+3];
		case "down":
			return [currentPos[0]+3, currentPos[1]];
		case "up":
			return [currentPos[0]-3, currentPos[1]];
	} //Algorithm for pinky
}

function findInkyTile(){
	var rowsDown = currentPos[0] - ghostCurrentPos[0][0];
	var columnsRight = currentPos[1] - ghostCurrentPos[0][1];
	
	var tempTile;
	
	switch(key){
		case "left":
			tempTile = [currentPos[0], currentPos[1]-2];
		case "right":
			tempTile = [currentPos[0], currentPos[1]+2];
		case "down":
			tempTile = [currentPos[0]+2, currentPos[1]];
		case "up":
			tempTile = [currentPos[0]-2, currentPos[1]];
	}
	
	tempTile = [tempTile[0] + rowsDown, tempTile[1] + columnsRight];
		
	return tempTile;	 //Algorithm for inky
}

function findClydeTile(){
	var centerXOfPac = currentPos[1]*BLOCK_SIZE*1.5;
	var centerYOfPac = currentPos[0]*BLOCK_SIZE*1.5;
	var centerXOfClyde = ghostCurrentPos[3][1]*BLOCK_SIZE*1.5;
	var centerYOfClyde = ghostCurrentPos[3][0]*BLOCK_SIZE*1.5;
	var radius = 8*BLOCK_SIZE;
	
	var inRadius = (centerXOfClyde - centerXOfPac)^2 + (centerYOfClyde - centerYOfPac)^2 <= radius^2;
	
	if(inRadius){
		return ghostStartingPos[3];	
	}else{
		return currentPos;	
	} //Algorithm for clyde
}

function checkGameEnd(){
	if(lives == 0){
		clearInterval(updateGame);
		map[startingPos[0]][startingPos[1]] = [0];
		endGame();	
	} //If there are no lives left, remove the update listener, and go to the game end function
	
	var pointsLeft = false;
	
	for(var i = 0;i<map.length;i++){
		for(var k = 0;k<map[i].length;k++){
			for(var j = 0;j<map[i][k].length;j++){
				if(map[i][k][j] == 1 || map[i][k][j] == 1.5){
					pointsLeft = true;
				}
			}
		}
	}
	
	if(pointsLeft){
		createMap();
	}else{
		level++;
		nextLevel();
	} //If the max score for that level is not reached, update map, otherwise go for a new level
}

function moveGhost(){

	var arrayOfMoves = [];
	
	for(var i = 0;i<4;i++){
		arrayOfMoves.push(new Array(0));	
	} //Creates available moves array
			
	for(var i = 0;i<4;i++){
		
		if(ghostCurrentPos[i].toString() == [10,0].toString() || map[ghostCurrentPos[i][0]][ghostCurrentPos[i][1]-1].toString() != [2].toString() && curDirection[i] != "right" && typeof(curDirection[i]) != 'undefined'){
			arrayOfMoves[i].push("left");			
		}
		
		if(map[ghostCurrentPos[i][0]-1][ghostCurrentPos[i][1]].toString() != [2].toString() && curDirection[i] != "down" && typeof(curDirection[i]) != 'undefined'){
			arrayOfMoves[i].push("up");
		}
		
		if(ghostCurrentPos[i].toString() == [10,18].toString() || map[ghostCurrentPos[i][0]][ghostCurrentPos[i][1]+1].toString() != [2].toString() && curDirection[i] != "left" && typeof(curDirection[i]) != 'undefined'){
			arrayOfMoves[i].push("right");
		}
		
		if(map[ghostCurrentPos[i][0]+1][ghostCurrentPos[i][1]].toString() != [2].toString() && curDirection[i] != "up" && typeof(curDirection[i]) != 'undefined'){
			arrayOfMoves[i].push("down");
		} 
		
		if(arrayOfMoves[i].length == 0){
			switch(curDirection[i]){
				case "left": arrayOfMoves[i].push("right"); break;
				case "right": arrayOfMoves[i].push("left"); break;
				case "up": arrayOfMoves[i].push("down"); break;
				case "down": arrayOfMoves[i].push("up"); break;
			}
		}
	
	} //Determines what moves the ghost can make
	
	var distances = [];

	for(var i = 0;i<4;i++){
		distances.push([]);	
	} //Creates a 2d distances array
		
	for(var i = 0;i<4;i++){
				
			for(var j = 0;j<arrayOfMoves[i].length;j++){
				
				switch(arrayOfMoves[i][j]){
					case "left":
						var xd = ghostCurrentPos[i][1]-1-targetTile[i][1];
						var yd = ghostCurrentPos[i][0]-targetTile[i][0];
						var distance = Math.sqrt(Math.pow(xd,2)+Math.pow(yd,2));
						distances[i].push(distance);
						break;
					case "up":
						var xd = ghostCurrentPos[i][1]-targetTile[i][1];
						var yd = ghostCurrentPos[i][0]-1-targetTile[i][0];
						var distance = Math.sqrt(Math.pow(xd,2)+Math.pow(yd,2));
						distances[i].push(distance);
						break;
					case "right":
						var xd = ghostCurrentPos[i][1]+1-targetTile[i][1];
						var yd = ghostCurrentPos[i][0]-targetTile[i][0];
						var distance = Math.sqrt(Math.pow(xd,2)+Math.pow(yd,2));
						distances[i].push(distance);
						break;
					case "down":
						var xd = ghostCurrentPos[i][1]-targetTile[i][1];
						var yd = ghostCurrentPos[i][0]+1-targetTile[i][0];
						var distance = Math.sqrt(Math.pow(xd,2)+Math.pow(yd,2));
						distances[i].push(distance);
						break;
				}
		} 
	} //Finding distances between target tiles and current ghost tile
	
	for(var i = 0;i<4;i++){
		if(pacIn(map[ghostCurrentPos[i][0]][ghostCurrentPos[i][1]])){
			map[ghostCurrentPos[i][0]][ghostCurrentPos[i][1]] = [3];	
		}else if(squareHolds[i][0] == 3){
			map[ghostCurrentPos[i][0]][ghostCurrentPos[i][1]] = [0];
		}else{
			map[ghostCurrentPos[i][0]][ghostCurrentPos[i][1]] = squareHolds[i];
		}
		curDirection[i] = arrayOfMoves[i][distances[i].indexOf(Math.min.apply(Math, distances[i]),0)];
	} //Setting current ghost tile to whats in square holds, also setting ghost direction to the shortest distance (found above)
		
	for(var i =0;i<4;i++){
		if(ghostCurrentPos[i].toString() == [10,0].toString() && curDirection[i] == "left"){
			squareHolds[i] = map[10][18];
		} else if(ghostCurrentPos[i].toString() == [10,18].toString() && curDirection[i] == "right"){
			squareHolds[i] = map[10][0];
		}else{
			switch(curDirection[i]){
				case "left":
						squareHolds[i] = map[ghostCurrentPos[i][0]][ghostCurrentPos[i][1]-1];
						break;
				case "up":
						squareHolds[i] = map[ghostCurrentPos[i][0]-1][ghostCurrentPos[i][1]];
						break;
				case "right":
						squareHolds[i] = map[ghostCurrentPos[i][0]][ghostCurrentPos[i][1]+1];
						break;
				case "down":
						squareHolds[i] = map[ghostCurrentPos[i][0]+1][ghostCurrentPos[i][1]];
						break;
			}	
		}
	}
	
	//Finds a new square holds
	
	var rand = true;
	
	for(var i = 0;i<4;i++){
		if (squareHolds[i][0] == 3){
			if(ultra && killed[i] != true){
				killed[i] = true;
				score += 50;
			}else if(!killed[i]){
				caught();
				rand = false;
			}
		}
	} //Sees if any of the ghosts move will collide with pac-man, sets a variable appropriately
	
	if(rand == true){
		for(var i = 0;i<4;i++){
			if(ghostCurrentPos[i].toString() == [10,0].toString() && curDirection[i] == "left"){
				  if(((ultra||killed[i])&&pacIn(map[10][18]))||ghostIn(map[10][18])){
						map[10][18].push([i+4]);  
				  }else{
						map[10][18] = [i+4];  
				  }
				  
				  ghostCurrentPos[i] = [10,18]
				  
			} else if(ghostCurrentPos[i].toString() == [10,18].toString() && curDirection[i] == "right"){
			  	if(((ultra||killed[i])&&pacIn(map[10][0]))||ghostIn(map[10][0])){
						map[10][0].push([i+4]);  
				  }else{
						map[10][0] = [i+4];  
				  }
				  
				  ghostCurrentPos[i] = [10,0]
			}else{
								
				switch(curDirection[i]){
					case "left":
						if(((ultra||killed[i])&&pacIn(map[ghostCurrentPos[i][0]][ghostCurrentPos[i][1]-1]))||ghostIn(map[ghostCurrentPos[i][0]][ghostCurrentPos[i][1]-1])){
							map[ghostCurrentPos[i][0]][ghostCurrentPos[i][1]-1].push([i+4]);
						}else{
							map[ghostCurrentPos[i][0]][ghostCurrentPos[i][1]-1] = [i+4];
						}
							ghostCurrentPos[i][1] = ghostCurrentPos[i][1]-1;
							break;
							
					case "up":
						if(((ultra||killed[i])&&pacIn(map[ghostCurrentPos[i][0]-1][ghostCurrentPos[i][1]]))||ghostIn(map[ghostCurrentPos[i][0]-1][ghostCurrentPos[i][1]])){
							map[ghostCurrentPos[i][0]-1][ghostCurrentPos[i][1]].push([i+4]);
						}else{
							map[ghostCurrentPos[i][0]-1][ghostCurrentPos[i][1]] = [i+4];
						}
							ghostCurrentPos[i][0] = ghostCurrentPos[i][0]-1;
							break;
					case "right":
						if(((ultra||killed[i])&&pacIn(map[ghostCurrentPos[i][0]][ghostCurrentPos[i][1]+1]))||ghostIn(map[ghostCurrentPos[i][0]][ghostCurrentPos[i][1]+1])){
							map[ghostCurrentPos[i][0]][ghostCurrentPos[i][1]+1].push([i+4]);
						}else{
							map[ghostCurrentPos[i][0]][ghostCurrentPos[i][1]+1] = [i+4];
						}
							ghostCurrentPos[i][1] = ghostCurrentPos[i][1]+1;
							break;
					case "down":
						if(((ultra||killed[i])&&pacIn(map[ghostCurrentPos[i][0]+1][ghostCurrentPos[i][1]]))||ghostIn(map[ghostCurrentPos[i][0]+1][ghostCurrentPos[i][1]])){
							map[ghostCurrentPos[i][0]+1][ghostCurrentPos[i][1]].push([i+4]);
						}else{
							map[ghostCurrentPos[i][0]+1][ghostCurrentPos[i][1]] = [i+4];
						}
							ghostCurrentPos[i][0] = ghostCurrentPos[i][0]+1;
							break;
				}
			}
		} //If a ghost isnt going to hit pacman, moves the ghosts to there next spot (pushes array if another ghost present, else replaces array)
	}
}

function pacIn(x){
	for(var i = 0;i<x.length;i++){
		if(x[i] == 3){
			return true;	
		}
	}
	return false;
}

function ghostIn(x){
	for(var i = 0;i<x.length;i++){
		if(x[i] > 3){
			return true;	
		}
	}
	return false; //Returns true if there is a ghost in the map square passed in as a parameter, else returns false
}	

function caught(){
	if(soundOn){
		death.play();
	}
	window.removeEventListener("keydown", move, false);
	clearInterval(updateGame);	
	setTimeout(function() { resettingCaught(); }, 1800);
	killed = [false, false, false, false]
	ultra = false;
	lives--;
	key = "right";
	rollOut = [true, false, false, false];
		
	squareHolds = [];
		
	map[9][9] = [0];
				
	for(var i = 0;i<4;i++){
		squareHolds.push(map[ghostStartingPos[i][0]][ghostStartingPos[i][1]]);
	}
		
	counter = 0;
	curDirection = ["right","left","left","right"];;
		
	currentPos = finder(3, "pos");
	x = currentPos[1]*BLOCK_SIZE;
	y = currentPos[0]*BLOCK_SIZE;

	map[currentPos[0]][currentPos[1]] = [0];
	
}

function resettingCaught(){
	for(var i = 0;i<4;i++){
		map[ghostStartingPos[i][0]][ghostStartingPos[i][1]] = [i+4];
	}
		
	map[startingPos[0]][startingPos[1]] = [3];
	createMap();
	
	window.timer = setInterval(function() { countdown() }, 900);

}

function move(e){
	e.preventDefault();
	e.stopPropagation();
	key = e.keyCode;
	
	if(key == 80){
		pause = !pause;
		key = prevKey;
		
		if(pause){
			document.getElementById("instructions").className = "visible";
			ctx.globalAlpha = 0.75;
			ctx.fillRect(0,0,canvas.width, canvas.height);
		}else{
			ctx.globalAlpha = 1;
			document.getElementById("instructions").className = "hidden";
		}
		
		return;
	}
	
	
	currentPos = finder(3, "pos");
	
	var possible = [];
	
	if(currentPos.toString() == [10,0].toString() || map[currentPos[0]][currentPos[1]-1].toString() != [2].toString()){
		possible.push(37);	
	}
	
	if(currentPos.toString() == [10,18].toString() || map[currentPos[0]][currentPos[1]+1].toString() != [2].toString()){
		possible.push(39);	
	}
	
	if(map[currentPos[0]-1][currentPos[1]].toString() != [2].toString()){
		possible.push(38);	
	}
	
	if(currentPos.toString() != [8,9].toString() && map[currentPos[0]+1][currentPos[1]].toString() != [2].toString()){
		possible.push(40);	
	}
		
	var keyPossible = false;
	
	for(var i = 0;i<possible.length;i++){
		if(possible[i] == key){
			keyPossible = true;	
		}
	}
		
	
	if(keyPossible){
		switch (key){
			case 37:
				key = "left";	break;
			case 38:
				key = "up";		break;
			case 39:
				key = "right";	break;
			case 40:
				key = "down";	break;
			default:
				key = prevKey;
		}
	
		prevKey = key;
	}else{
		key = prevKey;	
	}
} //Find direction

function movePac(d){
		
	if(d == "left" && currentPos.toString() == [10,0].toString()){
		for(var i = 0;i<map[10][18].length;i++){
			if(map[10][18][i] == 1){
				score++;
				if(soundOn){
					eating.play();
				}
			}
		}
		
		if(parseInt(map[10][18].toString()) < 3 && map[10][18].length == 1){
			map[10][0] = [0];
			map[10][18] = [3];
			pacMove++;	
		}else{
			var allDead = true;
			for(var i = 0;i<map[10][18].length;i++){
				if(killed[map[10][18][i]-4] != true){
					allDead = false;	
				}
			}
			
			if(!allDead && !ultra){
				for(var i = 0;i<4;i++){
					map[ghostCurrentPos[i][0]][ghostCurrentPos[i][1]] = squareHolds[i];
				}
				caught();
			}
			
			if(ultra){
				for(var i = 0;i<map[10][18].length;i++){
					if(killed[map[10][18][i]-4] != true){
						killed[map[10][18][i]-4] = true;	
					}
				}
			}
		}
		return;
	}else if(d == "right" && currentPos.toString() == [10,18].toString()){
		for(var i = 0;i<map[10][0].length;i++){
			if(map[10][0][i] == 1){
				score++;
				if(soundOn){
					eating.play();
				}
			}
		}
		
		if(parseInt(map[10][0].toString()) < 3 && map[10][0].length == 1){
			map[10][18] = [0];
			map[10][0] = [3];
			pacMove++;	
		}else{
			var allDead = true;
			for(var i = 0;i<map[10][0].length;i++){
				if(killed[map[10][0][i]-4] != true){
					allDead = false;	
				}
			}
			
			if(!allDead && !ultra){
				for(var i = 0;i<4;i++){
					map[ghostCurrentPos[i][0]][ghostCurrentPos[i][1]] = squareHolds[i];
				}
				caught();
			}
			
			if(ultra){
				for(var i = 0;i<map[10][18].length;i++){
					if(killed[map[10][0][i]-4] != true){
						killed[map[10][0][i]-4] = true;	
					}
				}
			}
		}	
		return;
	}
	
	var valid = true;	
	
	switch(d){
		case "left":
			if(map[currentPos[0]][currentPos[1]-1].toString() == [2].toString()){				
				valid = false;
			}else if(parseInt(map[currentPos[0]][currentPos[1]-1].toString()) > 3 | map[currentPos[0]][currentPos[1]-1].length > 1){
				var allDead = true;
				for(var i = 0;i<map[currentPos[0]][currentPos[1]-1].length;i++){
					if(killed[map[currentPos[0]][currentPos[1]-1][i]-4] != true){
						allDead = false;	
					}
				}
				if(!allDead && !ultra){	
					for(var i = 0;i<4;i++){
						map[ghostCurrentPos[i][0]][ghostCurrentPos[i][1]] = squareHolds[i];
					}
					caught();
					pacCatch = true;		
				}	
				
				if(ultra){
					for(var i = 0;i<map[currentPos[0]][currentPos[1]-1].length;i++){
						if(killed[map[currentPos[0]][currentPos[1]-1][i]-4] != true){
							killed[map[currentPos[0]][currentPos[1]-1][i]-4] = true;	
						}
					}
				} 
			}
			break;
		case "up":
			if(map[currentPos[0]-1][currentPos[1]].toString() == [2].toString()){
				valid = false;
			}else if(parseInt(map[currentPos[0]-1][currentPos[1]].toString()) > 3 | map[currentPos[0]-1][currentPos[1]].length > 1){
				var allDead = true;
				for(var i = 0;i<map[currentPos[0]-1][currentPos[1]].length;i++){
					if(killed[map[currentPos[0]-1][currentPos[1]][i]-4] != true){
						allDead = false;	
					}
				}					
				if(!allDead && !ultra){
					for(var i = 0;i<4;i++){
						map[ghostCurrentPos[i][0]][ghostCurrentPos[i][1]] = squareHolds[i];
					}
					caught();
					pacCatch = true;
				}
				
				if(ultra){
					for(var i = 0;i<map[currentPos[0]-1][currentPos[1]].length;i++){
						if(killed[map[currentPos[0]-1][currentPos[1]][i]-4] != true){
							killed[map[currentPos[0]-1][currentPos[1]][i]-4] = true;	
						}
					}
				}
			}
			break;
		case "right":
			if(map[currentPos[0]][currentPos[1]+1].toString() == [2].toString()){
				valid = false;
			}else if(parseInt(map[currentPos[0]][currentPos[1]+1].toString()) > 3 | map[currentPos[0]][currentPos[1]+1].length > 1){
				var allDead = true;
				for(var i = 0;i<map[currentPos[0]][currentPos[1]+1].length;i++){
					if(killed[map[currentPos[0]][currentPos[1]+1][i]-4] != true){
						allDead = false;	
					}
				}
				if(!allDead && !ultra){
					for(var i = 0;i<4;i++){
						map[ghostCurrentPos[i][0]][ghostCurrentPos[i][1]] = squareHolds[i];
					}
					caught();
					pacCatch = true;
				}
				if(ultra){
					for(var i = 0;i<map[currentPos[0]][currentPos[1]+1].length;i++){
						if(killed[map[currentPos[0]][currentPos[1]+1][i]-4] != true){
							killed[map[currentPos[0]][currentPos[1]+1][i]-4] = true;	
						}
					}
				}
			}
			break;
		case "down":
			if(map[currentPos[0]+1][currentPos[1]].toString() == [2].toString()){
				valid = false;
			}else if(parseInt(map[currentPos[0]+1][currentPos[1]].toString()) > 3 | map[currentPos[0]+1][currentPos[1]].length >1){
				var allDead = true;
				for(var i = 0;i<map[currentPos[0]+1][currentPos[1]].length;i++){
					if(killed[map[currentPos[0]+1][currentPos[1]][i]-4] != true){
						allDead = false;	
					}
				}			
				if(!allDead && !ultra){
					for(var i = 0;i<4;i++){
						map[ghostCurrentPos[i][0]][ghostCurrentPos[i][1]] = squareHolds[i];
					}	
				caught();	
				pacCatch = true;
				}
				if(ultra){
					for(var i = 0;i<map[currentPos[0]+1][currentPos[1]].length;i++){
						if(killed[map[currentPos[0]+1][currentPos[1]][i]-4] != true){
							killed[map[currentPos[0]+1][currentPos[1]][i]-4] = true;	
						}
					}
				}
			}
			break;
	}
		
	if(pacCatch){
		return;	
	}
		
	if(valid){
		map[currentPos[0]][currentPos[1]] = [0];
		
		switch(key){
			case "left":
				for(var i = 0;i<map[currentPos[0]][currentPos[1]-1].length;i++){
					if(map[currentPos[0]][currentPos[1]-1][i] == 1){
						score++;
						if(soundOn){
							eating.play();
						}
					}else if(map[currentPos[0]][currentPos[1]-1][i] == 1.5){
						score += 10;
						if(soundOn){
							eating.play();
						}
						ultra = true;
						ultraCounter = 0;
					}	
				}
					
				map[currentPos[0]][currentPos[1]-1] = [3];
				
				break;
			case "up":
				for(var i = 0;i<map[currentPos[0]-1][currentPos[1]].length;i++){
					if(map[currentPos[0]-1][currentPos[1]][i] == 1){
						score++;
						if(soundOn){
							eating.play();
						}
					}else if(map[currentPos[0]-1][currentPos[1]][i] == 1.5){
						score += 10;
						if(soundOn){
							eating.play();
						}
						ultra = true;
						ultraCounter = 0;
					}	
				}
				
				map[currentPos[0]-1][currentPos[1]] = [3];
				
				break;
			case "right":
				for(var i = 0;i<map[currentPos[0]][currentPos[1]+1].length;i++){
					if(map[currentPos[0]][currentPos[1]+1][i] == 1){
						score++;
						if(soundOn){
							eating.play();
						}
					}else if(map[currentPos[0]][currentPos[1]+1][i] == 1.5){
						score += 10;
						if(soundOn){
							eating.play();
						}
						ultra = true;
						ultraCounter = 0;
					}	
				}
				
				map[currentPos[0]][currentPos[1]+1] = [3];
				
				break;
			case "down":
				for(var i = 0;i<map[currentPos[0]+1][currentPos[1]].length;i++){
					if(map[currentPos[0]+1][currentPos[1]][i] == 1){
						score++;
						if(soundOn){
							eating.play();
						}
					}else if(map[currentPos[0]+1][currentPos[1]][i] == 1.5){
						score += 10;
						if(soundOn){
							eating.play();
						}
						ultra = true;
						ultraCounter = 0;
					}	
				}
				
				map[currentPos[0]+1][currentPos[1]] = [3];
				
				break;
		}
		pacMove++;
	}
} //Move pac

function nextLevel(){
	clearInterval(updateGame);
	init();	
} //Next level

function endGame(){
	clearInterval(timer);
	updateGameData();
	window.removeEventListener("keydown",move,false);	
	document.getElementById("overlay").innerHTML = " <br /> <span> Game Over </span> <br /> <img src='Images/gg.png'/>";
	document.getElementById("overlay").style.height = "auto";
	document.getElementById("wrapper").innerHTML += " </br> <a href='../index.html'><p> Click here to go back to the arcade </p></a>";
	document.getElementById("extra").innerHTML = "";
	if(highscores[9] < score){
		highscore();
	}
	showScores();
}	//End game

function highscore(){
	var name = prompt("Congratulations, you got a highscore! Please enter your name below");
	
	if(name == "" || name == null){
		alert("No name entered? You are now Uncle Bob");
		name = "Uncle Bob";	
	}
		
	highscores.push(score);
	highscores.sort(function(a, b){return b-a});
	highscores.splice(10,1);
	
	var noOfNumbers = 0;
	
	for(var i =0;i<highscores.length;i++){
		if(typeof highscores[i] == "number"){
			noOfNumbers++;	
		}
	}	
	
	if(noOfNumbers == 1){
		for(var i = 0;i<highscores.length;i++){
			if(typeof highscores[i] == "number"){
				names.splice(i,0,name);
			}
		}
	}else{
		names.splice(0,0,name);	
	}
		
	names.splice(10,1);
			
	for(var i = 1; i<= 10;i++){
		localStorage.setItem("score" + i.toString(),highscores[i-1]);
		localStorage.setItem("name" + i.toString(),names[i-1]);
	}
}

function showScores(){
	var area = document.getElementById("extra");
	var tableString = "<table><tr><th>Rank</th><th>Name</th><th>Score</th></tr>";

	for(var i = 0; i < 10; i++){
		tableString += "<tr><td>" + parseInt(i+1) + "</td><td>" + names[i] + "</td><td>" + highscores[i] + "</td></tr>";	
	}
	
	tableString += "</table>";
	
	area.innerHTML = tableString;
}

function finder(what, why){
	
	var o = 0;
	
	for(var i = 0; i<ROWS;i++){
		for(var k = 0;k<COLS;k++){
			for(var j = 0;j<map[i][k].length;j++){
				if(map[i][k][j] == what){
					switch(why){
						case "pos":
							var temp = [i , k]
							return temp;
						case "num":
							o++;
							break;
						default:
							console.log("ERROR UNKNOWN FIND");	
					}
				}	
			}			
		}
	}
	return o;
} //Finder

function createMap(){
	
	ctx.clearRect(0,0,canvas.width,canvas.height);
	
	ghostMove++;
	updateGameData();
	
	var pacPos = (pacMove%animationNum)*BLOCK_SIZE;
	var ghostPos = (ghostMove%animationNum)*BLOCK_SIZE;
	
	for(var i = 0;i<ROWS;i++){
		for(var k=0;k<COLS;k++){
			
			var tempx = k*BLOCK_SIZE;
			var tempy = i*BLOCK_SIZE;
						
			for(var j = 0;j<map[i][k].length;j++){
			
				switch(map[i][k][j]){
					case 0: ctx.drawImage(blank,tempx,tempy,BLOCK_SIZE,BLOCK_SIZE);	break;
					case 1: ctx.drawImage(points,tempx,tempy,BLOCK_SIZE,BLOCK_SIZE); break;
					case 1.5: ctx.drawImage(ultraPoints,tempx,tempy,BLOCK_SIZE,BLOCK_SIZE); break;
					case 2: ctx.drawImage(block,tempx,tempy,BLOCK_SIZE,BLOCK_SIZE);	break;
					case 3: ctx.drawImage(eval("pacman_" + key + "_sprite_small"),pacPos,0,BLOCK_SIZE,BLOCK_SIZE,tempx,tempy,BLOCK_SIZE,BLOCK_SIZE); break;
					case 4: 
						if(killed[0]){
							ctx.drawImage(ghost_eyes,ghostPos,0,BLOCK_SIZE,BLOCK_SIZE,tempx,tempy,BLOCK_SIZE,BLOCK_SIZE);
						}else if(ultra){
							ctx.drawImage(ghost_ultra,ghostPos,0,BLOCK_SIZE,BLOCK_SIZE,tempx,tempy,BLOCK_SIZE,BLOCK_SIZE);
						}else{
							ctx.drawImage(ghost_red_sprite_small,ghostPos,0,BLOCK_SIZE,BLOCK_SIZE,tempx,tempy,BLOCK_SIZE,BLOCK_SIZE);
						}
						break;
					case 5: 
						if(killed[1]){
							ctx.drawImage(ghost_eyes,ghostPos, 0,BLOCK_SIZE,BLOCK_SIZE,tempx,tempy,BLOCK_SIZE,BLOCK_SIZE);
						}else if(ultra){
							ctx.drawImage(ghost_ultra,ghostPos,0,BLOCK_SIZE,BLOCK_SIZE,tempx,tempy,BLOCK_SIZE,BLOCK_SIZE);
						}else{
							ctx.drawImage(ghost_pink_sprite_small,ghostPos,0,BLOCK_SIZE,BLOCK_SIZE,tempx,tempy,BLOCK_SIZE,BLOCK_SIZE);
						}
						break;					
					case 6: 
						if(killed[2]){
							ctx.drawImage(ghost_eyes, ghostPos, 0,BLOCK_SIZE,BLOCK_SIZE,tempx,tempy,BLOCK_SIZE,BLOCK_SIZE);
						}else if(ultra){
							ctx.drawImage(ghost_ultra,ghostPos,0,BLOCK_SIZE,BLOCK_SIZE,tempx,tempy,BLOCK_SIZE,BLOCK_SIZE);
						}else{
							ctx.drawImage(ghost_blue_sprite_small,ghostPos,0,BLOCK_SIZE,BLOCK_SIZE,tempx,tempy,BLOCK_SIZE,BLOCK_SIZE);
						}
						break;
					case 7: 
						if(killed[3]){
							ctx.drawImage(ghost_eyes, ghostPos, 0,BLOCK_SIZE,BLOCK_SIZE,tempx,tempy,BLOCK_SIZE,BLOCK_SIZE);
						}else if(ultra){
							ctx.drawImage(ghost_ultra,ghostPos,0,BLOCK_SIZE,BLOCK_SIZE,tempx,tempy,BLOCK_SIZE,BLOCK_SIZE);
						}else{
							ctx.drawImage(ghost_orange_sprite_small,ghostPos,0,BLOCK_SIZE,BLOCK_SIZE,tempx,tempy,BLOCK_SIZE,BLOCK_SIZE);
						}
						break;
				}	
			}
		}
	}
} //Create map

function loadImages(){

	window.blank = new Image();			
	
	blank.src = "Images/blank.png";
	
	window.points = new Image();

	points.src = "Images/points.png";
	
	window.block = new Image();

	block.src = "Images/block.png";
	
	window.pacman_down_sprite_small = new Image();

	pacman_down_sprite_small.src = "Images/pacman_down_sprite_small.png";
	
	window.pacman_right_sprite_small = new Image();
	
	pacman_right_sprite_small.src = "Images/pacman_right_sprite_small.png";
	
	window.pacman_left_sprite_small = new Image();
	
	pacman_left_sprite_small.src = "Images/pacman_left_sprite_small.png";
	
	window.pacman_up_sprite_small = new Image();
	
	pacman_up_sprite_small.src = "Images/pacman_up_sprite_small.png";
	
	window.ghost_red_sprite_small = new Image();
	
	ghost_red_sprite_small.src = "Images/ghost_red_sprite_small.png";
	
	window.ghost_pink_sprite_small = new Image();
		
	ghost_pink_sprite_small.src = "Images/ghost_pink_sprite_small.png";
	
	window.ghost_blue_sprite_small = new Image();
		
	ghost_blue_sprite_small.src = "Images/ghost_blue_sprite_small.png";
	
	window.ghost_orange_sprite_small = new Image();
	
	ghost_orange_sprite_small.src = "Images/ghost_orange_sprite_small.png";
	
	window.ghost_eyes = new Image();
	
	ghost_eyes.src = "Images/ghost_eyes.png";

	window.ultraPoints = new Image();
		
	ultraPoints.src = "Images/superPoints.png";
	
	window.ghost_ultra = new Image();
	
	ghost_ultra.src = "Images/ghost_ultra.png";
} //Load images

function loadSounds(){
	window.soundOn = true;
	window.startBGM = new Audio("Audio/start.ogg");
	startBGM.play();
	window.eating = new Audio("Audio/eating.ogg");
	window.start = new Audio("Audio/starting.ogg");
	window.death = new Audio("Audio/death.ogg");
}

function loadScores(){
	window.highscores = [];
	window.names = [];
	
	for(var i = 1; i<= 10 ; i++){
		var score = localStorage.getItem("score" + i.toString());
		var name = localStorage.getItem("name" + i.toString());
		
		if(score == null){
			score = 0;	
		}
		if(name == null){
			name = "-----";
		}	
		
		highscores.push(score);
		names.push(name);
	}	
}

function setCanvasDimensions(){
	document.getElementById("canvas").setAttribute("width", parseInt(COLS*BLOCK_SIZE) + "px");
	document.getElementById("canvas").className = "visible";
	document.getElementById("canvas").setAttribute("height", parseInt(ROWS*BLOCK_SIZE) + "px");
	document.getElementById("wrapper").setAttribute("style", "width:" + parseInt(COLS*BLOCK_SIZE) + "px");
	document.getElementById("extra").innerHTML = "Press 'P' to pause and view instructions";
	document.getElementById("instructions").setAttribute("style", "bottom:" + parseInt(ROWS*BLOCK_SIZE) + "px");
	document.getElementById("countdown").setAttribute("style", "bottom:" + parseInt(ROWS*BLOCK_SIZE) + "px");
	document.getElementById("overlay").style.height = parseInt(ROWS*BLOCK_SIZE) + "px";
} //Set canvas dimensions

function updateGameData(){	
	document.getElementById("score").innerHTML = "Score: " + score;
	document.getElementById("lives").innerHTML = "Lives: <img id='livesDisplay'/>";
	document.getElementById("livesDisplay").setAttribute("src", "Images/" + lives + "_lives.png");
	document.getElementById("level").innerHTML = "Level: " + level;
} //Update game data