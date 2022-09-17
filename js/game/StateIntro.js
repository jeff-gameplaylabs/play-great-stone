/**
 * StateIntro.js
 * Game Intro Movie
 * @author Hyo Sang Lim
 */
function StateIntro() 
{
	_state = this;
	this.state = null;
	this.scene = Goblin.Scene.createScene();
	this.WIDTH = Goblin.Scene.sceneWidth;
	this.HEIGHT = Goblin.Scene.sceneHeight;
	
	this.initialize();
	this.run();
};

StateIntro.prototype.run = Goblin.Core.run;
StateIntro.prototype.pause = Goblin.Core.pause;

StateIntro.prototype.initialize = function()
{
	console.log('>> StateIntro::initialize');
	Goblin.Video.create	('intro', this.WIDTH, this.HEIGHT, [
	{src : './movie/intro.mp4',	type : 'video/mp4'},
	{src : './movie/intro.webm',type : 'video/webm'}], false, false).setPosition(0,0).setSize(this.WIDTH, this.HEIGHT);
	$('#game').css("background-color","black");
	Goblin.Video.show('intro','#game');
	document.getElementById('intro').addEventListener('ended',function(){
		$('#intro').unbind().remove();
		StateManager.transition(STATE.PLAY);
	},false);
	Goblin.Video.play('intro');
};

StateIntro.prototype.update = function()
{
	//console.log('>> StateIntro::update');
};

StateIntro.prototype.render = function()
{
	//console.log('>> StateIntro::render');
};

StateIntro.prototype.cleanup = function()
{
	//console.log('>> StateIntro::cleanup');
};
