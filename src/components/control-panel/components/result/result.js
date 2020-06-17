import React from "react";
import {Card, Table} from "react-bootstrap";
import {useStoreState} from "easy-peasy";

export const Result = (props) => {
    const result = useStoreState(state => state.game.result)
    return (
        <Card>
            <Card.Header>Result</Card.Header>
            <Card.Body className="p-1">
                <Table striped bordered className="m-0">
                    <tbody>
                    <tr>
                        <td className="text-nowrap text-center">{result.outcome}</td>
                        {!!result.method && <td>{result.method}</td>}
                    </tr>
                    </tbody>
                </Table>
            </Card.Body>
        </Card>
    )
}
