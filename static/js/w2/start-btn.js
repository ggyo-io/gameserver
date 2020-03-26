(function() {
    'use strict';
    window.StartBtn = function (cfg) {
        var widget = {};
        widget.name = 'StartBtn';
        widget.active = states.choose_game;
        widget.id = function() { return cfg.id; };
        widget.events = function () {};

        return widget;
    };
}());
