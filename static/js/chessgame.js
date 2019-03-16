
// do not pick up pieces if the game is over
// only pick up pieces for the side to move
var onDragStart = function(source, piece, position, orientation) {
  console.log("onDragStart game " + game + " browsing " + browsing);
  if (game == null) { return false; }

  if ( browsing == true ||
       game.game_over() === true ||
      (game.turn() === 'w' && board.orientation().search(/^b/) !== -1) ||
      (game.turn() === 'b' && board.orientation().search(/^w/) !== -1) ||
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
  last_move = source + target
  console.log("my mr begin from: " + source + " to: " + target + " lastmove: " + last_move);
  console.log(move);
  console.log("my mr end");
  console.log("game fen: " + game.fen())
 
  updateStatus();
};

// update the board position after the piece snap
// for castling, en passant, pawn promotion
var onSnapEnd = function() {
  board.position(game.fen());
  if (conn) {
    conn.send(JSON.stringify({Cmd:'move', Params: last_move}));
  }
};

var updateView = function() {
    if (game_started) {
        $('.nogame').css('display', 'none');
        $('.game').css('display', 'inline');
    } else {
        $('.nogame').css('display', 'inline');
        $('.game').css('display', 'none');
    }
}

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
  fenEl.html(game.fen());
  pgnEl.html(game.pgn());
  updateView();
};

var makeBoard = function(position, color) {
  var cfg = {draggable: true,
    position: position,
    orientation: color,
    onDragStart: onDragStart,
    onDrop: onDrop,
    onSnapEnd: onSnapEnd};
  return ChessBoard('board', cfg);
}

var
  game  = null,
  board = makeBoard('start', 'white'),
  last_move = ""
  browsing = false,
  browsingGame = new Chess(),
  statusEl = $('#status'),
  gameIDEl = $('#gameid'),
  fenEl = $('#fen'),
  foeEl = $('#foe'),
  pgnEl = $('#pgn'),
  colorEl = $('#color'),
  offerEl = $('#offer'),
  game_started = false;

var offerParams = null;
var modalEl = document.getElementById('modalDiv');
statusEl.html("Choose opponent and click the Start button for a new game");

$('#startBtn').on('click', function() {
    if (game && game.game_over() != true) {
        statusEl.html("Ignore start, Move! The game is not over yet, resign if you'd like...");
        return;
    }

    if (board) {
        board.start;
    }

    if (conn) {
        statusEl.html("Waiting for a match...");
        var el1 = document.getElementById("foeSelection");   var foeParam   = el1.options[el1.selectedIndex].value
        var el2 = document.getElementById("colorSelection"); var colorParam = el2.options[el2.selectedIndex].value
        console.log("start with foe : " + foeParam + " color " + colorParam);
        conn.send(JSON.stringify({Cmd: "start", Params: foeParam, Color: colorParam}));
    } else {
        statusEl.html("No connection to server");
    }
});

$('#resignBtn').on('click', function() {
    if (game == null) { return; }
    if (conn) {
        statusEl.html("You have resigned, click the Start button for a new game");
        console.log("Resigned");
        conn.send(JSON.stringify({Cmd: "outcome", Params: "resign"}));
        game = null;
        game_started = false;
        updateView();
    } else {
        statusEl.html("No connection to server");
    }
});

$('#drawBtn').on('click', function() {
    if (game == null) { return; }
    statusEl.html("You have offered a draw, waiting for response");
    console.log("Draw offer");
    conn.send(JSON.stringify({Cmd: "offer", Params: "draw"}));
});

$('#leftBtn').on('click', function() {
   if (game == null) { return; }

   if (browsing === false) {
     browsing = true;
     statusEl.html("Browsing");
     browsingGame = new Chess();
     game.history().forEach(function (item, index){ browsingGame.move(item); });
   }

   browsingGame.undo();
   board.position(browsingGame.fen());
   fenEl.html(browsingGame.fen());
   pgnEl.html(browsingGame.pgn());

});

$('#rightBtn').on('click', function() {
   if (game == null) { return; }
   if (browsing === false) { return; }
   browsingGame.move(game.history()[browsingGame.history().length]);
   board.position(browsingGame.fen());
   fenEl.html(browsingGame.fen());
   pgnEl.html(browsingGame.pgn());
   if (browsingGame.history().length === game.history().length) {
     browsing = false;
     browsingGame = null;
     updateStatus();
   }
});

$('#offerYes').on('click', function() {
   console.log("Offer accepted: " + offerParams);
   conn.send(JSON.stringify({Cmd: "outcome", Params: offerParams}));
   statusEl.html("You have accepted '" + offerParams + "', click the Start button for a new game");
   game = null;

   modalEl.style.display = "none"; // make invisible
});

$('#offerNo').on('click', function() {
   modalEl.style.display = "none"; // make invisible
});

if (window["WebSocket"]) { 
    updateView();   
    conn = new WebSocket("ws://" + document.location.host + "/ws");
    conn.onclose = function (evt) {
        statusEl.html("<b>Connection closed.</b>");
    };
    conn.onmessage = function (evt) {
        console.log(evt.data);
        var msg = JSON.parse(evt.data);
        if (msg.Cmd == "start") {
            foeEl.html(msg.User);
            gameIDEl.html(msg.Params);
            colorEl.html('You are ' + msg.Color)
            board = makeBoard('start', msg.Color);
            game  = new Chess();
            game_started = true;
            updateStatus();
        } else if (msg.Cmd == "resume") {
            colorEl.html('You are ' + msg.Color);
            game  = new Chess();
            console.log("on resume game load_pgn: " + game.load_pgn(msg.Params, {sloppy: true}));
            var fen = game.fen();
            console.log("fen is: " + fen);
            board = makeBoard(fen, msg.Color);
            updateStatus();
        } else if (msg.Cmd == "move") {
            var from_sq = msg.Params[0] + msg.Params[1];
            var to_sq   = msg.Params[2] + msg.Params[3];
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
            console.log("computa mr begin from: " + from_sq + " to: " + to_sq + " promo: " + promotePiece);
            console.log(mr);
            console.log("computa mr end");
            console.log("game fen: " + game.fen())
            updateStatus();
            board.position(game.fen());
        } else if (msg.Cmd == "outcome") {
            statusEl.html("Your opponent have accepted: '" + msg.Params + "', click the Start button for a new game");
            console.log("opponent outcome '" + msg.Params + "'");
            game = null;
            game_started = false;
            updateView();
        } else if (msg.Cmd == "offer") {
            offerParams = msg.Params;
            offerEl.html(offerParams);
            modalEl.style.display = "block"; // make visible
        } else if (msg.Cmd == "disconnect") {
            statusEl.html("Your opponent have disconnected.");
        } else if (msg.Cmd == "must_login") {
            statusEl.html("<b>Please login first!</b>");
        } else if (msg.Cmd == "login") {
            if (msg.User == "") {
                $('#userHeader').css('display', 'none');
                $('#loginHeader').css('display', 'inline');
            } else {
                $('#loginHeader').css('display', 'none');
                $('#username').html(msg.User);
                $('#userHeader').css('display', 'inline');
            }
        } else {
            console.log("Unknown command: '" + msg.Cmd + "'");
        }
    };
} else {
    statusEl.html("<b>Your browser does not support WebSockets.</b>");
}
