(function() {
    'use strict';

    window.Pgn = function(cfg) {

        var widget = {};

        var id = 'pgn-' + createId();

        var styles = [
            createCssRule('#' + id + ' {overflow: scroll;}')
        ];

        widget.html = function() {
            return '<div id="' + id + '"></div>';
        };

        widget.printPgn = function(pgn) {
            var html = '<ol>';
            var moves = pgn.split(' ');

            var liOpen = false;
            moves.forEach(function(item, index) {
                if ((index % 3) === 0) return; // ignore move number

                if (liOpen === false) {
                    html += '<li>';
                    liOpen = true;
                }
                if (((index + 1) % 3) === 0) {
                    html += '&nbsp;';
                }
                html += moves[index];
                if (((index + 1) % 3) === 0) {
                    html += '</li>';
                    liOpen = false;
                }
            });
            if (liOpen === true) {
                html += '</li>';
            }
            html += '</ol>';

            $('#' + id).html(html);
        };

        widget.resize = function(top, left, width, height) {
            $('#' + id).css({ top: top, left: left, position: 'absolute', height: height, width: width });
        };

        return widget;
    }; // window.pgn

}());