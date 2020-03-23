(function() {
    'use strict';
    window.Game = function (cfg) {
        var widget = {};
        widget.name = 'Game';
        widget.active = states.playing | states.browsing;
        widget.id = function() { return cfg.id; };
        widget.events = function () {};

        return widget;
    };
}());
