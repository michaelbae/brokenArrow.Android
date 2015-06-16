(function (window) {

	function Button(type, colour, width, height, x, y, displayText) {
		this.initialize(type, colour, width, height, x, y, displayText);
	}

	var p = Button.prototype = new createjs.Shape();

	// public properties:
	p.type; //type of Button
	p.x // x coord
	p.y // y coord
	p.colour; // colour
	p.width; // width
	p.height; // height
	p.active; //is it active

	// constructor:
	p.Shape_initialize = p.initialize; //unique to avoid overiding base class

	p.initialize = function (type, colour, width, height, x, y, displayText) {
		this.Shape_initialize(); // super call

		this.activate(type, colour, width, height, x, y, displayText);
	}

	// public methods:

	//handle drawing a Button
	p.getButton = function (type, colour, width, height, x, y, displayText) {
			//draw Button
			this.graphics.beginFill(colour).drawRect(0, 0, width, height);
	}

	//handle reinit for poolings sake
	p.activate = function (type, colour, width, height, x, y, displayText) {
		this.getButton(type, colour, width, height, x, y, displayText);
		
		this.x = x;
		this.y = y;
		this.colour = colour;
		this.width = width;
		this.height = height;

		//associate score with size
		this.active = true;
	}


	window.Button = Button;

})(window);
