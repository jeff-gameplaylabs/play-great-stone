/**
 * @author Hyunseok
 */
var EventManager = {
	gameState: null,
	sceneState: null,
	events: [],
	
	initialize: function() {
		this.events = [];

		for(var i in EventProgressInfo) {
			for(var j = 0; j < EventAction.length; j++) {
				EventAction[j].id = j;
				if(i == EventAction[j].name) {
					EventAction[j].condition.progress = EventProgressInfo[i];
					continue;
				}	
			}
		}	
	},
	
	inspector: function() {
		var gameState = StateManager.curState;
		var sceneState = _state.state;
		
		for(var i = 0; i < EventAction.length; i++) {
			var con = EventAction[i].condition;
			if(con.progress == true) continue; 
			if(con.game != StateManager.curState) continue;
			if(con.scene != _state.state) continue;
			if(con.stage != StageInfo.level) continue;
			if(con.head == null) continue;
			if(EventAction[con.head].progress == false) continue;
			
			EventAction[i].action();
			return;
		}
	},
};