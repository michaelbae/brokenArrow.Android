(function (window) {

var mainStage;
var mainStageMap;
var statButton;
var optionsButton;
var tutorialButton;
function Main(){
	canvasElement = document.getElementById(Main.MENUCANVAS);	
	canvasElement.width = window.innerWidth;
	canvasElement.height = window.innerHeight;
	
	mainStage = new createjs.Stage(Main.MENUCANVAS);
	mainStage.x = 0; 
	mainStage.y = 0;
	// create background
	mainStageMap = new createjs.Shape();
	mainStageMap.graphics.beginFill("brown").drawRect(0, 0, canvasElement.width, canvasElement.height);
	mainStage.addChild(mainStageMap);
	//create Game Title
	var gameTitle = new createjs.Text("Game Title", "bold 24px Arial", "#FFFFFF");
	gameTitle.maxWidth = 150;
	gameTitle.textAlign = "center";
	gameTitle.x = canvasElement.width/2;
	gameTitle.y = canvasElement.height/3;
	mainStage.addChild(gameTitle);
	//create startGameButton
	var startGameButton = new Button(1, "grey", 150, 40, canvasElement.width/2 - 75, canvasElement.height/3 + 40, "Start Game");
	var startGameText = new createjs.Text("Start Game", "bold 24px Arial", "#FFFFFF");
	startGameText.maxWidth = 150;
	startGameText.textAlign = "center";
	startGameText.x = startGameButton.x + startGameButton.width/ 2;
	startGameText.y = startGameButton.y;
	startGameButton.addEventListener("click", startGame);
	mainStage.addChild(startGameButton);
	mainStage.addChild(startGameText);
	//create Tutorial
	tutorialButton = new Button(1, "grey", 100, 40, canvasElement.width/2 - 50, canvasElement.height/3 + 80, "Start Game");
	var tutorialText = new createjs.Text("Tutorial", "bold 24px Arial", "#FFFFFF");
	tutorialText.maxWidth = 150;
	tutorialText.textAlign = "center";
	tutorialText.x = tutorialButton.x + tutorialButton.width/ 2;
	tutorialText.y = tutorialButton.y;
	tutorialButton.addEventListener("click", showTutorial);
	mainStage.addChild(tutorialButton);
	mainStage.addChild(tutorialText);
	//create Options
	optionsButton = new Button(1, "grey", 100, 40, canvasElement.width/2 - 50, canvasElement.height/3 + 120, "Start Game");
	var optionsText = new createjs.Text("Options", "bold 24px Arial", "#FFFFFF");
	optionsText.maxWidth = 150;
	optionsText.textAlign = "center";
	optionsText.x = optionsButton.x + optionsButton.width/ 2;
	optionsText.y = optionsButton.y;
	optionsButton.addEventListener("click", showOptions);
	mainStage.addChild(optionsButton);
	mainStage.addChild(optionsText);
	//create Stat
	statButton = new Button(1, "grey", 100, 40, canvasElement.width/2 - 50, canvasElement.height/3 + 160, "Start Game");
	var statText = new createjs.Text("Stat", "bold 24px Arial", "#FFFFFF");
	statText.maxWidth = 150;
	statText.textAlign = "center";
	statText.x = statButton.x + statButton.width/ 2;
	statText.y = statButton.y;
	statButton.addEventListener("click", showStat);
	mainStage.addChild(statButton);
	mainStage.addChild(statText);
	SoundControl.play("BG");
	mainStage.update();
}

function startGame(){
	SoundControl.stop();
	removeAll();
	mainStage.clear();
	document.getElementById(Main.MENU).style.display = "none";
	document.getElementById(Ddmg.GAME).style.display = "block";
	new Ddmg();
}

function showTutorial(){
	removeAll();
	mainStage.clear();
	document.getElementById(Main.MENU).style.display = "none";
	document.getElementById(Tutorial.TUTORIAL).style.display = "block";
	new Tutorial();
}

function showOptions(){
	removeAll();
	mainStage.clear();
	document.getElementById(Main.MENU).style.display = "none";
	document.getElementById(Options.OPTIONS).style.display = "block";
	new Options();
}

function showStat(){
	removeAll();
	mainStage.clear();
	document.getElementById(Main.MENU).style.display = "none";
	document.getElementById(Stat.STAT).style.display = "block";
	new Stat();
}

function removeAll(){
	mainStage.removeAllChildren();
	mainStage.removeAllEventListeners();
	statButton.removeAllEventListeners();
	optionsButton.removeAllEventListeners();
	tutorialButton.removeAllEventListeners();
}

window.Main = Main;
window.Main.MENU = 'menu';
window.Main.MENUCANVAS = 'menuCanvas';
window.Main.removeAll = removeAll;

}(window));

