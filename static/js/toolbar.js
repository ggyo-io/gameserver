(function() {
    'use strict';

    window.ToolBar = window.ToolBar || function(cfg) {
        var widget = {};

        var id = 'toolbar-' + createId();
        var logoutId = 'logout-' + createId();
        var formId = 'form-' + createId();

        widget.id = function() { return id; };

        widget.html = function() {
            return '<div id="' + id + '">' +
                '<img src="img/menu.svg" style="float: left;"/>' +
                '<div style="float: right;"><img src="img/register-black.svg"/>&#8239;<span>Hello, Vasya!</span>&nbsp;&nbsp;<img id="' + logoutId + '" src="img/gear.svg"/></div>' +
                '<form id="' + formId + '" action="/logout" method="GET"></form>' +
                '</div>';
        };

        widget.resize = function(top, left, width, height) {
            $('#' + id).css({ top: top, left: left, position: 'absolute', width: width, height: height, 'font-size': height });
            $('#' + id + ' img').css({ width: height, height: height });
        };

        widget.events = function() {
            $('#' + logoutId).click(function(e) {
                console.log('toolbar logout click: ' + e);
                $('#' + formId).submit();
            });
        };

        return widget;

    }; // end of 



})(); // end anonymous wrapper