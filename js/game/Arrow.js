/**
 * Arrow.js
 * Class Arrow Trigger
 * @author Hyunseok Oh
 */
var ARROWSTATE = {FLY: 0, HIT: 1, HIDE: 2};
var ARROWTYPE = {NORMAL: 0, FIRE: 1, FIREBIG: 2, PRISON: 3, PIERCING: 4, HEADSHOT: 5};

/**
 * Arrow Trigger Object
 * Manage Arrow Objects
 */
var ArrowTrigger = {
	arrowAssets: [],	// Arrow Asset Array
	arrows: [],	// Arrow Drawing Array
/**
 *  ArrowTrigger Initialize
 */
	initialize: function() {
		this.add(ARROWTYPE.NORMAL,'arrow',Goblin.Asset.get('arrow_hit'),Goblin.Asset.get('arrow_fly'));
		this.add(ARROWTYPE.FIRE,'firearrow',Goblin.Asset.get('arrow_hit'),Goblin.Asset.get('fireArrow_fly'));
		this.add(ARROWTYPE.FIREBIG,'firearrow',Goblin.Asset.get('arrow_hit'),Goblin.Asset.get('fireArrow_fly'));
		this.add(ARROWTYPE.PRISON,'arrow',Goblin.Asset.get('arrow_hit'),Goblin.Asset.get('arrow_fly'));
		this.add(ARROWTYPE.PIERCING,'piercingarrow',Goblin.Asset.get('arrow_hit'),Goblin.Asset.get('piercingarrow_fly'));
		this.add(ARROWTYPE.HEADSHOT,'piercingarrow',Goblin.Asset.get('arrow_hit'),Goblin.Asset.get('piercingarrow_fly'));
	},
/**
 *  Add Arrow Assets
 *  @param {String} - Arrow id
 *  @param {Object} - Sprite Asset 
 */
	add: function(type,id,imgHit,imgFly) {
		var arrowAsset = {
			'type': type,
			'id': id,
			'imghit': imgHit,
			'imgfly': imgFly
		};
		this.arrowAssets.push(arrowAsset);
	},
/**
 *  Update Arrows
 */
	update: function() {
		for(var i = 0; i < this.arrows.length; i++) {
			var arrow = this.arrows[i];
			switch(arrow.state) {
				case ARROWSTATE.FLY:
					arrow.pos.x = arrow.target.posX + arrow.hitPoint.x - 100;
					arrow.pos.y = arrow.target.posY + arrow.hitPoint.y - 5;
					
					var curTime = new Date().getTime();
					if(curTime - arrow.elapseTime > 66) {
						arrow.state = ARROWSTATE.HIT;
						arrow.hitInit = false;
						arrow.elapseTime = new Date().getTime();
					}
					break;
				case ARROWSTATE.HIT:
					arrow.pos.x = arrow.target.posX + arrow.hitPoint.x;
					arrow.pos.y = arrow.target.posY + arrow.hitPoint.y;
					
					if(!arrow.hitInit) {
						arrow.hitInit = true;
						Goblin.Effect.pull('bloodGreen',arrow.pos.x-90,arrow.pos.y-90);
						Goblin.Sound.play('bowhit');
						
						switch(arrow.type) {
							case ARROWTYPE.FIRE: 
								Goblin.Effect.pull('effFireExpBig',arrow.pos.x,arrow.pos.y-100);
								arrow.target.setDamage(arrow.damage);								
								break;
							case ARROWTYPE.PRISON:
								Goblin.Effect.pull('effLock',arrow.target.posX+50,arrow.target.posY+50);
								Goblin.Sound.play('lock');
								arrow.target.setDamage(arrow.damage);
								if(arrow.target.id == 'bosslord')	break;
								arrow.target.changeState(ENEMYSTATE.STUN);							
								break;
							case ARROWTYPE.NORMAL:
								arrow.target.setDamage(arrow.damage);
								break;
							case ARROWTYPE.PIERCING:
								Goblin.Effect.pull('effPiercingArrow',arrow.pos.x,arrow.pos.y);
								arrow.target.setDamage(arrow.damage);
								break;
							case ARROWTYPE.HEADSHOT:
								Goblin.Effect.pull('effHeadShot',arrow.pos.x,arrow.pos.y);
								Goblin.Sound.play('headshot');
								arrow.target.setDamage(arrow.damage);
								break;
						}
					}
					
					var curTime = new Date().getTime();
					if(curTime - arrow.elapseTime > 120) {
						arrow.state = ARROWSTATE.HIDE; 
					}
					break;
				case ARROWSTATE.HIDE:
					this.eraseArrow(i);
					break;
			}
		}
	},
/**
 *  Draw Arrows
 */
	draw: function() {
		for(var i = 0; i < this.arrows.length; i++) {
			if(this.arrows[i].state == ARROWSTATE.HIDE) continue;
			
			if(this.arrows[i].state == ARROWSTATE.FLY) {
				Goblin.Graphics.drawImage(this.arrows[i].imgfly,this.arrows[i].pos.x,this.arrows[i].pos.y);	
			} else if (this.arrows[i].state == ARROWSTATE.HIT) {
				Goblin.Graphics.drawImage(this.arrows[i].imghit,this.arrows[i].pos.x,this.arrows[i].pos.y);	
			}	
		}
	},
/**
 *  Pull Trigger
 *  @param {String} - Arrow Type
 *  @param {Object} - Arrow Target
 *  @param {Number} - Arrow Damage
 */
	pull: function(type,target,damage) {
		var arrow = {pos: {x:0,y:0}};
		// Play Sprite & Push Drawing Array
		for(var i = 0; i < this.arrowAssets.length; i++) {
			if(this.arrowAssets[i].type == type) {
				arrow.type = type;
				arrow.imghit = this.arrowAssets[i].imghit;
				arrow.imgfly = this.arrowAssets[i].imgfly;
				arrow.target = target;
				if(arrow.type == ARROWTYPE.HEADSHOT) {
					arrow.hitPoint = target.hitPoint[0];
				} else {
					arrow.hitPoint = target.hitPoint[Goblin.Math.rand(0,target.hitPoint.length-1)];
				}
				arrow.pos.x = target.posX + arrow.hitPoint.x;
				arrow.pos.y = target.posY + arrow.hitPoint.y - 12;
				arrow.state = ARROWSTATE.FLY;
				arrow.damage = damage;
				arrow.elapseTime = new Date().getTime();
				 
				this.arrows.push(arrow);
				break;
			}
		}
	},
	
	eraseArrow: function(idx) {
		for(var i = 0; i < this.arrows.length; i++) {
			if(i == idx) {
				this.arrows.splice(i,1);
				return;	
			}
		}
	}
};