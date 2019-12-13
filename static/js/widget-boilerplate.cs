(function() {
    'use strict';

    window.REPLACE = function(cfg) {

        var widget = {};

        var id = 'REPLACE-' + createId();

        var styles = [
            // Add some
            //createCssRule('#' + id + ' {overflow: scroll;}')
        ];

        widget.html = function() {
            return '<div id="' + id + '"></div>';
        };

        // event, say buttons, handler initialization
        widget.events = function() {
            // jquery ui tooltips
            $(function() {
                $('#' + id).tooltip();
            });
        };

 
        // some sub components resizes go here
        widget.resize = function(top, left, width, height) {
            $('#' + id).css({ top: top, left: left, position: 'absolute', height: height, width: width });
        };

        return widget;
    }; // window.REPLACE

}());
