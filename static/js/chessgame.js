// start anonymous scope
(function() {
    'use strict';

    window.ChessGame = window.ChessGame || function(chessgameId, cfg) {
        cfg = cfg || {};

        var selectOpponent = 'Select_opponent';
        var selectColor = 'Color';
        var selectTimeControl = 'Time_Control';
        var selectNewGame = [{
                name: selectOpponent,
                options: ['stockfish', 'lc0', 'human']
            },
            {
                name: selectColor,
                options: ['any', 'white', 'black']
            },
            {
                name: selectTimeControl,
                options: ['900+15', '300+5', '60+1']
            },
        ];

        var login = "login";
        var logout = "logout";
        var emailType = 'email';
        var passwordType = 'password';
        var submitType = 'submit';

        var loginForms = [{
                name: login,
                action: '/login',
                method: 'POST',
                inputs: [{
                        type: emailType
                    },
                    {
                        type: passwordType
                    },
                    {
                        type: submitType,
                        submit: 'Log In'
                    }
                ]
            },
            {
                name: logout,
                action: '/logout',
                method: 'GET',
                inputs: [{
                    type: submitType,
                    submit: 'Sign Out'
                }]
            }
        ];

        //------------------------------------------------------------------------------
        // Constants
        //------------------------------------------------------------------------------

        // use unique class names to prevent clashing with anything else on the page
        // and simplify selectors
        var CSS = {
            hotizUl: 'horiz-ul-3d5f',
            horizLi: 'horiz-li-7ba0',
            scrollable: 'scrollable-136f',
            styledSelect: 'styled-select-41bd',
            squareClass: 'square-55d63',
            blackSquare: 'black-3c85d',
            highlightWhite: 'highlight-white-7cce',
            highlightBlack: 'highlight-black-03bf',
            highlightCheck: 'highlight-check-f5f6',
            highlightPurple: 'highlight-purple-08ac',
            modal: 'modal-4d1f',
            modalContent: 'modal-content-59a5',
            closeYes: 'close-yes-71e5',
            closeNo: 'close-no-e712'
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
            browsing = false,
            browsingGame = new Chess(),
            game_started = false;

        // DOM elements
        var chessgameEl;

        // widgets
        var status = Status();
        var toolbar = ToolBar();
        var pgn = Pgn();
        var players = Players();
        var buttons = Buttons({
            'game_started': function() { return game_started; },
            'game': function() { return game; },
            'board': function() { return board; },
            'printStatus': status.printStatus,
            'outcome': outcome,
            'browsing': function(val) {
                if (arguments.length === 0) {
                    return browsing;
                } else {
                    browsing = val;
                }
            },
            'browsingGame': function(val) {
                if (arguments.length === 0) {
                    return browsingGame;
                } else {
                    browsingGame = val;
                }
            },
            'printPgn': pgn.printPgn,
            'printFen': status.printFen,
            'updateStatus': updateStatus,
            'orientation': function(val) {
                if (arguments.length === 0) {
                    return orientation;
                } else {
                    orientation = val;
                }
            },
            'onResize': resize,

            'selectNewGame': function() {

                var el1 = document.getElementById(itemByName(selectNewGame, selectOpponent).id);
                var foeParam = el1.options[el1.selectedIndex].value;
                var el2 = document.getElementById(itemByName(selectNewGame, selectColor).id);
                var colorParam = el2.options[el2.selectedIndex].value;
                var el3 = document.getElementById(itemByName(selectNewGame, selectTimeControl).id);
                var tcParam = el3.options[el3.selectedIndex].value;

                return [foeParam, colorParam, tcParam];
            },

        });
        var modal = Modal({
            'accept_undo': accept_undo,
            'outcome': outcome
        });


        // constructor return object
        var widget = {};

        //------------------------------------------------------------------------------
        // Stateful
        //------------------------------------------------------------------------------

        // Top level elements
        var
            BOARD_ID = 'board-' + createId(),

            SELECT_GAME_ID = 'select-game-' + createId(),
            LOGIN_FORM_ID = 'loginform-' + createId();

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
            if (!game_started) return;

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
            console.log("onDragStart game " + game + " browsing " + browsing);
            if (!game_started) {
                return false;
            }

            if (browsing == true ||
                game.game_over() === true ||
                notMyTurnOrPiece(piece)) {
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

        var updateView = function() {
            if (game_started) {
                $('.nogame').css('display', 'none');
                $('.game').css('display', 'inline');
            } else {
                players.stopRunningCountdown();
                $('.nogame').css('display', 'inline');
                $('.game').css('display', 'none');
            }
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
                game_started = false;
            }

            // draw?
            else if (game.in_draw() === true) {
                s = 'Game over, drawn position';
                game_started = false;
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
            if (!game_started) return;
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


            var piece = e.target.getAttribute('data-piece');

            // parent has data-square - a piece being clicked
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
            if (!game_started) return;
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
            game_started = false;
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
            myColor = msg.Color;
            if (myColor != orientation) {
                board.orientation(myColor);
                resize();
            }
            orientation = myColor;
            var whiteName, blackName;
            if (orientation === 'white') {
                whiteName = UserName;
                blackName = msg.User;
            } else {
                whiteName = msg.User;
                blackName = UserName;
            }
            status.printGameId(msg.GameID);

            players.printWhiteName(whiteName);
            players.printBlackName(blackName);
            players.printWhiteElo(msg.WhiteElo);
            players.printBlackElo(msg.BlackElo);
            players.printWhiteClock(msg.WhiteClock);
            players.printBlackClock(msg.BlackClock);

            game = new Chess();
            game_started = true;

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

        function loginFormDiv() {
            var html = '<div id="' + LOGIN_FORM_ID + '" >';

            var form = itemByName(loginForms, login);
            var name = 'Anonymous';
            if (UserName !== '') {
                form = itemByName(loginForms, logout);
                name = UserName;
            }
            html += 'Hello, <i>' + name + '</i>';

            html += '<form action="' + form.action + '" method="' + form.method + '">';

            form.inputs.forEach(function(item, index) {
                html += '<input type="' + item.type + '"';
                if (item.type !== submitType) {
                    html += ' placeholder="' + item.type + '" name="' + item.type + '"';
                } else {
                    html += ' value="' + item.submit + '"';
                }
                html += '/>';
            });
            html += '</form></div>';

            return html;
        }

        function selectGameDiv() {
            var html = '<div id="' + SELECT_GAME_ID + '" ><ul class="' + CSS.hotizUl + '">';
            selectNewGame.forEach(function(item, index) {
                item.id = item.name + '-' + createId();
                html += '<li class="' + CSS.horizLi + '" ><select id="' + item.id + '" class="nogame">';
                item.options.forEach(function(item, index) {
                    html += '<option value="' + item + '"';
                    if (index === 0) {
                        html += '  selected';
                    }
                    html += '>' + item + '</option>';
                });
                html += '</select></li>';
            });
            html += '</ul></div>';

            return html;
        }

        function boardDiv() {
            return '<div id="' + BOARD_ID + '" ></div>';
        }


        function chessGameDiv() {
            var html = boardDiv();
            //html += loginFormDiv();
            html += selectGameDiv();
            html += buttons.html();
            html += players.html();
            html += pgn.html();
            html += modal.html();
            html += status.html();
            html += toolbar.html();
            return html;
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
            return ChessBoard(id, cfg);
        };

        function initEvents() {
            window.addEventListener("resize", resize);

            players.events();
            buttons.events();
            modal.events();
            toolbar.events();
            status.events();
        }

        var cssStyle = null;

        var styleRule = function(f, h) {
            if (cssStyle !== null) {
                document.getElementsByTagName("head")[0].removeChild(cssStyle);
            }
            cssStyle = document.createElement('style');
            cssStyle.type = 'text/css';
            //var rules = document.createTextNode('.' + CSS.styledSelect + ' select {font-size: ' + f + 'px;height: ' + h + 'px;}');
            var rules = document.createTextNode('select {font-size: ' + f + 'px;height: ' + h + 'px;}');
            cssStyle.appendChild(rules);
            document.getElementsByTagName("head")[0].appendChild(cssStyle);

            return CSS.styledSelect;
        };

        function resize() {
            var φ = 1.618; // ~ golden ratio

            var margin = parseInt($('#' + chessgameId).parent().css('marginLeft'), 10) +
                parseInt($('#' + chessgameId).parent().css('marginRight'), 10);

            var w = window.innerWidth - margin;
            var h = Math.floor(w / φ);

            if (window.innerHeight - (2 * margin) < h) {
                h = window.innerHeight - (2 * margin);
                w = Math.floor(h * φ);
            }
            var fontSize = Math.floor(w / 64);
            console.log('resize() margin: ' + margin + ' window: ' + window.innerWidth + 'X' + window.innerHeight +
                ' chessgame: ' + w + 'X' + h + ' φ: ' + φ + ' w/h: ' + w / h);

            // https://stackoverflow.com/questions/12744928/in-jquery-how-can-i-set-top-left-properties-of-an-element-with-position-values
            $('#' + chessgameId).css({ position: 'relative', 'font-size': fontSize, width: w, height: h });
            $('#' + BOARD_ID).width(h); // chess board listens here ;)

            var boardBorderWidth = 0;
            var rowHeight = 0;
            if (board !== null) {
                board.resize();
                orientation = board.orientation();
                boardBorderWidth = board.borderSize();
                rowHeight = board.squareSize();
            }

            // start locating elements right of the board
            var left = $('#' + BOARD_ID).outerWidth(true) + margin;
            var itemWidth = w - left - margin;

            var quarterRowHeight = (rowHeight >> 2);
            toolbar.resize(0, left, itemWidth, quarterRowHeight);

            players.resize(boardBorderWidth, margin, itemWidth, rowHeight, left, h, orientation);

            var top = boardBorderWidth + rowHeight;

            $('#' + LOGIN_FORM_ID).css({ top: top, left: left, position: 'absolute', width: itemWidth, height: rowHeight });


            //console.log('id: ' + LOGIN_FORM_ID + 'top: ' + top + ' left: ' + left);
            top += rowHeight;
            $('#' + SELECT_GAME_ID).css({ top: top, left: left, position: 'absolute', width: itemWidth });

            // for some strange reason, select option font size could be
            // changed only by external stylesheet
            var elemHeight = Math.floor(φ * fontSize);
            //if (cssStyle != null) deleteCssRule(cssStyle);
            //cssStyle = createCssRule('.' + CSS.styledSelect + ' select {font-size: ' + fontSize + 'px;height: ' + elemHeight + 'px;}');
            styleRule(fontSize, elemHeight);

            var halfRowHeight = (rowHeight >> 1);
            var halfRowBorder = (rowHeight & 1);
            top += halfRowHeight + halfRowBorder;
            buttons.resize(top, left, itemWidth, halfRowHeight, fontSize);

            top += rowHeight;
            var pgntop = Math.floor(h / φ);

            status.resize(top, left, itemWidth, (pgntop - top - margin));
            pgn.resize(pgntop, left, itemWidth, (players.bottomClock() - pgntop - margin));
        }

        function initDom() {

            // init markup and tie events
            chessgameEl.html(chessGameDiv());
            initEvents();

            // make board + events
            board = makeBoard(BOARD_ID, 'start', 'white');
            $('#' + BOARD_ID).mousedown(mouseDownBoard);
            $('#' + BOARD_ID).mouseup(mouseUpBoard);

            status.printStatus('Choose opponent and click the Start button for a new game');
            status.printFen(board.fen());
            resize();
        }

        function connectToServer() {
            if (window.WebSocket) {
                wsConn.connect(onWebSocketMessage);
            } else {
                status.printStatus("<b>Your browser does not support WebSockets.</b>");
            }
        }

        function init() {
            if (initContainerEl() !== true) return;

            initDom();
            updateView();
            connectToServer();

            if (PGN !== '') {
                showFinishedGame(PGN);
            }
        }

        // go time
        init();

        return widget;

    }; // end of window['ChessGame']

    var chessgame = ChessGame('chessgame', {});

})(); // end anonymous wrapper