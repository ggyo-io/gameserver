(function() {
    'use strict';

    window.Pgn = function(cfg) {

        var widget = {};
        widget.name = 'Pgn';
        widget.active = states.playing | states.browsing;
        widget.id = function() { return cfg.id; };


        // event, say buttons, handler initialization
        widget.events = function() {
            // jquery ui tooltips
            /*
            $(function() {
                $('#' + id).tooltip();
            });
            */
        };

        widget.printPgn = function(pgn) {
            var moves = pgn.split(' ');
            var index = 12; // there are 12 divs in the mark up
            while (index > moves.length || index % 3 != moves.length % 3) {
                document.querySelector('#pgn div:nth-of-type(' + index + ')').innerHTML = '00000';
                document.querySelector('#pgn div:nth-of-type(' + index + ')').style.opacity = 0;
                index--;
            }

            moves.slice().reverse().forEach(function(e, i) {
                if (index === 0) return;
                document.querySelector('#pgn div:nth-of-type(' + index + ')').innerHTML = e;
                document.querySelector('#pgn div:nth-of-type(' + index + ')').style.opacity = 1;
                index--;
            });
        };

        widget.resize = function(top, left, width, height) {
            return;
        };

        return widget;
    }; // window.pgn

}());