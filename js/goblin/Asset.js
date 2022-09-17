/**
 * Asset.js
 * Class Game Asset
 * @author Hyunseok Oh
 */
var ASSET = {IMAGE: 0, TPIMAGE: 1, SPRITE: 2, AUDIO: 3};
/**
 * Asset Class
 * @param {String} Asset id
 * @param {ASSET.Type} Type : (IMAGE - 0, TPIMAGE - 1, SPRITE - 2, AUDIO - 2)
 * @param {String} Asset Source Path
 */
function Asset(id,type,src)
{
	_asset = this;
	
	this.object = null;
	this.id = id;
	this.type = type;
	this.src = src;
	this.completed = false;
	this.data = null;
	
	this.load();
};
/**
 * load Asset
 */
Asset.prototype.load = function()
{
	if(this.object == null) {
		switch(this.type) {
			case ASSET.IMAGE:
				this.object = new Image();
				$(this.object).load(_asset.loadCompleted);
				$(this.object).error(_asset.loadFailed);
				this.object.src = this.src;
				break;
			case ASSET.TPIMAGE:
				this.data = this.src;
				break;
			case ASSET.SPRITE:
				this.object = new Image();
				this.data = this.parseSpriteData(this.src);
				$(this.object).load(_asset.loadCompleted);
				$(this.object).error(_asset.loadFailed);
				this.object.src = this.data[0].image;
				break;
			case ASSET.AUDIO:
				if(Goblin.Cordova) {
					SoundManager.createCordovaSound(this.id,this.src);
					AssetManager.loadedCount++;
					console.log(">> Asset::loadCompleted " + this.src + "("+ AssetManager.loadedCount + "/" + AssetManager.totalLoadedCount +")");
					_asset.completed = true;
				} else {
					this.object = SoundManager.createSound(this.id);
					this.object.addEventListener("canplaythrough", _asset.loadCompleted, false);
					this.object.addEventListener("error", _asset.loadFailed, false);
					this.object.src = this.src;
				}
				break;
		};
	}
};

/**
 * loadCompleted Callback
 */
Asset.prototype.cleanup = function()
{
	this.object = null;
	this.id = null;
	this.type = null;
	this.src = null;
	this.completed = null;
	this.data = null;
};

/**
 * loadCompleted Callback
 */
Asset.prototype.loadCompleted = function()
{
	AssetManager.loadedCount++;
	//console.log(">> Asset::loadCompleted " + this.src + "("+ AssetManager.loadedCount + "/" + AssetManager.totalLoadedCount +")");
	_asset.completed = true;
};
/**
 * loadFailed Error
 */
Asset.prototype.loadFailed = function()
{
	console.log(">> Asset::loadFailed " + this.src);
	_asset.load();
};

/**
 * loadFailed Error
 */
Asset.prototype.parseSpriteData = function(src)
{	
	var fn = src.frames[0].filename;
	var fnArr = fn.split('_');
	var name = fnArr[0];
	
	var data = [];
	
	var name = null;
	var motion = null;
	
	for(var i = 0; i < src.frames.length; i++) {
		var fn = src.frames[i].filename;
		var fnArr = fn.split('_');
		var newName = fnArr[0];
		var WIDHT = src.frames[0].sourceSize.w;
		var HEIGHT = src.frames[0].sourceSize.h;
		
		if(name != newName) {	// New Motion
			name = newName;		// Assign Name
			if(src.animation != undefined) {	// Is defined Animation
				var playTimes = src.animation[name].playtime;
				var replay = src.animation[name].replay;
				var reverse = src.animation[name].reverse; 
				var playTimeCnt = 0;
			}
				
			if(motion != null) data.push(motion);	
			else motion = null;
			
			if(replay != undefined) var replayValue = replay;
			else var replayValue = false;
			
			if(reverse != undefined) var reverseValue = reverse;
			else var reverseValue = false;
			
			motion = {
				image: src.meta.image,
				id: name,
				width: src.frames[i].sourceSize.w,
				height: src.frames[i].sourceSize.h,
				replay: replayValue,
				reverse: reverseValue,
				frames: []
			};
		}
		
		if(playTimeCnt != undefined) var timeValue = playTimes[playTimeCnt];
		else var timeValue = 33;
		
		var frame = {
			X: src.frames[i].frame.x,
			Y: src.frames[i].frame.y,
			W: src.frames[i].frame.w,
			H: src.frames[i].frame.h,
			offX: src.frames[i].spriteSourceSize.x + (WIDHT - src.frames[i].sourceSize.w),
			offY: src.frames[i].spriteSourceSize.y + (HEIGHT - src.frames[i].sourceSize.h),
			playTime: timeValue,
		};
		
		if(playTimeCnt != undefined) playTimeCnt++;
		// Add Frame
		motion.frames.push(frame);
	}
	// Add Motion
	data.push(motion);
	
	return data;
};