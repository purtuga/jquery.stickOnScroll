/**
 * Used for development of ths stickOnScroll plugin.
 * Provide an area where we can log message and trigger
 * scrolling 1 px at a time in different viewports.
 * 
 * Meant primarily for use with the Example page.
 * 
 * The development tool is triggered by a url param of
 * devMode (ex. example-01.html?devMode) or by pressing
 * ALT+Q once the page is loaded.
 * 
 */
(function($){
    
    var Main = $.stickOnScrollDebug = {
        
        isDevMode:  false,
        $debugCntr: null,
        $logCntr:   null,
        $log:       null,
        $viewport:  null,
        $scrolltop: null,
        viewportSetup: { }
        
    };
    
    /**
     * setup the UI for development
     */
    Main.setupDebugBar = function() {
        
        Main.$debugCntr = $(
                
                '<div style="background:lightgray;border:1px solid;z-index:5000;' +
                'position:fixed;bottom:0px;left:-2px;width:102%;padding:0px;">' +
                '<div style="width:95%;margin-left:1%">' +
                '<div style="margin-bottom:1em;border-bottom:1px solid;' +
                'padding:.2em;font-weight:bold;">SCROLL[ <a href="javascript:" ' +
                'id="up">up</a> | <a href="javascript:" id="down">down</a> ]' +
                ' LOG[ <a href="javascript:" id="clear">clear</a> ]<span style="' +
                'display:inline-block;width:3em;"></span>' +
                ' VIEWPORT[ <select name="viewport" id="viewportPicker" value="">' +
                '<option value="window">Window</option></select> ' + 
                ' scrollTop: <span id="scrolltop">0</span>]<span style="' +
                'display:inline-block;width:3em;"></span> [<a id="toggle" ' + 
                'href="javascript:">toggle</a>]' +
                '</div><div id="outCntr" style="height: 200px;overflow:auto;position:relative;">' + 
                '<div id="out"></div></div> </div> </div>'
            
            )
            .appendTo("body");
        
        Main.$logCntr   = $("#outCntr");
        Main.$log       = $("#out");
        Main.$scrolltop = $("#scrolltop");
        
        // Evertime user switches viewport, make sure its setup.
        $("#viewportPicker")
            .each(function(){
                
                var $this   = $(this),
                    n       = 1,
                    options = "";
                
                $(".isViewport").each(function(){
                    
                    var $this   = $(this),
                        thisId  = $this.attr("id");
                    
                    if (!thisId) {
                        
                        thisId = $this.attr("id", "sticky" + n).attr("id");
                        n++;
                        
                    }
                    
                    options += '<option value="' + thisId + '">' + 
                                thisId + '</option>'; 
                    
                });
                
                $this.append(options);
                
                return false;
            })
            .change(function(){
                
                var $this           = $(this),
                    thisVal         = $this.val(),
                    $thisViewport   = null;
                
                if (thisVal === "window") {
                    
                    $thisViewport = $(window);
                    
                } else {
                    
                    $thisViewport = $("#" + thisVal);
                    
                }
                
                if (!Main.viewportSetup[thisVal]) {
                    
                    Main.viewportSetup[thisVal] = true;
                    
                    $thisViewport.on("scroll", Main.onScrollLog);
                    
                }
                
                Main.$viewport = $thisViewport;
                
                Main.$viewport.trigger("scroll");
                
            })
            .change(); 
        
        $("#up").click(function(){
            
            Main.$viewport.scrollTop(Main.$viewport.scrollTop() - 1);
            
        });
      
        $("#down").click(function(){
            
            Main.$viewport.scrollTop(Main.$viewport.scrollTop() + 1);
            
        });
      
        $("#clear").click(function(){
            
            Main.$log.empty();
            
        });
        
        $("#toggle").click(function(ev){
            
            if (Main.$logCntr.is(":visible")) {
                
                Main.$logCntr.hide();
                
            } else {
                
                Main.$logCntr.show();
                
            }
            
        });
        
        // Add info. to all elements that have stickOnScroll
        $(".hasStickOnScroll").each(function(){
            
            var $this   = $(this),
                fixType = $this.data("stickytype"),
                info    = "";
            
            switch (fixType){
                
                case "element":
                
                    info += 'position.top: ' + $this.position().top + " | ";
                
                    break;
                
                default:
                    
                    info += 'offset.top: ' + $this.offset().top + " | ";
                    
                    break;
                
            }
            
            info += 'margin-top:' + parseFloat($this.css("margin-top")) +
                " | outerHeight:" + $this.outerHeight();
            
            $this.append(' <span class="dev-info">' + info + '</span>');
            
        });
        
        // Bind on to events
        $("body").on("stickOnScroll:onStick stickOnScroll:onUnStick", function(ev){
            
            var $this   = $(ev.target),
                fixType = $this.data("stickytype"),
                info    = ev.type + ": [" + $this[0].nodeName + 
                        "#" + $this.attr("id") + "]: ";
            
            switch (fixType){
                
                case "element":
                
                    info += 'position.top: ' + $this.position().top + " | ";
                
                    break;
                
                default:
                    
                    info += 'offset.top: ' + $this.offset().top + " | ";
                    
                    break;
                
            }
            
            Main.log( info );
                
        });
        
    }; //end: Main.setupDebugBar()
    
    /**
     * Display the scrollTop() at all times in the dev area
     */
    Main.onScrollLog = function() {
        
        Main.$scrolltop.html( Main.$viewport.scrollTop() );
        
    }; //end: Main.onScrollLog()
    
    
    /**
     * Log messages to the dev area.
     * 
     * @param {Object} msg
     */
    Main.log = function(msg) {
        
        Main.$log.append("<div>" + msg + "</div>");
        Main.$logCntr.scrollTop( Main.$log.outerHeight() );

    }; //end: Main.log()
    
    
    /**
     * Initialize the development tool. By default, this
     * method looks for a URL param of devMode. however,
     * the input param can be used to also trigger the setup.
     * 
     * @param {Boolean} forceSetup
     * 
     */
    Main.init = function(forceSetup) {
        
        if (Main.isDevMode) {
            
            return;
            
        }
        
        if (forceSetup || window.location.search.indexOf("devMode") > -1) {
        
            Main.setupDebugBar();
            
            Main.isDevMode = true;
            
            try {
                console.log("stickOnScroll: debug bar setup done!");
            } catch(e){}
            
        }
        
    }; // Main.init()
    
    
    // initialize
    $(document).ready(function(){
       
       // Setup listener for ALT+Q
       $("body").on("keydown", function(ev){
           
           if (ev.which === 81 && ev.altKey === true) {
               
               Main.init(true);
               
           }
           
       });
       
       Main.init();
        
    });
    
    
})(jQuery);


