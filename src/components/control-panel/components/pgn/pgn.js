import React from "react"
import "./pgn.scss"
import {Table, Pagination, Card} from "react-bootstrap"
import Chess from "chess.js"

const pgn = `
1. e4 c5 2. Nf3 Nc6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 e5 6. Ndb5 d6 7. Nd5 Nxd5 8. exd5 Ne7 9. c4 Ng6 10. Qa4 Bd7 11. Qb4 Bf5 12. Qa4 Bd7 13. Qb4 Bf5 14. h4 h5 15. Bg5 Qb8 16. Be2 a6 17. Nc3 Qc7 18. g3 Be7 19. Be3 e4 20. O-O O-O 21. Bxh5 Ne5 22. Be2 Qd7 23. Qa4 Qc8 24. c5 dxc5 25. Nxe4 c4 26. Nc3 b5 27. Qd1 b4 28. Na4 Be4 29. Qd4 Qf5 30. f4 Qg6 31. Bf2 Nd3 32. h5 Qf5 33. Bg4 Qxg4 34. Qxe4 Bd6 35. Qg2 Rae8 36. Bd4 Qxh5 37. Qf3 Qg6 38. Kh1 Re4 39. Bf2 Rfe8
`
const chess = new Chess()
chess.load_pgn(pgn, {sloppy: true})
const mvstrs = chess.history();
const mvpairs = mvstrs.reduce((result, value, index, array) => {
    if (index % 2 === 0)
        result.push(array.slice(index, index + 2));
    return result;
}, []);
const moves = mvpairs.map((pair, index) => {
    return (
        <tr key={index}>
            <td>
                <strong>{index + 1}.</strong>
            </td>
            <td>
                {pair[0]}
            </td>
            <td>
                {pair.length === 2 ? pair[1]:''}
            </td>
        </tr>
    )
})

export const PGN = (props) => {
    const style = {"max-height": Math.ceil(props.size / 2) + 'px'};
  return  <Card>
        <Card.Body>
            <div className="d-flex flex-column flex-fill justify-content-between">
                <div className="overflow-auto box-item mb-2" style={style}>
                    <Table striped bordered hover responsive="sm">
                        <tbody>
                        {moves}
                        </tbody>
                    </Table>
                </div>
                <div className="box-item align-self-center">
                    <Pagination>
                        <Pagination.First/>
                        <Pagination.Prev/>
                        <Pagination.Ellipsis/>
                        <Pagination.Next/>
                        <Pagination.Last/>
                    </Pagination>
                </div>
            </div>
        </Card.Body>
    </Card>
};

