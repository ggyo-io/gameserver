(function() {
    'use strict';

    window.Players = function(cfg) {

        var widget = {};

        var id = 'players', // FIXME: no common div for players now
            WHITE_NAME_ID = 'bottom-name',
            WHITE_CLOCK_ID = 'bottom-clock',
            WHITE_ELO_ID = 'bottom-elo',

            BLACK_NAME_ID = 'top-name',
            BLACK_CLOCK_ID = 'top-clock',
            BLACK_ELO_ID = 'top-elo';

        var runningTimer = null,
            nextDistance = null;

        widget.active = states.playing | states.browsing;
        widget.id = function() { return id; };

        widget.events = function() {};

        widget.resize = function(boardBorderWidth, itemWidth, rowHeight, left, h, orientation) {
            if (orientation === 'white') {
                WHITE_NAME_ID = 'bottom-name';
                WHITE_CLOCK_ID = 'bottom-clock';
                WHITE_ELO_ID = 'bottom-elo';

                BLACK_NAME_ID = 'top-name';
                BLACK_CLOCK_ID = 'top-clock';
                BLACK_ELO_ID = 'top-elo';
            } else {
                WHITE_NAME_ID = 'top-name';
                WHITE_CLOCK_ID = 'top-clock';
                WHITE_ELO_ID = 'top-elo';

                BLACK_NAME_ID = 'bottom-name';
                BLACK_CLOCK_ID = 'bottom-clock';
                BLACK_ELO_ID = 'bottom-elo';
            }
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
            printClock(clock, distance);

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