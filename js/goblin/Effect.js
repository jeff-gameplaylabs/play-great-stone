/**
 * Effect.js
 * Class Effect Trigger
 * @author Hyunseok Oh
 */

var EffectTrigger = {
	effectAssets: [],	// Effect Asset Array
	effects: [],	// Effect Drawing Array
/**
 *  Add Effects Assets
 *  @param {String} - Effect id
 *  @param {Object} - Sprite sset 
 */
	add: function(id,asset) {
		var effAsset = {
			'id': id,
			'asset': asset
		};
		this.effectAssets.push(effAsset);
	},
/**
 *  Draw Effects
 */
	draw: function() {
		for(var i = 0; i < this.effects.length; i++) {
			var eff = this.effects[i];
			if(eff.sprite.playing == false) {
				this.effects.splice(i,1);	// Erase Effect
			} else {
				Goblin.Graphics.drawSprite(eff.sprite,eff.x,eff.y);	
			}
		}
	},
/**
 *  Pull Trigger
 *  @param {String} - Effect id
 *  @param {Number} - Effect Drawing X position
 *  @param {Number} - Effect Drawing Y position
 */
	pull: function(id,x,y) {
		var eff = {
			'id': null,
			'sprite': null,
			'x': 0,
			'y': 0
		};
		// Play Sprite & Push Drawing Array
		for(var i = 0; i < this.effectAssets.length; i++) {
			if(this.effectAssets[i].id == id) {
				eff.id = id;
				eff.sprite = Goblin.Object.createSprite(this.effectAssets[i].asset);
				eff.x = x;
				eff.y = y;
				eff.sprite.play();
				this.effects.push(eff);
				break;
			}
		}
	},	
};