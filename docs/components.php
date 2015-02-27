<!DOCTYPE html>
<html>
<?php require_once('header.php'); ?>
<body>
<div class='container'>

	<?php require_once('nav.php'); ?>

	<div class='row'>
		<div class='col-md-7 header'>
			<h1>Click To Present</h1>
			<p>Click to present turns individual scenes into presentations controled by a click.</p>
			<p>Here we will go over in summary what the best aspects and methods of thie class are. For a more in depth documentation of how to do these methods look at the source code fro this page and read the comments</p>
		</div>
	</div>
	<div class='row'>
		<div class='col-md-7 term'>
			<h3>Constructing an instance</h3>
			<p>An instance requires an array of Scenes, each controlling whatever animation you will have on each 'slide' or presented DOM element. This DOM element is a wrapper, where your scene's animations take place. So first setup your scenes, even if the scene has no intial animation, this step is neccessary.</p>
			<pre>var Scene1 = new Scene( {wrapper:'#scene-1-wrapper'}),
    Scene2 = new Scene( {wrapper:'#scene-2-wrapper'}),
    Scene3 = new Scene( {wrapper:'#scene-3-wrapper'});</pre>
			<p>We include a wrapper argument so the instance knows what to show and hide. Now that we have our scenes, we can place them in an array and pass that into our instance's constructor method. You will also be expected to provide a wrapper for your slides as well, this wrapper will be assigned to the instance. The second argument is the array of slides.</p>
			<pre>var mySlides = [ Scene1, Scene2, Scene3 ];
var myShow = new ClickToPresent('#show-wrapper', mySlides)</pre>
			<p>Now that you have your instance setup, we need to consider how we will control which slide is being presented.</p>
		</div>
		<div class='col-md-12 seperate'> 
			<div class='col-md-6'>
				<h3>Triggers</h3>
				<p>Every successful slideshow has triggers, while you can create a ClickToPresent instance WITHOUT triggers, for special conditions, most of the time you will want your instance to have triggers. To set the triggers, we will use the 'triggers' method</p>
			</div>
			<div class='col-md-12 term'>
				<div class='col-md-4'>
					<div id='slides-triggers' class='ctp-slides'>
						<div id='slide-1-triggers' class='ctp-slide'><h4>Slide 1</h4></div>
						<div id='slide-2-triggers' class='ctp-slide'><h4>Slide 2</h4></div>
						<div id='slide-3-triggers' class='ctp-slide'><h4>Slide 3</h4></div>
					</div>
					<div id='slide-triggers-nav' class='ctp-nav'>
						<div id='previous' class='ctp-trigger'>Previous Slide</div>
						<div id='next' class='ctp-trigger'>Next Slide</div>
					</div>
				</div>
				<div class='col-md-8'>
					<h4>Next and Previous triggers</h4>
					<pre>myShow.triggers({next:'#nextTrigger',previous:'#previousTrigger'});</pre>
				</div>
			</div>
		</div>
		<div class='col-md-12 seperate'> 
			<div class='col-md-6'>
				<h3>Hotspots (buttons)</h3>
			</div>
			<div class='col-md-12 term'>
				<div class='col-md-4'>
					<div id='slides-hotspots' class='ctp-slides'>
						<div id='slide-1-hotspots' class='ctp-slide'><h4>Slide 1</h4></div>
						<div id='slide-2-hotspots' class='ctp-slide'><h4>Slide 2</h4></div>
						<div id='slide-3-hotspots' class='ctp-slide'><h4>Slide 3</h4></div>
					</div>
					<div id='slide-hotspots-nav' class='ctp-nav'>
						<div id='hs1' class='ctp-trigger'>Slide 1</div>
						<div id='hs2' class='ctp-trigger'>Slide 2</div>
						<div id='hs3' class='ctp-trigger'>Slide 3</div>
					</div>
				</div>
				<div class = 'col-md-8'>
					<h4>Next and Previous triggers</h4>
					<pre>myShow.triggers({next:'#nextTrigger',previous:'#previousTrigger'});</pre>
				</div>
			</div>
		</div>
	</div>


</div>

</body>
<script>

var slides_triggers= [];
// Another advantage to setting a wrapper property on our scene is that the selector queries for all our animations are now constrained to the wrapper, and the wrapper does not need to be restated in the animation methods selector string!
slides_triggers.push( new Scene({wrapper:'#slide-1-triggers', paused:true}).jig('h4','slideIn',{strength:2,speed:0.6},{sync:0}).from('h4',0.6,{rotation:360},{sync:0}) );
slides_triggers.push( new Scene({wrapper:'#slide-2-triggers', paused:true}).jig('h4','hop',{strength:3,speed:0.8},{loop:30}) );
slides_triggers.push( new Scene({wrapper:'#slide-3-triggers', paused:true}).from('h4',0.5,{rotationY:360,scale:0.1,ease:'Back.easeOut'},{sync:0.3}) );
var clickToPresent_triggers = new ClickToPresent('#slides-triggers',slides_triggers).triggers({ next:'#next', previous:'#previous' }).goTo(0);

var slides_hotspots= [];
slides_hotspots.push( new Scene({wrapper:'#slide-1-hotspots', paused:true}).jig('h4','wiggle',{speed:0.4},{loop:30}) );
slides_hotspots.push( new Scene({wrapper:'#slide-2-hotspots', paused:true}).yoyo('h4',1,{rotationY:180,ease:'Elastic.easeOut'},{loop:30}) );
slides_hotspots.push( new Scene({wrapper:'#slide-3-hotspots', paused:true}).from('h4',1,{y:100, ease:'Bounce.easeOut'}) );
var clickToPresent_hotspots = new ClickToPresent('#slides-hotspots',slides_hotspots).hotspot('#hs1',0).hotspot('#hs2',1).hotspot('#hs3',2).goTo(0);


</script>
</html>