(function (window) {

	function Ninja() {
		this.initialize();
	}

	var p = Ninja.prototype = new createjs.Container();

	// public properties:
	Ninja.TOGGLE = 60;
	Ninja.MAX_THRUST = 2;
	Ninja.MAX_VELOCITY = 5;

	// public properties:
	p.NinjaFlame;
	p.NinjaBody;

	p.vX;
	p.vY;

	p.hit;

	// constructor:
	p.Container_initialize = p.initialize; //unique to avoid overiding base class

	p.initialize = function () {
		this.Container_initialize();
 		this.Ninja = new createjs.Bitmap("images/horned_spider.gif");
		
		this.addChild(this.Ninja);
		this.hit = 10;
		this.regX = 50;
		this.regY = 24;

		this.timeout = 0;
		this.thrust = 0;
		this.vX = 0;
		this.vY = 0;
	}

	// public methods:
	p.makeShape = function () {
		//draw Ninja body

		var g = this.Ninja.graphics;
		g.clear();

		g.beginFill("black").drawCircle(0, 0, 10);

		//furthest visual element
		this.hit = 10;
	}

	p.tick = function (event) {
		//move by velocity
		this.x += this.vX;
		this.y += this.vY;
	}
	window.Ninja = Ninja;

})(window);
