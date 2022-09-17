/**
 * Core.js
 * Game Core Generation - Generate Finate State Machine
 * @author Hyunseok Oh
 */

window.requestAnimFrame = (
	function()	{
    	return	window.requestAnimationFrame       || 
				window.webkitRequestAnimationFrame || 
				window.mozRequestAnimationFrame    || 
				window.oRequestAnimationFrame      || 
				window.msRequestAnimationFrame     || 
				function(/* function */ callback, /* DOMElement */ element){
					return window.setTimeout(callback, 1000 / 60);
				};
	}
)();

window.cancelRequestAnimFrame = (
	function()	{
	    return	window.cancelAnimationFrame          ||
   				window.webkitCancelRequestAnimationFrame    ||
				window.mozCancelRequestAnimationFrame       ||
				window.oCancelRequestAnimationFrame     ||
				window.msCancelRequestAnimationFrame        ||
				clearTimeout;
	}
)();

var Core = {
	run: function()	{
		//*
		if(Goblin.System.platform == 'android') {
			_state.requestLoop = window.setTimeout(_state.run,1000/30);	
		} else {
			_state.requestLoop = window.requestAnimFrame(_state.run, document.getElementsByTagName('body'));	
		}
		//*/
		
		//_state.requestLoop = window.setTimeout(_state.run,1000/30);

		EventManager.inspector();
		
		// Process
		_state.update();
		
		// Render
		Goblin.Graphics.clearScene();	// Clear Scene
		_state.render();	// Render State
		
		// Draw Button
		if(SceneManager.buttons.length > 0) {
			for(var i = 0; i < SceneManager.buttons.length; i++) {
				SceneManager.buttons[i].draw();
			}
		}
		// Draw Effect
		if(EffectTrigger.effects.length > 0) {
			EffectTrigger.draw();
		}
		
		// Draw Effect
		if(TextTrigger.texts.length > 0) {
			TextTrigger.draw();
		}
	},
	pause: function() {
		//*
		if(Goblin.System.platform == 'android') {
			window.clearTimeout(_state.requestLoop);
		} else {
			window.cancelRequestAnimFrame(_state.requestLoop);	
		}
		//*/
		//window.clearTimeout(_state.requestLoop);
	} 
};