/**
 * StreamPuzzle.js
 * StreamPuzzle Class
 * @author Hyunseok Oh
 */
var BLOCKSTATE = { INIT: 0, READY: 1, STOP : 2, MOVE : 3, KEEP: 4, CRASH: 5, CRASHED: 6 };
var BLOCKCOLOR = { BLUE: '0', GREEN: '1', PURPLE: '2', RED: '3', YELLOW: '4' };
var BLOCKRUNE = { A: 'A', B: 'B', C: 'C', D: 'D', E: 'E', F: 'F', H: 'H', I: 'I', J: 'J', K: 'K' };
var PUZZLESTATE = { INIT: 0, READY : 1, DECISION: 2, CONSUME: 3, SCROLL: 4, DESTROY: 5 }

/**
 * Block Object Class
 */
function Block(id,color,rune,x) 
{
	this.id = id;
	this.color = color;
	this.rune = rune;
	this.state = BLOCKSTATE.INIT;
	this.sprite = null;
	this.runeImage = null;
	this.lerp = null;
	this.pos = {x: x, y: Goblin.Scene.sceneHeight - 100};
	this.speed = 0.1;
	this.motionId = {CRASH1: 0, CRASH2: 1, IDLE: 2};
};

/**
 * Block Change State
 */
Block.prototype.changeState = function(state)
{
	this.state = state;
	this.lerp = null;
	switch(state) {
		case BLOCKSTATE.INIT:	break;
		case BLOCKSTATE.READY:	break;
		case BLOCKSTATE.MOVE:
			//this.lerp = new Lerp(this.pos.x,24 + this.id*100,200);
			this.elapseTime = new Date().getTime();
			break;
		case BLOCKSTATE.STOP:	break;
		case BLOCKSTATE.KEEP:
			Goblin.Effect.pull('blockConsumeRune',StreamPuzzle.blocks[StreamPuzzle.hoverBlock].pos.x-50,StreamPuzzle.blocks[StreamPuzzle.hoverBlock].pos.y-50);
			Goblin.Sound.play('effDual');
			this.elapseTime = new Date().getTime();
			StreamPuzzle.skillHover = true;
			break;
		case BLOCKSTATE.CRASH:
			switch(Goblin.Math.rand(0,1)) {
				case 0:
					Goblin.Sound.play('effCrash1');
					this.sprite.play(this.motionId.CRASH1);
					break;
				case 1:
					Goblin.Sound.play('effCrash2');
					this.sprite.play(this.motionId.CRASH2);
					break;
			}
			break;
		case BLOCKSTATE.CRASHED:
			break;
	}
};

/**
 * Block Update
 */
Block.prototype.update = function()
{
	switch(this.state) {
		case BLOCKSTATE.INIT:
			// Color & Color Image
			switch(this.color) {
				case BLOCKCOLOR.BLUE: var spr = 'blockBlue'; break;
				case BLOCKCOLOR.GREEN: var spr = 'blockGreen'; break;
				case BLOCKCOLOR.PURPLE: var spr = 'blockPurple'; break;
				case BLOCKCOLOR.RED: var spr = 'blockRed';	break;
				case BLOCKCOLOR.YELLOW: var spr = 'blockYellow'; break;	
			}
			this.sprite = Goblin.Object.createSprite(Goblin.Asset.get(spr));
			this.sprite.play(this.motionId.IDLE);
			
			// Rune & Rune Image
			switch(this.rune) {
				case BLOCKRUNE.A: var img = 'rune_A'; break;
				case BLOCKRUNE.B: var img = 'rune_B'; break;
				case BLOCKRUNE.C: var img = 'rune_C'; break;
				case BLOCKRUNE.D: var img = 'rune_D'; break;
				case BLOCKRUNE.E: var img = 'rune_E'; break;
				case BLOCKRUNE.F: var img = 'rune_F'; break;
				case BLOCKRUNE.H: var img = 'rune_H'; break;
				case BLOCKRUNE.I: var img = 'rune_I'; break;
				case BLOCKRUNE.J: var img = 'rune_J'; break;
				case BLOCKRUNE.K: var img = 'rune_K'; break;
				default: break;
			}
			if(this.rune != null) {
				this.runeImage = Goblin.Asset.get(img);
				this.runeImagePos = {x: 50 - this.runeImage.data.frame.w/2, y: 50 - this.runeImage.data.frame.h/2};	
			}
			
			this.changeState(BLOCKSTATE.READY);
			break;
		case BLOCKSTATE.READY:	break;
		case BLOCKSTATE.MOVE:
			var curTime = new Date().getTime();
			var t = curTime - this.elapseTime;
			this.pos.x -= t*this.speed;
			var targetX = 24 + this.id*100;
			if(this.pos.x <= targetX) {
				this.pos.x = targetX;
				this.changeState(BLOCKSTATE.STOP);
			} 
			break;
		case BLOCKSTATE.STOP:	break;
		case BLOCKSTATE.KEEP:
			var curTime = new Date().getTime();
			if(curTime - this.elapseTime > 165) {
				StreamPuzzle.skillHover = false;
				this.changeState(BLOCKSTATE.CRASHED);
			}
			break;
		case BLOCKSTATE.CRASH:
			if(this.sprite.isMaxFrame()) {
				this.changeState(BLOCKSTATE.CRASHED);
			}
			break;
		case BLOCKSTATE.CRASHED:
			StreamPuzzle.eraseBlock(this.id);
			break;
	}
};

/**
 * Block Update
 */
Block.prototype.draw = function()
{
	switch(this.state) {
		case BLOCKSTATE.INIT:	
			break;
		case BLOCKSTATE.READY:	
			break;
		case BLOCKSTATE.MOVE:
		case BLOCKSTATE.STOP:
			Goblin.Graphics.drawSprite(this.sprite,this.pos.x-100,this.pos.y-100);
			if(this.rune != null) {
				Goblin.Graphics.drawImage(this.runeImage,this.pos.x+this.runeImagePos.x,this.pos.y+this.runeImagePos.y);
			}
			break;
		case BLOCKSTATE.CRASH:
			Goblin.Graphics.drawSprite(this.sprite,this.pos.x-50,this.pos.y-50);
			break;
		case BLOCKSTATE.CRASHED:
			break;
	}
};

/**
 * StreamPuzzle Object
 * Manage Stream Puzzle
 */
var StreamPuzzle = {
	runeGenProbability: 30,
	state: PUZZLESTATE.INIT,
	MaxBlock: 10,
	flySpeed: 0.3,
	scrollSpeed: 0.1,
	scrollTick: 1000,
	countColorArray: 0,
	countRuneArray: 0,
	blocks: [],
/**
 * Initialize Stream Puzzle
 */
	initialize: function() {
		console.log(">> StreamPuzzle::initialize");
		
		this.imgPuzzleBg = Goblin.Asset.get('bg_puzzle');
		this.posPuzzleBgY = Goblin.Scene.sceneHeight - this.imgPuzzleBg.data.frame.h;
		this.imgSkillBg = Goblin.Asset.get('bg_skill');
		this.imgSkillBgHover = Goblin.Asset.get('bg_skill_hover');
		this.posSkillBgY = this.posPuzzleBgY - this.imgSkillBg.data.frame.h;
		this.imgGreenBallBack = Goblin.Asset.get('green_ballback');
		this.imgGreenBall = Goblin.Asset.get('green_ball');
		
		this.blocks = [];	// Block Array Initialize
		this.curSkillPoint = 0;
		
		this.countColorArray = 0;
		this.countRuneArray = 0;
		this.hoverBlock = null;
		this.skillReady = false;
		this.skillRune = null;
		this.skillHover = false;
		this.skillLevel = 0;
		this.maxSkillLevel = 3;
		this.imgSkillRune = null;
		this.posSkillRune = null;
		
		this.stageId = 'Stage'+1;
		for(var i = 0; i < this.MaxBlock; i++) {
			//var bData = this.generateBlockData(i);
			var bData = this.generateBlockData(i,BlockRuneInfo[this.stageId]);
			var block = new Block(i,bData.color,bData.rune,Goblin.Scene.sceneWidth + i*100);			
			this.blocks.push(block);
		}
		
		this.changeState(PUZZLESTATE.READY);	// Start Animation
	},
/**
 * Generate Block Data
 * @param {Array} - User Defined Array
 */
	generateBlockData: function(i,runArr,colArr) {
		var data = { color: null, rune: null};
		
		if(arguments.length == 1) {
			if(i == 0)	data.color = this.generateColor();
			else 		data.color = this.generateColor(this.blocks[i-1].color);
			data.rune = this.generateRune(Player.rune,this.runeGenProbability);
			return data;
		} else if(arguments.length == 2) {
			if(i == 0)	data.color = this.generateColor();
			else 		data.color = this.generateColor(this.blocks[i-1].color);
			
			var num = Goblin.Math.rand(0,99);
			if(num < this.runeGenProbability) {
				data.rune = runArr[this.countRuneArray];
				this.countRuneArray++;
				if(this.countRuneArray >= runArr.length)
				this.countRuneArray = 0;
			}
		} else if(arguments.length == 3) {
			switch(colArr[this.countColorArray]) {
				case 0: data.color = BLOCKCOLOR.BLUE; break;
				case 1: data.color = BLOCKCOLOR.GREEN; break;
				case 2: data.color = BLOCKCOLOR.PURPLE; break;
				case 3: data.color = BLOCKCOLOR.RED; break;
				case 4: data.color = BLOCKCOLOR.YELLOW; break;
			}
			this.countColorArray++;
			if(this.countColorArray >= colArr.length)
				this.countColorArray = 0;
			
			var num = Goblin.Math.rand(0,99);
			if(num < this.runeGenProbability) {
				data.rune = runArr[this.countRuneArray];
				this.countRuneArray++;
				if(this.countRuneArray >= runArr.length)
				this.countRuneArray = 0;
			} 	
		}
		
		return data;
	},
/**
 * Generate Block Rune
 * @param {Array} - Generatable Rune : { A : 'A', B : 'B', Th : 'C', D : 'D', E : 'E', F : 'F', H : 'H' }
 * @param {Number} - Rune Generation Probability
 * @return {BLOCKRUNE} - Block Rune : { A : 'A', B : 'B', Th : 'C', D : 'D', E : 'E', F : 'F', H : 'H' }
 */
	generateRune: function(runeArr,genProb) {
		var num = Goblin.Math.rand(0,99);
		if(num >= genProb) return null;
				
		var runeId = Goblin.Math.rand(0,runeArr.length-1);
		var rune = runeArr[runeId];
		
		return rune;
	},
/**
 * Generate Block Color
 * @param {BLOCKCOLOR} - Prevent Block Color : { BLUE : '1', GREEN : '2', PURPLE: '3', RED: '4', YELLOW: '5' }
 * @return {BLOCKCOLOR} - Block Color : { BLUE : '1', GREEN : '2', PURPLE: '3', RED: '4', YELLOW: '5' }
 */	
	generateColor: function(preventColor) {
		// Set Block Generate Probability
		var probability = [20,20,20,20,20];
		if(arguments.length >= 1) {
			switch(preventColor) {
				case BLOCKCOLOR.BLUE: probability[0] = 20; break;
				case BLOCKCOLOR.GREEN: probability[1] = 20; break;
				case BLOCKCOLOR.PURPLE: probability[2] = 20; break;
				case BLOCKCOLOR.RED: probability[3] = 20; break;
				case BLOCKCOLOR.YELLOW: probability[4] = 20; break;
			}
		}
		
		switch(Goblin.Math.calcProbability(probability)) {
			case 0: col = BLOCKCOLOR.BLUE; break;
			case 1: col = BLOCKCOLOR.GREEN; break;
			case 2: col = BLOCKCOLOR.PURPLE; break;
			case 3: col = BLOCKCOLOR.RED; break;
			case 4: col = BLOCKCOLOR.YELLOW; break;
		}
		
		return col;
	},
/**
 * Change & Initialize Puzzle State 
 * @param {PUZZLESTATE} - State : { INIT: 0, READY : 1, SCROLL: 2, DESTROY: 3 }
 */	
	changeState: function(state) {
		this.state = state;
		switch(this.state) {
			case PUZZLESTATE.READY:
				//console.log(">> StreamPuzzle::changeState PUZZLESTATE.READY");
				this.elapseTime = new Date().getTime();
				break;
			case PUZZLESTATE.DECISION:
				//console.log(">> StreamPuzzle::changeState PUZZLESTATE.DECISION");
				break;
			case PUZZLESTATE.CONSUME:
				//console.log(">> StreamPuzzle::changeState PUZZLESTATE.CONSUME");
				this.elapseTime = new Date().getTime();
				break;
			case PUZZLESTATE.SCROLL:
				//console.log(">> StreamPuzzle::changeState PUZZLESTATE.SCROLL");
				this.elapseTime = new Date().getTime();
				break;
			case PUZZLESTATE.DESTROY:
				for(var i = 0; i < this.blocks.length; i++) {
					this.blocks[i].changeState(BLOCKSTATE.CRASH);
				}
				//console.log(">> StreamPuzzle::changeState PUZZLESTATE.DESTROY");
				break;
		}
	},
/**
 * Update Puzzle Logic on StatePlay
 */
	update: function() {
		switch(this.state) {
			case PUZZLESTATE.READY:
				var curTime = new Date().getTime();			
				for(var i = 0; i < this.blocks.length; i++) {
					// Block Fly In Start
					if(i == this.MaxBlock - 1) {						
						if(this.blocks[i].state == BLOCKSTATE.STOP) {
							_state.changeState(STATEPLAY.COUNT);
						}
					}
					// Next Block Fly In
					if(this.blocks[i].state == BLOCKSTATE.READY && curTime - this.elapseTime >= 150*i + 150) {
						this.blocks[i].speed = this.flySpeed;
						this.blocks[i].changeState(BLOCKSTATE.MOVE);
					}
					// Block Update
					this.blocks[i].update();
				}
				break;
			case PUZZLESTATE.DECISION:
				var colorPattern = this.checkColorPattern();
				this.patternLength = colorPattern.length;
								
				switch(colorPattern[0]) {
					case BLOCKCOLOR.BLUE: this.consumeBlock(this.patternLength,'Blue'); break;
					case BLOCKCOLOR.GREEN: this.consumeBlock(this.patternLength,'Green'); break;
					case BLOCKCOLOR.PURPLE: this.consumeBlock(this.patternLength,'Purple'); break;
					case BLOCKCOLOR.RED: this.consumeBlock(this.patternLength,'Red'); break;
					case BLOCKCOLOR.YELLOW: this.consumeBlock(this.patternLength,'Yellow'); break;
				}
											
				// Change Puzzle State				
				this.changeState(PUZZLESTATE.CONSUME);
				break;
			case PUZZLESTATE.CONSUME:
				var curTime = new Date().getTime();
				
				if(curTime - this.elapseTime >= 300) {
					
					var consume = false;
					if(this.blocks[0].pos.x >= Goblin.Scene.sceneWidth)
						this.changeState(PUZZLESTATE.SCROLL);
					
					for(var i = 0; i < this.patternLength; i++) {
						if(this.blocks[i].state == BLOCKSTATE.STOP) {
							consume = true;	
						} else {
							consume = false;
						}
					}
					
					if(consume) {
						// Remove Block in Block Array
						for(var i = 0; i < this.patternLength; i++) { 
							this.blocks.splice(0,1); 
						}
						this.regenerateBlocks(this.patternLength);
						if(this.hoverBlock != null) this.hoverBlock -= this.patternLength; 
						// Attack & Skill
						var sInfo = {
							rune: null,
							level: this.patternLength,
							time: null
						};
						Player.triggerAction(sInfo);
						
						// Summon Point
						Player.curSummonPoint += this.patternLength;
						if( Player.curSummonPoint >= Player.maxSummonPoint)
							Player.curSummonPoint = Player.maxSummonPoint;
						
						// Move Each State
						if(this.patternLength > 1) {
							var colorPattern = this.checkColorPattern();
							if(colorPattern.length > 1 && this.blocks[colorPattern.length-1].pos.x < Goblin.Scene.sceneWidth)
								this.changeState(PUZZLESTATE.DECISION);
							else
								this.changeState(PUZZLESTATE.SCROLL);	
						} else {
							this.changeState(PUZZLESTATE.SCROLL);
						}
					}
				} 
				
				for(var i = 0; i < this.blocks.length; i++) {
					this.blocks[i].update();
				}	
				break;
			case PUZZLESTATE.SCROLL:
				for(var i = 0; i < this.blocks.length; i++) {
					if(this.blocks[i].state == BLOCKSTATE.READY || this.blocks[i].state == BLOCKSTATE.STOP) {
						this.blocks[i].speed = this.scrollSpeed;
						this.blocks[i].changeState(BLOCKSTATE.MOVE);	
					} else {
						this.blocks[i].update();	
					}
				}
				
				if(this.blocks[this.blocks.length-1].state == BLOCKSTATE.STOP) {
					var curTime = new Date().getTime();
					if(curTime - this.elapseTime >= this.scrollTick) {
						this.changeState(PUZZLESTATE.DECISION);	
					}
				}
				break;
		}
	},
/**
 * Draw Puzzle Blocks on StatePlay
 */
	draw: function() {
		Goblin.Graphics.drawImage(this.imgPuzzleBg,0,this.posPuzzleBgY);
		
		for(var i = 0; i < this.blocks.length; i++) {
			this.blocks[i].draw();
		}
		
		Goblin.Graphics.drawImage(this.imgGreenBallBack,475,Goblin.Scene.sceneHeight - 195);
		if( this.skillReady == true) {
			var prob = this.skillLevel/this.maxSkillLevel;
			var gBall = {
				cx: 0,
				cy: (1 - prob)*this.imgGreenBall.data.frame.h,
				cw: this.imgGreenBall.data.frame.w,
				ch: prob*this.imgGreenBall.data.frame.h,
				x: 475,
				y: Goblin.Scene.sceneHeight - 195 + (1 - prob)*this.imgGreenBall.data.frame.h
			};
			Goblin.Graphics.drawImage(this.imgGreenBall,gBall.cx,gBall.cy,gBall.cw,gBall.ch,gBall.x,gBall.y,gBall.cw,gBall.ch);
			Goblin.Graphics.drawImage(this.imgSkillRune,475 + this.posSkillRune.x,Goblin.Scene.sceneHeight - 195 + this.posSkillRune.y);
		}
		
		if(this.skillHover == true) {
			Goblin.Graphics.drawImage(this.imgSkillBgHover,0,this.posSkillBgY);
		} else {
			Goblin.Graphics.drawImage(this.imgSkillBg,0,this.posSkillBgY);	
		}
	},
/**
 * Check Color Pattern
 */
	checkColorPattern: function() {
		var ptnStr = this.blocks[0].color;
		for(var i = 1; i < this.blocks.length; i++) {	
			if(this.blocks[0].color == this.blocks[i].color) {
				ptnStr = ptnStr + this.blocks[i].color;
			} else {
				return ptnStr;
			}
		}
		
		return ptnStr;
	},
/**
 * Consume Block Effect
 * @param {Number} - Consume Block Length
 * @param {String} - Effect Type : { 'Dual', 'Rune', 'Blue', 'Green', 'Purple', 'Red', 'Yellow' }
 */	
	consumeBlock: function(length,type) {
		// Effect
		switch(type) {
			case 'Dual': var strID = 'blockConsumeDual'; break;
			case 'Rune': var strID = 'blockConsumeRune'; break;
			case 'Blue': var strID = 'blockConsumeBlue'; break;
			case 'Green': var strID = 'blockConsumeGreen'; break;
			case 'Purple': var strID = 'blockConsumePurple'; break;
			case 'Red': var strID = 'blockConsumeRed'; break;
			case 'Yellow': var strID = 'blockConsumeYellow'; break;
		}
		for(var i = 0; i < length; i++) Goblin.Effect.pull(strID,this.blocks[i].pos.x-50,this.blocks[i].pos.y-50);
		
		// Sprite
		switch(type) {
			case 'Dual':
				break;
			case 'Rune':
				break;
			case 'Blue':
			case 'Green':
			case 'Purple':
			case 'Red':
			case 'Yellow':
				break;
		}
	},
/**
 * Regenerate Blocks
 * @param {Number} - Regenerate Block Length
 */	
	regenerateBlocks: function(n) {
		for(var i = 0; i < this.blocks.length; i++) {
			this.blocks[i].id = i;
		}
		
		var oldBlockLength = this.blocks.length;
		for(var i = oldBlockLength; i < oldBlockLength + n; i++) {
			//var bData = this.generateBlockData(i);
			//var bData = this.generateBlockData(i,BlockColorInfo[this.stageId],BlockRuneInfo[this.stageId]);
			var bData = this.generateBlockData(i,BlockRuneInfo[this.stageId]);
			var block = new Block(i,bData.color,bData.rune,this.blocks[oldBlockLength-1].pos.x + (i-(oldBlockLength-1))*100);
			this.blocks.push(block);
		}								
	},	
/**
 * Erase Block
 * @param {Number} - Erase Block Id
 */	
	eraseBlock: function(id) {
		// Remove Block in Block Array
		this.blocks.splice(id,1);
		this.regenerateBlocks(1);
		
		for(var i = 0; i < this.blocks.length; i++) {
			if(this.blocks[i].state == BLOCKSTATE.MOVE)
				this.blocks[i].changeState(BLOCKSTATE.MOVE);
		}								
	},

	// 마우스 다운 시
	checkDown: function(x,y) {
		this.hoverBlock = null;
		this.touchPos = null;
		// 스킬 시전
		if(x > 475 && x < 550 && y >= Goblin.Scene.sceneHeight - 195 && y <= Goblin.Scene.sceneHeight - 120) {
			if(this.skillReady == true) {
				var sInfo = {
					rune: this.skillRune,
					level: this.skillLevel,
					time: new Date().getTime()
				};
				Player.triggerAction(sInfo);
				
				this.skillReady = false;
				this.skillRune = null;
				this.skillLevel = 0;
				this.imgSkillRune = null;
				this.posSkillRune = null;
			}	
		}
		
		// 클릭한 블럭 아이디 저장
		for(var i = 0; i < this.blocks.length; i++) {
			if(this.blocks[i].state == BLOCKSTATE.MOVE || this.blocks[i].state == BLOCKSTATE.STOP) {
				if(x > this.blocks[i].pos.x && x < this.blocks[i].pos.x + 100 && y >= Goblin.Scene.sceneHeight - 100) {
					if(this.blocks[i].rune == null)	break;
					this.hoverBlock = i;
					this.touchPos = {x: x, y: y};
				}
			} else break;
		}
	}, 
 
 	// 마우스 이동
	checkMove: function(x,y) {
		if(this.hoverBlock != null && this.touchPos != null) {
			var curPos = {x: x,y: y};
			var move = Goblin.Math.length(this.touchPos,curPos);
			if( move > 50 ) {
				this.blocks[this.hoverBlock].changeState(BLOCKSTATE.KEEP);
				
				if(this.skillRune == this.blocks[this.hoverBlock].rune) {
					this.skillLevel++;
					if(this.skillLevel >= this.maxSkillLevel)
						this.skillLevel = this.maxSkillLevel;
				} else {
					this.skillLevel = 1;
					this.skillRune = this.blocks[this.hoverBlock].rune;
					switch(this.skillRune) {
						case BLOCKRUNE.A: var img = 'rune_A'; break;
						case BLOCKRUNE.B: var img = 'rune_B'; break;
						case BLOCKRUNE.C: var img = 'rune_C'; break;
						case BLOCKRUNE.D: var img = 'rune_D'; break;
						case BLOCKRUNE.E: var img = 'rune_E'; break;
						case BLOCKRUNE.F: var img = 'rune_F'; break;
						case BLOCKRUNE.H: var img = 'rune_H'; break;
						case BLOCKRUNE.I: var img = 'rune_I'; break;
						case BLOCKRUNE.J: var img = 'rune_J'; break;
						case BLOCKRUNE.K: var img = 'rune_K'; break;
						default: var img = null; break;
					}
					
					if(img != null)	 {
						this.imgSkillRune = Goblin.Asset.get(img);
						this.posSkillRune = {x: (75 - this.imgSkillRune.data.frame.w)/2, y: (75 - this.imgSkillRune.data.frame.h)/2};
						this.skillReady = true;
					}
				}
				this.hoverBlock = null;
				this.touchPos = null;	
			}	
		} 
	},
	
	// 마우스 업
	checkUp: function(x,y) {
		for(var i = 0; i < this.blocks.length; i++) {
			if(this.blocks[i].state == BLOCKSTATE.MOVE || this.blocks[i].state == BLOCKSTATE.STOP) {
				if(x > this.blocks[i].pos.x && x < this.blocks[i].pos.x + 100 && y >= Goblin.Scene.sceneHeight - 100) {
					this.blocks[i].changeState(BLOCKSTATE.CRASH);
				}
			}	else return;
		}
	}
};