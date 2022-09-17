/**
 * @author Hyunseok
 */

var STATE = { LOGO: 0, LOAD: 1, INTRO: 2, LOGIN: 3, LOBBY: 4, PLAY: 5, TAVERN: 6 };
var STATEPLAY = { READY: 0, COUNT: 1, BATTLE: 2, DEFEAT: 3, VICTORY: 4 };

// 서버 저장 데이터
var EventProgressInfo = {
	'Tutorial_Event1': false,
	'Tutorial_Event2': false,
	'Tutorial_Event3': false,
};


var EventAction = [
{	
	id: 0,
	name: 'Tutorial_Event1',
	progress: null, 
	condition: {
		'game': STATE.PLAY,
		'scene': STATEPLAY.COUNT,
		'stage': 1,
		'head': null,
	},
	action: function() {
		//console.log(this.name);
	}
},
{	
	id: 1,
	name: 'Tutorial_Event2',
	progress: null, 
	condition: {
		'game': STATE.PLAY,
		'scene': STATEPLAY.COUNT,
		'stage': 1,
		'head': 0,
	},
	action: function() {
		//console.log(this.name);
	}
}
];