<?php
register_nav_menu( 'primary', 'Main Menu' );
show_admin_bar(false);

/**
* 	Works in WordPress 4.1 or later.
*/
if ( version_compare( $GLOBALS['wp_version'], '5.5', '<' ) ) {
	require get_template_directory() . '/inc/back-compat.php';
}

/**
 * Proper way to enqueue scripts and styles
 */
function fresh_scripts() {
	wp_enqueue_style( 'style-reset', get_template_directory_uri() . '/css/reset.css' );
	wp_enqueue_style( 'style-main', get_stylesheet_uri() );
	// Boot strap
	wp_enqueue_script( 'plugin-bundler', 'https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/js/bootstrap.bundle.min.js', array('jquery'), '1.0.0', true );
	wp_enqueue_script( 'plugin-popper', 'https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js', array('jquery'), '1.0.0', true );
	wp_enqueue_script( 'plugin-bootstrap', 'https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/js/bootstrap.min.js', array('jquery'), '1.0.0', true );

	wp_enqueue_script( 'react', 'https://unpkg.com/react@17/umd/react.development.js', array(), null);
	wp_enqueue_script( 'react-dom', 'https://unpkg.com/react-dom@17/umd/react-dom.development.js', array( 'react' ), null );
	wp_enqueue_script( 'babel', 'https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/6.26.0/babel.min.js', array(), null);

	// Main
	wp_enqueue_script( 'plugin-script', get_template_directory_uri() . '/js/plugins.js', array('jquery'), '1.0.0', true );
	wp_enqueue_script( 'jsx', get_template_directory_uri() . '/js/scripts.js', array('react', 'react-dom', 'babel'), true );
}

add_action( 'wp_enqueue_scripts', 'fresh_scripts' );

function md_modify_jsx_tag( $tag, $handle, $src ) {
  // Check that this is output of JSX file
  if ( 'jsx' == $handle ) {
    $tag = str_replace( "<script type='text/javascript'", "<script type='text/babel'", $tag );
  }

  return $tag;
}
add_filter( 'script_loader_tag', 'md_modify_jsx_tag', 10, 3 );

/* Custom admin page */

function testimonials_posttype() {

    register_post_type( 'movies',
        array(
            'labels' => array(
                'name' => __( 'Testimonials' ),
                'singular_name' => __( 'Testimonial' )
            ),
            'public' => true,
            'has_archive' => true,
            'rewrite' => array('slug' => 'testimonials'),
            'show_in_rest' => true,

        )
    );
}
// Hooking up our function to theme setup
add_action( 'init', 'testimonials_posttype' );

// Ajax functions

add_action("wp_ajax_create_menu", "create_menu");
add_action("wp_ajax_nopriv_create_menu", "create_menu");

function create_menu() {
	global $wpdb;

	$menuArr = array();
	$menuLocations = get_nav_menu_locations();
	$menuID = $menuLocations['primary'];
	$primaryNav = wp_get_nav_menu_items($menuID);

	foreach ( $primaryNav as $navItem ) {
			$pageID = get_post_meta( $navItem->ID, '_menu_item_object_id', true );
    	$menuArr[] = array("id" => $pageID, "title" => $navItem->title);

	}

	echo json_encode($menuArr);
	die();

}
// Bookwhen API integration
add_action("wp_ajax_get_fat_info", "get_fat_info");
add_action("wp_ajax_nopriv_get_fat_info", "get_fat_info");

function get_fat_info() {

	$curl = curl_init("https://api.bookwhen.com/v2/events?filter[calendar]=y3ioqnsgmxvg");

	curl_setopt($curl, CURLOPT_USERPWD, "dnt40pnrmugmr1uhhqhh8p6queh6");
	curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);

	$rest = curl_exec($curl);

	if(curl_errno($curl))
	{
	    echo 'Curl error : ' . curl_error($curl);
	}

	curl_close($curl);

	echo $rest;
	die();
}

// Get page info by slug for presentation to the front end
add_action("wp_ajax_get_page_info", "get_page_info");
add_action("wp_ajax_nopriv_get_page_infoo", "get_page_info");

function get_page_info() {
	global $post;

	$pages = get_pages();
	$pageArr = Array();

	foreach ( $pages as $page ) {

		$getcontent = $page->post_content;
		$content = apply_filters( 'the_content', $getcontent );
		$pageArr[] = Array("title" => $page->post_title, "content" => $content);

  }

	echo json_encode($pageArr);

	die();
}

?>
