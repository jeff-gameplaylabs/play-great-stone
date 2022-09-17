/**
 * SystemInfo.js
 * Check running system environment information
 * @author Hyunseok Oh
 */
var SystemInfo = {
	platform: null,		// service platform type
	browser: null,		// browser engine type
	screenWidth: null,
	screenHeight: null,
	resolution: null,
	orientation: null,
	canvas: null,
	touch: null,
	webgl: null,
	audio: null,
	cordova: false,
	/**
	 * Check screen size
	 */
	checkDeviceScreen: function() {
		if(this.platform == 'pc')	{
			this.screenWidth = 1024;
			this.screenHeight = 768;
		} else {
			this.screenWidth = window.innerWidth;
			this.screenHeight = window.innerHeight;	
		}
	},
	/**
	 * Check screen resolution
	 */
	checkResolution: function() {
		this.resolution = this.screenWidth/this.screenHeight; 
	},
	/**
	 * Check screen orientation
	 */
	checkOrientation:function() {
		if(this.resolution < 1)
			this.orientation = 'portrait';
		else
			this.orientation = 'landscape';
	},
	/**
	 * Check HTML5 technology
	 */
	checkHTML5:function() {
		this.canvas = Modernizr.canvas;
		this.touch = Modernizr.touch;
		this.webgl = Modernizr.webgl;
		this.audio = Modernizr.audio;
	},
	/**
	 * Check System Information
	 */
	checkSystem: function() {
		// check platform
		if(navigator.userAgent.match(/Android/i) != null) this.platform = 'android';
		else if(navigator.userAgent.match(/iphone/i) != null) this.platform = 'iphone';
		else if(navigator.userAgent.match(/ipod/i) != null) this.platform = 'ipod';
		else if(navigator.userAgent.match(/ipad/i) != null) this.platform = 'ipad';
		else this.platform = 'pc';
		
		// check browser
		if(navigator.userAgent.match(/trident/i) != null) this.browser = 'trident';
		else if(navigator.userAgent.match(/webkit/i) != null) this.browser = 'webkit';
		else if(navigator.userAgent.match(/gecko/i) != null) this.browser = 'gecko';
		else if(navigator.userAgent.match(/presto/i) != null) this.browser = 'presto';

		// check etc.
		this.checkDeviceScreen();
		this.checkResolution();
		this.checkOrientation();
		this.checkHTML5();
		
		// log
		console.log('********************************************');
		console.log('** System Information');
		console.log('********************************************');
		console.log('** Service platform : ' + this.platform);
		console.log('** Browser engine : ' + this.browser);
		console.log('** Screen size : (' + this.screenWidth + ', ' + this.screenHeight +')');
		console.log('** Screen resolution : ' + this.orientation);
		if(this.canvas) console.log('** This browser support HTML5 Canvas');
		else console.log('** This browser cannot support HTML5 Canvas');
		if(this.touch) console.log('** This browser support HTML5 Touch Event');
		else console.log('** This browser cannot support HTML5 Touch Event');
		if(this.webgl) console.log('** This browser support HTML5 webgl');
		else console.log('** This browser cannot support HTML5 webgl');
		if(this.audio) console.log('** This browser support HTML5 Audio');
		else console.log('** This browser cannot support HTML5 Audio');
		console.log('********************************************');
	}
};