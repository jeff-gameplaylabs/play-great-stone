/**
 * SceneManager.js
 * Manage Game Scenes
 * @author Hyunseok Oh
 */

var SceneManager = {
	width: 0,
	height: 0,
	sceneWidth: 0,
	sceneHeight: 0,
	scaleRate: {x:0, y: 0},
	buttons: [],
	mouseClicked: false,
	/**
 	 * Initialize SceneManager
 	 */	
	initialize: function(width,height)	{
		console.log('** Initialize Goblin.SceneManager');
		// Create Scene
		var scene = DomUtil.createDiv('game');
		scene.style.overflow = 'hidden';
		
		// Set Screen Size
		if(arguments.length == 2)	{
			this.width = width;
			this.height = height;	
		} else {
			this.width = SystemInfo.screenWidth;
			this.height = SystemInfo.screenHeight;
		}
		
		$('#game').css({'width':this.width+'px', 'height':this.height+'px', 'background-color':'black'});		
		$('body').append(scene);
	},
	/**
 	 * Create Game Scene
 	 */	
	createScene: function() {
		// Initialize Scene
		$('#scene').unbind().remove();
				
		// Create canvas
		var canvasSize = this.calcCanvasSize();
		this.sceneWidth = canvasSize[0];
		this.sceneHeight = canvasSize[1];
		this.scaleRate.x = this.sceneWidth/this.width;
		this.scaleRate.y = this.sceneHeight/this.height;
		
		// Append Canvas to Div
		var scene = DomUtil.createCanvas('scene',this.sceneWidth,this.sceneHeight);
		$('#game').append(scene);
		
		// Attach Mouse & Touch Event using jQuery Mobile
		if(Goblin.Cordova) {
			var scene = document.getElementById('scene');
			scene.addEventListener('touchstart',SceneManager.onTouchStartCB,false);
			scene.addEventListener('touchmove',SceneManager.onTouchMoveCB,false);	
			scene.addEventListener('touchend',SceneManager.onTouchEndCB,false);		
		} else {
			$('#scene').bind('vmousedown',SceneManager.onMouseDownCB);
			$('#scene').bind('vmousemove',SceneManager.onMouseMoveCB);	
			$('#scene').bind('vmouseup',SceneManager.onMouseUpCB);
		}
		
		
		// Resize canvas screen size
		$('#game').css({'width':this.width+'px','height':this.height+'px'});
		$('#scene').css({'width':this.width+'px','height':this.height+'px','position':'fixed'});
		
		// Graphics Context Initialize
		GraphicContext.initialize();
		
		// Button Array Initialize
		this.buttons = [];
		
		return scene;
	},
	/**
 	 * Calculate Canvas Size from System Information
 	 * @return {Array} This return is canvas size.
 	 */
	calcCanvasSize: function() {
		var canvasSize = [];
		
		if(SystemInfo.orientation == 'landscape')	{
			if(SystemInfo.resolution >= 1.75)		canvasSize = [1024,576]; // 16:9
			else if(SystemInfo.resolution >= 1.5)	canvasSize = [1024,682]; // 3:2
			else 									canvasSize = [1024,768]; // 4:3
		} else { // 'portrait'
			if(SystemInfo.resolution <= 0.57)		canvasSize = [576,1024]; // 9:16
			else if(SystemInfo.resolution <= 0.67)	canvasSize = [682,1024]; // 2:3
			else 									canvasSize = [768,1024]; // 3:4			
		}
		
		return canvasSize;
	},
	addButton: function(btn) {
		this.buttons.push(btn);
	},
	clearButtons: function() {
		this.buttons = [];
		Goblin.Graphics.clearScene();
	},
	onMouseDownCB: function(event) {
		var x = parseInt(event.pageX*SceneManager.scaleRate.x);
		var y = parseInt(event.pageY*SceneManager.scaleRate.y);
		
		SceneManager.mouseClicked = true;
		
		if(SceneManager.buttons.length > 0) {
			for(var i = 0; i < SceneManager.buttons.length; i++) {
				SceneManager.buttons[i].checkHover(x,y);
			}	
		}
		
		if(_state.mouseDown != undefined)
			_state.mouseDown(x,y);	
	},
	onMouseMoveCB: function(event) {
		var x = parseInt(event.pageX*SceneManager.scaleRate.x);
		var y = parseInt(event.pageY*SceneManager.scaleRate.y);
		
		
		if(SceneManager.mouseClicked) {
			if(_state.mouseDownMove != undefined)
				_state.mouseDownMove(x,y);
		} else {
			if(_state.mouseUpMove != undefined)
				_state.mouseUpMove(x,y);
		} 
			
	},
	onMouseUpCB: function(event) {
		var x = parseInt(event.pageX*SceneManager.scaleRate.x);
		var y = parseInt(event.pageY*SceneManager.scaleRate.y);
		
		SceneManager.mouseClicked = false;
		
		if(SceneManager.buttons.length > 0) {
			for(var i = 0; i < SceneManager.buttons.length; i++) {
				SceneManager.buttons[i].hoverOff();
			}	
		}
		
		if(_state.mouseUp != undefined)
			_state.mouseUp(x,y);
	},
	
	onTouchStartCB: function(event) {
		event.preventDefault();
		var touches = [];
		for (var i = 0; i < event.touches.length; i++) {
			var touch = {x: parseInt(event.touches[i].pageX*SceneManager.scaleRate.x),
						 y: parseInt(event.touches[i].pageY*SceneManager.scaleRate.y)};
			touches.push(touch);
		}
		
		SceneManager.mouseClicked = true;
		if(SceneManager.buttons.length > 0) {
			for(var i = 0; i < SceneManager.buttons.length; i++) {
				SceneManager.buttons[i].checkHover(touches[0].x,touches[0].y);
			}	
		}
		
		if(_state.touchStart != undefined)
			_state.touchStart(touches);
	},
	
	onTouchMoveCB: function(event) {
		event.preventDefault();
		var touches = [];
		for (var i = 0; i < event.touches.length; i++) {
			var touch = {x: parseInt(event.touches[i].pageX*SceneManager.scaleRate.x),
						 y: parseInt(event.touches[i].pageY*SceneManager.scaleRate.y)};
			touches.push(touch);
		}
		if(_state.touchMove != undefined)
			_state.touchMove(touches);
	},
	
	onTouchEndCB: function(event) {
		event.preventDefault();
		var touches = [];
		for (var i = 0; i < event.touches.length; i++) {
			var touch = {x: parseInt(event.touches[i].pageX*SceneManager.scaleRate.x),
						 y: parseInt(event.touches[i].pageY*SceneManager.scaleRate.y)};
			touches.push(touch);
		}
		
		SceneManager.mouseClicked = false;
		if(SceneManager.buttons.length > 0) {
			for(var i = 0; i < SceneManager.buttons.length; i++) {
				SceneManager.buttons[i].hoverOff();
			}	
		}
		
		if(_state.touchEnd != undefined)
			_state.touchEnd(touches);
	}
};