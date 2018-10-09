package main

type BoardCell byte

// Chess board coordinates
const (
	NilBoardCell BoardCell = iota
	A1
	B1
	C1
	D1
	E1
	F1
	G1
	H1
	A2
	B2
	C2
	D2
	E2
	F2
	G2
	H2
	A3
	B3
	C3
	D3
	E3
	F3
	G3
	H3
	A4
	B4
	C4
	D4
	E4
	F4
	G4
	H4
	A5
	B5
	C5
	D5
	E5
	F5
	G5
	H5
	A6
	B6
	C6
	D6
	E6
	F6
	G6
	H6
	A7
	B7
	C7
	D7
	E7
	F7
	G7
	H7
	A8
	B8
	C8
	D8
	E8
	F8
	G8
	H8
)

type ChessPiece byte

// FEN style piece description
const (
	NilChessPiece    ChessPiece = ' '
	BlackPawn        ChessPiece = 'p'
	BlackKnight      ChessPiece = 'n'
	BlackBishop      ChessPiece = 'b'
	BlackRook        ChessPiece = 'r'
	BlackQueen       ChessPiece = 'q'
	BlackKing        ChessPiece = 'k'
	WhitePawn        ChessPiece = 'P'
	WhiteKnight      ChessPiece = 'N'
	WhiteBishop      ChessPiece = 'B'
	WhiteRook        ChessPiece = 'R'
	WhiteQueen       ChessPiece = 'Q'
	WhiteKing        ChessPiece = 'K'
)

type ChessMove struct {
	From    BoardCell
	To      BoardCell
	Promote ChessPiece
}

// PGN style game description
type ChessGame struct {
	Tags  map[string]string
    Moves []ChessMove
}
