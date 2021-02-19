<?php
register_nav_menu( 'primary', 'Main Menu' );
show_admin_bar(false);
add_theme_support( 'post-thumbnails' );

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
	wp_enqueue_style( 'style-animate', "https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css" );
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

/* Add custom meta box for templates */

function fat_template_id_custom_box() {
    $screens = array( 'post', 'page' );
    foreach ( $screens as $screen ) {
        add_meta_box(
            'fat_template_id',                 // Unique ID
            'Page Template',      // Box title
            'fat_template_box_html',  // Content callback, must be of type callable
            $screen,                            // Post type
						'side',
						'high'
        );
    }
}
add_action( 'add_meta_boxes', 'fat_template_id_custom_box' );

function fat_template_box_html( $post ) {
		$value = get_post_meta( $post->ID, '_fat_template_meta_key', true );
    ?>
    <label for="fat_template_field">Choose a page template</label>
    <select name="fat_template_field" id="fat_template_field" class="postform">
        <option value="default" <?php selected( $value, 'default' ); ?>>Home</option>
        <option value="about" <?php selected( $value, 'about' ); ?>>About</option>
        <option value="classes" <?php selected( $value, 'classes' ); ?>>Classes</option>
    </select>
    <?php
}

function fat_template_save_postdata( $post_id ) {
    if ( array_key_exists( 'fat_template_field', $_POST ) ) {
        update_post_meta(
            $post_id,
            '_fat_template_meta_key',
            $_POST['fat_template_field']
        );
    }
}
add_action( 'save_post', 'fat_template_save_postdata' );

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

	if ( !isset($_POST["pageid"]) || $_POST["pageid"] == "" ) {
		$postid = get_option( 'page_on_front' );
	} else {
		$postid = $_POST['pageid'];
	}

	$post = get_post($postid);
	$pageArr = Array();

	$template = get_post_custom_values( '_fat_template_meta_key', $postid);

	$post_title = $post->post_title;
	$post_content = $post->post_content;
	$featured_img_url = get_the_post_thumbnail_url($postid,'full');
	$content = apply_filters( 'the_content', $post_content );
	$pageArr[] = Array("title" => $post_title, "content" => $content, "image" => $featured_img_url, "id" => $postid, "template" => $template[0]);


	echo json_encode($pageArr);

	die();
}

?>
