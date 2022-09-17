/**
 * ObjSprite.js
 * Sprite Object Class
 * @author Hyunseok Oh
 */

/**
 * ObjSprite Class
 * @param {String} Sprite id
 * @param {Object} Sprite data 
 */
function ObjSprite(asset)
{	
	_sprite = this;
	this.image = asset.object;
	this.motions = asset.data;
	
	// Callback
	this.finalAct = null;
	this.maxFrameAct = null;
	
	this.initialize();
};

ObjSprite.prototype.initialize = function()
{
	this.currentMotion = 0;
	this.currentFrame = 0;
	this.maxFrame = 0;
	this.width = this.motions[this.currentMotion].frames[this.currentFrame].W;
	this.height = this.motions[this.currentMotion].frames[this.currentFrame].H;
	this.replay = this.motions[this.currentMotion].replay;
	this.reverse = this.motions[this.currentMotion].reverse;
	this.isReverse = false;
	this.playing = false;
		
	this.elaTimer = null;
	this.curTimer = null;
}; 

ObjSprite.prototype.play = function(moId)
{
	this.initialize();
	
	if(arguments.length == 0) this.currentMotion = 0;
	else this.currentMotion = moId;
	
	this.currentFrame = 0;
	this.maxFrame = this.motions[this.currentMotion].frames.length-1;
	this.width = this.motions[this.currentMotion].frames[this.currentFrame].W;
	this.height = this.motions[this.currentMotion].frames[this.currentFrame].H;
	this.replay = this.motions[this.currentMotion].replay;
	this.reverse = this.motions[this.currentMotion].reverse;
	this.playing = true;
	
	this.elaTimer = new Date().getTime();
};

ObjSprite.prototype.draw = function(ctx,x,y)
{
	if(this.image.width == 0)	return;
	
	var motion = this.motions[this.currentMotion];
	var frame = motion.frames[this.currentFrame];
		
	if(this.playing) {
		this.curTimer = new Date().getTime();
		if(this.curTimer - this.elaTimer > frame.playTime) {
			this.elaTimer = this.curTimer; 
			if(!this.reverse) {
				if(this.playing) {				
					this.currentFrame++;
				}
				if(this.currentFrame > this.maxFrame) {
					if(this.replay)	this.currentFrame = 0;
					else {
						this.currentFrame = this.maxFrame;
						this.playing = false;
						if(this.finalAct != null) this.finalAct();
					}
				}
			} else {
				if(!this.isReverse) {
					if(this.playing) {
						this.currentFrame++;
						if(this.currentFrame == this.maxFrame) {
							if(this.maxFrameAct != null) this.maxFrameAct();
							this.isReverse = true;
						}
					}
				} else {
					if(this.playing) {
						this.currentFrame--;
						if(this.currentFrame <= 0) {
							this.isReverse = false;
							if(!this.replay)	{
								this.playing = false;
								if(this.finalAct != null) this.finalAct();
							}
						}
					}
				}
			}
		}	
	}

	ctx.drawImage(this.image,frame.X,frame.Y,frame.W,frame.H,x+frame.offX,y+frame.offY,frame.W,frame.H);
};

ObjSprite.prototype.isMaxFrame = function()
{
	if(this.currentFrame == this.maxFrame)	{
		return true;
	}
	return false; 
};