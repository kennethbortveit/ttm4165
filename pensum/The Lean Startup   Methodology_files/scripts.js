var principlesDeckDirection = 'forward';
var deckCurrentNumber = 1;

function isIOS(){
    if (navigator.userAgent.match(/AppleWebKit.+Mobile/i)) {
        return true;
    }else{
        return false;
    }
}

// New bookLeaders object - on mouseenter interaction + initial auto random
bookLeaders = {
	fadeSpeed: 250,
	interval: 6000,
	randomNumber: function(){
		var self = this;
		self.randomno = Math.floor ( Math.random() * self.quoteCount );
	},
	autoFadeQuotes: function(){
		var self = this;
		if( self.autoPlay ){
			self.oldQuoteIndex = $(self.quotes).index( self.oldQuote );
			if( self.randomno == self.oldQuoteIndex ){
				self.randomNumber();
				self.autoFadeQuotes();
			}else{
				self.hasActive = $(self.quotes).hasClass('active');
				if( self.hasActive ){
					$(self.oldQuote).find('blockquote').fadeOut( self.fadeSpeed, function(){
						$(self.oldQuote).removeClass('active');
						self.oldQuote = $(self.quotes[ self.randomno ] );
						self.newQuote = $(self.quotes[ self.randomno ] );
						$(self.newQuote).addClass('active');
						$(self.newQuote).find('blockquote').fadeIn( self.fadeSpeed, function(){
							setTimeout(function(){
								bookLeaders.randomNumber();
								self.autoFadeQuotes();
							}, self.interval);
						});
					});
				}else{
					self.newQuote = $(self.quotes[ self.randomno ] );
					self.oldQuote = $(self.quotes[ self.randomno ] );
					$(self.newQuote).addClass('active');
					$(self.newQuote).find('blockquote').fadeIn( self.fadeSpeed, function(){
						setTimeout(function(){
							self.randomNumber();
							self.autoFadeQuotes();
						}, self.interval);
					});
				}
			}
		}
	},
	fadeQuote: function( elem, fade ){
		var self = this;
		if( fade == 'in'){
			$(elem).find('blockquote').fadeIn( self.fadeSpeed );
		}else if( fade == 'out' ){
			$(elem).find('blockquote').fadeOut( self.fadeSpeed );
		}
	},
	init: function(){
		var self = this;
		if( $('#book_leaders ul.leadersInTheMovement').length ){
			self.autoPlay = true;
			self.quotes = $('ul.leadersInTheMovement li');
			self.quoteCount = self.quotes.length;
			self.randomNumber();
			self.newQuote = $(self.quotes[ self.randomno ] );
			self.autoFadeQuotes();
			
			$(self.quotes).mouseenter(function(e){
				self.autoPlay = false;
				self.quotes.find('blockquote').fadeOut();
				self.fadeQuote( this, 'in' );
			}).mouseleave(function(e){
				self.autoPlay = true;
				self.fadeQuote( this, 'out' );
			});
		}
	}
};

$(document).ready(function(){
    DOMUtilities.init();
    bookLeaders.init();
    
    window.validateForms = {};
    
    if( $('.requestForm').length ){
    	$('.requestForm').each(function(){
    		var formID = this.id;    		
    		window.validateForms[formID] = new FormValidator(formID);    		
	        var processing = false;
	        
	        $('#'+formID).bind('submit', function(event){
	        	
	            event.preventDefault();
	            var form = this;
	            var formSuccess = $(this).siblings('.formMessages').find('.success');
	            var formFail = $(this).siblings('.formMessages').find('.fail');
	            
	            if( window.validateForms[this.id].validate() ){
	            	
	                processing = true;
	                $(form).find('input.submit').attr('src', $(form).find('input.submit').attr('src').replace(/_.\.png/,'_d.png'));
	                formSuccess.hide();
	                formFail.hide();
	                
	                $.post(this.action, $(this).serialize(),function(data){
	                    if(data.success){
	                        formSuccess.show();
	                    }else{
	                        formFail.show();
	                    }
	                    processing = false;
	                    $(form).find('input.submit').attr('src', $(form).find('input.submit').attr('src').replace(/_.\.png/,'_i.png'));
	                }, "json");
	            }
	        });
    	});
    }
    
    /*
     * Load tweets
     */
    $("#fave-tweets").load("twitter-feed.php");
    
    /*
     * Scroll To Code
     */
    
    $('.scrollTo').bind('click', function(event){
        event.preventDefault();
        
        var targetId = this.hash;
        var theTarget = $(targetId);
        var customOffset = 0;
        switch( targetId ){
            case '#dropbox':
            case '#principles':
                customOffset = -80;
            break;
            default:
                customOffset = -20;
        }

        if( isIOS() ){
            if (theTarget.length) {
                var targetOffset = (theTarget.offset().top) + customOffset;
                $('html,body').animate({scrollTop: targetOffset}, 1000);
                return false;
            }
        }else{
            $(window).scrollTo( targetId, {
                duration: 1000,
                offset: customOffset
            });
        }
    });
    
    /*
     * Navigation for the Principles SlideDeck.
     * This function binds the prev/next commands 
     * to the buttons below the deck.
     */
    var principlesDeckElem = $('#principles_slidedeck_frame dl')[0];
    $('#principles_slidedeck_frame .slidedeckNav a').bind('click', function(event){
        event.preventDefault();
        if( this.href.split("#")[1] == 'prev' ){
            if( deckCurrentNumber > 1 ){
                principlesDeckDirection = 'backward';
                principlesDeck.prev();
            }
        }else if( this.href.split("#")[1] == "next" ){
            if( deckCurrentNumber < principlesDeck.slides.length ) {
                principlesDeckDirection = 'forward';
                principlesDeck.next();
            }
        }
    });
    
    /*
     * Setup the numbering for the SlideDeck.
     * This function generates some spans that populate 
     * the circular number so they can be faded in/out.
     */
    $('.slidedeckNav').show();
    if( $('#slidedeck_slide_number').length ){
        $('#principles_slidedeck_frame dl.slidedeck dd').each(function(i){
            $('#slidedeck_slide_number').append('<div class="number-'+(i+1)+'" style="display: none;">'+(i+1)+'</div>')
        });
        $('#slidedeck_slide_number div:eq(0)').show();
        $('#principles_slidedeck_frame .slidedeckNav a.prev').addClass("disabled");
    }
    
    if( $('#company_quotes_wrapper').length ){
    	$('#company_quotes').cycle({
    		pager: '#company_quotes_nav',
    		timeout: 5000
    	});
    	var quotes = $('#company_quotes li').length;
    	var quotesWidth = (quotes * 16);
    	$('#company_quotes_nav').css({
    		position: 'absolute',
    		bottom: 0,
    		left: '50%',
    		width: quotesWidth,
    		marginLeft: - ( quotesWidth / 2 )
    	});
    }
	
	if( $('a.fancy').length ){
		$('a.fancy').fancybox({
			type: 'image'
		});
	}
	if( $('a.video').length ){
		$('a.video').fancybox({
			padding: 0			
		});
	}
	
	if( $('#social_share').length ){
		var socialLinks = $('#social_share a.socialIcon');
		var socialTips = $('#social_share span.tooltip');
		socialLinks.mouseenter(function(e){
			var index = socialLinks.index( this );
			$(socialTips[index]).show();
		}).mouseleave(function(e){
			socialTips.hide();
		});
	}
    
    if( $('#lsu_navigation_wrapper').length ){
    	$('#lsu_navigation_wrapper').show();
    	var navButton = $('a#lsu_nav_button_link');
		var navList = $('#lsu_navigation');
		var navItems = navList.find('ul a').not('.noScroll');
		navButton.click(function(e){
			e.preventDefault();					
			if( navList.hasClass('closed') ){
				navList.removeClass('closed').addClass('opened');
				navList.animate({
					left: 0
				}, 250);
			}else if( navList.hasClass('opened') ){
				navList.removeClass('opened').addClass('closed');
				if ( navList.hasClass('wider') ) {
    				navList.animate({
    					left: -484
    				}, 250);
				} else {
    				navList.animate({
    					left: -426
    				}, 250);
				}
			}
		});
		
		navItems.click(function(e){
			e.preventDefault();
	        var targetId = this.hash;
	        var theTarget = $(targetId);
	        var customOffset = 0;
	        switch( targetId ){
	            case '#dropbox':
	            case '#principles':
	                customOffset = -80;
	            break;
	            default:
	                customOffset = -20;
	        }
	
	        if( isIOS() ){
	            if (theTarget.length) {
	                var targetOffset = (theTarget.offset().top) + customOffset;
	                $('html,body').animate({scrollTop: targetOffset}, 1000);
	                return false;
	            }
	        }else{
	            $(window).scrollTo( targetId, {
	                duration: 1000,
	                offset: customOffset
	            });
	        }
		});
		
		$('#lpib_navigation_top').click(function(e){
	        e.preventDefault();
	    });
    }
    
    if( $('a#book_book_link').length ){
    	$('a#book_book_link').click(function(e){
    		e.preventDefault;
    		var linkHREF = $(this).attr('href');
	        $(document).scrollTo( linkHREF, 500, { offset: { top: -50 } } );
    	});
    }
    
    if( $('a.ebooks').length ){
    	var ebookRetailers = $('div.ebooks-dropdown');
    	var ebookLinks = $('a.ebooks');
    	$(ebookLinks).click(function(e){
    		e.preventDefault();
    		var ebookRetailer = $(this).parent('div.retailers-body').siblings('.ebooks-dropdown');
			ebookRetailers.fadeOut( 150 );
    		if( $(this).hasClass('active') ) {
    			$(this).removeClass('active');
    		}else{
    			$(ebookLinks).removeClass('active');
    			$(this).addClass('active');
	    		ebookRetailer.fadeIn( 150 );
    		}
    	});
    	$(ebookRetailers).find('a').not('a.ebooks').click(function(e){
    		ebookRetailers.fadeOut( 150 );
    		$(ebookLinks).removeClass('active');
    	});
		$('#wrapper').click(function(e){
			if( !$(e.target).is('a.ebooks, .ebooks-dropdown, .ebooks-dropdown a') ){
	    		$(ebookLinks).removeClass('active');
				ebookRetailers.fadeOut( 150 );
			}
		});
    }
        
});
