/**
 * Summon.js
 * Summon Object Class
 * @author Hyunseok Oh
 */
var SUMMONTYPE = { SOLDIER: 0, SPEARMAN: 1, ARCHER: 2, KNIGHT: 3, COMMANDER: 4 };
var SUMMONSTATE = { READY: 0, ATTACK : 1, DIE : 2, HIT : 3, WALK : 4, HIDE: 5 };

/**
 * Summon Object Class
 * @param {Object} - Summon Asset Data
 * @param {Number} - Stage Level 
 */
function Summon(sAsset,level)
{
	this.id = sAsset.id;
	this.sprite = Goblin.Object.createSprite(sAsset.asset);
	if(this.id == 'commander')
		this.lane = 14;
	else	
		this.lane = Goblin.Math.rand(0,29);
	this.posX = 0;
	this.posY = Goblin.Scene.sceneHeight + sAsset.offset.y + this.lane - 100;
	this.offset = sAsset.offset;
	this.speed = sAsset.speed;
	this.att = sAsset.info.att + (level-1)*SummonSetting.incAttLvUp;
	this.def = sAsset.info.def + (level-1)*SummonSetting.incDefLvUp;
	this.hp = sAsset.info.hp + (level-1)*SummonSetting.incHpLvUp;
	this.attRange = sAsset.info.attRange;
	this.attSpeed = sAsset.info.attSpeed;
	this.critical = sAsset.info.critical;
	this.motionId = sAsset.motionId;
	
	this.state = SUMMONSTATE.READY;
	this.attX = this.posX + this.sprite.motions[0].width - this.attRange;
	this.attLock = false;
	this.hitArea = sAsset.hitArea;
	this.hitZoneX = this.posX + this.hitArea.x;
	this.hitZoneW = this.posX + this.hitArea.w;
	
	this.curTime = null;
	this.elapseTime = null;
};

Summon.prototype.update = function() {
	switch(this.state) {
		case SUMMONSTATE.READY:
			this.curTime = new Date().getTime();
			if(this.curTime - this.elapseTime >= 600) {
				this.changeState(SUMMONSTATE.WALK);
			}
			break;
		case SUMMONSTATE.WALK:
			if(this.posX >= Goblin.Scene.sceneWidth) {
				this.state = SUMMONSTATE.HIDE;
			} else {
				this.targetEnemys = EnemyFactory.getEnemysInRange(this.attX);
				if(this.targetEnemys.length == 0) {
					var curTime = new Date().getTime();
					var t = curTime - this.elapseTime;
					this.posX += this.speed*t;
					this.attX = this.posX + this.sprite.motions[0].width - this.attRange;
					this.hitZoneX = this.posX + this.hitArea.x;
					this.hitZoneW = this.posX + this.hitArea.w;
					//console.log('Summon:' +(this.attX-this.hitZoneW));
					this.elapseTime = curTime;
				} else {
					this.changeState(SUMMONSTATE.ATTACK);
				}
			}
			break;
		case SUMMONSTATE.ATTACK:
			var curTime = new Date().getTime();
			if(curTime - this.elapseTime >= this.attSpeed) {	// 공격 시점이 되면
				this.changeState(SUMMONSTATE.WALK);				// 이동 이나 공격을 다시 판단 함
			} else {
				if(this.sprite.isMaxFrame() && this.attLock == false) {	// 공격 시 타격 시점이 되면
					this.attLock = true;
					this.attack();
				}
			}
			break;
		case SUMMONSTATE.HIT:
			if(this.sprite.playing == false) {
				this.changeState(SUMMONSTATE.WALK);
			}
			break;
		case SUMMONSTATE.DIE:
			if(this.sprite.playing == false) {
				this.state = SUMMONSTATE.HIDE;
			}
			break;
		}
};

Summon.prototype.draw = function(lane) {
	if(this.state == SUMMONSTATE.READY) return;
	if(this.lane == lane) {
		//Goblin.Graphics.drawLine(this.attX,0,this.attX,Goblin.Scene.height,1,'red');
		//Goblin.Graphics.drawLine(this.hitZoneX,0,this.hitZoneX,Goblin.Scene.height,1,'green');
		//Goblin.Graphics.drawLine(this.hitZoneW,0,this.hitZoneW,Goblin.Scene.height,1,'green');
		Goblin.Graphics.drawSprite(this.sprite,this.posX,this.posY);	
	}
};


/**
 * Attack Summon
 * @param {Number} - Damage
 */
Summon.prototype.attack = function()
{
	if(this.targetEnemys.length == 0)	return;
	
	var minHp = this.targetEnemys[0].hp;
	var targetId = 0;
	for(var i = 0; i < this.targetEnemys.length; i++) {
		if(this.targetEnemys[i].hp <= minHp) {
			minHp = this.targetEnemys[i].hp;
			targetId = i;
		}
	}
	this.targetEnemys[targetId].setDamage(this.att);
};

/**
 * Set Summon Damage 
 * @param {Number} - Enemy Attack Damage  
 */	
Summon.prototype.setDamage = function(damage)
{	
	if(this.state == SUMMONSTATE.DIE)	return;
	else {
		this.hp -= damage;
		
		var textDamage = parseInt(damage);
		TextTrigger.pull(textDamage,this.posX + 60,this.posY + 50,'font3');
		
		
		if(this.hp <= 0) {
			this.changeState(SUMMONSTATE.DIE);
		} else {
			this.changeState(SUMMONSTATE.HIT);
			Goblin.Effect.pull('bloodRed',this.posX,this.posY);	
		}
	}
};


/**
 * Change Summon State
 * @param {SUMMONSTATE} - state: { READY, ATTACK, DIE, HIT, WALK }  
 */
Summon.prototype.changeState = function(state)
{
	this.state = state;
	switch(state) {
		case SUMMONSTATE.READY:
			break;
		case SUMMONSTATE.WALK:
			this.sprite.play(this.motionId.WALK);
			this.elapseTime = new Date().getTime();
			break;
		case SUMMONSTATE.ATTACK:
			this.attLock = false;
			this.sprite.play(this.motionId.ATT);
			this.elapseTime = new Date().getTime();
			break;
		case SUMMONSTATE.HIT:
			this.sprite.play(this.motionId.HIT);
			Goblin.Sound.play('zombiehit');
			break;
		case SUMMONSTATE.DIE:
			this.hp = 0;
			this.sprite.play(this.motionId.DIE);
			Goblin.Sound.play('zombiedeath');
			break;
	}
};

/**
 * SummonFactory Object
 * Manage Summon Objects
 */
var SummonFactory = {
	summonAssets: [], // Summon Asset Array
	summons: [],	// Summon Drawing Array
	summonPoints: [],
/**
 * Initialize Summon Factory
 */
	initialize: function() {
		this.summonAssets = [];
		this.add('soldier',SUMMONTYPE.SOLDIER,Goblin.Asset.get('summonsoldier'));
		this.add('spearman',SUMMONTYPE.SPEARMAN,Goblin.Asset.get('summonspearman'));
		this.add('archer',SUMMONTYPE.ARCHER,Goblin.Asset.get('summonarcher'));
		this.add('knight',SUMMONTYPE.KNIGHT,Goblin.Asset.get('summonknight'));
		this.add('commander',SUMMONTYPE.COMMANDER,Goblin.Asset.get('summoncommander'));
		this.summons = [];
	},
/**
 * Add summon type data
 * @param {String} - Summon Asset Id
 * @param {SUMMONTYPE} - Summon Asset Type
 * @param {Object} - Goblin Asset Object for Sprite
 */			
	add: function(id,type,asset) {
		var summonAsset = {
			id: id,
			type: type,
			asset: asset,
			info: SummonInfo[id],
			offset: null,
			speed: 0,
			hitArea: {x: 0, w: 0},
			motionId: null
		};
		
		switch(type) {
			case SUMMONTYPE.SOLDIER:	var typeStr = 'soldier'; break;
			case SUMMONTYPE.SPEARMAN:	var typeStr = 'spearman'; break;
			case SUMMONTYPE.ARCHER:		var typeStr = 'archer'; break;
			case SUMMONTYPE.KNIGHT:		var typeStr = 'knight'; break;
			case SUMMONTYPE.COMMANDER:	var typeStr = 'commander'; break;
		}
		
		summonAsset.hitArea = SummonTypeInfo[typeStr].hitArea;
		summonAsset.speed = SummonTypeInfo[typeStr].speed;
		summonAsset.offset = SummonTypeInfo[typeStr].offset;
		summonAsset.motionId = SummonTypeInfo[typeStr].motionId;
		
		this.summonPoints.push(SummonInfo[id].point);
		this.summonAssets.push(summonAsset);
	},
/**
 * Generate Summon
 * @param {String} - Summon Id
 * @param {Number} - Stage Level
 */
	generate: function(id,level) {
		for(var i = 0; i < this.summonAssets.length; i++) {
			if(this.summonAssets[i].id == id) {
				var sAsset = this.summonAssets[i];
				var summon = new Summon(sAsset,level);
				summon.elapseTime = new Date().getTime();
				
				switch(i) {
					case SUMMONTYPE.SOLDIER: var effX = -20; var effY = 110; break;
					case SUMMONTYPE.SPEARMAN: var effX = -20; var effY = 110; break;
					case SUMMONTYPE.ARCHER: var effX = -40; var effY = 70; break;
					case SUMMONTYPE.KNIGHT: var effX = -30; var effY = 70; break;
					case SUMMONTYPE.COMMANDER: var effX = 10; var effY = 210; break;
				}
				
				Goblin.Effect.pull('summon',summon.posX + effX,summon.posY  + effY);
				
				this.summons.push(summon);
				break;
			}
		}
	},
/**
 * Update summon AI logic
 */	
	update: function() {
		for(var i = 0; i < this.summons.length; i++) {
			this.summons[i].update();
		}
		
		for(var i = 0; i < this.summons.length; i++) {
			this.eraseSummon(i);
		}
	},
/**
 * Drawing Summon along lane
 * @param {Number} - Lane Number 
 */
	draw: function(lane) {
		for(var i = 0; i < this.summons.length; i++) {
			this.summons[i].draw(lane);			
		}
	},
/**
 * Get Summons In Range
 * @param {Number} - Attack range
 * @return {Object} - Summons
 */
	getSummonsInRange: function(posX) {
		var summons = [];
		for(var i = 0; i < this.summons.length; i++) {
			if( posX >= this.summons[i].hitZoneX && posX <= this.summons[i].hitZoneW) {
				if(this.summons[i].state == SUMMONSTATE.READY)	continue;
				summons.push(this.summons[i]);
			}
		}
		
		return summons;
	},
/**
 * Get Summons from Head
 * @param {Number} - n summons from head
 * @return {Object} - Summons
 */
	getSummonsAfterSort: function(n) {
		var summons = [];
		// Sort
		this.summons.sort(function(a,b) {
			return b.posX - a.posX;
		});
		
		var len;
		if(arguments.length == 0)	len = 1;
		else 						len = n;
		
		for(var i =0; i < len; i++) {
			if(this.summons[i].state == SUMMONSTATE.READY)	continue;
			summons.push(this.summons[i]);
		}
		return summons;
	},
/**
 * Get Summons from Type
 * @param {SUMMONTYPE} - Summon Type: { SOLDIER: 0, SPEARMAN: 1, ARCHER: 2, KNIGHT: 3, COMMANDER: 4 }
 * @return {Object} - Summons
 */
	getSummonsByType: function(stype) {
		var summons = [];
		for(var i = 0; i < this.summons.length; i++) {
			if(this.summons[i].type == stype) {
				if(this.summons[i].state == SUMMONSTATE.READY)	continue;
				summons.push(this.summons[i]);
			}
		}
		
		return summons;
	},	
	
/**
 * Check Summon Array
 * @return {Boolean} - true: empty, false: not empty 
 */
	isEmpty: function() {
		if(this.summons.length == 0) 
			return true;
		return false;
	},
	
	eraseSummon: function(id) {
		for(var i = 0; i < this.summons.length; i++) {
			if( i == id) {
				if(this.summons[i].state == SUMMONSTATE.HIDE) {
					this.summons.splice(i,1);
					return;	
				}
			}	
		}
	}
};