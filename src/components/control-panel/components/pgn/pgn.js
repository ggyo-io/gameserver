import React from "react";
import {Table, Pagination, Card} from "react-bootstrap";
import Chess from "chess.js";
import "./pgn.scss";
import {pgn} from "../../constants";

const chess = new Chess()
chess.load_pgn(pgn, {sloppy: true})
const mvstrs = chess.history();
const mvpairs = mvstrs.reduce((result, value, index, array) => {
    (index % 2 === 0) ? result.push(array.slice(index, index + 2)) : '';
    return result;
}, []);
const _renderMoves = mvpairs.map((pair, index) => (
        <tr key={index}>
            <td>
                <strong>{index + 1}.</strong>
            </td>
            <td>
                {pair[0]}
            </td>
            <td>
                {pair.length === 2 ? pair[1]: '-'}
            </td>
        </tr>
    )
);

export const PGN = (props) => {
    const style = {"max-height": Math.ceil(props.size / 2) + 'px'};
  return  <Card>
        <Card.Body>
            <div className="d-flex flex-column flex-fill justify-content-between">
                <div className="overflow-auto box-item mb-2" style={style}>
                    <Table striped bordered hover responsive="sm">
                        <tbody>
                        {_renderMoves}
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

