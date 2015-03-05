<!DOCTYPE html>
<html>
<?php require_once('header.php'); ?>
<body>
<div class='container'>

	<?php require_once('nav.php'); ?>

	<div class='row'>
		<div class='col-md-7 header'>
			<h1>Module Controller</h1>
			<p>The module controller is a javascript object instance that manages scenes in a modular way. By utilizing the SceneControllers ability to load html through Ajax, the module controller allows you to create complex multi-chapter presentations, where each chapter can have an indefinate amount of scenes.</p>		</div>
	</div>
	<div class='row'>
		<div class='col-md-7 term'>
			<h3>Modules</h3>
			<p>A module controller controls modules, but what is a module in this instance? In this instance a module is actually a folder and in it lives html documents, each containing one ore more scenes.</p>
			<p>In order to properly utilize the module controller you must setup a directory that the module controler can traverse properly.</p>
			<p>But why are we seperating out all these scene instances into individual files? WHy not just keep it all in one place? The difference between a website and a presentation that would utilize the ModuleController like this is a website has very little differentiation in layout and animation. However JiveMax is intended to be used in instances where there is a great deal of variety in layouts and animation, so keeping all our scene instances in one place is actaully a maintenance nightmare!</p>
			<p>See the scss folder in this directory? SCSS is a recent development in the area of front-end development and it offers the same kind of ease-of-maintanence that a JiveMax project is meant to offer developers who need to create complex presentations for browsers. The rational behind both is similar.</p>
			<img src='img/directory_root.jpg'/>
			<p>Here we have our root directory. Our index is the file we will instatiate our ModuleController in and will serve as the shell for our loaded scenes. The folders labeled 's1000' and 's2000' are the module folders, these can be named whatever you like, however you will need more than one of them to make utilizing the ModuleController appropriate.</p>
    		<p>But that's not all we will need. We will also need a json file inside each of our modules/folders that tells us particular things about our html documents which we will refer to as scene packets. You will need to place a JSON file inside each module/folder and name ite scenes.json.</p>
    		<img src='img/directory_s1000.jpg'/>
    		<p>You may also note that there is an audio folder, this folder will hold all the audio that is associated with each scene packet, if you have any that is.</p>
    		<p>You will need to structure your JSON like so:</p>
    		<pre>{
	"module":{
		"id":"s1000",
		"title":"Welcome to an HTML5 Webcourse!",
		"url":"s1000/s1000.html",
		"audio":"s1000/audio/"
	},
	"s1000":{
		"url":"s1000/s1000.html",
		"title":"Welcome to JiveMax!"
	},
...</pre>
<p>The first node tells us things about the module/folder that holds our scene packets. The 'url' node here refers to the first scene packet to load in this module. The title keys in both nodes we will discuss in 'Buttons and other DOM elements'</p>
    	<br/>
    		<h3>Constructing an Instance</h3>
    		<p>Like the SceneController, the ModuleController is setup with many key value pairs. Below is a fully decked out sample of a constructor instance.</p>
    		<pre>_root.myModules = new ModuleController('#modules-list',{
	modules:['s1000','s2000'],
	root:_root,
	stage:'#content',
	moduleTitle:'.wc-header .module',
	sceneTitle:'.wc-header .scene',
	autoPlay:true,
	next:'#next-btn',
	back:'#back-btn',
	complete:'#complete-btn',
	welcomeMessage:'#instructions',

	loader:{
		wrapper:'#loader',
		spinner:'#spinner'
	},

	audioController:{
		type:"soundManager",
		fallbackURL:"../vendor/sm/swf",
		fallbackVersion:9
	},

	soundEvents:{
		select:'sfx/select.mp3'
	}

});
    		</pre>
    		<p>I know that looks scary, but we will go through it piece by piece</p>
    		<br/>
    		<h4>root</h4>
    		<p>Before we go through all the other aspects of the setup we need to understand the concept of root. The root refers to a plain old javascript object instance in the html document you instatiate your ModuleController in. The concept of root is to store everything in an object as opposed to poluting the global namespace. We want our JiveMax Module Controller and it's Scenes etc to not interfere with anthing else running in the browser or in the page we use JiveMax in, so the best way to isolate it is to place it in an object. That object is the root.</p>
    		<p>You don't need to name the root object _root, you can name it anything, just make sure you pair it with the <strong>root</strong> key and continue to use it in your scenes.</p>
    		<br/>
    		<h4>Modules and the Module List</h4>
    		<p>The ModuleController automatically traverse our directory we have setup and looks in certain folders for individual html documents/scene packets. It knows which folders to search because you pass to the modules key in the constructor an array with the folder names.</p>
    		<pre>...
modules:['s1000','s2000]
...</pre>
    		<p>Further, once the controller knows which folders to look at it will assign the action of loading the first scene packet in that folder to a specified DOM element. The first argument of the ModuleController constructor is the DOM element that holds these soon to be buttons.</p> 
    		<pre>... new ModuleController('#modules-list',{ ...</pre>
    		<p>In order to allow the most customization possible it is required that the developer make these 'list-items' themselves and name them the same as the folder/module they are intended for</p>
    		<p>So basically you need to markup this 'list' like DOM element manually. Below is a sample where we use a common unordered list as our wrapper.</p>
    		<pre>&ltdiv id='modules-list' class='wc-sidebar'&gt
	&ltul&gt
		&ltli id='s1000'&gt&ltdiv class='checkbox'&gt&lt/div&gtWelcome&lt/li&gt
		&ltli id='s2000'&gt&ltdiv class='checkbox'&gt&lt/div&gtQuiz&lt/li&gt
	&lt/ul&gt
&lt/div&gt</pre>
<p>Once again you can use any kind of DOM element, as long as it is  the direct child of the wrapper element you pass as the first argument to the contructor.</p>
<p>Whatever DOM element you choose to use per 'list-item' is up to you, just make sure the id matches the folder/module title.</p>
<p>You may have noticed an additional element inside these 'list-items' whose class is 'checkbox'. This element acts as a status indicator. When you are in a particular module and playing its scenes the indicator which must be of class 'checkbox' will recieve a class of 'active', and when complete, it will recieve a class of 'complete'. You could alternativley just assign the class 'checkbox' to the actual list item (soon to be button) if you were going for that kind of affect. So include that if you wish, however JiveMax won't force you to add this feature.</p>
<br/>
<h4>Buttons and other DOM elements</h4>
<p><strong>stage</strong> - This DOM element will be the wrapper element your Ajax loaded scene packets will be placed inside of.</p>
<p><strong>moduleTitle</strong> - If you remember, we created a JSON file for each module/folder that would tel us things about each scene packet. The title key for the title key in the 'module' node in that JSON file is whats going to populate in the DOM element you assign here.</p>
<p><strong>sceneTitle</strong> - The title node in  the JSON file inside each scene packet node is what is going to populate in this DOM element.</p>
<p><strong>next</strong> - This will become a button, which will move us forward in the module, loading the proceeding scene packet.</p>
<p><strong>back</strong> - Loads the preceeding scene packet.</p>
<p><strong>complete</strong> - This button will load tell the ModuleController you want to load a new module, which will be the proceeding module. There is no need for a button to go back a module as you will have your module list present.</p>
<p><strong>welcomeMessage</strong> - You can assign a DOM element to appear before any module is loaded.</p>
<p><strong>autoPlay</strong> - When set to true, each module loaded in the wrapper/stage will immediatley play once it is loaded.</p>
<br/>
<h4>Soundtracks</h4>
<p>When dealing with soundtracks in your scenes, the ModuleController makes things pretty simple and hands free. Earlier we noted that the module/folder has a directory in it called audio, if any of your scenes need a soundtrack, a sound file that plays alongside the scene, then simply make sure to name it the same as the scene packet. At the current time only one soundtrack can be associated with a scene packet, so your scene packet in these instances can have no more than one scene.</p> 
<img src='img/directory_audio.jpg'/>
<p>At the moment the only plugin supported is Sound Manager 2. To assign a sound plugin to the module you need to pass another object inside the settings object. For the time being since only one kind of plugin is supported you can simply copy the following markup.</p>
<pre>...	
audioController:{
	type:"soundManager",
	fallbackURL:"../vendor/sm/swf",
	fallbackVersion:9
},
...</pre>
<br/>
<h4>Sound Events</h4>
<p>This currently exhists only because we need to run a sound manually before certain devices allow sound to play. So by assigning a sound to each of the module list buttons we ensure the user has 'accepted' sound functionality, which will allow the above Soundtracks to play. However since JiveMax likes to keep things customizable, this is optional and can be expanded to support other 'sound events'</p>
<pre>soundEvents:{
	select:'sfx/select.mp3'
}</pre>
<p>Unlike soundtracks, these Sound Events are global and so they are placed in a directory unassociated with your scenes. This one is in the sfx folder in the root directory</p>
<br/>
<h4>Loaders</h4>
<p>There is only one kind of loader at the moment, a spinner. The spinner will spin a particular DOM element ( the ones you assign to the spinner key ) around like a gear or wheel, it is always recommended that oyu add a loader, so for the time being you can just follow the following markup.</p>
<pre>...
loader:{
	wrapper:'#loader',
	spinner:'#spinner'
},
...</pre>
<p>'wrapper' refers to the element that holds your spinner element. The ModuleController will show and hide the wrapper element, so you can place additional feedback in this element and it will act as the actual loader, while youre spinner is just visual flourish.</p>
	    <br/>
    		<h3>It owns a SceneController</h3>
    		<p>The Module controller instiates a scene controller, and you can tie an interface to it just as if it was another instance of a SceneController. This controller will control each scene that is running in each scene packet in each module.</p>
    		<pre>_root.myModules.sceneController.bind( ... );</pre>
    		<p>Further more the SceneController also has a reference to the it's parent ModuleController, simply called controller.</p>
    		<pre>_root.myModules.sceneController.controller // _root.myModules</pre>
    	</div>
	</div>
    <div class='row'>
		<div class='col-md-12 seperate'> 
			<div class='col-md-7 term'>
				<h3>Methods</h3>
				<p>A SceneController offers very little in terms of methods, as it is more of a watcher than a doer. If you are familiar with the Green Sock Animation Methods that the scene object uses than the methods effects below will already be self-evident.</p>
				<ul>
					<li>play()</li>
					<li>pause()</li>
					<li>restart()</li>
					<li>kill()</li>
					<li>gotoAndPlay()</li>
					<li>gotoAndStop()</li>
				</ul>
			</div>
		</div>
	</div>


</div>

</body>
<script>


</script>
</html>