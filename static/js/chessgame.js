// start anonymous scope
(function() {
    'use strict';

    window.ChessGame = window.ChessGame || function(chessgameId, cfg) {
        cfg = cfg || {};

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
                name: 'start',
                class: 'nogame',
                onclick: startBtn
            },
            {
                name: 'undo',
                class: 'game',
                onclick: undoBtn,
            },
            {
                name: 'resign',
                class: 'game',
                onclick: resignBtn
            },
            {
                name: 'draw',
                class: 'game',
                onclick: drawBtn
            },
            {
                name: '←',
                onclick: leftBtn,
                onkey: leftArrow
            },
            {
                name: '→',
                onclick: rightBtn,
                onkey: rightArrow
            },
            {
                name: '⇄',
                onclick: flipBtn
            }
        ];


        var statusName = 'Status';
        var gameIDName = 'Game_ID';
        var fenName = 'FEN';
        var statusItems = [{
                name: statusName
            },
            {
                name: gameIDName,
                class: 'game'
            },
            {
                name: fenName
            },
        ];

        var selectOpponent = 'Select opponent';
        var selectColor = 'Color';
        var selectTimeControl = 'Time Control';
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
            chessgame: 'chessgame-c70f',
            hotizUl: 'horiz-ul-3d5f',
            horizLi: 'horiz-li-7ba0',
            scrollable: 'scrollable-136f'
        };

        //------------------------------------------------------------------------------
        // Module Scope Variables
        //------------------------------------------------------------------------------
        var
            game = null,
            board = null,
            orientation = 'white',
            myColor = orientation,
            last_move = "",
            browsing = false,
            browsingGame = new Chess(),
            statusEl = null,
            fenEl = null,
            offerEl = null,
            game_started = false,
            offerParams = null,
            runningTimer = null,
            nextDistance = null,
            conn = null;

        // DOM elements
        var chessgameEl;

        // constructor return object
        var widget = {};

        //------------------------------------------------------------------------------
        // Stateful
        //------------------------------------------------------------------------------

        // Top level elements
        var
            GAME_ID = "game-" + createId(),
            BOARD_ID = 'board-' + createId(),
            WHITE_PLAYER_ID = 'white-player-' + createId(),
            WHITE_NAME_ID = 'white-name-' + createId(),
            WHITE_ELO_ID = 'white-elo-' + createId(),
            WHITE_CLOCK_ID = 'white-clock-' + createId(),
            BLACK_PLAYER_ID = 'black-player-' + createId(),
            BLACK_NAME_ID = 'black-name-' + createId(),
            BLACK_ELO_ID = 'black-elo-' + createId(),
            BLACK_CLOCK_ID = 'black-clock-' + createId(),
            SELECT_GAME_ID = 'select-game-' + createId(),
            BUTTONS_ID = 'buttons-' + createId(),
            LOGIN_FORM_ID = 'loginform-' + createId(),
            PGN_ID = 'pgn-' + createId();

        //------------------------------------------------------------------------------
        // JS Util Functions
        //------------------------------------------------------------------------------

        // http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
        function createId() {
            return 'xxxx-xxxx-xxxx-xxxx-xxxx-xxxx-xxxx-xxxx'.replace(/x/g, function(c) {
                var r = Math.random() * 16 | 0;
                return r.toString(16);
            });
        }

        //------------------------------------------------------------------------------
        // Board Handlers
        //------------------------------------------------------------------------------

        // do not pick up pieces if the game is over
        // only pick up pieces for the side to move
        var onDragStart = function(source, piece, position, orientation) {
            console.log("onDragStart game " + game + " browsing " + browsing);
            if (game == null || !game_started) {
                return false;
            }

            if (browsing == true ||
                game.game_over() === true ||
                (game.turn() === 'w' && myColor === 'black') ||
                (game.turn() === 'b' && myColor === 'white') ||
                (game.turn() === 'w' && piece.search(/^b/) !== -1) ||
                (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
                return false;
            }
        };

        var onDrop = function(source, target) {
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
        };

        // update the board position after the piece snap
        // for castling, en passant, pawn promotion
        var onSnapEnd = function() {
            board.position(game.fen());
            pushGameClock(null);

            if (conn) {
                conn.send(JSON.stringify({
                    Cmd: 'move',
                    Params: last_move
                }));
            }
        };

        var updateView = function() {
            if (game_started) {
                $('.nogame').css('display', 'none');
                $('.game').css('display', 'inline');
            } else {
                clearInterval(runningTimer);
                $('.nogame').css('display', 'inline');
                $('.game').css('display', 'none');
            }
        };

        var updateStatus = function() {
            var status = '';

            var moveColor = 'White';
            if (game.turn() === 'b') {
                moveColor = 'Black';
            }

            // checkmate?
            if (game.in_checkmate() === true) {
                status = 'Game over, ' + moveColor + ' is in checkmate.';
                game_started = false;
            }

            // draw?
            else if (game.in_draw() === true) {
                status = 'Game over, drawn position';
                game_started = false;
            }

            // game still on
            else {
                status = moveColor + ' to move';

                // check?
                if (game.in_check() === true) {
                    status += ', ' + moveColor + ' is in check';
                }
            }

            statusEl.html(status);
            fenEl.html('FEN: <small>' + game.fen() + '</small>');
            $('#' + PGN_ID).html(printPgn(game.pgn()));
            updateView();
        };

        //------------------------------------------------------------------------------
        // Button Handlers
        //------------------------------------------------------------------------------
        function startBtn() {
            if (game && game.game_over() != true) {
                statusEl.html("Ignore start, Move! The game is not over yet, resign if you'd like...");
                return;
            }

            if (board) {
                board.start();
            }

            if (conn) {
                statusEl.html("Waiting for a match...");

                var el1 = document.getElementById(itemByName(selectNewGame, selectOpponent).id);
                var foeParam = el1.options[el1.selectedIndex].value;
                var el2 = document.getElementById(itemByName(selectNewGame, selectColor).id);
                var colorParam = el2.options[el2.selectedIndex].value;
                var el3 = document.getElementById(itemByName(selectNewGame, selectTimeControl).id);
                var tcParam = el3.options[el3.selectedIndex].value;

                console.log("start with foe: " + foeParam + " color: " + colorParam + " time control: " + tcParam);
                conn.send(JSON.stringify({
                    Cmd: "start",
                    Params: foeParam,
                    Color: colorParam
                }));
            } else {
                statusEl.html("No connection to server");
            }
        }

        function undoBtn() {
            if (game == null) {
                return;
            }
            if (conn) {
                conn.send(JSON.stringify({
                    Cmd: "undo"
                }));
            }
        }

        function resignBtn() {
            if (game == null) {
                return;
            }
            if (conn) {
                statusEl.html("You have resigned, click the Start button for a new game");
                console.log("Resigned");
                conn.send(JSON.stringify({
                    Cmd: "outcome",
                    Params: "resign"
                }));
                game = null;
                game_started = false;
                clearInterval(runningTimer);
                updateView();
            } else {
                statusEl.html("No connection to server");
            }
        }

        function drawBtn() {
            if (game == null) {
                return;
            }
            statusEl.html("You have offered a draw, waiting for response");
            console.log("Draw offer");
            conn.send(JSON.stringify({
                Cmd: "offer",
                Params: "draw"
            }));
        }

        function leftBtn() {
            if (game == null) {
                return;
            }

            if (browsing === false) {
                browsing = true;
                statusEl.html("Browsing");
                browsingGame = new Chess();
                game.history().forEach(function(item, index) {
                    browsingGame.move(item);
                });
            }

            browsingGame.undo();
            board.position(browsingGame.fen());
            fenEl.html('FEN: <small>' + browsingGame.fen() + '</small>');
            $('#' + PGN_ID).html(printPgn(browsingGame.pgn()));

        }

        function rightBtn() {
            if (game == null) {
                return;
            }
            if (browsing === false) {
                return;
            }
            browsingGame.move(game.history()[browsingGame.history().length]);
            board.position(browsingGame.fen());
            fenEl.html(('FEN: <small>' + browsingGame.fen()) + '</small>');
            $('#' + PGN_ID).html(printPgn(browsingGame.pgn()));
            if (browsingGame.history().length === game.history().length) {
                browsing = false;
                browsingGame = null;
                updateStatus();
            }
        }

        function flipBtn() {
            if (orientation === 'white') {
                orientation = 'black';
            } else {
                orientation = 'white';
            }
            board.flip();
            resize();
        }

        //------------------------------------------------------------------------------
        // Websocket handler
        //------------------------------------------------------------------------------

        if (window.WebSocket) {
            updateView();
            conn = new WebSocket("ws://" + document.location.host + "/ws");
            conn.onclose = function(evt) {
                statusEl.html("<b>Connection closed.</b>");
            };
            conn.onmessage = function(evt) {
                var msg = JSON.parse(evt.data);
                console.log(msg);
                if (msg.Cmd == "start") {
                    start(msg);
                } else if (msg.Cmd == "move") {
                    move(msg);
                } else if (msg.Cmd == "outcome") {
                    outcome(msg);
                } else if (msg.Cmd == "offer") {
                    offer(msg); // make visible
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
                } else {
                    console.log("Unknown command: '" + msg.Cmd + "'");
                }
            };
        } else {
            statusEl.html("<b>Your browser does not support WebSockets.</b>");
        }

        function accept_undo(msg) {
            game.undo();
            if (msg.Params == "2") {
                game.undo();
            }
            updateStatus();
            board.position(game.fen());
            statusEl.html("Undo accepted, " + statusEl.html());
        }

        function must_login() {
            statusEl.html("<b>Please login first!</b>");
        }

        function disconnect() {
            statusEl.html("Your opponent have <b>disconnected</b>.");
        }

        function reconnected() {
            statusEl.html("Your opponent have <b>reconnected</b>.");
        }


        function offer(msg) {
            offerParams = msg.Params;
            offerEl.html(offerParams);
            modalEl.style.display = "block";
        }

        function outcome(msg) {
            statusEl.html("The outcome is: '" + msg.Params + "', click the Start button for a new game");
            console.log("opponent outcome '" + msg.Params + "'");
            game = null;
            game_started = false;
            clearInterval(runningTimer);
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
            board.position(game.fen());
        }

        function start(msg) {
            myColor = msg.Color;
            if (myColor != orientation) {
                var wp = $('#' + WHITE_PLAYER_ID).offset();
                var bp = $('#' + BLACK_PLAYER_ID).offset();
                $('#' + WHITE_PLAYER_ID).css({ top: bp.top, left: bp.left, position: 'absolute' });
                $('#' + BLACK_PLAYER_ID).css({ top: wp.top, left: wp.left, position: 'absolute' });
            }
            orientation = myColor;
            if (orientation === 'white') {
                $('#' + WHITE_NAME_ID).html(UserName);
                $('#' + BLACK_NAME_ID).html(msg.User);
            } else {
                $('#' + WHITE_NAME_ID).html(msg.User);
                $('#' + BLACK_NAME_ID).html(UserName);
            }
            $('#' + itemByName(statusItems, gameIDName).id).html('Game ID: ' + msg.GameID);
            $('#' + WHITE_ELO_ID).html('ELO: ' + msg.WhiteElo);
            $('#' + BLACK_ELO_ID).html('ELO: ' + msg.BlackElo);

            printClock(WHITE_CLOCK_ID, msg.WhiteClock, "white");
            printClock(BLACK_CLOCK_ID, msg.BlackClock, "black");

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
            statusEl.html("No match found");
        }



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

        function printClock(divId, distance, msg) {
            /*
                var days = Math.floor(distance / (1000 * 60 * 60 * 24));
                var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            */
            if (distance === 0) {
                document.getElementById(divId).innerHTML = msg;
            } else {
                var minutes = pad(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)));
                var seconds = pad(Math.floor((distance % (1000 * 60)) / 1000));
                var html = msg + ' ' + minutes + ':' + seconds;

                document.getElementById(divId).innerHTML = html;
            }
        }

        function startCountdown(elementId, distance, msg) {
            var clock = elementId;
            var countDownDate = new Date().getTime() + distance;

            var msgPrefix = msg;

            // Update the count down every 10 times a second
            var timer = setInterval(function() {

                // Get today's date and time
                var now = new Date().getTime();

                // Find the distance between now and the count down date
                distance = countDownDate - now;

                printClock(clock, distance, msgPrefix);

                if (distance < 0) {
                    clearInterval(timer);
                    printClock(clock, 0, msgPrefix + "EXPIRED");
                }
            }, 100);

            return timer;
        }

        function pushGameClock(msg) {
            if (game.game_over() === true) {
                clearInterval(runningTimer);
                return;
            }

            var toStart, toStartMessage, startDistance;

            if (game.turn() === 'w') {
                toStart = WHITE_CLOCK_ID;
                if (game.history().length < 2) {
                    toStartMessage = 'first move';
                    startDistance = 30 * 1000;
                } else {
                    toStartMessage = 'white';
                    if (msg == null) {
                        startDistance = nextDistance;
                    } else {
                        startDistance = msg.WhiteClock;
                    }
                }
                if (msg !== null) {
                    nextDistance = msg.BlackClock;
                }

            } else {
                toStart = BLACK_CLOCK_ID;
                if (game.history().length < 2) {
                    toStartMessage = 'first move';
                    startDistance = 30 * 1000;
                } else {
                    toStartMessage = 'black';
                    if (msg == null) {
                        startDistance = nextDistance;
                    } else {
                        startDistance = msg.BlackClock;
                    }
                }
                if (msg !== null) {
                    nextDistance = msg.WhiteClock;
                }

            }

            clearInterval(runningTimer);
            console.log('start timer for el ' + toStart + ' msg: ' + toStartMessage + ' distance: ' + startDistance);
            runningTimer = startCountdown(toStart, startDistance, toStartMessage);
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

        function itemByName(l, name) {
            var r = null;
            l.forEach(function(item, index) {
                if (item.name == name) {
                    r = item;
                }
            });
            return r;
        }

        function pgnDiv() {
            return '<div class="' + CSS.scrollable + '" id="' + PGN_ID + '"></div>';
        }

        function printPgn(pgn) {
            var html = '<ol>';
            var moves = pgn.split(' ');

            var liOpen = false;
            moves.forEach(function(item, index) {
                if ((index % 3) === 0) return; // ignore move number

                if (liOpen === false) {
                    html += '<li>';
                    liOpen = true;
                }
                if (((index + 1) % 3) === 0) {
                    html += '&nbsp;';
                }
                html += moves[index];
                if (((index + 1) % 3) === 0) {
                    html += '</li>';
                    liOpen = false;
                }
            });
            if (liOpen === true) {
                html += '</li>';
            }
            html += '</ol>';
            return html;
        }

        function statusDivs(l) {

            var html = '';
            l.forEach(function(item, index) {
                item.id = item.name + '-' + createId();

                html += '<div id="' + item.id + '"';
                if (item.class !== undefined) {
                    html += ' class="' + item.class + '"';
                }
                html += ' >' + item.name + '</div>';
            });


            return html;
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

        function userDiv(id, clockId, userId, eloId) {
            var html = '<div id="' + id + '" ><ul class="' + CSS.hotizUl + '" >';
            html += '<li  class="' + CSS.horizLi + '" id="' + clockId + '">clock</li>';
            html += '<li  class="' + CSS.horizLi + '" id="' + userId + '">name</li>';
            html += '<li  class="' + CSS.horizLi + '" id="' + eloId + '">ELO</li>';
            html += '</ul></div>';

            return html;
        }


        function buttonsDiv() {
            var html = '<div id="' + BUTTONS_ID + '" ><ul class="' + CSS.hotizUl + '" >';
            buttons.forEach(function(item, index) {
                item.id = item.name + '-' + createId();
                html += '<li  class="' + CSS.horizLi + '" ><input id="' + item.id + '" type="button" value="' + item.name + '"';
                if (item.class !== undefined) {
                    html += ' class="' + item.class + '"';
                }
                html += '></li>';
            });
            html += '</ul></div>';

            return html;
        }

        function boardDiv() {
            return '<div id="' + BOARD_ID + '" ></div>';
        }


        function chessGameDiv() {
            var html = '<div id="' + GAME_ID + '" class="' + CSS.chessgame + '">';
            html += boardDiv();
            html += loginFormDiv();
            html += selectGameDiv();
            html += buttonsDiv();
            html += userDiv(WHITE_PLAYER_ID, WHITE_CLOCK_ID, WHITE_NAME_ID, WHITE_ELO_ID);
            html += userDiv(BLACK_PLAYER_ID, BLACK_CLOCK_ID, BLACK_NAME_ID, BLACK_ELO_ID);

            html += pgnDiv();
            html += statusDivs(statusItems);

            html += '</div>'; // closing div CSS.chessgame

            return html;
        }

        var makeBoard = function(id, position, color) {
            var cfg = {
                draggable: true,
                position: position,
                orientation: color,
                onDragStart: onDragStart,
                onDrop: onDrop,
                onSnapEnd: onSnapEnd
            };
            return ChessBoard(id, cfg);
        };


        function initElementRefs() {
            statusEl = $('#' + itemByName(statusItems, statusName).id);
            fenEl = $('#' + itemByName(statusItems, fenName).id);
            //offerEl = itemByName('O')
        }

        function initButtonHandlers() {
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
        }

        function resize() {
            var φ = 1.618; // ~ golden ratio
            var w = window.innerWidth;
            var h = Math.floor(w / φ);
            if (window.innerHeight < h) {
                h = window.innerHeight;
                w = Math.floor(h * φ);
            }
            console.log('resize() window: ' + window.innerWidth + 'X' + window.innerHeight +
                ' chessgame: ' + w + 'X' + h + ' φ: ' + φ + ' w/h: ' + w / h);

            // https://stackoverflow.com/questions/12744928/in-jquery-how-can-i-set-top-left-properties-of-an-element-with-position-values
            $('#' + chessgameId).css({ position: 'relative' });
            $('#' + chessgameId).css({ 'font-size': (h >> 5) });
            //$('#' + chessgameId + ' *').css({ border: '4px solid red' }); //#404040'});

            $('#' + chessgameId).width(w);
            $('#' + chessgameId).height(h);

            var margin = h >> 6; // fixme
            //$('#' + chessgameId).css("margin", margin);
            $('#' + BOARD_ID).width(h); // chess board listens here ;)

            if (board !== null) {
                board.resize();
                orientation = board.orientation();
            }

            var top = margin;
            var left = $('#' + BOARD_ID).outerWidth(true) + margin;
            if (orientation === 'white') {
                $('#' + BLACK_PLAYER_ID).css({ top: top, left: left, position: 'absolute' });
            } else {
                $('#' + WHITE_PLAYER_ID).css({ top: top, left: left, position: 'absolute' });
            }
            top = h - (h >> 3);
            if (orientation === 'white') {
                $('#' + WHITE_PLAYER_ID).css({ top: top, left: left, position: 'absolute' });
            } else {
                $('#' + BLACK_PLAYER_ID).css({ top: top, left: left, position: 'absolute' });
            }
            $('#' + WHITE_PLAYER_ID + ' *').css("padding", margin);
            $('#' + BLACK_PLAYER_ID + ' *').css("padding", margin);

            top = margin + h >> 2;
            $('#' + LOGIN_FORM_ID).css({ top: top, left: left, position: 'absolute' });
            //console.log('id: ' + LOGIN_FORM_ID + 'top: ' + top + ' left: ' + left);
            top += $('#' + LOGIN_FORM_ID).outerHeight(true) + margin;
            $('#' + SELECT_GAME_ID).css({ top: top, left: left, position: 'absolute' });
            //console.log('id: ' + SELECT_GAME_ID + 'top: ' + top + ' left: ' + left);
            top += $('#' + SELECT_GAME_ID).outerHeight(true) + margin;
            $('#' + BUTTONS_ID).css({ top: top, left: left, position: 'absolute' });
            //console.log('id: ' + BUTTONS_ID + 'top: ' + top + ' left: ' + left);
            top += $('#' + BUTTONS_ID).outerHeight(true) + margin;


            var pgntop = Math.floor(h / φ);
            var statusItemHeight = Math.floor((pgntop - top - margin) / statusItems.length);

            statusItems.forEach(function(item, index) {
                $('#' + item.id).css({ top: top, left: left, position: 'absolute', height: statusItemHeight });
                //console.log('id: ' + item.id + 'top: ' + top + ' left: ' + left);
                top += statusItemHeight;
            });


            $('#' + PGN_ID).css({ top: pgntop, left: left, position: 'absolute' });
            $('#' + PGN_ID).height(h - pgntop - (h >> 3));
            $('#' + PGN_ID).width(w - h - 2 * margin);
        }

        function initDom() {

            // build game and save it in memory
            chessgameEl.html(chessGameDiv());
            initElementRefs();
            initButtonHandlers();
            statusEl.html("Choose opponent and click the Start button for a new game");

            board = makeBoard(BOARD_ID, 'start', 'white');
            resize();
            window.addEventListener("resize", resize);
        }

        function init() {
            if (initContainerEl() !== true) return;

            initDom();
            updateView();

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