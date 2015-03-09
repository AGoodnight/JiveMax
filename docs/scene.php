<!DOCTYPE html>
<html>
<?php require_once('header.php'); ?>
<body>
<div class='container'>

	<?php require_once('nav.php'); ?>

	<div class='row'>
		<div class='col-md-7 header'>
			<h1>Scene Class</h1>
			<p>Here we will go over in summary what the best aspects and methods of thie class are. For a more in depth documentation of how to do these methods look at the source code fro this page and read the comments</p>
			<br/>
			<h4>First, let's introduce the GSAPObject</h4>
			<p>The GSAPObject is a javascript object that takes the most applicable aspects of the TweenMax and TimelinMax methods and places the in an object instance, the GSAPObject is the foundation of the Scene class which is the foundation of many other classes JiveMax offers.
		</div>
	</div>

	<div class='row'>
		<div class='col-md-7 term'>
			<h3>Constructing a Scene instance</h3>
			<p>Creating an Scene is easy, it is just an object instance created by a Constructor method of the same name 'Scene'</p>
			<pre>var myScene = new Scene();</pre>

			<h3>Timeline</h3>
			<p>You can access the timeline by the property 'timeline'. This is an instance of TimelineMax.</p>
			<pre>myScene.timeline;</pre>
			<p>While you can certainly access the timeline directly in this way, JiveMax has routed much of the timelines functionality through the Scene object, this has been done so that the timeline can be controled by the Scene instance and can be tied to a controller, which we will discuss later. So it is always recommended to use the scenes methods of playback control rather than accessing the timeline directly.</p>
			<pre>myScene.play();
myScene.addLabel();
myScene.kill();</pre>

		<h3>Greensock Animation Methods</h3>
		<p>Methods available to normal instances of TweenMax and TimelineMax are avaialble to instances of the Scene class. The methods currently supported are:</p>
		<ul>
			<li><a href='http://greensock.com/docs/#/HTML5/GSAP/TimelineMax/to/'>to()</a></li>
			<li><a href='http://greensock.com/docs/#/HTML5/GSAP/TimelineMax/from/'>from()</a></li>
			<li><a href='http://greensock.com/docs/#/HTML5/GSAP/TimelineMax/fromTo/'>fromTo()</a></li>
			<li><a href='http://greensock.com/docs/#/HTML5/GSAP/TimelineMax/stagger/'>stagger()</a></li>
			<li><a href='http://greensock.com/docs/#/HTML5/GSAP/TimelineMax/staggerTo/'>staggerTo()</a></li>
			<li><a href='http://greensock.com/docs/#/HTML5/GSAP/TimelineMax/staggerFromTo/'>staggerFromTo()</a></li>
			<li><a href='http://greensock.com/docs/#/HTML5/GSAP/TimelineMax/addLabel/'>addLabel()</a></li>
			<li><a href='http://greensock.com/docs/#/HTML5/GSAP/TimelineMax/kill/'>kill()</a></li>
			<li><a href='http://greensock.com/docs/#/HTML5/GSAP/TimelineMax/play/'>play()</a></li>
			<li><a href='http://greensock.com/docs/#/HTML5/GSAP/TimelineMax/restart/'>restart()</a></li>
			<li><a href='http://greensock.com/docs/#/HTML5/GSAP/TimelineMax/set/'>set()</a></li>
			<li><a href='http://greensock.com/docs/#/HTML5/GSAP/TimelineMax/reverse/'>reverse()</a></li>
			<li><a href='http://greensock.com/docs/#/HTML5/GSAP/TimelineMax/clear/'>clear()</a></li>
		</ul>

<h3>jQuery Selector</h3>
<p>etting you animate anything in the DOM, by class, tag, id or anything that the familar <a href='#'>jQuery selector</a> can. This is because JiveMax implements jQuery to handle selection quieries. The result will be assigned to an array, object property 'elements'. </p>
<pre>myScene.to('#myDiv',1,{ x:100 })
myScene._elements; // [ '#myDiv' as an html node ] </pre>

<h3>Scene Settings</h3>
<p>The scene settings are passed as an object of key value pairs. One very notable scene setting is the 'wrapper'. This wrapper will change the nature of the jQuery selector, anything 'in' or under the wrapper, it's child nodes, will be available without stating the wrapper element. So if you have an element 'h4' inside '#myDiv', you would only need to state 'h4' if you had assigned '#mydiv' as your scene's wrapper.</p>
<pre>
var myScene = new Scene( {wrapper:'#myDiv'} );
myScene.to('h4',1,{ x:100 }); // the selector is actually '#myDiv h4'.
</pre>
<p>Another notable setting, whose nature is rather obvious is 'paused'. If you set paused to true, it will pasue the timeline in your scene intially, allowing you to control when you want it to play.</p>
<pre>var myPausedScene = new Scene( { 
	name:'pausedScene', 
	paused:true, ,
	ease:'Expo.easeOut' ,
	defaultOverwrite:'auto',
	transformOrigin:'50% 50%',
	immediateRender:true
} );</pre>
<p>But wait, see all those other settings we can pass? Let's talk about them.</p>
<p><strong>paused</strong> all scenes are paused by default, to avoid runtime/compiling errors. You will need to call the 'play()' method to start your scenes.</p>.
<pre>myPausedScene.play();</pre>
<br/>
<p><strong>name</strong> If you want to give your scene a name, simply so you can go thisScene.name and have a more complex description of the instance, you can set a name for the scene in the constuctor like above. The string length is unlimited. </p>.
<p><strong>defaultOverwrite</strong> refers to how the timeline instance will 
	treat animations assigned to a shared DOM element that overlap one another. 
	To learn more about defaultOverwrite read <a href='https://greensock.com/docs/#/HTML5/GSAP/TweenLite/defaultOverwrite/'>these docs</a></p>.
<p><strong>immediateRender</strong> refers to the ability to keep the animations intial affects upon the DOm elelment from rendering before the point in the timeline the animation actually takes place.
	To learn more about immediateRender read <a href='https://greensock.com/docs/#/HTML5/GSAP/TweenLite/immediateRender/'>these docs</a></p>.
<p><strong>transformOrigin</strong>
	To learn more about transformOrigin read <a href='https://greensock.com/docs/#/HTML5/GSAP/TweenLite/transformOrigin/'>these docs</a></p>.
<p><strong>ease</strong> refers the ease you want applied to every animation instance in the scene, by default. it can be overwritten at anytime inside an animation method. 
	To learn more about ease read <a href='https://greensock.com/docs/#/HTML5/GSAP/TweenLite/ease/'>these docs</a></p>.
	</div>
	</div>

	<div class='row'>
		<div class='col-md-12 seperate'>
			<div class='col-md-12'>
				<h3>Methods</h3>
			</div>
			<div class='col-md-12 term'>
				<div id='jig' class='col-md-4'>
					<div class='block mini'> 1 </div>
					<div class='block mini'> 2 </div>
					<div class='block mini'> 3 </div>
				</div>
				<div class='col-md-8'>
					<h3>Scene.jig()</h3>
					<p>Jig's are presets, they save time by </p>
					<pre>Item.jig('.block','wiggle');</pre>
					<p>The obvious advantage here is that it is short and easy in comparison to anaimting it manually.</p>
					<button class='trigger' onclick='block.play();'>PLAY</button>
				</div>

				<div id='stagger-jig' class='col-md-4'>
					<div class='block mini'> 1 </div>
					<div class='block mini'> 2 </div>
					<div class='block mini'> 3 </div>
				</div>
				<div class='col-md-8'>
					<h3>Scene.staggerJig()</h3>
					<p>Jig's are presets, they save time by </p>
					<pre>Item.staggerJig('.block','wiggle',{offset:0.5});</pre>
					<p>The obvious advantage here is that it is short and easy in comparison to anaimting it manually.</p>
					<button class='trigger' onclick='block2.play();'>PLAY</button>
				</div>

				<div id='yoyo' class='col-md-4'>
					<div id='block-big' class='block'> 1 </div>
				</div>
				<div class='col-md-8'>
					<h3>Scene.yoyo()</h3>
					<p>The yoyo method is also has been modified a bit from the original functionality of the GSAP base method, it now creates actual instances of animation that simulate the alternating nature of the animation on the timeline, the original method just played the timeline forward and then reversed it.</p>
					<pre>
myScene.yoyo( '#myDiv', 1, { y:50 } ); // like to()
myScene.yoyo( '#myDiv', 1, { y:100 },{ y:50 } ); // like fromTo()</pre>

					<button class='trigger' onclick='block3.play();'>PLAY</button>
				</div>

				<div id='affect' class='col-md-4'>
					<div class='block'> 1 </div>
				</div>
				<div class='col-md-8'>
					<h3>Scene.affect()</h3>
					<p>This methods allows you to control the playback of another Scene instance through this Scene instance. So if you paused this scene, it would pause any scene's you assign it to through the affect() method.</p>
					<pre>mySecondScene.affect(myScene)</pre>
					<p>If you play this scene again, by clicking 'restart' you will notice it also plays the Scene.yoyo() sample.
					<button class='trigger' onclick='block4.play();'>PLAY</button>
				</div>

			</div>
		</div>

		<div class='col-md-12 term seperate'>
			<div class='col-md-7'>
				<h3>More methods</h3>
				<p>There are a few other methods that need less explanatin, but should be mentioned.</p>
				<ul class='method-list'>
					<li><h4>loop(times:number/string)</h4>
						<p>if you pass a number as an argument it will tell the timeline to repeat it's playback that many times. If you pass either 'forever' or nothing, it will repeat playback indefinatley.</p>
						<pre>myScene.loop('forever').play();</pre>
					</li>
					<li><h4>wipe()</h4>
						<p>Hide an element. To show it again, use show(). This method is not dependent on the timeline.</p>
					</li>
					<li><h4>at( sync:number, callback:function, label:string )</h4>
						<p>Executes a callback at a particular time in the timeline. sync is in seconds.</p>
					</li>
					<li><h4>addLabel(label:string, sync:number)</h4>
						<p>Add a label at a point in the timeline which can be used later in methods like play() and gotoAndStop().</p>
					</li>
					<li><h4>endAt( time:number/string )</h4>
						<p>Set the length of the timeline to a later point than when the animation ends, if you are syncing with audio, this is very useful.</p>
					</li>
					<li><h4>gotoAndStop( time:number/string)</h4>
						<p>Jum p to a point on the timeline, and stop/pause the timeline. You can use a label instead of seconds.</p>
					</li>
					<li><h4>gotoAndPlay()</h4>
						<p>Jump to a point on the timeline and play the timeline from that point.</p>
					</li>
					<li><h4>hide(selector)</h4>
						<p>Hide all elements this item is assigned to, if selector is passed it will only target that. To show it again, use show(). This method is not dependent on the timeline. showAll() will reverse the affects of hideAll().</p>
					</li>
				</ul>
			</div>
		</div>
	</div>

</div>

</body>
<script>

// ----------------------------------
// 1
// create a new Button instance.
var block = new Scene( {wrapper:'#jig'} );

// animate the Button instance with a jig (preset)
block.jig('.mini', 'wiggle',{
		strength:2, 
		speed:0.8
	},{
		repeat:2
	});


// ----------------------------------
// 1
// create a new Button instance.
var block2 = new Scene( { wrapper:'#stagger-jig'} );

// animate the Button instance with a jig (preset)
block2.staggerJig('.mini', 'wiggle',{
		strength:2, 
		speed:0.8
	},{
		repeat:2,
		offset:0.5
	});


// ---------------------------------
// 3
var block3 = new Scene( { wrapper:'#yoyo'} );
block3.yoyo('#block-big',0.5,{ y:0 },{ y:50 });


// ---------------------------------
// 3
var block4 = new Scene( {ease:'Back.easeInOut', wrapper:'#affect'} );
block4.yoyo('.block',1,{ scale:0.8 }).affect(block3);



</script>
</html>