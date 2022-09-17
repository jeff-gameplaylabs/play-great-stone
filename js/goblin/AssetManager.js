/**
 * AssetManager.js
 * Manage Game Assets
 * @author Hyunseok Oh
 */
var AssetManager = {
	getInstance: function() {
		return this;
	},
	assets: null,
	loadedCount: 0,
	totalLoadedCount: 0,
/**
 * initialize AssetManager
 */
	initialize: function() {
		console.log('** Initialize Goblin.AssetManager');
		this.assets = {};
		this.loadedCount = 0;
		this.totalLoadedCount = 0;
	},
/**
 * Add Asset Object
 * @param {String} Asset query name
 * @param {ASSET.TYPE} Type : ( IMAGE - 0, AUDIO - 1, SPRITE - 2, TP - 3 ) 
 * @param {String} Asset Source Path
 */
	add: function(id,type,src) {
		//console.log('>> AssetManager::type' + type);	
		if(typeof this.assets[id] == 'undefined')	{
			this.assets[id] = new Asset(id,type,src);
			this.totalLoadedCount++;
		}
	},
	
	remove: function(id) {
		//console.log('>> AssetManager::type' + type);	
		if(typeof this.assets[id] != 'undefined')	{
			this.assets[id].cleanup();
			delete this.assets[id];
			this.totalLoadedCount--;
			this.loadedCount--;
		}
	},
/**
 * import TexturePacker From Object
 * @param {Object} texture packer object
 */
	importTexturePacker: function(data) {
		var asm = this.getInstance();
		asm.totalLoadedCount += data.frames.length;	// count total resource number
		
		var object = new Image();
		object.src = data.meta.image;
		
		$(object).load(function() { 
			for(var i = 0; i < data.frames.length; i++) {
				var fnSegments = data.frames[i].filename.split('.');
				var id = fnSegments[0];
				asm.assets[id] = new Asset(id,ASSET.TPIMAGE,data.frames[i]);
				asm.assets[id].object = this;
				asm.loadedCount++;	// count loaded resource number
				console.log(">> Asset::loadCompleted " + this.src + "("+ asm.loadedCount + "/" + asm.totalLoadedCount +")");
			}
		});
		$(object).error(function() {
			console.log(">> Asset::loadFailed Reload " + this.src);
		});
	},
/**
 * Get Asset Object
 * @param {String} Asset id
 * @return {Object} return Asset object 
 */	
	get: function(id) {
		if(typeof this.assets[id] != 'undefined') {
			return this.assets[id];
		}
		return null;
	},
};