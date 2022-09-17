/**
 * StatePlay.js
 * Implement Game Play
 * @author Hyunseok Oh
 */
var STATEPLAY = {
	READY: 0,
	COUNT: 1,
	BATTLE: 2,
	DEFEAT: 3,
	VICTORY: 4
};

function StatePlay()
{
	_state = this;
	this.state = STATEPLAY.READY;
	this.scene = Goblin.Scene.createScene();
	this.WIDTH = Goblin.Scene.sceneWidth;
	this.HEIGHT = Goblin.Scene.sceneHeight;

	this.initialize();
	this.run();
};

StatePlay.prototype.run = Goblin.Core.run;
StatePlay.prototype.pause = Goblin.Core.pause;

StatePlay.prototype.initialize = function()
{
	console.log(">> StatePlay::initialize");

	// Initialize Background
	this.imgBg1 = Goblin.Asset.get('bg1');
	this.bgY = -(this.imgBg1.object.height - this.HEIGHT + 100);

	// Initialize Effect
	this.generateEffect();
	ArrowTrigger.initialize();	// Initialize Arrow
	EnemyFactory.initialize();	// Initialize Enemys
	Player.initialize(PLAYERTYPE.KNIGHT); // Initialize Player
	StreamPuzzle.initialize();	// Initialize StreamPuzzle
	SummonFactory.initialize();	// Initialize Summon
	ItemTrigger.initialize();
	
	this.imgCount = [];
	this.imgCount.push(Goblin.Asset.get('countwave'));
	this.imgCount.push(Goblin.Asset.get('count1'));
	this.imgCount.push(Goblin.Asset.get('count2'));
	this.imgCount.push(Goblin.Asset.get('count3'));
	
	this.imageBgVictory = Goblin.Asset.get('back_victory');

	// Initialize GUI
	// Summon UI
	this.summonPorts = [];
	for(var i = 0; i < SummonFactory.summonPoints.length; i++) {
		if(SummonFactory.summonPoints[i] <= Player.maxSummonPoint) {
			var port = {
				point: SummonFactory.summonPoints[i],
				posX: 60+60*i,
				posY: Goblin.Scene.sceneHeight - 190,
				img: null,
				imgLock: null,
				lock: true
			};
			
			switch(i) {
				case SUMMONTYPE.SOLDIER: 
					port.img = Goblin.Asset.get('soldier_port');
					port.imgLock = Goblin.Asset.get('soldier_port_gray'); 
					break;
				case SUMMONTYPE.SPEARMAN: 
					port.img = Goblin.Asset.get('spearman_port');
					port.imgLock = Goblin.Asset.get('spearman_port_gray'); 
					break;
				case SUMMONTYPE.ARCHER: 
					port.img = Goblin.Asset.get('archer_port'); 
					port.imgLock = Goblin.Asset.get('archer_port_gray'); 
					break;
				case SUMMONTYPE.KNIGHT: 
					port.img = Goblin.Asset.get('knight_port'); 
					port.imgLock = Goblin.Asset.get('knight_port_gray'); 
					break;
				case SUMMONTYPE.COMMANDER: 
					port.img = Goblin.Asset.get('commander_port');
					port.imgLock = Goblin.Asset.get('commander_port_gray'); 
					break;
			}
			
			this.summonPorts.push(port);
		} 	
	}
	// Item UI
	this.itemSlot = [];
	var slot1 = {
		img: Goblin.Asset.get('portion'),
		imgLock: Goblin.Asset.get('portion_gray'),
		posX : Goblin.Scene.sceneWidth - 180,
		posY : Goblin.Scene.sceneHeight -190,
		number: 3
	};
	var slot2 = {
		img: Goblin.Asset.get('magicstick'),
		imgLock: Goblin.Asset.get('magicstick_gray'),
		posX : Goblin.Scene.sceneWidth - 120,
		posY : Goblin.Scene.sceneHeight -190,
		number: 3
	};
	this.itemSlot.push(slot1);
	this.itemSlot.push(slot2);

	// Player UI
	this.imgHpBall = Goblin.Asset.get('hpball');
	this.imgHpBallBack = Goblin.Asset.get('hpball_back');
	this.imgMask = Goblin.Asset.get('mask');
	this.posMask = {
		x : 0,
		y : 35
	};
	
	// TimeLine UI
	this.imgTimeBack = Goblin.Asset.get('time_back');
	this.posTimeBack = {x : 513,y : 12};
	this.imgTimeGauge = Goblin.Asset.get('time_gauge');
	this.imgTimeHead = Goblin.Asset.get('time_head');
	this.posTimeHead = {x : 984,y : 5};
	
	// Change State
	this.changeState(STATEPLAY.READY);
};

StatePlay.prototype.generateEffect = function()
{
	Goblin.Effect.add('blockCheck', Goblin.Asset.get('blockCheck'));
	Goblin.Effect.add('blockConsumeBlue', Goblin.Asset.get('blockConsumeBlue'));
	Goblin.Effect.add('blockConsumeDual', Goblin.Asset.get('blockConsumeDual'));
	Goblin.Effect.add('blockConsumeGreen', Goblin.Asset.get('blockConsumeGreen'));
	Goblin.Effect.add('blockConsumePurple', Goblin.Asset.get('blockConsumePurple'));
	Goblin.Effect.add('blockConsumeRed', Goblin.Asset.get('blockConsumeRed'));
	Goblin.Effect.add('blockConsumeRune', Goblin.Asset.get('blockConsumeRune'));
	Goblin.Effect.add('blockConsumeYellow', Goblin.Asset.get('blockConsumeYellow'));	
	
	Goblin.Effect.add('bloodGreen', Goblin.Asset.get('effBloodGreen'));
	Goblin.Effect.add('bloodRed', Goblin.Asset.get('effBloodRed'));
	Goblin.Effect.add('crash', Goblin.Asset.get('effCrash'));
	Goblin.Effect.add('fieldAqua', Goblin.Asset.get('effFieldAqua'));
	Goblin.Effect.add('fieldBlue', Goblin.Asset.get('effFieldBlue'));
	Goblin.Effect.add('heal', Goblin.Asset.get('effHeal'));
	Goblin.Effect.add('healPotion', Goblin.Asset.get('effHealPotion'));
	Goblin.Effect.add('shower', Goblin.Asset.get('effShower'));
	Goblin.Effect.add('stun', Goblin.Asset.get('effStun'));
	Goblin.Effect.add('summon', Goblin.Asset.get('effSummon'));
	Goblin.Effect.add('summonEvil', Goblin.Asset.get('effSummonEvil'));
	Goblin.Effect.add('effLock', Goblin.Asset.get('effLock'));
	Goblin.Effect.add('effBoom', Goblin.Asset.get('effBoom'));
	Goblin.Effect.add('effArrowShower', Goblin.Asset.get('effArrowShower'));
	
	Goblin.Effect.add('effFireExp', Goblin.Asset.get('effFireExp'));
	Goblin.Effect.add('effFireExpBig', Goblin.Asset.get('effFireExpBig'));
	Goblin.Effect.add('effDoubleHeadShot', Goblin.Asset.get('effDoubleHeadShot'));
	Goblin.Effect.add('effHeadShot', Goblin.Asset.get('effHeadShot'));
	Goblin.Effect.add('effFireArrow', Goblin.Asset.get('effFireArrow'));
	Goblin.Effect.add('effPiercingArrow', Goblin.Asset.get('effPiercingArrow'));
	
	Goblin.Effect.add('effItemShine', Goblin.Asset.get('effItemShine'));
};

StatePlay.prototype.changeState = function(state)
{
	this.state = state;
	this.elapseTime = new Date().getTime();
	switch(this.state) {
		case STATEPLAY.READY:
			// Play BGM
			// Goblin.Sound.stopBgm();
			// Goblin.Sound.playBgm('battle');
			break;
		case STATEPLAY.COUNT:
			this.countTime = 1000;
			this.countNumber = 3;
			this.countArea = {
				w : 0,
				h : 0
			};
			this.countEnd = false;
			break;
		case STATEPLAY.BATTLE:
			StreamPuzzle.changeState(PUZZLESTATE.DECISION);
			EnemyFactory.generateEnemys();
			break;
		case STATEPLAY.DEFEAT:
			Player.sprite.play(Player.motionId.DIE);
			for(var i = 0; i < EnemyFactory.enemys.length; i++) {
				var enemy = EnemyFactory.enemys[i];
				enemy.sprite.play(enemy.motionId.WALK);
			}
			StreamPuzzle.changeState(PUZZLESTATE.DESTROY);
			break;
		case STATEPLAY.VICTORY:
			this.elapseTime = new Date().getTime();
			break;
	}
};

StatePlay.prototype.update = function()
{
	switch(this.state) {
		case STATEPLAY.READY:
			StreamPuzzle.update();
			break;
		case STATEPLAY.COUNT:
			var curTime = new Date().getTime();
			if(this.countEnd) {
				if (curTime - this.elapseTime >= 700) {
					this.changeState(STATEPLAY.BATTLE);
				}
			} else {
				var t = (curTime - this.elapseTime - (this.countTime-1000))/1000;
				var img = this.imgCount[this.countNumber];
				this.countArea.w = img.data.frame.w*t;
				this.countArea.h = img.data.frame.h*t;
				
				if (curTime - this.elapseTime >= this.countTime) {
					this.countNumber--;
					if(this.countNumber == 0) {
						this.countTime += 300;
					} else {
						this.countTime += 1000;
					}
					
					if(this.countNumber < 0) {
						this.countEnd = true;
						this.countNumber = 0;
						this.elapseTime = new Date().getTime();
					}
				}	
			}
			break;
		case STATEPLAY.BATTLE:
			if(Player.curHp <= 0) {
				this.changeState(STATEPLAY.DEFEAT);
			}
			
			if(EnemyFactory.enemys.length == 0) {
				this.changeState(STATEPLAY.VICTORY);
			} 
			
			ItemTrigger.update();
			ArrowTrigger.update();
			EnemyFactory.update();
			SummonFactory.update();
			Player.update();
			StreamPuzzle.update();
			break;
		case STATEPLAY.DEFEAT:
			StreamPuzzle.update();
			var curTime = new Date().getTime();
			if (curTime - this.elapseTime >= 5000) {
				StateManager.transition(STATE.LOBBY);
			}
			break;
		case STATEPLAY.VICTORY:
			ItemTrigger.update();
			/*
			var curTime = new Date().getTime();
			if (curTime - this.elapseTime >= 5000) {
				StateManager.transition(STATE.LOBBY);
			}
			*/
			break;
	}
};

StatePlay.prototype.render = function()
{
	// Background Drawing
	Goblin.Graphics.drawImage(this.imgBg1, 0, this.bgY);

	switch(this.state) {
		case STATEPLAY.READY:
			break;
		case STATEPLAY.COUNT:
			Goblin.Graphics.drawImage(this.imgCount[this.countNumber],this.WIDTH/2-this.countArea.w/2,this.HEIGHT/2-this.countArea.h/2,this.countArea.w,this.countArea.h);
			break;
		case STATEPLAY.BATTLE:
		case STATEPLAY.VICTORY:
		case STATEPLAY.DEFEAT:
			// Object Drawing
			for (var lane = 0; lane < 30; lane++) {
				EnemyFactory.draw(lane);
				SummonFactory.draw(lane);
				
				// Play Drawing
				if (Player.lane == lane) {
					Player.draw();
				}
			}
			
			ArrowTrigger.draw();
			ItemTrigger.draw();
			break;
	}
	
	StreamPuzzle.draw();
	
	this.drawHpBall();
	this.drawTime();
	
	// Draw Summon UI
	for(var i = 0; i < this.summonPorts.length; i++) {
		if( Player.curSummonPoint >= this.summonPorts[i].point)	{
			var imgPort = this.summonPorts[i].img;
			this.summonPorts[i].lock = false;
		} else {
			var imgPort = this.summonPorts[i].imgLock;
			this.summonPorts[i].lock = true;	
		}
		Goblin.Graphics.drawImage(imgPort, this.summonPorts[i].posX, this.summonPorts[i].posY);
	}
	
	// Draw ItemSlot UI
	for(var i = 0; i < this.itemSlot.length; i++) {
		if(this.itemSlot[i].number <= 0) {
			var imgItemSlot = this.itemSlot[i].imgLock;
		} else {
			var imgItemSlot = this.itemSlot[i].img;
		}
		Goblin.Graphics.drawImage(imgItemSlot, this.itemSlot[i].posX, this.itemSlot[i].posY);
	}
	
	if(this.state == STATEPLAY.VICTORY) {
		var vbg = {
			x: (this.WIDTH - this.imageBgVictory.data.frame.w)/2,
			y: (this.HEIGHT - this.imageBgVictory.data.frame.h)/2
		}
		
		Goblin.Graphics.drawImage(this.imageBgVictory, vbg.x,vbg.y);
	}
};

StatePlay.prototype.cleanup = function()
{
	console.log('>> StatePlay::cleanup');
};

StatePlay.prototype.drawHpBall = function()
{
	var ballFrame = this.imgHpBall.data.frame;
	var ballH = parseInt(Player.curHp / Player.maxHp * ballFrame.h);
	var ballY = ballFrame.h - ballH;
	var bFr = {
		x : 50,
		y : 10 + ballY,
		cx : 0,
		cy : ballY
	};
	Goblin.Graphics.drawImage(this.imgHpBallBack, 50, 10);
	
	if (ballH <= 0) return;
	Goblin.Graphics.drawImage(this.imgHpBall, bFr.cx, bFr.cy, ballFrame.w, ballH, bFr.x, bFr.y, ballFrame.w, ballH);
	Goblin.Graphics.drawImage(this.imgMask, this.posMask.x, this.posMask.y);
};

StatePlay.prototype.drawTime = function()
{	
	Goblin.Graphics.drawImage(this.imgTimeBack, this.posTimeBack.x, this.posTimeBack.y);
	
	var curTime = new Date().getTime();
	var t = curTime - EnemyFactory.elapseGenTime;
	if(EnemyFactory.maxGenTime <= 0) return;
	
	if( t >= EnemyFactory.maxGenTime) t = EnemyFactory.maxGenTime; 
	var gaugeFrame = this.imgTimeGauge.data.frame;
	var gaugeW = t/EnemyFactory.maxGenTime*this.imgTimeGauge.data.frame.w;
	var gaugeX = gaugeFrame.w - gaugeW;
	var gaugeH = this.imgTimeGauge.data.frame.h;
	var timeGauge = {cx: gaugeX, cy: 0, x: 520 + gaugeFrame.w - gaugeW, y: 19};
	this.posTimeHead.x = timeGauge.x - 20;
	
	Goblin.Graphics.drawImage(this.imgTimeGauge, timeGauge.cx, timeGauge.cy, gaugeW, gaugeH, timeGauge.x, timeGauge.y, gaugeW, gaugeH);
	Goblin.Graphics.drawImage(this.imgTimeHead, this.posTimeHead.x, this.posTimeHead.y);
};

StatePlay.prototype.mouseDown = function(x, y) 
{
	// To Do Event Processing
	if(this.state == STATEPLAY.BATTLE) {
		StreamPuzzle.checkDown(x,y);
		this.checkSummon(x,y);
		this.checkItem(x,y);
	} else if(this.state == STATEPLAY.VICTORY) {
		StateManager.transition(STATE.ENDING);
	}
};

StatePlay.prototype.mouseDownMove = function(x, y)
{
	// To Do Event Processing
	if(this.state == STATEPLAY.BATTLE) {
		StreamPuzzle.checkMove(x,y);
	}
};

StatePlay.prototype.mouseUp = function(x, y)
{
	// To Do Event Processing
	if(this.state == STATEPLAY.BATTLE) {
		StreamPuzzle.checkUp(x,y);
	}
};

StatePlay.prototype.mouseUpMove = function(x, y)
{
	// To Do Event Processing
	if(this.state == STATEPLAY.BATTLE) {
		ItemTrigger.checkHover(x,y);
	}
};

StatePlay.prototype.touchStart = function(touches)
{
	if(this.state == STATEPLAY.BATTLE) {
		for(var i = 0; i < touches.length; i++) {
			StreamPuzzle.checkDown(touches[i].x,touches[i].y);
			this.checkSummon(touches[i].x,touches[i].y);
			this.checkItem(touches[i].x,touches[i].y);
		}
	}
};

StatePlay.prototype.touchMove = function(touches)
{
	// To Do Event Processing
	if(this.state == STATEPLAY.BATTLE) {
		for(var i = 0; i < touches.length; i++) {
			ItemTrigger.checkHover(touches[i].x,touches[i].y);
			StreamPuzzle.checkMove(touches[i].x,touches[i].y);	
		}
	}
};

StatePlay.prototype.touchEnd = function(touches)
{
	// To Do Event Processing
	if(this.state == STATEPLAY.BATTLE) {
		for(var i = 0; i < touches.length; i++) {
			StreamPuzzle.checkUp(touches[i].x,touches[i].y);
		}
	}
};


StatePlay.prototype.checkSummon = function(x, y)
{
	for(var i = 0; i < this.summonPorts.length; i++) {
		if(this.summonPorts[i].lock == true ) continue;
		
		if( x >= this.summonPorts[i].posX && x <= this.summonPorts[i].posX + 60 &&
			y >= this.summonPorts[i].posY && y <= this.summonPorts[i].posY + 60 ) {
			switch(i) {
				case SUMMONTYPE.SOLDIER: SummonFactory.generate('soldier',1); break;
				case SUMMONTYPE.SPEARMAN: SummonFactory.generate('spearman',1); break;
				case SUMMONTYPE.ARCHER: SummonFactory.generate('archer',1); break;
				case SUMMONTYPE.KNIGHT: SummonFactory.generate('knight',1); break;
				case SUMMONTYPE.COMMANDER: SummonFactory.generate('commander',1); break;
			}
			
			Player.curSummonPoint -= this.summonPorts[i].point;		
		} 
	}	
};

StatePlay.prototype.checkItem = function(x, y)
{
	for(var i = 0; i < this.itemSlot.length; i++) {
		if(this.itemSlot[i].number <= 0) continue;
		
		if( x >= this.itemSlot[i].posX && x <= this.itemSlot[i].posX + 60 &&
			y >= this.itemSlot[i].posY && y <= this.itemSlot[i].posY + 60 ) {
			var slotId = 'Slot' + i;
			ItemAction[slotId]();
		}
	}
};