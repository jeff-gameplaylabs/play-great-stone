/**
 * StateLogo.js
 * Implement Game Logo
 * @author Hyunseok Oh
 */
function StateLogo()
{
	_state = this;
	this.state = null;
	this.scene = Goblin.Scene.createScene();
	this.WIDTH = Goblin.Scene.sceneWidth;
	this.HEIGHT = Goblin.Scene.sceneHeight;
		
	this.initialize();
	this.run();
};
StateLogo.prototype.run = Goblin.Core.run;
StateLogo.prototype.pause = Goblin.Core.pause;

StateLogo.prototype.initialize = function()
{
	console.log('>> StateLogo::initialize');
	
	Goblin.Asset.add('logo',ASSET.SPRITE,SpriteLogo);
	Goblin.Asset.add("load_gauge",ASSET.IMAGE,"./image/load_gauge.png");
	
	this.sprLogo = Goblin.Object.createSprite(Goblin.Asset.get('logo'));
	this.x = (this.WIDTH-this.sprLogo.width)/2;
	this.y = (this.HEIGHT-this.sprLogo.height)/2;
	this.sprLogo.play();
	
	this.elapseTime = new Date().getTime();
};

StateLogo.prototype.update = function()
{
	var curTime = new Date().getTime();
	
	if(curTime-this.elapseTime > 3000)
		StateManager.transition(STATE.LOAD);
	
};

StateLogo.prototype.render = function()
{
	Goblin.Graphics.drawSprite(this.sprLogo,this.x,this.y);
};

StateLogo.prototype.cleanup = function()
{
	console.log('>> StateLogo::cleanup');
	Goblin.Asset.remove('logo');
};