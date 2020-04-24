(function() {
    'use strict';

    window.SelectGame = function(cfg) {

        var widget = cfg;

        var id = cfg.id;
        var enter = 13;
        var buttons = [{
            id: 'start',
            onclick: startBtn,
            onkey: enter
        }];

        widget.active = states.choose_game;
        widget.id = function() { return id; };

        $("#matching-dialog").on('hide.bs.modal', () => {
            wsConn.send({
                        Cmd: "cancel"
                    });
        });

        // event, say buttons, handler initialization
        widget.events = function() {
            // jquery ui tooltips
            /*
            $(function() {
                $('#' + id).tooltip();
            });
            */

            buttons.forEach(function(item, index) {
                buttonEvent(item);
            }); // buttons forEach

        };


        // some sub components resizes go here
        widget.resize = function(top, left, width, fontSize) {
            return;
        };

        widget.selected = function() {

            var f = document.querySelector('#select-foe input:checked').value;
            var c = document.querySelector('#select-color input:checked').value;
            var t = document.querySelector('#select-tc input:checked').value;

            return [f, c, t];
        };

        widget.updateMatching = function(msg) {
            document.getElementById("players-online").innerHTML = msg.Map.PlayersPlaying || 0;
            document.getElementById("players-inqueue").innerHTML = msg.Map.PlayersInQueue || 0;
        };

        function startBtn(e) {
            if (widget.game_started()) {
                printStatus("Ignore start, Move! The game is not over yet, resign if you'd like...");
                return;
            }
            widget.printStatus("Waiting for a match...");

            var vals = widget.selected();
            var foeParam = vals[0];
            var colorParam = vals[1];
            var tcParam = vals[2];

            console.log("start with foe: " + foeParam + " color: " + colorParam + " time control: " + tcParam);
            wsConn.send({
                Cmd: "start",
                Params: foeParam,
                Color: colorParam,
                TimeControl: tcParam
            });
            const {target: {dataset: {target}}} = e;
            $(`#${target}`).modal('show');
        }


        return widget;
    }; // window.SelectGame

}());