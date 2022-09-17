/**
 * Item.js
 * Item Object Class & Trigger 
 * @author Hyunseok Oh
 */
var ITEMSTATE = { POP: 0, READY: 1, FLICKER: 2, HIDE: 3, FLY: 4 };

/**
 * Item Object Class
 */
function Item() {
	this.id = null;
	this.image = null;
	this.state = null;
	this.lerp = null;
	this.hide = false;
	this.pos = {x: 0,y: 0};
	this.initPos = {x: 0,y: 0};
};

/**
 * Item Object Update
 */
Item.prototype.update = function()
{
	switch(this.state) {
		case ITEMSTATE.POP:
			this.pos = this.para.value();
			if(this.para.end == true) {
				this.state = ITEMSTATE.READY;
				this.elapseTime = new Date().getTime();
				this.shineTime = Goblin.Math.rand(0,ItemTrigger.ShineTimingMax);
			}
			break;
		case ITEMSTATE.READY:
			var curTime = new Date().getTime();
			var timer = curTime - this.elapseTime;
			if( timer >= this.shineTime) {
				Goblin.Effect.pull('effItemShine',this.pos.x-58,this.pos.y-65);
				this.shineTime += ItemTrigger.ShineTimingGap;
			}
			
			if(timer >= ItemTrigger.ReadyTimeMax) {
				this.state = ITEMSTATE.FLICKER;
				this.elapseTime = new Date().getTime();
				this.flickerTime = 0;
				this.flickerGap = ItemTrigger.FlickerGapInit;
			}
			break;
		case ITEMSTATE.FLICKER:
			var curTime = new Date().getTime();
			var timer = curTime - this.elapseTime;
			if( timer >= this.flickerTime) {
				this.flickerTime += this.flickerGap;
				if(this.hide == true) 
					this.hide = false;
				else if(this.hide == false)
					this.hide = true; 
			}
			
			if(timer >= ItemTrigger.FlickerDurationUrgent) {
				this.flickerGap = ItemTrigger.FlickerGapUrgent;
			}
			
			if(timer >= ItemTrigger.FlickerDuration) {
				this.state = ITEMSTATE.HIDE;
			}
			break;
		case ITEMSTATE.FLY:
			this.pos.y = this.lerp.value();
			if(this.lerp.t() >= 1) {
				this.state = ITEMSTATE.HIDE;
			}
			break;
	}
};

/**
 * Item Object Draw
 */
Item.prototype.draw = function()
{
	if(this.hide == false) {
		Goblin.Graphics.drawImage(this.image,this.pos.x,this.pos.y);	
	}
};

/**
 * ItemTrigger Object
 * Manage ItemTrigger Objects
 */
var ItemTrigger = {
	ShineTimingMax: 1000,	// 아이템 드랍 후 반짝임 발생 시작 값(n ms 내에 반짝임 발생 발생)
	ShineTimingGap: 2000,	// 반짝임 발생  간격 (n ms 마다 반짝임 효과 발생)
	ReadyTimeMax: 20000,	// 아이템 드랍 후 깜박이기 전까지 대기 시간
	FlickerGapInit: 500,	// 깜박임 간격 
	FlickerGapUrgent: 100,	// 긴급 깜박임 간격 
	FlickerDurationUrgent: 3000,	// 긴급 깜박임까지 걸리는 시간 
	FlickerDuration: 5000,	// 전체 깜박임 시간
	PoppingDuration: 200,	// 아이템 드랍 애니메이션 시간
	PoppingHeight: 50,	// 아이템 드랍 시 위쪽으로 올라가는 애니메이션 높이 
	GettingDuration: 50,	// 아이템 수거 시 위쪽으로 올라가는 애니메이션 시간
	GettingHeight: 50,	// 아이템 수거 시 위쪽으로 올라가는 애니메이션 높이
	TouchMargin: 20,	// 터치 기기에서 추가 터치 허용가능 영역
	items: [],	// Item Drawing Array
/**
 *  Initialize Items
 */
	initialize: function() {
		this.items = [];
	},
/**
 *  Update Items
 */
	update: function() {
		for(var i = 0; i < this.items.length; i++) {
			this.items[i].update();
			if(this.items[i].state == ITEMSTATE.HIDE) {
				this.eraseItem(i);
			}
		}
	},
/**
 *  Draw Items
 */
	draw: function() {
		for(var i = 0; i < this.items.length; i++) {
			this.items[i].draw();
		}
	},
/**
 *  Pull Item Trigger
 *  @param {String} - Item id
 *  @param {Number} - Generating Position X
 *  @param {Number} - Generating Position Y 
 */
	pull: function(id,x,y) {
		var itemData = ItemGenerationInfo[id];

		for(var i = 0; i < itemData.item.length; i++) {
			var rValue = Goblin.Math.rand(0,9999);
			var prob =  itemData.probability[i]*10000;
			if(rValue < prob) {
				var itemId = itemData.item[i];
				var newItem = new Item();
				newItem.id = itemId;
				newItem.image = Goblin.Asset.get(ItemInfo[itemId].image);
				newItem.initPos.x = x + 70;
				newItem.initPos.y = y + 40;
				var targetX = x + 20 + Goblin.Math.rand(0,100);
				newItem.lerp = null;
				newItem.para = new ParabolicMotion(newItem.initPos.x,targetX,newItem.initPos.y,this.PoppingHeight,this.PoppingDuration);
				newItem.state = ITEMSTATE.POP;
				this.items.push(newItem);
			}
		}
	},
/**
 *  Erase Item
 *  @param {Number} - Index on Item Array 
 */	
	eraseItem: function(idx) {
		for(var i = 0; i < this.items.length; i++) {
			if(i == idx) {
				this.items.splice(i,1);
				return;	
			}
		}
	},
/**
 *  Check Hover
 *  @param {Number} - Mouse Pointing & Touch Position X
 *  @param {Number} - Mouse Pointing & Touch Position Y 
 */		
	checkHover: function(x,y) {
		for(var i = 0; i < this.items.length; i++) {
			var touchArea = 0;
			if(Goblin.Cordova)	touchArea = this.TouchMargin;
			if(x >= this.items[i].pos.x - touchArea && x <= this.items[i].pos.x + 24 + touchArea && 
				y >= this.items[i].pos.y - touchArea && y <= this.items[i].pos.y + 24 + touchArea) {
				this.items[i].state = ITEMSTATE.FLY;
				this.items[i].lerp = new Lerp(this.items[i].pos.y,this.items[i].pos.y - this.GettingHeight,this.GettingDuration);
				Goblin.Sound.play('item1');
				/* Add Item to Player Inventory */
			}
		}
	}
};