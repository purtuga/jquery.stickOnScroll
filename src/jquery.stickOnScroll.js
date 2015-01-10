/**
 * jquery.stickOnScroll.js
 * A jQuery plugin for making element fixed on the page.
 *
 * Created by Paul Tavares on 2012-10-19.
 * Copyright 2012 Paul Tavares. All rights reserved.
 * Licensed under the terms of the MIT License
 *
 */

;(function(factory) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else {
        factory(jQuery);
    }
}(function($){

    "use strict";
    /*jslint plusplus: true */
    /*global $,jQuery */

    var
        // Check if we're working in IE. Will control the animation
        // on the fixed elements.
        isIE = ($.support.optSelected === false ? true : false),

        // List of viewports and associated array of bound sticky elements
        viewports = {},

        // Local variable to hold methods
        fn = {};

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

        var elements = viewports[$(this).prop("stickOnScroll")],
            i,j;

        // Loop through all elements bound to this viewport.
        for( i=0,j=elements.length; i<j; i++ ){

            // Scope in the variables
            // We call this anonymous funnction with the
            // current array element ( elements[i] )
            (function(o){

                var scrollTop,
                    maxTop,
                    cssPosition,
                    footerTop,
                    eleHeight,
                    yAxis;

                // get this viewport options
                o = elements[i];

                // FIXME: Should the clean up of reference to removed element store the position in the array and delete it later?

                // If element has no parent, then it must have been removed from DOM...
                // Remove reference to it
                if (o !== null) {

                    // jquery contains works on dom object; not jquery selections
                    if (!$.contains(document.documentElement, o.ele[0])) {

                        elements[i] = o = null;

                    }

                }
                if (o !== null) {

                    // Get the scroll top position on the view port
                    scrollTop   = o.viewport.scrollTop();

                    // set the maxTop before we stick the element
                    // to be it's "normal" topPosition minus offset
                    maxTop      = o.getEleMaxTop();

                    // TODO: What about calculating top values with margin's set?
                    // pt.params.footer.css('marginTop').replace(/auto/, 0)

                    // If not using the window object, then stop any IE animation
                    if (o.isWindow === false && isIE) {
                        o.ele.stop();
                    }

                    // If the current scrollTop position is greater
                    // than our maxTop value, then make element stick on the page.
                    if (scrollTop >= maxTop){

                        cssPosition = {
                            position:   "fixed",
                            top:        ( o.topOffset - o.eleTopMargin )
                        };

                        if (o.isWindow === false) {

                            cssPosition = {
                                position:   "absolute",
                                top:        ( ( scrollTop + o.topOffset ) -  o.eleTopMargin )
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
                            footerTop   = o.getEleTopPosition(o.footerElement);
                            eleHeight   = o.ele.outerHeight();
                            yAxis       = ( cssPosition.top + eleHeight +
                                            o.bottomOffset + o.topOffset );

                            if (o.isWindow === false) {

                                yAxis = (eleHeight + o.bottomOffset + o.topOffset);

                            } else {

                                yAxis = ( cssPosition.top + scrollTop +
                                          eleHeight + o.bottomOffset );

                                footerTop = o.getElementDistanceFromViewport(o.footerElement);

                            }

                            // If the footer element is overstopping the sticky element
                            // position, then adjust it so that we make room for the
                            // fotoer element.
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

                        // If o.setParentOnStick is true, then set the
                        // height to this node's parent.
                        if (o.setParentOnStick === true) {

                            o.eleParent.css("height", o.eleParent.height());

                        }

                        // If o.setWidthOnStick is true, then set the width on the
                        // element that is about to be Sticky.
                        if (o.setWidthOnStick === true) {

                            o.ele.css("width", o.ele.css("width"));

                        }

                        // If we have additional stick offset, apply it now
                        if (!o.isViewportOffsetParent) {

                            cssPosition.top = (
                                cssPosition.top - o.getElementDistanceFromViewport(o.eleOffsetParent)
                            );

                        }

                        // Stick the element
                        if (isIE && o.isWindow === false) {

                            o.ele
                                .addClass(o.stickClass)
                                .css("position", cssPosition.position)
                                .animate({top: cssPosition.top}, 150);

                        } else {

                            o.ele
                                .css(cssPosition)
                                .addClass(o.stickClass);

                        }

                        // If making element stick now, then trigger
                        // onStick callback if any
                        if (o.wasStickCalled === false) {

                            o.wasStickCalled = true;

                            setTimeout(function(){

                                if (o.isOnStickSet === true) {

                                    o.onStick.call(o.ele, o.ele);

                                }

                                o.ele.trigger("stickOnScroll:onStick", [o.ele]);

                            }, 20);

                        }

                    // ELSE, If the scrollTop of the view port is
                    // less than the maxTop, then throw the element back into the
                    // page normal flow
                    } else if (scrollTop <= maxTop) {

                        if (o.isStick) {

                            // reset element
                            o.ele
                                .css({
                                    position: "",
                                    top: ""
                                })
                                .removeClass(o.stickClass);

                            o.isStick = false;

                            // Reset parent if o.setParentOnStick is true
                            if (o.setParentOnStick === true) {

                                o.eleParent.css("height", "");

                            }

                            // Reset the element's width if o.setWidthOnStick is true
                            if (o.setWidthOnStick === true) {

                                o.ele.css("width", "");

                            }

                            o.wasStickCalled = false;

                            setTimeout(function(){

                                // Execute the onUnStick if defined
                                if (o.isOnUnStickSet) {

                                    o.onUnStick.call( o.ele, o.ele );

                                }

                                o.ele.trigger("stickOnScroll:onUnStick", [o.ele]);

                            }, 20);

                        }
                    }

                    // Recalculate the original top position of the element...
                    // this could have changed from when element was initialized
                    // - ex. elements were inserted into DOM. We re-calculate only
                    // if the we're at the very top of the viewport, so that we can
                    // get a good position.
                    if (scrollTop === 0) {

                        o.setEleTop();

                    }

                }// is element setup null?

            })( elements[i] );

        }//end: for()

        return this;

    }//end: processElements()


    /**
     * Make the selected items stick to the top of the viewport
     * upon reaching a scrolling offset.
     * This method manipulates the following css properties on
     * the element that is to be sticky: top, position.
     * Elements also receive a css class named 'hasStickOnScroll'.
     *
     * @param {Object} options
     * @param {Integer} [options.topOffset=0]
     * @param {Integer} [options.bottomOffset=5]
     * @param {Object|HTMLElement|jQuery} [options.footerElement=null]
     * @param {Object|HTMLElement|jQuery} [options.viewport=window]
     * @param {String} [options.stickClass="stickOnScroll-on"]
     * @param {Boolean} [options.setParentOnStick=false]
     * @param {Boolean} [options.setWidthOnStick=false]
     * @param {Function} [options.onStick=null]
     * @param {Function} [options.onUnStick=null]
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
            var o   = $.extend({}, {
                            topOffset:          0,
                            bottomOffset:       5,
                            footerElement:      null,
                            viewport:           window,
                            stickClass:         'stickOnScroll-on',
                            setParentOnStick:   false,
                            setWidthOnStick:    false,
                            onStick:            null,
                            onUnStick:          null
                        }, options),
                viewportKey,
                setIntID,
                setIntTries = 1800; // 1800 tries * 100 milliseconds = 3 minutes

            o.isStick                   = false;
            o.ele                       = $(this).addClass("hasStickOnScroll");
            o.eleParent                 = o.ele.parent();
            o.eleOffsetParent           = o.ele.offsetParent();
            o.viewport                  = $(o.viewport);
            o.eleTop                    = 0;
            o.eleTopMargin              = parseFloat(
                                            (o.ele.css("margin-top") || 0)
                                        ) || 0;
            o.footerElement             = $(o.footerElement);
            o.isWindow                  = true;
            o.isOnStickSet              = $.isFunction(o.onStick);
            o.isOnUnStickSet            = $.isFunction(o.onUnStick);
            o.wasStickCalled            = false;
            o.isViewportOffsetParent    = true;

            /**
             * Retrieves the element's top position based on the type of viewport
             * and sets on the options object for the instance. This Top position
             * is the element top position relative to the the viewport.
             *
             * @return {Integer}
             */
            o.setEleTop = function(){

                if (o.isStick === false) {

                    if (o.isWindow) {

                        o.eleTop = o.ele.offset().top;

                    } else {

                        o.eleTop = ( o.ele.offset().top - o.viewport.offset().top );

                    }

                }

            }; //end: o.setEleTop()

            /**
             * REturns an elements top position in relation
             * to the viewport's Top Position.
             *
             * @param {jQuery} $ele
             *          This element must be inside the viewport
             *
             * @return {Integer}
             *
             */
            o.getEleTopPosition = function($ele) {

                var pos = 0;

                if (o.isWindow) {

                    pos = $ele.offset().top;

                } else {

                    pos = ( $ele.offset().top - o.viewport.offset().top );

                }

                return pos;

            }; /* o.getEleTopPosition() */

            /**
             * Get's the MAX top position for the element before it
             * is made sticky. In some cases the max could be less
             * than the original position of the element, which means
             * the element would always be sticky... in these instances
             * the max top will be set to the element's top position.
             *
             * @return {Integer}
             */
            o.getEleMaxTop = function() {

                var max = ( ( o.eleTop - o.topOffset ));

                if (!o.isWindow) {

                    max = (max + o.eleTopMargin);

                    // If ele parent is not the viewport, then adjust the max top


                }

                return max;

            }; //end: o.getEleMaxTop()

            /**
             * Gets the distance between the top of the element and the
             * top of the viewport. Basically the offset from the top of
             * the "page" inside the viewport. This distance is alwasy the
             * same even if the viewport is scrolled. The only time it
             * changes is when elements are inserted or removed above the
             * the Element or item above it are hidden/displayed.
             * Methods uses the Position() values until it reaches the
             * viewport
             */
            o.getElementDistanceFromViewport = function($ele) {

                var distance    = $ele.position().top,
                    $parent     = $ele.offsetParent();

                // If the parent element is the root body element, then
                // we've reached the last possible offsetParent(). Exit
                if ($parent.is("body") || $parent.is("html")) {

                    return distance;

                }

                // If the positioned parent of this element is NOT
                // the viewport, then add the distance of that element's
                // top position
                if ($parent[0] !== o.viewport[0] ) {

                    distance = (
                        distance +
                        o.getElementDistanceFromViewport( $parent )
                    );

                // ELSE, this is the viewport... Adjust the elements
                // Distance by adding on the amount of scroll the element
                // currently has
                } else {

                    distance = (distance + o.viewport.scrollTop());

                }

                return distance;

            }; /* end: .getElementDistanceFromViewport() */

            // If setParentOnStick is true, and the parent element
            // is the <body>, then set setParentOnStick to false.
            if (o.setParentOnStick === true && o.eleParent.is("body")){

                o.setParentOnStick = false;

            }

            if (!$.isWindow(o.viewport[0])) {

                o.isWindow  = false;

            }

            /**
             * Adds this sticky element to the list of element for the viewport.
             *
             */
            function addThisEleToViewportList() {

                o.setEleTop();

                viewportKey = o.viewport.prop("stickOnScroll");

                // If the viewport is not the Window element, and the view port is not the
                // stick element's imediate offset parent, then we need to adjust the
                // top-offset so that element are position correctly.
                // See issue #3 on github
                if (!o.isWindow) {

                    o.isViewportOffsetParent    = ( o.eleOffsetParent[0] === o.viewport[0] );

                }

                // If this viewport is not yet defined, set it up now
                if (!viewportKey) {

                    viewportKey = "stickOnScroll" + String(Math.random()).replace(/\D/g,"");
                    o.viewport.prop("stickOnScroll", viewportKey);
                    viewports[viewportKey] = [];
                    o.viewport.on("scroll", processElements);

                }

                // Push this element's data to this view port's array
                viewports[viewportKey].push(o);

                // Trigger a scroll even
                o.viewport.scroll();

            } /* end: addThisEleToViewportList() */

            // If Element is not visible, then we have to wait until it is
            // in order to set it up. We need to obtain the top position of
            // the element in order to make the right decision when it comes
            // to making the element sticky.
            if (o.ele.is(":visible")) {

                addThisEleToViewportList();

            } else {

                setIntID = setInterval(function(){

                    if (o.ele.is(":visible") || !setIntTries) {

                        clearInterval(setIntID);
                        addThisEleToViewportList();

                    }

                    --setIntTries;

                }, 100);

            }

            return this;

        });//end: each()

    };//end: $.fn.stickOnScroll()

}));
