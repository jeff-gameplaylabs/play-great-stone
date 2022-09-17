/**
 * @author Taehong Jeremy Jeong
 * @class GoblinVideo
 * @input
 *  argo.id : String
 *  argo.controls : boolean
 *  argo.loop : boolean
 *  argo.width : Number or String
 *  argo.height : Number or String
 *  argo.srcList : Array
 * @output
 *  this : GoblinVideo
 *  this.getDOM() : HTML5 Video Element
 * @note
 *  Using jQuery
 */
function GoblinVideo(argo) {
	var dom = document.createElement('video');
	if (argo !== undefined) {
		// Setting attributes
		if (argo.id !== undefined)
			dom.id = argo.id;
		if (argo.width !== undefined)
			dom.width = argo.width;
		if (argo.height !== undefined)
			dom.height = argo.height;
		if (argo.controls !== undefined)
			dom.controls = argo.controls;
		if (argo.loop !== undefined)
			dom.loop = argo.loop;
		// Appending sources
		if (argo.srcList !== undefined)
			argo.srcList.forEach(function(elem) {
				var sourceDOM = document.createElement('source');
				sourceDOM.src = elem.src;
				sourceDOM.type = elem.type;
				dom.appendChild(sourceDOM);
			});
	}
	this.m_dom = dom;
}

GoblinVideo.prototype.setAttr = function(attr, value) {
	this.m_dom[attr] = value;
	return this;
};
GoblinVideo.prototype.getDOM = function() {
	return this.m_dom;
};
GoblinVideo.prototype.appendTo = function(selector) {
	var target = $(selector), dom = this.getDOM();
	target.each(function(index, elem) {
		elem.appendChild(dom);
	});
};
GoblinVideo.prototype.remove = function() {
	$('#' + this.getDOM().id).remove();
	return this;
};
GoblinVideo.prototype.play = function() {
	this.getDOM().play();
	return this;
};
GoblinVideo.prototype.pause = function() {
	this.getDOM().pause();
	return this;
};
GoblinVideo.prototype.setStyle = function(attr, value) {
	var dom = this.getDOM();
	dom.style[attr] = value;
	return this;
};
GoblinVideo.prototype.setPosition = function(left, top) {
	return this.setStyle('position', 'absolute').setStyle('left', left + 'px').setStyle('top', top + 'px');
};
GoblinVideo.prototype.setSize = function(width, height) {
	return this.setStyle('width', width + 'px').setStyle('height', height + 'px');
};

/**
 * VideoManager.js
 */
var VideoManager = {
	video : {},
	create : function(id, width, height, srcList, controls, loop) {
		var argo = {
			id : id,
			width : width,
			height : height,
			srcList : srcList,
			controls : controls,
			loop : loop
		};
		return VideoManager.video[argo.id] = new GoblinVideo(argo);
	},
	get : function(id) {
		return VideoManager.video[id];
	},
	setAttr : function(id, attr, value) {
		var video = VideoManager.get(id);
		if (video !== undefined)
			return video.setAttr(attr, value);
	},
	show : function(id, selector) {
		var video = VideoManager.get(id);
		if (video)
		
			return video.appendTo(selector);
	},
	hide : function(id) {
		var video = VideoManager.get(id);
		if (video)
			return video.remove();
	},
	play : function(id) {
		var video = VideoManager.get(id);
		if (video)
			return video.play();
	},
	pause : function(id) {
		var video = VideoManager.get(id);
		if (video)
			return video.pause();
	},
	setPosition : function(id, left, top) {
		var video = VideoManager.get(id);
		if (video)
			return video.setPosition(left, top);
	},
	setSize : function(id, width, height) {
		var video = VideoManager.get(id);
		if (video)
			return video.setSize(width, height);
	}
};