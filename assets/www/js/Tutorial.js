(function (window) {
	
	var tutorialStage;
	var tutorialStageMap;
	var TUTORIAL_TEXT = "touch move, drag to follow, swipe to shoot ninja start";
function Tutorial(){
	canvasElement = document.getElementById(Tutorial.TUTORIALCANVAS);	
	canvasElement.width = window.innerWidth;
	canvasElement.height = window.innerHeight;
	
	tutorialStage = new createjs.Stage(Tutorial.TUTORIALCANVAS);
	tutorialStage.x = 0; 
	tutorialStage.y = 0;
	// create background
	tutorialStageMap = new createjs.Shape();
	tutorialStageMap.graphics.beginFill("brown").drawRect(0, 0, canvasElement.width, canvasElement.height);
	tutorialStage.addChild(tutorialStageMap);
	//create Game Title
	var gameTitle = new createjs.Text("Game Title", "bold 24px Arial", "#FFFFFF");
	gameTitle.maxWidth = 150;
	gameTitle.textAlign = "center";
	gameTitle.x = canvasElement.width/2;
	gameTitle.y = canvasElement.height/3;
	tutorialStage.addChild(gameTitle);
	//create Tutorial Text

	var tutorialText = new createjs.Text(TUTORIAL_TEXT, "bold 24px Arial", "#FFFFFF");
	tutorialText.textAlign = "center";
	tutorialText.x = canvasElement.width/2;
	tutorialText.y = canvasElement.height/2;
	
	//create back to main
	backToMainButton = new Button(1, "grey", 100, 40, canvasElement.width - 100, canvasElement.height - 80, "Start Game");
	var backToMainText = new createjs.Text("back", "bold 24px Arial", "#FFFFFF");
	backToMainText.textAlign = "center";
	backToMainText.x = backToMainButton.x + backToMainButton.width/ 2;
	backToMainText.y = backToMainButton.y;
	backToMainButton.addEventListener("click", backToMain);
	tutorialStage.addChild(backToMainButton);
	tutorialStage.addChild(tutorialText);
	tutorialStage.addChild(backToMainText);
	
	
	tutorialStage.update();
}

function backToMain(){
	document.getElementById(Main.MENU).style.display = "block";
	document.getElementById(Tutorial.TUTORIAL).style.display = "none";
	backToMainButton.removeAllEventListeners();
	tutorialStage.removeAllChildren();
	tutorialStage.removeAllEventListeners();
	new Main();
}


window.Tutorial = Tutorial;
window.Tutorial.TUTORIAL = 'tutorial';
window.Tutorial.TUTORIALCANVAS = 'tutorialCanvas';

}(window));

