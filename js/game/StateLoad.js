/**
 * StateLoad.js
 * Implement Game Load
 * @author Hyunseok Oh
 */
function StateLoad()
{
	_state = this;
	this.state = null;
	this.scene = Goblin.Scene.createScene();
	this.WIDTH = Goblin.Scene.sceneWidth;
	this.HEIGHT = Goblin.Scene.sceneHeight;
	
	this.initialize();
	this.run();
};

StateLoad.prototype.run = Goblin.Core.run;
StateLoad.prototype.pause = Goblin.Core.pause;

StateLoad.prototype.initialize = function()
{
	console.log(">> initialize Load");
	this.imgGauge = Goblin.Asset.get('load_gauge');
	this.w = this.imgGauge.object.width;
	this.h = this.imgGauge.object.height;
	this.x = (this.WIDTH-this.w)/2;
	this.y = (this.HEIGHT-this.h)/2+200;
	
	this.assetCount = Goblin.Asset.loadedCount;
	
	// Load Resource
	Goblin.Asset.add("bg0",ASSET.IMAGE,"./image/bg0.jpg");
	Goblin.Asset.add("bg1",ASSET.IMAGE,"./image/bg1.jpg");
	Goblin.Asset.add("bg2",ASSET.IMAGE,"./image/bg2.jpg");
	Goblin.Asset.add('login',ASSET.SPRITE,SpriteLogin);
	Goblin.Asset.add('title',ASSET.SPRITE,SpriteTitle);
	
	Goblin.Asset.importTexturePacker(TextureGUI);
	Goblin.Asset.importTexturePacker(TextureButton);
	Goblin.Asset.importTexturePacker(TextureGUIFrame);
	Goblin.Asset.importTexturePacker(TextureCount);
	
	Goblin.Asset.add('knight',ASSET.SPRITE,SpriteKnight);
	Goblin.Asset.importTexturePacker(TextureArrow);
	Goblin.Asset.importTexturePacker(TextureItem);
	
	Goblin.Asset.add('azbrown',ASSET.SPRITE,SpriteAZBrown);
	Goblin.Asset.add('azblue',ASSET.SPRITE,SpriteAZBlue);
	Goblin.Asset.add('azgreen',ASSET.SPRITE,SpriteAZGreen);
	Goblin.Asset.add('azpurple',ASSET.SPRITE,SpriteAZPurple);
	Goblin.Asset.add('azred',ASSET.SPRITE,SpriteAZRed);
	Goblin.Asset.add('fznormal',ASSET.SPRITE,SpriteFZNormal);
	Goblin.Asset.add('fzhigh',ASSET.SPRITE,SpriteFZHigh);
	Goblin.Asset.add('wznormal',ASSET.SPRITE,SpriteWZNormal);
	Goblin.Asset.add('wzhigh',ASSET.SPRITE,SpriteWZHigh);
	Goblin.Asset.add('szblue',ASSET.SPRITE,SpriteSZBlue);
	Goblin.Asset.add('szbrown',ASSET.SPRITE,SpriteSZBrown);
	Goblin.Asset.add('szgreen',ASSET.SPRITE,SpriteSZGreen);
	Goblin.Asset.add('szred',ASSET.SPRITE,SpriteSZRed);
	Goblin.Asset.add('bosslord',ASSET.SPRITE,SpriteBossLord);
	
	Goblin.Asset.add('summonsoldier',ASSET.SPRITE,SpriteSummonSoldier);
	Goblin.Asset.add('summonspearman',ASSET.SPRITE,SpriteSummonSpearman);
	Goblin.Asset.add('summonarcher',ASSET.SPRITE,SpriteSummonArcher);
	Goblin.Asset.add('summonknight',ASSET.SPRITE,SpriteSummonKnight);
	Goblin.Asset.add('summoncommander',ASSET.SPRITE,SpriteSummonCommander);
	Goblin.Asset.importTexturePacker(TextureSummonPortrait);
	Goblin.Asset.importTexturePacker(TextureItemPort);
	
	Goblin.Asset.add('effBloodGreen',ASSET.SPRITE,SpriteEffBloodGreen);
	Goblin.Asset.add('effBloodRed',ASSET.SPRITE,SpriteEffBloodRed);
	Goblin.Asset.add('effCrash',ASSET.SPRITE,SpriteEffCrash);
	Goblin.Asset.add('effFieldAqua',ASSET.SPRITE,SpriteEffFieldAqua);
	Goblin.Asset.add('effFieldBlue',ASSET.SPRITE,SpriteEffFieldBlue);
	Goblin.Asset.add('effHeal',ASSET.SPRITE,SpriteEffHeal);
	Goblin.Asset.add('effHealPotion',ASSET.SPRITE,SpriteEffHealPotion);
	Goblin.Asset.add('effShower',ASSET.SPRITE,SpriteEffShower);
	Goblin.Asset.add('effStun',ASSET.SPRITE,SpriteEffStun);
	Goblin.Asset.add('effLock',ASSET.SPRITE,SpriteEffLock);
	Goblin.Asset.add('effBoom',ASSET.SPRITE,SpriteEffBoom);
	Goblin.Asset.add('effArrowShower',ASSET.SPRITE,SpriteEffArrowShower);
	Goblin.Asset.add('effSummon',ASSET.SPRITE,SpriteEffSummon);
	Goblin.Asset.add('effSummonEvil',ASSET.SPRITE,SpriteEffSummonEvil);
	
	Goblin.Asset.add('effFireExp',ASSET.SPRITE,SpriteEffFireExp);
	Goblin.Asset.add('effFireExpBig',ASSET.SPRITE,SpriteEffFireExpBig);
	Goblin.Asset.add('effDoubleHeadShot',ASSET.SPRITE,SpriteEffDoubleHeadShot);
	Goblin.Asset.add('effHeadShot',ASSET.SPRITE,SpriteEffHeadShot);
	Goblin.Asset.add('effFireArrow',ASSET.SPRITE,SpriteEffFireArrow);
	Goblin.Asset.add('effPiercingArrow',ASSET.SPRITE,SpriteEffPiercingArrow);
	Goblin.Asset.add('effItemShine',ASSET.SPRITE,SpriteEffItemShine);
	
	// Puzzle
	Goblin.Asset.importTexturePacker(TexturePuzzle);
	Goblin.Asset.add('blockCheck',ASSET.SPRITE,SpriteEffBlockCheck);
	Goblin.Asset.add('blockConsumeBlue',ASSET.SPRITE,SpriteEffBlockConsumeBlue);
	Goblin.Asset.add('blockConsumeDual',ASSET.SPRITE,SpriteEffBlockConsumeDual);
	Goblin.Asset.add('blockConsumeGreen',ASSET.SPRITE,SpriteEffBlockConsumeGreen);
	Goblin.Asset.add('blockConsumePurple',ASSET.SPRITE,SpriteEffBlockConsumePurple);
	Goblin.Asset.add('blockConsumeRed',ASSET.SPRITE,SpriteEffBlockConsumeRed);
	Goblin.Asset.add('blockConsumeRune',ASSET.SPRITE,SpriteEffBlockConsumeRune);
	Goblin.Asset.add('blockConsumeYellow',ASSET.SPRITE,SpriteEffBlockConsumeYellow);
	Goblin.Asset.add('blockConsumeYellow',ASSET.SPRITE,SpriteEffBlockConsumeYellow);
	Goblin.Asset.add('blockBlue',ASSET.SPRITE,SpriteBlockBlue);
	Goblin.Asset.add('blockGreen',ASSET.SPRITE,SpriteBlockGreen);
	Goblin.Asset.add('blockPurple',ASSET.SPRITE,SpriteBlockPurple);
	Goblin.Asset.add('blockRed',ASSET.SPRITE,SpriteBlockRed);
	Goblin.Asset.add('blockYellow',ASSET.SPRITE,SpriteBlockYellow);
	
	
	//Goblin.Asset.add('opening',ASSET.AUDIO,'./sound/opening.mp3');
	//Goblin.Asset.add('lobby',ASSET.AUDIO,'./sound/lobby.mp3');
	Goblin.Asset.add('battle',ASSET.AUDIO,'./sound/battle.mp3');
	
	Goblin.Asset.add('effBlock',ASSET.AUDIO,'./sound/effBlock.mp3');
	Goblin.Asset.add('effColor',ASSET.AUDIO,'./sound/effColor.mp3');
	Goblin.Asset.add('effDual',ASSET.AUDIO,'./sound/effDual.mp3');
	Goblin.Asset.add('effRune',ASSET.AUDIO,'./sound/effRune.mp3');
	Goblin.Asset.add('effCrash1',ASSET.AUDIO,'./sound/effCrash1.mp3');
	Goblin.Asset.add('effCrash2',ASSET.AUDIO,'./sound/effCrash2.mp3');
	Goblin.Asset.add('bow',ASSET.AUDIO,'./sound/bow.mp3');
	Goblin.Asset.add('bowhit',ASSET.AUDIO,'./sound/bowhit.mp3');
	Goblin.Asset.add('piercearrow',ASSET.AUDIO,'./sound/piercearrow.mp3');
	Goblin.Asset.add('lock',ASSET.AUDIO,'./sound/lock.mp3');
	Goblin.Asset.add('headshot',ASSET.AUDIO,'./sound/headshot.mp3');
	Goblin.Asset.add('doubleheadshot',ASSET.AUDIO,'./sound/doubleheadshot.mp3');
	//Goblin.Asset.add('tripleheadshot',ASSET.AUDIO,'./sound/triplekill.wav');
	Goblin.Asset.add('bite',ASSET.AUDIO,'./sound/zombie_bite.mp3');
	Goblin.Asset.add('zombiedeath',ASSET.AUDIO,'./sound/zombiedeath.mp3');
	Goblin.Asset.add('heal1',ASSET.AUDIO,'./sound/heal1.mp3');
	Goblin.Asset.add('heal2',ASSET.AUDIO,'./sound/heal2.mp3');
	Goblin.Asset.add('god',ASSET.AUDIO,'./sound/god.mp3');
	Goblin.Asset.add('god2',ASSET.AUDIO,'./sound/god2.mp3');
	Goblin.Asset.add('zombiehit',ASSET.AUDIO,'./sound/zombiehit.mp3');
	Goblin.Asset.add('item1',ASSET.AUDIO,'./sound/item1.mp3');
	Goblin.Asset.add('concentrate',ASSET.AUDIO,'./sound/concentrate.mp3');
	Goblin.Asset.add('pierceready',ASSET.AUDIO,'./sound/pierceready.mp3');
	Goblin.Asset.add('firecrack',ASSET.AUDIO,'./sound/firecrack.mp3');
	Goblin.Asset.add('firearrowhit',ASSET.AUDIO,'./sound/firearrowhit.mp3');
	Goblin.Asset.add('arrowshower',ASSET.AUDIO,'./sound/arrowshower.mp3');
	
	
};

StateLoad.prototype.update = function()
{
	this.percent = (Goblin.Asset.loadedCount-this.assetCount)/(Goblin.Asset.totalLoadedCount-this.assetCount);
	this.percentStr = parseInt(this.percent*100);
};

StateLoad.prototype.render = function()
{
	Goblin.Graphics.drawRect(0,0,this.WIDTH,this.HEIGHT,{'r':0,'g':0,'b':0,'a':1.0});
	var w = this.w*this.percent;
	Goblin.Graphics.drawImage(this.imgGauge,0,0,w,this.h,this.x,this.y,w,this.h);
	var str = this.percentStr +' %'
	Goblin.Graphics.drawString(str,this.x+260,this.y+30,FontType['default1']);
	
	if(this.percentStr == 100) {
		StateManager.transition(STATE.LOGIN);
	}
};

StateLoad.prototype.cleanup = function()
{
	console.log('>> StateLoad::cleanup');
	Goblin.Asset.remove('load_gauge');
};