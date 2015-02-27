<!DOCTYPE html>
<html>
<?php require_once('header.php'); ?>
<body>
<div class='container'>

	<?php require_once('nav.php'); ?>

	<div class='row header'>
		<div class='col-md-12'>
			<h1>Scene Class</h1>
			<p>Here we will go over in summary what the best aspects and methods of thie class are. For a more in depth documentation of how to do these methods look at the source code fro this page and read the comments</p>
			<br/>
			<h4>What makes a Scene different than and Item or Button?</h4>
			<p>The primary difference is that Scenes treat elements (in the DOM) or GSAPObjects as individuals, instead of assigning them to the scene permanatley. A scene is an object that makes a timeline, it is even more basic tahn an Item class, it's needed though if you want to Animate lots of various elements and have them controlled by one timeline. A Scene also makes the timeline assocaited with it less ambigous. Third a Scene is setup to properly be controlled via controllers (which we will talk about next).</p>
		</div>
	</div>

	<div class='row'>
		<div class='col-md-12'>
			<h3>Constructing a Scene instance</h3>
			<p>Creating a Scene is like creating an Item or Button.</p>
			<pre>var myDrive = new Scene();</pre>
		</div>
	</div>

	<div class='row'>
		<div class='col-md-12'>
			<h3>Methods</h3>
		</div>
		<div class='col-md-12 term'>
			<div class='col-md-4'>
				<div id='block' class='block mini'> 1 </div>
				<div id='block' class='block mini'> 2 </div>
				<div id='block' class='block mini'> 3 </div>
			</div>
			<div class='col-md-8'>
				<h3>scene.staggerJig()</h3>
				<p>You can use jigs like GSAP uses stagger, this can be done for any GSAPObject class, not just scene instances:<br/><pre>Item.jig('wiggle');</pre>The obvious advantage here is that it is short and easy in comparison to anaimting it manually.</p>
				<button class='trigger' onclick='block.play();'>RESTART</button>
			</div>
		</div>
		<div class='col-md-12 term'>
			<div class='col-md-8 col-md-offset-4'>
				<h3>More methods</h3>
				<p>There are a few other methods that need less explanatin, but should be mentioned.</p>
				<ul>
					<li><h4>wipe()</h4>
						<p>Hide an element. To show it again, use show(). This method is not dependent on the timeline.</p>
					</li>
					<li><h4>hide(id)</h4>
						<p>Hide all elements, or the element specified by the selector. To show it again, use show(). This method is not dependent on the timeline.</p>
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
var block = new Scene();

// animate the Button instance with a jig (preset)
block.staggerJig('.mini', 'wiggle',{
		strength:2, 
		speed:0.8
	},{
		loop:2,
		offset:0.2
	});



</script>
</html>