(function() {
    'use strict';

    window.Pgn = function(cfg) {

        var widget = {};

        var id = cfg.id;

        widget.active = states.playing | states.browsing;
        widget.id = function() { return id; };


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
            var html = '<ol>';
            var moves = pgn.split(' ');
            var index = 12; // there are 12 divs in the mark up
            while (index > moves.length) {
                document.querySelector('#pgn div:nth-of-type(' + index + ')').innerHTML = '   ';
                index--;
            }

            moves.slice().reverse().forEach(function(e, i) {
                if (index === 0) return;
                if (i % 3 !== 0 && index % 3 === 0) {
                    document.querySelector('#pgn div:nth-of-type(' + index + ')').innerHTML = '   ';
                    index--;
                }

                document.querySelector('#pgn div:nth-of-type(' + index + ')').innerHTML = e;
                index--;
            });
        };

        widget.resize = function(top, left, width, height) {
            return;
        };

        return widget;
    }; // window.pgn

}());