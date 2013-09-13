/**
* hoverIntent r6 // 2011.02.26 // jQuery 1.5.1+
* <http://cherne.net/brian/resources/jquery.hoverIntent.html>
* 
* @param  f  onMouseOver function || An object with configuration options
* @param  g  onMouseOut function  || Nothing (use configuration options object)
* @author    Brian Cherne brian(at)cherne(dot)net
*/
(function($){$.fn.hoverIntent=function(f,g){var cfg={sensitivity:7,interval:100,timeout:0};cfg=$.extend(cfg,g?{over:f,out:g}:f);var cX,cY,pX,pY;var track=function(ev){cX=ev.pageX;cY=ev.pageY};var compare=function(ev,ob){ob.hoverIntent_t=clearTimeout(ob.hoverIntent_t);if((Math.abs(pX-cX)+Math.abs(pY-cY))<cfg.sensitivity){$(ob).unbind("mousemove",track);ob.hoverIntent_s=1;return cfg.over.apply(ob,[ev])}else{pX=cX;pY=cY;ob.hoverIntent_t=setTimeout(function(){compare(ev,ob)},cfg.interval)}};var delay=function(ev,ob){ob.hoverIntent_t=clearTimeout(ob.hoverIntent_t);ob.hoverIntent_s=0;return cfg.out.apply(ob,[ev])};var handleHover=function(e){var ev=jQuery.extend({},e);var ob=this;if(ob.hoverIntent_t){ob.hoverIntent_t=clearTimeout(ob.hoverIntent_t)}if(e.type=="mouseenter"){pX=ev.pageX;pY=ev.pageY;$(ob).bind("mousemove",track);if(ob.hoverIntent_s!=1){ob.hoverIntent_t=setTimeout(function(){compare(ev,ob)},cfg.interval)}}else{$(ob).unbind("mousemove",track);if(ob.hoverIntent_s==1){ob.hoverIntent_t=setTimeout(function(){delay(ev,ob)},cfg.timeout)}}};return this.bind('mouseenter',handleHover).bind('mouseleave',handleHover)}})(jQuery);

$(function(){
	
	$('.calEvent').each(function(){

	    var noInfo = ($(this).children('.eventInfo').length > 0 ? false : true);

	    if (noInfo) {
	        $(this).append('<span class="eventInfo"><span class="eventTime">All Day</span></span>');
	        $(this).children('.eventName').appendTo($(this).children('.eventInfo'));
	    }
	});

	$('.nav.second').setup_navigation();
	
	$('#future-students-nav').attr('role', 'menubar').attr('aria-controls','st1').find('li').attr('role', 'menuitem');
	
	// If future students is focus'd remove any open menus
	$('#future-students-nav li a').focus(function(){
		$('.nav.second, #search-box').find('ul.menu-open').removeClass('menu-open').addClass('menu-closed').attr({ 'aria-hidden': 'true'});
		$('.nav.second').find('li.menu-selected').removeClass('menu-selected');
	});	
	
	// Add additional keys for future students menu to seemlessly work with current students menu
	$('#future-students-nav li, #search-box li').keydown(function(e){
		/* LEFT || UP */
		if((e.keyCode == 37)||(e.keyCode == 38)){
			e.preventDefault();
			// This is the first item
			if($(this).prev('li.future-students-label').length == 1) {
				// Jump over to Current Students Menu Last
				$(this).parents('ul').siblings('.nav.second').find('> li').last().find('a').first().focus();			
			} else {
				$(this).prev('li').find('a').first().focus();
			}
		/* RIGHT || DOWN */
		} else if((e.keyCode == 39)||(e.keyCode == 40)) {
			e.preventDefault();
			// This is the last item
			if($(this).next('li').length == 0) {
				// Jump over to Current Students Menu First
				$(this).parents('ul').siblings('.nav.second').find('> li').first().find('a').first().focus();	
			} else {
				$(this).next('li').find('a').first().focus();
			}
		} 
	});
	
	$('#search-box ul').addClass('menu-closed').attr({ 'aria-hidden': 'true', 'role': 'menu' }).find('li').attr('role', 'menuitem');
	
	$('#search-box :text, #search-box button').focus(function(){
		$('#search-box :text').attr({'role':'search'});
		$('#search-box ul').removeClass('menu-closed').addClass('menu-open').attr({ 'aria-hidden': 'false'});
		//$('#search-box ul').find('a').attr('tabIndex', 0);
	}).keydown(function(){
		if ($('#search-box ul').hasClass('menu-open')){
			$('#search-box ul').removeClass('menu-open').addClass('menu-closed').attr({ 'aria-hidden': 'true'});
			//$('#search-box ul').find('a').attr('tabIndex', -1);
		}
	})
	
	$('#search-box ul li a').focus(function(){
		$('#search-box ul').removeClass('menu-closed').addClass('menu-open').attr({ 'aria-hidden': 'false'});
	});
	
	var openMenu = function(){
		$('#search-box ul').removeClass('menu-closed').addClass('menu-open').attr({ 'aria-hidden': 'true'});
	}
	
	var closeMenu = function(){
		$('#search-box ul').removeClass('menu-open').addClass('menu-closed').attr({ 'aria-hidden': 'true'});
	}
	
	var config = {  
		 sensitivity: 10,  
	     over: openMenu, // function = onMouseOver callback (REQUIRED)    
	     timeout: 300, // number = milliseconds delay before onMouseOut    
	     out: closeMenu // function = onMouseOut callback (REQUIRED)    
	};
	
	$('#search-box').hoverIntent(config)
	
	$(document).click(function(){
		$('#search-box ul').removeClass('menu-open').addClass('menu-closed').attr({ 'aria-hidden': 'true'});
	});

});

var keyCodeMap = {
    48:"0", 49:"1", 50:"2", 51:"3", 52:"4", 53:"5", 54:"6", 55:"7", 56:"8", 57:"9", 59:";",
    65:"a", 66:"b", 67:"c", 68:"d", 69:"e", 70:"f", 71:"g", 72:"h", 73:"i", 74:"j", 75:"k", 76:"l",
    77:"m", 78:"n", 79:"o", 80:"p", 81:"q", 82:"r", 83:"s", 84:"t", 85:"u", 86:"v", 87:"w", 88:"x", 89:"y", 90:"z",
    96:"0", 97:"1", 98:"2", 99:"3", 100:"4", 101:"5", 102:"6", 103:"7", 104:"8", 105:"9"
};

$.fn.setup_navigation = function(settings) {

	settings = jQuery.extend({
		menuHoverClass: 'show-menu'
	}, settings);

	
	// Add ARIA role to menubar and menu items
	$(this).attr('role', 'menubar').attr('aria-controls','st1').find('li').attr('role', 'menuitem');

	var top_level_links = $(this).find('> li > a');

	// Set tabIndex to -1 so that top_level_links can't receive focus until menu is open
	$(top_level_links).next('ul')
		.attr({ 'aria-hidden': 'true', 'role': 'menu' })
		.find('a')
			.attr('tabIndex',-1);

	// Adding aria-haspopup for appropriate items
	$(top_level_links).each(function(){
		if($(this).next('ul').length > 0)
			$(this).parent('li').attr('aria-haspopup', 'true').attr('aria-controls','st1');
	});


	var openMenu = function(){
		//$(this).closest('ul')
			// .attr('aria-hidden', 'false')
			// .find('.'+settings.menuHoverClass)
			// 	.attr('aria-hidden', 'true')
			// 	.removeClass(settings.menuHoverClass)
			// 	.find('a')
			// 		.attr('tabIndex',-1);
		$(this).parent('ul').find('.menu-open')
		.attr('aria-hidden','true')
			.removeClass(settings.menuHoverClass)
			.removeClass('menu-open').addClass('menu-closed')
			.find('a')
				.attr('tabIndex', -1);
		$(this).parent('ul').find('.menu-open').parent().removeClass('menu-selected');	
			
		$(this).addClass('menu-selected');	
		$(this).children('ul')
			.attr('aria-hidden', 'false')
			.addClass(settings.menuHoverClass)
			.removeClass('menu-closed')
			.addClass('menu-open')
			.find('a').attr('tabIndex',0);

	
	}
	
	var closeMenu = function(){
		$(this).removeClass('menu-selected');
		$(this).closest('ul')
			.attr('aria-hidden', 'false')
			.addClass(settings.menuHoverClass)
			.find('a').attr('tabIndex',0);
		$(this).children('ul')
			// .attr('aria-hidden', 'false')
			// .find('.'+settings.menuHoverClass)
				.attr('aria-hidden', 'true')
				.removeClass(settings.menuHoverClass)
				.removeClass('menu-open').addClass('menu-closed')
				.find('a')
					.attr('tabIndex',-1);
	
	}
	
	var config = {  
		 sensitivity: 10,  
	     over: openMenu, // function = onMouseOver callback (REQUIRED)    
	     timeout: 300, // number = milliseconds delay before onMouseOut    
	     out: closeMenu // function = onMouseOut callback (REQUIRED)    
	};
	
	$(top_level_links).each(function(){
		$(this).parent('li').hoverIntent(config)
	});
	

	
	$(top_level_links).focus(function(){
		

		// ALL ELEMENTS
		$(this).parents('ul').first().find('.'+settings.menuHoverClass)
			.attr('aria-hidden','true')
			.removeClass(settings.menuHoverClass)
			.removeClass('menu-open').addClass('menu-closed')
				.find('a').attr('tabIndex',-1);
		$(this).parents('ul').first().find('.menu-selected').removeClass('menu-selected');
		
		// ELEMENT YOU ARE ON
		$(this).parent().addClass('menu-selected')
			.children('ul').first()
				.attr('aria-hidden', 'false')
				.addClass(settings.menuHoverClass)
				.removeClass('menu-closed').addClass('menu-open')
				.find('a').attr('tabIndex', 0);
		
		// $(this).closest('ul')
		// 	.attr('aria-hidden', 'false')
		// 	.find('.'+settings.menuHoverClass)
		// 		.attr('aria-hidden', 'true')
		// 		.removeClass(settings.menuHoverClass)
		// 		.removeClass('menu-open').addClass('menu-closed')
		// 		.find('a')
		// 			.attr('tabIndex',-1);
		// $(this).parent().addClass('menu-selected');
		// 	
		// 	
		// 			
		// $(this).next('ul')
		// 	.attr('aria-hidden', 'false')
		// 	.addClass(settings.menuHoverClass)
		// 	.removeClass('menu-closed').addClass('menu-open')
		// 	.find('a').attr('tabIndex',0);
		// $(this).next('ul').parent().removeClass('menu-selected');
	});

	

	// Bind arrow keys for navigation
	$(top_level_links).keydown(function(e){
		
		/* LEFT ARROW */
		if(e.keyCode == 37) {
			e.stopPropagation();
			// This is the first item
			if($(this).parent('li').prev('li').length == 0) {
				// $(this).parents('ul').find('> li').last().find('a').first().focus();
				// Jump over to Future Students Menu Last
				$(this).parents('ul').siblings('#future-students-nav').find('> li').last().find('a').first().focus();			
			} else {
				$(this).parent('li').prev('li').find('a').first().focus();
			}
		/* UP ARROW */
		} else if(e.keyCode == 38) {
			e.stopPropagation();
			// if($(this).parent('li').find('ul').length > 0) {
			// 	$(this).parent('li').find('ul')
			// 		.attr('aria-hidden', 'false')
			// 		.addClass(settings.menuHoverClass)
			// 		.find('a').attr('tabIndex',0)
			// 			.last().focus();
			// }
			
			if($(this).parent('li').prev('li').length == 0) {
				// $(this).parents('ul').find('> li').last().find('a').first().focus();
				// Jump over to Future Students Menu Last
				$(this).parents('ul').siblings('#future-students-nav').find('> li').last().find('a').first().focus();			
			} else {
				$(this).parent('li').prev('li').find('a').first().focus();
			}
			
		/* RIGHT ARROW */
		} else if(e.keyCode == 39) {
			e.stopPropagation();					
			// This is the last item
			if($(this).parent('li').next('li').length == 0) {
				//$(this).parents('ul').find('> li').first().find('a').first().focus();
				// Jump over to Future Students Menu First
				$(this).parents('ul').siblings('#future-students-nav').find('> li:nth-child(2)').first().find('a').first().focus();	
			} else {
				$(this).parent('li').next('li').find('a').first().focus();
			}
		/* DOWN ARROW */
		} else if(e.keyCode == 40) {
			e.stopPropagation();		
			// if($(this).parent('li').find('ul').length > 0) {
			// 	$(this).parent('li').find('ul')
			// 		.attr('aria-hidden', 'false')
			// 		.addClass(settings.menuHoverClass)
			// 		.find('a').attr('tabIndex',0)
			// 			.first().focus();
			// }
			
			// check if it has a sub menu first
			if ($(this).parent('li').find('ul').length > 0){
				$(this).parent('li').find('ul')
					.attr('aria-hidden', 'false')
					.addClass(settings.menuHoverClass)
					.find('a').attr('tabIndex',0)
						.first().focus();				
			} else {
				
				if($(this).parent('li').next('li').length == 0) {
					// $(this).parents('ul').find('> li').last().find('a').first().focus();
					// Jump over to Future Students Menu First
					$(this).parents('ul').siblings('#future-students-nav').find('> li').find('a').first().focus();			
				} else {
					$(this).parent('li').next('li').find('a').first().focus();
				}
			}
			
			
		/* ENTER || SPACE */
		} else if(e.keyCode == 13 || e.keyCode == 32) {
			// If submenu is hidden, open it
			e.preventDefault();
			$(this).parent('li').find('ul[aria-hidden=true]')
					.attr('aria-hidden', 'false')
					.addClass(settings.menuHoverClass)
					.find('a').attr('tabIndex',0)
						.first().focus();
		/* ESCAPE */
		} else if(e.keyCode == 27) {
			e.preventDefault();
			// $('.'+settings.menuHoverClass)
			// 	.attr('aria-hidden', 'true')
			// 	.removeClass(settings.menuHoverClass)
			// 	.find('a')
			// 		.attr('tabIndex',-1);
			
			// if this is the first item in list jump to future-students
			if ($(this).parent('li').prev('li').length == 0) {
				$('#future-students-nav').find('> li').find('a').last().focus();	
			} else {
				$(this).parent('li').prev('li').find('a').first().focus();			
			}

		} else {
			$(this).parent('li').find('ul[aria-hidden=false] a').each(function(){
				if($(this).text().substring(0,1).toLowerCase() == keyCodeMap[e.keyCode]) {
					$(this).focus();
					return false;
				}
			});
		}
	});

	var links = $(top_level_links).parent('li').find('ul').find('a');
	
	$(links).keydown(function(e){
		/* UP ARROW */
		if(e.keyCode == 38) {
			e.preventDefault();
			// This is the first item
			if($(this).parent('li').prev('li').length == 0) {
				// Replaced
				//$(this).parents('ul').parents('li').find('a').first().focus();
				// check to see if there is a previous sub menu
				if ($(this).parent('li').parent('ul').siblings('h3').length == 0){
					$(this).parents('ul').parents('li').find('a').first().focus();
				} else {
					// if there is not a previous sub menu go back up top
					if ($(this).parent().parent().parent().prev('li').length == 0){
						$(this).parent().parent().parent().parent().parent().find('a').first().focus();
					} else {
						$(this).parent().parent().parent().prev('li').find('a').last().focus();
					}
				}
				
				
			} else {
				$(this).parent('li').prev('li').find('a').first().focus();
			}
		/* DOWN ARROW */
		} else if(e.keyCode == 40) {
			e.preventDefault();
			
			
			// console.log('AM I THE LAST ITEM IN THIS LIST?');
			// console.log($(this).parent('li').next('li').length == 0 ? true : false);			
			if ($(this).parent('li').next('li').length == 0){
			
			
				// console.log('IS THERE ANOTHER SUB MENU?');
				// console.log($(this).parents('ul').first().parent().next('li').length == 0 ? false : true);
				if ($(this).parents('ul').first().parent().next('li').length == 0){
				
				
					// console.log('IS THERE ANOTHER LINK ON THE MAIN MENU?');
					// console.log($(this).parents('ul').first().parents('ul').first().parent().next('li').length == 0 ? false : true);					
					if ($(this).parents('ul').first().parents('ul').first().parent().next('li').length == 0){
						
						// console.log('GO TO BEGGINING OF MAIN MENU ->');
						// console.log($(this).parents('ul').last().siblings('ul').first().children('li').find('a').first());
						$(this).parents('ul').last().siblings('ul').first().children('li').find('a').first().focus();
						
					} else {
						// console.log('GO TO NEXT ELEMENT ON MAIN MENU ->');
						// console.log($(this).parents('ul').first().parents('ul').first().parent().next('li').find('a').first());
						$(this).parents('ul').first().parents('ul').first().parent().next('li').find('a').first().focus();
					}
					

				} else {
					
					// console.log('GO TO NEXT SUB MENU ->');
					// console.log($(this).parents('ul').first().parent().next('li').children('ul').first().children('li').first().find('a').first());
					$(this).parents('ul').first().parent().next('li').children('ul').first().children('li').first().find('a').first().focus();
					
				}
		
			} else {
				// console.log('SELECT NEXT ELEMENT')
				$(this).parent('li').next('li').find('a').first().focus();
			}
						
			
		/* ESCAPE  */
		} else if(e.keyCode == 27) {
			e.preventDefault();
			// if the menu is the first element
			if ($(this).parents('li').last().prev('li').length == 0){
				$(this).parents('ul').siblings('#future-students-nav').find('> li').last().find('a').first().focus();
			} else {
				$(this).parents('li').last().prev('li').find('a').first().focus();
			}
			
			
			
		/* LEFT ARROW */
		} else if (e.keyCode == 37){
			e.preventDefault();
			if ($(this).parent().parent('ul').parent().prev('li').length == 0) {
				
			} else {
				$(this).parent().parent('ul').parent().prev('li').find('a').first().focus();
			}
			
		/* RIGHT ARROW */		
		} else if (e.keyCode == 39){
			e.preventDefault();
			if ($(this).parent().parent('ul').parent().next('li').length == 0) {
				
			} else {
				$(this).parent().parent('ul').parent().next('li').find('a').first().focus();
			}
						
		/* SPACE */
		} else if(e.keyCode == 32) {
			e.preventDefault();
			window.location = $(this).attr('href');
		} else {
			var found = false;
			$(this).parent('li').nextAll('li').find('a').each(function(){
				if($(this).text().substring(0,1).toLowerCase() == keyCodeMap[e.keyCode]) {
					$(this).focus();
					found = true;
					return false;
				}
			});

			if(!found) {
				$(this).parent('li').prevAll('li').find('a').each(function(){
					if($(this).text().substring(0,1).toLowerCase() == keyCodeMap[e.keyCode]) {
						$(this).focus();
						return false;
					}
				});
			}
		}
	});


	// Hide menu if click or focus occurs outside of navigation
	$(this).find('a').last().keydown(function(e){ 
		if(e.keyCode == 9) {
			// If the user tabs out of the navigation hide all menus
			// $('.'+settings.menuHoverClass)
			// 	.attr('aria-hidden', 'true')
			// 	.removeClass(settings.menuHoverClass)
			// 	.find('a')
			// 		.attr('tabIndex',-1);
			
			// console.log('USER TABBED OUT OF MENU');
			// console.log($(this).parents('ul').first().parents('ul').first());
			$(this).parents('ul').first().parents('ul').first()
				.attr('aria-hidden','true')
				.removeClass(settings.menuHoverClass).removeClass('menu-open')
				.addClass('menu-closed')
					.find('a').attr('tabIndex',-1);
			$(this).parents('ul').first().parents('ul').first().parent().removeClass('menu-selected');
		}
	});

	$(document).click(function(){ 
		$('.menu-open')
			.attr('aria-hidden', 'true')
			.removeClass(settings.menuHoverClass)
			.removeClass('menu-open')
			.addClass('menu-closed')
				.find('a').attr('tabIndex',-1); 
		$('.menu-selected').removeClass('menu-selected');
	});


	$(this).click(function(e){
		e.stopPropagation();
	});

}

