// ====================
// Controllers Package
// ====================
/*
	These classes build objects which control either animation 
	or consditional (testing) instances
*/

//========================================
// SceneController
//----------------------------------------
/*
	================
	CONSTRUCTOR
	================

	SceneController( options )
	-----------------------------------

		options:object
		--------------------------
			- restrict:boolean
				-- when set to true and a ScrubBar is bound to this controller, 
					the scrubber of ScrubBar the will not be draggabble past the
					most recently viewed portion of the timeline.
			- scene:Scene
				-- The Scene instance you want to intially control on contruction. 
					Only one Scene instance can be controlled by a controller at a time.
			- audioController
				-- TODO


	================
	METHODS
	================

	kill, play, pause, restart, gotoAndPlay, gotoAndStop
	---------------------------------------------------------------------------------------
	These are identical to the methods on the Scene class/GSAPObject class.
	These methods will affect the scene the controller is currently controlling.

	duration()
	---------------------------------------------------------------------------------------
	returns the duration of the Scene instance the controller is assigned

	bind( group )
	---------------------------------------------------------------------------------------
	assigns DOM elements to the controller that will provide control and feedback to the user.

		- group:object
		-------------------------------------
			-- scrub:object
				--- You can bind a ScrubBar instance to this controller, that will give the user
					graphical control over the scenes playback.

			-- toggle:string
				--- a toggle is a form of a play button that is also the restart button and pause button.
					The DOM element associated with the CSS selector string should be formatted as such:

						<div id='toggle-btn'>
							<div class="active play"></div>
							<div class="inactive pause"></div>
						</div>

					The controller will determine which div will be assigned the class 'active' or 'inactive' at what state of playback.
					You can use any DOM elements, not just divs.
					You can have any additonal classes you want on your DOM elements.
					You can name your 'toggle-btn' whatever you want, just make sure it is bound by id, not class.

			-- restart:string
				--- also a button, hoever if you want the toggle to be the restart you can do that by simply restaing the toggle div.
					Make sure to reflect this in oyur toggle buttons structure, example below.

						<div id='toggle-btn'>
							<div class="active play"></div>
							<div class="inactive pause"></div>
							<div class="inactive restart"></div>
						</div>

			-- audio:string
				--- also a button, it toggles the muted state of any soundtrack associated with the controller.

					Example Markup:

						<div id='audio-btn' class='wc-dock-toggle'>
							<div class='sound-on fa fa-volume-up'></div>
							<div class='sound-off fa fa-volume-off'></div>
						</div>


	init( paused, callback )
	--------------------------------------------------------------
	Executing this function starts the controller, in other words it tells the controller to start
	'watching' the scene it is controlling and set the appropriate states it is responsible for.

		-- paused:boolean
			--- setting to true prevents the scene from playing immediatley.
		-- callback:function
			--- a function to be fired when you execute this init()

	
	swap( scene, paused )
	-----------------------------------------------------------------
	Executing this function 'swaps' out the previous scene the controller is 'watching'/'controling'
	and replaces it with the desired scene, it can also pause any intial playback.

		-- scene:Scene/GSAPObject
		-- paused:boolean


	load( container, src, scene, options )
	-----------------------------------------------------------------
	This method is best used in conjunction with ModuleController, however you can use it without

		-- container:string
			--- the DOM element the src should be loaded into.
		-- src:string
			--- an html document containing DOM elements and a scene
		-- scene:Scene/GSAPObject
			--- a Scene instance that will be called upon after loading the src file into the container
		
		-- options:object
		-----------------------------------------------------------------------------------------
			-- callback:function
				--- executes after the src and scene have been loaded.

*/

function SceneController(options){

	var restrict,
		thisScene,
		q;

	if(options !== undefined){
		restrict = (options.restrict !== undefined) ? true : false;
		thisScene = (options.scene !== undefined) ? options.scene : undefined ;
		audio = (options.audioController) ? options.audioController : undefined; 
	}

	q = {

		// internal states
		_loading:false,

		// object references
		scene:thisScene,
		controller:undefined,
		progressBar:undefined,
		toggleTrigger:undefined,
		playTrigger:undefined,
		audioTrigger:undefined,

		// timeline status - numerical
		progress:0,
		totalProgress:0,
		time:0,
		change:true,
		userAction:false, // conditional that determines if user action is required before the scene can be marked complete.

		// timeline status - booleans
		completed:false, // helps keep interval from firing functions redundantly.
		never_completed:true,
		bounds_maxed:false, // keeps more functions from firing redundantly in the interval.

		// interval slot
		interval:undefined,

		//events
		onLoad:function(){},
		onReady:function(){},

		//media
		audioController:audio,
		audioFile:undefined
	};

	function disableController(){

		var i,k;
		
		if(q.controller !== undefined){
			if(q.controller.trigger_next !== undefined){
				q.controller.trigger_next.disable();
			}

			if(q.controller.trigger_back !== undefined){
				q.controller.trigger_back.disable();
			}

			if(q.controller.doneTrigger !== undefined){
				q.controller.doneTrigger.disable();
			}

			if(q.controller.list.length > 0){
				for( i = 0, k=q.controller.list.length ; i<k ; i++){
					q.controller.list[i].item.disable();
				}
			}
		}

		if(q.playTrigger !== undefined){
			q.playTrigger.disable();
		}

		if(q.toggleTrigger !== undefined){
			q.toggleTrigger.disable();
		}

		if(q.audioTrigger !== undefined){
			q.audioTrigger.disable();
		}
	}

	function enableController(){

		var i,k;
		
		if(q.controller !== undefined){
			if(q.controller.trigger_next !== undefined){
				q.controller.trigger_next.enable();
			}

			if(q.controller.trigger_back !== undefined){
				q.controller.trigger_back.enable();
			}

			if(q.controller.doneTrigger !== undefined){
				q.controller.doneTrigger.enable();
			}

			if(q.controller.list.length > 0){
				for( i = 0, k=q.controller.list.length ; i<k ; i++){
					q.controller.list[i].item.enable();
				}
			}
		}

		if(q.playTrigger !== undefined){
			q.playTrigger.enable();
		}

		if(q.toggleTrigger !== undefined){
			q.toggleTrigger.enable();
		}

		if(q.audioTrigger !== undefined){
			q.audioTrigger.enable();
		}
	}

	// -----------------------------------------------------------
	// GSAP methods
	/* 
		The following provide shortcuts to native TimelineMax 
		methods affecting to the controllers scene object
	*/
	q.kill = function(){
		//https://greensock.com/docs/#/HTML5/GSAP/TimelineMax/kill/
		this.scene.kill(arguments);
		this.change = true;

		if(q.audioController !== undefined){ q.audioController.stopAll(); }
	};

	q.play = function(sync){

		//https://greensock.com/docs/#/HTML5/GSAP/TimelineMax/play/
		if(q.audioController !== undefined){
			q.audioController.unmute(q.controller.audioID);
			q.audioController.resume(q.controller.audioID);
			q.stopped = false;
			q.scene.play(sync);
			q.change = true;
		}else{
			q.stopped = false;
			q.scene.play(sync);
			q.change = true;
		}
	};

	q.pause = function(){

		//https://greensock.com/docs/#/HTML5/GSAP/TimelineMax/pause/
		if(q.scene.progress() > 0 && q.scene.progress() < 1){
			this.stopped = true;
			this.scene.pause();
			this.change = true;
		}
	};

	q.restart = function(play){
		//https://greensock.com/docs/#/HTML5/GSAP/TimelineMax/restart/
		this.scene.restart();
		this.change = true;

		if(play !== undefined){
			if(play === true){	this.play(); }else if(play === false){ this.pause(); }else{ this.play(play); }
		}else{
			this.play();
		}
	};

	// Methods that mimic common Flash events
	q.gotoAndPlay = function(seconds){
		
		this.scene.timeline.seek(seconds);
		this.scene.play();
		this.change = true;
	};

	q.gotoAndStop = function(seconds){

		this.scene.timeline.seek(seconds);
		this.scene.pause();
		this.change = true;
	};

	// --------------------------------------------------------
	// Accessors
	q.duration = function(){
		return q.scene.duration();
	};

	// --------------------------------------------------------
	// bind objects that will be controlled by this controller

	q.bind = function(group){

		var i;
		
		// Scrubber
		this.progressBar = (group.scrub !== undefined) ? group.scrub :  undefined;

		// if an object is bound, we assume it is a jivemax object.
		for( i in group ){
			switch(i){

				case 'audio':
					if( typeof group[i] !== 'object' ){
						this.audioTrigger = new Button(group[i]);
					}else{
						this.audioTrigger = group[i];
					}
				break;

				case 'toggle':
					if( typeof group[i] !== 'object' ){
						this.toggleTrigger = new Button(group[i]);
					}else{
						this.toggleTrigger = group[i];
					}
				break;

				case 'restart':
					if( typeof group[i] !== 'object' ){
						this.restartTrigger = new Button(group[i]);
					}else{
						this.restartTrigger = group[i];
					}
				break;

				case 'play':
					if( typeof group[i] !== 'object' ){
						this.playTrigger = new Button(group[i]);
					}else{
						this.playTrigger = group[i];
					}
				break;
			}
		}

		// Toggle
		if( this.toggleTrigger !== undefined ){
			this.toggleTrigger.element.onmousedown = (
				function(func,self,scene){
					return function(){
						if(self.active){
							scene.pause();
							self.active = false;
						}else{
							scene.play();
							self.active = true;
						}
						return func.apply(this,arguments);
					};
				}
			)(this.toggleTrigger.element.onmousedown,this.toggleTrigger,this);
		}

		// Play
		if( this.playTrigger !== undefined ){
			this.playTrigger.element.onmousedown = (
				function(func,self,scene){
					return function(){
						
						scene.play();
						self.active = true;
						
						return func.apply(this,arguments);
					};
				}
			)(this.playTrigger.element.onmousedown,this.playTrigger,this);
		}

		console.log(q.playTrigger)

		// Restart
		if( this.restartTrigger !== undefined ){
			this.restartTrigger.element.onmousedown = (
				function(func,self,scene){
					return function(){
						if(scene.progress === 1){
							scene.restart(true); // autoplay
						}
						return func.apply(this,arguments);
					};
				}
			)(this.restartTrigger.element.onmousedown,this.restartTrigger,this);
		}

		// Sound
		if( this.audioTrigger !== undefined){
			this.audioTrigger.element.onmousedown = (
				function(func,self){
					return function(){

						if(q.controller.audioController.muted){
							q.controller.audioController.unmuteAll();
							jQuery(self.element).find('.sound-on').active();
							jQuery(self.element).find('.sound-off').inactive();
							self.active = true;
						}else{
							q.controller.audioController.muteAll();
							jQuery(self.element).find('.sound-on').inactive();
							jQuery(self.element).find('.sound-off').active();
							self.active = false;
						}

						func.call(self);

						console.log(q.controller.audioController.muted);
					};
				}
			)(this.audioTrigger.element.onmousedown, this.audioTrigger);
		}
	};

	// --------------------------------------------------------
	// Refresh the controller

	q.refresh = function(){
		q.completed = false;
		q.progress = 0;
		q.totalProgress = 0;
		q.never_completed = true;
		q.scrubber_pos = 0;
		q.bounds_reached = {top:0,left:0,width:0,height:0};
		//console.log(' --> REFRESH <-- ')
	};

	// ==================================================
	// the main interval that controls everything

	q.init = function(paused,callback){

		var scrubber_width_bias,
			scrubber_width,
			prog_bar_width,
			mouse_is_down;

		// Set some intial variables
		if(this.progressBar !== undefined){	
			scrubber_width = q.progressBar.scrubber.style.width;
			prog_bar_width = q.progressBar.bar.style.width;
			scrubber_width_bias = prog_bar_width-scrubber_width;
			
			q.refresh();
		}

		// BEGIN INTERVAL ================================================================================
		// This interval keeps track of the playback of the GSAP scene and updates the DOM as neccessary.

		this.interval = setInterval(function(){

			if(q.scene.timeline !==undefined && q.scene.timeline.duration() > 0){

				// if a scrub bar has a purpose
				if(q.progressBar){
					if(q._loading === false){
						q.progressBar.scrubber.show();
						q.progressBar.fill.show();
						if(q.toggleTrigger !== undefined) q.toggleTrigger.enable();
						if(q.playTrigger !== undefined) q.playTrigger.enable();
					}else{
						q.progressBar.scrubber.hide();
						q.progressBar.fill.hide();
						if(q.toggleTrigger !== undefined) q.toggleTrigger.disable();
						if(q.playTrigger !== undefined) q.playTrigger.disable();
					}
				}
				if(_ready && !q._loading){


					/* Progress of Timeline */
					q.progress = q.scene.timeline.progress();

					if(q.progressBar !== undefined){ mouse_is_down = q.progressBar.scrubber.dragEngine.isPressed; }
				
					//	audio management
					if(q.audioController !== undefined){

						if(q.scene.timeline._paused){
							q.audioController.pause(q.controller.audioID);
						}

						if(mouse_is_down){
							q.audioController.pause(q.controller.audioID);
							q.audioController.waiting = true;
						}else{
							if(q.audioController.waiting === true){
								var resumeAt = q.audioController.getRelative(q.progress);
								q.audioController.setPosition(q.controller.audioID,resumeAt);
								q.audioController.waiting = false;
								//console.log(resumeAt)
								//console.log(q.audioController.getSoundById(q.controller.audioID).position)
								q.audioController.resume(q.controller.audioID);
							}
						}

					}

					/* check for locked states */
					if(q.progress<1){ checklocks(q.scene); q.completed = false; }


					/* if a progress bar and the playhead is not at the end*/
					if(q.progressBar !== undefined && q.progress<1){

						// Calculate scrubber position
						q.scrubber_pos = q.scene.timeline.totalProgress()*scrubber_width_bias;

						if(restrict){
							if(q.never_completed){
								// If not yet completed
								// --------------------
								if(!mouse_is_down){
						
									if(!q.scene.timeline._paused){
										
										if(q.progress > q.totalProgress){
											q.reached_bounds = {
												top:q.progressBar.scrubber.bounds.top,
												left:q.progressBar.scrubber.bounds.left,
												width:q.scrubber_pos+scrubber_width,
												height:q.progressBar.scrubber.bounds.height
											};
											q.totalProgress = q.progress;
										}

									}
									// set the scrubbers position
									// --------------------------
									TweenMax.set(q.progressBar.scrubber.id,{x:q.scrubber_pos});

								}else{
									
									if(q.progressBar.scrubber.dragEngine.maxX > q.progressBar.scrubber.dragEngine.x){
										q.progressBar.scrubber.dragEngine.applyBounds( q.reached_bounds );
									}
									q.progressBar.scrubber.dragEngine.update();

								}

								if(!q.scene.timeline._paused && q.reached_bounds !== undefined){
									TweenMax.set(q.progressBar.fill.id,{
										width: q.reached_bounds.width
									});
								}

							}else{
								// If completed already
								// --------------------

									q.progressBar.scrubber.dragEngine.applyBounds( q.progressBar.scrubber.bounds );
									TweenMax.set(q.progressBar.fill.id,{ width: prog_bar_width });
									q.progressBar.scrubber.dragEngine.update();
									q.bounds_maxed = true;
								

								// set the scrubbers position
								// --------------------------
								TweenMax.set(q.progressBar.scrubber.id,{x:q.scrubber_pos});
							
							}
						
						}else{
							// set the scrubbers position
							// --------------------------
							TweenMax.set(q.progressBar.scrubber.id,{x:q.scrubber_pos});

							TweenMax.set(q.progressBar.fill.id,{ 
								width: q.scrubber_pos+scrubber_width
							});

						}
					}

					if(q.change){

						q.change = false;
									
						if(q.progress === 1){			

							if(q.toggleTrigger !== undefined){
								jQuery(q.toggleTrigger.element).find('.restart').active();
								jQuery(q.toggleTrigger.element).find('.play').inactive();
								jQuery(q.toggleTrigger.element).find('.pause').inactive();
							}
						
						}else{

							if(q.toggleTrigger !== undefined){
								if(q.toggleTrigger.active){
									jQuery(q.toggleTrigger.element).find('.restart').inactive();
									jQuery(q.toggleTrigger.element).find('.play').inactive();
									jQuery(q.toggleTrigger.element).find('.pause').active();
								}else{
									jQuery(q.toggleTrigger.element).find('.restart').inactive();
									jQuery(q.toggleTrigger.element).find('.play').active();
									jQuery(q.toggleTrigger.element).find('.pause').inactive();
								}
							}

						}
					}

					// --------------------
					// If the scene is over
					// --------------------
					if(q.progress === 1 && !q.completed){

						console.log('-----SCENE COMPLETE-----');
						q.completed = true;
						q.never_completed = false;

						if(q.progressBar !== undefined){
							TweenMax.set(q.progressBar.scrubber.id,{ x: scrubber_width_bias });
							TweenMax.set(q.progressBar.fill.id,{ width: prog_bar_width });
						}

						if(q.toggleTrigger !== undefined){
							jQuery(q.toggleTrigger.element).find('.play').inactive();
							jQuery(q.toggleTrigger.element).find('.pause').inactive();
							jQuery(q.toggleTrigger.element).find('.restart').active();
						}

					}

					// TODO: Fix the jump-lag encountered when dragging scrubber second time.
					// ------------------------------------------------------------------------
					// console.log(q.progressBar.scrubber.dragEngine.x, q.scrubber_pos )

				}

			}else{

				// if the scrub bar serves no purpose
				if(q.progressBar !== undefined){	
					q.progressBar.scrubber.hide();
					q.progressBar.fill.hide();
					if(q.toggleTrigger !== undefined) q.toggleTrigger.disable();
					if(q.playTrigger !== undefined) q.playTrigger.disable();
				}

			}

			if(_ready){
				if(q.controller){
					q.controller.watch();
				}
			}

		}, (1000/100) );

		// END INTERVAL ==============================================
		// ===========================================================
		

		// If it has not started and you desire it to be paused
		// ----------------------------------------------------
		if(paused){
			if(this.progressBar !== undefined){ this.progressBar.stopped = this.stopped = true; }
			if(this.toggleTrigger !== undefined){ this.toggleTrigger.active = true; }
			if(this.playTrigger !== undefined){ this.playTrigger.active = true; }
			this.pause();
		}else{
			if(this.progressBar !== undefined){ this.progressBar.stopped = this.stopped = false; }
			if(this.toggleTrigger !== undefined){ this.toggleTrigger.active = false; }
			if(this.playTrigger !== undefined){ this.playrigger.active = true; }
			this.play();
		}


		// Optional callback
		// -------------------
		if(callback){
			callback();
		}
	};

	// ----------------------------------------------------------------------
	// Switch the scene object being controlled by this controller manually

	q.swap = function(scene,paused){
		q.kill();
		q.scene = scene;
		if(paused){ q.scene.pause(); }else{ q.scene.play(); }
	};

	// --------------------------------------------------------
	// Load a new scene

	q.load = function(container,src,initialScene,options){

		var images;


		function _onReady(){
			console.log('> _onReady')
			enableController();
			q._loading = false;
		}
		
		function _ifReady(){
			console.log('> _ifReady')
			if(_ready){
				TweenMax.fromTo(container,0.3,{opacity:0},{opacity:1, onComplete:_onReady});
				if(parent(options,'onReady')){ options.onReady.call(q,'onReady'); }
				clearInterval(q.waitForReady);
			}
		}

		function _onSuccess(){
			console.log('> _onSuccess')
			
			q.waitForReady = setInterval(_ifReady,500);
			q.scene = q.controller.root[initialScene];
			if(options){ if(options.onLoaded){ options.onLoaded.call(q,'onLoaded'); }}
			
		}

		function _onImagesLoaded(){
			console.log('> _onImagesLoaded')
			if(q.controller){

				// -------------------------------
				// AUDIO
				// -------------------------------
				// The audio loads first, then the scene loads.

				// -----------------------------
				// Module Sound Managment
							
				q.audioFile = q.controller.audioPath+removeDir(removeExt(src))+'.mp3';

				// -----------------------------------
				// Destroy previous scene sound

				if(q.controller.audioController.getSoundById(q.controller.audioID)){
					q.controller.audioController.stopAll();
					q.controller.audioController.destroySound(q.controller.audioID);
				}
				
				q.controller.audioID = removeDir( removeExt(q.audioFile) );
				q.controller.audioController.createSound({
					id:q.controller.audioID,
					url:q.audioFile,
					autoLoad:true,
					autoPlay:false,
					volume:100
				});

				q.controller.audioController.load(q.controller.audioID,{
					onload:function(){
						this.mute();
						this.play();
					},
					onplay:function(){
						_onSuccess();
						this.pause();
					}
				});
			}
		}

		function _onLoad(){
			jQuery(container).empty();
			jQuery(container).load(src,function(){ 
				console.log('> _onLoad')

				// ----------------------------
				// Load all the images

				images = jQuery(this).find('img');

				if(images.length > 0){
					jQuery(images).on('load',function(){
						_onImagesLoaded();
					})
				}else{
					_onImagesLoaded();
				}


			 });

		}


		

		// --------------------------
		// Process starts here

		if(q._loading === false){
			q._loading = true;

			disableController();
			_ready = false;

			if(thisScene !== undefined ){ q.kill(); }
			if(parent(options,'onLoad')){ options.onLoad.call(q,'onLoad'); }
			
			// Fade out the container of our presentation, then call function
			TweenMax.to(container,0.4,{opacity:0, onComplete:_onLoad});

		}

		return this;

	};

	return q;
}

//============================================================
// ModuleController
//------------------------------------------------------------
/*

	Possibly the biggest contructor ever. There is a lot going on here.

	=====================
	CONSTRUCTOR
	=====================

	ModuleController( bind, options, callback )
	---------------------------------------------------------

		options
		--------------------------------------------------------
			- modules:array
			- root:object
			- stage:string
			- moduleTitle:string
			- sceneTitle:string
			- autoPlay:boolean
			- next:string
			- back:string
			- complete:string
			- welcomeMessage:string

			- loader
				-- wrapper:string
				-- spinner:string

			- audioController
				-- type:string
				-- fallbackURL:string
				-- fallbackVersion:number

			- soundEvents
				-- select:string



*/


function ModuleController(bind,options,callback){

	var i = 0,
		j = 0,
		node,
		ajax,
		temp,
		t,
		q = {
		current_module:0,
		scenes:undefined,
		current_scene:0,
		progress:undefined,

		moduleTitle:{ id:undefined },
		sceneTitle:{ id:undefined },

		trigger_next:undefined,
		trigger_back:undefined,
		doneTrigger:undefined,

		storage:{
			scenes:{},
			modules:{}
		},

		list:[]
	};

	// ------------------------------
	// Module Events
	// ------------------------------

	q.onLoad = function(){

		var i;

		// fade out the scene-title
		if(q.scenes !== undefined && q.modules[q.current_module] !== undefined){
			TweenMax.fadeOut(q.sceneTitle.item.id,0.5, function(){
			});
		}

		q.loader.play().show();

		// this makes sure to delete everything before we load the next scene.
		if(typeof _scene === 'undefined'){
		}else{
			for( i in _scene ){
				if(_scene[i]){
					delete _scene[i];
				}
			}
		}
		q.sceneController.refresh();
	};

	q.onReady = function(){

		if(q.storage.scenes.completed){
			/* 
				this checks the controller has stored a complete state for this 
				scene, if it has it will not restrict the users scrubbing ability
			*/

			// we use the filename itself as the id for the scene
			var string = removeDir(q.scenes[q.current_scene].url);
			string = removeExt(string);

			if(q.storage.scenes.completed[string]){
				q.sceneController.never_completed = false;
			}	
		}

		if(q.scenes.length !== 0 && q.modules[q.current_module] !== undefined){
			
			/*
				this assigns new module-title and scene-title to our header based on the json.
				then it animates the scene-title into the scene.
			*/

			if(q.moduleTitle.id !== undefined){
				q.moduleTitle.item = new Text(q.moduleTitle.id,{
					value: q.modules[q.current_module].title
				});
			}

			if(q.sceneTitle.id !== undefined){
				q.sceneTitle.item = new Text(q.sceneTitle.id,{
					value: q.scenes[q.current_scene].title
				});
			}

			q.loader.kill().hide();
			TweenMax.fadeIn(q.sceneTitle.item.id,0.5);

		}

		// you can shut this off through the options object
		if(q.autoPlay === true){ q.sceneController.play(); }

		t = (q.current_scene > 0) ? 'active' : 'inactive';
		jQuery(q.trigger_back.id).addClass(t);

		jQuery(q.trigger_complete.element).inactive();			
	};

	q.completeScene = function(){
		q.sceneController.never_completed = false;
		q.sceneController.completed = true;
		q.sceneController.userAction = false;
	};

	// ------------------------------
	// Navigate Modules
	// ------------------------------

	q.loadModule = function(module){

		j = 0;

		q.completed = false;

		if(q.audioPath === undefined){ q.audioPath = module.audioPath; }
		if(q.audioPath !== undefined && q.audioPath !== module.audioPath ){ q.audioPath = module.audioPath; }

		q.sceneController.load(q.stage,module.url,'_scene',{
											
			onLoad:function(){
				q.onLoad();
				TweenMax.fadeOut(q.moduleTitle.item.id,0.5);
				TweenMax.fadeOut(q.sceneTitle.item.id,0.5);
			},

			onLoaded:function(){

				q.scenes =[];
				TweenMax.fadeIn(q.moduleTitle.item.id,0.5);

				for( j in q.modules[q.current_module]){
					// we need to make sure we only grab valid scene nodes, scenes start with 's'.
					if(String(j).substring(0,1) === 's'){
						q.scenes.push(q.modules[q.current_module][j])
					}
				}

				// Intialize our controller.
				q.sceneController.init(true);

				// Set our soundtrack path
				q.audioPath = module.audioPath;
			
				q.onReady();	

			}

		});
	};

	q.nextModule = function(){

		if(!q._loading && q.current_module >= 0 && q.current_module < q.modules.length-1){
			jQuery(q.trigger_complete.element).inactive();

			// this saves to our storage object and localStorage ( Web Storage ) if available
			createBlock('s', q.scenes[q.current_scene].url,q.storage.scenes,'completed');
			createBlock('m', q.modules[q.current_module].url,q.storage.modules,'completed');

			jQuery(q.list[q.current_module].item.checkbox).complete();

			q.current_module+=1;
			q.current_scene = 0;
			updateModuleList(q.current_module,q);
			q.loadModule(q.modules[q.current_module]);
		}
	};

	// ------------------------------
	// Navigate Scenes
	// ------------------------------

	q.nextScene = function(){

		if(!q._loading && q.current_scene < q.scenes.length-1){
			// store the progress the user made to the scenes[current_scene] object
			q.scenes[q.current_scene].progress = q.sceneController.progress;
			createBlock('s',q.scenes[q.current_scene].url,q.storage.scenes,'completed');

			q.current_scene+=1;
			q.sceneController.load(q.stage,q.scenes[q.current_scene].url,'_scene',{
				onLoad:q.onLoad,
				onReady:q.onReady
			})
		}
	};

	q.previousScene = function(){

		if(!q._loading && q.current_scene > 0){
			// store the progress the user made to the scenes[current_scene] object
			q.scenes[q.current_scene].progress = q.sceneController.progress;

			if(q.scenes[q.current_scene].progress === 1){
				createBlock('s',q.scenes[q.current_scene].url,q.storage.scenes,'completed');
			}

			q.current_scene-=1;
			q.sceneController.load(q.stage,q.scenes[q.current_scene].url,'_scene',{
				onLoad:q.onLoad,
				onReady:q.onReady
			})
		}
	};


	// ------------------------------
	// Watch
	//
	// Triggered with the SceneController's init function, A module cannot exhist without a scene.
	// This does the same thing init does for a scene, but in context with the Module Controller
	// ------------------------------

	q.watch = function(){
		
		var isComplete;

		// ----------------------
		// Show Next Button

		if(q.current_scene < q.scenes.length-1){

			isComplete = checkState(q.scenes[q.current_scene], 'completed');
			//console.log(isComplete, q.sceneController.userAction,q.trigger_next.active)

			if( isComplete && q.sceneController.userAction === false ){
				if(!q.trigger_next.active){
					q.trigger_next.active = true;
					jQuery(q.trigger_next.element).active();
				}
			}else{
				if(q.trigger_next.active){
					q.trigger_next.active = false;
					jQuery(q.trigger_next.element).inactive();
				}
			}
		}else{
			if(q.trigger_next.active){
				q.trigger_next.active = false;
				jQuery(q.trigger_next.element).inactive();
			}
		}

		// ----------------------
		// Show Back Button

		if(q.current_scene > 0){
			if(!q.trigger_back.active){
				q.trigger_back.active = true;
				jQuery(q.trigger_back.element).active();
			}	
		}else{
			if(q.trigger_back.active){
				q.trigger_back.active = false;
				jQuery(q.trigger_back.element).inactive();
			}
		}

		// ----------------------
		// Set Complete
		
		if(q.sceneController.never_completed === false){
			if(q.sceneController.completed && 
				!q.sceneController.userAction){

				isComplete = checkState(q.scenes[q.current_scene], 'completed');

				if(!isComplete){
					//console.log('>>> set complete')
					q.scenes[q.current_scene].completed = true;
				}

			}
		}

		// ----------------------
		// Show Completed Button

		isComplete = checkStates(q.scenes,'completed');

		if(isComplete){
			q.completed = true;
			jQuery(q.trigger_complete.element).active();
		} 
	};

	// -------------------------------------

	function decipherAudioManager(parameters){
		if(parameters !== undefined){
			if(parameters.type === 'soundManager'){

				// GSAP uses relative positioning, so to sync we will need a relative number.
				soundManager.relativePosition = function(){
					return (this.position/this.duration)*100;
				};

				soundManager.getRelative = function(num){
					return this.getSoundById(q.audioID).duration*num;
				};
				//console.log('-----------------------------')
				//console.log('>> decipherAudioManager() <<')
				//console.log(soundManager)

				return soundManager.setup({
							url:parameters.fallbackURL
						});
			}
		}else{
			return undefined;
		}
	}

	if(options !== undefined){
		
		if(options.audioController!== undefined){
			q.audioController = decipherAudioManager( options.audioController );
			q.audioController.waiting = false;

			if(options.soundEvents){
				if(options.soundEvents.select){
					q.audioController.createSound({
						id:'global_select',
						url:options.soundEvents.select,
						autoLoad:true,
						autoPlay:false,
						volume:100
					})
				}
			}

		}

		q.modules = or(undefined,options.modules);
		q.root = or(undefined,options.root);


		if(q.modules === undefined || q.root === undefined){
			console.log('You must include a course object and an array of modules - {modules:[], course:object}');
		}else{

			// ============================================
			// Options
			// --------------------------------------------

			// options variables
			q.autoPlay = (options.autoPlay !== undefined) ? options.autoPlay : false ;

			// options functions
			q.onLoad = or(q.onLoad,options.onLoad);
			q.onReady = or(q.onReady,options.onReady);

			// options bindings
			q.stage = or('#stage',options.stage);
			q.moduleTitle.id = or(undefined,options.moduleTitle);
			q.sceneTitle.id = or(undefined,options.sceneTitle);

			q.moduleTitle.item = or(undefined, new Text(options.moduleTitle));
			q.sceneTitle.item = or(undefined, new Text(options.sceneTitle));

			if(options.back !== undefined){
	
				if(typeof options.back !== 'object'){
					q.trigger_back = new Button(options.back);
				}else{
					q.trigger_back = options.back;
				}

				q.trigger_back.bindOn({
					mousedown:function(){
						q.previousScene();
					}
				});
			}

			if(options.next !== undefined){
				
				if(typeof options.next !== 'object'){
					q.trigger_next = new Button(options.next);
				}else{
					q.trigger_next = options.next;
				}

				q.trigger_next.bindOn({
					mousedown:function(){
						q.nextScene();
					}
				});
			}

			if(options.complete !== undefined){
				
				if(typeof options.complete !== 'object'){
					q.trigger_complete = new Button(options.complete);
				}else{
					q.trigger_complete = options.complete;
				}

				q.trigger_complete.bindOn({
					mousedown:function(){
						q.nextModule();
					}
				});
			}

			if(options.loader !== undefined){
				
				q.loader = {};

				// wrapper
				if(	options.loader.wrapper !== undefined &&
					typeof options.loader.wrapper === 'string'){
					q.loader = new Item(options.loader.wrapper,{paused:true});
				}

				// is a spinner
				if(	options.loader.spinner !== undefined &&
					typeof options.loader.spinner === 'string'){
					q.loader.spinner = new Item(options.loader.spinner,{paused:true});
					q.loader.spinner.to(1,{rotation:'+=360', ease:'linear', onComplete:q.loader.spinner.restart });
					q.loader.addAffectee('spinner',q.loader.spinner);
				}
			}

			// ============================================
			// Contruction
			// --------------------------------------------

			// Store the modules data
			temp = q.modules;

			// create an array to hold our module data
			q.modules = [];

			// create a SceneController for this ModuleController
			//q.root.sceneController = new SceneController({restrict:true,audioController:q.audioController});
			//q.root.sceneController.controller = q;
			q.sceneController = new SceneController({restrict:true,audioController:q.audioController});
			q.sceneController.controller = q;

			// Load Ajax and assign
			for( i = 0 ; i<temp.length ; i++){
				ajax = (function(i){

					var node,item;

					jQuery.getJSON(temp[i]+'/scenes.json',function(data){
						
						q.modules[i] = {};

						for(node in data){

							function linkFunc(index){

								var module =  q.modules[i];
								q.current_scene = 0;
								q.current_module = i;
								
								updateModuleList(index,q)
								q.loadModule(q.modules[q.current_module])

								if(options.welcomeMessage!==undefined){
									TweenMax.to(options.welcomeMessage,0.4,{y:300,opacity:0,ease:'Back.easeIn',onComplete:function(){
										TweenMax.set(options.welcomeMessage,{css:{
											'visibility':'hidden'
										}});
									}})
								};
								
							}

							// ----------------------------------------------------
							// import module information and set each modules link
							// ----------------------------------------------------
							if( node === 'module' ){

								q.modules[i].title = data[node].title;
								q.modules[i].url = data[node].url;
								q.modules[i].audioPath = data[node].audio;
								
								item = q.modules[i].link = new Button('#'+temp[i],{
									checkbox: '.checkbox',
								});

								q.list.push({
									id:temp[i],
									item:item
								});

								q.list[j].item.completed = false;
								q.list[j].item.active = false;
								q.list[j].item.index = j;

								// the following anonymous function binds the temporal value of j to the items mousdown function
								(function(index){
									q.list[j].item.bindOn({
										mousedown:function(){
											if(q.audioController){
												if(q.audioController.getSoundById('global_select')){
													q.audioController.getSoundById('global_select').play();
												}
											}
											linkFunc(index);
										}
									})
								})(j);

								j+=1;
								
							// -------------------------------------------------
							// load the scenes assocaited with the module above
							// ----------------------------------------------------
							}else{
								q.modules[i][node] = {};
								q.modules[i][node].url = data[node].url;
								q.modules[i][node].title = data[node].title;
							}

						}

						if(callback && i == temp.length-1){
							callback();
						}
						})
					}
				)(i);
			}


		}

	}else{
		console.log('you must have scenes and a course passed in the options, otherwise this will not do anything');
	}

	return q;
}


// ============================================
// Keyboard shortcuts.
// intended for developers.

window.onkeydown = function(e){
	//console.log(e.keyCode)
	
	var keys = {};

	if(navigator.platform === 'MacIntel'){
		keys.num9 = 105;
		keys.num6 = 102;
		keys.num4 = 100;
	}

	if(navigator.platform === 'Win32'){
		keys.num9 = 33;
		keys.num6 = 39;
		keys.num4 = 37;
	}


	switch(e.keyCode){
		
		case keys.num9:
			_root.controller.nextModule();
		break;

		case keys.num6:
			_root.controller.nextScene();
		break;
	
		case keys.num4:
			_root.controller.previousScene();
		break;
	}

};

function getChar(event) {
  	if (event.which === null) {
    	return String.fromCharCode(event.keyCode); // IE
  	} else if (event.which!==0 && event.charCode!==0) {
    	return String.fromCharCode(event.which);   // the rest
  	} else {
    	return null; // special key
	}
}