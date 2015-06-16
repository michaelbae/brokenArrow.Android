(function (window) {

var optionsStage;
var optionsStageMap;

function Options(){
	canvasElement = document.getElementById(Options.OPTIONSCANVAS);	
	canvasElement.width = window.innerWidth;
	canvasElement.height = window.innerHeight;
	
	optionsStage = new createjs.Stage(Options.OPTIONSCANVAS);
	optionsStage.x = 0; 
	optionsStage.y = 0;
	// create background
	optionsStageMap = new createjs.Shape();
	optionsStageMap.graphics.beginFill("brown").drawRect(0, 0, canvasElement.width, canvasElement.height);
	optionsStage.addChild(optionsStageMap);
	//create Game Title
	var gameTitle = new createjs.Text("Game Title", "bold 24px Arial", "#FFFFFF");
	gameTitle.maxWidth = 150;
	gameTitle.textAlign = "center";
	gameTitle.x = canvasElement.width/2;
	gameTitle.y = canvasElement.height/3;
	optionsStage.addChild(gameTitle);
	//create Options Text
	
	muteSound = new Button(1, "grey", 100, 40, canvasElement.width/2 - 50, canvasElement.height/3 + 80, "Start Game");
	var muteText = new createjs.Text("mute", "bold 24px Arial", "#FFFFFF");
	muteText.maxWidth = 150;
	muteText.textAlign = "center";
	muteText.x = muteSound.x + muteSound.width/ 2;
	muteText.y = muteSound.y;
	muteSound.addEventListener("click", volumeControl);
	optionsStage.addChild(muteSound);
	optionsStage.addChild(muteText);
	
	
	//create back to main
	backToMainButton = new Button(1, "grey", 100, 40, canvasElement.width - 100, canvasElement.height - 80, "Start Game");
	var backToMainText = new createjs.Text("back", "bold 24px Arial", "#FFFFFF");
	backToMainText.textAlign = "center";
	backToMainText.x = backToMainButton.x + backToMainButton.width/ 2;
	backToMainText.y = backToMainButton.y;
	backToMainButton.addEventListener("click", backToMain);
	optionsStage.addChild(backToMainButton);
	optionsStage.addChild(backToMainText);
	
	
	optionsStage.update();
}

function volumeControl(){
	notCurrentMute = !createjs.Sound.getMute();
	SoundControl.mute(notCurrentMute);
}

function backToMain(){
	document.getElementById(Main.MENU).style.display = "block";
	document.getElementById(Options.OPTIONS).style.display = "none";
	backToMainButton.removeAllEventListeners();
	optionsStage.removeAllChildren();
	optionsStage.removeAllEventListeners();

	new Main();
}

window.Options = Options;
window.Options.OPTIONS = 'options';
window.Options.OPTIONSCANVAS = 'optionsCanvas';

}(window));

