/**
 * Text.js
 * Class Text Trigger
 * @author Hyunseok Oh
 */
var TEXTMODE = {FILL: 0, STROKE: 1, FILLSTROKE: 2};

var TextTrigger = {
	textAssets: [],	// Effect Asset Array(Font)
	texts: [],	// Effect Drawing Array
/**
 *  Initialize Text
 */
	initialize: function() {
		this.texts = [];
	},	
/**
 *  Draw Effects
 */
	draw: function() {
		// Draw
		var curTime = new Date().getTime();
		for( var i = 0; i < this.texts.length; i++) {
			if(this.texts[i].lerpY != null)
				this.texts[i].posY = this.texts[i].lerpY.value();
				
			if(this.texts[i].lerpS != null)
				this.texts[i].size = parseInt(this.texts[i].lerpS.value());
			
			if(curTime - this.texts[i].elapseTime >= this.texts[i].duration) {
				this.texts.splice(i,1);	
			} else {
				Goblin.Graphics.drawText(this.texts[i]);	
			}	
		}
	},
/**
 *  Pull Trigger
 *  @param {String} - Text
 *  @param {Number} - X
 *  @param {Number} - Y
 *  @param {Number} - Y
 */
	pull: function(str,x,y,fonttype) {
		if(arguments.length < 4) { // default Font
			var fontObj = FontType['default'];
		} else {
			var fontObj = FontType[fonttype];
		}
		
		var textObj = {
			duration: fontObj.duration,
			elapseTime: new Date().getTime(),
			face: fontObj.face,
			fillColor: fontObj.fillColor,
			lerpY: null, 
			lerpS: null,
			mode: fontObj.mode,
			posX: x,
			posY: y, 
			shadowColor: fontObj.strokeColor,
			shadowOffsetX: fontObj.shadowOffsetX,
			shadowOffsetY: fontObj.shadowOffsetY,
			shadowBlur: fontObj.shadowBlur,
			size: fontObj.size,
			strokeColor: fontObj.strokeColor,
			style: fontObj.style, // normal, italic, oblique, inherit
			value: str,
			weight: fontObj.weight, // normal, bold, bolder, lighter
		};
		
		if(fontObj.dispY != 0) {
			textObj.lerpY = new Lerp(y,y + fontObj.dispY,fontObj.duration);	
		}
		
		if(fontObj.dispS != 0) {
			textObj.lerpS = new Lerp(fontObj.size,fontObj.size + fontObj.dispSize,80);
		}
		
		this.texts.push(textObj);
	},	
};