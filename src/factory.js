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
	counterparts so as to support repeating and work with controllers.

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

				1. repeat:number
					- will simulate repeating of an animation by creating duplicate instances of animation on the objects timeline.
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
		Sets visibility to 'hidden' ( will not affect layout ) and locks any and all user interactions on the element.


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
		l,
		m,
		affectees;

	q.timeline = new TimelineMax({ defaultOverwrite:"auto" });
	q._elements = [];
	q.defaults = {};
	q.affectees = {length:0};
	q.atEnd = false;
	q.locks =[];
	q.type = 'GSAPObject';

	if(options){
		
		affectees = options.affectees || true;

		q.paused = options.paused || true ;

		if(q.paused) q.timeline.pause();

		q.defaults.ease = options.ease || 'Sine.easeOut';
		q.defaults.transformPerspective = options.transformPerspective || 0 ;
		q.defaults.perspective = options.perspective || 0 ;
		q.defaults.transformOrigin = options.transformOrigin || '50% 50%' ;

	}
	
	// Affectees playback will be controlled by this objects timeline

	if(affectees !== false){
		
		q.affect = function(item,name){

			console.log(Object.prototype.toString.call(item), Object.prototype.toString.call(name))

			if(Object.prototype.toString.call(item) === '[object Array]' && Object.prototype.toString.call(name) === '[object Array]'){
				for( i = 0 , k=item.length ; i<k ; i++ ){
					if(name[i] === undefined){ name[i] = ''+q.affectees.length };
					q.addAffectee(name[i],item[i]);
					console.log('added')
				}
			}else if(typeof item === 'string' && typeof name === 'string'){
				if(name === undefined){ name = ''+q.affectees.length };
				q.addAffectee(name,item);
				console.log('added 2')
			}else{
				console.log('You must provide an array or a string for both instances')
			}
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

		var repeat,
			sync;
			offset = offset || undefined ;

		if(q.wrapper !== undefined){
			if(q.wrapper.id !== undefined && q.wrapper.id !== id){
				id = (typeof id !=='string') ? id : q.wrapper.id+' '+id;
				//console.log('adding wrapper: '+q.wrapper.id+'  '+id);
			}
			if(q.wrapper.id === id){
				id = id;
				//console.log('same as wrapper: '+id);
			}
		}

		//console.log('id is '+id)

		if(timeOptions){
			sync = timeOptions.sync || 0 ;
			repeat = timeOptions.repeat || 0 ;
			offset = timeOptions.offset || 0 ;
		}

		if(op.length < 2){

			for( i in q.defaults ){
				op[0][i] = op[0][i] || q.defaults[i] ;
			}

			//console.log(repeat,sync,offset,op[0])

			GSAP_method(q.timeline,id,dur,{
				options:op[0],
				offset:offset,
				sync:sync,
				repeat:repeat
			},method);
		}else{

			for( i in q.defaults ){
				op[0][i] = op[i] || q.defaults[i] ;
			}

			GSAP_method(q.timeline,id,dur,{
				options:op[0],
				options2:op[1],
				offset:offset,
				sync:sync,
				repeat:repeat
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

	q.jig = function(e,preset,options,timeOptions){

		var repeat,
			sync,
			id;

		if(q.wrapper !== undefined){
			if(q.wrapper.id !== undefined){
				id = (q.wrapper.id !== e) ? q.wrapper.id+' '+e : e;
			}
		}else{
			id = e
		}

		if(timeOptions){
			sync = (timeOptions.sync !== undefined)? timeOptions.sync : undefined;
			repeat = timeOptions.repeat || undefined;
		}

		var newOptions = [];

		for( i in options ){
			//console.log(options[i])
			newOptions[i] = options[i] || q.defaults[i] ;
			//console.log(newOptions[i])
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
			this.timeline.jig.apply(this.timeline,[id,preset,newOptions,sync,repeat]);
		}else{
			console.log('You need to include a version of jig.js');
		}

		return this;
	};

	q.staggerJig = function(e,preset,options,timeOptions){

		var i,k,
			repeat,
			sync,
			offset,
			idGroup;

		if(timeOptions){
			sync = timeOptions.sync || undefined;
			repeat = timeOptions.repeat || undefined;
			offset = timeOptions.offset || undefined;
		}

		// Need to check if sync is passed as a number, if not we need a number.
		if( sync !== undefined ){
			if(isNaN(sync)){
				sync = this.timeline.getLabelTime(sync);
			}
		}else{
			sync = 0;
		}

		if(typeof e === 'string'){

			// if it has a wrapper and is a class or tag.
			if(q.wrapper !== undefined){
				if(q.wrapper.id !== undefined){
					idGroup = getNodes(q.wrapper.id+' '+e);
				}
			}else{
				idGroup = getNodes(e);
			}
			// if it returns a signel object
			if(typeof idGroup !== 'object'){
				idGroup = [idGroup];
			}

		}else{

			// if it is an array/object with a wrapper
			if(q.wrapper !== undefined){
				if(q.wrapper.id !== undefined){
					for( i = 0 ; i<e.length ; i++){
						idGroup[i] = getNodes(q.wrapper.id+' '+e[i]);
					}
				}
			}else{
				idGroup = e;
			}

		}

		// If jig library is included
		if(this.timeline.jig){

			for( i = 0 ; i<idGroup.length ; i++){
				this.timeline.jig.apply(this.timeline,[idGroup[i],preset,options,sync,repeat]);
				sync += offset
			}


		}else{
			console.log('You need to include a version of jig.js');
		}

		return this;
	};

	// -----------------------------------
	// GSAP Methods

	q.to = function(id,dur,op,timeOptions){ do_GSAP(id,dur,[op],timeOptions,'to'); return this; };

	q.from = function(id,dur,op,timeOptions){ do_GSAP(id,dur,[op],timeOptions,'from'); return this; };

	q.fromTo = function(id,dur,op,op2,timeOptions){ do_GSAP(id,dur,[op,op2],timeOptions,'fromTo'); return this; };

	q.staggerTo = function(id,dur,op,timeOptions){ do_GSAP(id,dur,[op],timeOptions,'staggerTo',0.3); return this; };

	q.staggerFrom = function(id,dur,op,timeOptions){ do_GSAP(id,dur,[op],timeOptions,'staggerFrom',0.3); return this; };

	q.staggerFromTo = function(id,dur,op,op2,timeOptions){ do_GSAP(id,dur,[op,op2],timeOptions,'staggerFromTo',0.3); return this; };

	q.yoyo = function(id,dur,op,op2,timeOptions){

		// this function allows you to explicity state the starting and ending point of the animtion, 
		// like fromTo, or only state the ending state and by default animate from the resting state of your DOM node.
		// it does this by checking the attributes of your passed objects (associative arrays) and comparing them to expected values.

		var i,c = 0,c1,c2,c3,
			ops = {},
			ops2 = {},
			timeOps,
			styles = jQuery(id).parseStyles();

		// see if op2 has been ommited by being replaced with timeOptions
		if(op2 !== undefined){
			c1 = (op2.sync !== undefined) ? c+=1 : undefined ;
			c2 = (op2.repeat !== undefined) ? c+=1 : undefined ;
			c3 = (op2.offset !== undefined) ? c+=1 : undefined ;
		}

		// if op2 is timeOptions
		if(c>0){

			timeOps = op2
			for( i in op ){ ops[i] = (i !== 'scale') ? ops[i] = 0 : ops[i] = 1; }
			ops2 = op;

		}else{

			if(op2 === undefined){
				ops2 = op;
				for( i in op ){ ops[i] = (i !== 'scale') ? 0 : 1 ; }
				timeOps = {};

			}else{
				ops = op;
				ops2 = op2;
				timeOps = (timeOptions !== undefined) ? timeOptions : {};
			}

		}

		// Animate with Greensock
		do_GSAP(id,dur,[ops,ops2],timeOps,'yoyo');

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
					'pointer-events':'inherit'
				}})
			}
		}else{
			TweenMax.set(selector,{css:{
				'visibility':'visible',
				'opacity':'1',
				'pointer-events':'inherit'
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

		return this;
	};

	q.loop = function(times){
		if(times === 'forever' || times ===undefined){
			q.set({repeat:-1});
		}else{
			q.set({repeat:times});
		}
	};

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

	q.kill = function(vars,suppressEvents,ignoreAffectees){
		
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

	q.play = function(from,suppressEvents,callback,ignoreAffectees){

		function affectees(_this){
			var i;
			var prog = _this.timeline.progress();

			if(ignoreAffectees === undefined || ignoreAffectees === true && _this.affectees.length > 0){
				for( i in _this.affectees ){
					if(i !== 'length'){
						if(prog === 0 || prog === 1){
							//console.log('>> play affectee '+_this.timeline.progress());
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

	q.pause = function(atTime,suppressEvents,ignoreAffectees){
		
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

	q.restart = function(includeDelay,suppressEvents,callback,ignoreAffectees){

		//console.log('restarting ' + this)

		function affectees(_this){
			var i;
			//console.log(_this, _this.timeline.progress())
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
		
		options.immediateRender = options.immediateRender || true;
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

	This class has playback feedback and stores locks, which are labels that indicate 
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
	q.locks = [];
	q.type = 'scene';

	// at the point you have this in yor method chain the timeline is erased
	q.wipe = function(){
		q.timeline.addCallback(function(){
			q.clear();
		});

		return q;
	};

	if(options){
		if(options.paused !== undefined){ 
			if(options.paused === true){
				q.timeline.pause(); 
			}else{
				q.timeline.play(); 
			}
		}else{
			q.timeline.pause(); 
		}

		q.wrapper = (options.wrapper) ? new Item(options.wrapper) : undefined ;
		q.name = options.name || 'scene' ; 
		q.timeline.name = q.name;
		q.scoID = options.scoID || 'null' ;
		q.soundtrack = options.soundtrack || undefined ;
		overwrite = options.defaultOverwrite || 'auto' ;
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
		options.affectees = options.affectees || true;
		options.defaultOverwrite = options.defaultOverwrite || 'auto' ;
	}

	q = new Scene(options);
	q.type = 'item';

	// a way to identify the items DOM element via string
	q.id = bind;

	// The dom element bound to the item
	q.element =  getNodes(bind);
	q._elements.push(q.element);

	/* 	An array of actions or functions that this item will execute while it's timeline 
		is running */
	q.actions = [];
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
		q.value = options.value || undefined;
		q.style = options.style || undefined;
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


	lock( options )
	----------------------------------------------------------------------------------------
	This method allows the developer to disable or enable the button instance
	at a certain point in the timeline.

	lock's counter method is unlock(), which accepts no options and happens immediatley on call.

	It does this by creating an encrypted label ( native ability in TimelineMax ) and placing it on the timeline.
	It then checks to see if that lable has passed or not. The label will trigger the button's change in state.

		options:object
		--------------------------------------------------------
		an object containg key value pairs.

			-- on:Scene
				--- the Scene or any other GSAPObject you want this lock to be dependent on
			-- from:number*
				--- when the lock whould occur ( when the button is disabled )
			-- until:number**
				--- when the lock should end ( when the button is enabled )

			* ommiting 'from' will result in the button being disabled from 0 to indicated 'until' value.
			** ommiting 'until' will simply lock the button from the 'from' value indefinatley.



	enable() and disable()
	-----------------------------------------------------------------------------------------
	This method is much like lock, however both are invoked at the time they are called.
	The disable method assigns a class of 'disabled' to the buttons DOM element.
	enable removes the disabled class.
*/
function Button(bind, options){

	var q = (typeof bind === 'object') ? bind : new Item(bind,options) ;
	q.type = (typeof bind === 'object') ? 'button extended '+bind.type : 'button' ;

	jQuery(q.id).css({
		'cursor':'pointer',
		'-webkit-user-select': 'none', /* Chrome/Safari */        
		'-moz-user-select': 'none', /* Firefox */
		'-ms-user-select': 'none' /* IE10+ */
	});
	
	if(options){
		q.group = options.group || undefined ;
		if(options.checkbox === '>self'){
			q.checkbox = q.id;
		}else{
			q.checkbox = options.checkbox || undefined;
			q.checkbox = (options.checkbox) ? bind+' '+options.checkbox : undefined ;
		}	
	}

	q.active = false;
	q.down = false;
	q.over = false;
	q.locked = false;

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

			if(!this.locked){

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

	q.toggle = function(ev){
		
		var _this = this;

		this.element[ev] = (function(_t,e){
			return function(){
				if(_this.active){
					_this.pause();
					e.apply(_this,arguments);
					_this.active = false;
					//console.log(_this.active)
					//console.log(_t.active)
				}else{
					_this.play();
					e.apply(_this,arguments);
					_this.active = true;
					//console.log(_this.active)
					//console.log(_t.active)
				} 
			}
		})(this,this.element[ev])
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
				if(!q.locked){
					callback();
					e.call(this,arguments);
				}
			};
		})(q.element[mouseEvent],q);

		
		return this;
	};

	// Used to disable mouse events at specified points in a timeline. This is independent of using css 'pointer-events', which trumps this method.
	q.lock = function(options){
	// OPTIONS: { on:scene, from:number, until:number }, if you pass no options it will just set the item to locked
		
		var scene, 
			from,
			until,
			fromLabel,
			untilLabel;

		jQuery(q.element).css('cursor','auto');

		if(options){
			scene = options.on || q;
			from = options.from || 'z';
			until = options.until || 'z';

			fromLabel = 'lock_'+scene.locks.length+'f';
			untilLabel = 'lock_'+scene.locks.length+'u';

			if(from === 'z'){ from = 0; }
			scene.timeline.addLabel(fromLabel,from);

			if(until !== 'z'){ 
				scene.timeline.addLabel(untilLabel,until);
			}

			scene.locks.push({
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

			//console.log(scene.type)

			// if the scene needs to watch for the lock, but has no controller.
			if(scene.controller === undefined){
				scene.interval = setInterval(function(){
					if(scene.timeline.progress() > 0 && scene.timeline.progress() < 1){
						//console.log('checking')
						checklocks(scene);
					}
				},100)
			}

		}else{
			q.locked = true;
		} 

		return q;	
	}; 

	q.unlock = function(){

		jQuery(q.element).css('cursor','pointer');
		q.locked = false;

		return q;
	};

	q.clearlocks = function(){
		
		if(q.interval !== undefined){
			try{
				clearInterval(q.interval);
			}catch(e){
				// fail silently
			}
		}

		q.interval = undefined;
		q.locks = [];
			
		return q;
	};


	// Same as lock and unlock except it also affects the elements class, allowing styling.
	q.enable = function(){
		q.unlock(); 
		jQuery(q.id).removeClass('disabled').children().removeClass('disabled');
	};

	q.disable = function(){
		q.lock(); 
		jQuery(q.id).addClass('disabled').children().addClass('disabled');
	};


	/* you can create additional events, but be aware you cannot overwrite
	others, so interference is always likley if you are animating the 
	same attribute as the default timeline's animtion is.*/
	q.bindOn = function(e){

		if(e.mouseover){
			q.element.onmouseover = ( function(e,self,v){
				return function(){
					if(!self.locked){
						v.mouseover.call(self,q.id);
						e.call(self,e);
					}
				};
			})(q.element.onmouseover,q,e);
		}

		if(e.mouseout){
			q.element.onmouseout = ( function(e,self,v){
				return function(){
					if(!self.locked){
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
					if(!self.locked){
						v.mousedown.call(self,q.id);
						e.call(self,e);
					}
				};

			})(q.element.onmousedown,q,e);
		}

		if(e.mouseup){
			q.element.onmouseup = ( function(e,self,v){
				//console.log('added mousedown to '+q.id)
				return function(){
					if(!self.locked){
						v.mouseup.call(self,q.id);
						e.call(self,e);
					}
				};

			})(q.element.onmouseup,q,e);
		}


		return q;

	};

	return q;
}


// ========================================
// Crate
// ----------------------------------------

// This creates a new item of a specified type that wraps other items (contents) in the DOM.

function Crate(wrapper,contents,options){

	var i;
	var q;
	var j;
	var newName = removePrefix(name);
	var cr8;
	var wrapIn;
	var ct = [];
	var newPos = {};
	var totals = {};
	var styles;
	var thisStyle;
	var type;
	var appendTo;


	var filteredOptions;
	var emptyPos = {
		'margin':'0',
		'margin-left':'0',
		'margin-right':'0',
		'margin-top':'0',
		'margin-bottom':'0',
		'left':'0',
		'right':'0',
		'top':'0',
		'bottom':'0',
		'position':'absolute',
		'display':'block',
		'text-align':'left'
	};

	appendTo = (options) ? options.appendTo : undefined ;
	wrapIn = jQuery( wrapper )[0] || jQuery('<div id="'+removePrefix(wrapper)[1]+'"></div>').appendTo( appendTo || document.body );


	//var relativeTo = jQuery(options.placeHere).getStyles();

	//if(contents.length && contents.length > 1){

		// --------------------------------------------
		// Preserve Placement

		for(i = 0 ; i<contents.length ; i++){
			ct[i] = {};
			ct[i]['left'] = (jQuery(contents[i].id).css('left'));
			ct[i]['right'] = (jQuery(contents[i].id).css('right'));
			ct[i]['top'] = (jQuery(contents[i].id).css('top'));
			ct[i]['bottom'] = (jQuery(contents[i].id).css('bottom'));
		}
		for( i = 0 ; i< ct.length ; i++){
			
			for( j in ct[i]){
				if(emptyPos[j] !== undefined){
					// get the smallest value and use that value
					if( parseInt(emptyPos[j],10) > 
						parseInt(ct[i][j],10) 
					){
						emptyPos[j] = ct[i][j];
					}
				}else{
					emptyPos[j] = ct[i][j];
				}
			}
		}

	
		for( i = 0 ; i<contents.length ; i++){

			var _self = jQuery(contents[i].id).getStyles();
			totals = emptyPos;

			jQuery(contents[i].id).parents().each( function(){

				var _jThis = jQuery(this);
				styles = _jThis.getStyles();

				for( j in emptyPos ){

					thisStyle = parseInt(styles[j],10);	

					if(!_jThis.is('body') && 
						!isNaN(thisStyle) && 
						thisStyle !== parseInt(totals[j])
					){
					
						if(parseInt(relativeTo[j])){
							if(relativeTo[j]>totals[j]){
								totals[j] -= ( parseInt(relativeTo[j])-parseInt(thisStyle,10) );
							}else{
								totals[j] += ( parseInt(relativeTo[j])+parseInt(thisStyle,10) );
							}
						}else{
							if(relativeTo[j]>totals[j]){
								totals[j] -= parseInt(thisStyle,10);
							}else{
								totals[j] += parseInt(thisStyle,10);
							}
						}
						
					}
				}

			});

			//jQuery(contents[i].id).css(totals);
			jQuery(contents[i].id).appendTo(wrapIn);

			if(options && options.class){ jQuery(wrapIn).addClass( options.class || 'crated' ) }
			

			//console.log(totals)
			//console.log(contents[i].id)
			//console.log('------------------------------');
		}

	/*}else{

		// ---------------
		// Simple Crate
		// ---------------

		if(contents.length <= 1){
			console.log('pass 1 item, not an array');
		}else{
			cr8 = jQuery(contents.id).clone();
		}

		cr8.empty();
		cr8.attr('id',newName[1]);
		cr8.clonePosition(contents.id);
		jQuery(contents.id).clearPosition();
		jQuery(contents.id).wrap(cr8);

	}*/


	// Create a Jive Object
	// -----------------------------------

	var validTypes = { 'item':Item, 'button':Button, 'drag':Drag };

	if(options !== undefined){
		if(options.type){ type = validTypes[ options.type ]; delete options.type; }else{ type = Item; }
	}else{
		type = Item;
	}

	var instance = new type('#'+wrapIn[0].id, options);
	var names = [];

	if(options){
		if(options.affect && options.affect === true){

			for( i = 0 , k = contents.length ; i<k ; i++){
				names.push( wrapIn[0].id+'_crated_'+i);
			}
			
			instance.affect(contents,names);
			console.log(instance.affectees)
		}
	}

	return instance;
}

// =======================================
// Img
// ---------------------------------------

/*
	Img allows us to control the source of an img tag or add an img to a div.

	It holds source paths to as many images as you want and will swap out
	the current img's src attribute with another one you store in the class.

	Useful for changing the 'state' of a button if it is an image or anything
	else css cannot handle rationally.
*/

function Img(bind, options){

	var i,k, 
		q = new Item(bind,options);
	q.sources = [];
	q.urlPaths = [];
	q.type = 'image';
	q.nodeName = q.element.nodeName;
	q.current = 0;

	// preload our additional images
	function preload(){
		for( i = 0 , k=preload.arguments.length ; i<k ; i++ ){
			q.urlPaths.push( preload.arguments[i] );
			q.sources.push( new Image() );
			q.sources[q.sources.length-1].src = preload.arguments[i];
			/*q.sources[q.sources.length-1].onload = function(){
				console.log(this.src+' has loaded');// confirm load (debug)
			}*/
			console.log(q.sources)
		}
	}

	function translate(path){

		var s = path.indexOf('M'),
			e = path.indexOf('Z');

		return path.substring(1,e-1).trim().replace(/\s/g,',').replace(/L+,/g,'');

	}

	if(options !== undefined ){
		
		if(options.map !== undefined){

			if( !jQuery(options.map).exists() ){
				
				if(q.map === undefined){ q.map = {} };

				q.map.nodeString = '<map id="'+options.map.substring(1)+'" name="'+options.map.substring(1)+'"></map>';
				jQuery(document.body).append(q.map.nodeString);
				q.map.id = options.map;
				jQuery(q.element).attr('usemap',options.map);

			}

		}else{
			q.map = {};
			q.map.id = options.map;
		}
	}

	q.include = function(){
		preload.apply(this,arguments)
		return q;
	}

	q.place = function(index){
		if(q.current !== index){
			if( q.sources[index] !== undefined){

				// Keep it native
				var atrs = {
					'id':jQuery(q.id).attr('id'),
					'class':jQuery(q.id).attr('class'),
					'usemap':jQuery(q.id).attr('usemap')
				};

				for( i in atrs ){
					if(atrs[i] !== undefined){
						q.sources[index].setAttribute(i, atrs[i]);
					}
				}

				jQuery(q.id).replaceWith(q.sources[index]);
			}
			q.current = index;
			return q;
		}
	}

	q.modSpot = function(index,newPath){
		var spot = (typeof index !== 'number') ? getNode(index) : q.map.areas[index].node ;
		spot.setAttribute('coords',translate(newPath))
		return q;
	}

	q.hotspot = function(path, func, returnCoords){ 

	/* 
		Hotspot makes image maps based on SVG path data. And link it
		to the Image instance.

		Why SVG? because lots of things use SVG and SVG is easy to 
		read and write when compared to imagemaps coord native values.

		Further there is a growing popularity of SVG because of it's
		breadth of use, certain libraries like Rapheal and D3 are dedicated
		to drawing SVG, so in theroy making hotspots based on SVG is best

		You must use M, L and Z currently, the coordinates must be in absolute space.
		No Cubic Bezier support.

		from: http://www.w3.org/wiki/HTML/Elements/area
		The area elements must have a coords attribute with at least six integers, 
		and the number of integers must be even. Each pair of integers must represent 
		a coordinate given as the distances from the left and the top of the image in 
		CSS pixels respectively, and all the coordinates together must represent 
		the points of the polygon, in order.
	*/

		var i,s,e,f,path;

		if(q.map === undefined){ q.map = {} }
		if(q.map.areas === undefined){ q.map.areas = []; }
		
		var name = q.map.id.substring(1);

		q.over = false;
		q.path = path;

		i = q.map.areas.length;

		q.map.areas[i] = {};
		q.map.areas[i].path = q.path;

		q.path = translate(q.path);
		q.map.areas[i].nodeString = '<area name="'+i+'_'+name+'" shape="poly" coords="'+q.path+'"/>';

		s = q.map.nodeString.substring( 0,q.map.nodeString.indexOf('>')+1 ); // starting map tag
		e = q.map.nodeString.slice( q.map.nodeString.indexOf('>')+1 ); // ending map tag

		q.map.node = jQuery("map[name="+name+"]")[0];
		q.map.areas[i].node = jQuery(q.map.areas[i].nodeString).appendTo("map[name="+name+"]")[0];
		
		// Now we make our area a button! jQuery let us do this with the CSS selector, this process may ge clunky (nature of the selector) if done too mauch and too often.
		q.map.areas[i].button = new Button("area[name="+i+'_'+name+"]").bindOn({
			mouseover:function(){
				if(func.mouseover !==  undefined) func.mouseover(); // only assign a function if it was defined.
			},
			mouseup:function(){
				if(func.mouseout !==  undefined) func.mouseout();
			},
			mousedown:function(){
				if(func.mousedown !==  undefined) func.mousedown();
			},
			mouseup:function(){
				if(func.mouseup !==  undefined) func.mouseup();
			}
		});

		delete q.path;
		return (returnCoords) ? q.path : q ;
	}

	q.removeSpot = function(index){
		var spot = (typeof index !== 'number') ? getNode(index) : q.map.areas[index].node ;
		q.map.node.removeChild(spot);
		return q;
	}

	q.drop = function(index){
		delete q.sources[index];
		delete q.urlPaths[index];
		return q;
	}

	// capture the intial image.
	if(jQuery(bind).get(0).nodeName === 'IMG'){
		q.include( jQuery(bind).attr('src') );
	}

	return q;
}


// =======================================
// DropSpot
// ---------------------------------------

/*
DropSpot is Drag's partner in crime, it is mostly intended to be used with the Drag and Drop test class.
*/

////

function DropSpot(bind,options){

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
			if(e.dragging){
				q.whileDragging = ( function(evnt,self,e){
					return function(){
						if(!self.locked){
							e.dragging.call(self,q.id);
							evnt.call(self,e);
						}
					};
				})(q.whileDragging,q,e);
			}

			if(e.drag){
				q.onDrag = ( function(evnt,self,e){
					return function(){
						if(!self.locked){
							e.drag.call(self,q.id);
							evnt.call(self,e);
						}
					};
				})(q.onDrag,q,e);
			}

			if(e.dragend){
				q.onDragEnd = ( function(evnt,self,e){
					return function(){
						if(!self.locked){
							e.dragend.call(self,q.id);
							evnt.call(self,e);
						}
					};
				})(q.onDragEnd,q,e);
			}

			f.call(e,q);

			instance(); // recreate an instance, rebind the functions.

			return q;
		};

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
				q.whileDragging(); window.requestAnimationFrame(q.interval)
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
			region = options.bounds.id || options.bounds;
		}

		// perform function on drag end
		if(options.onDragEnd){
			q.onDragEnd = (function(self,e,v){
				return function(){
					v.call(self,q.id);
					e.call(q,e);
				}
			})(q,q.onDragEnd,options.onDragEnd);
		};
		
		// perform function on drag start
		if(options.onDrag){
			q.onDrag = (function(self,e,v){
				return function(){
					v.call(self,q.id);
					e.call(q,e);
				}
			})(q,q.onDrag,options.onDrag);
		};

		// index for hittest purposes
		q.index = (options.index) ? options.index : 0 ;
		
		// parent property is used when drag is part of a scrubber and scrubbar
		if(options.parent){

			if(options.parent.onDrag){
				q.onDrag = (function(self,e){
					return function(){
						options.parent.onDrag();
						e.call(self,q.id);
					};
				})(q,q.onDrag);
			}

			if(options.parent.onDragEnd){
				q.onDragEnd = (function(self,e){
					return function(){
						options.parent.onDragEnd();
						e.call(self,q.id);
					};
				})(q,q.onDragEnd);
			}
		}
	};

	function instance(){

		if(q.dragEngine !== undefined){
			q.dragEngine.kill();
		}

		q.dragEngine = Draggable.create( q.element, {
			type:"x,y", 
			bounds:region,
			onDrag:q.onDrag,
			onDragEnd:q.onDragEnd
		})[0];
	}

	instance();

	return q;
}

/*function Media(bind, options){ 

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
		q.stopped = options.paused || false;
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

			clearInterval(this.interval);
			this.interval = undefined;
				
			if(this.controller.stopped){ this.controller.pause(); }else{ this.controller.play(); }
				
		}

	};

	q.onDrag = function(){
		q.watch(true);
		this.dragging = this.scrubber.dragging;
	};

	q.onDragEnd = function(){
		q.watch(false);
	};

	q.bind = function(options){
		if(options){
			q.bar = options.bar || undefined ;
			q.scrubber = options.scrubber || undefined ;
			q.controller = options.controller || undefined;
			q.fill = options.fill || undefined ;
		}
	};

	return q;
}

function ProgressBar(bind, options){
	var q = new Item(bind,options);

	if(options){
		q.stopped = options.paused || false ;
		q.scrubber = options.scrubber || undefined ;
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
		q.bar = options.bar || 'null';
	}

	return q;
}
