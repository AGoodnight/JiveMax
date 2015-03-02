<!DOCTYPE html>
<html>
<?php require_once('header.php'); ?>
<body>
<div class='container'>

	<?php require_once('nav.php'); ?>

	<div class='row header'>
		<div class='col-md-12'>
			<h1>Services</h1>
			<p>Here we will go over in summary what the best aspects and methods of thie class are. For a more in depth documentation of how to do these methods look at the source code fro this page and read the comments</p>
		</div>
	</div>

	<div class='row'>
		<div class='col-md-12'>
			<h3>Why use Services?</h3>
			<p>Creating a Scene is like creating an Item or Button.</p>
			<pre>var myDrive = new Scene();</pre>
		</div>
	</div>

	<div class='row'>
		<div class='col-md-12'>
			<h3>Crate</h3>
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
		repeat:2,
		offset:0.2
	});



</script>
</html>