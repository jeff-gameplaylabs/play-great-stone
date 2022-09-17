/**
 * GraphicContext.js
 * Date 2012. 12. 18
 * Description - Canvas Context Interface
 * Version 1.0
 * Copyright (c) SpringStream Game Lab., Inc. All Rights Reserved.
 */
var GraphicContext = {
	context: null,
	initialize: function() {
		this.context = document.getElementById('scene').getContext('2d'); 
	},
/**
 * Return Drowing View Context
 */
	getContext: function() {
		var canvas = null;
		var ctx = null;
			
		canvas = document.getElementById('scene');

		if(canvas != null)
			ctx = canvas.getContext('2d');

		return ctx;
	},
	save: function()	{	this.context.save();	},	// 캔버스 스택에 저장
	restore: function()	{	this.context.restore();	},	// 캔버스 스택에 있는 내용을 회복
	translate: function(x, y)	{	this.context.translate(x, y);	},	// 객체 중심 위치 변환
	scale: function(x, y)	{	this.context.scale(x, y);	},	// 객체 크기 변환
	rotate: function(x, y)	{	this.context.rotate(x, y);	},	// 객체 회전 변환
	setTransform: function(m11, m12, m21, m22, dx, dy)	{	this.context.setTransform(m11, m12, m21, m22, dx, dy);	},	// 대상 객체 변환
/**
 * Draw Image
 * @param {image} image Asset
 * @param {Number} 3,5 - left, 9 - cropping left   
 * @param {Number} 3,5 - top, 9 - cropping top
 * @param {Number} 5 - width, 9 - cropping width
 * @param {Number} 5 - height, 9 - cropping height
 * @param {Number} 9 - left
 * @param {Number} 9 - top
 * @param {Number} 9 - width
 * @param {Number} 9 - height
 */
	drawImage: function(image, x, y, w, h, dx, dy, dw, dh)	{
		if(image == null) return;
		
		if(image.type == ASSET.IMAGE) {	// Normal Image
			switch(arguments.length) {	// Parameter 3,5,9 Another is invalid
				case 3: this.context.drawImage(image.object, x, y); break;
				case 5: if(w <= 0 || h <= 0) break; 
						this.context.drawImage(image.object, x, y, w, h); break;
				case 9: if(w <= 0 || h <= 0 || dw <= 0 || dh <= 0)	break; 
						this.context.drawImage(image.object, x, y, w, h, dx, dy, dw, dh); break;
				default: throw 'Invalid Parameter!'; break;
			}
		} else if(image.type == ASSET.TPIMAGE) {	// Texture Packer Image
			var fr = image.data.frame;
			switch(arguments.length) {	// Parameter 3,5,9 Another is invalid
				case 3: this.context.drawImage(image.object, fr.x, fr.y, fr.w, fr.h, x, y, fr.w, fr.h); break;
				case 5: if(w <= 0 || h <= 0) break; 
						this.context.drawImage(image.object, fr.x, fr.y, fr.w, fr.h, x, y, w, h);	break;
				case 9: if(w <= 0 || h <= 0 || dw <= 0 || dh <= 0)	break;
						this.context.drawImage(image.object, fr.x+x, fr.y+y, w, h, dx, dy, dw, dh);	break;
				default: throw 'Invalid Parameter!'; break;
			}
		}
	},
/**
 * Rotate Image
 * @param {image} image Asset
 * @param {Number} left position of drawing image  
 * @param {Number} top position of drawing image
 * @param {Number} ladian value for rotation
 */
	rotateImage: function(image, x, y, r)	{
		if(image == null) return;
		
		if(image.type == ASSET.IMAGE) {	// Normal Image
			var width = image.object.width;
			var height = image.object.height;
		} else if(image.type == ASSET.TPIMAGE) {	// Texture Packer Image
			var width = image.data.frame.w;
			var height = image.data.frame.h;
		}
		
		this.context.save();
		this.context.translate(x + (width / 2), y + (height / 2));
		this.context.rotate(r);
		this.context.translate(-(x + (width / 2)), -(y + (height / 2)));
		this.drawImage(image, x, y);
		this.context.restore();
	},
	drawString: function(string, x, y, option)	{
		if(arguments.length < 4) { // default Font
			var option = FontType['default'];
		} 
		
		this.context.shadowColor = option.shadowColor;
      	this.context.shadowBlur = option.shadowBlur;
      	this.context.shadowOffsetX = option.shadowOffsetX;
      	this.context.shadowOffsetY = option.shadowOffsetY;
		this.context.font = option.style + ' ' + option.weight + ' ' + option.size + 'px ' + option.face;
		switch(option.mode) {
			case TEXTMODE.FILL:
				this.context.fillStyle = option.fillColor;
				this.context.fillText(string, x, y);
				break;
			case TEXTMODE.STROKE:
				this.context.strokeStyle = option.strokeColor;
				this.context.strokeText(string, x, y);
				break;
			case TEXTMODE.FILLSTROKE:
				this.context.fillStyle = option.fillColor;
				this.context.fillText(string, x, y);
				this.context.strokeStyle = option.strokeColor;
				this.context.strokeText(string, x, y);
				break;
		}
	},
	drawText: function(textObj)	{
		var option = {
			shadowColor: textObj.shadowColor,
			shadowBlur: textObj.shadowBlur,
			shadowOffsetX: textObj.shadowOffsetX,
			shadowOffsetY: textObj.shadowOffsetY,
			style: textObj.style,
			weight: textObj.weight,
			size: textObj.size,
			face: textObj.face,
			mode: textObj.mode,
			fillColor: textObj.fillColor,
			strokeColor: textObj.strokeColor,
		};
	
		this.drawString(textObj.value,textObj.posX,textObj.posY,option);
	},
	drawLine: function(sx,sy,ex,ey,width,color)	{
		this.context.strokeStyle = color;
		this.context.lineWidth = width;
		this.context.beginPath();
		this.context.moveTo(sx,sy);
		this.context.lineTo(ex,ey);
		this.context.stroke();
	},
	drawCircle: function(cX,cY,radius,width)	{
		this.context.beginPath();
		this.context.arc(cX, cY, radius, 0, 2 * Math.PI, false);
		this.context.fillStyle = 'green';
		this.context.fill();
		this.context.lineWidth = width;
		this.context.stroke();
	},
	clearRect: function(x, y, width, height) {
		if(this.context!=null)	
			this.context.clearRect(x, y, width, height);	
	},	// 객체 크기 변환
	drawRect: function(x, y, width, height,rgba)	{
		this.context.fillStyle = 'rgba('+rgba.r+','+rgba.g+','+rgba.b+','+rgba.a+')';
		this.context.fillRect(x, y, width, height);
	},
	drawSprite: function(sprite,x,y){
		sprite.draw(this.context,x,y);
	},
	clearScene: function() {
		this.clearRect(0,0,Goblin.Scene.sceneWidth,Goblin.Scene.sceneHeight);
	}
};