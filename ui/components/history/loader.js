import React from "react";
import {chess} from "../../utils/chessref";


export const serverFetchHistory = (url, setGame) => {
    const sg = setGame
    fetch(url)
        .then(res => res.json())
        .then(
            (result) => {
                const games = result.History.map(value => {
                    console.log(JSON.stringify(value))
                    const pgn_header = chess.load_header(value.PGN)
                    const date = new Date(value.Time * 1000).toDateString()
                    return {
                        pgn: value.PGN,
                        Date: pgn_header.Date ? pgn_header.Date : date,
                        White: pgn_header.White ? pgn_header.White : value.White,
                        WhiteElo: pgn_header.WhiteElo ? pgn_header.WhiteElo : value.WhiteElo,
                        Black: pgn_header.Black ? pgn_header.Black : value.Black,
                        BlackElo: pgn_header.BlackElo ? pgn_header.BlackElo : value.BlackElo,
                        Result: pgn_header.Result ? pgn_header.Result : value.Outcome,
                    }
                })
                sg(games)
            },

            (error) => {
                console.log("fetch error: " + error)
            }
        )
}

export default function fetchHistory(url, setGames) {
    const games = pgns.map(value => {
        return {
            pgn: value,
            ...chess.load_header(value)
        }
    })
    setGames(games)
}

const pgns = [ `[Event "Lindores Abbey Rapid Challenge Final 8"]
[Site "Online"]
[Date "2020.05.29"]
[Round "6"]
[White "Nakamura, Hikaru"]
[Black "Carlsen, Magnus"]
[Result "1-0"]
[Board "3"]
[WhiteTitle "GM"]
[WhiteElo "2829"]
[WhiteCountry "USA"]
[WhiteFideId "2016192"]
[WhiteEloChange "6"]
[BlackTitle "GM"]
[BlackElo "2881"]
[BlackCountry "NOR"]
[BlackFideId "1503014"]
[BlackEloChange "-6"]

1. e4 {[%clk 0:15:10]} e5 {[%clk 0:15:10]} 2. Nf3 {[%clk 0:15:06]} Nc6 {[%clk
0:15:05]} 3. Bb5 {[%clk 0:15:14]} Nf6 {[%clk 0:15:13]} 4. d3 {[%clk 0:15:23]} Bc5
{[%clk 0:15:21]} 5. Bxc6 {[%clk 0:15:32]} dxc6 {[%clk 0:15:30]} 6. O-O {[%clk
0:15:41]} Bg4 {[%clk 0:15:35]} 7. h3 {[%clk 0:15:49]} Bh5 {[%clk 0:15:44]} 8. g4
{[%clk 0:15:37]} Nxg4 {[%clk 0:15:52]} 9. hxg4 {[%clk 0:15:45]} Bxg4 {[%clk
0:16:02]} 10. Be3 {[%clk 0:15:53]} Be7 {[%clk 0:16:10]} 11. Kh1 {[%clk 0:15:46]}
f5 {[%clk 0:14:22]} 12. Rg1 {[%clk 0:14:46]} h5 {[%clk 0:13:02]} 13. Nc3 {[%clk
0:13:58]} f4 {[%clk 0:12:07]} 14. Bd2 {[%clk 0:13:36]} g5 {[%clk 0:10:40]} 15.
Nb1 {[%clk 0:10:18]} Bc5 {[%clk 0:09:13]} 16. Bc3 {[%clk 0:09:43]} Bxf2 {[%clk
0:07:25]} 17. Nbd2 {[%clk 0:09:49]} Qe7 {[%clk 0:05:54]} 18. Qf1 {[%clk 0:08:05]}
Bxg1 {[%clk 0:05:02]} 19. Qxg1 {[%clk 0:08:15]} Bxf3+ {[%clk 0:03:40]} 20. Nxf3
{[%clk 0:08:25]} g4 {[%clk 0:03:49]} 21. Nxe5 {[%clk 0:08:33]} Rg8 {[%clk
0:03:57]} 22. Rf1 {[%clk 0:08:36]} Qg5 {[%clk 0:01:23]} 23. Qd4 {[%clk 0:08:04]}
Qh4+ {[%clk 0:01:31]} 24. Kg1 {[%clk 0:08:12]} Qg3+ {[%clk 0:01:40]} 25. Kh1
{[%clk 0:08:21]} Qh3+ {[%clk 0:01:48]} 26. Kg1 {[%clk 0:08:31]} g3 {[%clk
0:01:52]} 27. Nf3 {[%clk 0:08:20]} g2 {[%clk 0:01:51]} 28. Re1 {[%clk 0:08:10]}
Qxf3 {[%clk 0:00:28]} 29. Qe5+ {[%clk 0:08:16]} Kd8 {[%clk 0:00:36]} 30. Qf6+
{[%clk 0:08:20]} Ke8 {[%clk 0:00:40]} 31. Bb4 {[%clk 0:08:09]} c5 {[%clk
0:00:39]} 32. Bxc5 {[%clk 0:08:03]} Kd7 {[%clk 0:00:40]} 33. Qf7+ {[%clk
0:08:10]} 1-0`,
    `[Event "Shamkir Chess"]
[Site "chess24.com"]
[Date "2019.04.01"]
[Round "2"]
[White "Carlsen, Magnus"]
[Black "Anand, Viswanathan"]
[Result "1-0"]
[Board "3"]
[WhiteElo "2845"]
[WhiteTitle "GM"]
[WhiteCountry "NOR"]
[WhiteFideId "1503014"]
[WhiteEloChange "4"]
[BlackElo "2779"]
[BlackTitle "GM"]
[BlackCountry "IND"]
[BlackFideId "5000017"]
[BlackEloChange "-4"]

1. d4 {[%clk 1:59:59]} Nf6 {[%clk 1:59:47]} 2. c4 {[%clk 1:59:51]} e6 {[%clk
1:59:40]} 3. Nf3 {[%clk 1:59:44]} d5 {[%clk 1:59:30]} 4. Nc3 {[%clk 1:59:38]} Be7
{[%clk 1:59:22]} 5. Bf4 {[%clk 1:59:30]} O-O {[%clk 1:59:14]} 6. e3 {[%clk
1:59:20]} c5 {[%clk 1:59:01]} 7. dxc5 {[%clk 1:59:10]} Bxc5 {[%clk 1:58:53]} 8.
Qc2 {[%clk 1:59:00]} Nc6 {[%clk 1:56:33]} 9. a3 {[%clk 1:58:41]} Qa5 {[%clk
1:55:47]} 10. Rd1 {[%clk 1:58:32]} Rd8 {[%clk 1:53:20]} 11. Be2 {[%clk 1:54:25]}
Ne4 {[%clk 1:50:25]} 12. cxd5 {[%clk 1:53:51]} Nxc3 {[%clk 1:44:27]} 13. bxc3
{[%clk 1:53:26]} exd5 {[%clk 1:43:57]} 14. O-O {[%clk 1:52:53]} h6 {[%clk
1:42:59]} 15. a4 {[%clk 1:52:37]} Bd6 {[%clk 1:42:10]} 16. Bxd6 {[%clk 1:52:22]}
Rxd6 {[%clk 1:42:01]} 17. c4 {[%clk 1:52:13]} Be6 {[%clk 1:37:31]} 18. c5 {[%clk
1:51:12]} Rdd8 {[%clk 1:36:28]} 19. Rb1 {[%clk 1:41:07]} Qc7 {[%clk 1:35:14]} 20.
Qb2 {[%clk 1:34:44]} Rab8 {[%clk 1:34:45]} 21. Nd4 {[%clk 1:33:26]} Nxd4 {[%clk
1:31:12]} 22. Qxd4 {[%clk 1:32:59]} b6 {[%clk 1:24:09]} 23. cxb6 {[%clk 1:19:49]}
Rxb6 {[%clk 1:23:51]} 24. h3 {[%clk 1:19:05]} Rc8 {[%clk 1:13:39]} 25. Rfd1
{[%clk 1:02:02]} Qc3 {[%clk 1:07:14]} 26. Qxc3 {[%clk 1:00:54]} Rxc3 {[%clk
1:07:04]} 27. a5 {[%clk 1:00:47]} Rxb1 {[%clk 0:56:31]} 28. Rxb1 {[%clk 1:00:45]}
Rc5 {[%clk 0:54:58]} 29. a6 {[%clk 0:59:52]} g6 {[%clk 0:51:36]} 30. Rb7 {[%clk
0:56:36]} Rc1+ {[%clk 0:46:18]} 31. Kh2 {[%clk 0:56:23]} Rc2 {[%clk 0:45:34]} 32.
Bb5 {[%clk 0:56:01]} Rb2 {[%clk 0:30:35]} 33. Kg3 {[%clk 0:51:37]} Bc8 {[%clk
0:27:19]} 34. Rb8 {[%clk 0:51:24]} Kg7 {[%clk 0:27:12]} 35. Rxc8 {[%clk 0:51:18]}
Rxb5 {[%clk 0:27:05]} 36. Rc7 {[%clk 0:50:57]} Ra5 {[%clk 0:26:44]} 37. Rxa7
{[%clk 0:50:40]} Kf6 {[%clk 0:24:31]} 38. Ra8 {[%clk 0:49:03]} Ra3 {[%clk
0:21:26]} 39. Kh2 {[%clk 0:47:58]} h5 {[%clk 0:17:58]} 40. a7 {[%clk 1:40:27]}
Ra2 {[%clk 1:13:55]} 41. h4 {[%clk 1:37:12]} Kf5 {[%clk 1:10:03]} 42. f3 {[%clk
1:36:53]} Ra1 {[%clk 1:09:25]} 43. g3 {[%clk 1:35:39]} 1-0`,
    `[Event "Blitz Titled Arena May '20"]
[Site "https://lichess.org/8gjIhCg8"]
[Date "2020.05.09"]
[Round "-"]
[White "sofiko-tereladze"]
[Black "alireza2003"]
[Result "0-1"]
[UTCDate "2020.05.09"]
[UTCTime "20:31:04"]
[WhiteElo "2226"]
[BlackElo "2801"]
[WhiteRatingDiff "+0"]
[BlackRatingDiff "+1"]
[WhiteTitle "WIM"]
[BlackTitle "GM"]
[Variant "Standard"]
[TimeControl "180+0"]
[ECO "A48"]
[Opening "London System"]
[Termination "Normal"]

1. d4 Nf6 2. Nf3 g6 3. Bf4 d6 4. e3 Bg7 5. c3 O-O 6. Be2 Nc6 7. O-O Nd7 8. h3 e5 9. Bg3 f5 10. dxe5 dxe5 11. Na3 Kh8 12. Nc4 Qe7 13. Qd2 g5 14. Rad1 f4 15. Bh2 e4 16. Nd4 f3 17. gxf3 Nxd4 18. cxd4 exf3 19. Bd3 Qe6 20. Kh1 Qxh3 21. Rg1 Nf6 22. Rg3 Qh5 23. Bf1 Ng4 24. Rh3 Nxf2+ 25. Qxf2 Bxh3 26. Ne5 Bg2+ 27. Kg1 Bxf1 28. Rxf1 Rae8 29. Bg3 Qh3 30. Qh2 Qxh2+ 31. Kxh2 Bxe5 32. Bxe5+ Kg8 33. Kg3 h5 34. Rh1 f2 35. Rf1 Rf5 36. e4 Rf7 37. b4 Kh7 38. b5 Kg6 39. a4 h4+ 40. Kg4 Rxe5 41. dxe5 Rf4+ 42. Kh3 Rxe4 43. Rxf2 Rxe5 44. Rc2 Re3+ 45. Kg2 g4 46. Rxc7 h3+ 47. Kh2 Re2+ 48. Kg3 Rg2+ 0-1
`,
    `[Event "Ch World (match)"]
[Site "Moscow (Russia)"]
[Date "1960.??.??"]
[Round "?"]
[White "Mikhail Botvinnik"]
[Black "Mikhail Tal"]
[Result "0-1"]

1. c4 Nf6 2. Nf3 g6 3. g3 Bg7 4. Bg2 O-O 5. d4 d6 6. Nc3 Nbd7 7. O-O e5 8. e4 c6
9. h3 Qb6 10. d5 cxd5 11. cxd5 Nc5 12. Ne1 Bd7 13. Nd3 Nxd3 14. Qxd3 Rfc8 15.
Rb1 Nh5 16. Be3 Qb4 17. Qe2 Rc4 18. Rfc1 Rac8 19. Kh2 f5 20. exf5 Bxf5 21. Ra1
Nf4 22. gxf4 exf4 23. Bd2 Qxb2 24. Rab1 f3 25. Rxb2 fxe2 26. Rb3 Rd4 27. Be1
Be5+ 28. Kg1 Bf4 29. Nxe2 Rxc1 30. Nxd4 Rxe1+ 31. Bf1 Be4 32. Ne2 Be5 33. f4 Bf6
34. Rxb7 Bxd5 35. Rc7 Bxa2 36. Rxa7 Bc4 37. Ra8+ Kf7 38. Ra7+ Ke6 39. Ra3 d5 40.
Kf2 Bh4+ 41. Kg2 Kd6 42. Ng3 Bxg3 43. Bxc4 dxc4 44. Kxg3 Kd5 45. Ra7 c3 46. Rc7
Kd4 47. Rd7+ 0-1`,
    `[Event "Memorial Rosenwald"]
[Site "New York (USA)"]
[Date "1956.??.??"]
[Round "?"]
[White "Donald Byrne"]
[Black "Bobby Fischer"]
[Result "0-1"]

1. Nf3 Nf6 2. c4 g6 3. Nc3 Bg7 4. d4 O-O 5. Bf4 d5 6. Qb3 dxc4 7. Qxc4 c6 8. e4
Nbd7 9. Rd1 Nb6 10. Qc5 Bg4 11. Bg5 Na4 12. Qa3 Nxc3 13. bxc3 Nxe4 14. Bxe7 Qb6
15. Bc4 Nxc3 16. Bc5 Rfe8+ 17. Kf1 Be6 18. Bxb6 Bxc4+ 19. Kg1 Ne2+ 20. Kf1 Nxd4+
21. Kg1 Ne2+ 22. Kf1 Nc3+ 23. Kg1 axb6 24. Qb4 Ra4 25. Qxb6 Nxd1 26. h3 Rxa2 27.
Kh2 Nxf2 28. Re1 Rxe1 29. Qd8+ Bf8 30. Nxe1 Bd5 31. Nf3 Ne4 32. Qb8 b5 33. h4 h5
34. Ne5 Kg7 35. Kg1 Bc5+ 36. Kf1 Ng3+ 37. Ke1 Bb4+ 38. Kd1 Bb3+ 39. Kc1 Ne2+ 40.
Kb1 Nc3+ 41. Kc1 Rc2# 0-1`,
    `[Event "Ch Russia"]
[Site "Lodz (Poland)"]
[Date "1907.??.??"]
[Round "?"]
[White "Georg Rotlevi"]
[Black "Akiba Rubinstein"]
[Result "0-1"]

1. d4 d5 2. Nf3 e6 3. e3 c5 4. c4 Nc6 5. Nc3 Nf6 6. dxc5 Bxc5 7. a3 a6 8. b4 Bd6
9. Bb2 O-O 10. Qd2 Qe7 11. Bd3 dxc4 12. Bxc4 b5 13. Bd3 Rd8 14. Qe2 Bb7 15. O-O
Ne5 16. Nxe5 Bxe5 17. f4 Bc7 18. e4 Rac8 19. e5 Bb6+ 20. Kh1 Ng4 21. Be4 Qh4 22.
g3 Rxc3 23. gxh4 Rd2 24. Qxd2 Bxe4+ 25. Qg2 Rh3 0-1`
]
