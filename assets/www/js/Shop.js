(function (window) {
	
	var shopStage;
	var shopStageMap;
	var weaponButtonContainer;
	var weaponScrollContainer;
	var scrollScaleY = 2;
	var pointDisplay;
	var weaponTexts;
	var weaponButtons;
	var buyButtons;
	var equipedButtons;

function Shop(){
	canvasElement = document.getElementById(Shop.SHOPCANVAS);	
	canvasElement.width = 500;
	canvasElement.height = 250;
	weaponTexts = [];
	weaponButtons = [];
	buyButtons = [];
	equipedButtons = [];

	shopStage = new createjs.Stage(Shop.SHOPCANVAS);
	shopStage.x = 0; 
	shopStage.y = 0;
	// create background
	shopStageMap = new createjs.Shape();
	shopStageMap.graphics.beginFill("#535353").drawRect(0, 0, canvasElement.width, canvasElement.height);
	shopStage.addChild(shopStageMap);

	//create point, equip desplay
	var pointsText = new createjs.Text("Points:", "bold 18px Arial", "#FFFFFF");
	pointsText.x = canvasElement.width - 150;
	pointsText.y = 15;
	shopStage.addChild(pointsText);

	pointDisplay = new createjs.Text(points, "bold 18px Arial", "#FFFFFF");
	pointDisplay.x = canvasElement.width - 80;
	pointDisplay.y = 15;
	shopStage.addChild(pointDisplay);

	var continueButton = new createjs.Shape();
	var continueContainer = new createjs.Container(); 
	continueButton.graphics.beginFill("#535353").drawRect(-75, -85, 150, 170);
	continueButton.addEventListener("click", function () {
		 backToGame();
	});
	continueContainer.x = canvasElement.width - 100;
	continueContainer.y = canvasElement.height - 100;
	continueContainer.addChild(continueButton);
	continueContainer.addChild(playButton);
	shopStage.addChild(continueContainer);
	shopStage.update();
	createWeaponButtons();
	createWeaponScroll();
}


function createWeaponScroll(){
	weaponScrollContainer = new createjs.Container(); 
	var weaponScroll = new createjs.Shape();
	var weaponBar = new createjs.Shape();
	weaponScroll.graphics.beginFill("blue").drawRect(15, 0, 10, 40);
	weaponScroll.onPress = function(evt) {
		var offset = {x:weaponScroll.x-evt.stageX, y:weaponScroll.y-evt.stageY};
		evt.onMouseMove = function (ev) {
			console.log(weaponScroll.y);
			weaponScroll.y = ev.stageY+offset.y;
			weaponButtonContainer.y = -weaponScroll.y * scrollScaleY;
			if (weaponScroll.y <= 10) {
				weaponScroll.y = 0;
				weaponButtonContainer.y = 0;
			} else if (weaponScroll.y > (canvasElement.height - 50)) {
				weaponScroll.y = canvasElement.height - 40;
			}
			shopStage.update();
		}
	}
	weaponBar.graphics.beginFill("#00FFFB").drawRect(15, 0, 10, canvasElement.height);

	weaponScrollContainer.addChild(weaponBar);
	weaponScrollContainer.addChild(weaponScroll);
	shopStage.addChild(weaponScrollContainer);
	shopStage.update();
}

function createWeaponButtons(){
	weaponButtonContainer = new createjs.Container(); 
	weaponButton(0);
	weaponButton(1);
	weaponButton(2);
	weaponButton(3);
	weaponButton(4);
	weaponButton(5);
	weaponButton(6);
	weaponButton(7);
	weaponButton(8);
	weaponButton(9);
	shopStage.addChild(weaponButtonContainer);
	shopStage.update();
}


function weaponButton(index) {
	var weaponDisplay = new createjs.Shape();
	var colour = hasWeapon(index)? "red" : "#566666";
	var buyOrEquip = hasWeapon(index)? "Equip" : "Buy";
	var buttonColor = "#535353";

	var buyButton = buyButtonBitmap.clone();
	var equipedButton = equipedButtonBitmap.clone();

	buyButton.x = 250;
	buyButton.y = 25 + (index * 50);
	equipedButton.x = 250;
	equipedButton.y = 25 + (index * 50);

	buyButtons.push(buyButton);
	equipedButtons.push(equipedButton);
	if (missileType == index) {
		buyOrEquip = "Equiped";
		previousEquip = index;
		buyButton.visible = false;
	} else {
		equipedButton.visible = false;
	}
	console.log(buyButton.image);
	weaponDisplay.graphics.beginFill(colour).drawRect(50, 25 + (index * 50), 200, 30);


	var weaponButton = new createjs.Shape();
	var weaponPrice = getWeaponPrice(index);
	weaponButton.graphics.beginFill(buttonColor).drawRect(0, 0, 60, 30);
	weaponButton.x = 250;
	weaponButton.y = 25 + (index * 50);
	weaponButtons.push(weaponButton);

	var weaponButtonText = new createjs.Text(buyOrEquip, "bold 12px Arial", "#FFFFFF");
	weaponButtonText.maxWidth = 150;
	weaponButtonText.x = 255;
	weaponButtonText.y = 25 + (index * 50) + 5;
	weaponTexts.push(weaponButtonText);


	var weaponTypeText = new createjs.Text(weaponPrice, "bold 24px Arial", "#FFFFFF");
	weaponTypeText.maxWidth = 150;
	weaponTypeText.x = 100;
	weaponTypeText.y = 25 + (index * 50) + 5;


	//TODO-KKANG: add confirmation check for points, show which one is equiped
	weaponButton.addEventListener("click", function () {
		if (hasWeapon(index) && !(missileType == index)) {
			previousEquip = missileType;
			unEquip(previousEquip);
			weaponButtonText.text = "Equiped";
			buyButton.visible = false;
			equipedButton.visible = true;
			alignCenterText(weaponButtonText, buyButton, 58, 28);
			missileType = index;;
			shopStage.update();
		} else {
		if ((points >= weaponPrice) && !hasWeapon(index)){
			weaponButton.graphics.beginFill("red").drawRect(-200, 0, 200, 30);
		}
		if ((points >= weaponPrice) && !hasWeapon(index)){
			inventory.push(index);
			points -= weaponPrice;
			pointDisplay.text = points;
			weaponButtonText.text = "Equip";
			alignCenterText(weaponButtonText, buyButton, 58, 28);
			shopStage.update();
		}
	}
	});

	weaponButtonContainer.addChild(weaponDisplay);
	weaponButtonContainer.addChild(weaponButton);
	weaponButtonContainer.addChild(buyButton);
	weaponButtonContainer.addChild(equipedButton);
	weaponButtonContainer.addChild(weaponButtonText);
	weaponButtonContainer.addChild(weaponTypeText);
	alignCenterText(weaponButtonText, buyButton, 58, 28);
	shopStage.update();
}

function alignCenterText(text, display, width, height) {
	var textWidth = text.getMeasuredWidth() / 2;
	var displayWidth = width / 2;
	var posX = display.x + displayWidth - textWidth;
	text.x = posX;

	var textHeight = text.getMeasuredHeight() / 2;
	var displayHeight = height / 2;
	var posY = display.y + displayHeight - textHeight;
	text.y = posY;
}

function unEquip(index) {
	console.log(index);
	weaponTexts[index].text = "Equip";
	equipedButtons[index].visible = false;
	buyButtons[index].visible = true;
	alignCenterText(weaponTexts[index], weaponButtons[index], 58, 28);
}


function backToGame() {
	currentStageLevel++;
	Main.removeAll();
	createjs.Ticker.setPaused(false);
	document.getElementById(Shop.SHOP).style.display = "none";
	document.getElementById(Ddmg.GAME).style.display = "block";
	shopStage.removeAllChildren();
	shopStage.removeAllEventListeners();
	Ddmg.setStage(currentStageLevel);
}

function backToMain(){
	document.getElementById(Main.MENU).style.display = "block";
	document.getElementById(shop.shop).style.display = "none";
	backToMainButton.removeAllEventListeners();
	shopStage.removeAllChildren();
	shopStage.removeAllEventListeners();
	new Main();
}


window.Shop = Shop;
window.Shop.SHOP = 'shop';
window.Shop.SHOPCANVAS = 'shopCanvas';

}(window));

