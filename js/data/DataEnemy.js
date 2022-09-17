/**
 * @author Hyunseok
 */
var EnemySetting = {
	'incAttLvUp': 2,
	'incDefLvUp': 1,
	'incHpLvUp': 15,
	'bossAppearDelay': 1000,
};

var EnemyInfo = {
	'azbrown': {att: 16, def: 1, hp: 150, critical: 3, attRange: 28, attSpeed: 2000},
	'azblue': {att: 20, def: 2, hp: 200, critical: 3, attRange: 28, attSpeed: 2000},
	'azgreen': {att: 24, def: 2, hp: 250, critical: 3, attRange: 28, attSpeed: 2000},
	'azpurple': {att: 28, def: 3, hp: 300, critical: 3, attRange: 28, attSpeed: 2000},
	'azred': {att: 32, def: 4, hp: 350, critical: 3, attRange: 28, attSpeed: 2000},
	'fznormal': {att: 50, def: 5, hp: 500, critical: 5, attRange: 20, attSpeed: 3000},
	'fzhigh': {att: 100, def: 10, hp: 1000, critical: 5, attRange: 20, attSpeed: 3000},
	'wznormal': {att: 20, def: 1, hp: 300, critical: 20, attRange: 20, attSpeed: 1000},
	'wzhigh': {att: 40, def: 1, hp: 600, critical: 20, attRange: 20, attSpeed: 1000},
	'szblue': {att: 100, def: 0, hp: 100, critical: 50, attRange: 10, attSpeed: 4000},
	'szbrown': {att: 150, def: 0, hp: 150, critical: 50, attRange: 10, attSpeed: 4000},
	'szgreen': {att: 200, def: 0, hp: 200, critical: 50, attRange: 10, attSpeed: 4000},
	'szred': {att: 300, def: 0, hp: 250, critical: 50, attRange: 10, attSpeed: 4000},
	'bosslord': {att: 200, def: 10, hp: 3000, critical: 10, attRange: 30, attSpeed: 2000}
};

var EnemyTypeInfo = {
	'armorZombie': { offset: {x: 0,y: -430}, speed: 0.05, motionId: {ATT: 0,WALK: 4,STUN: 3,DIE: 1,HIT: 2,SKILL: null}, hitPoint:[{x:27,y:62},{x:30,y:85},{x:24,y:100},{x:30,y:115}],hitArea:{x: 70, w: 115} },
	'fatZombie': { offset: {x: 0,y: -381}, speed: 0.02, motionId: {ATT: 0,WALK: 4,STUN: 3,DIE: 1,HIT: 2,SKILL: null}, hitPoint:[{x:-16,y:17},{x:-3,y:48},{x:0,y:60},{x:-5,y:77}],hitArea:{x: 31, w: 90} },
	'womanZombie': { offset: {x: 0,y: -396}, speed: 0.04, motionId: {ATT: 0,WALK: 4,STUN: 3,DIE: 1,HIT: 2,SKILL: null}, hitPoint:[{x:5,y:48},{x:20,y:70},{x:20,y:80},{x:10,y:95}],hitArea:{x: 50, w: 95} },
	'smallZombie': { offset: {x: 0,y: -380}, speed: 0.1, motionId: {ATT: 0,WALK: 4,STUN: 3,DIE: 1,HIT: 2,SKILL: null}, hitPoint:[{x:-20,y:40},{x:-12,y:60},{x:-10,y:80}],hitArea:{x: 18, w: 100} },
	'bossLord': { offset: {x: 0,y: -537}, speed: 0.05, motionId: {ATT: 0,WALK: 4,DIE: 1,HIT: 2,SKILL: 3}, hitPoint:[{x:55,y:112},{x:62,y:155},{x:60,y:188},{x:60,y:210}],hitArea:{x: 80, w: 195} }
};

var StageInfo = {
	level: 1
};
			
var StageData = {
	'stage1': {
		'wave':[
			{'time': 100, 'id': 'azbrown','lv': 1},
			{'time': 2000, 'id': 'azbrown','lv': 1},
			{'time': 4000, 'id': 'azbrown','lv': 1},
			{'time': 6000, 'id': 'azbrown','lv': 1},
			{'time': 8000, 'id': 'wznormal','lv': 1},
			
			{'time':30000, 'id': 'azbrown','lv': 1},
			{'time':32000, 'id': 'azbrown','lv': 1},
			{'time':34000, 'id': 'fznormal','lv': 1},
			{'time':36000, 'id': 'azblue','lv': 1},
			{'time':38000, 'id': 'azblue','lv': 1},
			{'time':40000, 'id': 'azblue','lv': 1},
			{'time':42000, 'id': 'azblue','lv': 1},
			{'time':44000, 'id': 'szbrown','lv': 1},
			
			{'time':60000, 'id': 'azblue','lv': 1},
			{'time':62000, 'id': 'azblue','lv': 1},
			{'time':64000, 'id': 'azgreen','lv': 1},
			{'time':66000, 'id': 'fznormal','lv': 1},
			{'time':68000, 'id': 'azgreen','lv': 1},
			{'time':70000, 'id': 'azgreen','lv': 1},
			{'time':72000, 'id': 'szblue','lv': 1},
			
			{'time':90000, 'id': 'azgreen','lv': 1},
			{'time':92000, 'id': 'azgreen','lv': 1},
			{'time':94000, 'id': 'azgreen','lv': 1},
			{'time':96000, 'id': 'azpurple','lv': 1},
			{'time':98000, 'id': 'wzhigh','lv': 1},
			{'time':100000, 'id': 'azpurple','lv': 1},
			{'time':102000, 'id': 'azpurple','lv': 1},
			{'time':106000, 'id': 'azpurple','lv': 1},
			{'time':108000, 'id': 'bosslord','lv': 1},
			
			/*
			{'time':120000, 'id': 'azpurple','lv': 1},
			{'time':122000, 'id': 'azred','lv': 1},
			{'time':124000, 'id': 'azred','lv': 1},
			{'time':126000, 'id': 'azred','lv': 1},
			{'time':128000, 'id': 'fzhigh','lv': 1},
			{'time':130000, 'id': 'azred','lv': 1},
			{'time':132000, 'id': 'szgreen','lv': 1},
			
			{'time':150000, 'id': 'azred','lv': 1},
			{'time':152000, 'id': 'azred','lv': 1},
			{'time':154000, 'id': 'wzhigh','lv': 1},
			{'time':156000, 'id': 'azred','lv': 1},
			{'time':158000, 'id': 'azred','lv': 1},
			{'time':160000, 'id': 'azred','lv': 1},
			{'time':162000, 'id': 'szred','lv': 1},
			{'time':164000, 'id': 'wzhigh','lv': 1},
			*/
		],
		'fever': ['azbrown','azblue','azgreen']
	},
	'stage2': {
		'wave':[
			{'time': 200, 'id': 'azbrown','lv': 1},
			{'time': 1000, 'id': 'azbrown','lv': 1},
			{'time': 1500, 'id': 'azbrown','lv': 1},
			{'time': 3000, 'id': 'azbrown','lv': 1},
			{'time': 4000, 'id': 'azbrown','lv': 1},
			{'time': 7000, 'id': 'azblue','lv': 1},
			{'time': 8500, 'id': 'azblue','lv': 1},
			{'time': 9000, 'id': 'azblue','lv': 1},
			{'time': 12000, 'id': 'fznormal','lv': 1},
			{'time': 16000, 'id': 'fznormal','lv': 1},
			{'time': 17000, 'id': 'azbrown','lv': 1},
			{'time': 20000, 'id': 'wznormal','lv': 1},
			{'time': 47000, 'id': 'szblue','lv': 1},
			{'time': 57000, 'id': 'azbrown','lv': 1},
			{'time': 59000, 'id': 'azbrown','lv': 1},
			{'time': 61000, 'id': 'azblue','lv': 1},
			{'time': 66000, 'id': 'azbrown','lv': 1},
			{'time': 68000, 'id': 'azblue','lv': 1},
			{'time': 71000, 'id': 'azblue','lv': 1},
			{'time': 74000, 'id': 'azblue','lv': 1},
			{'time': 74000, 'id': 'azblue','lv': 1},
			{'time': 74000, 'id': 'azblue','lv': 1},
			{'time': 120000, 'id': 'azblue','lv': 1}
		],
		'fever': ['azbrown','azblue','azgreen']
	},
	'stage3': {
		'wave':[
			{'time': 200, 'id': 'azbrown','lv': 1},
			{'time': 1000, 'id': 'azbrown','lv': 1},
			{'time': 1500, 'id': 'azbrown','lv': 1},
			{'time': 3000, 'id': 'azbrown','lv': 1},
			{'time': 4000, 'id': 'azbrown','lv': 1},
			{'time': 20000, 'id': 'wznormal','lv': 1},
			{'time': 7000, 'id': 'azblue','lv': 1},
			{'time': 8500, 'id': 'azblue','lv': 1},
			{'time': 9000, 'id': 'azblue','lv': 1},
			{'time': 12000, 'id': 'fznormal','lv': 1},
			{'time': 7000, 'id': 'azred','lv': 1},
			{'time': 4000, 'id': 'azbrown','lv': 1},
			{'time': 8500, 'id': 'azred','lv': 1},
			{'time': 9000, 'id': 'azred','lv': 1},
			{'time': 47000, 'id': 'szblue','lv': 1},
			{'time': 16000, 'id': 'fznormal','lv': 1},
			{'time': 17000, 'id': 'azbrown','lv': 1},
			{'time': 20000, 'id': 'wznormal','lv': 1},
			{'time': 47000, 'id': 'szblue','lv': 1},
			{'time': 57000, 'id': 'azbrown','lv': 1},
			{'time': 59000, 'id': 'azbrown','lv': 1},
			{'time': 61000, 'id': 'azblue','lv': 1},
			{'time': 66000, 'id': 'azbrown','lv': 1},
			{'time': 68000, 'id': 'azblue','lv': 1},
			{'time': 71000, 'id': 'azblue','lv': 1},
		],
		'fever': ['azbrown','azblue','azgreen']
	},
	'stage4': {
		'wave':[
			{'time': 200, 'id': 'azbrown','lv': 1},
			{'time': 1000, 'id': 'azbrown','lv': 1},
			{'time': 1500, 'id': 'azbrown','lv': 1},
			{'time': 3000, 'id': 'azbrown','lv': 1},
			{'time': 4000, 'id': 'azbrown','lv': 1},
			{'time': 7000, 'id': 'azblue','lv': 1},
			{'time': 8500, 'id': 'azblue','lv': 1},
			{'time': 9000, 'id': 'azblue','lv': 1},
			{'time': 12000, 'id': 'fznormal','lv': 1},
			{'time': 16000, 'id': 'fznormal','lv': 1},
			{'time': 17000, 'id': 'azbrown','lv': 1},
			{'time': 20000, 'id': 'wznormal','lv': 1},
			{'time': 47000, 'id': 'szblue','lv': 1},
			{'time': 57000, 'id': 'azbrown','lv': 1},
			{'time': 59000, 'id': 'azbrown','lv': 1},
			{'time': 61000, 'id': 'azblue','lv': 1},
			{'time': 66000, 'id': 'azbrown','lv': 1},
			{'time': 68000, 'id': 'azblue','lv': 1},
			{'time': 71000, 'id': 'azblue','lv': 1},
			{'time': 74000, 'id': 'azblue','lv': 1}
		],
		'fever': ['azbrown','azblue','azgreen']
	},
	'stage5': {
		'wave':[
			{'time': 200, 'id': 'azbrown','lv': 1},
			{'time': 1000, 'id': 'azbrown','lv': 1},
			{'time': 1500, 'id': 'azbrown','lv': 1},
			{'time': 3000, 'id': 'azbrown','lv': 1},
			{'time': 4000, 'id': 'azbrown','lv': 1},
			{'time': 7000, 'id': 'azblue','lv': 1},
			{'time': 8500, 'id': 'azblue','lv': 1},
			{'time': 9000, 'id': 'azblue','lv': 1},
			{'time': 12000, 'id': 'fznormal','lv': 1},
			{'time': 16000, 'id': 'fznormal','lv': 1},
			{'time': 17000, 'id': 'azbrown','lv': 1},
			{'time': 20000, 'id': 'wznormal','lv': 1},
			{'time': 47000, 'id': 'szblue','lv': 1},
			{'time': 57000, 'id': 'azbrown','lv': 1},
			{'time': 59000, 'id': 'azbrown','lv': 1},
			{'time': 61000, 'id': 'azblue','lv': 1},
			{'time': 66000, 'id': 'azbrown','lv': 1},
			{'time': 68000, 'id': 'azblue','lv': 1},
			{'time': 71000, 'id': 'azblue','lv': 1},
			{'time': 74000, 'id': 'bosslord','lv': 1}
		],
		'fever': ['azbrown','azblue','azgreen']
	}
};

