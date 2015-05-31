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
		// var quickViewLeft = ($(window).width() - $('.cd-quick-view').width())/2,
		// 	quickViewTop = ($(window).height() - $('.cd-quick-view').height())/2;


        var windowWidth = $(window).width(),
            windowHeight = $(window).height(),

            quickViewWidth = ( windowWidth * .8 < maxQuickWidth ) ? windowWidth * .8 : maxQuickWidth ,
            quickViewLeft = (windowWidth - quickViewWidth)/2,
            quickViewHeight = $(window).height() * 0.9,
            quickViewTop = (windowHeight - Math.max(quickViewHeight, $(window).height() * 0.9))/2; //Math.max(finalHeight, $(window).height() * 0.9)
		$('.cd-quick-view').css({
		    "top": quickViewTop,
		    "left": quickViewLeft,
            "width": quickViewWidth
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

        var hashString = "#";
        var classString = ".cd-quick-view";
        var identifer = hashString.concat(selectedId, classString);

        var sliderWrapper = $(identifer).find('.cd-slider-wrapper');
        var cdSlider = sliderWrapper.find('.cd-slider');
        var selected = cdSlider.find('.selected');
        var selectedImage = selected.children('img');

        var itemInfo = $(identifer).find('.cd-item-info');

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

        // image is the thumb

		if( animationType == 'open') {
			//hide the image in the gallery
			parentListItem.addClass('empty-box');
            selectedImage.addClass('empty-box');
			//place the quick view over the image gallery and give it the dimension of the gallery image

            itemInfo.css({
                'margin-left': (sliderWrapper.width() + 50) + 'px'
            });

            $(identifer).addClass('animate-width').css({
                'left': quickViewLeft+'px',
                    'width': quickViewWidth+'px',
                    'height': quickViewHeight+'px',
            });
            $(identifer).css({
                'top': finalTop+ 'px',
                'left': quickViewLeft+'px',
                'width': quickViewWidth+'px',
                'height': quickViewHeight+'px',
            }).addClass('add-content').addClass('is-visible');

		} else {
			//close the quick view reverting the animation


            $('body').removeClass('overlay-layer');
            $(identifer).removeClass('add-content').removeClass('is-visible');
            parentListItem.removeClass('empty-box');
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