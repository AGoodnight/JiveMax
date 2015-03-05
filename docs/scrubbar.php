<!DOCTYPE html>
<html>
<?php require_once('header.php'); ?>
<body>
<div class='container'>

	<?php require_once('nav.php'); ?>

	<div class='row'>
		<div class='col-md-7 header'>
			<h1>ScrubBar</h1>
			<p>A ScrubBar is a component intended for use with the SceneController class.</p>
			<p>Here we will go over in summary what the best aspects and methods of thie class are. For a more in depth documentation of how to do these methods look at the source code fro this page and read the comments</p>
		</div>
	</div>
	<div class='row'>
		<div class='col-md-12 term'>
			<div class='col-md-7'>
				<h3>Constructing an instance</h3>
				<p>The ScrubBar instance has a few dependencis on specialized classes</p>
				<pre>var myProgressBar = new ProgressBar('#myProgress');
var myFillBar = new FillBar('#myFill');</pre>
				<p>The frist two depnednecis can be stated immediatley. There is no need to go into depth with these classes as they are simply extensions of the Item class. For instance the only real notable difference between an item and a ProgreesBar is that it will grab the width of the DOM element you assign it. They exhist more for the sake of syntax and maintenance of the idea of modularity and human-friendly interpretation.</p>
				<p>The second step in constructing a ScrubBar is instantiating the ScrubBar itself</p>
				<pre>var myScrubBar = new ScrubBar('#myScrubBar');</pre>
				<p>That's it! And finally we need a scrubber, the little thing we drag on the scrub bar. This is once again a very simple extension of the item class.</p>
				<pre>var myScrubber = new Scrubber('#myScrubber',{
	parent:myScrubBar,
	bounds:myProgressBar
});</pre>
				<p>You will notice we have two new settings up there.</p>
				<p><strong>parent</strong> - This is the ScrubBar instance you will be using the scrubber in. It's using the abstract name 'parent' so that in the future JiveMax can possibly expand the uses of the Scrubber class beyond being used in the ScrubBar class.</p>
				<p><strong>bounds</strong> - these are the bounds in which the scrubber, which is an extension of the Drag class will be restricted to. In this case it is our ProgressBar instance.</p>
				<br />
				<h4>bind()</h4>
				<p>Once again we need to bind all these little instances to the ScrubBar class. This step is very straightfoward and mimics the way we bound items to the SceneController Class.</p>
				<pre>myScrubBar.bind({
	bar:myProgressBar,
	scrubber:myScrubber,
	fill:myFillBar,
	controller:myController // The controller you had setup.
});</pre>
				<p>Below is a demo of the ScrubBar class in action, to really see how this demo works ad see how we setup all the other elements check out the script tag in the source code on this page.</p>
			</div>
			<div class='col-md-7'>
				<div class='col-md-12'>
					<div id='myBlock' class='block mini'>Play Me!</div>
				</div>
				<div class='col-md-12'>
					<div class='wc-dock-scrubber'>
						<div class='bar'></div>
						<div class='fill'></div>
						<div class='bug'></div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

</body>
<script>

var myScene = new Scene({paused:true});

var controller = new SceneController({scene:myScene});
var scrubBar = new ScrubBar('.wc-dock-scrubber');
var fill = new FillBar('.wc-dock-scrubber .fill');
var progress = new ProgressBar('.wc-dock-scrubber .bar');
var scrubber = new Scrubber('.wc-dock-scrubber .bug',{
	parent:scrubBar,
	bounds:progress
});

scrubBar.bind({
	bar:progress,
	scrubber:scrubber,
	fill:fill,
	controller:controller
});

controller.bind({
	scrub:scrubBar,
	play:'#myBlock' // we have made the block that animates our play trigger.
});

myScene.to('#myBlock',1,{x:200,rotation:'+=360'});

var _ready = true // You will need this as it is the only global variable that JiveMax relies on for knowing when it should start watching your instances. 
controller.init({paused:true})

</script>
</html>