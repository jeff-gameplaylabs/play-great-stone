/**
 * StateTavern.js
 * Implement Game Logo
 * @author Hyunseok Oh, Hyosang Lim
 */
function StateTavern(sceneType) 
{
	_state = this;
	this.state = null;
	this.scene = Goblin.Scene.createScene();
	this.WIDTH = Goblin.Scene.sceneWidth;
	this.HEIGHT = Goblin.Scene.sceneHeight;
	
	this.state = null;
	
	this.initialize();
	this.run();

};
StateTavern.prototype.run = Goblin.Core.run;
StateTavern.prototype.pause = Goblin.Core.pause;

StateTavern.prototype.initialize = function() {
	console.log('>> StateTavern::initialize');
	

};

StateTavern.prototype.update = function() {

};

StateTavern.prototype.render = function() {
	
};

StateTavern.prototype.cleanup = function() {
	console.log('>> StateTavern::cleanup');

};