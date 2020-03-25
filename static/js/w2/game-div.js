(function() {
    'use strict';
    window.GameDiv = function (cfg) {
        var widget = {};
        widget.name = 'GameDiv';
        widget.active = states.playing | states.browsing;
        widget.id = function() { return cfg.id; };
        widget.events = function () {};

        return widget;
    };
}());
