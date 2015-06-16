(function (window) {

	function Enemy(type, id, ninja_x, ninja_y) {
		this.initialize(type, id, ninja_x, ninja_y);
	}

	var p = Enemy.prototype = new createjs.Container();
	var BASIC_ENEMY = 1;
	var BASIC_ENEMY_SIZE = 10;
	var BASIC_ENEMY_SPEED = 3;

	var SPIRITUAL_ENEMY = 2;
	var SPIRITUAL_ENEMY_SIZE = 10;
	var SPIRITUAL_ENEMY_SPEED = 3;

	var SHOOTER_ENEMY = 3;
	var SHOOTER_ENEMY_SIZE = 10;
	var SHOOTER_ENEMY_SPEED = 3;

	var CHARGER_ENEMY = 4;
	var CHARGER_ENEMY_SIZE = 20;
	var CHARGER_SPEED = 2;
	var CHARGER_FULL_SPEED = 8;

	var EXPLOSION_ENEMY = 5;
	var EXPLOSION_ENEMY_SIZE = 8;
	var EXPLOSION_SPEED = 4;

	var LASER_ENEMY = 6;
	var LASER_ENEMY_SIZE = 14;
	var LASER_ENEMY_SPEED = 3;

	var SPAWN_ON_DEATH_ENEMY = 7;
	var SPAWN_ON_DEATH_ENEMY_SIZE = 17;
	var SPAWN_ON_DEATH_ENEMY_SPEED = 3;

	var SPAWNLING = 8;
	var SPAWNLING_SIZE = 5;
	var SPAWNLING_SPEED = 4;

	var SHIELDING_ENEMY = 9;
	var SHIELDING_ENEMY_SIZE = 13;
	var SHIELDING_ENEMY_SPEED = 3;

	var BLAZER_ENEMY = 10;
	var BLAZER_ENEMY_SIZE = 10;
	var BLAZER_ENEMY_SPEED = 2.5;

	var BLAZE = 11;
	var BLAZE_SIZE = 8;
	var BLAZE_SPEED = 0;

	var BLAZER_ENEMY = 10;
	var BLAZER_ENEMY_SIZE = 10;
	var BLAZER_ENEMY_SPEED = 2.5;

	var JUMPING_ENEMY = 12;
	var JUMPING_ENEMY_SIZE = 10;
	var JUMPING_ENEMY_SPEED = 3.5;
	var JUMPING_ENEMY_FULL_SPEED = 6;

	var RANDOM_THRESHOLD = 50;
	var DISTANCE_THRESHOLD = Math.sqrt(2 * (RANDOM_THRESHOLD * RANDOM_THRESHOLD));

	// static properties:
	Enemy.BASIC_ENEMY = 1;
	Enemy.SPIRITUAL_ENEMY = 2;
	// public properties:

	p.hit; //average radial disparity
	p.type; //type of enemy
	p.point; //point value

	p.id;

	p.alive;

	p.enemy;

	p.invincible;
	p.skill_stack;
	p.mobile;
	p.alerted;
	p.vX; //velocity X
	p.vY; //velocity Y
	p.speed;
	p.full_speed;

	p.vel_set;

	//side true is Ninja, false is enemy
	p.side;

	p.active; //is it active

	p.ninja_x;
	p.ninja_y;

	p.fix_vel;

	p.explode_id;

	// constructor:
	p.Container_initialize = p.initialize; //unique to avoid overiding base class

	p.initialize = function (type, id, ninja_x, ninja_y) {
		this.Container_initialize(); // super call
		this.alive = true;
		this.alerted = false;
		this.activate(type);
		this.mobile = true;
		this.side = false;
		this.explode_id = "not set";
		this.id = id;
		this.vel_set = false;
		this.fix_vel = false;
		this.ninja_x = ninja_x + this.randomNumber(-RANDOM_THRESHOLD, RANDOM_THRESHOLD);
		this.ninja_y = ninja_y + this.randomNumber(-RANDOM_THRESHOLD, RANDOM_THRESHOLD);
	}

	// public methods:

	//handle drawing a Enemy
	p.getEnemy = function (type) {
		if (type == BASIC_ENEMY) {
			var radius = BASIC_ENEMY_SIZE;
			this.size = BASIC_ENEMY_SIZE;
			this.hit = BASIC_ENEMY_SIZE;
			this.bounds = 0;
			this.type = type;
			this.speed = BASIC_ENEMY_SPEED;

			//draw Enemy
			this.enemy = new createjs.Shape();
			this.enemy.graphics.beginFill("red").drawCircle(0, 0, BASIC_ENEMY_SIZE);
			this.addChild(this.enemy);
			this.hit *= 1.1; //pad a bit
		}

		if (type == SPIRITUAL_ENEMY) {
			var radius = SPIRITUAL_ENEMY_SIZE;
			this.size = SPIRITUAL_ENEMY_SIZE;
			this.hit = SPIRITUAL_ENEMY_SIZE;
			this.type = type;
			this.skill_stack = 1;
			this.speed = SPIRITUAL_ENEMY_SPEED;

			//draw Enemy
			this.enemy = new createjs.Shape();
			this.enemy.graphics.beginFill("purple").drawCircle(0, 0, SPIRITUAL_ENEMY_SIZE);
			this.addChild(this.enemy);
			this.hit *= 1.1; //pad a bit
		}

		if (type == SHOOTER_ENEMY) {
			var radius = SHOOTER_ENEMY_SIZE;
			this.size = SHOOTER_ENEMY_SIZE;
			this.hit = SHOOTER_ENEMY_SIZE;
			this.type = type;
			this.skill_stack = 20 + this.randomNumber(0, 100);
			this.speed = SHOOTER_ENEMY_SPEED;

			var data = {
			    images: ["images/SHOOTER_ENEMY.png"],
			    frames: {width:34, height:25, count:2, regX: 17, regY: 12.5},
			    animations: {run:[0,1,true,5]}
			};
			var spriteSheet = new createjs.SpriteSheet(data);
			var animation = new createjs.BitmapAnimation(spriteSheet);
			animation.gotoAndPlay("run");

			//draw Enemy
			this.enemy = animation;
			this.addChild(this.enemy);
			this.hit *= 1.1; //pad a bit
		}

		if (type == CHARGER_ENEMY) {
			var radius = CHARGER_ENEMY_SIZE;
			this.size = CHARGER_ENEMY_SIZE;
			this.hit = CHARGER_ENEMY_SIZE;
			this.type = type;
			this.skill_stack = 1;
			this.speed = CHARGER_SPEED;
			this.full_speed = CHARGER_FULL_SPEED;

			//draw Enemy
			this.enemy = new createjs.Bitmap("images/CHARGER_ENEMY.gif");
			this.regX = 20;
			this.regY = 51;
			this.addChild(this.enemy);
			this.hit *= 1.1; //pad a bit
		}

		if (type == EXPLOSION_ENEMY) {
			var radius = EXPLOSION_ENEMY_SIZE;
			this.size = EXPLOSION_ENEMY_SIZE;
			this.hit = EXPLOSION_ENEMY_SIZE;
			this.speed = EXPLOSION_SPEED;
			this.type = type;
			this.skill_stack = 1;

			//draw Enemy
			this.enemy = new createjs.Bitmap("images/EXPLOSION_ENEMY.gif");
			this.regX = 15;
			this.regY = 16;
			this.addChild(this.enemy);
			this.hit *= 1.1; //pad a bit
		}

		if (type == LASER_ENEMY) {
			var radius = LASER_ENEMY_SIZE;
			this.size = LASER_ENEMY_SIZE;
			this.hit = LASER_ENEMY_SIZE;
			this.type = type;
			this.speed = LASER_ENEMY_SPEED;
			this.skill_stack = 20 + this.randomNumber(0, 100);

			//draw Enemy
			this.enemy = new createjs.Shape();
			this.enemy.graphics.beginFill("white").drawCircle(0, 0, LASER_ENEMY_SIZE);
			this.addChild(this.enemy);
			this.hit *= 1.1; //pad a bit
		}

		if (type == SPAWN_ON_DEATH_ENEMY) {
			var radius = SPAWN_ON_DEATH_ENEMY_SIZE;
			this.size = SPAWN_ON_DEATH_ENEMY_SIZE;
			this.hit = SPAWN_ON_DEATH_ENEMY_SIZE;
			this.type = type;
			this.speed = SPAWN_ON_DEATH_ENEMY_SPEED;

			//draw Enemy
			this.enemy = new createjs.Shape();
			this.enemy.graphics.beginFill("#6200FF").drawCircle(0, 0, SPAWN_ON_DEATH_ENEMY_SIZE);
			this.addChild(this.enemy);
			this.hit *= 1.1; //pad a bit
		}


		if (type == SPAWNLING) {
			var radius = SPAWNLING_SIZE;
			this.size = SPAWNLING_SIZE;
			this.hit = SPAWNLING_SIZE;
			this.type = type;
			this.speed = SPAWNLING_SPEED;

			//draw Enemy
			this.enemy = new createjs.Shape();
			this.enemy.graphics.beginFill("#154D33").drawCircle(0, 0, SPAWNLING_SIZE);
			this.addChild(this.enemy);
			this.hit *= 1.1; //pad a bit
		}

		if (type == SHIELDING_ENEMY) {
			var radius = SHIELDING_ENEMY_SIZE;
			this.size = SHIELDING_ENEMY_SIZE;
			this.hit = SHIELDING_ENEMY_SIZE;
			this.type = type;
			this.speed = SHIELDING_ENEMY_SPEED;
			this.skill_stack = 1;
			//draw Enemy
			this.enemy = new createjs.Shape();
			this.enemy.graphics.beginFill("#00BFFF").drawCircle(0, 0, SHIELDING_ENEMY_SIZE);
			this.addChild(this.enemy);
			this.hit *= 1.1; //pad a bit
		}

		if (type == BLAZER_ENEMY) {
			var radius = BLAZER_ENEMY_SIZE;
			this.size = BLAZER_ENEMY_SIZE;
			this.hit = BLAZER_ENEMY_SIZE;
			this.type = type;
			this.speed = BLAZER_ENEMY_SPEED;
			this.skill_stack = 4;
			//draw Enemy
			this.enemy = new createjs.Shape();
			this.enemy.graphics.beginFill("#FF4D00").drawCircle(0, 0, BLAZER_ENEMY_SIZE);
			this.addChild(this.enemy);
			this.hit *= 1.1; //pad a bit
		}

		if (type == BLAZE) {
			var radius = BLAZE_SIZE;
			this.size = BLAZE_SIZE;
			this.hit = BLAZE_SIZE;
			this.type = type;
			this.speed = BLAZE_SPEED;
			this.skill_stack = 1;
			//draw Enemy
			this.enemy = new createjs.Shape();
			this.enemy.graphics.beginFill("#FF3C00").drawCircle(0, 0, BLAZE_SIZE);
			this.addChild(this.enemy);
			this.hit *= 1.1; //pad a bit
		}
		if (type == JUMPING_ENEMY) {
			var radius = JUMPING_ENEMY_SIZE;
			this.size =JUMPING_ENEMY_SIZE;
			this.hit = JUMPING_ENEMY_SIZE;
			this.type = type;
			this.speed = JUMPING_ENEMY_SPEED;
			this.full_speed = JUMPING_ENEMY_FULL_SPEED;
			this.skill_stack = 1;
			//draw Enemy
			this.enemy = new createjs.Shape();
			this.enemy.graphics.beginFill("#112300").drawCircle(0, 0,JUMPING_ENEMY_SIZE);
			this.addChild(this.enemy);
			this.hit *= 1.1; //pad a bit
		}
	}

	p.colour = function (colour) {
		this.enemy.graphics.beginFill(colour).drawCircle(0, 0, this.size);
	}
	//handle reinit for poolings sake
	p.activate = function (type) {
		this.getEnemy(type);

		//associate point with size
		this.point = type * 10;
		this.active = true;
	}

	//handle what a Enemy does to itself every frame
	p.tick = function (event) {
	}

	p.hitPoint = function (tX, tY) {
		return this.hitRadius(tX, tY, 0);
	}

	p.hitRadius = function (tX, tY, tHit) {
		//early returns speed it up
		if (tX - tHit > this.x + this.hit) {
			return;
		}
		if (tX + tHit < this.x - this.hit) {
			return;
		}

		if (tY - tHit > this.y + this.hit) {
			return;
		}

		if (tY + tHit < this.y - this.hit) {
			return;
		}

		//now do the circle distance test
		return this.hit + tHit > Math.sqrt(Math.pow(Math.abs(this.x - tX), 2) + Math.pow(Math.abs(this.y - tY), 2));
	}

	p.immobilize = function () {
		this.mobile = false;
	}
 	p.randomNumber = function (min,max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	window.Enemy = Enemy;

})(window);