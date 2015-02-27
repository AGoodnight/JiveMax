<!DOCTYPE html>
<html lang="en-US">

<head>

<title>JiveMax Template</title>

<link rel="shortcut icon" type="image/png" href="jasmine/lib/jasmine-2.0.0/jasmine_favicon.png">
<link rel="stylesheet" type="text/css" href="jasmine/lib/jasmine-2.0.0/jasmine.css"> 

<!--<script type="text/javascript" src="jasmine/lib/jasmine-2.0.0/jasmine.js"></script>
<script type="text/javascript" src="jasmine/lib/jasmine-2.0.0/jasmine-html.js"></script>
<script type="text/javascript" src="jasmine/lib/jasmine-2.0.0/boot.js"></script>-->

<script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js" ></script>
<script src='vendor/gsap.min.js' type='text/javascript'></script>

<link href="//maxcdn.bootstrapcdn.com/font-awesome/4.2.0/css/font-awesome.min.css" rel="stylesheet">

<script src='src/services.js' type='text/javascript'></script>
<script src='src/factory.js' type='text/javascript'></script>
<script src='src/controllers.js' type='text/javascript'></script>
<script src='src/jig.js' type='text/javascript'></script>
<script src='src/test.js' type='text/javascript'></script>

</head>

<style>
.box{
	width:100px;
	height:100px;
	margin:20px;
	background-color:orange;
	display:inline-block;
}

#choices{
	display:block;
	overflow:hidden;
	height:140px;
	width:100px;
}

#drags{
	position:absolute;
	width:100px;
	height:140px;
	background:red;
}

#drops{
	position:absolute;
	width:100px;
	height:140px;
	background:orange;
}

#ding{
	position:absolute;
	width:100px;
	height:140px;
	background:blue;
}

.btn{
	background:aqua;
	padding:10px;
	display:inline-block;
}

.btn:hover{
	background:black;
}

</style>

<body>

	<p>
		<?php
			$number = 5*7;

			if($number > 10){
				$number = 'a big number';
			}

			echo "I'm a big Shot" . " Now ". $number;
		?> 
	</p>
	<!--<div id='choices'>
		<div id='ding'>
		</div>
	</div>
	<div class='btn' id='previous'>previous</div><div class='btn' id='next'>next</div>
	<div class='btn' id='hotbtn1'>1</div><div class='btn' id='hotbtn2'>2</div><div class='btn' id='hotbtn3'>3</div>-->
</body>
<script>
		
</script>
</html>