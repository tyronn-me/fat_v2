<?php
	$slogan = get_field('slogan');
	$main_image = get_field('main_image');
	$instagramPost = get_field('instagram_post');
	$ServiceCards = get_field('service_cards');
?>

<div class="siteLoader"><div class="siteLoaderImg"></div><div class="loadingMSG"><p class="">Loading....please wait</p></div></div>

<div id="topPaint"></div>

<div class="container" id="featuredContainer">
	<div class="row justify-content-between" id="featuredRow">
		<div class="col-md-5" id="intro">
			<h1 class="display-4"><?php echo $slogan; ?></h1>
			<?php if ( have_posts() ) : ?>
				<?php while ( have_posts() ) : the_post(); ?>
					<?php echo the_content(); ?>
				<?php endwhile; ?>
			<?php endif; ?>
		</div><!-- col -->
		<div class="col-md-5">
			<img id="mainImage" src="<?php echo $main_image; ?>" class="lazy" />
			<div class="imageBorder"></div>
		</div><!-- col -->
	</div><!-- row -->
</div><!-- container -->

<div class="container-fluid" id="instageamContainer">
	<div class="container">
	<div class="row">
		<h2 class="h1"><?php echo $instagramPost["title"]; ?></h2>
	</div><!-- row -->
	<div class="row">
		<?php echo $instagramPost["caption"]; ?>
	</div><!-- row -->
	<div class="row videoRow">
		<?php if ( $instagramPost["video"] ) { ?>
		<div class="embed-responsive embed-responsive-16by9">
			<iframe src="<?php echo $instagramPost["video_url"]; ?>" class="embed-responsive-item" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>
		</div>
		<?php } else { ?>

		<?php } ?>
	</div><!-- row -->
	</div><!-- container -->
</div><!-- container -->

<div class="container-fluid" id="serviceContainer">
<div class="container">
	<div class="row" id="serviceTitle">
		<h2 class="h1">Let's get you moving!</h2>
	</div><!-- row -->
	<div class="row" id="serviceDesc">
		<?php echo $ServiceCards["description"]; ?>
	</div><!-- row -->
	<div class="row justify-content-md-center" id="classRow">
	</div><!-- row -->
</div><!-- container -->
</div>

<div class="container" id="testimonials">
	<div class="row">
		<div class="col-md-12" id="testimonialsHeader">
			<h2 class="h1">Some kind words</h2>
		</div><!-- col -->
		<div class="col-md-12">
			<div id="testimonialCarousel" class="carousel slide" data-ride="carousel">
			  <div class="carousel-inner">
				<?php
					$args = array( 'post_type' => 'movies', 'posts_per_page' => 10 );
					$the_query = new WP_Query( $args );
					$slideNum = 1;
				?>
				<?php if ( $the_query->have_posts() ) : ?>
				<?php while ( $the_query->have_posts() ) : $the_query->the_post(); ?>
			    <div class="carousel-item <?php if ( $slideNum == 1 ) { ?>active<?php } ?> rounded">
			      <?php the_content(); ?>
			      <h3><?php the_title(); ?> <i class="fas fa-comment-dots"></i></h3>
			    </div>
				<?php
					$slideNum++;
					endwhile;
				wp_reset_postdata(); ?>
				<?php else:  ?>
				<p><?php _e( 'Sorry, no posts matched your criteria.' ); ?></p>
				<?php endif; ?>
			  </div>
			</div>
		</div><!-- col -->
		<div class="col-md-12">
			<ul class="nav carNav justify-content-center">
			  <li class="nav-item">
			    <a href="#" class="prevBtn"><i class="fas fa-chevron-left"></i></a>
			  </li>
			  <li class="nav-item">
			    <a href="#" class="nextBtn"><i class="fas fa-chevron-right"></i></a>
			  </li>
			</ul>
		</div><!-- col -->
	</div><!-- row -->
</div><!-- testimonials -->

<div class="container" id="contactContainer">
	<div class="row">
		<div class="col-md">
			<h2 class="display-4">Have Questions?</h2>
			<p class="lead">Want to book a class or just have questions regarding any of the classes we offer?</p>
			<a href="mailto:liina@freshairtraining.ca" class="btn btn-primary btn-md">Please get in touch!</a>
		</div><!-- col -->
	</div><!-- row -->
</div><!-- container -->


<div class="container" id="footer">
	<div class="row">
		<p>Images and content copyright &copy; Fresh Air Training <?php echo date("Y"); ?></p>
	</div>
</div>
