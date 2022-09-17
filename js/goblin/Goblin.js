/**
 * Goblin.js - A shrewd HTML5 framework for game development
 * @author Hyunseok Oh
 */

var Goblin = {
	Core: Core,
	Dom: DomUtil,
	System: SystemInfo,
	Asset: AssetManager,
	Scene: SceneManager,
	Network: NetManager,
	Graphics: GraphicContext,
	Math: Mathematics,
	Physics: null,
	Object: ObjManager,
	Effect: EffectTrigger,
	Sound: SoundManager,
	Video: VideoManager,
	Cordova: false,
/**
 * Goblin.js Game Entry Point
 */
	initialize: function()	{	
		SystemInfo.checkSystem();
		if(!SystemInfo.canvas)	{
			alert('Please install a new web browser.');
			return;
		}
		
		// log
		console.log('** Start Goblin.js v0.1.0');
		
		// Initialize Manager
		SceneManager.initialize();
		AssetManager.initialize();
		SoundManager.initialize();
		NetManager.initialize();
	},
};

/**
 * Goblin.js Engine Start
 */
function GoblinStart()
{
	Goblin.initialize();				// Engine initialize
	StateManager.initialize();			// StateManager initialize
};

document.addEventListener("pause", onPause, false);

function onPause() {
	if(SoundManager.currentBgmId != null)
		SoundManager.sounds[SoundManager.currentBgmId].pause();
    _state.pause();
}

document.addEventListener("resume", onResume, false);

function onResume() {
	if(SoundManager.currentBgmId != null)
		SoundManager.sounds[SoundManager.currentBgmId].play();
    _state.run();
}