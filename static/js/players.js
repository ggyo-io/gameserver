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
            BLACK_CLOCK_ID = 'black-clock-' + createId();

        var runningTimer = null,
            nextDistance = null;

        var styles = [
            //createCssRule('#' + id + ' {overflow: scroll;}')
        ];

        function userDiv(id, clockId, userId, eloId) {
            var html = '<div id="' + id + '" class="game">';
            html += '<div id="' + clockId + '">⌛&nbsp;00:00</div>';
            html += '<div id="' + userId + '">👓&nbsp;</div>';
            html += '<div id="' + eloId + '">🏆&nbsp;</div>';
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
        widget.resize = function(boardBorderWidth, margin, itemWidth, rowHeight, left, h, orientation) {
            $('#' + WHITE_PLAYER_ID).height(rowHeight);
            $('#' + BLACK_PLAYER_ID).height(rowHeight);

            var whiteTop, blackTop;
            var halfRowHeight = (rowHeight >> 1);
            var halfRowBorder = (rowHeight & 1);
            var quarterRowHeight = (rowHeight >> 2);
            var topClock = quarterRowHeight + boardBorderWidth;
            bottomClock = h - (h >> 3) - topClock;
            if (orientation === 'white') {
                blackTop = topClock;
                whiteTop = bottomClock;
            } else {
                whiteTop = topClock;
                blackTop = bottomClock;
            }

            $('#' + WHITE_CLOCK_ID).css({ top: whiteTop, left: left, position: 'absolute', 'font-size': Math.floor(0.8 * (rowHeight - 2 * boardBorderWidth)) });
            $('#' + BLACK_CLOCK_ID).css({ top: blackTop, left: left, position: 'absolute', 'font-size': Math.floor(0.8 * (rowHeight - 2 * boardBorderWidth)) });

            // have to make the user div visible to measure text width
            var clockDisplay = $('#' + WHITE_PLAYER_ID).css('display');
            $('#' + WHITE_PLAYER_ID).css('display', 'inline');
            var clockWidth = $('#' + WHITE_CLOCK_ID).textWidth();
            $('#' + WHITE_PLAYER_ID).css('display', clockDisplay);

            var userLeft = left + clockWidth + margin;

            console.log("clock width: " + clockWidth + " left: " + left + " userLeft: " + userLeft);
            $('#' + WHITE_NAME_ID).css({ top: whiteTop, left: userLeft, position: 'absolute', 'font-size': Math.floor(0.5 * (halfRowHeight - 2 * halfRowBorder)) });
            $('#' + BLACK_NAME_ID).css({ top: blackTop, left: userLeft, position: 'absolute', 'font-size': Math.floor(0.5 * (halfRowHeight - 2 * halfRowBorder)) });
            $('#' + WHITE_ELO_ID).css({ top: whiteTop + halfRowHeight + halfRowBorder, left: userLeft, position: 'absolute', 'font-size': Math.floor(0.5 * (halfRowHeight - 2 * halfRowBorder)) });
            $('#' + BLACK_ELO_ID).css({ top: blackTop + halfRowHeight + halfRowBorder, left: userLeft, position: 'absolute', 'font-size': Math.floor(0.5 * (halfRowHeight - 2 * halfRowBorder)) });
            $('#' + WHITE_PLAYER_ID).width(itemWidth);
            $('#' + BLACK_PLAYER_ID).width(itemWidth);

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
                var html = '⌛&nbsp;' + minutes + ':' + seconds;
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