/**
 * @author Hyunseok
 */
var SummonSetting = {
	'incAttLvUp': 4,
	'incDefLvUp': 4,
	'incHpLvUp': 15
};

var SummonInfo = {
	'soldier': {point: 10, att: 16, def: 3, hp: 200, critical: 3, attRange: 28, attSpeed: 2000 },
	'spearman': {point: 15, att: 20, def: 6, hp:300, critical: 3, attRange: 28, attSpeed: 2000 },
	'archer': {point: 50, att: 25, def: 10, hp: 100, critical: 3, attRange: 10, attSpeed: 1000 },
	'knight': {point: 50, att: 31, def: 15, hp: 500, critical: 3, attRange: 20, attSpeed: 3000 },
	'commander': {point: 200, att: 40, def: 20, hp: 1000, critical: 3, attRange: 30, attSpeed: 2000 }
};

var SummonTypeInfo = {
	'soldier': { offset: {x: 0,y: -330}, speed: 0.05, motionId: {ATT: 0,WALK: 3,DIE: 1,HIT: 2,SKILL: null},hitArea:{x: 50, w: 95} },
	'spearman': { offset: {x: 0,y: -330}, speed: 0.05, motionId: {ATT: 0,WALK: 3,DIE: 1,HIT: 2,SKILL: null},hitArea:{x: 50, w: 95} },
	'archer': { offset: {x: 0,y: -296}, speed: 0.1, motionId: {ATT: 0,WALK: 3,DIE: 1,HIT: 2,SKILL: null},hitArea:{x: 35, w: 80} },
	'knight': { offset: {x: 0,y: -280}, speed: 0.02, motionId: {ATT: 0,WALK: 3,DIE: 1,HIT: 2,SKILL: null},hitArea:{x: 40, w: 95} },
	'commander': { offset: {x: 0,y: -437}, speed: 0.05, motionId: {ATT: 0,WALK: 4,DIE: 1,HIT: 2,SKILL: 3},hitArea:{x: 50, w: 150} }
};