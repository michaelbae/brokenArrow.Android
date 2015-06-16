(function (window) {

	function GridObject(width, height) {
		this.initialize(width, height);
	}

	var GRIDOFFSET = 12;
	var p = GridObject.prototype = new Object();
	p.id; //average radial disparity
	p.grid = [];

	p.initialize = function (width, height) {
		var xBlocks = width / GRIDOFFSET;
		var yBlocks = height / GRIDOFFSET;
		for (var i = 0; i < xBlocks; i++) {
			var array = [];
			this.grid.push(array);
			for (var j = 0; j < yBlocks; j++) {
				this.grid[i].push("");
			}
		}
	}

	p.get = function (x, y) {
		var xPos = Math.floor(x / GRIDOFFSET);
		var yPos = Math.floor(y / GRIDOFFSET);
		return this.grid[xPos][yPos];
	}

	p.set = function (x, y, id) {
		var xPos = Math.floor(x / GRIDOFFSET);
		var yPos = Math.floor(y / GRIDOFFSET);
		this.grid[xPos][yPos] = id;
	}


	window.GridObject = GridObject;

})(window);
