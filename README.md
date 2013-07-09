jquery.stickOnScroll
====================

**SEE PROJECT WEB SITE: http://purtuga.github.com/jquery.stickOnScroll/**

A jQuery plugin for making elements fixed on the top of the page when scrolling reaches the desired top offset from the viewport (window or fixed height element with overflow=auto|scroll). The plugin will also scroll that element back up if a footer element is defined. The footer element is watched to see when it comes close to the bottom edge of the fixed element (an offset is provided).


Usage
-----

Given the following html:
    
    <p>some text here</p>
    <div class="section-title-container">
        <h2 style="width: 100%;">Section 1</h2>
    </div>
    <p>Some text here</p>
    <p>Some text here</p>
    <p>Some text here</p>
    <p>Some text here</p>
    <p>Some text here</p>
    <p>Some text here</p>
    <p id="section1footer">Some text here</p>
    
    
And the following javascript code:

    var ele = $("div.section-title-container");
    ele.css("height", ele.outerHeight())
        .find("h2")
            .stickOnScroll({
                footerElement:  $("#section1footer"),
                bootomOffset:   20,
                setParentOnStick: true
            });
    });

Will make the h2 heading "Section 1" stick to the top of the page (css position: fixed) and will watch for when the footer element (the paragraph with id = section1footer) comes within 20 pixels of the bottom of the h2 element at which point, the header is scrolled up with the normal flow of the page.

In the example above the height of the div.section-title-container is set prior to calling stickOnScroll(). This was just for demonstrations purposes and could have been achieved via other methods (ie. css). The reason for setting the height of the element around the header is that once the header is fixed on the page, it is removed from the normal flow of the document. By setting the surrounding element's height, the document structure should be maintained when the header is moved to position: position.

**NOTE** Since this is such a common need, a new input option, _setParentOnStick_, has been added, wich will automatically set the height of the parent element when set to true. 

This plugin will manipulate the following css properties on the element that will be fixed:

-   top
-   position


_**Note: Internet Explorer Behaviour** When used on a viewport that is not the Window object, the fixed element will be animated (gradual slide down) in Internet Explorer in order to avoid the flashing/flickering affect._



Options
-------

-   **topOffset**       :   *Integer. Optional. Default=0* <br />
    The number of pixels from the top of the viewport (window) before the element triggers to fixed. **Note:** This value must be an integer. 

-   **bottomOffset**    :   *Integer. Optional. Default=0* <br />
    The number of pixels between the bottom of the fixed element and the top of the footer before the fixed element scrolls back up the page.

-   **footerElement**   :   *HTMLElement|jQuery|selector. Optional. Default=null* <br />
    The footer element to be used for triggering the fixed element to scroll back up.

-   **stickClass**      :   *String. Optional. Default="stickOnScroll-on"* <br />
    The class name that will be added to the fixed element when it is fixed on the page.

-   **viewport**        :   *HTMLElement|jQuery|selector. Optional. Default=window* <br />
    The viewport that will be used to watch for scrolling. Default is the browser window. Set this to specific elements if sticking elements within a fixed height element with overflow set to auto or scroll and position set to either relative, absolute or fixed. **Note** for html element, these setting are important. 

-   **setParentOnStick**    :   *Boolean. Optional. Default=false* <br />
    If true, the parent element of the node that will be Stick On Scroll will have it's css height attribute set to the height of the node. Use this option when wanting the page flow to maintain the original height of the element when Stick on Scroll is applied.  This option will manipulate only the css height attibute of the parent element and only when the node is "stuck". When not Stuck, the css height is set to "" (empty). 

-   **setWidthOnStick**    :   *Boolean. Optional. Default=false* <br />
    If true, the width of the element that will be made sticky is set so that it maintains the same width when its position is removed from the normal page flow (position:fixed). The width is then removed when the element returns to the normal page flow position. 

-   **onStick**    :   *Function. Optional. Default=null* <br />
    A function to be called when the element becomes sticky on the page. Function will have a scope of element that was made sticky, which will also be provided as the first argument to the Function.
    
    Example:
    
        onStick: function($ele){
            // this = jQuery object of the sticky element
        }
    
-   **onUnStick**    :   *Function. Optional. Default=null* <br />
    A function to be called when the element becomes un-sticky on the page. Function will have a scope of element whose stickiness was removed, which will also be provided as the first argument to the Function.
    
    Example:
    
        onUnStick: function($ele){
            // this = jQuery object of the sticky element
        }
    
Events
------

The following events are triggered by this plugin:

-   **stickOnScroll:onStick**<br>
    Triggered when element is made sticky on the page.
    
    Usage:
    
        $("body").on("stickOnScroll:onStick", function(ev, $stickyEle){
            // ev.target = element that was made sticky - same as $stickyEle
        });
    
    
-   **stickOnScroll:onUnStick**<br>
    Triggered when the element's stickyness is removed and placed back into the normal flow of the page.
    
    Usage:
    
        $("body").on("stickOnScroll:onUnStick", function(ev, $stickyEle){
            // ev.target = element that had Sticky removed - same as $stickyEle
        });

Examples
--------

#### Example 1:

The following example will apply stickOnScroll to a header element inside a scrolling area. Note the css properties set on the viewport element (id=info). 

    <div id="info" style="height: 200px; overflow: auto; position: relative;">
        <div id="info_body" style="height: 2000px;">
            <div style="height: 2em;">
                <div id="header" style="background: green;">Page Header</div>
            </div>
            Long area with content.
        </div>
    </div>

Code:

    $("div.header").stickOnScroll({
        viewport: $("div.info"),
        setParentOnStick: true
    });


License
-------

Release under the terms of the [MIT](http://www.opensource.org/licenses/mit-license.php) License.


Change Log
----------

### Version 1.3, ?????????????

-   [Bug] Fix to elements flickering when footerElement is defined and page is scrolling back up. Merge of contribution by [Clayton](https://github.com/theshortcut) - https://github.com/purtuga/jquery.stickOnScroll/pull/2/files 
-   [Bug] Fix to elements getting sticky too early when viewport was window. Merge of contribution by [Clayton](https://github.com/theshortcut) - https://github.com/theshortcut/jquery.stickOnScroll/commit/f97c2aa2be7dd1f3c00a473bf4cdf702934a871d
-   [bug] Fix to elements getting sticky too early when viewport is not window.
-   [Feature] onStick and onUnStick now trigger events up the DOM. Event names are _stickOnScroll:onStick_ and _stickOnScroll:onUnStick_.
-   [Development] Enhancements to example pages, including a new development panel to assist in debuging (triggered with ALT+Q).

### Version 1.2, Jun. 29, 2013

-   [Feature] New input option *onStick* - Event triggered when the element is made sticky
-   [Feature] New input option *onUnStick* - Event triggered when the element has its stickiness removed
-   [Feature] New input option *setParentOnStick*
-   [Bug] margin-top value of stickOnScroll elements is now used when fixing an element on the page or container (no more transparent space at the top of the element when fixed).


### Version 1.1, 10/27/2012

-   Initial public version


______________

*Copyright 2012 [Paul Tavares](http://paultavares.wordpress.com/). All rights reserved.*

