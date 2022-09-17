/**
 * SoundManager.js
 * SoundManager Class
 * @author Hyunseok Oh
 */

var SoundManager = {
	isBgmOnOff: true,
	isEffectOnOff: true,
	isSupportedLoop: false,
	currentBgmId: null,
	oldBgmId: null,
	currentEffectId: null,
	sounds: {},
	
	initialize: function() {
		this.isBgmOnOff = true;
		this.isEffectOnOff = true;
		this.isSupportedLoop = false;
		this.currentBgmId = null;
		this.oldBgmId = null;
		this.currentEffectId = null;
		this.sounds = {};
	},
	
	createSound: function (id) {
		this.sounds[id] = new Audio();
		return this.sounds[id];
	},
	
	createCordovaSound: function (id,src) {
		if(Goblin.System.platform == 'android') {
			var cordovasrc = src.replace('./','/android_asset/www/');	
		} else {
			var cordovasrc = src;
		}
		
		this.sounds[id] = new Media(cordovasrc);
	},
	
	getSound: function (id) {
    	return this.sounds[id];
	},
	
	getSupportedAudioFormat: function () {
    	var audio = new Audio();
    	var arrAudioFormat = [["audio/mpeg", "mp3"], ["audio/ogg", "ogg"], ["audio/wav", "wav"]];
    	var audioType = "";
    	for (var i = 0 ; i < arrAudioFormat.length ; i++) {
	        if (audio.canPlayType(arrAudioFormat[i][0]) == "probably" || audio.canPlayType(arrAudioFormat[i][0]) == "maybe") {
    	        audioType = arrAudioFormat[i][1];
            	break;
        	}
    	}
    	//loop 사운드 지원 여부 설정
    	this.isSupportedLoop = (typeof audio.loop == "undefined") ? false : true;

    	arrAudioFormat = null;
    	audio = null;
    	console.log("SoundManager::This browser supports the " + audioType + " sound format. Audio loop flag is " + this.isSupportedLoop);
    	return audioType;
	},
	
	play: function (id) {
    	//console.log("SoundManager::play(" + id + ")");
    	if (this.isEffectOnOff == false) return;
    	try {
			if(Goblin.Cordova) {
    			this.sounds[id].stop();	
        		this.sounds[id].play();
    		} else {
    			Goblin.Sound.stop(id);
    			if(SystemInfo.browser == 'webkit') {
    				this.sounds[id].load();	
	  			}
        		this.sounds[id].play();
    		}
    	}
    	catch (e) { console.log("SoundManager::play():: error=" + e); }
	},
	
	stop: function (id) {
    	//console.log("SoundManager::stop(" + id + ")");
	    try {
	    	if(Goblin.Cordova) {
	    		if (this.sounds[id]) {
              		this.sounds[id].stop();
            	}
	    	} else {
	    		this.sounds[id].pause();
	    		if (typeof (this.sounds[id].currentTime) == "number") this.sounds[id].currentTime = 0;	
	    	}
	    }
	    catch (e) { 
	    //	console.log("SoundManager::stop():: error=" + e); 
	    }
	},
	
	playBgm: function (id) {
	    console.log("SoundManager::playBgm(" + id + ")");
	    //Bgm 사운드 오프이거나, Bgm 사운드 온 상태에서 현재 Bgm 사운드와 새롭게 재생할 Bgm 사운드가 동일하면 바로 리턴
	    if (this.isBgmOnOff == false || (this.isBgmOnOff && this.currentBgmId == id)) return;
	    this.stopBgm();//먼저 재생되고 있는 Bgm이 있을 경우 멈춤
	    if(Goblin.Cordova) {
	    	this.sounds[id].stop();	
        	this.sounds[id].play();
        	this.currentBgmId = id;
	    } else {
	    	this.stopBgm();//먼저 재생되고 있는 Bgm이 있을 경우 멈춤
		    try {
		        if (this.isSupportedLoop) this.sounds[id].loop = true;
		        else this.sounds[id].addEventListener("ended", SoundManager.onPlay, false);
		        
		        this.play(id);
		        this.currentBgmId = id;
		    }
		    catch (e) { console.log("SoundManager::playBgm():: error=" + e); }	
		}
	},
	
	stopBgm: function () {
    	console.log("SoundManager::stopBgm(" + this.currentBgmId + ")");
	    if (this.currentBgmId != null) {
	        this.stop(this.currentBgmId);
	        this.currentBgmId = null;
	    }
	},
	
	onPlay: function (e) {
  		console.log("SoundManager::onPlay(" + this.currentBgmId + "):: Bgm replay after ended event.");
	    if (this.isBgmOnOff) this.play(this.currentBgmId);
	},
	
	pause: function (id) {
  		this.sounds[id].pause();
	},
	
	mute: function (id) {
    	this.sounds[id].muted = this.sounds[id].muted ? false : true;
	},
	
	setVolume: function (id, vol) {
 	   this.sounds[id].volume = vol;
	},
	
	toggleBgmSoundOnOff: function () {
	    if (this.isBgmOnOff) {
	        this.isBgmOnOff = false;
	        this.oldBgmId = this.currentBgmId;
	        this.stopBgm();
	    }
	    else {
	        this.isBgmOnOff = true;
	        this.playBgm(this.oldBgmId);
	    };
	    console.log("SoundManager::toggleBgmSoundOnOff()::currentBgmId=" + this.currentBgmId + ", isBgmOnOff=" + this.isBgmOnOff);
	},
	
	isBgmSoundOnOff: function () {
    	return this.isBgmOnOff;
	},
	
	toggleEffectSoundOnOff: function () {
 		this.isEffectOnOff = (this.isEffectOnOff) ? false : true;
    	console.log("SoundManager::toggleEffectSoundOnOff()::isEffectOnOff=" + this.isEffectOnOff);
	},
	
	isEffectSoundOnOff: function () {
 		return this.isEffectOnOff;
	},
	
	cleanUp: function () {
	}
};


/*
//SoundFile.json
Data.SoundFile = {"Id14":{"name":"anim_propose_large_m_01.mp3","path":"./sound/"},"Id15":{"name":"anim_propose_small_f_01.mp3","path":"./sound/"},"Id12":{"name":"anim_hover_small_m_01.mp3","path":"./sound/"},"Id13":{"name":"anim_propose_large_f_01.mp3","path":"./sound/"},"Id10":{"name":"anim_hover_large_m_01.mp3","path":"./sound/"},"Id11":{"name":"anim_hover_small_f_01.mp3","path":"./sound/"},"Id96":{"name":"ui_getfood_02.mp3","path":"./sound/"},"Id97":{"name":"ui_getruby_01.mp3","path":"./sound/"},"Id98":{"name":"ui_getruby_01b.mp3","path":"./sound/"},"Id99":{"name":"ui_getruby_01c.mp3","path":"./sound/"},"Id92":{"name":"ui_click_05.mp3","path":"./sound/"},"Id93":{"name":"ui_click_05b.mp3","path":"./sound/"},"Id94":{"name":"ui_click_05c.mp3","path":"./sound/"},"Id95":{"name":"ui_getfood_01.mp3","path":"./sound/"},"Id90":{"name":"ui_click_03.mp3","path":"./sound/"},"Id91":{"name":"ui_click_04.mp3","path":"./sound/"},"Id23":{"name":"anim_select_hippo_f_01.mp3","path":"./sound/"},"Id24":{"name":"anim_select_hippo_m_01.mp3","path":"./sound/"},"Id25":{"name":"anim_select_lion_f_01.mp3","path":"./sound/"},"Id26":{"name":"anim_select_lion_m_01.mp3","path":"./sound/"},"Id20":{"name":"anim_select_donkey_m_01.mp3","path":"./sound/"},"Id21":{"name":"anim_select_fox_f_01.mp3","path":"./sound/"},"Id22":{"name":"anim_select_fox_m_01.mp3","path":"./sound/"},"Id17":{"name":"anim_select_bear_f_01.mp3","path":"./sound/"},"Id16":{"name":"anim_propose_small_m_01.mp3","path":"./sound/"},"Id19":{"name":"anim_select_donkey_f_01.mp3","path":"./sound/"},"Id18":{"name":"anim_select_bear_m_01.mp3","path":"./sound/"},"Id32":{"name":"baby_select_bear_c_01.mp3","path":"./sound/"},"Id33":{"name":"baby_select_donkey_c_01.mp3","path":"./sound/"},"Id30":{"name":"baby_happy_common_c_01.mp3","path":"./sound/"},"Id31":{"name":"baby_hover_common_c_01.mp3","path":"./sound/"},"Id36":{"name":"baby_select_lion_c_01.mp3","path":"./sound/"},"Id37":{"name":"baby_select_monkey_c_01.mp3","path":"./sound/"},"Id34":{"name":"baby_select_fox_c_01.mp3","path":"./sound/"},"Id35":{"name":"baby_select_hippo_c_01.mp3","path":"./sound/"},"Id29":{"name":"baby_feed_common_c_01.mp3","path":"./sound/"},"Id28":{"name":"anim_select_monkey_m_01.mp3","path":"./sound/"},"Id27":{"name":"anim_select_monkey_f_01.mp3","path":"./sound/"},"Id41":{"name":"bgm_04.mp3","path":"./sound/"},"Id42":{"name":"bgm_05.mp3","path":"./sound/"},"Id43":{"name":"btl_attack_common_01.mp3","path":"./sound/"},"Id44":{"name":"btl_attack_common_02.mp3","path":"./sound/"},"Id45":{"name":"btl_attack_common_03.mp3","path":"./sound/"},"Id46":{"name":"btl_attack_common_04.mp3","path":"./sound/"},"Id47":{"name":"btl_attack_common_05.mp3","path":"./sound/"},"Id48":{"name":"btl_attack_common_06.mp3","path":"./sound/"},"Id40":{"name":"bgm_03.mp3","path":"./sound/"},"Id39":{"name":"bgm_02.mp3","path":"./sound/"},"Id38":{"name":"bgm_01.mp3","path":"./sound/"},"Id49":{"name":"btl_attack_common_07.mp3","path":"./sound/"},"Id4":{"name":"anim_farm_small_m_01.mp3","path":"./sound/"},"Id3":{"name":"anim_farm_small_f_01.mp3","path":"./sound/"},"Id6":{"name":"anim_feed_large_m_01.mp3","path":"./sound/"},"Id51":{"name":"btl_attack_common_09.mp3","path":"./sound/"},"Id5":{"name":"anim_feed_large_f_01.mp3","path":"./sound/"},"Id50":{"name":"btl_attack_common_08.mp3","path":"./sound/"},"Id8":{"name":"anim_feed_small_m_01.mp3","path":"./sound/"},"Id7":{"name":"anim_feed_small_f_01.mp3","path":"./sound/"},"Id9":{"name":"anim_hover_large_f_01.mp3","path":"./sound/"},"Id57":{"name":"btl_attack_common_15.mp3","path":"./sound/"},"Id56":{"name":"btl_attack_common_14.mp3","path":"./sound/"},"Id59":{"name":"btl_attack_common_17.mp3","path":"./sound/"},"Id58":{"name":"btl_attack_common_16.mp3","path":"./sound/"},"Id53":{"name":"btl_attack_common_11.mp3","path":"./sound/"},"Id52":{"name":"btl_attack_common_10.mp3","path":"./sound/"},"Id2":{"name":"anim_farm_large_m_01.mp3","path":"./sound/"},"Id55":{"name":"btl_attack_common_13.mp3","path":"./sound/"},"Id1":{"name":"anim_farm_large_f_01.mp3","path":"./sound/"},"Id54":{"name":"btl_attack_common_12.mp3","path":"./sound/"},"Id103":{"name":"ui_warning_01.mp3","path":"./sound/"},"Id102":{"name":"ui_levelup_01.mp3","path":"./sound/"},"Id104":{"name":"ui_warning_02.mp3","path":"./sound/"},"Id101":{"name":"ui_getruby_01e.mp3","path":"./sound/"},"Id100":{"name":"ui_getruby_01d.mp3","path":"./sound/"},"Id62":{"name":"btl_charge_animal_f_01.mp3","path":"./sound/"},"Id61":{"name":"btl_avoid_01.mp3","path":"./sound/"},"Id60":{"name":"btl_attack_common_18.mp3","path":"./sound/"},"Id69":{"name":"btl_move_dragon_01.mp3","path":"./sound/"},"Id68":{"name":"btl_move_common_03.mp3","path":"./sound/"},"Id67":{"name":"btl_move_common_02.mp3","path":"./sound/"},"Id66":{"name":"btl_move_common_01.mp3","path":"./sound/"},"Id65":{"name":"btl_guard_01.mp3","path":"./sound/"},"Id64":{"name":"btl_charge_monster_01.mp3","path":"./sound/"},"Id63":{"name":"btl_charge_animal_m_01.mp3","path":"./sound/"},"Id71":{"name":"eft_buildingupgrade_01.mp3","path":"./sound/"},"Id70":{"name":"btl_move_golem_01.mp3","path":"./sound/"},"Id73":{"name":"eft_farmingfinish_01.mp3","path":"./sound/"},"Id72":{"name":"eft_drop_common_01.mp3","path":"./sound/"},"Id75":{"name":"eft_select_common_01.mp3","path":"./sound/"},"Id74":{"name":"eft_matingstart_01.mp3","path":"./sound/"},"Id77":{"name":"farm_select_01.mp3","path":"./sound/"},"Id76":{"name":"eft_sellbuilding_01.mp3","path":"./sound/"},"Id79":{"name":"hab_select_common_01.mp3","path":"./sound/"},"Id78":{"name":"farm_select_02.mp3","path":"./sound/"},"Id80":{"name":"hab_select_common_02.mp3","path":"./sound/"},"Id84":{"name":"obs_select_common_02.mp3","path":"./sound/"},"Id83":{"name":"obs_select_common_01.mp3","path":"./sound/"},"Id82":{"name":"mine_select_02.mp3","path":"./sound/"},"Id81":{"name":"mine_select_01.mp3","path":"./sound/"},"Id88":{"name":"ui_click_01.mp3","path":"./sound/"},"Id87":{"name":"tav_select_02.mp3","path":"./sound/"},"Id86":{"name":"tav_select_01.mp3","path":"./sound/"},"Id85":{"name":"obs_select_common_02b.mp3","path":"./sound/"},"Id89":{"name":"ui_click_02.mp3","path":"./sound/"}};*/