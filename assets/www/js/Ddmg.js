(function (window) {
//game pause menu

var intervalStack = [];



//stage
var freezeTime = false;
var stage;
var stageMap;
var canvasBlanket;
var stageTime;
var stageTimeObjective;
var currentObjective;
var killObjective;
var stageMapWidth;
var stageMapHeight;

var timeoutIds = [];




//text
var resumeText;
var optionText;
var exitText;
var timeText;
var trackerText;
var messageField;
var stageLevelText;

//buttons
var skillButton;
var itemButtons;
var resumeButton;
var optionButton;
var exitButton;
var weaponChooser;
var weaponChooserIndex;
var pauseButton;

//item
var entireItemList = [1, 3];

//limit ninja movement
var MINXBOUND = 0;
var MINYBOUND = 0;
var MAXXBOUND = 800;
var MAXYBOUND = 500;
var CANVASX = 800;
var CANVASY = 500;
var DRAG_THRESHOLD = 10;
var dragThresholdCounter;
var canvasElement;
var hammerTime;

//Missile
var chargeMissileID;
var maxBullets = 20;
var missileSpeed = 10;
var maxMissiles;
var currentMissiles;
var totalMissile = 0;
var bulletDisArray;

//Enemy
var spawnEnemyEachInterval = 3;
var spawnEnemyTickEnabled;
var availableEnemyTypes;
var enemyNumber;
var totalEnemy;
var enemies;
var intervalBetweenEnemy;
var nextEnemy;
var enemyId;

var RANDOM_THRESHOLD = 50;
var DISTANCE_THRESHOLD = Math.sqrt(2 * (RANDOM_THRESHOLD * RANDOM_THRESHOLD));
	
//Ninja
var playerVelX = 0;
var playerVelY = 0;
var ninjaSpeed = 5;
var ninja; 
var alive;
var skill_stack = [0, 1];

//debuging
var totalSpawned = 0;
var totalKilled = 0;

function Ddmg(){
	startGame();
}


function showShop(){
	document.getElementById(Ddmg.GAME).style.display = "none";
	document.getElementById(Shop.SHOP).style.display = "block";
	new Shop();
}



function startGame()
{ 
	canvasElement = document.getElementById('gameCanvas');	
	canvasElement.width = window.innerWidth;
	canvasElement.height = window.innerHeight;
	if (hammerTime === undefined){
		hammerTime = Hammer(canvasElement, {
        drag_block_horizontal: true,
        drag_block_vertical: true,
        drag_min_distance: 0,
		hold_timeout: 20
		});
		hammerTime.on('hold release drag dragend swipe', function(ev) {
			manageMultitouch(ev);
		});
	}
	points = 1000;

	stage = new createjs.Stage("gameCanvas");
	createjs.Touch.enable(stage);
	createjs.Ticker.addEventListener("tick", handleTick);
	createjs.Ticker.setPaused(false);
	inventory = new Array();
	inventory.push(0);
	setStage(currentStageLevel);
}

function manageMultitouch(ev) {
	var onHold = false;
	switch(ev.type) {
		case 'swipe':
			if (0 < currentMissiles) {
				shotBullet(ev);
			}
			break;
		case 'hold':
			onHold = true;
			handleMove(ev, onHold);
			break;
        case 'drag':
			dragThresholdCounter++;
            handleMove(ev, onHold);
            break;
		case 'release':
		case 'dragend':
			handleStop(ev);				
		break;
    }
}

function setStage(stageLevel) {
	stageTime = 0;
	enemyNumber = 0;
	bulletDisArray = new Array();
	switch (stageLevel) {
		case 1:	
		constructStage(stageLevel, [3,4], [0.5,0.5], 20, 10, 800, 500, 1, 3);
		break;

		case 2:	
		constructStage(stageLevel, [2, 1], [0.1, 0.9], 20, 10, 1000, 600, 2, 600);
		break;

		case 3:	
		constructStage(stageLevel, [2, 1, 4], [0.5, 0.3, 0.2], 20, 15, 800, 500, 2, 800);
		break;

		case 4:	
		constructStage(stageLevel, [2, 3, 5], [0.6, 0.3, 0.1], 20, 30, 2000, 2000, 1, 30);
		break;

		case 7:	
		constructStage(stageLevel, [3, 4, 5], [0.3, 0.3, 0.4], 20, 30, 1000, 600, 1, 30);
		break;

		case 8:	
		constructStage(stageLevel, [3, 9, 7], [0.6, 0.3, 0.1], 15, 40, 1000, 800, 2, 600);
		break;

		case 9:	
		constructStage(stageLevel, [7, 10, 6], [0.6, 0.3, 0.1], 15, 30, 900, 900, 1, 30);
		break;
		
 		case 10:
 		alert("You cleared all the stages, stay tune for more updates! - ParkingLotStudios");
 		new  Main();
 		break;
		
		default:
		customStage(stageLevel);
		break;

	}

	createTimer();

	dragThresholdCounter = 0;
	stage.x = 0; 
	stage.y = 0;
	nextEnemy = 0;

	pointsText = new createjs.Text("0", "20px Arial", "#ff7700");
	pointsText.x = 0;
	pointsText.y = 0;
	pointsText.text = 'Points: ' + points;
	stage.addChild(pointsText);

	createSkillButton();
	createPauseButton();
	createBulletDisplay();
}

function customStage(stageLevel) {
	switch (stageLevel) {
		case 5:	
			spawnEnemyTickEnabled = false;
			monsterKills = 0;
			maxMissiles = 20;
			currentMissiles = 20;
			currentStageLevel = stageLevel;
			constructStageMap(800, 500);
			spawnNinja(400, 250);	
			enemies  = new Array();
			spawnEnemyAt(4, 400, 100);
			spawnEnemyAt(4, 550, 250);
			spawnEnemyAt(4, 400, 400);
			spawnEnemyAt(4, 250, 250);

			spawnEnemyAt(3, 700, 50);
			spawnEnemyAt(3, 700, 100);
			spawnEnemyAt(3, 700, 150);
			spawnEnemyAt(3, 700, 200);
			spawnEnemyAt(3, 700, 250);
			spawnEnemyAt(3, 700, 300);
			spawnEnemyAt(3, 700, 350);
			spawnEnemyAt(3, 700, 400);

			spawnEnemyAt(3, 100, 50);
			spawnEnemyAt(3, 100, 100);
			spawnEnemyAt(3, 100, 150);
			spawnEnemyAt(3, 100, 200);
			spawnEnemyAt(3, 100, 250);
			spawnEnemyAt(3, 100, 300);
			spawnEnemyAt(3, 100, 350);
			spawnEnemyAt(3, 100, 400);
			stage.update();
			setObjective(1, 20);
			totalEnemy = 20;
			break;
		case 6:
			spawnEnemyTickEnabled = false;
			monsterKills = 0;
			maxMissiles = 20;
			currentMissiles = 20;
			currentStageLevel = stageLevel;
			constructStageMap(1000, 800);
			spawnNinja(500, 400);	
			enemies  = new Array();
			spawnEnemyAt(5, 500, 300);
			spawnEnemyAt(5, 650, 500);
			spawnEnemyAt(5, 500, 500);
			spawnEnemyAt(5, 250, 250);
			spawnEnemyAt(5, 500, 250);
			spawnEnemyAt(5, 380, 280);

			spawnEnemyAt(3, 1000, 100);
			spawnEnemyAt(3, 1000, 150);
			spawnEnemyAt(3, 1000, 200);
			spawnEnemyAt(3, 1000, 250);

			spawnEnemyAt(3, 1000, 700);
			spawnEnemyAt(3, 1000, 650);
			spawnEnemyAt(3, 1000, 600);
			spawnEnemyAt(3, 1000, 550);

			spawnEnemyAt(3, 0, 100);
			spawnEnemyAt(3, 0, 150);
			spawnEnemyAt(3, 0, 200);
			spawnEnemyAt(3, 0, 250);

			spawnEnemyAt(3, 0, 700);
			spawnEnemyAt(3, 0, 650);
			spawnEnemyAt(3, 0, 600);
			spawnEnemyAt(3, 0, 550);
			stage.update();
			setObjective(1, 20);
			totalEnemy = 20;
			break;

	}
}


function createBulletDisplay() {
 	for (var i = 0; i < currentMissiles; i++){
		var bulletDis = new createjs.Shape();
		bulletDis.name = "bullet";
		bulletDis.graphics.beginFill("red").drawRect((i * 10), canvasElement.height - 15, 5, 10);
		stage.addChild(bulletDis);
		bulletDisArray.push(bulletDis);
 	}
}

function createSkillButton() {
	skillButton = new createjs.Shape();
	var colour;
	if (skill_stack.length > 0) {
		colour = "red"
	} else {
		colour = "#999999"
	}
	skillButton.graphics.beginFill(colour).drawRect(window.innerWidth - 80 - stage.x, 30 - stage.y, 20, 10);
	skillButton.addEventListener("click", function () {
	var skill = skill_stack.pop();
	useSkill(skill);
	});

	stage.addChild(skillButton);
}

function createTimer() {
	timeElapsed = 0;
	timeText = new createjs.Text("00 seconds", "20px Arial", "#ff7700");
	timeText.x = canvasElement.width -120;
	timeText.y = 0;
	stage.addChild(timeText);
}

function useSkill(skill) {
	switch (skill) {
		case 0:
			freezeTime = true;
			setTimeout(function () {
				freezeTime = false;
			}, 2000)
			break;
		case 1:
			ninjaSpeed = 10;
			setTimeout(function () {
				ninjaSpeed = 5;
			}, 2000)
			break;
	}
}

/*
enemyRatios: has to add up to 1, has to map to enemyTypes
enemyTypes: 
startingEnemies: enemyRatio and this calculates the num and the type of enemies being produced
*/
function constructStage(stageLevel, enemyTypes, enemyRatios, enemiesLimit, startingEnemys, mapWidth, mapHeight, objective, objectiveNum) {
	spawnEnemyTickEnabled = true;
	monsterKills = 0;
	maxMissiles = 20;
	currentMissiles = 20;
	currentStageLevel = stageLevel;
	constructStageMap(mapWidth, mapHeight);
	spawnNinja(canvasElement.width/2, canvasElement.height/2);	
	stage.update();
	totalEnemy = enemiesLimit;
	spawnEnemies(enemyTypes, enemyRatios, startingEnemys);
	setObjective(objective, objectiveNum);
		if (spawnEnemyTickEnabled) {
			startSpawnEnemyChain();
		}
}

function setObjective(objective, objectiveNum) {
	if (objective == 1){
		killObjective = objectiveNum;
	} else if (objective == 2){
		stageTimeObjective = objectiveNum;
	}
	currentObjective = objective;
}


function spawnEnemies(enemyTypes, enemyRatios, startingEnemys) {
	enemies  = new Array();
	availableEnemyTypes = enemyTypes;
	if (enemyTypes.length != enemyRatios.length) {
		alert("R u kidding? Mapping does not match in spawnEnemies");
	}
	for (var i = 0; i < enemyTypes.length; i++) {
		createEnemy(startingEnemys, enemyTypes[i], enemyRatios[i]);
	}
}

function spawnNinja(spawnX, spawnY) {
	SoundControl.play("Start");
	ninja = new Ninja();
	alive = true;
	ninja.x = spawnX;
	ninja.y = spawnY;
	ninja.name = "ninja";
	stage.addChild(ninja);
}

function constructStageMap(mapWidth, mapHeight) {
	MINXBOUND = canvasElement.width/2 - mapWidth/2;
	MINYBOUND = canvasElement.height/2 - mapHeight/2;
	MAXXBOUND = canvasElement.width/2 + mapWidth/2;
	MAXYBOUND = canvasElement.height/2 + mapHeight/2;
	enemyNumber = 0;
	intervalBetweenEnemy = 60;
	stageMap = new createjs.Shape();
	stageMap.graphics.beginFill("green").drawRect(0, 0, mapWidth, mapHeight);
	stageMap.x = canvasElement.width/2 - mapWidth/2;
	stageMap.y = canvasElement.height/2 - mapHeight/2;
	stageMapWidth = mapWidth;
	stageMapHeight = mapHeight;

	canvasBlanket = new createjs.Shape();
	canvasBlanket.graphics.beginFill("blue").drawRect(0, 0, mapWidth + CANVASX, mapHeight + CANVASY);
	canvasBlanket.x = canvasElement.width/2 - (mapWidth + CANVASX)/2; //-(CANVASX/2);
	canvasBlanket.y = canvasElement.height/2 - (mapHeight + CANVASY)/2; //-(CANVASY/2);
	canvasBlanket.visible = false;
	stage.addChild(canvasBlanket);
	stage.addChild(stageMap);
}

function handleTick(event) {
	if (!event.paused) {
		caughtNinja();
		updateEnemies();
		updatePlayerStage();
		checkStageClear();
		updateTimer();
		bulletDisplayTick();
		stageTime++;
	}
}

function updateTimer() {
	timeElapsed += (createjs.Ticker.getInterval() / 1000);

	timeString = timeElapsed.toString().substring(0, 4);
	if (timeString.length == 3) {
		timeString = timeString + "0"; 
	}
	timeText.text = timeString + " seconds"; 
}

function checkStageClear() {
	if ((currentObjective == 1) && (monsterKills >= killObjective)) {
		currentObjective = 3;
		setTimeout(function (){
			clearStage();
			showShop();
			createjs.Ticker.setPaused(true);
		}, 2000);
	} else if ((currentObjective == 2) && (stageTime >= stageTimeObjective)){
		currentObjective = 3;
		setTimeout(function (){
			clearStage();
			showShop();
			createjs.Ticker.setPaused(true);
		}, 2000);
	}
}
// 
// //This is a testing mode. One monster kill OR survive for approx. 3 seconds.
// function checkStageClear() {
// 	if ((currentObjective == 1) && (monsterKills >= 1)) {
// 		clearStage();
// 		showShop();
// 		createjs.Ticker.setPaused(true);
// 	} else if ((currentObjective == 2) && (stageTime >= 70)){
// 		clearStage();
// 		showShop();
// 		createjs.Ticker.setPaused(true);
// 	}
// }

function createBtwStageMenu() {
	currentStageLevel++;
	weaponChooser = new createjs.Shape();
	weaponChooser.graphics.beginFill("red").drawRect(150 - stage.x, 60 - stage.y, 10, 10);
	stage.addChild(weaponChooser);
	createWeaponButtons();

	var proceedButton = new createjs.Shape();
	proceedButton.name = "redoButton";
	proceedButton.graphics.beginFill("red").drawRect(ninja.x - 75, ninja.y + 35, 150, 50);
	proceedButton.addEventListener("click", gameRestart);
	var proceedText = new createjs.Text("Next Stage", "bold 24px Arial", "#FFFFFF");
	proceedText.maxWidth = 150;
	proceedText.textAlign = "center";
	proceedText.x = ninja.x;
	proceedText.y = ninja.y + 40;
	stage.addChild(proceedButton);
	stage.addChild(proceedText);
	stage.update();

}

function buyOrEquipButton() {
	var buyButton = new createjs.Shape();
	buyButton.graphics.beginFill("white").drawRect((canvasElement.width - 100) - stage.x, (canvasElement.height - 60) - stage.y, 50, 30);
	buyButton.addEventListener("click", function () {
		var weapon = getWeaponTypeChosen();
		//TODO-KEVIN: Make button remake react faster, map weapon to its points
		if (!hasWeapon(weapon)){
			if (points >= 100) {
				var missile = new Missile(weapon, 0, 0, 0, 0);
				points -= missile.price;
				inventory.push(weapon);
				missileType = weapon;
				weaponButton(weapon);
			}
		}
	})
	stage.addChild(buyButton);
}

function getWeaponTypeChosen() {
	return (weaponChooser.y / 60);
}

function weaponSelect(index) {
}

function updatePlayerStage() {
	if (checkNinjaBound()){
		ninja.x += playerVelX;
		ninja.y += playerVelY;
		stage.x -= playerVelX;
		stage.y -= playerVelY;
		pauseButton.x += playerVelX;
		pauseButton.y += playerVelY;
		skillButton.x += playerVelX;
		skillButton.y += playerVelY;
		timeText.x += playerVelX;
		timeText.y += playerVelY;
		pointsText.x += playerVelX;
		pointsText.y += playerVelY;
		for (var i = 0; i < bulletDisArray.length; i++) {
			bulletDisArray[i].x += playerVelX;
			bulletDisArray[i].y += playerVelY;
		}
	} else {
		if (checkNinjaYBound()) {
			ninja.y += playerVelY;
			stage.y -= playerVelY;
			pauseButton.y += playerVelY;
			skillButton.y += playerVelY;
			timeText.y += playerVelY;
			pointsText.y += playerVelY;
			for (var i = 0; i < bulletDisArray.length; i++) {
				bulletDisArray[i].y += playerVelY;
			}
		}
		if (checkNinjaXBound()) {
			ninja.x += playerVelX;
			stage.x -= playerVelX;
			pauseButton.x += playerVelX;
			skillButton.x += playerVelX;
			timeText.x += playerVelX;
			pointsText.x += playerVelX;
			for (var i = 0; i < bulletDisArray.length; i++) {
				bulletDisArray[i].x += playerVelX;
			}
		}
	}
	stage.update();
}

function checkNinjaXBound() {
	if ((ninja.x < MAXXBOUND - 5) && (playerVelX > 0)){
		return true;
	}
	if ((ninja.x > MINXBOUND + 5) && (playerVelX < 0)){
		return true;
	} 
	return false;
}

function checkNinjaYBound() {
	if ((ninja.y < MAXYBOUND - 5) && (playerVelY > 0)){
		return true;
	}
	if ((ninja.y > MINYBOUND + 5) && (playerVelY < 0)){
		return true;
	} 
	return false;
}

function checkNinjaBound() {
	return ((ninja.x < MAXXBOUND - 5) && (ninja.y < MAXYBOUND - 5) && (ninja.x > MINXBOUND + 5) && (ninja.y > MINYBOUND + 5));
}

function handleMove(mouseEvent, onHold){
	var relativeY = mouseEvent.gesture.touches[0].pageY - ninja.y - stage.y - mouseEvent.gesture.target.offsetTop;
	var relativeX = mouseEvent.gesture.touches[0].pageX - ninja.x - stage.x - mouseEvent.gesture.target.offsetLeft;
	var angle = Math.atan(relativeY/relativeX);
	if (dragThresholdCounter > DRAG_THRESHOLD || onHold) {
		if (relativeX < 0) {
			playerVelX = Math.cos(angle) * -ninjaSpeed;
			playerVelY = Math.sin(angle) * -ninjaSpeed;
			var rotation = angle * (180/Math.PI) + 90;
		} else {
			playerVelX = Math.cos(angle) * ninjaSpeed;
			playerVelY = Math.sin(angle) * ninjaSpeed;
			var rotation = angle * (180/Math.PI) - 90;
		}
		ninja.rotation = rotation;
	}
}


function handleStop(mouseEvent){
	dragThresholdCounter = 0;
	playerVelX = 0;
	playerVelY = 0;
}

function createEnemy(spawnEnemyNum, enemyType, enemyRatio){
	var chosenEnemyNum = Math.round(spawnEnemyNum * enemyRatio);
	//randomly decide to set to x-axis or y-axis
	spawnEnemy(enemyType, chosenEnemyNum);
}

//spawns enemyNum of enemies of the chosenType
function spawnEnemy(chosenType, enemyNum) {
	for (var i = 0; i < enemyNum; i++) {
		var now = new Date();
		if (now % 2){
			//this decides if the enemy starts at left or right.
			var startLeft = Math.floor((Math.random() * 2));
			if (startLeft){
				var randomX = MINXBOUND - 10;
				var randomY = Math.floor(Math.random() * (MAXYBOUND - MINYBOUND)) + MINYBOUND;
			} else {
				var randomX = MAXXBOUND + 10;
				var randomY = Math.floor(Math.random() * (MAXYBOUND - MINYBOUND)) + MINYBOUND;
			}
		} else {
			//this decides if the enemy starts at top or bottom
			var startTop = Math.floor((Math.random() * 2));
			if (startTop){
				var randomX = Math.floor(Math.random() * (MAXXBOUND - MINXBOUND)) + MINXBOUND;
				var randomY = MINYBOUND - 10;
			} else {
				var randomX = Math.floor(Math.random() * (MAXXBOUND - MINXBOUND)) + MINXBOUND;
				var randomY = MAXYBOUND + 10;
			}
		}
	spawnEnemyAt(chosenType, randomX, randomY);
	}
}

function spawnEnemyAt(chosenType, x, y) {
	totalSpawned++;
	var enemy = new Enemy(chosenType, enemyId, ninja.x, ninja.y);
	enemy.x = x;
	enemy.y = y;
	enemy.name = "weakEnemy";
	if (enemies.length < totalEnemy) {
		stage.addChild(enemy);
		enemies.push(enemy);
	}
	return enemy;
}


function updateEnemies(){
	var dead = [];
	if (freezeTime) { return;}
	for (var i = 0; i < enemies.length; i++){
		var enemy = enemies[i];
		if (enemy.alive) {
			updateEnemy(enemy);
		} else {
			dead.push(i);
		}
	}


	for (var i = 0; i < dead.length; i++){
		enemies.splice(dead[i] - i, 1);
	}
}

function updateEnemy(enemy){
	switch(enemy.type) {
		case 2:
			moveEnemy(enemy);
			if (enemy.alerted && enemy.skill_stack > 0){
				turnInvincible(enemy);
				turnImmobile(enemy);
				setTimeout(function () {
					if (enemy.alive) {
						turnVincible(enemy);
						unalert(enemy);
						turnMobile(enemy);
					}
				}, 500)
				enemy.skill_stack--;

				setTimeout(function (enemy) {
					restoreSkill_stack(enemy, 1);
				}, 2000)
			}
			break;
		case 3:
			moveEnemy(enemy);
			if (enemy.skill_stack < 0){
				turnImmobile(enemy);
				fireFrom(enemy);
				restoreSkill_stack(enemy, 50 + randomNumber(0, 100));
				setTimeout(function () {
					turnMobile(enemy);
				}, 1500)
			}
			if (enemy.mobile) { 
				enemy.skill_stack--;
			}
			break;

		case 4:
			
			moveEnemy(enemy);
			relativeX = enemy.x - ninja.x;
			relativeY = enemy.y - ninja.y;
			var distance = Math.sqrt((relativeX * relativeX) + (relativeY * relativeY));
			if (distance <= 150 && enemy.skill_stack > 0) {
				turnImmobile(enemy);
				setTimeout(function () {
					turnMobile(enemy);
					enemy.speed = enemy.full_speed;
					setTimeout(function () {
						if(enemy.alive) {
							enemy.speed = 2;
						}
					}, 1400)
				}, 2000)
				enemy.skill_stack--;
			}
			break;

		case 6:
			moveEnemy(enemy);
			if (enemy.skill_stack < 0){
				turnImmobile(enemy);
				var ninja_x_save = ninja.x;
				var ninja_y_save = ninja.y;
				restoreSkill_stack(enemy, 50 + randomNumber(0, 100));
				setTimeout(function () {
					laserFrom(enemy, ninja_x_save, ninja_y_save);
				}, 1000)

				setTimeout(function () {
					turnMobile(enemy);
				}, 3000)
			}
			if (enemy.mobile) { 
				enemy.skill_stack--;
			}
			break;

		case 10:
			moveEnemy(enemy);
			enemy.skill_stack--;
			if (enemy.skill_stack < 0){
				blaze(enemy);
				restoreSkill_stack(enemy, 4);
			}
			break;

		case 12:
			moveEnemy(enemy);
			relativeX = enemy.x - ninja.x;
			relativeY = enemy.y - ninja.y;
			var distance = Math.sqrt((relativeX * relativeX) + (relativeY * relativeY));
			if (distance <= 170 && enemy.skill_stack > 0) {
				turnImmobile(enemy);
				setTimeout(function () {
					enemy.fix_vel = true;
					turnMobile(enemy);
					enemy.speed = enemy.full_speed;
					calculateVel(enemy);
					setTimeout(function () {
						if(enemy.alive) {
							enemy.fix_vel = false
							enemy.speed = 2;
							setTimeout(function () {
								restoreSkill_stack(enemy, 1);
							}, 1600);
						}
					}, 1000)
				}, 1500)
				enemy.skill_stack--;
			}
			break;
		default:
			moveEnemy(enemy);
			break;

	}
}
function blaze(enemy) {
	var blaze = spawnEnemyAt(11, enemy.x, enemy.y);
	setTimeout(function () {
		die(blaze);
	}, 4000)
}

function fillLaser(enemy, velX, velY) {
	var laserPeriod = 2000;
	var missile0 = new Missile(98, 1, 1, enemy.x + (0 * velX), enemy.y + (0 * velY));
	missile0.addEventListener("tick", function () {
		updateProjectile(0, 0, missile0);
	});
	stage.addChild(missile0);
	setTimeout(function () {
		missile0.removeAllEventListeners();
		stage.removeChild(missile0);
	}, laserPeriod);
	var missile1 = new Missile(98, 1, 1, enemy.x + (1 * velX), enemy.y + (1 * velY));
	missile1.addEventListener("tick", function () {
		updateProjectile(0, 0, missile1);
	});
	stage.addChild(missile1);
	setTimeout(function () {
		missile1.removeAllEventListeners();
		stage.removeChild(missile1);
	}, laserPeriod);
	var missile2 = new Missile(98, 1, 1, enemy.x + (2 * velX), enemy.y + (2 * velY));
	missile2.addEventListener("tick", function () {
		updateProjectile(0, 0, missile2);
	});
	stage.addChild(missile2);
	setTimeout(function () {
		missile2.removeAllEventListeners();
		stage.removeChild(missile2);
	}, laserPeriod);
	var missile3 = new Missile(98, 1, 1, enemy.x + (3 * velX), enemy.y + (3 * velY));
	missile3.addEventListener("tick", function () {
		updateProjectile(0, 0, missile3);
	});
	stage.addChild(missile3);
	setTimeout(function () {
		missile3.removeAllEventListeners();
		stage.removeChild(missile3);
	}, laserPeriod);
	var missile4 = new Missile(98, 1, 1, enemy.x + (4 * velX), enemy.y + (4 * velY));
	missile4.addEventListener("tick", function () {
		updateProjectile(0, 0, missile4);
	});
	stage.addChild(missile4);
	setTimeout(function () {
		missile4.removeAllEventListeners();
		stage.removeChild(missile4);
	}, laserPeriod);
	var missile5 = new Missile(98, 1, 1, enemy.x + (5 * velX), enemy.y + (5 * velY));
	missile5.addEventListener("tick", function () {
		updateProjectile(0, 0, missile5);
	});
	stage.addChild(missile5);
	setTimeout(function () {
		missile5.removeAllEventListeners();
		stage.removeChild(missile5);
	}, laserPeriod);
	var missile6 = new Missile(98, 1, 1, enemy.x + (6 * velX), enemy.y + (6 * velY));
	missile6.addEventListener("tick", function () {
		updateProjectile(0, 0, missile6);
	});
	stage.addChild(missile6);
	setTimeout(function () {
		missile6.removeAllEventListeners();
		stage.removeChild(missile6);
	}, laserPeriod);
	var missile7 = new Missile(98, 1, 1, enemy.x + (7 * velX), enemy.y + (7 * velY));
	missile7.addEventListener("tick", function () {
		updateProjectile(0, 0, missile7);
	});
	stage.addChild(missile7);
	setTimeout(function () {
		missile7.removeAllEventListeners();
		stage.removeChild(missile7);
	}, laserPeriod);
	var missile8 = new Missile(98, 1, 1, enemy.x + (8 * velX), enemy.y + (8 * velY));
	missile8.addEventListener("tick", function () {
		updateProjectile(missile8.VelX, missile8.VelY, missile8);
	});
	stage.addChild(missile8);
	setTimeout(function () {
		missile8.removeAllEventListeners();
		stage.removeChild(missile8);
	}, laserPeriod);
	var missile9 = new Missile(98, 1, 1, enemy.x + (9 * velX), enemy.y + (9 * velY));
	missile9.addEventListener("tick", function () {
		updateProjectile(missile8.VelX, missile9.VelY, missile9);
	});
	stage.addChild(missile9);
	setTimeout(function () {
		missile9.removeAllEventListeners();
		stage.removeChild(missile9);
	}, laserPeriod);
	var missile10 = new Missile(98, 1, 1, enemy.x + (10 * velX), enemy.y + (10 * velY));
	missile10.addEventListener("tick", function () {
		updateProjectile(missile8.VelX, missile10.VelY, missile10);
	});
	stage.addChild(missile10);
	setTimeout(function () {
		missile10.removeAllEventListeners();
		stage.removeChild(missile10);
	}, laserPeriod);
	var missile11 = new Missile(98, 1, 1, enemy.x + (11 * velX), enemy.y + (11 * velY));
	missile11.addEventListener("tick", function () {
		updateProjectile(missile8.VelX, missile11.VelY, missile11);
	});
	stage.addChild(missile11);
	setTimeout(function () {
		missile11.removeAllEventListeners();
		stage.removeChild(missile11);
	}, laserPeriod);
	var missile12 = new Missile(98, 1, 1, enemy.x + (12 * velX), enemy.y + (12 * velY));
	missile12.addEventListener("tick", function () {
		updateProjectile(missile8.VelX, missile12.VelY, missile12);
	});
	stage.addChild(missile12);
	setTimeout(function () {
		missile12.removeAllEventListeners();
		stage.removeChild(missile12);
	}, laserPeriod);
	var missile13 = new Missile(98, 1, 1, enemy.x + (13 * velX), enemy.y + (13 * velY));
	missile13.addEventListener("tick", function () {
		updateProjectile(0, 0, missile13);
	});
	stage.addChild(missile13);
	setTimeout(function () {
		missile13.removeAllEventListeners();
		stage.removeChild(missile13);
	}, laserPeriod);
	var missile14 = new Missile(98, 1, 1, enemy.x + (14 * velX), enemy.y + (14 * velY));
	missile14.addEventListener("tick", function () {
		updateProjectile(0, 0, missile14);
	});
	stage.addChild(missile14);
	setTimeout(function () {
		missile14.removeAllEventListeners();
		stage.removeChild(missile14);
	}, laserPeriod);
	var missile15 = new Missile(98, 1, 1, enemy.x + (15 * velX), enemy.y + (15 * velY));
	missile15.addEventListener("tick", function () {
		updateProjectile(0, 0, missile15);
	});
	stage.addChild(missile15);
	setTimeout(function () {
		missile15.removeAllEventListeners();
		stage.removeChild(missile15);
	}, laserPeriod);
	var missile16 = new Missile(98, 1, 1, enemy.x + (16 * velX), enemy.y + (16 * velY));
	missile16.addEventListener("tick", function () {
		updateProjectile(0, 0, missile16);
	});
	stage.addChild(missile16);
	setTimeout(function () {
		missile16.removeAllEventListeners();
		stage.removeChild(missile16);
	}, laserPeriod);
	var missile17 = new Missile(98, 1, 1, enemy.x + (17 * velX), enemy.y + (17 * velY));
	missile17.addEventListener("tick", function () {
		updateProjectile(0, 0, missile17);
	});
	stage.addChild(missile17);
	setTimeout(function () {
		missile17.removeAllEventListeners();
		stage.removeChild(missile17);
	}, laserPeriod);
	var missile18 = new Missile(98, 1, 1, enemy.x + (18 * velX), enemy.y + (18 * velY));
	missile18.addEventListener("tick", function () {
		updateProjectile(0, 0, missile18);
	});
	stage.addChild(missile18);
	setTimeout(function () {
		missile18.removeAllEventListeners();
		stage.removeChild(missile18);
	}, laserPeriod);
	var missile19 = new Missile(98, 1, 1, enemy.x + (19 * velX), enemy.y + (19 * velY));
	missile19.addEventListener("tick", function () {
		updateProjectile(0, 0, missile19);
	});
	stage.addChild(missile19);
	setTimeout(function () {
		missile19.removeAllEventListeners();
		stage.removeChild(missile19);
	}, laserPeriod);
	var missile20 = new Missile(98, 1, 1, enemy.x + (20 * velX), enemy.y + (20 * velY));
	missile20.addEventListener("tick", function () {
		updateProjectile(missile20.VelX, missile20.VelY, missile20);
	});
	stage.addChild(missile20);
	setTimeout(function () {
		missile20.removeAllEventListeners();
		stage.removeChild(missile20);
	}, laserPeriod);
	var missile21 = new Missile(98, 1, 1, enemy.x + (21 * velX), enemy.y + (21 * velY));
	missile21.addEventListener("tick", function () {
		updateProjectile(missile20.VelX, missile21.VelY, missile21);
	});
	stage.addChild(missile21);
	setTimeout(function () {
		missile21.removeAllEventListeners();
		stage.removeChild(missile21);
	}, laserPeriod);
	var missile22 = new Missile(98, 1, 1, enemy.x + (22 * velX), enemy.y + (22 * velY));
	missile22.addEventListener("tick", function () {
		updateProjectile(missile20.VelX, missile22.VelY, missile22);
	});
	stage.addChild(missile22);
	setTimeout(function () {
		missile22.removeAllEventListeners();
		stage.removeChild(missile22);
	}, laserPeriod);
	var missile23 = new Missile(98, 1, 1, enemy.x + (23 * velX), enemy.y + (23 * velY));
	missile23.addEventListener("tick", function () {
		updateProjectile(missile20.VelX, missile23.VelY, missile23);
	});
	stage.addChild(missile23);
	setTimeout(function () {
		missile23.removeAllEventListeners();
		stage.removeChild(missile23);
	}, laserPeriod);
	var missile24 = new Missile(98, 1, 1, enemy.x + (24 * velX), enemy.y + (24 * velY));
	missile24.addEventListener("tick", function () {
		updateProjectile(missile20.VelX, missile24.VelY, missile24);
	});
	stage.addChild(missile24);
	setTimeout(function () {
		missile24.removeAllEventListeners();
		stage.removeChild(missile24);
	}, laserPeriod);


}

function laserFrom(enemy, ninja_x_save, ninja_y_save){
	var destX = ninja_x_save - enemy.x;
	var destY = ninja_y_save - enemy.y;

	//missile starting point is the current player position
	var angle = Math.atan(destY / destX);
	var velX;
	var velY;
	var rotation;
	var missileOffset = 20;
	if (destX < 0) {
		velX = Math.cos(angle) * -missileOffset;
		velY = Math.sin(angle) * -missileOffset;
		var rotation = angle * (180/Math.PI) + 180;
	} else {
		velX = Math.cos(angle) * missileOffset;
		velY = Math.sin(angle) * missileOffset;
		var rotation = angle * (180/Math.PI);
	}
	var laserLength = 480;

	var laser = new createjs.Shape();
	laser.graphics.beginFill("#00FBFF").drawRect(0, 0, laserLength, 20, 10);
	stage.addChild(laser);
	fillLaser(enemy, velX, velY);
	laser.regX = 0;
	laser.regY = 10;
	laser.x = enemy.x;
	laser.y = enemy.y;
	laser.rotation = rotation;


	stage.update();
	setTimeout(function () {
		stage.removeChild(laser);
	}, 2000);
}

function moveEnemy(enemy) {
	enemy.ninja_x += playerVelX;
	enemy.ninja_y += playerVelY;
	if (!enemy.fix_vel) {
		calculateVel(enemy);
	}
	if (enemy.mobile) { 
		enemy.x -= enemy.vX;
		enemy.y -= enemy.vY;
	}
}


function distance( point1, point2 )
{
  var xs = 0;
  var ys = 0;
 
  xs = point2.x - point1.x;
  xs = xs * xs;
 
  ys = point2.y - point1.y;
  ys = ys * ys;
 
  return Math.sqrt( xs + ys );
}


//if distance is closer than 100 use actual ninja coordinates if not use around ninja coordinates. fake point to enemy that it can follow

function calculateVel(enemy) {
	var relativeY = enemy.y - enemy.ninja_y;
	var relativeX = enemy.x - enemy.ninja_x;
	if (distance(enemy, ninja) <= DISTANCE_THRESHOLD) {
		relativeY = enemy.y - ninja.y;
		relativeX = enemy.x - ninja.x;
	}
	var angle = Math.atan(relativeY/relativeX);
	if (relativeX < 0){
		enemy.vX = Math.cos(angle) * -enemy.speed; 
		enemy.vY = Math.sin(angle) * -enemy.speed; 
		var rotation = angle * (180/Math.PI) - 90;
	} else {
		enemy.vX = Math.cos(angle) * enemy.speed;
		enemy.vY = Math.sin(angle) * enemy.speed;
		var rotation = angle * (180/Math.PI) + 90;
	}
	enemy.rotation = rotation;
	enemy.vel_set = true;
}

//returns false if there is already something on that grid
//temp try out overlap
/*
function register(enemy) {
	var x = (enemy.x - enemy.vX) / 10;
	var y = (enemy.y - enemy.vY) / 10;
	if (grid.get(x, y) == "") {
		grid.set(x, y, enemy.id);
	} else {
		//occupied
		return true;
	}
	return true;
}

function unregister(enemy) {
	var x = enemy.x / 10;
	var y = enemy.y / 10;
	grid.set(x, y, "");
}
*/

function fireFrom(enemy){
	var destX = ninja.x - enemy.x;
	var destY = ninja.y - enemy.y;

	//missile starting point is the current player position
	var angle = Math.atan(destY / destX);
	var velX;
	var velY;
	if (destX < 0) {
		velX = Math.cos(angle) * -missileSpeed;
		velY = Math.sin(angle) * -missileSpeed;
	} else {
		velX = Math.cos(angle) * missileSpeed;
		velY = Math.sin(angle) * missileSpeed;
	}
	
	var missile = new Missile(99, velX, velY, enemy.x, enemy.y);
	missile.addEventListener("tick", function () {
		updateProjectile(missile.VelX, missile.VelY, missile);
	});
	stage.addChild(missile);
	stage.update();

}


function bulletDisplayTick() {
	if (currentMissiles < bulletDisArray.length) {
		var diff = bulletDisArray.length - currentMissiles;
		for (var i = 0; i < diff ;i++){
			var bulletDisp = bulletDisArray.pop();
			stage.removeChild(bulletDisp);
		}
	} else if (currentMissiles > bulletDisArray.length){
		var diff = currentMissiles - bulletDisArray.length;
		for (var i = 0; i < diff ;i++){
			var bulletDis = new createjs.Shape();
			bulletDis.name = "bullet";
			bulletDis.graphics.beginFill("red").drawRect(((bulletDisArray.length) * 10) - stage.x, canvasElement.height - 15 - stage.y, 5, 10);
			stage.addChild(bulletDis);
			bulletDisArray.push(bulletDis);
		}
	}

}

function restoreSkill_stack(enemy, amount){
	if(typeof enemy != 'undefined' && (enemy.alive)) {
		enemy.skill_stack = amount;
	}
}

function turnInvincible(enemy){
	if (!enemy.invincible) {
		enemy.invincible = true;
		enemy.colour("blue");
	}
}

function turnVincible(enemy){
	if (enemy.invincible) {
		enemy.invincible = false;
		enemy.colour("purple");
	}
}

function turnImmobile(enemy){
	enemy.mobile = false;
}

function turnMobile(enemy){
	enemy.mobile = true;
}

function unalert(enemy){
	enemy.alerted = false;
}


function spawnEnemyTick() {
	if (nextEnemy <= 0) {
		if (alive) {
			intervalBetweenEnemy -= (currentStageLevel * randomNumber(1, 10)); //reduce enemy spacing slowly to increase difficulty with time
			var currentSpawnEnemy = availableEnemyTypes[randomNumber(0, availableEnemyTypes.length)];
			if (enemies.length < totalEnemy) {
				spawnEnemy(currentSpawnEnemy, 1);
			}
			nextEnemy = intervalBetweenEnemy + intervalBetweenEnemy * randomNumber(1, 5);
		}
	} else {
		nextEnemy -= (currentStageLevel * randomNumber(1, 10));
	}
}
//TODO: MAKE CHAINTIME CONFIGURABLE
function startSpawnEnemyChain(){
	var chainTime = randomNumber(500, 2000); 
	setTimeout(function (){
		var currentSpawnEnemy = availableEnemyTypes[randomNumber(0, availableEnemyTypes.length)];
		var x = randomNumber(stageMap.x, stageMapWidth);
		var y = randomNumber(stageMap.y, stageMapHeight);
		var num = randomNumber(0,3);
		if (num == 0) {
			spawnEnemyAt(currentSpawnEnemy, stageMap.x, y);
		} else if( num == 1) {
			spawnEnemyAt(currentSpawnEnemy, x, stageMap.y);
		} else if (num == 2) {
			spawnEnemyAt(currentSpawnEnemy, stageMap.x + stageMapWidth, y);
		} else if (num == 3) {
			spawnEnemyAt(currentSpawnEnemy, x, stageMap.y + stageMapHeight);
		}
		startSpawnEnemyChain();
	}, chainTime);
}

function caughtNinja(){
	var blazes = [];
	for (var i = 0; i < enemies.length; i++){
		var enemy = enemies[i];
		if (alive && enemy.hitRadius(ninja.x, ninja.y, ninja.hit)){
			if ((!enemy.alive) && (enemy.type == 11)) {
				blazes.push(i);
			} else {
				dieNinja();
			}
		}
	}

	for (var j = 0; j < blazes.length; j++){
		enemies.splice(blazes[j] - j, 1);
	}

}

function dieNinja() {
	SoundControl.play("Death");
	alive = false;
	createjs.Ticker.setPaused(true);
	stage.removeChild(ninja);
	messageField = new createjs.Text("Dead!", "bold 24px Arial", "#FFFFFF");
	messageField.maxWidth = 1000;
	messageField.textAlign = "center";
	messageField.x = ninja.x;
	messageField.y = ninja.y;
	messageField.maxWidth = 150;
	stage.addChild(messageField);
	createRedoButton();

}

function createRedoButton() {
	var redoButton = new createjs.Shape();
	redoButton.name = "redoButton";
	redoButton.graphics.beginFill("red").drawRect(ninja.x - 75, ninja.y + 35, 150, 50);
	redoButton.addEventListener("click", gameRestart);
	var redoText = new createjs.Text("Try Again", "bold 24px Arial", "#FFFFFF");
	redoText.textAlign = "center";
	redoText.x = ninja.x;
	redoText.y = ninja.y + 40;
	stage.addChild(redoButton);
	stage.addChild(redoText);
}

function createPauseButton() {
	pauseButton = new createjs.Shape();
	pauseButton.name = "pauseButton";
	pauseButton.graphics.beginFill("yellow").drawRect(canvasElement.width - 100, canvasElement.height - 20, 20, 20);
	pauseButton.addEventListener("click", createMenu);
	stage.addChild(pauseButton);
}

function drawPauseMenu() {
	resumeButton = new createjs.Shape();
	resumeButton.name = "resumeButton";
	resumeButton.graphics.beginFill("gray").drawRect(ninja.x - 75, ninja.y - 40, 150, 40);
	resumeText = new createjs.Text("Resume", "bold 24px Arial", "#FFFFFF");
	resumeText.maxWidth = 150;
	resumeText.textAlign = "center";
	resumeText.x = ninja.x;
	resumeText.y = ninja.y - 40;
	resumeButton.addEventListener("click", createMenu);
	optionButton = new createjs.Shape();
	optionButton.name = "optionButton";
	optionButton.graphics.beginFill("gray").drawRect(ninja.x - 75, ninja.y, 150, 40);
	optionText = new createjs.Text("Options", "bold 24px Arial", "#FFFFFF");
	optionText.maxWidth = 150;
	optionText.textAlign = "center";
	optionText.x = ninja.x;
	optionText.y = ninja.y;
	optionButton.addEventListener("click", gameMenu);
	exitButton = new createjs.Shape();
	exitButton.name = "exitButton";
	exitButton.graphics.beginFill("gray").drawRect(ninja.x - 75, ninja.y + 40, 150, 40);
	exitText = new createjs.Text("Exit", "bold 24px Arial", "#FFFFFF");
	exitText.maxWidth = 150;
	exitText.textAlign = "center";
	exitText.x = ninja.x;
	exitText.y = ninja.y + 40;
	exitButton.addEventListener("click", backToMenu);
	stage.addChild(resumeButton);
	stage.addChild(resumeText);
	stage.addChild(optionButton);
	stage.addChild(optionText);
	stage.addChild(exitButton);
	stage.addChild(exitText);
}

function gameMenu(){

}

function createMenu() {
	if (alive) {
		gamePause();
		if (createjs.Ticker.getPaused()) {
			drawPauseMenu();
			stage.update();
		} else {
			resumeButton.removeAllEventListeners();
			stage.removeChild(resumeButton);
			stage.removeChild(resumeText);
			optionButton.removeAllEventListeners();
			stage.removeChild(optionButton);
			stage.removeChild(optionText);
			exitButton.removeAllEventListeners();
			stage.removeChild(exitButton);
			stage.removeChild(exitText);
			stage.update();
		}
	}
}

function gamePause(){
	if(alive){
		var paused = !createjs.Ticker.getPaused();
		createjs.Ticker.setPaused(paused);
	}
}

function backToMenu(){
	document.getElementById('menu').style.display = "block";
	document.getElementById('game').style.display = "none";
	DataBase.data.transaction(populateDB,DataBase.successCB,DataBase.errorCB);
	stage.clear();
	stage.removeAllChildren();
	stage.removeAllEventListeners();
	new Main();
}

function populateDB(tx){
	tx.executeSql('INSERT INTO DDMG (points, monsterkill, currentlevel) VALUES ('+ points + ', 0, 0)');
	DataBase.updateStat();
}

function calculateAngle(deltaX, deltaY) {
	return Math.atan(deltaY / deltaX);
}

function setRange(missile, id) {
	if (missile.type == 1){
		setTimeout(function () {
			missile.size = 55; 
			if (!missile.exploded){ 
				explode(missile);
			}
			missile.removeAllEventListeners();
			stage.removeChild(missile);
			stage.update();
		}, missile.life_time)

	} else {
		setTimeout(function () {
			if (missile.type == 5) {
				window.clearInterval(id);
			}
			missile.removeAllEventListeners();
			stage.removeChild(missile);
		}, missile.life_time)
	}

}
function fire(deltaX, deltaY){
	var id;
	var missile = new Missile(missileType, deltaX, deltaY, ninja.x, ninja.y);
	missile.addEventListener("tick", function () {
		//TODO-KEVIN: FIX THIS UGLY METHOD
		updateProjectile(missile.VelX, missile.VelY, missile);
	});

	if (missile.type == 3) {
		//CREATE THREE MISSILE INSTANCES FOR THREE-WAY MISSILES
		var missile1 = new Missile(missileType, deltaX, deltaY, ninja.x, ninja.y);
		missile1.fire_angle -= 0.1;
		missile1.recalculate_vel();

		var missile2 = new Missile(missileType, deltaX, deltaY, ninja.x, ninja.y);
		missile2.fire_angle += 0.1;
		missile2.recalculate_vel();

		missile1.addEventListener("tick", function () {
			updateProjectile(missile1.VelX, missile1.VelY, missile1);
		});

		missile2.addEventListener("tick", function () {
			updateProjectile(missile2.VelX, missile2.VelY, missile2);
		});

		stage.addChild(missile1);
		stage.addChild(missile2);

		setTimeout(function () {
			missile1.removeAllEventListeners();
			missile2.removeAllEventListeners();
			stage.removeChild(missile1);
			stage.removeChild(missile2);
		}, missile.life_time)
	}
	if (missile.type == 5){
		missile.targetX = ninja.x;
		missile.targetY = ninja.y;
		id = setInterval(function() {
			frozenOrbFire(missile);
		}, 125);
		intervalStack.push(id);
	}

	if (missile.type == 7){
		missile.x += missile.cross_vX;
		missile.y += missile.cross_vY;
		setTimeout(function() {
			crossFire(missile, 15);
		}, 125);
	}

	if (missile.type == 9){
		setTimeout(function() {
			unstablize(missile);
		}, 500);
	}
	setRange(missile, id);
	stage.addChild(missile);
	stage.update();
}

function unstablize(missile) {

}

function crossFire(missile, stack) {
	var conMissile = new Missile(missileType, 1, 1, 0, 0);
	conMissile.cross_vX = missile.cross_vX;
	conMissile.cross_vY = missile.cross_vY;
	conMissile.x = missile.x + missile.cross_vX;
	conMissile.y = missile.y + missile.cross_vY;
	conMissile.addEventListener("tick", function () {
		updateProjectile(conMissile.VelX, conMissile.VelY, conMissile);
	});
	stack--;
	var stack_diff = 15 - stack;
	if (stack > 0) {
		if (stack == 5) {
			var id;
			id = setTimeout(function() {
				crossFire(conMissile, stack);
			}, 125)
			timeoutIds.push(id);
			var croMissile1 = new Missile(missileType, 1, 1, 0, 0);
			croMissile1.cross_vX = missile.cross_vX;
			croMissile1.cross_vY = missile.cross_vY;
			croMissile1.x = missile.x + missile.cross_vX;
			croMissile1.y = missile.y + missile.cross_vY;
			croMissile1.addEventListener("tick", function () {
				updateProjectile(croMissile1.VelX, croMissile1.VelY, croMissile1);
			});
			croMissile1 = calculateCrossVel1(croMissile1);

			var id;
			id =setTimeout(function() {
				crossFire(croMissile1, stack);
			}, 125);
			timeoutIds.push(id);

			var croMissile2 = new Missile(missileType, 1, 1, 0, 0);
			croMissile2.cross_vX = missile.cross_vX;
			croMissile2.cross_vY = missile.cross_vY;
			croMissile2.x = missile.x + missile.cross_vX;
			croMissile2.y = missile.y + missile.cross_vY;
			croMissile2.addEventListener("tick", function () {
				updateProjectile(croMissile2.VelX, croMissile2.VelY, croMissile2);
			});
			croMissile2 = calculateCrossVel2(croMissile2);
			var id;
			id = setTimeout(function() {
				crossFire(croMissile2, stack);
			}, 125);
			timeoutIds.push(id);

		} else {
			var id;
			id = setTimeout(function() {
				crossFire(conMissile, stack);
			}, 125);
			timeoutIds.push(id);
		}
	}
	stage.addChild(conMissile);
	setTimeout(function () {
		stage.removeChild(conMissile);
		conMissile.removeAllEventListeners();
	}, conMissile.life_time - (160 * stack_diff));
}

function calculateCrossVel1(missile){
	var tempVX = (-missile.cross_vY);
	missile.cross_vY = (missile.cross_vX);
	missile.cross_vX = tempVX;
	return missile;
}

function calculateCrossVel2(missile){
	var tempVX = missile.cross_vY;
	missile.cross_vY = (-missile.cross_vX);
	missile.cross_vX = tempVX;
	return missile;
}

function shotBullet(o) {
	SoundControl.play("Shot");
	if (currentMissiles == maxBullets) {
		chargeMissileID = setInterval(chargeMissile, 5000);
	}
	currentMissiles--;
	var deltaX = o.gesture.deltaX;
	var deltaY = o.gesture.deltaY;
	fire(deltaX, deltaY);
	//missile starting point is the current player position
}
function toRadians(degrees) {
  return degrees * Math.PI / 180;
};
 

function frozenOrbFire(missile){
	var origX = missile.x;
	var origY = missile.y;
	missile.angle += 20;
	var distance = Math.sqrt( ((origX - missile.targetX) * (origX - missile.targetX)) + ((origY - missile.targetY) * (origY - missile.targetY)) );
	var cos = Math.cos(toRadians(missile.angle)) * distance;
	var sin = Math.sin(toRadians(missile.angle)) * distance;
	missile.targetX += cos;
	missile.targetY += sin;


	simpleFire(missile.targetX, missile.targetY, missile.x, missile.y, 0, 0);
}

function simpleFire(enemyX, enemyY, origX, origY, bounceStack, type){
	SoundControl.play("Shot");
	if (currentMissiles == maxBullets) {
		chargeMissileID = setInterval(chargeMissile, 2500);
	}
	destX = enemyX - origX;
	destY = enemyY - origY;
	//missile starting point is the current player position

	var angle = Math.atan(destY / destX);
	var velX;
	var velY;
	if (destX < 0) {
		velX = Math.cos(angle) * -missileSpeed;
		velY = Math.sin(angle) * -missileSpeed;
	} else {
		velX = Math.cos(angle) * missileSpeed;
		velY = Math.sin(angle) * missileSpeed;
	}
	
	//1 is week missile, 2 is strong missile
	var missile1 = new Missile(type, velX, velY, origX, origY);
	missile1.bounceStack = bounceStack;
	missile1.addEventListener("tick", function () {
		updateProjectile(missile1.VelX, missile1.VelY, missile1);
	});

	if (missileType == 0 || missileType == 3 || missileType == 5) {
		setTimeout(function () {
			missile1.removeAllEventListeners();
			stage.removeChild(missile1);
		}, 1000)
	}

	stage.addChild(missile1);

	if (missileType == 4) {

	}

	stage.update();
}

function chargeMissile(){
	if (currentMissiles < maxBullets){
		currentMissiles++;
		stage.update();

	} else if (currentMissiles == maxBullets) {
		clearInterval(chargeMissileID);
	}
}

function trackEnemy(missile) {
	var relativeY = missile.y - missile.locked_in_enemy.y;
	var relativeX = missile.x - missile.locked_in_enemy.x;
	var angle = Math.atan(relativeY/relativeX);
	if (relativeX > 0){
		missile.VelX = Math.cos(angle) * -missile.speed; 
		missile.VelY = Math.sin(angle) * -missile.speed; 
		var rotation = angle * (180/Math.PI);
	} else {
		missile.VelX = Math.cos(angle) * missile.speed;
		missile.VelY = Math.sin(angle) * missile.speed;
		var rotation = angle * (180/Math.PI) + 180;
	}
	missile.rotation = rotation;
	missile.vel_set = true;
}

function updateTrackProjectile(missile) {
		missile.skill_stack--;
		if (missile.locked_in_enemy == false && (missile.skill_stack < 0)) {
			missile.locked_in_enemy = detect_enemy(missile, 50);
		}
		if (missile.locked_in_enemy == false) {
			missile.x += missile.VelX;
			missile.y += missile.VelY;
		} else {
			trackEnemy(missile);
			missile.x += missile.VelX;
			missile.y += missile.VelY;
		}
}

function updateProjectile(velX, velY, missile) {
	if (missile.type == 2) {
		updateTrackProjectile(missile);
	} else if (missile.type == 8) {
		missile.VelX *= 0.94;
		missile.VelY *= 0.94;
		missile.x += missile.VelX;
		missile.y += missile.VelY;
	} else if (missile.type == 9) {
		missile.scaleX *= 0.92;
		missile.scaleY *= 0.92;
		missile.hit *= 0.92;
		missile.x += missile.VelX;
		missile.y += missile.VelY;
	} else {
		missile.x += missile.VelX;
		missile.y += missile.VelY;
		missile.rotation += 15;
	}
	if (missile.type == 99 || missile.type == 98) {
		missileCaughtNinja(missile);
	} else {
		caughtEnemy(missile);
	}
}

function detect_enemy(missile, hit) {
	for (var j = 0; j < enemies.length; j++){
		var enemy = enemies[j];
			if (enemy.invincible){
				continue;
			}
		if (missile.hitRadius(enemy.x, enemy.y, hit) && !(enemy.type == 11)){
			return enemy;
		}
	}
	return false;
}

function missileCaughtNinja(missile) {
	if (alive && missile.hitRadius(ninja.x, ninja.y, ninja.hit)){
		SoundControl.play("Death");
		alive = false;
		createjs.Ticker.setPaused(true);
		stage.removeChild(ninja);
		messageField = new createjs.Text("Dead!", "bold 24px Arial", "#FFFFFF");
		messageField.maxWidth = 1000;
		messageField.textAlign = "center";
		messageField.x = ninja.x;
		messageField.y = ninja.y;
		messageField.maxWidth = 150;
		stage.addChild(messageField);
		createRedoButton();
	}

}

function explode(missile) {
	missile.exploded = true;
	var explosion = new createjs.Shape();
	explosion.graphics.beginFill("white").drawCircle(missile.x, missile.y, 55);
	missile.hit = 55;
	stage.addChild(explosion);
	setTimeout(function () {
		stage.removeChild(explosion);
	}, 40)
	var count = 0;
	var exploded = [];
	var explodedEnemies = [];
	for (var j = 0; j < enemies.length; j++){
		var enemy = enemies[j];
		if (enemy.invincible || (enemy.type ==11)){
			continue;
		}
		if (missile.hitRadius(enemy.x, enemy.y, enemy.hit)){
			clearTimeout(enemy.explode_id);
			exploded.push(j);
			explodedEnemies.push(enemy);
			count++;
			monsterKills++;
			missile.active--;
 			points += enemy.point;
 			pointsText.text = 'Points: ' + points;
			stage.update();
		}
	}

	for (var i = 0; i < exploded.length; i++){
		enemies.splice(exploded[i] - i, 1);
	}


	for (var i = 0; i < explodedEnemies.length; i++){
		die(explodedEnemies[i]);
	}
}


function die(crut) {
	totalKilled++;
	if (crut.type == 7) {
		setTimeout(function () {
			turnImmobile(crut);
			var spawnling_num = 4;
			for (var i = 0; i < spawnling_num ;i++) {
				var xOff = randomNumber(0, 40);
				var yOff = randomNumber(0, 40);
				spawnEnemyAt(8, crut.x + xOff, crut.y + yOff);
				crut.alive = false;
				stage.removeChild(crut);
			}
		}, 1000);
	} else {
		if (crut.type == 5){
			explode(crut);
			if (alive && crut.hitRadius(ninja.x, ninja.y, ninja.hit)){
				dieNinja();
			}	
		}
		crut.alive = false;
		stage.removeChild(crut);
	}
}

function caughtEnemy(missile){
	var deadEnemies = [];
	var explodeId;
	for (var j = 0; j < enemies.length; j++){
		var enemy = enemies[j];
		if (enemy.invincible || (enemy.type ==11) || (!enemy.alive)){
			continue;
		}
		if (missile.hitRadius(enemy.x, enemy.y, enemy.hit)){
			if (enemy.type == 9 && (enemy.skill_stack > 0)) {
				enemy.colour("#FF8787");
				enemy.skill_stack--;
				missile.removeAllEventListeners;
				stage.removeChild(missile);
				stage.update();
				SoundControl.play("Break");
				return;
			} else if (missileType == 1){
				if (!missile.exploded){ 
					explode(missile);
				}
				SoundControl.play("Break");
				missile.removeAllEventListeners;
				stage.removeChild(missile);
				stage.update();
				return;
			} else if (missileType == 6) {
				missile.size = 55; 
				if (missile.active >= 1){ 
					enemy.colour("#CC0099");

					enemy.speed *= 0.5;
					enemy.explode_id = setTimeout(function () {
						explode(enemy);
					}, 3000)
				}
				SoundControl.play("Break");
				missile.removeAllEventListeners;
				stage.removeChild(missile);
				stage.update();
				return;
			} else if (missileType == 4){
				monsterKills++;
				missile.active--;
 				points += enemy.point;
 				pointsText.text = 'Points: ' + points;
				stage.removeChild(missile);
				die(enemy);
				if (missile.bounceStack < 1){
				} else {
					missile.bounceStack--;
					bounceTo = randomNumber(0, enemies.length - 1);
					simpleFire(enemies[bounceTo].x, enemies[bounceTo].y, enemy.x, enemy.y , missile.bounceStack, missile.type);
				}
				stage.update();
				break;
			} else {
				SoundControl.play("Break");
				die(enemy);
				monsterKills++;
				missile.active--;
				if (!missile.pierce){
					stage.removeChild(missile);
				}
 				points += enemy.point;
 				pointsText.text = 'Points: ' + points;
				stage.update();
			}
		}
		if (missile.hitRadius(enemy.x, enemy.y, 80)){
			enemy.alerted = true;
		}
	}
}

function gameRestart() {
	for (var i = 0; i < intervalStack.length; i++) {
		clearInterval(intervalStack[i]);
	}
	for (var i = 0; i < enemies.length; i++) {
		clearTimeout(enemies[i].explode_id);
	}
	for (var i = 0; i < timeoutIds.length; i++) {
		clearTimeout(timeoutIds[i]);
	}
	clearInterval(chargeMissileID);
	intervalStack = new Array();
	createjs.Ticker.setPaused(false);
	stage.removeAllChildren();
	setStage(currentStageLevel);
}


function clearStage() {
	for (var i = 0; i < intervalStack.length; i++) {
		clearInterval(intervalStack[i]);
	}
	for (var i = 0; i < enemies.length; i++) {
		clearTimeout(enemies[i].explode_id);
	}
	for (var i = 0; i < timeoutIds.length; i++) {
		clearTimeout(timeoutIds[i]);
	}
	clearInterval(chargeMissileID);
	intervalStack = new Array();
	stage.removeAllChildren();
}

function randomNumber(min,max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

window.Ddmg = Ddmg;
window.Ddmg.setStage = setStage;
window.Ddmg.clearStage = clearStage;
window.Ddmg.GAME = "game";
window.Ddmg.GAMECANVAS = "gameCanvas";

}(window));

