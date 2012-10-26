jquery.stickOnScroll
====================

**SEE PROJECT WEB SITE: http://purtuga.github.com/jquery.stickOnScroll/**

A jQuery plugin for making elements fixed on the top of the page when scrolling reaches the desired top offset from the viewport (window). The plugin will also scroll that element back up if a footer element is defined. The footer element is watched to see when it comes close to the bottom edge of the fixed element (an offset is provided).

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

Note that in the example above I set the height of the div.section-title-container. This was just for demonstrations purposes and could have been achieved via other methods, The reason for setting the height of the element around the header is that once the header is fixed on the page, it is removed from the normal flow of the document. By setting the surrounding element's height, the document structure should be maintained when the header is moved to position: position.

This plugin will manipulate the following css properties on the element that will be fixed:

-   top
-   position


Options
-------


-   **topOffset**       :   *Integer. Optional. Default=0* <br />
                            The number of pixels from the top of the viewport (window) before the element triggers to fixed. **Note:** This value must be an integer. 
-   **bottomOffset**    :   *Integer. Optional. Default=0* <br />
                            The number of pixels between the bottom of the fixed element and the top of the footer before the fixed element scrolls back up the page.
-   **footerElement**   :   *HTMLElement|jQuery|selector. Optional. Default=null* <br />
                            The footer element to be used for triggering the fixed element to scroll back up.
-   **stickClass**      :   *String. Optional. Default="stickOnScroll-on" * <br />
                            The class name that will be added to the fixed element when it is fixed on the page.


License
-------

Release under the terms of the [MIT](http://www.opensource.org/licenses/mit-license.php) License.


*Copyright 2012 [Paul Tavares](http://paultavares.wordpress.com/). All rights reserved.*

