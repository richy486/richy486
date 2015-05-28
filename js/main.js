jQuery(document).ready(function($){
	//final width --> this is the quick view image slider width
	//maxQuickWidth --> this is the max-width of the quick-view panel
	var sliderFinalWidth = 400,
		maxQuickWidth = 900,
        selectedId = "";

    $.fn.extend({
        id : function() {
            return this.attr('id');
        }
    });

	//open the quick view panel
	$('.cd-trigger').on('click', function(event){
		var selectedImage = $(this).parent('.cd-item').children('img');
			// , slectedImageUrl = selectedImage.attr('src');
        selectedId = $(this).parent('.cd-item').id();

		$('body').addClass('overlay-layer');
		animateQuickView(selectedImage, sliderFinalWidth, maxQuickWidth, 'open');

        // TODO: fix this
        // slectedImageUrl = "img/gems-1.png";

        var hashString = "#";
        var classString = ".cd-quick-view";
        var identifer = hashString.concat(selectedId, classString);
        var sliderWrapper = $(identifer).find('.cd-slider-wrapper');
        var cdSlider = sliderWrapper.find('.cd-slider');
        var target = cdSlider.children('li');//.find('.selected');
        var targetImage = target.children('img');
        var targetImageUrl = targetImage.attr('src');

		//update the visible slider image in the quick view panel
		//you don't need to implement/use the updateQuickView if retrieving the quick view data with ajax
		updateQuickView(targetImageUrl);
	});

	//close the quick view panel
	$('body').on('click', function(event){
		if( $(event.target).is('.cd-close') || $(event.target).is('body.overlay-layer')) {
			closeQuickView( sliderFinalWidth, maxQuickWidth);
		}
	});
	$(document).keyup(function(event){
		//check if user has pressed 'Esc'
    	if(event.which=='27'){
			closeQuickView( sliderFinalWidth, maxQuickWidth);
		}
	});

	//quick view slider implementation
	$('.cd-quick-view').on('click', '.cd-slider-navigation a', function(){
		updateSlider($(this));
	});

	//center quick-view on window resize
	$(window).on('resize', function(){
		if($('.cd-quick-view').hasClass('is-visible')){
			window.requestAnimationFrame(resizeQuickView);
		}
	});

	function updateSlider(navigation) {
		var sliderConatiner = navigation.parents('.cd-slider-wrapper').find('.cd-slider'),
			activeSlider = sliderConatiner.children('.selected').removeClass('selected');
		if ( navigation.hasClass('cd-next') ) {
			( !activeSlider.is(':last-child') ) ? activeSlider.next().addClass('selected') : sliderConatiner.children('li').eq(0).addClass('selected'); 
		} else {
			( !activeSlider.is(':first-child') ) ? activeSlider.prev().addClass('selected') : sliderConatiner.children('li').last().addClass('selected');
		} 
	}

	function updateQuickView(url) {
		$('.cd-quick-view .cd-slider li').removeClass('selected').find('img[src="'+ url +'"]').parent('li').addClass('selected');
	}

	function resizeQuickView() {
		var quickViewLeft = ($(window).width() - $('.cd-quick-view').width())/2,
			quickViewTop = ($(window).height() - $('.cd-quick-view').height())/2;
		$('.cd-quick-view').css({
		    "top": quickViewTop,
		    "left": quickViewLeft,
		});
	} 

	function closeQuickView(finalWidth, maxQuickWidth) {
		var close = $('.cd-close'),
			activeSliderUrl = close.siblings('.cd-slider-wrapper').find('.selected img').attr('src'),
			selectedImage = $('.empty-box').find('img');
		//update the image in the gallery
		if( !$('.cd-quick-view').hasClass('velocity-animating') && $('.cd-quick-view').hasClass('add-content')) {

            // Don't update image
			// selectedImage.attr('src', activeSliderUrl);
			animateQuickView(selectedImage, finalWidth, maxQuickWidth, 'close');
		} else {
			closeNoAnimation(selectedImage, finalWidth, maxQuickWidth);
		}
	}

	function animateQuickView(image, finalWidth, maxQuickWidth, animationType) {
		//store some image data (width, top position, ...)
		//store window data to calculate quick view panel position

        // <div id="gems" class="cd-quick-view">
        //     <div class="cd-slider-wrapper">
        //         <ul class="cd-slider">
        //             <li class="selected"><img src="img/gems-1.png" alt="Screen shot 1"></li>

        var hashString = "#";
        var classString = ".cd-quick-view";
        var identifer = hashString.concat(selectedId, classString);

        // .find('.cd-slider')

        var sliderWrapper = $(identifer).find('.cd-slider-wrapper');
        var cdSlider = sliderWrapper.find('.cd-slider');
        var selected = cdSlider.find('.selected');
        var selectedImage = selected.children('img');

        var identiferItem = $(identifer);

        // image = selectedImage;
        // var selectedImage $(identifer).find('.cd-slider-wrapper').find('.cd-slider').find('.selected');

		var parentListItem = image.parent('.cd-item'),
			selectedTop = image.offset().top - $(window).scrollTop(),
			selectedLeft = image.offset().left,
			selectedWidth = image.width(),
			selectedHeight = selectedWidth,//image.height(),
			windowWidth = $(window).width(),
			windowHeight = $(window).height(),
			finalLeft = (windowWidth - finalWidth)/2,
			finalHeight = finalWidth * selectedHeight/selectedWidth,
			finalTop = (windowHeight - Math.max(finalHeight, $(window).height() * 0.9))/2,
			quickViewWidth = ( windowWidth * .8 < maxQuickWidth ) ? windowWidth * .8 : maxQuickWidth ,
			quickViewLeft = (windowWidth - quickViewWidth)/2,
            quickViewHeight = $(window).height() * 0.9 //Math.max(finalHeight, $(window).height() * 0.9)

        // selectedHeight = 257;
        // selectedLeft = 507.6875;
        // selectedTop = 146;
        // selectedWidth = 257;

        // image is the thumb

		if( animationType == 'open') {
			//hide the image in the gallery
			parentListItem.addClass('empty-box');
            selectedImage.addClass('empty-box');
			//place the quick view over the image gallery and give it the dimension of the gallery image
			$(identifer).css({
			    "top": selectedTop,
			    "left": selectedLeft,
			    "width": selectedWidth,
                "height": selectedHeight,
			}).velocity({
				//animate the quick view: animate its width and center it in the viewport
				//during this animation, only the slider image is visible
			    'top': finalTop+ 'px',
			    'left': finalLeft+'px',
			    'width': finalWidth+'px',
                'height': finalHeight+'px',
			}, 1000, [ 400, 20 ], function(){
				//animate the quick view: animate its width to the final value
				$(identifer).addClass('animate-width').velocity({
					'left': quickViewLeft+'px',
			    	'width': quickViewWidth+'px',
                    'height': quickViewHeight+'px',
				}, 300, 'ease' ,function(){
					//show quick view content
					$(identifer).addClass('add-content');
				});
			}).addClass('is-visible');
		} else {
			//close the quick view reverting the animation
			$(identifer).removeClass('add-content').velocity({
			    'top': finalTop+ 'px',
			    'left': finalLeft+'px',
			    'width': finalWidth+'px',
                'height': finalHeight+'px',
			}, 300, 'ease', function(){
				$('body').removeClass('overlay-layer');
				$(identifer).removeClass('animate-width').velocity({
					"top": selectedTop,
				    "left": selectedLeft,
				    "width": selectedWidth,
                    "height": selectedHeight,
				}, 500, 'ease', function(){
					$(identifer).removeClass('is-visible');
					parentListItem.removeClass('empty-box');
				});
			});
		}
	}
	function closeNoAnimation(image, finalWidth, maxQuickWidth) {
		var parentListItem = image.parent('.cd-item'),
			selectedTop = image.offset().top - $(window).scrollTop(),
			selectedLeft = image.offset().left,
			selectedWidth = image.width();

		//close the quick view reverting the animation
		$('body').removeClass('overlay-layer');
		parentListItem.removeClass('empty-box');
		$('.cd-quick-view').velocity("stop").removeClass('add-content animate-width is-visible').css({
			"top": selectedTop,
		    "left": selectedLeft,
		    "width": selectedWidth,
		});
	}
});