import React from "react";
import {Table, Pagination, Card} from "react-bootstrap";
import "./pgn.scss";

const renderMoves = (props) => {
    const chess = props.gameState.chess
    const mvstrs = chess.history()
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
                    <a href="#" onClick={() => setBrowseIndex(props,index*2+1)}>{pair[0]}</a>
                </td>
                <td>
                    {pair.length === 2 ? <a href="#" onClick={() => setBrowseIndex(props,(index+1)*2)}>{pair[1]}</a>: '-'}
                </td>
            </tr>
        )
    );
    return _renderMoves;
}


const setBrowseIndex = (props, number) => {
    props.setGameState({
        chess: props.gameState.chess,
        browseIndex: number
    })
}


export const PGN = (props) => {
    const style = {"maxHeight": Math.ceil(props.size / 2) + 'px'};
    const _renderMoves = renderMoves(props);

    return  <Card>
        <Card.Body>
            <div className="d-flex flex-column flex-fill justify-content-between">
                <div className="overflow-auto box-item mb-2" style={style}>
                    <Table className="table-sm table-borderless">
                        <tbody>
                        {_renderMoves}
                        </tbody>
                    </Table>
                </div>
                <div className="box-item align-self-center">
                    <nav aria-label="Paging moves">
                        <ul className="pagination">
                            <li className="page-item">
                                <a className="page-link" href="#" aria-label="First" onClick={()=>setBrowseIndex(props, 0)}>
                                    <span aria-hidden="true">&laquo;</span>
                                    <span className="sr-only">First</span>
                                </a>
                            </li>
                            <li className="page-item">
                                <a className="page-link" href="#" aria-label="Previous" onClick={()=>setBrowseIndex(props, props.gameState.browseIndex - 1)}>
                                    <span aria-hidden="true">&lsaquo;</span>
                                    <span className="sr-only">Previous</span>
                                </a>
                            </li>
                            <li className="page-item">
                                <a className="page-link" href="#" aria-label="Next" onClick={()=>setBrowseIndex(props, props.gameState.browseIndex + 1)}>
                                    <span aria-hidden="true">&rsaquo;</span>
                                    <span className="sr-only">Next</span>
                                </a>
                            </li>
                            <li className="page-item">
                                <a className="page-link" href="#" aria-label="Last" onClick={()=>setBrowseIndex(props, props.gameState.chess.history().length)}>
                                    <span aria-hidden="true">&raquo;</span>
                                    <span className="sr-only">Last</span>
                                </a>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </Card.Body>
    </Card>
};

