<!DOCTYPE html>
<html>
<?php require_once('header.php'); ?>
<body>
<div class='container'>

	<?php require_once('nav.php'); ?>

	<div class='row'>
		<div class='col-md-7 header'>
			<h1>Scene Controller</h1>
			<p>The scene controller is a javascript object instance that is often tied to an interface, this interface then controls the playback of the scene assigned to the controller. You can have many scene controllers, and a single scenecontroller can control many scenes, however a scenecontroller is constrained to controlling 1 scene at a time.</p>
		</div>
	</div>
	<div class='row'>
		<div class='col-md-7 term'>
			<h3>Constructing an instance</h3>
			<p>Constructing a scene controller is fairley straightfoward. The only prerequisites are a scene instance to control and an option audio library/plugin instance.</p>
			<pre>var myScene = new Scene({paused:true});
var myAudio = new audioPlugin();
var myController = new SceneController({
	restrict:true,
	scene:myScene,
	audio:myAudio
});</pre>
			<p><strong>restrict</strong> - when set to true the user controls will not allow a user to jump ahead in the timeline, only back. In other words if the user has 'seen' a part of the timeline, they can go back to that point in the playback, but if they have not seen a point in the timeline, they can not jump forward to that point until they have 'seen' it through normal playback.</p>
    		<p><strong>scene</strong> - the scene you want your controller to control initally.</p>
    		<p><strong>audio</strong> - If you are using an audio plugin that is compatible with JiveMax, you can control it wiht the scene controller. The scene controller will place the audio on the timeline an play it alongside any aniamtons you have assigned tot he timeline. The only plugin currently supported is <a href='soundmanager2'>Sound Manager 2</a>.</p>
    		<br/>
    		<h3>Controling a SceneController with the DOM.</h3>
    		<p>A SceneController does not need to have any actual controls, but it makes more sense to let the user control the playback of your ScenControllers current scene instance. JiveMax offers developers the ability to build custom interface designs in the DOM by following a less jQuery-plugin like setup. WHile it has more steps to it, it allows greater customization.</p>
    		<br/>
    		<h4>Bind()</h4>
    		<p>In order to interact with our controller, we need to bind DOM elements that will act as our scenes controls or GUI. Currently their are three button types that are supported and on componenet, however JiveMax was developed to be modular and expandable, which is why we still manually bind these elements to the controller, despite our current limitation in choices.</p>
    		<pre>myController.bind({
    toggle:'#play-pause-btn',
    restart:'#play-pause-btn',
    audio:'#audio-btn'
})</pre>
    		<p>Above you will notice we are assiging an instance to 'scrub'. But what is scrub? scrub stands for ScrubBar, a component in Jivemax that makes it possible to scrub the playback of our scene. if you have no idea what ScrubBar is and want to use it right away read about the <a href='scrubbar.php'>ScrubBar component</a> first before proceeding.</p>
    		<p><strong>toggle</strong> - a toggle is a button that the controller creates that uses a few DOM elements to represent different states of playback. It will display the proper DOM representation of the buttons function at the appropriate time in the playback. Below is the basic markup.</p>
    		<pre>&ltdiv id='play-pause-btn'&gt
	&lti class="active play"&gt&lt/i&gt
	&lti class="inactive pause"&gt&lt/i&gt
	&lti class="inactive restart"&gt&lt/i&gt
&ltdiv&gt</pre>
<p>The active class indicates which DOM element is visible. The controller uses class asignments to determine how to show the DOM elements at a certain state.</p>
<p>There is an additional DOM element in this example given the class 'restart'. You will also notice that when we bound the restart property in our bind() function we assigned it to the same element as the toggle property. That is because our restart button can be nested in the same DOM element as the play and pause. This saves space, however you can also set the restart functionality to any other DOM element if you want it seperated.</p>
<p><strong>restart</strong> - As mentioned above this restarts the scene. Sending the playhead back to 0.</p>
<p><strong>audio</strong> - If you have a audio Plugin assigned to your controller, this button will mute and unmute the audio.</p>
    		<br/>
    		<h4>SceneController.swap()</h4>
<p>If you want to control a different scene after you have instantiaed your SceneController you can replace the intial scene with a new scene with this method.</p>
<pre>var anotherScene = new Scene({paused:true});
myController.swap( anotherScene );</pre>
<br/>
    		<h3>Loading a scene with Ajax</h3>
    		<p>You can load scenes that you have constructed in seperate html documents. But you need to follow a certain format for these html documents to follow. Below is a sample markup.</p>
    		<pre>&lt!DOCTYPE html&gt
&lthtml&gt
&ltbody&gt
	&lt!-- DOM elements to animate --&gt
&lt/body&gt
&ltscript&gt
	myExternalScene = new Scene();
`
	// enter you animation methods and other methods here

	_root.myExternalScene = myExternalScene;
	_ready = true;
&lt/script&gt
&lt/html&gt</pre>
<p>Above you will notice we have assigned our 'myExternalScene' to an object called _root. You would intantiate this plain old javascript object in the html you are loading you external html document into. This is a reccomended practice as it will store your scenes in an easy to access object. Since we have made this object it is also reccomended to place your SceneController in the same object.</p>
<pre>_root.myController</pre>
<p>the variable we have added called <strong>_ready</strong> acts as a signal to our controller that the scene is now ready to be played, this is why it is important to always pass paused as true to your scene instances, when using controllers.</p>
<br/>
<h4>SceneController.load()</h4>
<p>Now that we have an external scene marked up and saved, we can load it into the html document we have setup our controller in.</p>
<pre>_root.myController.load('#myWrapper','scenes/scene1.html', myExternalScene, {
	onStart:function(){},
	onFinish:function(){},
	callback:function(){}
});</pre>
<p>Above our first argument is the wraper we will load the external markup into, while the second argument is the relative path to the html document containing the markup. The third argument is the name of the scene that is instatiaed in the external html document, we need to pass this as it will point the controller to the specific scene we want to control. In theory one could have many scenes in a single html document which was loaded in via ajax, so this assignment allows that possibility to be present. The last argument is an object with key value pairs, methods that execute on events.</p>
<br/>
<h4>init()</h4>
<br/>
<h4>onLoad()</h4>
<p>This method will execute the moment the SceneController begins to load an external document. The methods keyword 'this' refers to the SceneController instance, and the first default argument/variable is a string that is the name of the method. Useful if you need to know what is firing or you want to reference the method itself as follows:</p>
<pre>...
onLoad:function(e){
	console.log(e) // 'onStart'

	var nested = function(){
		console.log('hello, i am a nested function')
	}

	this[e].nested();
}
...</pre>
</br>
<h4>onLoaded()</h4>
<p>This method will execute the moment the SceneController has finished loading the external document into the DOM. The methods keyword 'this' refers to the SceneController instance, and the first default argument/variable is a string that is the name of the method. Useful if you need to know what is firing or you want to reference the method itself as follows:</p>
</br>
<h4>onReady()</h4>
<p>This method will execute the moment the SceneController is ready to play the scene. The methods keyword 'this' refers to the SceneController instance, and the first default argument/variable is a string that is the name of the method. Useful if you need to know what is firing or you want to reference the method itself as follows:</p>
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