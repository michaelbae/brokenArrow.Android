var SoundControl = (function (window) {
	var audioPath = "sound/";
	var manifest = [
		{id : "Shot", src : audioPath + "Game-Shot.mp3|" + audioPath + "Game-Shot.ogg"}, 
		{id : "Death", src : audioPath + "Game-Death.mp3|" + audioPath + "Game-Death.ogg"}, 
		{id : "Break", src : audioPath + "Game-Break.mp3|" + audioPath + "Game-Break.ogg"},
		{id : "BG", src : audioPath + "Game-BG.mp3|"+audioPath + "Game-BG.ogg"},
		{id : "Start", src : audioPath + "Game-Start.mp3|"+audioPath + "Game-Start.ogg"}
	];
	
	function init() {


		//createjs.Sound.addEventListener("loadComplete", handleSoundLoad);
		//createjs.Sound.registerManifest(manifest);

		queue = new createjs.LoadQueue();
		queue.installPlugin(createjs.Sound);
		queue.addEventListener("complete", handleSoundLoad);
		queue.addEventListener("error", handleSoundError);
		//queue.addEventListener("progress",handleProgress);
		queue.loadManifest(manifest);
	}
	
	function handleSoundLoad(){
		new Main();
	}
	
	function handleSoundError(o){
		console.log("error" + o);
	}
	
	function play(name){
		if (name == "BG") {
			var bgPlaying = false;
			createjs.Sound.instances.forEach((function (o) {
					if (o.src == SoundControl.MANIFEST[3].src)
						bgPlaying = true;
				}))
			if (!bgPlaying) {
				createjs.Sound.play(name);
			}
		} else {
			createjs.Sound.play(name);
		}
	}
	
	function volume(number){
		//1 highest 0.5 half etc
		createjs.Sound.setVolume(number);
	}
	
	function mute (bool){
		//true = mute, false = unmute;
		createjs.Sound.setMute(bool);
	}
	function stop (){
		createjs.Sound.stop();
	}

	init();
	
	
	return {
		MANIFEST: manifest,
		play: play,
		volume: volume,
		mute: mute,
		stop: stop
	}
	
	
	
	//window.SoundControl.MANIFEST = manifest;
	//window.SoundControl.play = play;

}(window));

