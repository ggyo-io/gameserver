(function() {
    'use strict';
    window.TheHistory = function (cfg) {
        var widget = {};
        widget.name = 'TheHistory';
        widget.active = states.choose_game;
        widget.id = function() { return cfg.id; };
        widget.events = function () {};

        return widget;
    };
}());
