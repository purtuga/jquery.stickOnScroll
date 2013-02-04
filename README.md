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
                bootomOffset:   20
            });
    });

Will make the h2 heading "Section 1" stick to the top of the page (css position: fixed) and will watch for when the footer element (the paragraph with id = section1footer) comes within 20 pixels of the bottom of the h2 element at which point, the header is scrolled up with the normal flow of the page.

In the example above the height of the div.section-title-container is set prior to calling stickOnScroll(). This was just for demonstrations purposes and could have been achieved via other methods (ie. css). The reason for setting the height of the element around the header is that once the header is fixed on the page, it is removed from the normal flow of the document. By setting the surrounding element's height, the document structure should be maintained when the header is moved to position: position. **NOTE** Since this is such a common need, a new input option (_setParentOnStick_) has been added, wich will automatically set the height of the parent element when set to true. 

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
                            The viewport that will be used to watch for scrolling. Default is the browser window. Set this to specific elements if sticking elements within a fixed height element with overflow set to auto or scroll and position set to either relative, absolute or fixed. (**Note** for html element, these setting are important). 

-   **setParentOnStick**    :   *Boolean. Optional. Default=false* <br />
                            If true, the parent element of the node that will be Stick On Scroll will have it's css height attribute set to the height of the node. Use this option when wanting the page flow to maintain the original height of the element when Stick on Scroll is applied.  This option will manipulate only the css height attibute of the parent element and only when the node is "stuck". When not Stuck, the css height is set to "" (empty). 



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
        viewport: $("div.info")
    });


License
-------

Release under the terms of the [MIT](http://www.opensource.org/licenses/mit-license.php) License.


Change Log
----------

### Version 1.2, <<< date TBD >>>

-   [Feature] New input option *hasStickOnScroll*


### Version 1.1, 10/27/2012

-   Initial public version


______________

*Copyright 2012 [Paul Tavares](http://paultavares.wordpress.com/). All rights reserved.*

