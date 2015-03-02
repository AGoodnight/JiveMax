<!DOCTYPE html>
<html>
<?php require_once('header.php'); ?>
<body>
<div class='container'>
	<?php require_once('nav.php'); ?>
	<div class='row header'>
		<div class='col-md-12'>
			<div class='col-md-6'>
				<h1>Let JiveMax change how you think of animating the DOM</h1>
				<p>A framework that uses shorter declarations and an inhernet hiearchy of elements animating along independent timelines tied to a central control object.</p>
			</div>
			<div class='col-md-6' style='text-align:center;'>
				<div id='block' class='block'></div>
			</div>
		</div>
	</div>
</div>
<script>
var block = new Item('#block').jig('slideIn',{strength:10},{sync:0.4}).jig('wiggle',{speed:0.5},{repeat:400});
</script>
</body>
</html>