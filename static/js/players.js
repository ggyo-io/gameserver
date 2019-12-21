(function() {
    'use strict';

    window.Players = function(cfg) {

        var widget = {};

        var id = 'players-' + createId(),
            WHITE_PLAYER_ID = 'white-player-' + createId(),
            WHITE_NAME_ID = 'white-name-' + createId(),
            WHITE_ELO_ID = 'white-elo-' + createId(),
            WHITE_CLOCK_ID = 'white-clock-' + createId(),
            BLACK_PLAYER_ID = 'black-player-' + createId(),
            BLACK_NAME_ID = 'black-name-' + createId(),
            BLACK_ELO_ID = 'black-elo-' + createId(),
            BLACK_CLOCK_ID = 'black-clock-' + createId(),
            clock = 'clock-' + createId(),
            elo = 'elo-' + createId(),
            name = 'name-' + createId(),
            sf = 'small-fonts-' + createId();

        var runningTimer = null,
            nextDistance = null;

        var styles = [
            createCssRule('#' + WHITE_PLAYER_ID + ', #' + BLACK_PLAYER_ID + ' {' +
                'display:grid;' +
                'grid-template-areas: ' +
                "'clock name' " +
                "'clock elo';" +
                'grid-auto-columns: min-content;' +
                'grid-auto-rows: min-content;' +
                'margin: auto;' +
                '}'
            ),
            createCssRule('.' + clock + '{grid-area:clock;}'),
            createCssRule('.' + name + '{grid-area:name;}'),
            createCssRule('.' + elo + '{grid-area:elo;}'),
            createCssRule('.' + sf + '{font-size:0.4em;}')
        ];

        widget.active = states.playing | states.browsing;
        widget.id = function() { return id; };

        function userDiv(id, clockId, userId, eloId) {
            var html = '<div id="' + id + '">';
            html += '<div id="' + clockId + '" class="' + clock + '">⌛&nbsp;00:00&nbsp;</div>';
            html += '<div id="' + userId + '" class="' + name + ' ' + sf + '">👓&nbsp;</div>';
            html += '<div id="' + eloId + '" class="' + elo + ' ' + sf + '">🏆&nbsp;</div>';
            html += '</div>';

            return html;
        }

        widget.html = function() {
            return '<div id="' + id + '">' +
                userDiv(WHITE_PLAYER_ID, WHITE_CLOCK_ID, WHITE_NAME_ID, WHITE_ELO_ID) +
                userDiv(BLACK_PLAYER_ID, BLACK_CLOCK_ID, BLACK_NAME_ID, BLACK_ELO_ID) +
                '</div>';
        };

        widget.events = function() {
            // jquery ui tooltips
            $(function() {
                $('#' + id).tooltip();
            });
        };

        var bottomClock;
        widget.bottomClock = function() { return bottomClock; };
        widget.resize = function(boardBorderWidth, itemWidth, rowHeight, left, h, orientation) {

            var whiteTop, blackTop;
            var quarterRowHeight = (rowHeight >> 2);
            var topClock = quarterRowHeight + boardBorderWidth;
            bottomClock = h - (h >> 3);
            if (orientation === 'white') {
                blackTop = topClock;
                whiteTop = bottomClock;
            } else {
                whiteTop = topClock;
                blackTop = bottomClock;
            }
            var clockHeight = rowHeight - quarterRowHeight - 2 * boardBorderWidth;

            $('#' + WHITE_PLAYER_ID).css({ top: whiteTop, left: left, position: 'absolute', 'font-size': (0.8 * (clockHeight)), width: itemWidth });
            $('#' + BLACK_PLAYER_ID).css({ top: blackTop, left: left, position: 'absolute', 'font-size': (0.8 * (clockHeight)), width: itemWidth });

        };

        widget.printWhiteName = function(n) {
            $('#' + WHITE_NAME_ID).html('👓&nbsp;' + n);
        };

        widget.printBlackName = function(n) {
            $('#' + BLACK_NAME_ID).html('🕶&nbsp;' + n);
        };

        function printElo(id, elo) {
            $('#' + id).html('🏆&nbsp;' + elo);
        }
        widget.printWhiteElo = function(elo) {
            printElo(WHITE_ELO_ID, elo);
        };
        widget.printBlackElo = function(elo) {
            printElo(BLACK_ELO_ID, elo);
        };

        function printClock(divId, distance) {
            /*
                var days = Math.floor(distance / (1000 * 60 * 60 * 24));
                var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            */
            if (distance >= 0) {
                var minutes = pad(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)));
                var seconds = pad(Math.floor((distance % (1000 * 60)) / 1000));
                var html = '⌛&nbsp;' + minutes + ':' + seconds + '&nbsp;';
                $('#' + divId).html(html);
            }
        }

        widget.printWhiteClock = function(distance) {
            printClock(WHITE_CLOCK_ID);
        };

        widget.printBlackClock = function(distance) {
            printClock(BLACK_CLOCK_ID);
        };

        //------------------------------------------------------------------------------
        // Countdown functions
        //------------------------------------------------------------------------------
        function pad(num) {
            var n = num.toString();
            if (n.length === 1) {
                n = '0' + n;
            }

            return n;
        }

        function startCountdown(elementId, distance) {
            var clock = elementId;
            var countDownDate = new Date().getTime() + distance;

            console.log('startCountdown  elementId: ' + elementId + ' distance: ' + distance);

            clearInterval(runningTimer);

            // Update the count down every 10 times a second
            runningTimer = setInterval(function() {

                // Get today's date and time
                var now = new Date().getTime();

                // Find the distance between now and the count down date
                distance = countDownDate - now;

                printClock(clock, distance);

                if (distance < 0) {
                    clearInterval(timer);
                    printClock(clock, 0, "EXPIRED");
                }
            }, 100);
        }

        widget.startWhiteCountdown = function(distance) {
            startCountdown(WHITE_CLOCK_ID, distance);
        };

        widget.startBlackCountdown = function(distance) {
            startCountdown(BLACK_CLOCK_ID, distance);
        };

        widget.stopRunningCountdown = function() {
            clearInterval(runningTimer);
        };

        widget.nextDistance = function(d) {
            if (arguments.length === 0) {
                return nextDistance;
            } else {
                nextDistance = d;
            }
        };

        return widget;
    }; // window.Players

}());