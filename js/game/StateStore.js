/**
 * StateStore.js
 * Implement Game Store
 * @author Hyunseok Oh
 */
function StateStore(sceneType) 
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
StateStore.prototype.run = Goblin.Core.run;
StateStore.prototype.pause = Goblin.Core.pause;

StateStore.prototype.initialize = function() {
	console.log('>> StateStore::initialize');
	this.imgBg1 = Goblin.Asset.get('bg1');
	this.bgY = -(this.imgBg1.object.height - this.HEIGHT);
	
	this.imgBgStore = Goblin.Asset.get('back_store');
	
	// Button Buy Flag 
	var backBtn = Goblin.Object.createButton({
		image: 'btn_back',
		imageHover: 'btn_back_hover',
		x: 10, 
		y: 10,
		action: function() {
			StateManager.transition(STATE.LOBBY);
		},
	});
	Goblin.Scene.addButton(backBtn);
};

StateStore.prototype.update = function() {

};

StateStore.prototype.render = function() {
	Goblin.Graphics.drawImage(this.imgBg1,0,this.bgY);
	
	var vbg = {
		x: (this.WIDTH - this.imgBgStore.data.frame.w)/2,
		y: (this.HEIGHT - this.imgBgStore.data.frame.h)/2
	}
	
	Goblin.Graphics.drawImage(this.imgBgStore, vbg.x, vbg.y);
};

StateStore.prototype.cleanup = function() {
	console.log('>> StateStore::cleanup');

};