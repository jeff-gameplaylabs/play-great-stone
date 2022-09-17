/**
 * ObjButton.js
 * Button Object Class
 * @author Hyunseok Oh
 */

/**
 * ObjButton Class
 * @param {Object} Button Information
 */
function ObjButton(btnInfo)
{
	_button = this;
	
	this.image =  null;
	this.imageHover = null;
	this.effect = null;
	this.sound = null;
	this.action = null;
	this.x = 0;
	this.y = 0;
	this.effectX = 0;
	this.effectY = 0;
	
	this.hover = false;
	this.nowAtction = false;
	
	if(typeof btnInfo.image != 'undefined')		this.image = Goblin.Asset.get(btnInfo.image);
	if(typeof btnInfo.imageHover != 'undefined')this.imageHover = Goblin.Asset.get(btnInfo.imageHover);
	if(typeof btnInfo.effect != 'undefined')	this.effect = new ObjSprite(Goblin.Asset.get(btnInfo.effect));
	if(typeof btnInfo.sound != 'undefined')		this.sound = btnInfo.sound;
	if(typeof btnInfo.action != 'undefined')	this.action = btnInfo.action;
	if(typeof btnInfo.x != 'undefined')			this.x = btnInfo.x;
	if(typeof btnInfo.y != 'undefined')			this.y = btnInfo.y;
	if(typeof btnInfo.effX != 'undefined')		this.effectX = btnInfo.effX;
	if(typeof btnInfo.effY != 'undefined')		this.effectY = btnInfo.effY;
	
	if(this.image.type == ASSET.IMAGE) {	// Normal Image
		this.w = this.image.object.width;
		this.h = this.image.object.height;	
	} else if(this.image.type == ASSET.TPIMAGE) {	// Texture Packer Image
		this.w = this.image.data.sourceSize.w;
		this.h = this.image.data.sourceSize.h;
	}	
	if(this.effect == null) {
		this.clearW = this.w;
		this.clearH = this.h;
	} else {
		this.clearW = Math.max(this.w,this.effect.width);
		this.clearH = Math.max(this.h,this.effect.height);	
	}
};

ObjButton.prototype.draw = function()
{
	if(this.hover)
		Goblin.Graphics.drawImage(this.imageHover,this.x,this.y);
	else
		Goblin.Graphics.drawImage(this.image,this.x,this.y);
	
	if(this.effect != null)
		if(this.effect.playing) {
			Goblin.Graphics.drawSprite(this.effect,this.x + this.effectX,this.y + this.effectY);
			
			if(this.effect.isMaxFrame() == true && this.nowAction != true) {
				this.action();
				this.nowAction = true;
			}			
		}
};

ObjButton.prototype.checkHover = function(x,y)
{
	if(x >= this.x && x <= this.x + this.w &&
		y >= this.y && y <= this.y + this.h) {
		this.hover = true;
		return;
	}
	
	this.nowAction = false;
	this.hover = false;
};

ObjButton.prototype.hoverOff = function()
{
	if(this.hover == true)	{
		if(this.effect == null) {
			this.action();
		}
		
		if(this.effect != null)	{
			this.effect.play();
		}
	}
	this.hover = false;
};