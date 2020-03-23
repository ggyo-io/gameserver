(function() {
    'use strict';

    window.Players = function(cfg) {

        var widget = {};
        widget.name = 'Players';

        var id = widget.id,
            WHITE_PLAYER_ID = "white-player",
            WHITE_NAME_ID = 'white-name',
            WHITE_CLOCK_ID = 'white-clock',
            WHITE_ELO_ID = 'white-elo',

            BLACK_PLAYER_ID = "black-player",
            BLACK_NAME_ID = 'black-name',
            BLACK_CLOCK_ID = 'black-clock',
            BLACK_ELO_ID = 'black-elo';

        var runningTimer = null,
            nextDistance = null;

        widget.active = states.playing | states.browsing;
        widget.id = function() { return id; };

        widget.events = function() {};

        widget.resize = function(o) {
            if (o === 'white') {

                $('#' + WHITE_PLAYER_ID).removeClass('top-player');
                $('#' + WHITE_PLAYER_ID).addClass('bottom-player');
                $('#' + BLACK_PLAYER_ID).removeClass('bottom-player');
                $('#' + BLACK_PLAYER_ID).addClass('top-player');
            } else {
                $('#' + WHITE_PLAYER_ID).removeClass('bottom-player');
                $('#' + WHITE_PLAYER_ID).addClass('top-player');
                $('#' + BLACK_PLAYER_ID).removeClass('top-player');
                $('#' + BLACK_PLAYER_ID).addClass('bottom-player');
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