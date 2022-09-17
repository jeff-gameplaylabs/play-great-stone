/**
 * StateLogin.js
 * Implement Game Login
 * @author Hyunseok Oh
 */
function StateLogin()
{
	_state = this;
	this.state = null;
	this.scene = Goblin.Scene.createScene();
	this.WIDTH = Goblin.Scene.sceneWidth;
	this.HEIGHT = Goblin.Scene.sceneHeight;
	
	this.initialize();
	this.run();
};

StateLogin.prototype.run = Goblin.Core.run;
StateLogin.prototype.pause = Goblin.Core.pause;

StateLogin.prototype.initialize = function()
{
	console.log(">> initialize Login");
	this.state = 'ready';

	this.imgBg0 = Goblin.Asset.get('bg0');
	this.bgY = -(this.imgBg0.object.height - this.HEIGHT);
	
	this.sprTitle = Goblin.Object.createSprite(Goblin.Asset.get('title'));
	this.sprTitle.play();
	
	this.sprLogin = Goblin.Object.createSprite(Goblin.Asset.get('login'));
	this.sprLogin.play();
	this.loginX = (this.WIDTH-98)/2;
	this.loginY = (this.HEIGHT-116)/2+160;
	
	// Button Facebook Login
	var fbBtn = Goblin.Object.createButton({
		image: 'btn_play',
		imageHover: 'btn_play',
		action: function() {
			_state.timer = new Date().getTime();
			_state.state = 'login';
			Goblin.Scene.clearButtons();
		},
		x: 70, 
		y: _state.loginY,
	});
	Goblin.Scene.addButton(fbBtn);
	
	var guestBtn = Goblin.Object.createButton({
		image: 'btn_play',
		imageHover: 'btn_play',
		action: function() {
			StateManager.transition(STATE.INTRO);
		},
		x: 554, 
		y: _state.loginY,
	});
	Goblin.Scene.addButton(guestBtn);
	//Goblin.Sound.playBgm('opening');
};

StateLogin.prototype.update = function()
{
	var timer = new Date().getTime();
	if(timer - this.timer >= 1000)
		StateManager.transition(STATE.LOBBY);
};

StateLogin.prototype.render = function()
{
	Goblin.Graphics.drawImage(this.imgBg0,0,0);
	
	Goblin.Graphics.drawSprite(this.sprTitle,0,0);
	
	if(this.state == 'login') {
		Goblin.Graphics.drawSprite(this.sprLogin,this.loginX,this.loginY);
		Goblin.Graphics.drawString('Now Log In SNS',this.loginX-80,this.loginY,FontType['default2']);
	}
};

StateLogin.prototype.cleanup = function()
{
	console.log('>> StateLogin::cleanup');
};