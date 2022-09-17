/**
 * ObjManager.js
 * Manage Game Object
 * @author Hyunseok Oh
 */
var ObjManager = {
	createSprite: function(asset) {
		var sprite = new ObjSprite(asset);
		return sprite;
	},
	createButton: function(btnInfo) {
		var button = new ObjButton(btnInfo);
		return button;
	}
};