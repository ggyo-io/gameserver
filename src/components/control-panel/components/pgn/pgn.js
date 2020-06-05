import React, {useEffect} from "react";
import {Card, Table} from "react-bootstrap";
import "./pgn.scss";
import {PagingButton} from "./pagingButton";
import {useStoreActions, useStoreState} from "easy-peasy";

const renderMoves = ({moves, browseIndex, setBrowseIndex} ) => {

    // split to pairs
    const mvpairs = moves.reduce((result, value, index, array) => {
        (index % 2 === 0) ? result.push(array.slice(index, index + 2)) : '';
        return result;
    }, []);

    const currentMove = (idx) => {
        if (idx === 1 && browseIndex === 0) {
            return "pgn-scroll-to"
        }
        if (idx === browseIndex) {
            return "table-secondary pgn-scroll-to"
        }
        return ""
    }

    const handleClick = (idx) => {
        return function (e) {
            e.preventDefault()
            setBrowseIndex(idx)
        }
    }

    const rendered = mvpairs.map((pair, index) => {
            const [whiteIdx, blackIdx] = [index * 2 + 1, (index + 1) * 2];

            return <tr key={index}>
                <td>
                    <strong>{index + 1}.</strong>
                </td>
                <td className={currentMove(whiteIdx)}>
                    <a href="#" onClick={handleClick(whiteIdx)}>{pair[0]}</a>
                </td>
                <td className={currentMove(blackIdx)}>
                    {pair.length === 2 ?
                        <a href="#" onClick={handleClick(blackIdx)}>{pair[1]}</a> : '-'}
                </td>
            </tr>
        }
    );
    return rendered;
}

const reactToKeys = (props, e) => {
    const {setBrowseIndex, browseIndex, moves} = props
    const left = 37;
    const up = 38;
    const right = 39;
    const down = 40;
    let browse_where

    if (e.ctrlKey || e.metaKey || e.altKey || e.shiftKey)
        return;

    switch (e.which) {
        case left:
            browse_where = browseIndex - 1;
            break;
        case right:
            browse_where = browseIndex + 1;
            break;
        case up:
            browse_where = 0;
            break;
        case down:
            browse_where = moves.length;
            break;
        default:
            return; // not our key
    }
    //console.log(e)
    e.preventDefault(); // prevent the default action (scroll / move caret)
    setBrowseIndex(browse_where)
}

const keydownEffects = (props) => {
    const keyHandler = (e) => reactToKeys(props, e);
    window.addEventListener('keydown', keyHandler);
    return () => {
        window.removeEventListener('keydown', keyHandler);
    };
}

const scrollEffect = () => {
    const el = document.querySelector(".pgn-scroll-to");
    if (el)
        el.scrollIntoView({block: "center"});
}

export const PGN = (props) => {
    const style = {"maxHeight": Math.ceil(props.size / 2) + 'px'};
    const top = useStoreState(state => state.game.top)
    const bottom = useStoreState(state => state.game.bottom)
    const browseIndex = useStoreState(state => state.game.browseIndex)
    const history = useStoreState(state => state.game.history)
    const orientation = useStoreState(state => state.game.orientation)
    const moves = history ? history.map(x => x.san) : []
    const setBrowseIndex = useStoreActions(actions => actions.game.setBrowseIndex)
    const update = useStoreActions(actions => actions.game.update)
    const _renderMoves = renderMoves({moves, browseIndex, setBrowseIndex});

    useEffect(() => keydownEffects({moves, browseIndex, setBrowseIndex}))
    useEffect(scrollEffect)

    return <Card>
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
                            <PagingButton name="First" onClick={() => setBrowseIndex(0)}/>
                            <PagingButton name="Previous" onClick={() => setBrowseIndex(browseIndex - 1)}/>
                            <PagingButton name="Next" onClick={() => setBrowseIndex(browseIndex + 1)}/>
                            <PagingButton name="Last" onClick={() => setBrowseIndex(moves.length)}/>
                            <PagingButton
                                name="Flip"
                                onClick={() => update({
                                    orientation: orientation === 'white' ? 'black' : 'white',
                                    top: bottom,
                                    bottom: top})
                                }
                            />
                        </ul>
                    </nav>
                </div>
            </div>
        </Card.Body>
    </Card>
};
