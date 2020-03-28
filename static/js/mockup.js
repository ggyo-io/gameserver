// start anonymous scope
(function() {
    'use strict';

    window.ChessGame = window.ChessGame || function(chessgameId, cfg) {
        cfg = cfg || {};

        //------------------------------------------------------------------------------
        // Constants
        //------------------------------------------------------------------------------

        // use unique class names to prevent clashing with anything else on the page
        // and simplify selectors
        var CSS = {
            squareClass: 'square-55d63',
            blackSquare: 'black-3c85d',
            highlightWhite: 'highlight-white-7cce',
            highlightBlack: 'highlight-black-03bf',
            highlightCheck: 'highlight-check-f5f6',
            highlightPurple: 'highlight-purple-08ac'
        };

        //------------------------------------------------------------------------------
        // Module Scope Variables
        //------------------------------------------------------------------------------
        var
            game = new Chess(),
            board = null,
            orientation = 'white',
            myColor = orientation,
            last_move = "",
            browsingGame = new Chess();

        // DOM elements
        var chessgameEl;

        // widgets
        var status = Status();
        var selectGame = SelectGame({
            id: 'select-game',
            game_started: function() { return (state == states.playing); },
            game: function() { return game; },
            board: function() { return board; },
            printStatus: status.printStatus
        });
        var pgn = Pgn({
            id: 'pgn'
        });

        var history = GameHistory({
            id: 'history'
        });

        var players = Players();
        var buttons = Buttons({
            id: 'buttons',
            game_started: function() { return (state == states.playing); },
            game: function() { return game; },
            board: function() { return board; },
            printStatus: status.printStatus,
            outcome: outcome,
            browsing: function(val) {
                if (arguments.length === 0) {
                    return state == states.browsing;
                } else {
                    if (val) { startBrowsing(); } else { stopBrowsing(); }
                }
            },
            browsingGame: function(val) {
                if (arguments.length === 0) {
                    return browsingGame;
                } else {
                    browsingGame = val;
                }
            },
            printPgn: pgn.printPgn,
            printFen: status.printFen,
            updateStatus: updateStatus,
            orientation: function(val) {
                if (arguments.length === 0) {
                    return orientation;
                } else {
                    orientation = val;
                }
            },
            onResize: resize,
        });
        // var signin = SignIn();

        var gameDiv = GameDiv({ id: 'game' });
        var startBtn = StartBtn({ id: 'start' });
        var widgets = [
            status,
            selectGame,
            pgn,
            players,
            buttons,
            history,
            gameDiv,
            startBtn,
            // signin
        ];

        // constructor return object
        var widget = {};

        //------------------------------------------------------------------------------
        // Stateful
        //------------------------------------------------------------------------------

        // Top level elements
        var
            BOARD_ID = 'board';

        //------------------------------------------------------------------------------
        // Board Handlers
        //------------------------------------------------------------------------------

        var whiteSquareGrey = '#a9a9a9';
        var blackSquareGrey = '#696969';
        var squareToHighlight = null;

        function highlightByColor(c) {
            if (c === 'white') {
                return CSS.highlightWhite;
            } else {
                return CSS.highlightBlack;
            }
        }

        function foeColor() {
            var c = 'white';
            if (myColor === 'white') {
                c = 'black';
            }

            return c;
        }

        function onMoveEnd() {
            $('#' + BOARD_ID).find('.square-' + squareToHighlight)
                .addClass(highlightByColor(foeColor()));
        }

        function removeHighlights(color) {
            $('#' + BOARD_ID).find('.' + CSS.squareClass)
                .removeClass(highlightByColor(color));
        }


        function removeGreySquares() {
            $('#' + BOARD_ID + ' .' + CSS.squareClass).css('background', '');
        }

        function greySquare(square) {
            var $square = $('#' + BOARD_ID + ' .square-' + square);

            var background = whiteSquareGrey;
            if ($square.hasClass(CSS.blackSquare)) {
                background = blackSquareGrey;
            }

            $square.css('background', background);
        }

        function onMouseoverSquare(square, piece) {
            if (state != states.playing) return;

            // get list of possible moves for this square
            var moves = game.moves({
                square: square,
                verbose: true
            });

            // exit if there are no moves available for this square
            if (moves.length === 0) return;

            // highlight the square they moused over
            greySquare(square);

            // highlight the possible squares for this piece
            for (var i = 0; i < moves.length; i++) {
                greySquare(moves[i].to);
            }
        }

        function onMouseoutSquare(square, piece) {
            removeGreySquares();
        }

        function notMyTurn() {
            return (game.turn() === 'w' && myColor === 'black') ||
                (game.turn() === 'b' && myColor === 'white');
        }

        function notTurnPiece(piece) {
            return (game.turn() === 'w' && piece.search(/^b/) !== -1) ||
                (game.turn() === 'b' && piece.search(/^w/) !== -1);
        }

        // do not pick up pieces if the game is over
        // only pick up pieces for the side to move
        function notMyTurnOrPiece(piece) {
            return notMyTurn() ||
                notTurnPiece(piece);
        }

        var onDragStart = function(source, piece, position, orientation) {
            console.log("onDragStart state " + state);
            if (state != states.playing) {
                return false;
            }

            if (notMyTurnOrPiece(piece)) {
                return false;
            }
        };

        var onDrop = function(source, target) {
            removeGreySquares();

            // see if the move is legal
            var move = game.move({
                from: source,
                to: target,
                promotion: 'q' // NOTE: always promote to a queen for example simplicity
            });

            // illegal move
            if (move === null) return 'snapback';
            if ('promotion' in move) {
                target += move.promotion;
            }
            last_move = source + target;
            console.log("my mr begin from: " + source + " to: " + target + " lastmove: " + last_move);
            console.log(move);
            console.log("my mr end");
            console.log("game fen: " + game.fen());

            updateStatus();

            // highlight  move
            removeHighlights(myColor);
            $('#' + BOARD_ID).find('.square-' + source).addClass(highlightByColor(myColor));
            $('#' + BOARD_ID).find('.square-' + target).addClass(highlightByColor(myColor));
        };

        // update the board position after the piece snap
        // for castling, en passant, pawn promotion
        var onSnapEnd = function() {
            board.position(game.fen());
            pushGameClock(null);

            wsConn.send({
                Cmd: 'move',
                Params: last_move
            });
        };

        function removeHighlightCheck() {
            $('#' + BOARD_ID).find('.' + CSS.squareClass)
                .removeClass(CSS.highlightCheck);
        }

        function highlightCheck() {
            var p = board.position();
            var piece = game.turn() + 'K';

            for (var c in p) {
                if (p[c] === piece) {
                    $('#' + BOARD_ID).find('.square-' + c).addClass(CSS.highlightCheck);
                    return;
                }
            }
        }

        function updateStatus() {
            var s = '';

            var moveColor = 'White';
            if (game.turn() === 'b') {
                moveColor = 'Black';
            }

            // checkmate?
            if (game.in_checkmate() === true) {
                s = 'Game over, ' + moveColor + ' is in checkmate.';
                state = states.browsing;
            }

            // draw?
            else if (game.in_draw() === true) {
                s = 'Game over, drawn position';
                state = states.browsing;
            }

            // game still on
            else {
                s = moveColor + ' to move';
                removeHighlightCheck();

                // check?
                if (game.in_check() === true) {
                    s += ', ' + moveColor + ' is in check';
                    highlightCheck();
                }
            }

            status.printStatus(s);
            status.printFen(game.fen());
            pgn.printPgn(game.pgn());
            updateView();
        }

        var clickMoveFrom = null;
        var clickMoveTo = null;

        function getSquareFromEvent(e) {
            if (e.target.hasAttribute('data-square')) {
                return e.target.getAttribute('data-square');
            } else if (e.target.parentElement.hasAttribute('data-square')) {
                return e.target.parentElement.getAttribute('data-square');
            }
            return null;
        }

        function mouseDownBoard(e) {
            if (state != states.playing) return;
            if (notMyTurn()) return;

            var square = getSquareFromEvent(e);
            if (square === null) return;

            console.log(' mouseDownBoard: ' + square);
            if (clickMoveFrom === null) {
                // move source should contain a piece
                if (e.target.parentElement.hasAttribute('data-square') === false ||
                    notTurnPiece(e.target.getAttribute('data-piece'))) return;

                clickMoveFrom = square;
                $('#' + BOARD_ID).find('.square-' + square)
                    .addClass(CSS.highlightPurple);
                return;

            }

            // parent has data-square - a piece being clicked
            var piece = e.target.getAttribute('data-piece');
            if (e.target.parentElement.hasAttribute('data-square') &&
                !notMyTurnOrPiece(piece)) {
                $('#' + BOARD_ID).find('.square-' + clickMoveFrom)
                    .removeClass(CSS.highlightPurple);
                clickMoveFrom = square;
                $('#' + BOARD_ID).find('.square-' + square)
                    .addClass(CSS.highlightPurple);
                return;
            }

            clickMoveTo = square;
        }

        function mouseUpBoard(e) {
            if (state != states.playing) return;
            if (notMyTurn()) return;
            var square = getSquareFromEvent(e);
            if (square === null) return;

            console.log(' mouseUpBoard: ' + square);

            if (clickMoveTo !== null) {
                if (clickMoveTo === square) {
                    console.log(' click: drop from: ' + clickMoveFrom + ' to: ' + square);
                    if (onDrop(clickMoveFrom, square) !== 'snapback') {
                        onSnapEnd();
                        $('#' + BOARD_ID).find('.square-' + clickMoveFrom)
                            .removeClass(CSS.highlightPurple);
                        clickMoveFrom = null;
                        clickMoveTo = null;
                    }
                } else { clickMoveTo = null; }
            }
            if (clickMoveFrom !== null && clickMoveFrom !== square) {
                $('#' + BOARD_ID).find('.square-' + clickMoveFrom)
                    .removeClass(CSS.highlightPurple);
                clickMoveFrom = null;
            }

        }

        var onWebSocketMessage = function(evt) {
            var msg = JSON.parse(evt.data);
            console.log('onWebSocketMessage: evt.data: ' + evt.data + ' msg: ' + msg);
            if (msg.Cmd == "start") {
                start(msg);
            } else if (msg.Cmd == "move") {
                move(msg);
            } else if (msg.Cmd == "outcome") {
                outcome(msg.Params);
            } else if (msg.Cmd == "offer") {
                modal.offer(msg.Params); // make visible
            } else if (msg.Cmd == "disconnect") {
                disconnect();
            } else if (msg.Cmd == "reconnected") {
                reconnected();
            } else if (msg.Cmd == "must_login") {
                must_login();
            } else if (msg.Cmd == "nomatch") {
                nomatch();
            } else if (msg.Cmd == "accept_undo") {
                accept_undo(msg);
            } else if (msg.Cmd == "undo") {
                modal.offer(msg.Cmd);
            } else if (msg.Cmd == "queues_status") {
                selectGame.updateMatching(msg);
            } else {
                console.log("Unknown command: '" + msg.Cmd + "'");
            }
        };

        function accept_undo(msg) {
            game.undo();
            if (msg.Params === '2') {
                game.undo();
            }
            updateStatus();
            board.position(game.fen());
            status.printStatus("Undo accepted, " + status.htmlStatus());
        }

        function must_login() {
            status.printStatus("<b>Please login first!</b>");
        }

        function disconnect() {
            status.printStatus("Your opponent have <b>disconnected</b>.");
        }

        function reconnected() {
            status.printStatus("Your opponent have <b>reconnected</b>.");
        }

        function outcome(msg) {
            status.printStatus("The outcome is: '" + msg + "', click the Start button for a new game");
            console.log("opponent outcome '" + msg + "'");
            state = states.choose_game;
            players.stopRunningCountdown();
            updateView();
        }

        function move(msg) {
            var from_sq = msg.Params[0] + msg.Params[1];
            var to_sq = msg.Params[2] + msg.Params[3];
            var promotePiece = "q";
            if (msg.Params.length > 4) {
                if (msg.Params[4] == "=")
                    promotePiece = msg.Params[5];
                else
                    promotePiece = msg.Params[4];
            }
            var mr = game.move({
                from: from_sq,
                to: to_sq,
                promotion: promotePiece
            });

            pushGameClock(msg);

            console.log("computa mr begin from: " + from_sq + " to: " + to_sq + " promo: " + promotePiece);
            console.log(mr);
            console.log("computa mr end");
            console.log("game fen: " + game.fen());
            updateStatus();

            // highlight foe's move
            removeHighlights(foeColor());
            $('#' + BOARD_ID).find('.square-' + mr.from).addClass(highlightByColor(foeColor()));
            squareToHighlight = mr.to;
            board.position(game.fen());
        }

        function start(msg) {
            toggleModal("matching-dialog");
            myColor = msg.Color;
            if (myColor != orientation) {
                board.orientation(myColor);
                resize();
            }
            orientation = myColor;
            var whiteName, blackName;
            if (orientation === 'white') {
                whiteName = UserName || 'Anonymous';
                blackName = msg.User || 'Anonymous';
            } else {
                whiteName = msg.User || 'Anonymous';
                blackName = UserName || 'Anonymous';
            }
            status.printGameId(msg.GameID);

            players.printWhiteName(whiteName);
            players.printBlackName(blackName);
            players.printWhiteElo(msg.WhiteElo);
            players.printBlackElo(msg.BlackElo);
            players.printWhiteClock(msg.WhiteClock);
            players.printBlackClock(msg.BlackClock);

            game = new Chess();
            state = states.playing;

            var fen = 'start';
            if (msg.Params !== undefined) {
                console.log("on resume game load_pgn: " + game.load_pgn(msg.Params, {
                    sloppy: true
                }));
                fen = game.fen();
                console.log("fen is: " + fen);
            }

            board = makeBoard(BOARD_ID, fen, orientation);

            updateStatus();
            pushGameClock(msg);
        }


        function showFinishedGame(pgn) {
            game = new Chess();
            console.log("load history game load_pgn: " + game.load_pgn(pgn, {
                sloppy: true
            }));
            var fen = game.fen();
            console.log("fen is: " + fen);
            board = makeBoard(BOARD_ID, fen, orientation);
            updateStatus();
        }

        function nomatch() {
            status.printStatus("No match found");
        }

        function pushGameClock(msg) {
            if (game.game_over() === true) {
                players.stopRunningCountdown();
                return;
            }

            var startCountdown, toStartMessage = '',
                startDistance;

            if (game.turn() === 'w') {
                startCountdown = players.startWhiteCountdown;
                if (game.history().length < 2) {
                    toStartMessage = 'White first move';
                    startDistance = 30 * 1000;
                } else {
                    if (msg == null) {
                        startDistance = players.nextDistance();
                    } else {
                        startDistance = msg.WhiteClock;
                    }
                }
                if (msg !== null) {
                    players.nextDistance(msg.BlackClock);
                }

            } else {
                startCountdown = players.startBlackCountdown;
                if (game.history().length < 2) {
                    toStartMessage = 'Black first move';
                    startDistance = 30 * 1000;
                } else {
                    if (msg == null) {
                        startDistance = players.nextDistance();
                    } else {
                        startDistance = msg.BlackClock;
                    }
                }
                if (msg !== null) {
                    players.nextDistance(msg.WhiteClock);
                }

            }

            startCountdown(startDistance);
            if (toStartMessage !== '') status.printStatus(toStartMessage);
        }

        var oldState;

        function startBrowsing() {
            oldState = state;
            state = states.browsing;
        }

        function stopBrowsing() {
            state = oldState;
        }

        //------------------------------------------------------------------------------
        // Markup/Init functions
        //------------------------------------------------------------------------------

        function initContainerEl() {

            // make sure the container element exists in the DOM
            var el = document.getElementById(chessgameId);
            if (!el) {
                window.alert('ChessGame Error 1001: Element with id "' +
                    chessgameId + '" does not exist in the DOM.' +
                    '\n\nExiting...');
                return false;
            }

            // set the containerEl
            chessgameEl = $(el);

            return true;
        }


        var makeBoard = function(id, position, color) {
            var cfg = {
                draggable: true,
                position: position,
                orientation: color,
                onDragStart: onDragStart,
                onMouseoutSquare: onMouseoutSquare,
                onMouseoverSquare: onMouseoverSquare,
                onDrop: onDrop,
                onMoveEnd: onMoveEnd,
                onSnapEnd: onSnapEnd
            };
            // return {};
            return ChessBoard(id, cfg);
        };

        function initEvents() {
            window.addEventListener("resize", resize);
            widgets.forEach(function(item, index) {
                console.log(index + '. init events widget name: ' + item.name);
                console.log(index + '. init events widget id: ' + item.id());
                if (typeof item.events === "function") {
                    item.events();
                }
            });
        }

        function resize() {
            var w = window.innerWidth;
            var h = window.innerHeight;
            //
            // // set REM size
            // var fontSize = Math.floor((w * h) / (64 * 64 * 16));
            // document.querySelector('html').style.fontSize = fontSize + 'px';
            //
            // Vertical Layout
            var gameGrid = '"top-player" "board" "bottom-player" "pgn"';
            document.querySelector('#board').style.width = w + 'px';
            if (w > 600) {
                // Horizontal Layout
                gameGrid = '"board top-player" "board pgn" "board bottom-player"';
                document.querySelector('#board').style.width = 0.7 * h + 'px';
            }
            document.querySelector('#game').style.gridTemplateAreas = gameGrid;
            board.resize();
            players.resize(board.orientation());
            orientation = board.orientation();

            var bel = document.querySelector('#board');
            var bs = window.getComputedStyle(bel);

            var bmh = bs.height;
            var bmw = bs.width;

            console.log('resize() window: ' + window.innerWidth + 'X' + window.innerHeight +
                ' board:' + bmw + 'X' + bmh);

        }

        function initDom() {

            // init markup and tie events
            //chessgameEl.html(chessGameDiv());
            initEvents();

            // make board + events
            board = makeBoard(BOARD_ID, 'start', 'white');
            $('#' + BOARD_ID).mousedown(mouseDownBoard);
            $('#' + BOARD_ID).mouseup(mouseUpBoard);

            status.printStatus('Choose opponent and click the Start button for a new game');
            //status.printFen(board.fen());

            resize();
        }

        var updateView = function() {
            widgets.forEach(function(item, index) {
                if (item.active === undefined) return;
                if (item.active & state) $('#' + item.id()).show();
                else $('#' + item.id()).hide();
            });
        };

        function connectToServer() {
            if (window.WebSocket) {
                wsConn.connect(onWebSocketMessage);
            } else {
                status.printStatus("<b>Your browser does not support WebSockets.</b>");
            }
        }

        var state = states.signin; // initial
        function initState() {
            state = states.choose_game;
            if (PGN !== '') {
                state = states.browsing;
                showFinishedGame(PGN);
            }
        }

        function init() {
            if (initContainerEl() !== true) return;

            initState();
            initDom();
            updateView();
            connectToServer();
        }

        // go time
        init();

        return widget;

    }; // end of window['ChessGame']

    var chessgame = ChessGame('game', {});

})(); // end anonymous wrapper