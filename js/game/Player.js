/**
 * Player.js
 * Player Object Class
 * @author Hyunseok Oh
 */
var PLAYERTYPE = { KNIGHT: 0, ARCHER: 1, MAGICIAN: 2 };
var PLAYERSTATE = { IDLE: 0, ATTACK: 1, RANGE: 2, DEFEND: 3, SUMMON: 4, HIT: 5, DIE: 6};
var RANGEATTTYPE = { NORMAL: 0, MULTISHOT: 1, PIERCING: 2};
/**
 * Player Object
 * Manage Player Objects
 */
var Player = {
	pos: {x: 0, y: 0},
	rune: null,
	type: PLAYERTYPE.KNIGHT,
	state: PLAYERSTATE.IDLE,
	sprite: null,
	lane: PlayerSetting.lane,
	actSomething: false,
	skills: [],
	motionId: {ATTACK: 0, DEFEND: 1, DIE: 2, HIT: 3, IDLEMELEE: 4, IDLERANGE: 5, RANGE: 6, SUMMON: 7},
/**
 * Initialize Player Object
 * @param {PLAYERTYPE} - Player Type: { KNIGHT: 0, ARCHER: 1, MAGICIAN: 2 }
 */
	initialize: function(type) {
		switch(type) {
			case PLAYERTYPE.KNIGHT: var sprId = 'knight'; break;
			case PLAYERTYPE.ARCHER: var sprId = 'knight'; break;
			case PLAYERTYPE.MAGICIAN: var sprId = 'knight'; break;
		};
		this.sprite = Goblin.Object.createSprite(Goblin.Asset.get(sprId));
		this.sprite.finalAct = DefineFinalAct;
		this.sprite.maxFrameAct = DefineMaxFrameAct;
	
		this.pos.x = PlayerSetting.defaultPosX;
		this.pos.y = Goblin.Scene.sceneHeight - this.sprite.height + this.lane + PlayerSetting.defaultPosY - 100;
		this.attLineX = this.pos.x + this.sprite.width;
		this.hitZoneX = this.pos.x + 40;
		this.hitZoneW = this.pos.x + 85;
		
		this.actDone = true;
		
		this.setPlayerData();
		this.changeState(PLAYERSTATE.IDLE);
	},
/**
 * Set Player Data
 */	
	setPlayerData: function() {
		this.level = 1;
		var staId = 'Lv' + this.level;
		this.maxHp = PlayerStatus[staId].MaxHp;
		this.curHp = this.maxHp;
		this.MaxExp = PlayerStatus[staId].MaxExp;
		this.curExp = 0;
		this.attMelee = PlayerStatus[staId].MeleeAttack;
		this.attRange = PlayerStatus[staId].RangeAttack;
		this.defence = PlayerStatus[staId].Defence;
		this.blocking = PlayerStatus[staId].Blocking;
		this.critical = PlayerStatus[staId].Critical;
		this.curattMelee = 0;
		this.curattRange = 0;
		this.curdefence = 0;
		this.rune = [BLOCKRUNE.E,BLOCKRUNE.F,BLOCKRUNE.H,BLOCKRUNE.I];
		this.curSummonPoint = 0;
		this.maxSummonPoint = 200;
		
		this.skillTimer = 0;
		this.rangeAttackType = RANGEATTTYPE.NORMAL;
		this.additionalDamage = 0;
		this.stripeTargets = 1;		// 스프라이트 기술시 타겟 개체수
		this.piercingDefence = 0;	// 관통 시 디펜스 감소량
		
		this.arrowshowerCount = 0;
	},
/**
 * Update Player Logic
 */	
	update: function() {
		if(this.arrowshowerCount > 0) {
			var curTime = new Date().getTime();
			if( curTime - this.elapseTime > 400) {
				this.elapseTime = curTime;
				
				Goblin.Effect.pull('effArrowShower',this.asPos.x,Goblin.Scene.sceneHeight - 650);
				Goblin.Sound.play('arrowshower');		
				this.arrowshowerCount--;
				
				for(var i = 0; i < EnemyFactory.enemys.length; i++) {
					var enemy = EnemyFactory.enemys[i];
					if( enemy.posX > this.asPos.x && enemy.posX + enemy.sprite.width <= this.asPos.w)
						enemy.setDamage(this.attRange*3);
				}
			}
		}
	},
/**
 * Draw Player
 */		
	draw: function() {
		//Goblin.Graphics.drawLine(this.hitZoneX,0,this.hitZoneX,Goblin.Scene.height,1,'blue');
		//Goblin.Graphics.drawLine(this.hitZoneW,0,this.hitZoneW,Goblin.Scene.height,1,'blue');
		//Goblin.Graphics.drawLine(this.attLineX,0,this.attLineX,Goblin.Scene.height,1,'red');
		Goblin.Graphics.drawSprite(this.sprite,this.pos.x,this.pos.y);
	},
/**
 * Draw Player
 */		
	isInRange: function(attX) {
		if( attX >= this.hitZoneX && attX <= this.hitZoneW) {
			return true;
		}
		return false;
	},
/**
 * Change Player State
 * @param {PLAYERSTATE} - Player State: { IDLE, ATTACK, DEFEND, SUMMON, SKILL, HIT, DIE }  
 */
	changeState: function(state) {
		this.state = state;
		switch(state) {
			case PLAYERSTATE.ATTACK:
				this.sprite.play(this.motionId.ATTACK);
				break;
			case PLAYERSTATE.DEFEND:
				this.sprite.play(this.motionId.DEFEND);
				break;
			case PLAYERSTATE.DIE:
				this.sprite.play(this.motionId.DIE);
				break;
			case PLAYERSTATE.HIT:
				this.sprite.play(this.motionId.HIT);
				break;
			case PLAYERSTATE.IDEL:
				this.sprite.play(this.motionId.IDLERANGE);
				break;
			case PLAYERSTATE.SUMMON:
				this.sprite.play(this.motionId.SUMMON);
				break;
			case PLAYERSTATE.RANGE:
				this.sprite.play(this.motionId.RANGE);
				break;
		}
	},
/**
 * Set Player Damage 
 * @param {Number} - Enemy Attack Damage  
 */		
	setDamage: function(damage) {		
		var blockingChance = this.blocking/100;
		var rand = Math.random();
		//console.log('>> Rand: ' + rand + ' BlockingChance: ' + blockingChance);
		
		if(rand <= blockingChance) {
			this.changeState(PLAYERSTATE.DEFEND);
			TextTrigger.pull('Block',this.pos.x ,this.pos.y+50 ,'font2');
		} else {
			this.curHp -= damage;
			TextTrigger.pull(damage,this.pos.x ,this.pos.y+50 ,'font2');
			if(this.curHp > 0) {
				this.changeState(PLAYERSTATE.HIT);
				Goblin.Effect.pull('bloodRed',this.pos.x,this.pos.y);	
			}
		}
	},
	
	attackRange: function(n,arrowType,damage) {
		var enemys = EnemyFactory.getEnemysAfterSort(n);
		
		if(enemys.length == 0)	return;
		else {
			for(var i = 0; i < enemys.length; i++) {
				if(enemys[i] == undefined) break;
				ArrowTrigger.pull(arrowType,enemys[i],damage);
				
				if(arrowType == ARROWTYPE.FIRE) {
					enemys[i].fire = true;
					enemys[i].fireElapseTime = new Date().getTime();
					enemys[i].fireTickDamage = damage*0.2;
					enemys[i].fireTickCount = 5;
					enemys[i].fireTickDuration = 1000;
				}				
				
				if(i >= 1) {
					var s = enemys[i-1].posX - enemys[i].posX;
					ArrowTrigger.arrows[i].elapseTime += s*0.5;
				}
			}
		}
	},
	
	attackMelee: function(n,damage) {
		var enemys = EnemyFactory.getEnemysAfterSort(n);
		for(var i = 0; i < enemys.length; i++) {
			Goblin.Effect.pull('bloodGreen',this.pos.x+10,this.pos.y-12);
			enemys[i].setDamage(damage);
		}
	},
	
	attackSpecial: function(attId,lv) {
		if(attId == 'arrowshower') {
			var enemy = EnemyFactory.getEnemysAfterSort(1);
			if(enemy.length == 0) {
				this.asPos = {x: Goblin.Scene.sceneWidth - 450, w: 450};
			} else {
				this.asPos = {x: enemy[0].posX-110, w: enemy[0].posX + 340};
			}
			this.elapseTime = new Date().getTime();
			this.arrowshowerCount = lv;
		}
		
		if(attId == 'magicshower') {
			Goblin.Effect.pull('effArrowShower',Goblin.Scene.sceneWidth - 900,Goblin.Scene.sceneHeight - 650);
			Goblin.Effect.pull('effArrowShower',Goblin.Scene.sceneWidth - 450,Goblin.Scene.sceneHeight - 650);
			Goblin.Sound.play('arrowshower');
			
			for(var i = 0; i < EnemyFactory.enemys.length; i++) {
				var enemy = EnemyFactory.enemys[i];
				if( enemy.posX > Goblin.Scene.sceneWidth - 900 && enemy.posX + enemy.sprite.width <= Goblin.Scene.sceneWidth)
					enemy.setDamage(this.attRange);
			}
		}
	},
/**
 * Trigger Player Action
 * @param {Number} - Block Type Number  
 */
	triggerAction: function(sInfo) {
		if(sInfo.rune == null)
			SkillAction['NORMAL'](sInfo.level);
		else {
			SkillAction[sInfo.rune](sInfo.level,sInfo.time);
		}
	},
};

/**
 * Define Sprite Final Action
 */
function DefineFinalAct() 
{	
	switch(Player.sprite.currentMotion) {
		case Player.motionId.ATTACK:
		case Player.motionId.DEFEND:
		case Player.motionId.SUMMON:
		case Player.motionId.HIT: 
			Player.sprite.play(Player.motionId.IDLEMELEE);
			break;
		case Player.motionId.DIE: 
			break;
		case Player.motionId.RANGE:
			Player.action();
			Player.sprite.play(Player.motionId.IDLERANGE);
			break;
	}
};

function DefineMaxFrameAct()
{
	switch(Player.sprite.currentMotion) {
		case Player.motionId.ATTACK:
			Player.action();
			break;
		case Player.motionId.DEFEND:
			break; 
		case Player.motionId.SUMMON:
			Player.action();
			break;
	}
};
