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
			<li><a href='#'>to()</a></li>
			<li><a href='#'>from()</a></li>
			<li><a href='#'>fromTo()</a></li>
			<li><a href='#'>stagger()</a></li>
			<li><a href='#'>staggerTo()</a></li>
			<li><a href='#'>staggerFromTo()</a></li>
			<li><a href='#'>addLabel()</a></li>
			<li><a href='#'>kill()</a></li>
			<li><a href='#'>play()</a></li>
			<li><a href='#'>restart()</a></li>
			<li><a href='#'>set()</a></li>
			<li><a href='#'>reverse()</a></li>
			<li><a href='#'>clear()</a></li>
		</ul>

<p>etting you animate anything in the DOM, by class, tag, id or anything that the familar <a href='#'>jQuery selector</a> can. This is because JiveMax implements jQuery to handle selection quieries. The result will be assigned to an array, object property 'elements'. </p>
<pre>myScene.to('#myDiv',1,{ x:100 })
myScene._elements; // [ '#myDiv' as an html node ] </pre>
<p>You can assign the scene a 'wrapper', this wrapper will change the nature of the jQuery selector, anything 'in' or under the wrapper, it's child nodes, will be available without stating the wrapper element. So if you have an element 'h4' inside '#myDiv', you would only need to state 'h4' if you had assigned '#mydiv' as your scene's wrapper.</p>
<pre>
var myScene = new Scene( {wrapper:'#myDiv'} );
myScene.to('h4',1,{ x:100 }); // the selector is actually '#myDiv h4'.
</pre>
		</div>
	</div>

	<div class='row'>
		<div class='col-md-12 seperate'>
			<div class='col-md-12'>
				<h3>Methods</h3>
			</div>
			<div class='col-md-12 term'>
				<div id='jig' class='col-md-4'>
					<div id='block' class='block mini'> 1 </div>
					<div id='block' class='block mini'> 2 </div>
					<div id='block' class='block mini'> 3 </div>
				</div>
				<div class='col-md-8'>
					<h3>scene.jig()</h3>
					<p>Jig's are presets, they save time by </p>
					<pre>Item.jig('.block','wiggle');</pre>
					<p>The obvious advantage here is that it is short and easy in comparison to anaimting it manually.</p>
					<button class='trigger' onclick='block.play();'>RESTART</button>
				</div>

				<div id='stagger-jig' class='col-md-4'>
					<div id='block' class='block mini'> 1 </div>
					<div id='block' class='block mini'> 2 </div>
					<div id='block' class='block mini'> 3 </div>
				</div>
				<div class='col-md-8'>
					<h3>scene.staggerJig()</h3>
					<p>Jig's are presets, they save time by </p>
					<pre>Item.staggerJig('.block','wiggle',{offset:0.5});</pre>
					<p>The obvious advantage here is that it is short and easy in comparison to anaimting it manually.</p>
					<button class='trigger' onclick='block.play();'>RESTART</button>
				</div>
			</div>
		</div>

		<div class='col-md-12 term'>
			<div class='col-md-8 col-md-offset-2'>
				<h3>More methods</h3>
				<p>There are a few other methods that need less explanatin, but should be mentioned.</p>
				<ul>
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
		loop:10
	});


// ----------------------------------
// 1
// create a new Button instance.
var block2 = new Scene( {wrapper:'#stagger-jig'} );

// animate the Button instance with a jig (preset)
block2.staggerJig('.mini', 'wiggle',{
		strength:2, 
		speed:0.8
	},{
		loop:10,
		offset:0.5
	});



</script>
</html>