(function() {
    'use strict';

    window.Players = function(cfg) {

        var widget = {};
        widget.name = 'Players';

        var id = widget.id,
            TOP_PLAYER_ID = "top-player",
            TOP_NAME_ID = 'top-name',
            TOP_CLOCK_ID = 'top-clock',
            TOP_ELO_ID = 'top-elo',

            BOTTOM_PLAYER_ID = "bottom-player",
            BOTTOM_NAME_ID = 'bottom-name',
            BOTTOM_CLOCK_ID = 'bottom-clock',
            BOTTOM_ELO_ID = 'bottom-elo';

        var runningTimer = null,
            nextDistance = null;

        widget.active = states.playing | states.browsing;
        widget.id = function() { return id; };

        widget.events = function() {};

        widget.resize = function(o) {
            if (o === 'white') {
                $('#' + TOP_PLAYER_ID).removeClass('top-player');
                $('#' + TOP_PLAYER_ID).addClass('bottom-player');
                $('#' + BOTTOM_PLAYER_ID).removeClass('bottom-player');
                $('#' + BOTTOM_PLAYER_ID).addClass('top-player');
            } else {
                $('#' + TOP_PLAYER_ID).removeClass('bottom-player');
                $('#' + TOP_PLAYER_ID).addClass('top-player');
                $('#' + BOTTOM_PLAYER_ID).removeClass('top-player');
                $('#' + BOTTOM_PLAYER_ID).addClass('bottom-player');
            }
        };

        widget.printWhiteName = function(n) {
            $('#' + TOP_NAME_ID).html('👓&nbsp;' + n);
        };

        widget.printBlackName = function(n) {
            $('#' + BOTTOM_NAME_ID).html('🕶&nbsp;' + n);
        };

        function printElo(id, elo) {
            $('#' + id).html('🏆&nbsp;' + elo);
        }
        widget.printWhiteElo = function(elo) {
            printElo(TOP_ELO_ID, elo);
        };
        widget.printBlackElo = function(elo) {
            printElo(BOTTOM_ELO_ID, elo);
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
            printClock(TOP_CLOCK_ID);
        };

        widget.printBlackClock = function(distance) {
            printClock(BOTTOM_CLOCK_ID);
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
            startCountdown(TOP_CLOCK_ID, distance);
        };

        widget.startBlackCountdown = function(distance) {
            startCountdown(BOTTOM_CLOCK_ID, distance);
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