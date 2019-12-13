//------------------------------------------------------------------------------
// JS Util Functions
//------------------------------------------------------------------------------

(function() {
    'use strict';
    // http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
    window.createId = function() {
        return 'xxxx-xxxx-xxxx-xxxx-xxxx-xxxx-xxxx-xxxx'.replace(/x/g, function(c) {
            var r = Math.random() * 16 | 0;
            return r.toString(16);
        });
    };

    // Addition to jQuery to get the inner text width
    $.fn.textWidth = function() {
        var text = $(this).html();
        $(this).html('<span>' + text + '</span>');
        var width = $(this).find('span:first').width();
        $(this).html(text);
        console.log('textWidth text:' + text);
        return width;
    };

    window.createCssRule = function(text) {
        var cssStyle = document.createElement('style');
        cssStyle.type = 'text/css';
        var rules = document.createTextNode(text);
        cssStyle.appendChild(rules);
        document.getElementsByTagName("head")[0].appendChild(cssStyle);
        return cssStyle;
    };

    window.deleteCssRule = function(cssStyle) {
        document.getElementsByTagName("head")[0].removeChild(cssStyle);
    };

    window.itemByName = function(l, name) {
        var r = null;
        l.forEach(function(item, index) {
            if (item.name == name) {
                r = item;
            }
        });
        return r;
    };

})(); // end anonymous wrapper