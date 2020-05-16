import React, {useEffect} from "react";
import {Table, Pagination, Card} from "react-bootstrap";
import "./pgn.scss";

const renderMoves = (props) => {
    const chess = props.gameState.chess
    const mvstrs = chess.history()
    const mvpairs = mvstrs.reduce((result, value, index, array) => {
        (index % 2 === 0) ? result.push(array.slice(index, index + 2)) : '';
        return result;
    }, []);
    const currentMove = (idx) => {
        if (idx === 1 && props.gameState.browseIndex === 0) {
            return "pgn-scroll-to"
        }
        if (idx === props.gameState.browseIndex) {
            return "table-secondary pgn-scroll-to"
        }
        return ""
    }
    const _renderMoves = mvpairs.map((pair, index) => (
            <tr key={index}>
                <td>
                    <strong>{index + 1}.</strong>
                </td>
                <td className={currentMove(index*2+1)}>
                    <a href="#" onClick={() => setBrowseIndex(props,index*2+1)}>{pair[0]}</a>
                </td>
                <td className={currentMove((index+1)*2)}>
                    {pair.length === 2 ? <a href="#" onClick={() => setBrowseIndex(props,(index+1)*2)}>{pair[1]}</a>: '-'}
                </td>
            </tr>
        )
    );
    return _renderMoves;
}

const reactToKeys = (props, e) => {
    const left = 37;
    const up = 38;
    const right = 39;
    const down = 40;
    const leftClick = () => setBrowseIndex(props, props.gameState.browseIndex - 1);
    const rightClick = () => setBrowseIndex(props, props.gameState.browseIndex + 1);
    const upClick = () => setBrowseIndex(props, 0);
    const downClick = () => setBrowseIndex(props, props.gameState.chess.history().length);

    let doClick = () => {};
    switch (e.which) {
        case left:
            doClick = leftClick;
            break;
        case right:
            doClick = rightClick;
            break;
        case up:
            doClick = upClick;
            break;
        case down:
            doClick = downClick;
            break;
        default:
            return; // not our key
    }
    e.preventDefault(); // prevent the default action (scroll / move caret)
    doClick();
}

const setBrowseIndex = (props, number) => {
    const chess = props.gameState.chess
    if (number < 0 || number > chess.history().length)
        return

    props.setGameState({
        chess: chess,
        browseIndex: number
    })
}

const keydownEffects = (props) => {
    const keyHandler = (e) => reactToKeys(props, e);
    const el = document.querySelector(".pgn-scroll-to");
    if (el)
        el.scrollIntoView({ block: "center" });
    window.addEventListener('keydown', keyHandler);
    return () => {
        window.removeEventListener('keydown', keyHandler);
    };
}

export const PGN = (props) => {
    const style = {"maxHeight": Math.ceil(props.size / 2) + 'px'};
    const _renderMoves = renderMoves(props);

    useEffect( () =>  keydownEffects(props) )

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