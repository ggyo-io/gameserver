(function() {
    'use strict';

    window.Buttons = function(cfg) {

        var widget = (cfg || {});

        var id = 'buttons-' + createId(),
            ulClass = 'horiz-ul-' + createId(),
            liClass = 'horiz-li-' + createId(),
            btnClass = 'button-' + createId();

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
                name: 'undo',
                class: 'game',
                onclick: undoBtn,
                title: 'request undo'
            },
            {
                name: 'resign',
                class: 'game',
                onclick: resignBtn,
                title: 'resign'
            },
            {
                name: 'draw',
                class: 'game',
                onclick: drawBtn,
                title: 'offer draw'
            },
            {
                name: '←',
                onclick: leftBtn,
                onkey: leftArrow,
                title: 'go back'
            },
            {
                name: '→',
                onclick: rightBtn,
                onkey: rightArrow,
                title: 'go forward'
            },
            {
                name: '↔',
                onclick: flipBtn,
                class: 'game',
                title: 'flip board'
            }
        ];


        var styles = [
            createCssRule('.' + ulClass + '{' +
                'display: grid;' +
                'grid-template-columns: repeat(' + buttons.length + ',1fr);' +
                'list-style-type: none;' +
                'padding: 0;}'),

            createCssRule('.' + btnClass + '{' +
                'background: var(--primary);' +
                'color: var(--dark);' +
                'box-shadow: var(--shadow);' +
                'display: block;' +
                'text-align: center;}'),

            createCssRule('.' + btnClass + ':hover{' +
                'background: var(--dark);' +
                'color: var(--light);}')

        ];

        widget.active = states.choose_game | states.playing | states.browsing;
        widget.id = function() { return id; };

        widget.html = function() {
            var html = '<div id="' + id + '" ><ul class="' + ulClass + '" >';
            buttons.forEach(function(item, index) {
                item.id = item.name + '-' + createId();
                html += '<li  class="' + liClass + '" >';
                html += '<a id="' + item.id + '" title="' + item.title + '" class="' + btnClass + '">' + item.name + '</a>';
                html += '</li>';
            });
            html += '</ul></div>';

            return html;
        };

        widget.resize = function(top, left, width, height) {
            $('#' + id).css({ top: top, left: left, position: 'absolute', height: height, width: width });
        };

        widget.events = function() {
            buttons.forEach(function(item, index) {
                $('#' + item.id).on('click', item.onclick);
                if (item.onkey !== undefined) {
                    var k = item.onkey;
                    $(document).keydown(function(e) {
                        switch (e.which) {
                            case k:
                                break;

                            default:
                                return; // exit this handler for other keys
                        }
                        e.preventDefault(); // prevent the default action (scroll / move caret)
                        item.onclick();
                    });
                }
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
            widget.browsingGame().move(widget.game().history()[widget.browsingGame().history().length]);
            widget.board().position(widget.browsingGame().fen());
            widget.printFen(widget.browsingGame().fen());
            widget.printPgn(widget.browsingGame().pgn());
            if (widget.browsingGame().history().length === widget.game().history().length) {
                widget.browsing(false);
                widget.browsingGame(null);
                widget.updateStatus();
            }
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
            $('#' + id).css({ top: top, left: left, position: 'absolute', width: width, height: height });
            buttons.forEach(function(item, index) {
                $('#' + item.id).css({ 'font-size': fontSize });
            });
        };

        return widget;
    }; // window.pgn

}());