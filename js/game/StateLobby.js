/**
 * StateLobby.js
 * Implement Game Lobby
 * @author Hyunseok Oh
 */
function StateLobby()
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

StateLobby.prototype.run = Goblin.Core.run;
StateLobby.prototype.pause = Goblin.Core.pause;

StateLobby.prototype.initialize = function()
{
	console.log(">> initialize Lobby");
	this.imgBg1 = Goblin.Asset.get('bg1');
	this.bgY = -(this.imgBg1.object.height - this.HEIGHT);
	
	// Number Background 
	this.imgMoney = Goblin.Asset.get('back_money');
	this.imgCrystal = Goblin.Asset.get('back_crystal');
	this.imgBattle = Goblin.Asset.get('back_battle');
	this.imgLobbyChar = Goblin.Asset.get('back_lobby_character');
	this.imgLobbyFriend= Goblin.Asset.get('back_lobby_friend');
	this.posLobbyChar = {
		x: 20,
		y: (this.HEIGHT - this.imgLobbyChar.data.sourceSize.h)/2
	};
	this.posLobbyFriend = {
		x: 524,
		y: (this.HEIGHT - this.imgLobbyChar.data.sourceSize.h)/2
	};
	
	// Button Buy Flag 
	var backBtn = Goblin.Object.createButton({
		image: 'btn_back',
		imageHover: 'btn_back_hover',
		x: 10, 
		y: 10,
		action: function() {
			StateManager.transition(STATE.LOGIN);
		},
	});
	Goblin.Scene.addButton(backBtn);
	
	// Button Setting
	var settingBtn = Goblin.Object.createButton({
		image: 'btn_setting',
		imageHover: 'btn_setting_hover',
		x: 935, 
		y: 10,
		action: function() {
			console.log('>> Go to Setting');
		},
	});
	Goblin.Scene.addButton(settingBtn);
	
	// Button Buy Flag 
	var buyFlagBtn = Goblin.Object.createButton({
		image: 'btn_buy',
		imageHover: 'btn_buy_hover',
		x: 304, 
		y: 10,
		action: function() {
			StateManager.transition(STATE.STORE);
		},
	});
	Goblin.Scene.addButton(buyFlagBtn);

	// Button Buy Crystal
	var buyCrystalBtn = Goblin.Object.createButton({
		image: 'btn_buy',
		imageHover: 'btn_buy_hover',
		x: 571, 
		y: 10,
		action: function() {
			StateManager.transition(STATE.STORE);
		},
	});
	Goblin.Scene.addButton(buyCrystalBtn);
	
	// Button Buy Gold 
	var buyGoldBtn = Goblin.Object.createButton({
		image: 'btn_buy',
		imageHover: 'btn_buy_hover',
		x: 838, 
		y: 10,
		action: function() {
			StateManager.transition(STATE.STORE);
		},
	});
	Goblin.Scene.addButton(buyGoldBtn);
	
	// Button Tavern
	var tavernBtn = Goblin.Object.createButton({
		image: 'btn_play',
		imageHover: 'btn_play',
		x: 74, 
		y: this.HEIGHT-110,
		action: function() {
			StateManager.transition(STATE.INVENTORY);
		},
	});
	Goblin.Scene.addButton(tavernBtn);
	
	// Button Battle
	var battleBtn = Goblin.Object.createButton({
		image: 'btn_play',
		imageHover: 'btn_play',
		x: 550, 
		y: this.HEIGHT-110,
		action: function() {
			StateManager.transition(STATE.PLAY);
		},
	});
	Goblin.Scene.addButton(battleBtn);
	
	//Goblin.Sound.playBgm('lobby');
};

StateLobby.prototype.update = function()
{

};

StateLobby.prototype.render = function()
{
	Goblin.Graphics.drawImage(this.imgBg1,0,this.bgY);
	
	Goblin.Graphics.drawImage(this.imgMoney,131,15);
	Goblin.Graphics.drawImage(this.imgCrystal,398,15);
	Goblin.Graphics.drawImage(this.imgBattle,665,15);

	Goblin.Graphics.drawImage(this.imgLobbyChar,this.posLobbyChar.x,this.posLobbyChar.y);
	Goblin.Graphics.drawImage(this.imgLobbyFriend,this.posLobbyFriend.x,this.posLobbyFriend.y);
};

StateLobby.prototype.cleanup = function()
{
	console.log('>> StateLobby::cleanup');
};