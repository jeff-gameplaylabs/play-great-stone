/**
 * DataSkill.js
 * Player Skill Data
 * @author Hyunseok Oh, Hyosang Lim
 */
	
var SkillAction = {
	'NORMAL': function(level) {
		// console.log('>> SkillAction 일반공격 Level ' + level);
		var enemys = EnemyFactory.getEnemysInRange(Player.attLineX);
		
		if(Player.actDone == false) {
			Player.action();
		}
		
		Player.actDone = false;
		if(enemys.length > 0) {
			Player.changeState(PLAYERSTATE.ATTACK);	// Motion
			Player.action = function() {
				var damage = Player.attMelee * (1 + (level-1)/10) + Player.additionalDamage;
				Player.attackMelee(1,damage);
				Player.actDone = true;
			};
		} else {
			Player.changeState(PLAYERSTATE.RANGE); // Motion
			Player.action = function() {
				var damage = Player.attRange * (1 + (level-1)/10) + Player.additionalDamage;
				Player.attackRange(1,ARROWTYPE.NORMAL,damage);
				Player.actDone = true;	
			};
		}
	},
	'A': function(level) {
		//console.log('>> SkillAction 난사(A) Level ' + level);
		var enemys = EnemyFactory.getEnemysInRange(Player.attLineX);
		
		if(Player.actDone == false) {
			Player.action();
		}
		
		Player.actDone = false;
		if(enemys.length > 0) {
			Player.changeState(PLAYERSTATE.ATTACK);	// Motion
			Player.action = function() {
				Player.attackMelee(Math.min(level + 1,enemys.length),Player.attMelee);
				Player.actDone = true;
			};
		} else {
			Player.changeState(PLAYERSTATE.RANGE); // Motion
			Player.action = function() {
				var targetNum = level + 1;
				Player.attackRange(targetNum,ARROWTYPE.NORMAL,Player.attRange);
				Player.actDone = true;	
			};
		}
	},
	'B': function(level) {
		//console.log('>> SkillAction 관통(B) Level ' + level);
		var enemys = EnemyFactory.getEnemysInRange(Player.attLineX);
		Goblin.Sound.play('pierceready');
		if(Player.actDone == false) {
			Player.action();
		}
		
		Player.actDone = false;
		if(enemys.length > 0) {
			Player.changeState(PLAYERSTATE.ATTACK);	// Motion
			Player.action = function() {
				var enemy = EnemyFactory.getEnemysAfterSort(1);
				var damage = Player.attMelee + enemy[0].def + level - 1;
				Player.attackMelee(1,damage);
				Player.actDone = true;
			};
		} else {
			Player.changeState(PLAYERSTATE.RANGE); // Motion
			Player.action = function() {
				var enemy = EnemyFactory.getEnemysAfterSort(1);
				if(enemy.length > 0) {
					Goblin.Sound.play('piercearrow');
					var damage = Player.attRange + enemy[0].def + level - 1;
					Player.attackRange(1,ARROWTYPE.PIERCING,damage);
				}
				Player.actDone = true;	
			};
		}
		
	},
	'C': function(level) {
		//console.log('>> SkillAction 집중(C) Level ' + level);
		
		Player.changeState(PLAYERSTATE.SUMMON); // Motion
		Goblin.Effect.pull('shower',Player.pos.x-45,Player.pos.y-35);
		Goblin.Sound.play('concentrate');
		
		StreamPuzzle.scrollTick = 500;
		var duration = 3000 + level*1000;
		clearTimeout(StreamPuzzle.scroll);
		StreamPuzzle.scroll = setTimeout(function() {
			StreamPuzzle.scrollTick = 1000;
			clearTimeout(StreamPuzzle.scroll);
		},duration);
	},
	'D': function(level) {
		//console.log('>> SkillAction 회복(D) Level ' + level);
		Player.changeState(PLAYERSTATE.SUMMON); // Motion
		Goblin.Effect.pull('heal',Player.pos.x-45,Player.pos.y-10);
		Goblin.Sound.play('heal1');
		
		Player.curHp += parseInt((level)*Player.maxHp/3);
		Player.curHp = Math.min(Player.curHp,Player.maxHp);
	},
	'E': function(level) {
		//console.log('>> SkillAction 연발&연타(E) Level ' + level);
		
		StreamPuzzle.scrollTick = 33;
		var duration = 1800 + (level-1)*600;
		clearTimeout(StreamPuzzle.scroll);
		StreamPuzzle.scroll = setTimeout(function() {
			StreamPuzzle.scrollTick = 1000;
			clearTimeout(StreamPuzzle.scroll);
		},duration);
	},
	'F': function(level) {
		//console.log('>> SkillAction 불화살(F) Level ' + level);
		Player.changeState(PLAYERSTATE.RANGE); // Motion
		
		var enemys = EnemyFactory.getEnemysInRange(Player.attLineX);
		
		if(Player.actDone == false) {
			Player.action();
		}
		
		Player.actDone = false;
		if(enemys.length > 0) {
			Player.changeState(PLAYERSTATE.ATTACK);	// Motion
			Player.action = function() {
				var damage = Player.attMelee * 1.2;
				Player.attackMelee(Math.min(level + 1,enemys.length),damage);
				Player.actDone = true;
			};
		} else {
			Player.changeState(PLAYERSTATE.RANGE); // Motion
			Player.action = function() {
				
				Goblin.Sound.play('firearrowhit');
				var targetNum = level + 1;
				var damage = Player.attRange * 1.2;
				Player.attackRange(targetNum,ARROWTYPE.FIRE,damage);
				Player.actDone = true;
			};
		}
	},
	'H': function(level) {
		//console.log('>> SkillAction 마취화살(H) Level ' + level);
		if(Player.actDone == false) {
			Player.action();
		}
		
		Player.actDone = false;
		Player.changeState(PLAYERSTATE.RANGE); // Motion
		Player.action = function() {
			var targetNum = level;
			var damage = Player.attRange*0.8;
			Player.attackRange(targetNum,ARROWTYPE.PRISON,damage);
			Player.actDone = true;
		};
	},
	'I': function(level) {
		//console.log('>> SkillAction 화살비(I) Level ' + level);
		if(Player.actDone == false) {
			Player.action();
		}
		
		Player.actDone = false;
		Player.changeState(PLAYERSTATE.SUMMON); // Motion
		Player.action = function() {
			Player.attackSpecial('arrowshower',level);
			Player.actDone = true;
		};
		
	},
	'J': function(level) {
		//console.log('>> SkillAction 헤드샷(J) Level ' + level);
		if(Player.actDone == false) {
			Player.action();
		}
		
		Player.actDone = false;
		Player.changeState(PLAYERSTATE.RANGE); // Motion
		Player.action = function() {
			var targetNum = level;
			var damage = 500;
			Player.attackRange(targetNum,ARROWTYPE.HEADSHOT,damage);
			Player.actDone = true;
		};
	},
	'K': function(level) {
		//console.log('>> SkillAction 궁신(K) Level ' + level);	
		Player.changeState(PLAYERSTATE.SUMMON); // Motion
		Goblin.Effect.pull('shower',Player.pos.x-45,Player.pos.y-35);
		Goblin.Sound.play('effColor');
		
		Player.additionalDamage = Player.attRange;
		StreamPuzzle.scrollTick = 500;
		var duration = 3000 + level*1000;
		clearTimeout(StreamPuzzle.scroll);
		StreamPuzzle.scroll = setTimeout(function() {
			StreamPuzzle.scrollTick = 1000;
			clearTimeout(StreamPuzzle.scroll);
			Player.additionalDamage = 0;
		},duration);
	}
};

var ItemAction = {
	'Slot0': function() {
		console.log('>> ItemAction potion ');
		if(_state.itemSlot[0].number > 0) {
			_state.itemSlot[0].number--;
			
			Goblin.Effect.pull('healPotion',Player.pos.x-45,Player.pos.y-10);
			Goblin.Sound.play('heal1');
			
			Player.curHp += 2000;
			Player.curHp = Math.min(Player.curHp,Player.maxHp);
		}
	},
	'Slot1': function() {
		console.log('>> ItemAction magic stick ');
		if(_state.itemSlot[1].number > 0) {
			_state.itemSlot[1].number--;
			
			Player.attackSpecial('magicshower',1);
		}
	}
};