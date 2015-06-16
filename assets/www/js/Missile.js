(function (window) {

	function Missile(type, deltaX, deltaY, x, y) {
		this.initialize(type, deltaX, deltaY, x, y);
	}

	var p = Missile.prototype = new createjs.Container();

// public properties:

	p.hit;		//average radial disparity
	p.type;		//type of enemy
	p.spin;		//spin ammount
	p.score;	//score value
	p.bounceStack;


	p.vX;		//velocity X
	p.vY;		//velocity Y

	p.active;	//is it active

	p.missile;
	p.targetX;
	p.targetY;
	p.angle;
	p.pierce;
	p.price;
	p.fire_angle;

	p.deltaX;
	p.deltaY;

	p.life_time;

	p.exploded;

	p.locked_in_enemy;
	p.skill_stack;

	p.cross_vX;
	p.cross_vY;

// constructor:
	p.Container_initialize = p.initialize;	//unique to avoid overiding base class

	p.initialize = function (type, deltaX, deltaY, x, y) {
		this.Container_initialize(); // super call
		this.exploded = false;
		this.x = x;
		this.y = y;
		this.type = type;
		this.pierce = false;
		this.activate(type);
		this.bounceStack = 3;
		this.angle = 0;
		this.locked_in_enemy = false;
		this.calculate_vel(deltaX, deltaY);
	}

// public methods:

	p.calculate_vel = function (deltaX, deltaY) {
		this.deltaX = deltaX;
		this.deltaY = deltaY;
		this.fire_angle = Math.atan(deltaY / deltaX);
		if (deltaX < 0) {
			this.VelX = Math.cos(this.fire_angle) * -this.speed;
			this.VelY = Math.sin(this.fire_angle) * -this.speed;
			this.rotation = this.fire_angle * (180/Math.PI);
		} else {
			this.VelX = Math.cos(this.fire_angle) * this.speed;
			this.VelY = Math.sin(this.fire_angle) * this.speed;
			this.rotation = (this.fire_angle * (180/Math.PI)) + 180;
		}
		if (this.type == 7) {
			this.cross_vX = this.VelX;
			this.cross_vY = this.VelY;
			this.VelX = 0;
			this.VelY = 0;
		}

	}

	p.recalculate_vel = function() {
		if (this.deltaX < 0) {
			this.VelX = Math.cos(this.fire_angle) * -this.speed;
			this.VelY = Math.sin(this.fire_angle) * -this.speed;
		} else {
			this.VelX = Math.cos(this.fire_angle) * this.speed;
			this.VelY = Math.sin(this.fire_angle) * this.speed;
		}
	}
	//handle drawing a Missile
	p.getShape = function (type) {
		switch (type) {
		 case BASIC_MISSILE:
			var radius = BASIC_MISSILE_SIZE;
			this.size = BASIC_MISSILE_SIZE;
			this.hit = BASIC_MISSILE_SIZE;
			this.speed = BASIC_MISSILE_SPEED;
			this.life_time = BASIC_MISSILE_LIFETIME;
			this.active = 1;

			//draw Missile
			this.missile = new createjs.Bitmap("images/BASIC_MISSILE.gif");;
			this.regX = 12.5;
			this.regY = 12.5;
			this.addChild(this.missile);
			this.hit *= 1.1; //pad a bit
			break;
		case TRACKING_MISSILE:
			var radius = TRACKING_MISSILE_SIZE;
			this.size = TRACKING_MISSILE_SIZE;
			this.hit = TRACKING_MISSILE_SIZE;
			this.speed = TRACKING_MISSILE_SPEED;
			this.life_time = TRACKING_MISSILE_LIFETIME;
			this.skill_stack = TRACKING_MISSILE_SKILL_STACK;
			this.active = 3;
			
			//draw Missile
			this.missile = new createjs.Bitmap("images/TRACKING_MISSILE.gif");;
			this.regX = 10;
			this.regY = 5.5;
			this.addChild(this.missile);
			this.hit *= 1.1; //pad a bit
			break;

		case EXPLODING_MISSILE:
			var radius = EXPLODING_MISSILE_SIZE;
			this.size = EXPLODING_MISSILE_SIZE;
			this.hit = EXPLODING_MISSILE_SIZE;
			this.speed = EXPLODING_MISSILE_SPEED;
			this.life_time = EXPLODING_MISSILE_LIFETIME;
			this.active = 3;
			
			//draw Missile
			this.missile = new createjs.Bitmap("images/EXPLODING_MISSILE.gif");;
			this.regX = 7.5;
			this.regY = 7.5;
			this.addChild(this.missile);
			this.hit *= 1.1; //pad a bit
			break;

		case THREE_WAY_MISSILE:
			var radius = THREE_WAY_MISSILE_SIZE;
			this.size = THREE_WAY_MISSILE_SIZE;
			this.hit = THREE_WAY_MISSILE_SIZE;
			this.speed = THREE_WAY_MISSILE_SPEED;
			this.life_time = THREE_WAY_MISSILE_LIFETIME;
			this.active = 3;
			
			//draw Missile
			this.missile = new createjs.Shape();
			this.missile.graphics.beginFill(THREE_WAY_MISSILE_COLOUR).drawCircle(0, 0, THREE_WAY_MISSILE_SIZE);
			this.addChild(this.missile);
			this.hit *= 1.1; //pad a bit
			break;

		case BOUNCING_MISSILE:
			var radius = BOUNCING_MISSILE_SIZE;
			this.size = BOUNCING_MISSILE_SIZE;
			this.hit = BOUNCING_MISSILE_SIZE;
			this.speed = BOUNCING_MISSILE_SPEED;
			this.life_time = BOUNCING_MISSILE_LIFETIME;
			this.active = 3;
			
			//draw Missile
			this.missile = new createjs.Shape();
			this.missile.graphics.beginFill(BOUNCING_MISSILE_COLOUR).drawCircle(0, 0, BOUNCING_MISSILE_SIZE);
			this.addChild(this.missile);
			this.hit *= 1.1; //pad a bit
			break;

		case FROZEN_ORB:
			var radius = FROZEN_ORB_SIZE;
			this.size = FROZEN_ORB_SIZE;
			this.hit = FROZEN_ORB_SIZE;
			this.speed = FROZEN_ORB_SPEED;
			this.life_time = FROZEN_ORB_LIFETIME;
			this.pierce = true;
			this.active = 3;
			
			//draw Missile
			this.missile = new createjs.Shape();
			this.missile.graphics.beginFill(FROZEN_ORB_COLOUR).drawCircle(0, 0, FROZEN_ORB_SIZE);
			this.addChild(this.missile);
			this.hit *= 1.1; //pad a bit
			break;

		case INFECTION_MISSILE:
			var radius = INFECTION_MISSILE_SIZE;
			this.size = INFECTION_MISSILE_SIZE;
			this.hit = INFECTION_MISSILE_SIZE;
			this.speed = INFECTION_MISSILE_SPEED;
			this.life_time = INFECTION_MISSILE_LIFETIME;
			this.pierce = false;
			this.active = 1;
			
			//draw Missile
			this.missile = new createjs.Shape();
			this.missile.graphics.beginFill(INFECTION_MISSILE_COLOUR).drawCircle(0, 0, INFECTION_MISSILE_SIZE);
			this.addChild(this.missile);
			this.hit *= 1.1; //pad a bit
			break;

		case HOLY_CROSS_MISSILE:
			var radius = HOLY_CROSS_MISSILE_SIZE;
			this.size =HOLY_CROSS_MISSILE_SIZE;
			this.hit = HOLY_CROSS_MISSILE_SIZE;
			this.speed = HOLY_CROSS_MISSILE_SPEED;
			this.life_time = HOLY_CROSS_MISSILE_LIFETIME;
			this.pierce = true;
			this.active = 1;
			
			//draw Missile
			this.missile = new createjs.Shape();
			this.missile.graphics.beginFill(HOLY_CROSS_MISSILE_COLOUR).drawCircle(0, 0, HOLY_CROSS_MISSILE_SIZE);
			this.addChild(this.missile);
			this.hit *= 1.1; //pad a bit
			break;

		case SUPER_TRAP_MISSILE:
			var radius = SUPER_TRAP_MISSILE_SIZE;
			this.size = SUPER_TRAP_MISSILE_SIZE;
			this.hit = SUPER_TRAP_MISSILE_SIZE;
			this.speed = SUPER_TRAP_MISSILE_SPEED;
			this.life_time = SUPER_TRAP_MISSILE_LIFETIME;
			this.pierce = true;
			this.active = 1;
			
			//draw Missile
			this.missile = new createjs.Bitmap("images/SUPER_TRAP.gif");;
			this.regX = 20;
			this.regY = 20;
			this.addChild(this.missile);
			this.hit *= 1.1; //pad a bit
			break;

		case UNSTABLE_POWER_MISSILE:
			var radius = UNSTABLE_POWER_MISSILE_SIZE;
			this.size = UNSTABLE_POWER_MISSILE_SIZE;
			this.hit = UNSTABLE_POWER_MISSILE_SIZE;
			this.speed = UNSTABLE_POWER_MISSILE_SPEED;
			this.life_time = UNSTABLE_POWER_MISSILE_LIFETIME;
			this.pierce = true;
			this.active = 1;
			
			//draw Missile
			this.missile = new createjs.Shape();
			this.missile.graphics.beginFill(UNSTABLE_POWER_MISSILE_COLOUR).drawCircle(0, 0, UNSTABLE_POWER_MISSILE_SIZE);
			this.addChild(this.missile);
			this.hit *= 1.1; //pad a bit
			break;
		case 98:
			var radius = LASER_MISSILE_SIZE;
			this.size = LASER_MISSILE_SIZE;
			this.hit = LASER_MISSILE_SIZE;
			this.speed = LASER_MISSILE_SPEED;
			this.life_time = LASER_MISSILE_LIFETIME;
			this.active = 3;
			
			//draw Missile
			this.missile = new createjs.Shape();
			this.missile.graphics.beginFill(LASER_MISSILE_COLOUR).drawCircle(0, 0, LASER_MISSILE_SIZE);
			this.addChild(this.missile);
			this.hit *= 1.1; //pad a bit
			break;

		case 99:
			var radius = EXPLODING_MISSILE_SIZE;
			this.size = EXPLODING_MISSILE_SIZE;
			this.hit = EXPLODING_MISSILE_SIZE;
			this.speed = EXPLODING_MISSILE_SPEED;
			this.life_time = EXPLODING_MISSILE_LIFETIME;
			this.active = 3;
			
			//draw Missile
			this.missile = new createjs.Shape();
			this.missile.graphics.beginFill(EXPLODING_MISSILE_COLOUR).drawCircle(0, 0, EXPLODING_MISSILE_SIZE);
			this.addChild(this.missile);
			this.hit *= 1.1; //pad a bit
			break;
	}

	}
	
	p.tick = function (){
	
	}

	//handle reinit for poolings sake
	p.activate = function (type) {
		this.getShape(type);
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


 	p.randomNumber = function (min,max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	window.Missile = Missile;

}(window));
