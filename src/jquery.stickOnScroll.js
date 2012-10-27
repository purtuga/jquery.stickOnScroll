/**
 * jquery.stickOnScroll.js
 * A jQuery plugin for making element fixed on the page.
 * 
 * Created by Paul Tavares on 2012-10-19.
 * Copyright 2012 Paul Tavares. All rights reserved.
 * Licensed under the terms of the MIT License
 * 
 */
;(function($){
    
    // Check if we're working in IE. Will control the animation
    // on the fixed elements.
    var isIE = ($.support.optSelected === false ? true : false);
    
    // List of viewports and associated array of bound sticky elements
    var viewports = {};
    
    /**
     * Function bound to viewport's scroll event. Loops through
     * the list of elements that needs to be sticked for the
     * given viewport.
     * "this" keyword is assumed to be the viewport.
     * 
     * @param {eventObject} jQuery's event object.
     * 
     * @return {Object} The viewport (this keyword)
     * 
     */
    function processElements(ev) {
        
        var elements = viewports[$(this).prop("stickOnScroll")];
        
        // Loop through all elements bound to this viewport.
        for(var i=0,j=elements.length; i<j; i++){
            var o = elements[i];
            
            // FIXME: Should the clean up of reference to removed element store the position in the array and delete it later?
            
            // If element has no parent, then it must have been removed from DOM...
            // Remove reference to it
            if (o !== null) {
                if (o.ele[0].parentNode == null) {
                    elements[i] = o = null;
                }
            }
            if (o !== null) {
                
                // Get the scroll top position on the view port
                // and set the maxTop before we stick the element
                // to be it's "normal" topPosition minus offset
                var scrollTop   = o.viewport.scrollTop(),
                    maxTop      = (o.eleTop - o.topOffset);
              
                // TODO: What about calculating top values with margin's set?
                // pt.params.footer.css('marginTop').replace(/auto/, 0)
                
                // If not using the window object, then stop any IE animation
                if (o.isWindow === false && isIE) {
                    o.ele.stop();
                }
    
                // If the current scrollTop position plus the topOffset is greater
                // than our maxTop value, then make element stick on the page.
                // if ((scrollTop + o.topOffset) > maxTop) {
                if (    (o.isWindow === true && (scrollTop + o.topOffset) > maxTop)
                    ||  (o.isWindow === false && o.eleTop < scrollTop )
                ){
                    
                    var cssPosition = {
                            position:   "fixed",
                            top:        o.topOffset
                        };
                    if (o.isWindow === false) {
                        cssPosition = {
                            position:   "absolute",
                            top:        (scrollTop + o.topOffset)
                        };
                    }
                    
                    o.isStick = true;
                    
                    
                    // ---> HAS FOOTER ELEMENT?
                    // check to see if it we're reaching the footer element,
                    // and if so, scroll the item up with the page
                    if  (o.footerElement.length) {
                        
                        // Calculate the distance from the *bottom* of the fixed
                        // element to the footer element, taking into consideration
                        // the bottomOffset that may have been set by the user. 
                        var footerTop   = o.footerElement.position().top,
                            eleHeight   = o.ele.outerHeight(),
                            yAxis       = (
                                cssPosition.top + eleHeight + o.bottomOffset + o.topOffset );
                            
                        if (o.isWindow === false) {
                            yAxis = (eleHeight + o.bottomOffset + o.topOffset);
                        
                        } else {
                            yAxis = (o.ele.offset().top + eleHeight + o.bottomOffset);
                            footerTop = o.footerElement.offset().top;
                        }
                        
                        if (yAxis > footerTop) {
                            if (o.isWindow === true) {
                                cssPosition.top = (  
                                        footerTop - ( scrollTop + eleHeight + o.bottomOffset )
                                    );
                                
                            // Absolute positioned element
                            } else {
                                cssPosition.top = (scrollTop - (yAxis - footerTop));
                            }
                        }
                    }
                    
                    // Stick the element
                    if (isIE && o.isWindow === false) {
                        o.ele.addClass(o.stickClass)
                            .css("position", cssPosition.position)
                            .animate({top: cssPosition.top}, 150);
                        
                    } else {
                        o.ele.css(cssPosition).addClass(o.stickClass);
                    }
                    
                    
                // ELSE, If the scrollTop of the view port plus the topOffset is
                // less than the maxTop, then throw the element back into the 
                // page normal flow                    
                } else if ((scrollTop + o.topOffset) <= maxTop) {
                    if (o.isStick) {
                        o.ele.css({
                                position: "",
                                top: ""
                            })
                            .removeClass(o.stickClass);
                        o.isStick = false;
                    }
                }
                
            }// is element setup null?
            
        };//end: for()
        
        return this;
        
    };//end: processElements()
    
    
    /**
     * Make the selected items stick to the top of the viewport
     * upon reaching a scrolling offset.
     * This method manipulates the following css properties on
     * the element that is to be sticky: top, position.
     * Elements also receive a css class named 'hasStickOnScroll'. 
     *  
     * @param {Object} options
     * 
     * @return {jQuery} this
     * 
     */
    $.fn.stickOnScroll = function(options) {
        return this.each(function(){
            
            // If element already has stickonscroll, exit.
            if ($(this).hasClass("hasStickOnScroll")) {
                return this;
            }
            
            // Setup options for tis instance
            var o       = $.extend({}, {
                            topOffset:      0,
                            bottomOffset:   5,
                            footerElement:  null,
                            viewport:       window,
                            stickClass:     'stickOnScroll-on'
                        }, options);
            
            o.isStick       = false,
            o.ele           = $(this).addClass("hasStickOnScroll"),
            o.viewport      = $(o.viewport),
            o.eleTop        = o.ele.offset().top,
            o.footerElement = $(o.footerElement),
            o.isWindow      = true;
            
            if (o.viewport[0].constructor.toString().search(/window/i) < 0) {
                o.isWindow  = false;
                o.eleTop    = o.ele.position().top;
            }
            
            var viewportKey = o.viewport.prop("stickOnScroll");
            
            // If this viewport is not yet defined, set it up now 
            if (!viewportKey) {
                
                viewportKey = "stickOnScroll" + String(Math.random()).replace(/\D/g,""); 
                o.viewport.prop("stickOnScroll", viewportKey);
                viewports[viewportKey] = [];
                o.viewport.on("scroll", processElements);

            }
            
            // Push this element's data to this view port's array
            viewports[viewportKey].push(o);
            
        });//end: each()
        
    };//end: $.fn.stickOnScroll()
    
})(jQuery);


