/**
 * StateManager.js
 * Manage Game State
 * @author Hyunseok Oh
 */

/**
 * Assign STATE Constant Assign
 * Developer add each state
 */
var STATE = {
	LOGO: 0,
	LOAD: 1,
	INTRO: 2,		
	LOGIN: 3,
	LOBBY: 4,
	PLAY: 5,
	TAVERN: 6,
	ENDING: 7,
	STORE: 8,
	INVENTORY: 9
	/* To add new user defined state */
};

var StateManager = {
	state: null,
	curState: null,
	oldState: null,
/**
 * Initialize StateManager
 */
	initialize: function() {
		console.log('** Initialize Goblin.StateManager');
		EventManager.initialize();
		TextTrigger.initialize();
		this.curState = STATE.LOGO;
		this.oldState = STATE.LOGO;
		this.transition(STATE.LOGO);
	},
/**
 * Run State
 * @param {STATE.Type} Type : (LOGO or 0, LOAD or 1, LOGIN or 2, PLAY or 2)
 */
	transition: function(state) {
		if(this.state != null)	{
			$('#scene').unbind();
			this.state.cleanup();	// cleanup state
			this.state.pause();		// pause previous state
		}
		
		this.state = null;
		this.oldState = this.curState;
		this.curState = state;
		
		switch(state) {
			case STATE.LOGO: this.state = new StateLogo();	break;
			case STATE.LOAD: this.state = new StateLoad(); break;
			case STATE.INTRO: this.state = new StatePlay(); break;
			case STATE.LOGIN: this.state = new StatePlay(); break;
			case STATE.LOBBY: this.state = new StatePlay(); break;
			case STATE.PLAY: this.state = new StatePlay(); break;
			case STATE.TAVERN: this.state = new StateTavern(); break;
			case STATE.ENDING: this.state = new StateEnding(); break;
			case STATE.STORE: this.state = new StateStore(); break;
			case STATE.INVENTORY: this.state = new StateInventory(); break;
		};
	}
};
