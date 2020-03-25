(function() {
    'use strict';
    window.GameHistory = function (cfg) {
        var widget = {};
        widget.name = 'GameHistory';
        widget.active = states.choose_game;
        widget.id = function() { return cfg.id; };
        widget.events = function () {};

        return widget;
    };
}());
