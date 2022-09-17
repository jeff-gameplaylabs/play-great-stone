/**
 * Enemy.js
 * Enemy Object Class
 * @author Hyunseok Oh
 */
var ENEMYTYPE = { ARMOR: 0, FAT: 1, WOMAN: 2, SMALL: 3, BOSS: 4 };
var ENEMYSTATE = { READY: 0, ATTACK : 1, DIE : 2, HIT : 3, WALK : 4, HIDE: 5,STUN: 6 };

/**
 * Enemy Object Class
 * @param {Object} - Enemy Asset Data
 * @param {Number} - Stage Level 
 */
function Enemy(eAsset,level)
{
	this.id = eAsset.id;
	this.sprite = Goblin.Object.createSprite(eAsset.asset);
	if(this.id == 'bosslord')
		this.lane = 14;
	else	
		this.lane = Goblin.Math.rand(0,29);
	this.posX = Goblin.Scene.sceneWidth;
	this.posY = Goblin.Scene.sceneHeight + eAsset.offset.y + this.lane;
	this.offset = eAsset.offset;
	this.speed = eAsset.speed;
	this.att = eAsset.info.att + (level*EnemySetting.incAttLvUp);
	this.def = eAsset.info.def + ((level-1)*EnemySetting.incDefLvUp);
	this.hp = eAsset.info.hp + (level*EnemySetting.incHpLvUp);
	this.attRange = eAsset.info.attRange;
	this.attSpeed = eAsset.info.attSpeed;
	this.critical = eAsset.info.critical;
	this.motionId = eAsset.motionId;
	this.hitPoint = eAsset.hitPoint;
	
	this.state = ENEMYSTATE.READY;
	this.attX = this.posX + this.attRange;
	this.attLock = false;
	this.hitArea = eAsset.hitArea;
	
	this.curTime = null;
	this.elapseTime = null;
	this.genTime = null;
	this.fire = false;
};

Enemy.prototype.update = function() {
	switch(this.state) {
		case ENEMYSTATE.READY:
			var curTime = new Date().getTime();
			if((curTime - this.elapseTime) >= this.genTime) {
				this.changeState(ENEMYSTATE.WALK);
			}
			break;
		case ENEMYSTATE.WALK:	
			this.targetSummons = SummonFactory.getSummonsInRange(this.attX);	// 공격범위 안의 적들을 검색
			if(this.targetSummons.length == 0) {	// 소환수가 없으면
				if(Player.isInRange(this.attX)) {	// 플레이어가 공격범위 안에 들어오면
					this.changeState(ENEMYSTATE.ATTACK);	// 공격
					this.targetType = 'player';
				} else {
					var curTime = new Date().getTime();
					var t = curTime - this.elapseTime;
					this.posX -= this.speed*t;	// 속도(px/ms)*시간(ms)
					this.attX = this.posX + this.attRange;
					this.hitZoneX = this.posX + this.hitArea.x;
					this.hitZoneW = this.posX + this.hitArea.w;
					//console.log('Enemy:' +(this.hitZoneX-this.attX));
					this.elapseTime = curTime;
				}
			} else {	// 소환수가 있으면
				this.changeState(ENEMYSTATE.ATTACK);	// 공격
				this.targetType = 'summon';
			}
			break;
		case ENEMYSTATE.ATTACK:
			var curTime = new Date().getTime();
			if(curTime - this.elapseTime >= this.attSpeed) {	// 공격 시점이 되면
				this.changeState(ENEMYSTATE.WALK);				// 이동 이나 공격을 다시 판단 함
			} else {
				if(this.sprite.isMaxFrame() && this.attLock == false) {	// 공격 시 타격 시점이 되면
					this.attLock = true;
					this.attack();
				}
			}
			break;
		case ENEMYSTATE.HIT:
			if(this.sprite.playing == false) {
				this.changeState(ENEMYSTATE.WALK);
			}
			break;
		case ENEMYSTATE.STUN:
			var curTime = new Date().getTime();
			
			if(curTime - this.effElapseTime >= 500) {
				Goblin.Effect.pull('stun',this.posX,this.posY-80);
				this.effElapseTime = curTime;
			}
			
			if(curTime - this.elapseTime >= 3000) {
				this.changeState(ENEMYSTATE.WALK);
			}
			break;
		case ENEMYSTATE.DIE:
			if(this.sprite.playing == false) {
				// Generate Item
				ItemTrigger.pull(this.id,this.posX,Goblin.Scene.sceneHeight - 300 + Goblin.Math.rand(0,5));
				this.state = ENEMYSTATE.HIDE;
			}
			break;
	}
	
	if(this.fire == true) {
		if( this.state == ENEMYSTATE.WALK ||
			this.state == ENEMYSTATE.ATTACK ||
			this.state == ENEMYSTATE.HIT ||
			this.state == ENEMYSTATE.STUN ) {
			var fireTime = new Date().getTime();
			if(fireTime - this.fireElapseTime >= this.fireTickDuration) {
				this.fireElapseTime = fireTime;
				Goblin.Sound.play('firecrack');
				Goblin.Effect.pull('effFireExp',this.posX+this.hitPoint[0].x,this.posY+this.hitPoint[0].y);
				
				this.setDamage(this.fireTickDamage);
				this.fireTickCount--;
				if(this.fireTickCount < 0) {
					this.fire = false;
				}
			}
		}
	}
};

Enemy.prototype.draw = function(lane) {
	if(this.lane == lane) {
		Goblin.Graphics.drawSprite(this.sprite,this.posX,this.posY);
	}
};

/**
 * Attack Player
 * @param {Number} - Damage
 */
Enemy.prototype.attack = function()
{
	if(this.targetType == 'player') {
		if(Player.curHp > 0)	Player.setDamage(this.att);
	} else if(this.targetType == 'summon'){
		if(this.targetSummons.length == 0)	return;
		
		var minHp = this.targetSummons[0].hp;
		var targetId = 0;
		for(var i = 0; i < this.targetSummons.length; i++) {
			if(this.targetSummons[i].hp <= minHp) {
				minHp = this.targetSummons[i].hp;
				targetId = i;
			}
		}
		this.targetSummons[targetId].setDamage(this.att);
	}
};

/**
 * Change Enemy State
 * @param {ENEMYSTATE} - state: { READY, ATTACK, DIE, HIT, WALK }  
 */
Enemy.prototype.changeState = function(state)
{
	this.state = state;
	switch(state) {
		case ENEMYSTATE.READY:
			break;
		case ENEMYSTATE.WALK:
			this.sprite.play(this.motionId.WALK);
			this.elapseTime = new Date().getTime();
			break;
		case ENEMYSTATE.ATTACK:
			this.attLock = false;
			this.sprite.play(this.motionId.ATT);
			this.elapseTime = new Date().getTime();
			break;
		case ENEMYSTATE.HIT:
			this.sprite.play(this.motionId.HIT);
			Goblin.Sound.play('zombiehit');
			break;
		case ENEMYSTATE.DIE:
			this.sprite.play(this.motionId.DIE);
			Goblin.Sound.play('zombiedeath');
			break;
		case ENEMYSTATE.STUN:
			this.sprite.play(this.motionId.STUN);
			this.elapseTime = new Date().getTime();
			this.effElapseTime = this.elapseTime; 
			break;
	}
};

/**
 * Set Enemy Damage
 * @param {Number} -  Damage
 */
Enemy.prototype.setDamage = function(damage) 
{
	if(this.state == ENEMYSTATE.DIE)	return;
	else {
		var realDamage = damage - this.def; // 데미지 계산 공식
		this.hp -= realDamage;
		
		var textDamage = parseInt(realDamage);
		TextTrigger.pull(textDamage,this.posX + 60,this.posY + 50,'font1');
		
		if(this.hp <= 0) {
			this.changeState(ENEMYSTATE.DIE);
		} else {
			if(this.state != ENEMYSTATE.STUN)	
				this.changeState(ENEMYSTATE.HIT);
		}
	}
};

/**
 * EnemyFactory Object
 * Manage Enemy Objects
 */
var EnemyFactory = {
	enemyAssets: [], // Enemy Asset Array
	enemys: [],	// Enemy Drawing Array
	elapseGenTime: 0,
	maxGenTime: 0,
/**
 * Initialize enemy factory
 */
	initialize: function() {
		this.enemyAssets = [];
		this.add('azbrown',ENEMYTYPE.ARMOR,Goblin.Asset.get('azbrown'));
		this.add('azblue',ENEMYTYPE.ARMOR,Goblin.Asset.get('azblue'));
		this.add('azgreen',ENEMYTYPE.ARMOR,Goblin.Asset.get('azgreen'));
		this.add('azpurple',ENEMYTYPE.ARMOR,Goblin.Asset.get('azpurple'));
		this.add('azred',ENEMYTYPE.ARMOR,Goblin.Asset.get('azred'));
		this.add('fznormal',ENEMYTYPE.FAT,Goblin.Asset.get('fznormal'));
		this.add('fzhigh',ENEMYTYPE.FAT,Goblin.Asset.get('fzhigh'));
		this.add('wznormal',ENEMYTYPE.WOMAN,Goblin.Asset.get('wznormal'));
		this.add('wzhigh',ENEMYTYPE.WOMAN,Goblin.Asset.get('wzhigh'));
		this.add('szblue',ENEMYTYPE.SMALL,Goblin.Asset.get('szblue'));
		this.add('szbrown',ENEMYTYPE.SMALL,Goblin.Asset.get('szbrown'));
		this.add('szgreen',ENEMYTYPE.SMALL,Goblin.Asset.get('szgreen'));
		this.add('szred',ENEMYTYPE.SMALL,Goblin.Asset.get('szred'));
		this.add('bosslord',ENEMYTYPE.BOSS,Goblin.Asset.get('bosslord'));
		this.enemys = [];
	},
/**
 * Add enemy type data
 * @param {String} - Enemy Asset Id
 * @param {ENEMYTYPE} - Enemy Type: { ARMOR: 0, FAT: 1, WOMAN: 2, SMALL: 3, BOSS: 4 }
 * @param {Object} - Goblin Asset Object for Sprite
 */			
	add: function(id,type,asset) {
		var enemyAsset = {
			id: id,
			type: type,
			asset: asset,
			info: EnemyInfo[id],
			speed: 0,
			offset: null,
			motionId: null,
			hitPoint: null
		};
		
		switch(type) {
			case ENEMYTYPE.ARMOR:	var typeStr = 'armorZombie'; break;
			case ENEMYTYPE.FAT:		var typeStr = 'fatZombie'; break;
			case ENEMYTYPE.WOMAN:	var typeStr = 'womanZombie'; break;
			case ENEMYTYPE.SMALL:	var typeStr = 'smallZombie'; break;
			case ENEMYTYPE.BOSS:	var typeStr = 'bossLord'; break;
		}
		
		enemyAsset.hitArea = EnemyTypeInfo[typeStr].hitArea;
		enemyAsset.speed = EnemyTypeInfo[typeStr].speed;
		enemyAsset.offset = EnemyTypeInfo[typeStr].offset;
		enemyAsset.motionId = EnemyTypeInfo[typeStr].motionId;
		enemyAsset.hitPoint = EnemyTypeInfo[typeStr].hitPoint;
		
		this.enemyAssets.push(enemyAsset);
	},
/**
 * Generate Enemy
 * @param {String} - Enemy Id
 * @param {Number} - Appear Time
 * @param {Number} - Stage Level
 */
	generate: function(id,time,level) {
		for(var i = 0; i < this.enemyAssets.length; i++) {
			if(this.enemyAssets[i].id == id) {
				var eAsset = this.enemyAssets[i];
				var enemy = new Enemy(eAsset,level);
				enemy.genTime = time;
				enemy.elapseTime = new Date().getTime();
				this.enemys.push(enemy);
				break;
			}
		}
	},
/**
 * Generate Enemys
 */
	generateEnemys: function() {
		var stageLv = 'stage' + PlayerInfo.stageLv;
		var enemyData = StageData[stageLv];
		var enemyLen = enemyData['wave'].length;
		for(var i = 0; i < enemyLen; i++) {
			this.generate(enemyData['wave'][i].id,enemyData['wave'][i].time,enemyData['wave'][i].lv);
		}
		
		this.elapseGenTime = new Date().getTime();
		this.maxGenTime = enemyData['wave'][enemyLen-1].time;
	},
/**
 * Update enemy AI logic
 */	
	update: function() {
		for(var i = 0; i < this.enemys.length; i++) {
			this.enemys[i].update();
		}
		
		for(var i = 0; i < this.enemys.length; i++) {
			this.eraseEnemy(i);
		}
	},
/**
 * Drawing Enemy along lane
 * @param {Number} - Lane Number 
 */	
	draw: function(lane) {
		for(var i = 0; i < this.enemys.length; i++) {
			this.enemys[i].draw(lane);			
		}
	},
/**
 * Get Enemys In Range
 * @param {Number} - Attack range
 * @return {Object} - Enemys
 */
	getEnemysInRange: function(posX) {
		var enemys = [];
		for(var i = 0; i < this.enemys.length; i++) {
			if( posX >= this.enemys[i].hitZoneX && posX <= this.enemys[i].hitZoneW) {
				if(this.enemys[i].state == ENEMYSTATE.READY)	continue;
				enemys.push(this.enemys[i]);
			}
		}
		
		return enemys;
	},
/**
 * Get Enemys from Head
 * @param {Number} - n enemys from head
 * @return {Object} - Enemys
 */
	getEnemysAfterSort: function(n) {
		var enemys = [];
		if(this.enemys.length == 0) return enemys;
		// Sort
		this.enemys.sort(function(a,b) {
			return a.posX - b.posX;
		});
		
		var len;
		if(arguments.length == 0)	len = 1;
		else 						len = Math.min(n,this.enemys.length);
		
		for(var i =0; i < len; i++) {
			if(this.enemys[i].state == ENEMYSTATE.READY)	continue;
			enemys.push(this.enemys[i]);
		}
		return enemys;
	},
/**
 * Get Enemys from Type
 * @param {ENEMYTYPE} - Enemy Type: { ARMOR: 0, FAT: 1, WOMAN: 2, SMALL: 3, BOSS: 4 }
 * @return {Object} - Enemys
 */
	getEnemysByType: function(etype) {
		var enemys = [];
		for(var i = 0; i < this.enemys.length; i++) {
			if(this.enemys[i].type == etype) {
				if(this.enemys[i].state == ENEMYSTATE.READY)	continue;
				enemys.push(this.enemys[i]);
			}
		}
		
		return enemys;
	},
/**
 * Check enemys Array
 * @return {Boolean} - true: empty, false: not empty 
 */
	isEmpty: function() {
		if(this.enemys.length == 0) 
			return true;
		return false;
	},
	
	eraseEnemy: function(id) {
		for(var i = 0; i < this.enemys.length; i++) {
			if( i == id) {
				if(this.enemys[i].state == ENEMYSTATE.HIDE) {
					this.enemys.splice(i,1);
					return;	
				}
			}	
		}
	}
};