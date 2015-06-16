(function (window) {

var statStage;
var statStageMap;
var backToMainButton;

function Stat(){


	DataBase.updateStat();

	canvasElement = document.getElementById(Stat.STATCANVAS);	
	canvasElement.width = window.innerWidth;
	canvasElement.height = window.innerHeight;
	
	statStage = new createjs.Stage(Stat.STATCANVAS);
	statStage.x = 0; 
	statStage.y = 0;
	// create background
	statStageMap = new createjs.Shape();
	statStageMap.graphics.beginFill("brown").drawRect(0, 0, canvasElement.width, canvasElement.height);
	statStage.addChild(statStageMap);
	//create Game Title
	var gameTitle = new createjs.Text("Game Title", "bold 24px Arial", "#FFFFFF");
	gameTitle.maxWidth = 150;
	gameTitle.textAlign = "center";
	gameTitle.x = canvasElement.width/2;
	gameTitle.y = canvasElement.height/3;
	statStage.addChild(gameTitle);
	//create Stat Text

	var userPoints = DataBase.points();
	var pointsText = new createjs.Text("Points: " + userPoints, "bold 24px Arial", "#FFFFFF");
	pointsText.textAlign = "center";
	pointsText.x = canvasElement.width/2;
	pointsText.y = canvasElement.height/2;
	
	//create back to main
	backToMainButton = new Button(1, "grey", 100, 40, canvasElement.width - 100, canvasElement.height - 80, "Start Game");
	var backToMainText = new createjs.Text("back", "bold 24px Arial", "#FFFFFF");
	backToMainText.textAlign = "center";
	backToMainText.x = backToMainButton.x + backToMainButton.width/ 2;
	backToMainText.y = backToMainButton.y;
	backToMainButton.addEventListener("click", backToMain);
	statStage.addChild(backToMainButton);
	statStage.addChild(pointsText);
	statStage.addChild(backToMainText);

	statStage.update();
}

function backToMain(){
	document.getElementById(Main.MENU).style.display = "block";
	document.getElementById(Stat.STAT).style.display = "none";
	backToMainButton.removeAllEventListeners();
	statStage.removeAllChildren();
	statStage.removeAllEventListeners();
	new Main();
}

window.Stat = Stat;
window.Stat.STAT = 'stat';
window.Stat.STATCANVAS = 'statCanvas';

}(window));

