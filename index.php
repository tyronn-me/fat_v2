<?php
// This is the defualt template
include('header.php');

	if ( is_front_page() ) {
		get_template_part( 'parts/content', 'frontpage' );
	}

include('footer.php');
?>
