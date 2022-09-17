/**
 * StateEnding.js
 * Game Ending Movie
 * @author Hyunseok Oh
 */
function StateEnding() 
{
	_state = this;
	this.state = null;
	this.scene = Goblin.Scene.createScene();
	this.WIDTH = Goblin.Scene.sceneWidth;
	this.HEIGHT = Goblin.Scene.sceneHeight;
	
	this.initialize();
	this.run();
};

StateEnding.prototype.run = Goblin.Core.run;
StateEnding.prototype.pause = Goblin.Core.pause;

StateEnding.prototype.initialize = function()
{
	console.log('>> StateEnding::initialize');
	Goblin.Video.create	('ending', this.WIDTH, this.HEIGHT, [
	{src : './movie/ending.mp4',type : 'video/mp4'},
	{src : './movie/ending.webm',type : 'video/webm'}], false, false).setPosition(0,0).setSize(this.WIDTH, this.HEIGHT);
	$('#game').css("background-color","black");
	Goblin.Video.show('ending','#game');
	document.getElementById('ending').addEventListener('ended',function(){
		$('#ending').unbind().remove();
		StateManager.transition(STATE.LOGIN);
	},false);
	Goblin.Video.play('ending');
};

StateEnding.prototype.update = function()
{
	//console.log('>> StateIntro::update');
};

StateEnding.prototype.render = function()
{
	//console.log('>> StateIntro::render');
};

StateEnding.prototype.cleanup = function()
{
	//console.log('>> StateIntro::cleanup');
};