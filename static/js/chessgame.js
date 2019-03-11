var board,
  last_move = ""
  browsing = false,
  game = new Chess(),
  browsingGame = new Chess(),
  statusEl = $('#status'),
  fenEl = $('#fen'),
  foeEl = $('#foe'),
  pgnEl = $('#pgn');
  colorEl = $('#color');

// do not pick up pieces if the game is over
// only pick up pieces for the side to move
var onDragStart = function(source, piece, position, orientation) {
  if (browsing == true || game.game_over() === true ||
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

var makeBoard = function(position, color) {
  var cfg = {draggable: true, 
    position: position,
    orientation: color,
    onDragStart: onDragStart,
    onDrop: onDrop,
    onSnapEnd: onSnapEnd};
  return ChessBoard('board', cfg);
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
  }

  // draw?
  else if (game.in_draw() === true) {
    status = 'Game over, drawn position';
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
};


$('#startBtn').on('click', function() {
    if (board) {
        board.start;
    }

    if (conn) {
        statusEl.html("Waiting for a match...");
        var e = document.getElementById("foeSelection"); var startParam = e.options[e.selectedIndex].value
        console.log("foe startParam: " + startParam);
        conn.send(JSON.stringify({Cmd: "start", Params: startParam}));
    } else {
        statusEl.html("No connection to server");
    }
});

$('#resignBtn').on('click', function() {
    if (conn) {
        statusEl.html("Resign");
        console.log("Resigned");
        conn.send(JSON.stringify({Cmd: "outcome", Params: "resign"}));
    } else {
        statusEl.html("No connection to server");
    }
});

$('#leftBtn').on('click', function() {
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

if (window["WebSocket"]) {    
    conn = new WebSocket("ws://" + document.location.host + "/ws");
    conn.onclose = function (evt) {
        statusEl.html("<b>Connection closed.</b>");
    };
    conn.onmessage = function (evt) {
        console.log(evt.data);
        var msg = JSON.parse(evt.data);
        if (msg.Cmd == "start") {
            foeEl.html(msg.User);
            colorEl.html('You are ' + msg.Color)
            board = makeBoard('start', msg.Color);
            updateStatus();
        } else if (msg.Cmd == "resume") {
            colorEl.html('You are ' + msg.Color);
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
        }
    };
} else {
    statusEl.html("<b>Your browser does not support WebSockets.</b>");
}
