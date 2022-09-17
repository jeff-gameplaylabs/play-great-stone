/**
 * StateInventory.js
 * Implement Game Store
 * @author Hyunseok Oh
 */
function StateInventory(sceneType) 
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
StateInventory.prototype.run = Goblin.Core.run;
StateInventory.prototype.pause = Goblin.Core.pause;

StateInventory.prototype.initialize = function() {
	console.log('>> StateInventory::initialize');
	this.imgBg1 = Goblin.Asset.get('bg1');
	this.bgY = -(this.imgBg1.object.height - this.HEIGHT);
	
	this.imgBgCharacter = Goblin.Asset.get('back_character');
	this.posBgCharacter = {
		x: 20,
		y: (this.HEIGHT - this.imgBgCharacter.data.frame.h)/2
	};	
	this.imgBgInventory = Goblin.Asset.get('back_character_item');
	this.posBgInventory = {
		x: 524,
		y: (this.HEIGHT - this.imgBgCharacter.data.frame.h)/2
	};	
	
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

StateInventory.prototype.update = function() {

};

StateInventory.prototype.render = function() {
	Goblin.Graphics.drawImage(this.imgBg1,0,this.bgY);
		
	Goblin.Graphics.drawImage(this.imgBgCharacter, this.posBgCharacter.x,this.posBgCharacter.y);
	Goblin.Graphics.drawImage(this.imgBgInventory, this.posBgInventory.x,this.posBgInventory.y);
};

StateInventory.prototype.cleanup = function() {
	console.log('>> StateInventory::cleanup');
};