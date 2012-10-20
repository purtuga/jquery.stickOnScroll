/**
 * jquery.stickOnScroll.js
 * A jQuery plugin for making element fixed on the page.
 * 
 * Created by Paul Tavares on 2012-10-19.
 * Copyright 2012 Paul Tavares. All rights reserved.
 * 
 */
;(function($){
    
    /**
     * Watches the selected elements for when they reach the top
     * of the viewport and makes then sticky (fixed) at that point.
     *  
     * @param {Object} options
     * 
     */
    $.fn.stickOnScroll = function(options) {
        return this.each(function(){
            var o       = $.extend({}, {
                            topOffset: 0,
                            bottomOffset: 0,
                            footerElement: null,
                            viewport: window,
                            stickClass: 'stickOnScroll-on'
                        }, options),
                ele     = $(this).addClass("hasStickOnScroll"),
                isStick = false;
            
            o.viewport  = $(o.viewport),
            o.eleTop    = ele.position().top;
            
            
            // FIXME: What about calculating top values with margin's set?
            // pt.params.footer.css('marginTop').replace(/auto/, 0)
            
            // ON SCROLL event
            // FIXME: For performance reasons, a scroll event should only be bound once
            //        An array of bound elements should be kept locally that would then
            //        be checked and adjusted if needed. 
            o.viewport.on("scroll", function(ev){
                
                // Get the scroll top position on the view port
                // and set the maxTop before we stick the element
                // to be it's "normal" topPosition minus offset
                var scrollTop       = o.viewport.scrollTop(),
                    maxTop          = (o.eleTop - o.topOffset);
              
                // If the current scrollTop position plus the topOffset is greater
                // than our maxTop value, then make element stick on the page.
                if ((scrollTop + o.topOffset) > maxTop) {
         
                    o.eleStickTop = ele.position().top;
                    ele.css({
                            position: "fixed",
                            top: o.topOffset
                        })
                        .addClass(o.stickClass);
                    isStick = true;

                    // check to see if it we're reaching the footer element,
                    // and if so, scroll the item up with the page
                    if  (o.footerElement) {
                        
                        // Calculate the distance from the *bottom* of the fixed
                        // element to the footer element, taking into consideration
                        // the bottomOffset that may have been set by the user. 
                        var footerTop = o.footerElement.position().top;
                        var eleHeight = ele.outerHeight();
                        var eleCurrTop = ele.position().top;
                        
                        var eleHeightFromViewPort = (eleCurrTop + eleHeight + o.topOffset); 
                        var yAxis = (eleHeightFromViewPort + o.bottomOffset);                        
                   
                        if (yAxis > footerTop) {
                            ele.css("top", footerTop - (  scrollTop + eleHeight + o.topOffset  ));
                            
                        } else {
                            ele.css("top", o.topOffset);
                        }
                    }
                    
                // ELSE, If the scrollTop of the view port plus the topOffset is
                // less than the maxTop, then throw the element back into the 
                // page normal flow                    
                } else if ((scrollTop + o.topOffset) <= maxTop) {
                   
                    if (isStick) {
                        ele.css({
                                position: "",
                                top: ""
                            })
                            .removeClass(o.stickClass);
                        isStick = false;
                    }
                }
            });//end: scroll even binding
            
        });//end: each()
        
    };//end: $.fn.stickOnScroll()
    
})(jQuery);


