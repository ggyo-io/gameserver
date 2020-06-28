import React from "react";
import {Card, Table} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import {useStoreState, useStoreActions} from "easy-peasy";
import {playClick} from '../../../../utils/playClick'
import {useHistory} from "react-router-dom";


export const Result = () => {
    const routerHistory = useHistory()
    const { update, newGame } = useStoreActions(actions => actions.game)
    const { result, opponent, colorPreference, timeControl, mode } = useStoreState(state => state.game)
    const doClickPlay = () => playClick(routerHistory, update, newGame, opponent, colorPreference, timeControl)

    return (
        <Card>
            <Card.Header>Result</Card.Header>
            <Card.Body className="p-1">
                <Table striped bordered className="m-0 text-center">
                    <tbody>
                    <tr>
                        <td><small>{!!result.outcome && result.outcome}</small></td>
                        {!!result.method && <td><small>{result.method}</small></td>}
                    </tr>
                    </tbody>
                </Table>
                {(mode !== "analysis") && <Button size="lg" block onClick={doClickPlay}>PLAY AGAIN</Button>}
            </Card.Body>
        </Card>
    )
}
