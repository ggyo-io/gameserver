(function() {
    'use strict';

    window.Buttons = function(cfg) {

        var widget = cfg;

        var id = cfg.id;

        //------------------------------------------------------------------------------
        // Keyboard keys
        //------------------------------------------------------------------------------ 
        // https://stackoverflow.com/questions/1402698/binding-arrow-keys-in-js-jquery

        var leftArrow = 37,
            rightArrow = 39;

        //------------------------------------------------------------------------------
        // Markup model
        //------------------------------------------------------------------------------ 
        var buttons = [{
                id: 'undo',
                onclick: undoBtn,
            },
            {
                id: 'resign',
                onclick: resignBtn,
            },
            {
                id: 'draw',
                onclick: drawBtn,
            },
            {
                id: '←',
                onclick: leftBtn,
                onkey: leftArrow,
            },
            {
                id: '→',
                onclick: rightBtn,
                onkey: rightArrow,
            },
            {
                id: '↔',
                onclick: flipBtn,
            }
        ];

        widget.active = states.playing | states.browsing;
        widget.id = function() { return id; };

        widget.events = function() {
            buttons.forEach(function(item, index) {
                buttonEvent(item);
            });
        };

        //------------------------------------------------------------------------------
        // Button Handlers
        //------------------------------------------------------------------------------

        function undoBtn() {
            if (!widget.game_started()) {
                return;
            }
            if (widget.game().history().length < 2) {
                widget.printStatus("Too short for undo");
                return;
            }
            wsConn.send({
                Cmd: "undo"
            });
        }


        function resignBtn() {
            if (!widget.game_started()) {
                return;
            }

            console.log("Resigned");
            wsConn.send({
                Cmd: "outcome",
                Params: "resign"
            });
            widget.outcome('You have resigned');
        }

        function drawBtn() {
            if (!widget.game_started()) {
                return;
            }
            widget.printStatus("You have offered a draw, waiting for response");
            console.log("Draw offer");
            wsConn.send({
                Cmd: "offer",
                Params: "draw"
            });
        }

        function leftBtn() {
            if (widget.game() == null) {
                return;
            }

            if (!widget.game_started() && !widget.browsing()) {
                return;
            }

            if (widget.browsing() === false) {
                widget.browsing(true);
                widget.printStatus("Browsing");
                var bg = new Chess();
                widget.game().history().forEach(function(item, index) {
                    bg.move(item);
                });
                widget.browsingGame(bg);
            }

            widget.browsingGame().undo();
            widget.board().position(widget.browsingGame().fen());
            widget.printFen(widget.browsingGame().fen());
            widget.printPgn(widget.browsingGame().pgn());
        }

        function rightBtn() {
            if (widget.game() == null) {
                return;
            }
            if (widget.browsing() === false) {
                return;
            }
            if (widget.browsingGame().history().length === widget.game().history().length) {
                widget.browsing(false);
                widget.browsingGame(null);
                widget.updateStatus();
                return;
            }
            widget.browsingGame().move(widget.game().history()[widget.browsingGame().history().length]);
            widget.board().position(widget.browsingGame().fen());
            widget.printFen(widget.browsingGame().fen());
            widget.printPgn(widget.browsingGame().pgn());
        }

        function flipBtn() {
            if (widget.orientation() === 'white') {
                widget.orientation('black');
            } else {
                widget.orientation('white');
            }
            widget.board().flip();
            widget.onResize();
        }

        widget.resize = function(top, left, width, height, fontSize) {
            return;
        };

        return widget;
    }; // window.pgn

}());