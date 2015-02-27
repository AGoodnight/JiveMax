function ClickToPresent(wrapper,scenes,options){

	var i,k;

	var q = {};
	q.controller = new SceneController({
		scene:scenes[0]
	});

	if(window._ready === undefined){
		window._ready = true;
	};

	q.scenes = scenes;
	q.hotspots = {};
	q.modalTriggers = {};
	q.current_scene = 0;
	q.wrapper = wrapper;
	q.interval,
	q.onComplete = function(){};

	if(options){
		q.onComplete = (options.onComplete) ? options.onComplete : (function(){}) ;
		q.controller.userAction = true;
	}

	q.hide = function(){
		for( i = 0, k=q.scenes.length ; i<k ; i++){
			if(q.scenes[i].wrapper !== undefined){
				if(i !== q.current_scene){
					q.scenes[i].wrapper.hide();
				}
			}else{
				if(i !== q.current_scene){
					q.scenes[i].hideAll();
				}
			}
		}

		return this;
	};

	q.show = function(){
		for( i = 0, k=q.scenes.length ; i<k ; i++){
			if(q.scenes[i].wrapper !== undefined){
				if(i === q.current_scene){
					q.scenes[i].wrapper.show();
				}
			}else{
				if(i === q.current_scene){
					q.scenes[i].showAll();
				}
			}
		}

		return this;
	};

	q.exit = function(id,index){

		q.modalTriggers['scene_'+index] = new Button(id)

		.bindOn({
			mousedown:function(){
				if(!q._loading){
					q._loading = true;

					q.modalTriggers.active = true;
					TweenMax.fadeOut(q.wrapper,0.5,function(){
						q.current_scene = index;
						q.hide();
						TweenMax.set(q.wrapper,{css:{'visibility':'hidden', 'pointer-events':'none'}});
						q.controller.kill();
						q._loading = false;
					});
				}
			}
		});

		return this;
	};

	q.hotspot = function(id,index){
		
		var btn;

		if(id.id === undefined){
			btn = new Button(id)
		}else{
			btn=id;
		}

		btn.element.onmousedown = (function(e,self,index){

			return function(){
				if(!q._loading){
					q._loading = true;
					btn.active = true;
					e.call(this);
					q.goTo(index,function(){
						q._loading = false;
						console.log('no longer loading')
					})
					jQuery(q.hotspots[i]).addClass('active');
					
					// reset other hotspots
					for( i in q.hotspots){
						if( i !== 'scene_'+index ){
							q.hotspots[i].active = false;
							jQuery(q.hotspots[i]).removeClass('active');
						}
					}
				}
			}

		})(btn.element.onmousedown,btn,index);

		q.hotspots['scene_'+index] = btn;

		return this;
	};

	q.triggers = function(trigger){

		one_trigger = (typeof trigger === 'object') ? false : true ;

		if(!one_trigger){
			q.trigger_next = (trigger.next) ? new Button(trigger.next) : undefined;
			q.trigger_back = (trigger.previous) ? new Button(trigger.previous) : undefined;
		}else{
			q.trigger_next = new Button(trigger);
		}

		if(q.trigger_next !== undefined){
			q.trigger_next.bindOn({
				mousedown:function(){
					q.next();
				}
			});
		}

		if(q.trigger_back !== undefined){
			q.trigger_back.bindOn({
				mousedown:function(){
					q.previous();
				}
			});
		}

		return this;
	};

	q.goTo = function(sceneIndex,callback){

		setStates(q.hotspots,'frozen',true);

		if(q.trigger_next !== undefined )
			q.trigger_next.frozen = true;

		if(q.trigger_back !== undefined )
			q.trigger_back.frozen = true;

		function func(){
			q.current_scene = sceneIndex;
			q.hide();
			TweenMax.set(q.wrapper,{css:{'visibility':'hidden', 'pointer-events':'none'}});
			q.controller.kill();
			q.controller.swap(q.scenes[q.current_scene],true);
			q.refresh();
			if(typeof callback === 'function') callback();
		}

		if( q.modalTriggers.active !== undefined && 
			q.modalTriggers.active !== false ){
			// If the user closed the modal, no need to fadeout.
			func();
		}else{
			TweenMax.fadeOut(q.wrapper,0.5,func);
		}

		return this;
	};

	q.next = function(){

		setStates(q.hotspots,'frozen',true);
		q.trigger_next.frozen = true;
		q.trigger_back.frozen = true;

		TweenMax.fadeOut(q.wrapper,0.5,function(){
			q.current_scene +=1;
			q.hide();
			TweenMax.set(q.wrapper,{css:{'visibility':'hidden'}});
			q.controller.kill();
			q.controller.swap(q.scenes[q.current_scene],true);
			q.refresh();
		});

		return this;
	};

	q.previous = function(){

		setStates(q.hotspots,'frozen',true);
		q.trigger_next.frozen = true;
		q.trigger_back.frozen = true;
		
		TweenMax.fadeOut(q.wrapper,0.5,function(){
			q.current_scene -=1;
			q.hide();
			TweenMax.set(q.wrapper, {css:{'visibility':'hidden'}});
			q.controller.kill();
			q.controller.swap(q.scenes[q.current_scene],true);
			q.refresh();
		});

		return this;
	};

	q.refresh = function(){

		var previous = (q.scenes[q.current_scene-1] !== undefined) ? true : false ;
		var next = (q.scenes[q.current_scene+1] !== undefined) ? true : false ;
		var trigger_next = (q.trigger_next!== undefined) ? true : false ;
		var trigger_back = (q.trigger_back!== undefined) ? true : false ;
		
		if(trigger_back){
			if(previous){
				if( q.scenes[q.current_scene-1].id !== 'scene'){
					jQuery(q.trigger_back.id).html(''+q.scenes[q.current_scene-1].id);
				}else{
					jQuery(q.trigger_back.id).html('Previous');
				}
			}else{
				jQuery(q.trigger_back.id).html('...');
			}
		}

		if(trigger_next){
			if(next){
				if( q.scenes[q.current_scene+1].id !== 'scene'){
					jQuery(q.trigger_next.id).html(''+q.scenes[q.current_scene+1].id)
				}else{
					jQuery(q.trigger_next.id).html('Next')
				}
			}else{
				jQuery(q.trigger_next.id).html('...');
			}
		}

		// if at the last scene
		if(q.current_scene === q.scenes.length-1){

			if(trigger_next)
				q.trigger_next.disable();

			if(trigger_back)
				q.trigger_back.enable();

			q.onComplete();

		}

		// If at the the first scene
		if(q.current_scene === 0){

			if(trigger_next)
				q.trigger_next.enable();

			if(trigger_back)
				q.trigger_back.disable();
		}

		// if scenes exhist before and after this scene
		if(q.current_scene < q.scenes.length-1 && q.current_scene > 0){

			if(trigger_next)
				q.trigger_next.enable();

			if(trigger_back)
				q.trigger_back.enable();
		}

		q.show();
		q.controller.play(); 
		TweenMax.set(q.wrapper,{css:{'visibility':'visible', 'pointer-events':'auto'}});
		TweenMax.fadeIn(q.wrapper,0.5,function(){
			setStates(q.hotspots,'frozen',false);
			
			if(trigger_next)
				q.trigger_next.frozen = false;

			if(trigger_back)
				q.trigger_back.frozen = false;
		});

		return this;
	};

	if( q.trigger_next === undefined && q.trigger_back === undefined ){
		TweenMax.set(q.wrapper,{css:{'visibility':'hidden', 'pointer-events':'none'}});
	}

	q.controller.init(true);

	return q;

}

// creates a collage of images in a variety of states. such as 'wild' or 'offset' or 'horizontal'
function Collage(wrapper,collection,arg1,arg2,callback){

	var variation = ( (typeof arg1 === 'string') ? arg1 : arg2 ),
		vars = ( (typeof arg2 === 'string') ? arg1 : arg2 );

	var q;
	var f ={}
	var parameter;
	var trigs = ['sine','cos','tan'];

	function checkParameters(obj,alt){

		for( var i in obj ){
			if(i!=='focal' && i!=='axisrandom')
				obj[i] = parseInt(obj[i],10);
		}

		obj.xrandom = (isNaN(obj.xrandom)) ? alt : obj.xrandom;
		obj.yrandom = (isNaN(obj.yrandom)) ? alt : obj.yrandom;
		obj.zrandom = (isNaN(obj.zrandom)) ? alt : obj.zrandom;

		for( i = 0 , j=trigs.length ; i<j ; i++){
			parameter = String('x'+trigs[i]);
			obj[parameter] = (isNaN(obj[parameter])) ? alt : obj[parameter];
			parameter = String('y'+trigs[i]);
			obj[parameter] = (isNaN(obj[parameter])) ? alt : obj[parameter];
			parameter = String('z'+trigs[i]);
			obj[parameter] = (isNaN(obj[parameter])) ? alt : obj[parameter];
		}


		obj.x = (isNaN(obj.x)) ? alt : obj.x;
		obj.y = (isNaN(obj.y)) ? alt : obj.y;
		obj.z = (isNaN(obj.z)) ? alt : obj.z;
		
		obj.rotx = (isNaN(obj.rotx)) ? alt : obj.rotx;
		obj.roty = (isNaN(obj.roty)) ? alt : obj.roty;
		obj.rotz = (isNaN(obj.rotz)) ? alt : obj.rotz;

		obj.rotrandom = (isNaN(obj.rotrandom)) ? alt : obj.rotrandom;

		return obj;
	}

	function createCollage(element_list,stack,vars){

		//console.log(stack.x,vars.x);
		//console.log(stack)
		// -------------------------------------------------------------------------
		// Check for all stack parameters, if not present set to default value
		stack = (stack===undefined) ? {} : checkParameters(stack,0) ;

		// -----------------------------------------------------------------------------
		// If Not GSAP Objects

		for( i = 0 , j=element_list.length ; i<j ; i++){
			if(element_list[i].id === undefined){
				element_list[i] = { id:element_list[i] } 
			}
		}

		// -----------------------------------------------------------------------------

		function axisFlip(){
			if(stack.rotrandom !== undefined && stack.rotrandom > 1){
				return ( Math.floor(Math.random()*2) === 0 ) ? -1 : 1 ;
			}else{
				return 1;
			}
		}

		if(vars === undefined){
			vars.rows = 2;
			vars.gutter = 10;
		}else{
			
			vars.rows = (vars.rows === undefined) ? 2 : vars.rows ;
			vars.gutter = (vars.gutter === undefined) ? 2 : vars.gutter ;
			vars.focal = (vars.focal === undefined) ? undefined : vars.focal ;

			if(vars.focal !== undefined){
				if(vars.focal.id === undefined){
					vars.focal = {id:vars.focal};
				}
			}

		}

		var i,j,k,l,m,m,o,p;

		p = element_list.length,
		o = element_list.length/vars.rows,
		n = Math.floor(o);

		var last = n%1;

		m = Math.floor(last);
		
		var extra = (last === m) ? false : true;
		var _list = element_list.slice();
		
		var arr = [],
			styles = {},
			css ={};

		// -------------------------------
		// Stylize Y then X
		// -------------------------------
		for(i=0, j=vars.rows; i<j ;i++){


			var previous = 0,
				temp = [],
				g=0;
				
			css = {top:0,left:0};
			console.log(styles)
			if(styles['height'] !== undefined){
				css.top += ( styles['height']+(stack.y*(i+1)+vars.gutter) );
			}

			if(n<o && _list.length>o+1){
				var center = true;
			}else{ 
				center = false;
			}

			while(temp.length < n){

				if(_list.length>0 && temp.length>0) styles = jQuery(temp[0].id).parseStyles();	
				temp.unshift(_list.shift());

					if(g>0){
						if(!isNaN(styles['width']) && !isNaN(stack.x) ){
							css.left += Math.floor( (styles['width']*stack.x)+(stack.x*(i+1)+vars.gutter) );
							css.left+=Math.floor(Math.random()*stack.xrandom)*(styles['width']/100)*axisFlip();
						}
					}else{
						
						styles = jQuery(temp[0].id).parseStyles();
				
						if(center){
							css.left+= Math.floor((styles['width']*vars.x)/n);
						}
						css.left+=Math.floor(Math.random()*stack.xrandom)*(styles['width']/100)*axisFlip();
					}

					TweenMax.set(temp[0].id,{ 
						rotationX:'+='+((stack.rotx)+(stack.rotx*Math.floor(Math.random()*stack.rotrandom)))*axisFlip(),
						rotationY:'+='+((stack.roty)+(stack.roty*Math.floor(Math.random()*stack.rotrandom)))*axisFlip(),
						rotationZ:'+='+((stack.rotz)+(stack.rotz*Math.floor(Math.random()*stack.rotrandom)))*axisFlip(),
					});

					css.top+=Math.floor(Math.random()*stack.yrandom)*(styles['height']/100)*axisFlip();

					jQuery(temp[0].id).css(css);
					g++;

			}
		
			// If list length is odd, handle last item.
			if( g>0 && i=== (j-1) && n!==o ){

				
				if(_list.length>0 && temp.length>0) styles = jQuery(temp[0].id).parseStyles();	
				temp.unshift(_list.shift());

				if( !isNaN(styles['width']) && !isNaN(stack.x) ){
					css.left += Math.floor( (styles['width']*stack.x)+(stack.x*(i+1)+vars.gutter) );
					css.left+=Math.floor(Math.random()*stack.xrandom)*(styles['width']/100)*axisFlip();
				}

				TweenMax.set(temp[0].id,{ 
					rotationX:'+='+((stack.rotx)+(stack.rotx*Math.floor(Math.random()*stack.rotrandom)))*axisFlip(),
					rotationY:'+='+((stack.roty)+(stack.roty*Math.floor(Math.random()*stack.rotrandom)))*axisFlip(),
					rotationZ:'+='+((stack.rotz)+(stack.rotz*Math.floor(Math.random()*stack.rotrandom)))*axisFlip()
				});

				css.top+=Math.floor(Math.random()*stack.yrandom)*(styles['height']/100)*axisFlip();

				jQuery(temp[0].id).css(css);

			}

			arr.push(arrayReverse(temp))
		}

		// -------------------------------
		// focal
		// -------------------------------
		css.left+=styles['width'];
		css.top+=styles['height']

		if(vars.focal !== undefined && vars.focal.id !== undefined){
			styles = jQuery(vars.focal.id).parseStyles();
			TweenMax.set(vars.focal.id,{
				x:css.left/2-styles['width']/2,
				y:css.top/2-styles['height']/2
			})

		}

		jQuery(wrapper).css({
			'width':css.left,'height':css.top
		});

		if(callback){
			callback();
		}
		return arr;
	} 

	f["pile"] = function(v){

		v.gutter = (v.gutter === undefined) ? 0 : v.gutter;
		v.gutter -= 100;

		return createCollage(collection,{

			// order of magnitudes
			yrandom:10*v.yrandom, // '' [top]
			xrandom:10*v.xrandom, // '' [left]
			rotz:5*v.rotz,
			rotrandom:5*v.rotrandom,
			y:1*v.x,
			x:1*v.y

			},v )
	};

	f["square"] = function(v){

		return createCollage(collection,{

			// order of magnitudes
			rotx:v.rotx-1,
			roty:v.roty-1,
			rotz:v.rotz-1,
			y:1*v.x,
			x:1*v.y

			},v )
	};

	var spec, cutoff;

	if(variation === undefined)
		variation = 'pile';

	if(f[variation] !== undefined){
		q = f[variation]; // -calls-> createCollage(variation);
		vars = (vars===undefined) ? {} : vars;
		checkParameters(vars,1) ;

		// check if a string
		if(collection[0].substring !== undefined){
			spec = collection[0]
		}else if(collection[0].id !== undefined){
			// if an GSAP object
			spec = collection[0].id
		}

		// In order to let the developer use images instead of individual classes 
		// with background images and specific widths, we created a buffer that waits for a div to at 
		// least have a width when loading content, if the content has been placed and the divs computed
		// style modified we can start manipulating the css as to make our collage.
		cutoff = 0;
		q.checkComputedStyles = setInterval(function(){
			if(cutoff === 400 || jQuery(spec).parseStyles()['width'] > 0){
				clearInterval(q.checkComputedStyles);
				q = q(vars);
			}

			cutoff++

		},10)

	};

	return q;

}