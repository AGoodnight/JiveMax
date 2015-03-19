// ==============================
// Services Package
// ==============================
/* 
	These scripts are helper functions which standalone from any specific class
*/
// ======================
// Geometry
// ----------------------
function getRect(e){

	var i;
	var j = {
		width:parseInt(jQuery(e.id).css('width'),10),
		height:parseInt(jQuery(e.id).css('height'),10),
		left:jQuery(e.id).css('left'),
		top:jQuery(e.id).css('top')
	};

	for(i in j){
		if(j[i] === 'auto'){
			j[i] = 0;
		}
	}

	return j;
}

// ======================
// Translators
// ----------------------

function readlock(lock){

	if(lock){
		var locked;
		var f = lock.split('_');
		f = f.splice(1);
		f = f[0];
				
		var index = f.substr(0,1);
		var key = f.substr(1,1);

		if( key === 'f'){
			locked = true;
		}else if( key === 'u'){
			locked = false;
		}

		return [index,locked];
	}
}

// ======================
// Analyzers
// ----------------------

// lock States
function islockLabel(e){

	var lead = e ? e.substr(0,e.indexOf('_')) : undefined ;
	
	// i just made this private to get in the habit
	return (function(e){
		if(e === 'lock'){
			return true;
		}else{
			return false;
		}
	})(lead);
}

function getlockIndex(e){
	
	var j = e.split('_');
	j = j.splice(1);
	j = j[0];
	j = j.substr(0,1);

	return j;
}

function checklocks(scene){

	var i;
	var j;

	var index;
	var arr;
	var isFrom;
	var thisFrom;

	var c_time = scene.timeline.time(); // get the current time
	//console.log(scene.id)
	var g = scene.timeline.getLabelsArray();

	// --------------------------------------------
	for(i = 0 ; i<g.length ; i++ ){
		
		if( islockLabel(g[i].name) ){
			arr = readlock( g[i].name );
			index = arr[0];
			isFrom = arr[1];
			locked_status = scene.locks[index].item.locked;
			
			// before it reaches the locked state
			// -----------------------------------
			if(isFrom){

				if(c_time < g[i].time ){
					scene.locks[index].from.reached = false;
				}else if(c_time >= g[i].time){		
					scene.locks[index].from.reached = true;
				}

				if(scene.locks[index].from.reached === true){ 
					scene.locks[index].item.lock();
				}else{
					scene.locks[index].item.unlock();
				}


			}else{

				// check that the 'reached' state for the relative 'from' label has occured.
				for( j = 0 ; j<scene.locks.length ; j++){
					if(getlockIndex(scene.locks[j].from.label) === index){
						thisFrom = scene.locks[j].from;
					}
				}

				if(c_time < g[i].time ){
					scene.locks[index].until.reached = false;
				}else if(c_time >= g[i].time){		
					scene.locks[index].until.reached = true;
				}

				if(scene.locks[index].until.reached === true){ 
					scene.locks[index].item.unlock();
				}else if(scene.locks[index].until.reached === false && thisFrom.reached){
					scene.locks[index].item.lock();
				}

			}

		}
	}

	//console.log(c_time,scene.p_time)

	scene.p_time = c_time;

	// --------------------------------------
}

function useLocalStorage(){
	// uses modernizer to check for local storage
	return (Modernizr.localstorage) ? true : false ;
}

// ======================
// DOM Traversing Helpers
// ----------------------

/* 
	I took a stab at recreating the selector function from jQuery, 
	the reason being I wish to avoid using the selector function 
	from jQuery as it will include jQuery's massive prototype chain.
	With the sheer number of animated items likley to be in each 
	scene, having that many jQuery objects in the user's cache 
	could potentially kill thier browser.

	This selector is rather limited, and may or may not compatible
	with older browsers, however by keeping it simply, we keep
	it tiny in size, which is the goal.

	--> Recently I have noticed TweenMax does not require objects
	to be passed to animate, this is great for animation instances,
	because you can use it just like jquery ,however until I can 
	extract the selector functionality from either tweenlite or jquery 
	some operations are best left to this tiny selector, simple binding 
	for example should not bind unneccessary prototype chains.
*/

function removePrefix(o){
	var arr=[];
	switch(o[0]){
		case '#':
			arr[1] = o.substr(1);
			arr[0] = o[0];
		break;
		case '.':
			arr[1] = o.substr(1);
			arr[0] = o[0];
		break;
		default:
			arr[1] = o;
			arr[0] = null;
		break;
	}
	return arr;
}

function removeUndefined(q){

	var g = {};
	var i;
	for(i in q){
		if(q[i].nodeName !== undefined){
			g[i] = q[i];
		}
	}
	return g;
}

function getNodes(nodeString, asStrings){

	var temp =[];
	for( i in jQuery(nodeString) ){
		if( !isNaN(parseInt(i,10)) ){
			temp.push(jQuery(nodeString)[i]);
		}
	}

	if(temp.length === 1){
		temp = temp[0];
	}

	return temp;
}

function isEmpty(obj) {

	var key;

    // null and undefined are "empty"
    if (obj === null){ return true; }

    // Assume if it has a length property with a non-zero value
    // that that property is correct.
    if (obj.length > 0){ return false; }
    if (obj.length === 0){ return true; }

    // Otherwise, does it have any properties of its own?
    // Note that this doesn't handle
    // toString and valueOf enumeration bugs in IE < 9
    for (key in obj) {
        if (hasOwnProperty.call(obj, key)){ return false; }
    }

    return true;
}

// ======================
// CSS Helpers
// ----------------------

// jQuery functions
(function(jQuery){

	jQuery.fn.clonePosition = function(source){
		return this.css( jQuery(source).getStyles() );
	};

	jQuery.fn.exists = function () {
    	return this.length !== 0;
	};

	jQuery.fn.getStyles = function(){

		var src = this;
		return {
			'margin':src.css('margin'),
			'margin-left':src.css('margin-left'),
			'margin-right':src.css('margin-right'),
			'margin-top':src.css('margin-top'),
			'margin-bottom':src.css('margin-bottom'),
			'left':src.css('left'),
			'right':src.css('right'),
			'top':src.css('top'),
			'bottom':src.css('bottom'),
			'position':src.css('position'),
			'display':src.css('display'),
			'text-align':src.css('text-align'),
			'width':src.css('width'),
			'height':src.css('height'),
			'color':src.css('color'),
			'background-color':src.css('background-color')
		};

	};

	jQuery.fn.parseStyles = function(){

		// works with pixel only.

		var src = this;

		function ifNaN(what,alternative){
			what = parseInt(what,10);
			return (isNaN(what)) ? alternative : what ;
		}

		return {
			'margin':ifNaN( src.css('margin'),0 ),
			'margin-left':ifNaN(src.css('margin-left'),0),
			'margin-right':ifNaN(src.css('margin-right'),0),
			'margin-top':ifNaN(src.css('margin-top'),0),
			'margin-bottom':ifNaN(src.css('margin-bottom'),0),

			'padding':ifNaN( src.css('padding'),0 ),
			'padding-left':ifNaN(src.css('padding-left'),0),
			'padding-right':ifNaN(src.css('padding-right'),0),
			'padding-top':ifNaN(src.css('padding-top'),0),
			'padding-bottom':ifNaN(src.css('padding-bottom'),0),

			'left':ifNaN(src.css('left'),0),
			'right':ifNaN(src.css('right'),0),
			'top':ifNaN(src.css('top'),0),
			'bottom':ifNaN(src.css('bottom'),0),

			'position':ifNaN(src.css('position'),0),
			'display':ifNaN(src.css('display'),0),
			'text-align':ifNaN(src.css('text-align'),0),

			'width':ifNaN(src.css('width'),0),
			'height':ifNaN(src.css('height'),0),

			'color':src.css('color'),
			'background-color':src.css('background-color')
		};

	};

	jQuery.fn.clearPosition = function(){

			return this.css({
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
			});
	};

	jQuery.fn.active = function(){
		this.removeClass('inactive').addClass('active');
	};

	jQuery.fn.inactive = function(){
		this.removeClass('active').addClass('inactive');
	};

	jQuery.fn.complete = function(){
		this.removeClass('inactive').removeClass('active').addClass('complete');
	};

	jQuery.fn.getNodes = function(){
		var temp =[];

		for( i in this ){
			if( !isNaN(parseInt(i,10)) ){
				temp.push(this[i]);
			}
		}

		if(temp.length === 1){
			temp = temp[0];
		}

		return temp;
	}

})(jQuery);


// ======================
// Animator Helpers
// ----------------------

// This creates a new item of a specified type that encapsulates another item in the DOM.
// TODO - link to item it is crateing.

function Crate(name,contents,options){

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

	//var relativeTo = jQuery(options.placeHere).getStyles();

	if(contents.length && contents.length > 1){

		// -------------------------
		// Crate for multiple items
		// -------------------------

		/*wrapIn = jQuery(options.placeHere);

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

		// --------------------------------------------
		// Wrap it all up

		jQuery(options.placeHere)
			.append('<div id='+newName[1]+'></div>')

		jQuery('#'+newName[1]).css(emptyPos);

		// -------------------------------------------
		// Adjust positioning on crated elements

		

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

			jQuery(contents[i].id).css(totals);
			jQuery(contents[i].id).appendTo('#'+newName[1]);

			console.log(totals)
			console.log(contents[i].id)
			console.log('------------------------------');

		}*/
		console.log('Please use only one item');
	}else{

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

	}


	// Create a Jive Object
	// -----------------------------------

	if(options !== undefined){
		
		if(options.placeHere){ delete options.placeHere; }

		if(options.type){ type = options.type; delete options.type; }else{ type = Item; }

	}else{
		type = Item;
	}

	return new type(name, options);
}

// ======================
// GSAP Helpers
// ----------------------

function GSAP_method(timeline,id,duration,injection,method){

	var i,
		sync,
		repeat,
		stagger;

	var inject = [];

	if(method === 'yoyo'){
		animator = 'fromTo';
	}else{
		animator = method;
	}

	//console.log(id+' --- '+injection.sync)

	// Need to check if sync is passed as a number, if not we need a number.
	if( injection.sync !== undefined){
		sync = ( isNaN(injection.sync) ) ? timeline.getLabelTime(injection.sync) : injection.sync;
	}else{
		sync = undefined;
	}

	repeat = injection.repeat || undefined ;
	stagger = injection.offset;

	// inject [0]
	if( Object.prototype.toString.call(id) === '[object Array]'){
		// --------------------------
		// if we are passing an array

		inject[0] = [];

		for( i = 0 ; i <id.length ; i++){
			if(!!id[i].id){
				inject[0][i] = id[i].id; // allows us to pass GSAP objects
				//console.log('GSAP '+id[i]);
			}else{
				inject[0][i] = id[i];
				//console.log('not GSAP '+id[i]);
			}

		}

	}else{
		// ------------------------------
		// if we are passing a single id

		if(!!id.id){
			inject[0] = id.id; // allows us to pass GSAP objects
		}else{
			inject[0] = id;
		}

	}

	// inject [1]
	inject[1] = duration;

	// inject[2...3] 
	if(	injection.options2 ){
		inject[2] = injection.options;
		if(inject[2] !== undefined && injection.options2){
			inject[2].immediateRender = (method ==='yoyo' && injection.options2.immediateRender === undefined) ? false : injection.options2.immediateRender ;
		}
		inject[3] = injection.options2;
		if(inject[3] !== undefined){
			inject[3].ease = injection.options2.ease || injection.options.ease ;
		}
		if(stagger){ inject[4] = stagger; }
	}else{
		inject[2] = injection.options;
		if(inject[2] !== undefined){
			inject[2].immediateRender = (method === 'yoyo' && injection.options.immediateRender === undefined) ? false : injection.options.immediateRender ;
		}
		if(stagger){ inject[3] = stagger; }
	}

	// ---------------------------------------------------------------------
	// Forward Tween -------------------------------------------------------

	//console.log(sync)
	//console.log(timeline,inject,sync)
	timeline.add( TweenMax[animator].apply(timeline,inject),sync );	
	
	// ---------------------------------------------------------------------
	// Reverse Tween -------------------------------------------------------
	if(method === 'yoyo'){
		if(sync === undefined){ sync = duration; } 
		timeline.add( TweenMax[animator].apply(timeline,[inject[0],inject[1],inject[3],inject[2]]),sync );
	}
	
	// ---------------------------------------------------------------------
	// repeat Tween ----------------------------------------------------------
	if(repeat !== undefined){

		for( i = 0 ; i<repeat-1 ; i++){

			timeline.add( TweenMax[animator].apply(timeline,inject) );

			if(method === 'yoyo'){
				timeline.add( TweenMax[animator].apply(timeline,[inject[0],inject[1],inject[3],inject[2]]) );
			}

		}
	}
}

// ======================
// Status setters
// ----------------------

function createBlock(prefix,what,where,state,alt){

	var title = removeDir(what);
	title = removeExt(title);
	title = title.substring(1);
	title = prefix.concat(title);

	if(where[state] === undefined) where[state]={};	
	var value = (alt === undefined)? true : alt;

	// Save to localStorage
	if(useLocalStorage){
		course = _root.courseTitle || 'untitled_web_course' ;
		localStorage[course+'-'+title] = value
	}

	where[state][title] = value
}

function updateModuleList(index,module){
	for( j = 0 ; j<module.list.length ; j++){
		if(module.list[j].item.checkbox !== undefined){
			if(j !== index){
				module.list[j].item.active = false
				jQuery(module.list[j].item.checkbox).removeClass('active');
				
			}else{

				// convert storage object to an array for iteration
				var arr = toArray(module.storage.scenes.completed);
				
				if(arr[index] === true){
					jQuery(module.list[index].item.checkbox).active();
				}
			}
		}
	}
}

function checkStates(arr,state){
	var ticker = 0;

	for( i = 0 ; i<arr.length ; i++){
		if(arr[i][state] !== undefined && arr[i][state] !== false){
			ticker++
		}
	}

	return (ticker === arr.length)? true : false ;
}

function checkState(what,state){
	return (what[state] !== undefined && what[state] !== false) ? true : false ;
}

function setStates(arr,state,set){

	var i,k;

	if(arr.length){
		for( i = 0 , k=arr.length ; i<k ; i++){
			arr[i][state] = set;
		}
	}else{
		for( i in arr ){
			arr[i][state] = set;
		}
	}

}



// ======================
// Native helpers
// ----------------------

// Hex
// -----------------------
/*function darken(color,percent){

	var nc,
		prefix,
		isRGBA = (color.substring(0,4) === 'rgba'),
		isRGB = (color.substring(0,3) === 'rgb ' && color.substring(4,0) !== 'a'),
		isHEX = (color.substring(0,1) === '#');

	console.log(color)

	if(!isHEX){
		
		nc = color.split(')')[0].split('(')[1].split(','); // remove all the extra characters
			
		if(isRGBA){
			nc.pop(nc.lastIndexOf(',')); // remove the alpha
		}
		
		nc[0] = Math.floor(parseInt( nc[0],10 )/(percent/10));
		nc[1] = Math.floor(parseInt( nc[1],10 )/(percent/10));
		nc[2] = Math.floor(parseInt( nc[2],10 )/(percent/10));

		nc = String( nc[0]+','+nc[1]+','+nc[2] );

		prefix = (isRGBA) ? 'rgba(' : 'rgb(';

		nc = prefix+nc+')';
	
	}else{
		return false;
	}

	console.log(nc)
	return nc;
}*/



// Strings
// ----------------------

// Dir = Directory (directory/whatever)
// Ext = Extension (.whatever)
function removeExt(what){
	return what.split('.')[0];
}

function removeDir(what){
	lastIndex = what.lastIndexOf('/');
	return what.slice(lastIndex+1);
}

function getExt(what){
	return what.split('.')[1];
}

function getDir(what){
	lastIndex = what.lastIndexOf('/');
	return what.substring(0,lastIndex+1);
}

function capitalize(what){
	var what2 = what.substring(0,1)[0].toUpperCase().concat(what.substring(1));
	return what2
}

// Numbers
// ----------------------------
function randomNumber(){
	return Math.floor(Math.random(1)*100000);
}

// Arrays
// ----------------------
function toArray(obj){
	var i,arr=[];
	for( i in obj ){ 
		if( obj.propertyIsEnumerable(i) ){
			arr.push(obj[i]) 
		}
	}
	return arr;
}

function arrayCompare(a,b){
// compare an array and get an array of booleans in return
	var ob = []; 
	var i;
	if(b.length === a.length){
		for(i = 0 ; i<a.length ; i++){
			(a[i] === b[i]) ? ob.push(true) : ob.push(false);
		}
		return ob;
	}else{
		console.log('compare() :: arrays must have equal lengths');	
	}
}

function arrayReverse(q){
// create a mirror version of an array
  var t = [];
  var i,pop;
  var length = q.length;
  for(i = 0; i<length ; i++){ 
    pop = q.pop();
    t.push(pop);
  }
  return t;  
}

function arrayRandomize(q){
// randomize an array
  var length = q.length;
  var i,y,g,u;
  
  for(i = 0; i<length ; i++){
    y = q.pop();
    g = Math.floor(Math.random(q.length)*q.length);
    u = q[g];
    q.splice(g,1,y); 
    q.push(u);
  }
  
  return q;  
}


// ======================
// Injection or Extension
// ----------------------

// this function simply injects another argument into the passed 'e' function, without making the user do it.
function includeID(e,id,self){
	
	return function(){
		var injection = Array.prototype.slice.call(arguments);
		injection.unshift(id);
		e.apply(this,injection);
		return self;
	};
}

function GSAPEvent(name,obj,events,item,index,args){

 	var f, i, newArgs, scene = new Scene({paused:true});
 	//console.log(name+' '+index+' '+item[index].id)
 	//console.log(obj)

 	var all_items = obj.buttons;

 	if(args !== undefined){
 		if(args.length > 0){
 		
	 		newArgs = [item[index]];

	 		for( i = 0 ; i<args.length ; i++){
	 			newArgs.push(args[i])
	 		}

	 		newArgs.push(scene);

	 		f = events[name].call(obj, item[index], scene, all_items);
	 	}else{
	 		f = events[name].call(obj, item[index], scene, all_items);
	 	}

 	}else{
 		f = events[name].call(obj, item[index], scene, all_items);
 	}

 	item[index][name] = scene;
 	item[index][name].func = (f !== undefined) ? f : function(){} ;

 	return function(){
		obj.buttons[obj.currentButton][name].play();
		obj.buttons[obj.currentButton][name].func();
 	}
}

// ======================
// Experimental Functions
// ----------------------

function or(type,value){
	return (value) ? value : type;
}

function ifNot(a,value,assign){
	return (a === value) ? a : assign;
}

function isArray(val){
	if(typeof val === 'object' && val.length !== undefined){
		return true;
	}else{
		return false;
	}
}

function unNull(e){
	return (e === undefined || e === null)? true : false ;
}

function parent(parent,variable){
	if(parent !== undefined){
		if(parent[variable+''] !== undefined){
			return true;
		}else{
			return false;
		}
	}else{
		return false;
	}
}

function forAll(obj,method){
	var i,k;
	if(obj.length > 0){
		for( i=0, k<obj.length; i<k ; i++){
			obj[method]();
		}
	}
}

// ----------------------------
// DEBUGGER

function cbug(string){
	jQuery('.debug-modal').append(string+'<br />');
}


// ==========================
// Experimental DATA STORAGE
// --------------------------

var dS = function(){
	
	// ---------------
	// PRIVATE ------
	var scenes = 
	{
		s001:{
			solutions:[1,0,2]
		}
	};

	// ---------------
	// PUBLIC --------
	return {
		get:function(scene){
			return scenes[scene];
		}
	};

}(); // execute immediatley