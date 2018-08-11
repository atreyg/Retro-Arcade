window.addEventListener("load", keyPress, false);

function keyPress(){
	window.addEventListener("keydown", init, false);
}

function init(){
	window.removeEventListener("keydown", init, false);
	document.getElementById("overlay").innerHTML = "<canvas id='canvas' tabindex='1' class='visible'></canvas>";
	
	window.counter = 0;
	window.COLS = 10;
	window.ROWS = 21;
	window.BLOCK_SIZE = 25;
	window.map =  [	[0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0] ]
	
	window.canvas = document.getElementById("canvas");
	window.ctx = canvas.getContext("2d");
	
	setCanvasDimensions();
	
	window.hardDrop = false;
	window.block;
	window.blockType;
	window.moveDown = true;
	window.canLeft;
	window.canRight;
	window.leftActive = false;
	window.rightActive = false;
	
	window.GAME_SPEED_NORMAL = 50;
	window.GAME_SPEED = GAME_SPEED_NORMAL;
	
	window.linesCleared = 0;
	window.level = 1;
	window.score = 0;
	
	window.updater = setInterval(function(){ updateGame() }, 1);

	loadImages();	
	createBlock();
	drawMap();	
	
	window.addEventListener("keydown", keyPressTheSecond, false);
}

function loadImages(){
	window.blank = new Image();
	 
	 blank.onload =  new function (blank) {
		 return function(){
		 }
	 }(blank);
	 
	 blank.src = "Images/blank.png";
	 
	 window.fixedBlock = new Image();
	 
	 fixedBlock.onload =  new function (fixedBlock) {
		 return function(){
		 }
	 }(fixedBlock);
	 
	 fixedBlock.src = "Images/fixedBlock.png";
	 
	 window.I_block = new Image();
	 
	 I_block.onload =  new function (I_block) {
		 return function(){
		 }
	 }(I_block);
	 
	 I_block.src = "Images/I_block.png";
	 
	 window.L_block = new Image();
	 
	 L_block.onload =  new function (L_block) {
		 return function(){
		 }
	 }(L_block);
	 
	 L_block.src = "Images/L_block.png";
	 
	 window.O_block = new Image();
	 
	 O_block.onload =  new function (O_block) {
		 return function(){
		 }
	 }(O_block);
	 
	 O_block.src = "Images/O_block.png";
	 
	 window.J_block = new Image();
	 
	 J_block.onload =  new function (J_block) {
		 return function(){
		 }
	 }(J_block);
	 
	 J_block.src = "Images/J_block.png";
	 
	 window.S_block = new Image();
	 
	 S_block.onload =  new function (S_block) {
		 return function(){
		 }
	 }(S_block);
	 
	 S_block.src = "Images/S_block.png";
	 
	 window.T_block = new Image();
	 
	 T_block.onload =  new function (T_block) {
		 return function(){
		 }
	 }(T_block);
	 
	 T_block.src = "Images/T_block.png";
	 
	 window.Z_block = new Image();
	 
	 Z_block.onload =  new function (Z_block) {
		 return function(){
		 }
	 }(Z_block);
	 
	 Z_block.src = "Images/Z_block.png";
	 
	 window.transparent = new Image();
	 
	 transparent.onload =  new function (transparent) {
		 return function(){
		 }
	 }(transparent);
	 
	 transparent.src = "Images/transparent.png";
} //Load Images

function createBlock(){
	var rand = Math.floor(Math.random() * 7);
	
	switch (rand) {
		case 0: block = new I(); break;
		case 1:	block = new L(); break;
		case 2: block = new Z(); break;
		case 3: block = new O(); break;
		case 4: block = new S(); break;
		case 5: block = new T(); break;
		case 6: block = new J(); break;
	}
	
	blockType = block.constructor.name;
	
	var blocksAble = 0;
	
	for(var i = block.rowIndex; i < block.rowIndex + block.size ; i++){
		for(var k = block.colIndex; k < block.colIndex + block.size ; k++){
			if(map[i][k].length != 2 && block.rotations[block.rotation%block.rotations.length][i-block.rowIndex][k-block.colIndex] != 0){
				map[i][k] = block.rotations[block.rotation%block.rotations.length][i-block.rowIndex][k-block.colIndex];
				blocksAble++;
			}
		}
	}
	
	if(blocksAble != 4){
		gameOver();	
	}
	
} //Initial setting of block

function keyPressTheSecond(e){
	var key = e.keyCode;
	
	if(key == 38){
		rotate();
	}
	
	if(key == 32){
		hardDrop = true;
		GAME_SPEED = 1;	
	}
	
	if(key == 39){
		rightActive = true;
		leftActive = false;
	}
	
	if(key == 37){
		leftActive = true;
		rightActive = false;
	}
}

function rotate(){
	var centerPoint = [];
	//Finding current surrounding array that holds it
		for(var i = 0;i<ROWS;i++){
			for(var k = 0;k<COLS;k++){
				if(map[i][k] == 2){
					centerPoint.push(i);
					centerPoint.push(k);
				}
			}
		}
	
	var diff = (block.size - 1)/2;
	
	var topLeft = [centerPoint[0]-diff,centerPoint[1]-diff];
		
	block.rotation++;
	var nextRotation = block.rotations[block.rotation%block.rotations.length];
	
	var rotatable = true;
	
	for(var i = topLeft[0];i<(topLeft[0]+block.size);i++){
		for(var k = topLeft[1]; k<(topLeft[1]+block.size);k++){				
			if(typeof map[i][k] == 'undefined' || map[i][k].length == 2){
				rotatable = false;	
			}
		}
	}
	
	if(rotatable){
	
		for(var i = topLeft[0];i<(topLeft[0]+block.size);i++){
			for(var k = topLeft[1]; k<(topLeft[1]+block.size);k++){			
				if(map[i][k].length != 1){
				map[i][k] = 0;
				}
								
				if(nextRotation[i-topLeft[0]][k-topLeft[1]] != 0){
					map[i][k] = nextRotation[i-topLeft[0]][k-topLeft[1]];
				}
			}
		}
	}
}


function gameOver(){
	document.getElementById("overlay").innerHTML = " <br /> Game Over <br /> <img src='Images/gg.png'/>";
	document.getElementById("wrapper").innerHTML += " </br> </br> <a href='../index.html'><p> Click here to go back to the arcade </p></a>";
	clearInterval(updater);
}

function updateGame(){
	counter++;
	moveBlock();
	 if(counter%GAME_SPEED == 0) { clearLines(); }
	 drawMap();
}

function clearLines(){
	
	var inOneGo = 0;

	for(var i = 0;i<ROWS;i++){
		
		var cleared = true;

		for(var k = 0;k<COLS;k++){
			if(map[i][k].length != 2){
				cleared = false;	
			}
		}
		
		if(cleared){
			pushLines(i);
			linesCleared++;
			level = Math.floor(linesCleared/5)+1;
			GAME_SPEED_NORMAL -= level*2;	
			inOneGo++;
		}
	}
	
	var points;
	
	switch(inOneGo){
		case 0: points = level * 10; break;
		case 1: points = level * 100; break;
		case 2: points = level * 300; break;
		case 3: points = level * 500; break;
		case 4: points = level * 800; break;
	}
		
	score += points;
}

function updateGameData(){	
		document.getElementById("level").innerHTML = "Level: " + level;
		document.getElementById("lines").innerHTML = "Lines: " + linesCleared;
		document.getElementById("score").innerHTML = "Score: <br>" + score;
}

function pushLines(line){
		
	var data;

	for(var i = line; i > 0;i--){
		data = map[i-1];
		map[i] = data;	
	}
	
	map[0] = [0,0,0,0,0,0,0,0,0,0];
}

function checkHit(){
	
	canLeft = true;
	canRight = true;
	moveDown = true;	

					
	for(var i = 0;i<ROWS;i++){
		if(map[i][0] == 1 || map[i][0] == 2){
			canLeft = false;
		}
	} //Checks to the very left
	
	for(var i = 0;i<ROWS;i++){
		if(map[i][COLS-1] == 1 || map[i][COLS-1] == 2){
			canRight = false;
		}
	} // Checks to the very right
										
	for(var i = 0;i<map[ROWS-1].length;i++){
		if(map[ROWS-1][i] == 1 || map[ROWS-1][i] == 2){
			moveDown = false;
		}
	} //Block cant be moved cuz its on the bottom row
	
	var fixedIndexes = [];
	
	for(var i =0;i<ROWS;i++){
		for(var k = 0;k<COLS;k++){
			if(map[i][k].length == 2){
				var temp = [i,k]
				fixedIndexes.push(temp);
			}
		}
	} //Indexes of fixed blocks
	
	for(var i = 0;i<fixedIndexes.length;i++){
		if(map[fixedIndexes[i][0]][fixedIndexes[i][1]+1] == 1 || map[fixedIndexes[i][0]][fixedIndexes[i][1]+1] == 2){
			canLeft = false;
		}
	}//Checks to the left for fixed Indexes
	
	for(var i = 0;i<fixedIndexes.length;i++){
		if(map[fixedIndexes[i][0] - 1][fixedIndexes[i][1]] == 1 || map[fixedIndexes[i][0] - 1][fixedIndexes[i][1]] == 2){
			moveDown = false;
		}
	} //Checks the spot above fixed Indexes to see if block can move down
	
	for(var i = 0;i<fixedIndexes.length;i++){
		if(map[fixedIndexes[i][0]][fixedIndexes[i][1]-1] == 1 || map[fixedIndexes[i][0]][fixedIndexes[i][1]-1] == 2){
			canRight = false;
		}
	} //Checks to the right for fixedIndexes	
}

function moveBlock(){
	
	var indexes = [];
	var centerPoint = [];
		
	for(var i=0;i<map.length;i++){
		for(var k = 0;k<map[i].length;k++){
			if(map[i][k] == 1){
				var temp = [i,k];
				indexes.push(temp);	
			}
			
			if(map[i][k] == 2){
				centerPoint.push(i);
				centerPoint.push(k);	
			}
		}
	} //Finds points of the blocks
	
	checkHit();
	
	
	if(canRight && rightActive){
		for(var i=0;i<indexes.length;i++){
			map[indexes[i][0]][indexes[i][1]] = 0;
		}
						
		map[centerPoint[0]][centerPoint[1]] = 0; //Clears current Pos
						
		for(var i=0;i<indexes.length;i++){
			map[indexes[i][0]][indexes[i][1]+1] = 1;
		}
						
		map[centerPoint[0]][centerPoint[1]+1] = 2; //Puts at new Pos				
		
	} else if (canLeft && leftActive){
		for(var i=0;i<indexes.length;i++){
			map[indexes[i][0]][indexes[i][1]] = 0;
		}
						
		map[centerPoint[0]][centerPoint[1]] = 0; //Clears current Pos
						
		for(var i=0;i<indexes.length;i++){
			map[indexes[i][0]][indexes[i][1]-1] = 1;
		}
						
		map[centerPoint[0]][centerPoint[1]-1] = 2; //Puts at new Pos
	}
	
	rightActive = false;
	leftActive = false;	

	checkHit();
	
	var indexes = [];
	var centerPoint = [];
		
	for(var i=0;i<map.length;i++){
		for(var k = 0;k<map[i].length;k++){
			if(map[i][k] == 1){
				var temp = [i,k];
				indexes.push(temp);	
			}
			
			if(map[i][k] == 2){
				centerPoint.push(i);
				centerPoint.push(k);	
			}
		}
	}

	if(counter%GAME_SPEED == 0){

	if(moveDown){
			
		for(var i=0;i<indexes.length;i++){
			map[indexes[i][0]][indexes[i][1]] = 0;
		}
		
		map[centerPoint[0]][centerPoint[1]] = 0; //Clears current Pos
		
		for(var i=0;i<indexes.length;i++){
			//map[indexes[i][0]][indexes[i][1]] = 0;
			map[indexes[i][0]+1][indexes[i][1]] = 1;
		}
		
		map[centerPoint[0]+1][centerPoint[1]] = 2; //Puts at new Pos
		
	}else{
		setFixed();
		createBlock();	
	}

	}
	
} //Move block

function setFixed(){
	for(var i=0;i<map.length;i++){
		for(var k = 0;k<map[i].length;k++){
			if(map[i][k] == 1 || map[i][k] == 2){
				map[i][k] = [3,blockType];
			}
		}
	} //Finds blocks and 'fixes' them
	
	canLeft = false;
	canRight = false;
	
	if(hardDrop){
		hardDrop = false;
		GAME_SPEED = GAME_SPEED_NORMAL;	
	}
} //Set fixed

function L(){
	
	this.rotation_0 = [ [0,1,0],
						[0,2,0],
						[0,1,1] ];
					
	this.rotation_1 = [ [0,0,0],
						[1,2,1],
						[1,0,0] ];
	
	this.rotation_2 = [ [1,1,0],
						[0,2,0],
						[0,1,0] ];
					
	this.rotation_3 = [ [0,0,1],
						[1,2,1],
						[0,0,0] ];
						
	this.rotations = [this.rotation_0,this.rotation_1,this.rotation_2,this.rotation_3];
	
	this.rowIndex = 0;
	this.colIndex = 3;
	this.rotation = 0;
	this.size = 3;
}
	
function I(){
	
	this.rotation_1 = [	[0,0,0,0,0],
						[0,0,0,0,0],
						[0,1,2,1,1],
						[0,0,0,0,0],
						[0,0,0,0,0] ];
	
	this.rotation_0 = [ [0,0,1,0,0],
						[0,0,1,0,0],
						[0,0,2,0,0],
						[0,0,1,0,0],
						[0,0,0,0,0] ];
						
	this.rotations = [this.rotation_0, this.rotation_1];

	this.rowIndex = 0;
	this.colIndex = 2;
	
	this.rotation = 0;

	this.size = 5;
}
	
function T(){
	
	this.rotation_0 = [ [0,1,0],
						[1,2,1],
						[0,0,0] ];
	
	this.rotation_1 = [ [0,1,0],
						[0,2,1],
						[0,1,0] ];
	
	this.rotation_2 = [ [0,0,0],
						[1,2,1],
						[0,1,0] ];
						
	this.rotation_3 = [ [0,1,0],
						[1,2,0],
						[0,1,0] ];
						
	this.rotations = [this.rotation_0,this.rotation_1,this.rotation_2,this.rotation_3];
	
	this.rowIndex = 0;
	this.colIndex = 3;
	
	this.rotation = 0;
	
	this.size = 3;

}

function J(){
	
	this.rotation_0 = [ [0,1,0],
						[0,2,0],
						[1,1,0] ];
					
	this.rotation_1 = [ [1,0,0],
						[1,2,1],
						[0,0,0] ];
	
	this.rotation_2 = [ [0,1,1],
						[0,2,0],
						[0,1,0] ];
					
	this.rotation_3 = [ [0,0,0],
						[1,2,1],
						[0,0,1] ];
						
	this.rotations = [this.rotation_0,this.rotation_1,this.rotation_2,this.rotation_3];
	
	this.rowIndex = 0;
	this.colIndex = 3;
	
	this.rotation = 0;
	
	this.size = 3;	
}

function Z(){
	
	this.rotation_0 = [ [1,1,0],
						[0,2,1],
						[0,0,0] ];
	
	this.rotation_1 = [ [0,0,1],
						[0,2,1],
						[0,1,0] ];
						
	this.rotations = [this.rotation_0,this.rotation_1];
		
	this.rowIndex = 0;
	this.colIndex = 3;
	
	this.rotation = 0;
	this.size = 3;

}

function S(){
	
	this.rotation_0 = [	[0,1,1],
						[1,2,0],
						[0,0,0] ];
	
	this.rotation_1 = [ [1,0,0],
						[1,2,0],
						[0,1,0] ];
						
	this.rotations = [this.rotation_0,this.rotation_1];
	
	this.rotation = 0;
	
	this.rowIndex = 0;
	this.colIndex = 3;	
	
	this.size = 3;
} 
function O(){
	
	this.rotation_0 = [ [0,1,1],
						[0,2,1],
						[0,0,0] ];
						
	this.rotations = [this.rotation_0];
	
	this.rowIndex = 0;
	this.colIndex = 3;
	
	this.rotation = 0;
	this.size = 3;
} //Block properties
	
function setCanvasDimensions(){
	document.getElementById("canvas").setAttribute("width", parseInt(COLS*BLOCK_SIZE) + "px");
	document.getElementById("canvas").setAttribute("height", parseInt((ROWS-1)*BLOCK_SIZE) + "px");
	document.getElementById("wrapper").setAttribute("style", "width:" + parseInt(COLS*BLOCK_SIZE) + "px");
} // Set canvas dimensions

function drawMap(){
		
	updateGameData();
	
	var temp = "";
	
	for(var i = 0;i<ROWS;i++){
		for(var k = 0;k<COLS;k++){
					
		var tempx = k*BLOCK_SIZE;
		var tempy = (i-1)*BLOCK_SIZE;
		
		switch(map[i][k]){
			case 0: ctx.drawImage(blank,tempx,tempy,BLOCK_SIZE,BLOCK_SIZE); break;
			case 1: ctx.drawImage(eval(blockType + "_block"),tempx,tempy,BLOCK_SIZE,BLOCK_SIZE); break;
			case 2: ctx.drawImage(eval(blockType + "_block"),tempx,tempy,BLOCK_SIZE,BLOCK_SIZE); break;
			default: ctx.drawImage(eval(map[i][k][1] + "_block"),tempx,tempy,BLOCK_SIZE,BLOCK_SIZE); break; 	
		}
	}
}

}