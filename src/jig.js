/*
	=============================
	jig and jigLibrary
	-----------------------------

	=================
	CONSTRUCTOR
	=================

	GSAPObject.jig( id,preset,options,timeOptions )
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


	=====================
	JIGS - IN DEPTH
	=====================
	Jigs/Presets accept the options argument from the jig constructor. Different presets or 'jigs' use different default arguments 
	to affect thier preset animations.

	presets should be combined with other animations with care, as they affects many css states and can cause undesired results 
	if not treated as an isolated animation event. for instance, if a preset affects a elements position, animating the elements
	position simultanisouly with another preset or animation instance will likley result in in undesired effects.

	presets are meant to save time when animating redundantly, not so much to save time in creating complex animation instances.
	If you need to 'double' up on animations like this, consider using the crate method from the services.js. 
	which will create a wrapper for the element that you can then animate.

	Key Value Pair Terminology Defintions
	----------------------------------------------
	
		speed:number
		------------
			the duration of an animation
	
		strength:number
		---------------
			a relative measure of how 'much' it moves, how high it will hop or how far it will fly, for example.
		
		density:number
		--------------
			if the animation is emulating a material, for instance: the less density a 'hop' preset has, the more it's going 
			to recoil or squish on contact with the baseline or ground. 
		
		scale:number
		------------
			a relative value of how much to scale the element within the preset animation
	
		bol:boolean
		-----------
			a very special value, in animations where something is hepeneing that may change or alternate in state, the bol can 
			remove this alternation or activate it, 'hop' uses this for it's rotation when the lement is at it's highest point in the hop.
	
		rotation:number or string
		--------------------------
			rotation of the element
		
		origin:string
		--------------
			'transformOrigin', refer to this documentation: http://greensock.com/docs/#/HTML5/GSAP/Plugins/CSSPlugin/
		
		ease:string
		-----------
			'ease', refer to this doucmentation: http://greensock.com/docs/#/HTML5/GSAP/Easing/


	----------------------------------------------------------------------------
	The following will indicate which key value pairs 
	( stated in the options argument of the constructor ) 
	are valid when calling an instance of the preset in question.

	> pulse
	-----------------------------
	speed:number

	> squish
	-----------------------------
	speed:number
	strength:number
	
	> fly
	-----------------------------
	speed:number
	strength:number
	
	> hop
	-----------------------------
	speed:number
	strength:number
	density:number
	scale:number
	bol:boolean
	rotation:number
	origin:string
	
	> wiggle
	-----------------------------
	speed:number
	strength:number
	origin:string
	
	> chromaZoom
	-----------------------------
	speed:number
	strength:number
	rotation:number
	origin:string
	ease:string
	
	> spin
	-----------------------------
	speed:number
	ease:string

	> slideIn
	-----------------------------
	speed:number
	strength:number
	ease:string

*/
// 'sticks' an animation directly to a timeline using the native TimelineLite methods
TimelineMax.prototype.stick = function(timeline,options,sync){
	// timeline instance { piggy:boolean, label:boolean, cycles:integer }

	// variables ----------------------
	var tween = TweenMax,
		name = (options.label) ? options.label : 'untitled',
		piggy = (sync === 'piggy' || sync === '>' || sync === undefined) ? true : false;

	/* next we control where the animation is injected into the timeline. 
	We cannot sync an animation before the first millisecond of animation, 
	so -1 is a good way to say 'false' without changing the type.*/

	if(piggy){
		this.add( timeline ); // jig (timeline)
		this.add( name ); // label
	}else{
		this.add( timeline, sync );
		this.add( name, sync );
	}
};
// 'initiates' an controlled instance of animation to the object in question
TimelineMax.prototype.jig = function(element,preset,options,sync,repeat){

	// overwrite defaults if options do not match them
	var i,
		offset, 
		created,
		isLastLoop = false,
		newOptions = {},
		objectCSS = jQuery(element).getStyles();

	for( i in jigLibrary.defaults ){
		
		if(options !== undefined){
			//console.log(i + ' --- '+options[i])
			newOptions[i] = (options[i] === undefined) ? jigLibrary.defaults[i] : options[i];
		}else{
			newOptions = jigLibrary.defaults;
		}
	}

	created = jigLibrary[preset]( element, newOptions, objectCSS, isLastLoop);
	this.stick(created,newOptions,sync);

	if(repeat !== undefined){
		for(i = 0 ; i<repeat ; i++){
			
			offset = (sync!==undefined && sync>0)? sync+newOptions.speed*i : newOptions.speed*i ;

			console.log(sync+' + '+newOptions.speed+' * '+i+'    '+newOptions.speed+' * '+i+'     '+offset)

			isLastLoop = (i === repeat-1) ? true : false ;
			created = jigLibrary[preset]( element, newOptions, objectCSS, isLastLoop );

			this.stick(created,newOptions,offset);

		}
	}

	// return -------------------------
	return this;
};

TweenMax.fadeIn = function(id,speed,callback){
	var speed = (speed !== undefined) ? speed : 1 ;
	this.fromTo(getNodes(id),speed,{opacity:0, immediateRender:false},{opacity:1, onComplete:callback});
};

TweenMax.fadeOut = function(id,speed,callback){
	var speed = (speed !== undefined) ? speed : 1 ;
	this.fromTo(getNodes(id),speed,{opacity:1, immediateRender:false},{opacity:0, onComplete:callback});
};

// Jig Library
// ---------------------------------------

var jigLibrary = {
	author:'Adam Goodnight',
	version:'0.6',
	defaults:{
		from:0,
		to:0,
		speed:1,
		strength:1,
		extra:true,
		origin:'50% 50%',
		rotationY:0,
		density:0.8,
		scale:1,
		bol:true,
		ease:'Sine.easeOut'
	}
};

jigLibrary.pulse = function(e,o,css,last){

	var tl = new TimelineMax();

	tl.set(e,{transformOrigin:o.origin});
	tl.to(e,o.speed/3,{opacity:1});
	tl.to(e,o.speed/3,{opacity:0.4});
	tl.to(e,o.speed/3,{opacity:1});

	return tl;
};

jigLibrary.squish = function(e,o,css,last){

	var tl = new TimelineMax();
	var strength = 1-(o.strength*0.1);

	tl.add(
		TweenMax.to(e,o.speed/2,{ scaleY:strength, transformOrigin:'100% 100%'})
	);

	tl.add(
		TweenMax.to(e,o.speed/2,{ scaleY:1, transformOrigin:'100% 100%'})	
	);

	return tl;
};

jigLibrary.fly = function(e,o,css,last){
	
	var tl = new TimelineMax();
	var fromX = (parseInt(css.width,10)/o.strength/3)*-1;
	var fromY = (parseInt(css.height,10)/o.strength)*2;

	tl.from(e,o.speed,{transformOrigin:'0% 50%', scale:1.2,opacity:0,rotationY:-90,rotationX:-40});

	return tl;
};

jigLibrary.hop = function(e,o,css,last){

	var tl = new TimelineMax();

	o.bol = (o.bol)? false : true ;

	if(unNull(o.rotation)){
		o.rotation = '30'
	}

	o.origin = '50% 100%';

	var i = 0,
		f = 0,
		b = ((o.bol)? o.rotation+'deg' : -1*o.rotation+'deg'),
		s= [o.speed/6,o.speed/3,o.speed/4],
		hopHeight = o.strength*(parseInt(css.height,10));


	while(i < s.length-1){
		f += s[i];
		i++
	}

	s[3] = o.speed-f;

	//console.log(s[0]+s[1]+s[2]+s[3])
	
	tl.set(e,{transformOrigin:o.origin});

	tl.to(e,s[0],{
		scaleX:o.scale*1+(1-o.density),
		scaleY:o.scale*1-(1-o.density),
		ease:'Expo.easeIn'
	});

	tl.to(e,s[1],{
		scaleX:o.scale*1-(0.9-o.density),
		scaleY:o.scale*1+(0.9-o.density),
		y:'-='+hopHeight,
		ease:'Linear',
		rotation:'+='+b
	});

	tl.to(e,s[2],{
		scaleX:o.scale*0.8+(1-o.density),
		scaleY:o.scale*1-(1-o.density),
		y:'+='+hopHeight,
		ease:'Sine.easeIn',
		rotation:0
	});

	tl.to(e,s[3],{
		scaleX:o.scale,
		scaleY:o.scale,
		ease:'Sine.easeOut'
	});

	return tl;
};

jigLibrary.wiggle = function(e,o,css,last){
	
	var tl = new TimelineMax();
	
	tl.to(e,o.speed/2,{
		rotation: o.strength*10,
		ease:'Sine.easeInOut',
		transformOrigin:o.origin
	});

	if(last){
		tl.to(e,o.speed/2,{
			rotation:0,
			ease:'Sine.easeInOut'
		});
	}else{
		tl.to(e,o.speed/2,{
			rotation: o.strength*-10,
			ease:'Sine.easeInOut'
		});
	}

	return tl;
};

jigLibrary.chromaZoom = function(e,o,css,last){

	var tl = new TimelineMax();
	var spectrum = ['#FF0000','#FF7F00','#FFFF00','#00FF00','#0000FF','#6600FF','#8B00FF'];

	//console.log(o)

	tl.fromTo(e,o.speed/2,{
		opacity:1,
		scale:0,
		rotationY:o.rotation,
		color:tinycolor(arrayRandomize(spectrum)[0]).brighten(50).toHexString(),
		ease:o.ease
		},
		{
		opacity:1,
		scale:1,
		rotationY:0,
		color:tinycolor(arrayRandomize(spectrum)[0]).brighten(50).toHexString(),
		ease:o.ease
		}
	);
	
	tl.to(e,o.speed/4,{
		color:tinycolor(css.color).brighten(100).toString() 
	});

	tl.to(e,o.speed/4,{
		color:css.color
	});

	return tl;
};

jigLibrary.spin = function(e,o,css,last){

	var tl = new TimelineMax();
	tl.to(e,o.speed,{rotationZ:'+=360',ease:o.ease});
	return tl;
};

jigLibrary.slideIn = function(e,o,css,last){
	var tl = new TimelineMax();
	tl.from(e,o.speed,{opacity:0,x:-50*o.strength,ease:o.ease})
	return tl;
};