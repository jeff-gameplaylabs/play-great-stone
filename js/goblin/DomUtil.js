/**
 * DomUtil.js
 * Class DOM Control Utility
 * @author Hyunseok Oh
 */

var DomUtil = {
	createDiv: function(id) {
		var div = document.createElement('div');
		div.id = id;
		return div;
	},
	createCanvas: function(id,width,height) {
		var canvas = document.createElement('canvas');
		canvas.id = id;
		canvas.width = width;
		canvas.height = height;
		return canvas;
	},
	createVideo: function(id,width,height){
		var video = document.createElement('video');
		video.id = id;
		video.width = width;
		video.height = height;
		return video;	
	},
};