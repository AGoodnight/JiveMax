// =================
// Factory Package
// =================
/*
	These classes make up the conceptual foundation of the Jive framework
	Jive does a lot of things jQuery 'can do' however jQuery has a very
	long prototype chain. This reduces any garbage that may be added by jQuery.
	It implements jQuery, but does not keep jQuery objects laying around.
*/

// ========================================
// GSAP Object
// ----------------------------------------
/* 

	This object is the base of all objects with a timeline/animations.
	It contains 'clone' functions which are meant to extend thier native GSAP 
	counterparts so as to support looping and work with controllers.

	==========================================================
	CONSTRUCTOR
	==========================================================
	var tank = new GSAPObject();

		GSAPObject(options)
		---------------------------------------------------------------------------------------------------------------
		returns a new GSAPObject.

			-- options
			-------------------------------------
				- affectees: array
					-- an array of GSAPObjects to control playback on
				- paused: boolean
					-- prevents immediate playback of the object's timeline
				- ease: string 
					-- specifies a global ease, refer to: http://greensock.com/docs/#/HTML5/GSAP/Easing/
				- origin: string
					-- specifies a global transformOrigin, refer to: http://greensock.com/docs/#/HTML5/GSAP/Plugins/CSSPlugin/

	======================================================
	METHODS
	======================================================
	var tank = new GSAPObject()[method]();


		jig( id,preset,options,timeOptions )
		---------------------------------------------------------------------------------------------------------------
		executes a preset animation on a DOM element

			-- id:string
				--- a string containing a css selector, the element you want to animate
			-- preset:string
				--- a string which matches a preset method found in jig.js > jigLibrary
			
			-- options:object
			------------------------------------------------------------------------------
			key values which overide default values in the preset indicated. Each jig may or may not
			use certain options, if it does not it will just not affect the preset (fails silently).
			Common key values are as follows:

				1. speed:number
					- affects the duration of the animation in seconds
				2. strength:number
					- affects the strength of the effect, a relative value with a base of 1.
				3. ease:string
					- refer to: http://greensock.com/docs/#/HTML5/GSAP/Easing/

			-- timeOptions:object
			--------------------------------------------------------------------------------
			key values that determine playback or temporal effects of the animation

				1. loop:number
					- will simulate looping of an animation by creating duplicate instances of animation on the objects timeline.
				2. sync:number
					- determines when the animation will start on the objects timeline.			
				3. offset:number
					- used by stagger like animation methods, determines how much to stagger the start of each elements animation
					  relative to it's siblings. Good for cascading effects.



		staggerJig( idGroup, preset, options, timeOptions )
		---------------------------------------------------------------------------------------------------------------
		*same as jig, exceptions listed below.

			-- idGroup:array
				-- an array of strings and/or GSAPObjects you wish to animate.



		to ( id, duration, options, timeOptions ),
		from ( id, duration, options, timeOptions ),
		fromTo ( id, duration, options, options2, timeOptions ),
		staggerTo ( idGroup, duration, options, timeOptions ),
		staggerFrom ( idGroup, duration, options, timeOptions ),
		staggerFromTo( idGroup, duration, options, options2, timeOptions )
		---------------------------------------------------------------------------------------------------------------
		*refer to: http://greensock.com/docs/#/HTML5/GSAP/TimelineMax/

			exceptions below:

			-- timeOptions:object
				*same as jig() timeOptions


		
		yoyo( id, duration, options1, options2, timeOptions )
		---------------------------------------------------------------------------------------------------------------
		will create an aniamtion that starts from options1 specifications 
		and animates to options2 specifications, then reverse itself back 
		to 1 and repeats, like a yoyo.

			*it works the same as ( to, from, etc.... )



		at( time, callback, label )
		---------------------------------------------------------------------------------------------------------------
		fires a callback at a specified time on the timeline.
		this extends: http://greensock.com/docs/#/HTML5/GSAP/TimelineMax/addCallback/

			-- time:number
				--- when in seconds to fire the callback on the object's timeline
			-- callback:function
				--- a function to be fired at the time specfied
			-- label
				--- a label for this callback, refer to: http://greensock.com/docs/#/HTML5/GSAP/TimelineLite/addLabel/



		endAt( time )
		---------------------------------------------------------------------------------------------------------------
		sets the totalDuration of the timeline past any animation instances, if needed.

			-- time:number
				--- in milliseconds, for increased accuracy

	

		showAll() and hideAll()
		---------------------------------------------------------------------------------------------------------------
		If a DOM element has been affected by this GSAPObject instance, this method hides or shows them. 
		Sets visibility to 'hidden' ( will not affect layout ) and freezes any and all user interactions on the element.


		affect( name, item )
		---------------------------------------------------------------------------------------------------------------
		add affectees, GSAPObjects you want to control the playback of through this GSAPObjects playback methods.

			-- name:string
				--- this string is used to refer to the affected item in an associative array like so: affectees[name]
			-- item
				--- The actual reference to the GSAPObject you want to affect the palyback of

 */
function GSAPObject(options){

	var q = new GSAP_Router(true),
		i,
		k,
		affectees;

	q.timeline = new TimelineMax({ defaultOverwrite:"auto" });
	q._elements = [];
	q.defaults = {};
	q.affectees = {length:0};
	q.atEnd = false;
	q.freezes =[];
	q.type = 'GSAPObject';

	if(options){
		
		affectees = (options.affectees === undefined) ? true : options.affectees;

		q.paused = (options.paused !== undefined) ? options.paused : false ;
		if(q.paused) q.timeline.pause();

		q.defaults.ease = (options.ease) ? options.ease : 'Sine.easeOut';
		q.defaults.transformOrigin = (options.transformOrigin) ? options.transformOrigin : '50% 50%' ;

	}
	
	// Affectees playback will be controlled by this objects timeline

	if(affectees !== false){
		
		q.affect = function(item,name){
			if(name === undefined){
				// if noe name is provided, it just assigns it a number key.
				name = ''+q.affectees.length
			};
			q.addAffectee(name,item);
		};

		q.addAffectee = function(name,item){
			q.affectees[name] = item.timeline;
			q.affectees.length +=1;
		};

		q.removeAffectee = function(name){
			delete q.affectees[name];
			q.affectees.length -=1;
		};

	}

	// ---------------------------------------------------
	// GSAP Method Core Modules
	// TODO: Unify into one.

	function do_GSAP(id,dur,op,timeOptions,method,offset){
		// execute a GSAP Method that accepts one var set.

		var loop,
			sync;
			offset = (offset) ? offset : undefined ;

		if(q.wrapper !== undefined){
			if(q.wrapper.id !== undefined){
				id = q.wrapper.id+' '+id;
			}
		}

		if(timeOptions){
			sync = (timeOptions.sync !== undefined) ? timeOptions.sync : undefined ;
			loop = (timeOptions.loop !== undefined) ? timeOptions.loop : undefined ;
			offset = (timeOptions.offset !== undefined) ? timeOptions.offset : undefined ;
		}

		if(op.length < 2){

			for( i in q.defaults ){
				op[0][i] = ( op[0][i] ) ? op[0][i] : q.defaults[i] ;
			}

			GSAP_method(q.timeline,id,dur,{
				options:op[0],
				offset:offset,
				sync:sync,
				loop:loop
			},method);
		}else{

			for( i in q.defaults ){
				op[0][i] = ( op[i] ) ? op[i] : q.defaults[i] ;
			}

			GSAP_method(q.timeline,id,dur,{
				options:op[0],
				options2:op[1],
				offset:offset,
				sync:sync,
				loop:loop
			},method);
		}

		// Push element for later reference

		if(q._elements.length === 0){
			q._elements.push(id);
		}else{
			for(i=0, k<q._elements.length ; i<k ; i++){
				if(q._elements[i] !== id){
					q._elements.push(id);
				}
			}
		}
	};

	// -----------------------------------------------------------------------------------
	// Jig Integration, Jig allows you to store custom animations to use later as presets.

	q.jig = function(id,preset,options,timeOptions){

		var loop,
			sync;

		if(q.wrapper !== undefined){
			if(q.wrapper.id !== undefined){
				id = q.wrapper.id+' '+id;
			}
		}

		if(timeOptions){
			sync = or(undefined, timeOptions.sync);
			loop = or(undefined, timeOptions.loop);
		}

		var newOptions = [];

		for( i in options ){
			//console.log(newOptions[i]+' --- '+q.defaults[i]);
			newOptions[i] = ( options[i] === undefined ) ? q.defaults[i] : options[i] ;
			//console.log(newOptions[i]+' --- '+q.defaults[i]);
		}

		for( i in q.defaults ){
			if(newOptions[i] === undefined){
				newOptions[i] = q.defaults[i];
			}
		}

		// Need to check if sync is passed as a number, if not we need a number.
		if( sync !== undefined && isNaN(sync) ){
			sync = this.timeline.getLabelTime(sync);
		}

		// If jig library is included
		if(this.timeline.jig){
			this.timeline.jig.apply(this.timeline,[id,preset,newOptions,sync,loop]);
		}else{
			console.log('You need to include a version of jig.js');
		}

		return this;
	};

	q.staggerJig = function(idGroup,preset,options,timeOptions){

		var i,
			loop,
			sync,
			offset;

		if(q.wrapper !== undefined){
			if(q.wrapper.id !== undefined){
				id = q.wrapper.id+' '+id;
			}
		}

		if(timeOptions){
			sync = or(undefined, timeOptions.sync);
			loop = or(undefined, timeOptions.loop);
			offset = or(undefined, timeOptions.offset);
		}

		// Need to check if sync is passed as a number, if not we need a number.
		if( sync !== undefined ){
			if(isNaN(sync)){
				sync = this.timeline.getLabelTime(sync);
			}
		}else{
			sync = 0;
		}

		if(typeof idGroup === 'string'){
			idGroup = getNodes(idGroup);
			if(typeof idGroup !== 'object'){
				idGroup = [idGroup];
			}
		}

		// If jig library is included
		if(this.timeline.jig){

			for( i = 0 ; i<idGroup.length ; i++){
				this.timeline.jig.apply(this.timeline,[idGroup[i],preset,options,sync,loop]);
				sync += offset
			}


		}else{
			console.log('You need to include a version of jig.js');
		}

		return this;
	};

	// -----------------------------------
	// GSAP Methods

	q.to = function(id,dur,op,timeOptions){
		do_GSAP(id,dur,[op],timeOptions,'to');
		// return -------------------------
		return this;
	};

	q.from = function(id,dur,op,timeOptions){
		do_GSAP(id,dur,[op],timeOptions,'from');
		// return -------------------------
		return this;
	};

	q.fromTo = function(id,dur,op,op2,timeOptions){
		do_GSAP(id,dur,[op,op2],timeOptions,'fromTo');
		// return -------------------------
		return this;
	};

	q.staggerTo = function(id,dur,op,timeOptions){
		do_GSAP(id,dur,[op],timeOptions,'staggerTo',0.3);
		// return -------------------------
		return this;

	};

	q.staggerFrom = function(id,dur,op,timeOptions){	
		do_GSAP(id,dur,[op],timeOptions,'staggerFrom',0.3);
		// return -------------------------
		return this;
	};

	q.staggerFromTo = function(id,dur,op,op2,timeOptions){
		do_GSAP(id,dur,[ops,op2],timeOptions,'staggerFromTo',0.3);
		// return -------------------------
		return this;
	};

	q.yoyo = function(id,dur,op,op2,timeOptions){

		var i,c = 0,c1,c2,c3;
		var ops2 = op2;
		var timeOps = timeOptions;
		var styles = jQuery(id).parseStyles();

		if(ops2 !== undefined){
			c1 = (ops2.sync !== undefined) ? c+=1 : undefined ;
			c2 = (ops2.loop !== undefined) ? c+=1 : undefined ;
			c3 = (ops2.offset !== undefined) ? c+=1 : undefined ;
			timeOps = ops2;	
		}

		if(c>0){
			ops2 = {};
		}

		if(ops2 === undefined){
			ops2 = {};
		}

		for( i in op ){
			ops2[i] = op[i];
			op[i] = 0;
		}

		console.log(op)
		console.log(ops2)
		console.log(timeOps)

		do_GSAP(id,dur,[op,ops2],timeOps,'yoyo');
		// return -------------------------
		return this;
	};

	q.addLabel = function(label,sync){
		if(sync){ this.timeline.add(label,sync); }else{ this.timeline.add(label); }
		return this;	
	};

	// uses GSAP 'addCallback' to execute something 'at' a certain point
	q.at = function(sync,callback,name){
		if(name) { 
			this.timeline.add(name,sync); // adds a label to the timeline
		}
		this.timeline.addCallback(callback,sync);
		return this;
	};

	q.hideAll = function(){
		// Hide all DOM elements associated with the current scene
		var i,k;
		for( i = 0 , k = q._elements.length ; i<k ; i++){
			TweenMax.set(q._elements[i],{css:{
				'visibility':'hidden',
				'opacity':'0'
			}})
		}
		return this;
	};

	q.showAll = function(){
		// Show all DOM elements associated with the current scene
		var i,k;
		for( i = 0 , k = q._elements.length ; i<k ; i++){
			TweenMax.set(q._elements[i],{css:{
				'visibility':'visible',
				'opacity':'1'
			}})
		}
		return this;
	};

	q.show = function(selector){
		if(selector === undefined && typeof selector !== 'string' ){
			var i,k;
			for( i = 0 , k = this._elements.length ; i<k ; i++){
				TweenMax.set(this._elements[i],{css:{
					'visibility':'visible',
					'opacity':'1',
					'pointer-events':'auto'
				}})
			}
		}else{
			TweenMax.set(selector,{css:{
				'visibility':'visible',
				'opacity':'1',
				'pointer-events':'auto'
			}})
		}

		return this;
	};

	q.hide = function(selector){
		if(selector === undefined && typeof selector !== 'string' ){
			var i,k;
			for( i = 0 , k = this._elements.length ; i<k ; i++){
				TweenMax.set(this._elements[i],{css:{
					'visibility':'hidden',
					'opacity':'0',
					'pointer-events':'none'
				}})
			}
		}else{
			TweenMax.set(selector,{css:{
				'visibility':'hidden',
				'opacity':'0',				
				'pointer-events':'none'
			}})
		}

		return this;
	};

	// a function to ensure the timeline is at a certain length, implemented for soundtrack syncing.
	q.endAt = function(milliseconds){

		var sync = milliseconds/1000;

		// kind of hackish, but it is the only way to ensure we set the timelines actual length, not timescale
		this.timeline.addCallback(function(){q.atEnd = true},sync);

		//console.log(this.timeline);

		return this;
	}

	return q;
}

//==========================================
// GSAP_Router
// -----------------------------------------
/*
	This object contains methods which control the playback of a GSAPObject, 
	the GSAPObject is an extension of this method class.

	You will never call this class directly, 
	instead you will call these methods via the GSAPObject class as such:
	
	GSAPObject.play();
	GSAPObject.restart();

	========================================
	METHODS
	========================================

		These methods are clones of TimelineMax methods, with only one minor change.
		These methods now accept the simple boolean ignoreAffectees, which allow
		the developer to further control the playback of affected objects in the 
		primary class GSAPObject.

		kill( vars, ignoreAffectees, suppressEvents );
		---------------------------------------------------------------------------------------------------------------
		refer to: http://greensock.com/docs/#/HTML5/GSAP/TweenMax/kill/


		play( from, ignoreAffectees, suppressEvents, callback );
		---------------------------------------------------------------------------------------------------------------
		refer to: http://greensock.com/docs/#/HTML5/GSAP/TweenMax/play/

			-- callback
				--- an option function to fire when using this method.


		pause( atTime, ignoreAffectees, suppressEvents );
		---------------------------------------------------------------------------------------------------------------
		refer to: http://greensock.com/docs/#/HTML5/GSAP/TweenMax/pause/


		restart( includeDelay, ignoreAffectees, suppressEvents, callback );
		---------------------------------------------------------------------------------------------------------------
		refer to: http://greensock.com/docs/#/HTML5/GSAP/TweenMax/restart/

			-- callback
					--- an option function to fire when using this method.


		set( id, options, ignoreAffectees );
		---------------------------------------------------------------------------------------------------------------
		refer to: http://greensock.com/docs/#/HTML5/GSAP/TweenMax/set/


		reverse( vars, ignoreAffectees, suppressEvents );
		---------------------------------------------------------------------------------------------------------------
		refer to: http://greensock.com/docs/#/HTML5/GSAP/TweenMax/reverse/


		gotoAndStop( vars, ignoreAffectees, suppressEvents );
		---------------------------------------------------------------------------------------------------------------
		extends: pause();


		gotoAndPlay( vars, ignoreAffectees, suppressEvents );
		---------------------------------------------------------------------------------------------------------------
		extends: play();


		clear();
		---------------------------------------------------------------------------------------------------------------
		refer to: http://greensock.com/docs/#/HTML5/GSAP/TweenMax/clear/	
*/
function GSAP_Router(affectees){

	var q ={};

	q.kill = function(vars,ignoreAffectees,suppressEvents){
		
		this.timeline.kill();

		var i;
		if(ignoreAffectees === undefined && q.affectees.length > 0){
			for( i in q.affectees ){
				if(i !== 'length'){
					q.affectees[i].kill.apply(q.affectees[i],[ vars ]);
				}
			}
		}
		return q;
	};

	q.play = function(from,ignoreAffectees,suppressEvents,callback){

		//console.log('playing ' + this)

		function affectees(_this){
			var i;
			//console.log(_this, _this.timeline.progress())
			if(ignoreAffectees === undefined || ignoreAffectees === true && _this.affectees.length > 0){
				for( i in _this.affectees ){
					if(i !== 'length'){
						if(_this.timeline.progress() === 0){
							_this.affectees[i].play.apply(_this.affectees[i],[ from,suppressEvents ]);
						}
						if(_this.timeline.progress() > 0){
							_this.affectees[i].restart();
						}
					}
				}
			}
		}

		if(this.timeline.progress() === 1){
			affectees(this);
			this.timeline.restart();
		}else{
			affectees(this);
			this.timeline.play(from);
		}

		this.atEnd = false;
		return q;
	};

	q.pause = function(atTime,ignoreAffectees,suppressEvents){
		
		this.timeline.pause();

		var i;
		if(ignoreAffectees === undefined || ignoreAffectees === true && q.affectees.length > 0){
			for( i in q.affectees ){
				if(i !== 'length'){
					q.affectees[i].pause.apply(q.affectees[i],[ atTime,suppressEvents ]);
				}
			}
		}
		return q;
	};

	q.restart = function(includeDelay,ignoreAffectees,suppressEvents,callback){

		console.log('restarting ' + this)

		function affectees(_this){
			var i;
			console.log(_this, _this.timeline.progress())
			if(ignoreAffectees === undefined || ignoreAffectees === true && _this.affectees.length > 0){
				for( i in _this.affectees ){
					if(i !== 'length'){
						if(_this.timeline.progress() === 0){
							_this.affectees[i].play.apply(_this.affectees[i]);
						}
						if(_this.timeline.progress() > 0){
							_this.affectees[i].restart();
						}
					}
				}
			}
		}

		affectees(this);
		this.timeline.restart();
		this.atEnd = false;
		return q;
	};

	q.set = function(id,options,ignoreAffectees){
		
		if(options.immediateRender === undefined){
			options.immediateRender = false;
		}
		if(options.immediateRender === undefined){
			options.immediateRender = true;
		}

		this.timeline.set(id,options);

		return q;
	};

	q.reverse = function(){
		this.timeline.reverse();
		return q;
	};

	// These always ignore Affecttes, due to thier nature.
	q.gotoAndPlay = function(label){
		this.timeline.resume(label);
		this.timeline.play();
		this.atEnd = false;
		return q;
	};

	q.gotoAndStop = function(label){
		this.timeline.resume(label);
		this.timeline.pause();
		this.atEnd = false;
		return q;
	};

	q.clear = function(){
		this.timeline.clear();
		return q;
	};

	return q;
}


// ========================================
// Scene
// ----------------------------------------
/*
	A Scene is a GSAPObject inended to act as you would expect. 
	It is used when wanting to control multiple DOM elements on one timeline.

	The rational for having this special class is to keep the GSAPObject class
	as pure and simple as possible.

	This class has playback feedback and stores freezes, which are labels that indicate 
	when and where certain classes of the GSAPObject should be inaccesible to user control,
	such as buttons that need to be disabled until a certain point. 

	==================================
	CONSTRUCTOR
	==================================

		Scene( options )
		----------------------------------

			options
			-------------------------------------------------
				- paused:boolean
					-- prevents immediate playback of the object's timeline
				- wrapper:string
					-- TODO
				- id:string
					-- optional id for the scene
				- scoID:number
					-- TODO
				- soundtrack:string
					-- TODO


	================================
	METHODS
	================================

		q.progress()
		-----------------------------------------------------------------
		Returns to current progress of the timeline relative to base 1


		q.duration()
		-----------------------------------------------------------------
		Returns the total duration of the scene in seconds.


		q.wipe()
		-----------------------------------------------------------------
		Wipes the timeline clear of all animations, when in a chain, 
		it will wipe the timeline at the point in the chain it is applied,
		so if you have Scene.to().wipe().to(); it will wipe the timeline after the first 
		to()

		q.show()
		-----------------------------------------------------------------
		Shows an element, use a css selector

		q.show()
		-----------------------------------------------------------------
		Hides an element, use a css selector
*/
function Scene(options){

	var q = new GSAPObject(options);
	q.stopped = false; // 'paused' is reserved by GSAP
	q.progress = function(){ return q.timeline.totalProgress(); };
	q.duration = function(){ return q.timeline.totalDuration(); };
	q.freezes = [];
	q.type = 'scene';

	// at the point you have this in yor method chain the timeline is erased
	q.wipe = function(){
		q.timeline.addCallback(function(){
			q.clear();
		});

		return q;
	};

	if(options){
		if(options.paused){ q.timeline.pause(); }else{ q.timeline.play(); }
		q.wrapper = (options.wrapper) ? new Item(options.wrapper) : undefined ;
		q.id = (options.id)? options.id : 'scene' ;
		q.timeline.name = q.id;
		q.scoID = (options.scoID) ? options.scoID : 'null' ;
		q.soundtrack = (options.soundtrack) ? options.soundtrack : undefined ;
	}

	return q;

}

// ========================================
// Item
// ----------------------------------------
/*
	An Item is a GSAPObject, that is bound to a particular DOM element. 
	Binding it to this DOM element allows independent control over it's timeline.
	All item instances inherit the timeline and methods of the GSAPObject, as such the 
	animation methods will not be mentioned again after this class.

	==============================
	CONSTRUCTOR
	==============================
	var tank = new Item();

		Item( bind, options )
		---------------------------------------------

			options
			--------------------------------------
				-defaultOverwrite:boolean
					-- refer to: http://greensock.com/docs/#/HTML5/GSAP/TweenLite/defaultOverwrite/
				-paused:boolean
					-- prevents immediate playback of the timeline


	==============================
	METHODS
	==============================

		setActions( actions )
		---------------------------------------------------------

			-- actions:array
				--- an array of functions you want to fire when


		hide() and show()
		---------------------------------------------------------
		sets visibilty of the bound DOM element to hidden and opacity to 0.


		to ( duration, options, timeOptions ),
		from ( duration, options, timeOptions ),
		fromTo ( duration, options, options2, timeOptions ),
		staggerTo ( duration, options, timeOptions ),
		staggerFrom ( duration, options, timeOptions ),
		staggerFromTo( duration, options, options2, timeOptions )
		---------------------------------------------------------------------------------------------------------------
		*refer to: http://greensock.com/docs/#/HTML5/GSAP/TimelineMax/

			exceptions below:

			* No ID needed for these, as the DOM element is already bound to the item instance.

			-- timeOptions:object
				*same as jig() timeOptions


		
		yoyo( duration, options1, options2, timeOptions )
		---------------------------------------------------------------------------------------------------------------
		will create an aniamtion that starts from options1 specifications 
		and animates to options2 specifications, then reverse itself back 
		to 1 and repeats, like a yoyo.

			*it works the same as ( to, from, etc.... )
*/
function Item(bind, options){
	var i,
		q,
		overwrite,
		paused,
		temp;

	if(options){
		overwrite = (options.defaultOverwrite) ? options.defaultOverwrite : 'auto' ;
		paused = or(false,options.paused);
	}

	q = new GSAPObject({affectees:true,defaultOverwrite:overwrite,paused:paused});
	q.type = 'item';

	// a way to identify the items DOM element via string
	q.id = bind;

	// The dom element bound to the item
	q.element =  getNodes(bind);
	q._elements.push(q.element);

	/* 	An array of actions or functions that this item will execute while it's timeline 
		is running */
	q.actions = [];

	q.hide = function(){
		jQuery(q.element).css({
			'visibility':'hidden',
			'opacity':'0'
		});
	};

	q.show = function(){
		jQuery(q.element).css({
			'visibility':'visible',
			'opacity':'1'
		});
	};

	/*
		The below allows us to exclude redundant referencing to the 'id' node of the item.
		It also keeps these functions defined in GSAPObject.
	*/
	// --------------------------------------------------------------------------------

	q.jig = includeID(q.jig,q.id,q);
	q.to = includeID(q.to,q.id,q);
	q.fromTo = includeID(q.fromTo,q.id,q);
	q.from = includeID(q.from,q.id,q);
	q.yoyo = includeID(q.yoyo,q.id,q);
	q.set = includeID(q.set,q.id,q);

	// -----------------------------
	return q;
}

// ----------------------------------------
// Item Class Generalizations 

//=================================================
// Text
//-------------------------------------------------
/*
*/

function Text(bind, options){

	var q = new Item(bind,options);
	q.type = 'text';

	if(options){
		q.value = or(undefined,options.value);
		q.style = or(undefined,options.style);
	}

	if(q.value){ jQuery(bind).empty().append(''+q.value) };
	if(q.style) { jQuery(bind+'').addClass(q.style) };

	// -----------------------------
	return q;
}

//==================================================
// Button
//--------------------------------------------------
/*
	===========================
	CONSTRUCTOR
	===========================
	
	Button( bind, options )
	------------------------------------------------------------------
	extends Item

		options
		------------------------------------------------

			*options for Item are valid  for button.

			-- checkbox:string
				--- if you would like to indicate the acitve state of the button
						with a DOM element, assign it to checkbox and give it a
						css class (state) called active, which will be set when
						the button instance is active.

			-- group
				--- TODO


	=====================
	METHODS
	=====================

	bind( event, toggle )
	-------------------------------------------
	the function will bind the timelines playback to
	a mouse event. So for example, if you bind 'onmouseover', the button will play it's timeline
	when that event occurs, it will also play the the timelines of any of it's affectees 
	( functionality inherited from GSAPObject ).

		-- event:string
			> 'onmouseover'
			> 'onmouseup'
			> 'onmousedown'
			> 'onmouseout'

		-- toggle:boolean
			--- makes the playback toggle between play and pause on the event if set to true.


	bindOn( {event:function} )
	--------------------------------------------
	the method binds a function to a mousevent, unlike bind, the function is custom and has a 
	passed varaible called self, which is equal to the classes state before the bindOn function
	was called.

	This method is best explained through the example below:

		myButton.bindOn({
			onmousedown:function( self ){

				this === myButton *as it is after bindOn is applied
				self === myButton *as it was before bindOn was applied

				// Your methods etc..
			}
		})



	on( event, callback )
	---------------------------------------------------
	allows the developer to add aditional callbacks to a mousevent, without
	affecting any of the methods added via bind or bindOn.


	freeze( options )
	----------------------------------------------------------------------------------------
	This method allows the developer to disable or enable the button instance
	at a certain point in the timeline.

	freeze's counter method is unFreeze(), which accepts no options and happens immediatley on call.

	It does this by creating an encrypted label ( native ability in TimelineMax ) and placing it on the timeline.
	It then checks to see if that lable has passed or not. The label will trigger the button's change in state.

		options:object
		--------------------------------------------------------
		an object containg key value pairs.

			-- on:Scene
				--- the Scene or any other GSAPObject you want this freeze to be dependent on
			-- from:number*
				--- when the freeze whould occur ( when the button is disabled )
			-- until:number**
				--- when the freeze should end ( when the button is enabled )

			* ommiting 'from' will result in the button being disabled from 0 to indicated 'until' value.
			** ommiting 'until' will simply freeze the button from the 'from' value indefinatley.



	enable() and disable()
	-----------------------------------------------------------------------------------------
	This method is much like freeze, however both are invoked at the time they are called.
	The disable method assigns a class of 'disabled' to the buttons DOM element.
	enable removes the disabled class.
*/
function Button(bind, options){

	
	var q = new Item(bind,options);
	q.type = 'button';

	jQuery(q.id).css({
		'cursor':'pointer',
		'-webkit-user-select': 'none', /* Chrome/Safari */        
		'-moz-user-select': 'none', /* Firefox */
		'-ms-user-select': 'none' /* IE10+ */
	});
	
	if(options){
		q.group = or(undefined,options.group);
		q.checkbox = or(undefined, options.checkbox);
		q.checkbox = (options.checkbox) ? bind+' '+options.checkbox : undefined ;	
	}

	q.active = false;
	q.down = false;
	q.over = false;
	q.frozen = false;

	// Mouse Up Outside Event
	getNodes('body').onmouseup = (function(e){
		return function(){
			q.down = false;
			if(e !== null){
				e.call(arguments);
			}
		};
	})(getNodes('body').onmouseup); 


	q.element.onmouseover = function(){
		q.over = true;	
		return q;
	};

	q.element.onmouseout = function(){
		q.over = false;
		return q;
	};

	q.element.onmousedown = function(){
		q.down = true;

		// Checkbox Control
		if(q.checkbox){
			if(!q.active){
				jQuery(q.checkbox).addClass('active');
				q.active = true;
			}else{
				jQuery(q.checkbox).removeClass('active');
				q.active = false;
			}
		}

		return q;
	};

	q.element.onmouseup = function(){
		q.down = false;
		return q;
	};

	// automate a method
	q.auto = function(what,options,callback){
		
		var i;

		if( !unNull(q.element[what]) ){
			q.element[what]()

			if(options){
				for(i in options){
					q[i] = options[i];
				}
			}

			if(callback !== undefined &&
				typeof callback === 'function'){
				callback();
			}

			return q;

		}else{
			return false;
		}
	};

	q.bind = function(ev,toggle){

		function func(e,toggle){

			var i;
			var _this = q; 

			if(!this.frozen){

				// affectee code
				// --------------------------

				// actions code
				// --------------------------
				if(!!_this.actions.length){

					for( i = 0 ; i<_this.actions.length ; i++){
						_this.actions[i]();
					}
				}

				// timeline code
				// --------------------------

				// turns active to false at end of animation
				_this.timeline.call(
					function(){
						_this.active = false;
						console.log(_this.id+' is not active')
					}
				);

				if(_this.timeline.isActive()){
					if(toggle){
						if(_this.active){ _this.play(); }else{ _this.pause(); }
					}else{
						_this.play();
					}
				}else{
					_this.restart();
					//console.log('restarting')
				}
				// status switches
				// --------------------------
				_this.active = (_this.active) ? false : true;	

			}	
		};

		this.element[ev] = ( function(e){
			return function(){
				func(e,toggle);
				return e.apply(this,arguments);
			};
		})(this.element[ev]);

		this.pause();

		return this;
	};

	q.toggle = function(what,func){
		if(this.active){
			what[func[1]]();
		}else{
			what[func[0]]();		} 
	};

	// Execute something on a class specific mouse event
	q.on = function(mouseEvent,callback){
		
		if( !mouseEvent ){ console.log('You need to specify a mouseEvent'); }
		if( !callback ){ console.log('You need to specify a callback'); }
		if( !mouseEvent || !callback){
			return null;
		}

		q.element[mouseEvent] = (function(e,q){
			return function(){
				if(!q.frozen){
					callback();
					e.call(this,arguments);
				}
			};
		})(q.element[mouseEvent],q);

		
		return this;
	};

	// Used to disable mouse events at specified points in a timeline. This is independent of using css 'pointer-events', which trumps this method.
	q.freeze = function(options){
	// OPTIONS: { on:scene, from:number, until:number }, if you pass no options it will just set the item to frozen
		
		var scene, 
			from,
			until,
			fromLabel,
			untilLabel;

		jQuery(q.element).css('cursor','auto');

		if(options){
			scene = (options.on) ? options.on : q;
			from = (options.from) ? options.from : 'z';
			until = (options.until) ? options.until : 'z';

			fromLabel = 'freeze_'+scene.freezes.length+'f';
			untilLabel = 'freeze_'+scene.freezes.length+'u';

			if(from === 'z'){ from = 0; }
			scene.timeline.addLabel(fromLabel,from);

			if(until !== 'z'){ 
				scene.timeline.addLabel(untilLabel,until);
			}

			scene.freezes.push({
				from:{
					label:fromLabel,
					reached:false
				},
				until:{
					label:untilLabel,
					reached:false
				},
				item:q
			});

			console.log(scene.type)

			// if the scene needs to watch for the freeze, but has no controller.
			if(scene.controller === undefined){
				scene.interval = setInterval(function(){
					if(scene.timeline.progress() > 0 && scene.timeline.progress() < 1){
						console.log('checking')
						checkFreezes(scene);
					}
				},100)
			}

		}else{
			q.frozen = true;
		} 

		return q;	
	}; 

	q.unFreeze = function(){

		jQuery(q.element).css('cursor','pointer');
		q.frozen = false;

		return q;
	};

	q.clearFreezes = function(){
		
		if(q.interval !== undefined){
			try{
				clearInterval(q.interval);
			}catch(e){
				// fail silently
			}
		}

		q.interval = undefined;
		q.freezes = [];
			
		return q;
	};


	// Same as freeze and unFreeze except it also affects the elements class, allowing styling.
	q.enable = function(){
		q.unFreeze();
		jQuery(q.id).removeClass('disabled').children().removeClass('disabled');
	};

	q.disable = function(){
		q.freeze();
		jQuery(q.id).addClass('disabled').children().addClass('disabled');
	};


	/* you can create additional events, but be aware you cannot overwrite
	others, so interference is always likley if you are animating the 
	same attribute as the default timeline's animtion is.*/
	q.bindOn = function(e){

		if(e.mouseover){
			q.element.onmouseover = ( function(e,self,v){
				return function(){
					if(!self.frozen){
						v.mouseover.call(self,q.id);
						e.call(self,e);
					}
				};
			})(q.element.onmouseover,q,e);
		}

		if(e.mouseout){
			q.element.onmouseout = ( function(e,self,v){
				return function(){
					if(!self.frozen){
						v.mouseout.call(self,q.id);
						e.call(self,e);
					}
				};
			})(q.element.onmouseout,q,e);
		}

		if(e.mousedown){
			q.element.onmousedown = ( function(e,self,v){
				//console.log('added mousedown to '+q.id)
				return function(){
					if(!self.frozen){
						v.mousedown.call(self,q.id);
						e.call(self,e);
					}
				};

			})(q.element.onmousedown,q,e);
		}

		return q;

	};

	return q;
}

function HotSpot(bind, options){ 

	var q = new Button(bind,options);

	q.over = false;

	if(options){
		q.expecting = (options.expecting) ? options.expecting : 'null';
		q.index = (options.index) ? options.index : 0 ;
		jQuery(bind).css('pointer-events','none')
	}

	return q;
}

//-----------------------------------------
// Drag
//----------------------------------------
/*

	==================
	CONSTRUCTOR
	==================

	Drag( bind, options )
	----------------------------------

		- bind
			* works the same as the item class

		- options
		-----------------------------------------------
		*extends the button AND item class options
			additional options are:

			-- bounds:string
				--- a css selector that assigns the bounds of the drag instance to the
					boundries of the selectors DOM element. DO NOT PASS CLASSES, only ids


			-- onDrag:function( self )
				--- a function to be executed when the user begins to drag the DOM element bound to this class
			-- index:number
				--- you can assign an index, this used primarily for testing, such as drag and drop routine
			-- parent:object
				--- optional parent element, used primarily for scrubbar
			-- onDragEnd( self )
				--- a function to be executed when the user stops dragging the DOM element bound to this class

	=================
	METHODS
	=================

	* all the methods from the Item and Button class.
*/

function Drag(bind, options){ 
	var q = new Button(bind,options);

	q.dragging = false;
	q.origin = jQuery(bind).getStyles(); // so we can always place it back where it came
	q.bounds = (options && options.bounds) ? getRect(options.bounds) :'null';
	q.type = 'drag';

	// Extend functions from Button class
	// --------------------------------------
	q.disable = (function(e){
		return function(){
			q.dragEngine.disable();
			e.call(q,e)
		}
	})(q.disable);

	q.enable = (function(e){
		return function(){
			q.dragEngine.enable();
			e.call(q,e)
		}
	})(q.enable);

	q.bindOn = (function(f){
		
		return function(e){
			
			if(e.whileDragging){
				if(q.whileDragging && q.draggingTicker){
					q.whileDragging = e.whileDragging;
				};
			}

			f.call(e,q)
		}

	})(q.bindOn);

	q.onDrag = function(){
		q.dragging = true;
		q.dragEngine.update();
		//console.log(q.dragEngine.x)

		if(unNull(q.interval)){
			q.draggingTicker();
		}
	};

	q.whileDragging = function(){};
	q.draggingTicker = function(){
		
		q.interval = function(){
			if(q.dragging){
				q.whileDragging();
				window.requestAnimationFrame(q.interval)
			}else{
				q.interval = null;
			}
		};

		window.requestAnimationFrame(q.interval);

	};

	q.onDragEnd = function(){
		q.dragging = false;
	};

	q.rebound = function(){
		TweenMax.to(this.element,0.3,{x:0,y:0});
	};

	q.snap = function(){};	


	var region;

	if(options){
		if(options.bounds){
			region = (options.bounds.id) ? options.bounds.id : options.bounds;
		}

		// perform function on drag end
		if(options.onDragEnd){
			q.onDragEnd = (function(e,v){
				return function(){
					v(q)
					e.apply(q,e);
				}
			})(q.onDragEnd,options.onDragEnd);
		};
		
		// perform function on drag start
		if(options.onDrag){
			q.onDrag = (function(e,v){
				return function(){
					v(q);
					e.apply(q,e);
				}
			})(q.onDrag,options.onDrag);
		};

		// index for hittest purposes
		if(options.index){
			q.index = options.index ;
		}else{
			q.index = 0;
		}
		
		// parent property is used when drag is part of a scrubber and scrubbar
		if(options.parent){

			if(options.parent.onDrag){
				q.onDrag = (function(e){
					return function(){
						options.parent.onDrag();
						e.apply(q,e);
					};
				})(q.onDrag);
			}

			if(options.parent.onDragEnd){
				q.onDragEnd = (function(e){
					return function(){
						options.parent.onDragEnd();
						e.apply(q.e);
					};
				})(q.onDragEnd);
			}
		}
	};

	q.dragEngine = Draggable.create( q.element, {
		type:"x,y", 
		bounds:region,
		onDrag:q.onDrag,
		onDragEnd:q.onDragEnd
	})[0];

	return q;
}

/*function Image(bind, options){

	var q = new Item(bind,options);

	if(options){
		if(options.src) { q.source = options.source; }
		if(options.caption) { q.caption = options.caption; }
	}

	q.load = function(){};

	return q;
}

function Media(bind, options){ 

	var q = new Item(bind,options);

	if(options){
		if (options.src){ q.source = options.source; }
		q.stopped = (options.x) ? options.paused : false;
		q.autoplay = (options.autoPlay) ? options.autoPlay : false;
	}

	q.load = function(){};

	return q;
}*/

//=================================================
// ScrubBar and it's components
//-------------------------------------------------
/*

	The ScrubBar class really has only one purpose currently, but has been made modular for
	future instances of extension. Below we go through the setup of a ScrubBar instance.

	First: create a ScrubBar instance:
	--------------------------------------
		var myScrubBar = ScrubBar( '#myScrubBar' )

	Second: create the additional item class genrealizations (modules) that the ScrubBar requires
	-----------------------------------------------------------------------------------
		var myProgressBar = new Progressbar( '#myProgressBar' ) <-- the main bar that the scrubber will live on
		var myFillBar = new FillBar( '#myFillBar' ) <-- the filling that indicates a portion of the progressbar has been played
		var myScrubber = new Scrubber(' #myScrubber',{
			parent: myScrubBar,
			bounds: myProgressBar
		} ) <-- The scrubber, the thing you drag, which is a special instance of Drag that is bound to the ScrubBar as it's child.

	Third: Bind everything together
	------------------------------------------------------------------------
		myScrubBar.bind({
			bar:myProgressBar,
			scrubber:myScrubber,
			fill:myFillBar,
			controller: ( see controller.js )
		})

	And your done! 
	You will notice that there is a controller key value pair, that is because you will need to setup a 
	controller, which communicates between the scene or object you are hoping to control and the 
	instance of the ScrubBar class.

	We will learn about controllers in the controller.js
*/

function ScrubBar(bind, options){ 

	var td,
		scrubber_position,
		trackProgress,
		run;

	var q = new Item(bind,options);

	if(options){
		q.stopped = (options.paused) ? options.paused : false;
	}

	q.dragging = false;
	q.complete = false;
	q.interval = undefined; // we store the watch interval here

	q.style={
		width:parseInt(jQuery(bind).css('width'),10)
	};
	
	q.watch = function(bol){
		
		run = bol ? true : false;

		if(run){
			if(!this.interval){
				this.interval = setInterval(function(){

					// convert to milliseconds for accuracy
					td = ( q.controller.duration() )*1000;
					scrubber_position = Draggable.get(q.scrubber.id).x;
					trackProgress = scrubber_position/(q.bar.style.width-q.scrubber.style.width);
					q.controller.gotoAndStop( td*trackProgress/1000 );

				}, (1000/30) );
			}
		}else{

			//if(!this.scrubber.down){
				clearInterval(this.interval);
				this.interval = undefined;
				
				if(this.controller.stopped){ this.controller.pause(); }else{ this.controller.play(); }
				//console.log(this.stopped);
			//}
		}

	};

	q.onDrag = function(){
		q.watch(true);
		this.dragging = this.scrubber.dragging;
		//console.log(this.dragging)
	};

	q.onDragEnd = function(){
		q.watch(false);
	};

	q.bind = function(options){
		//console.log(options)
		if(options){
			if(options.bar){ q.bar = options.bar; }
			if(options.scrubber){ q.scrubber = options.scrubber; }
			if(options.controller){ q.controller = options.controller; }
			if(options.fill){ q.fill = options.fill; }
		}
	};

	return q;
}

function ProgressBar(bind, options){
	var q = new Item(bind,options);

	if(options){
		q.stopped = (options.paused) ? options.paused : false ;
		if(options.scrubber){ q.scrubber = options.scrubber; }
	}

	q.style = {
		width:parseInt(jQuery(bind).css('width'),10)
	};

	q.getProgress = function(){};
	q.setProgress = function(){};

	return q;
}

function FillBar(bind, options){
	var q = new Item(bind,options);

	q.style = {
		width:parseInt(jQuery(bind).css('width'),10)
	};

	return q;
}

function Scrubber(bind,options){

	var q = new Drag(bind,options);

	q.style = {
		width:parseInt(jQuery(bind).css('width'),10)
	};

	q.down = false;

	if(options){
		q.bar = (options.bar) ? options.bar : 'null';
	}

	return q;
}
