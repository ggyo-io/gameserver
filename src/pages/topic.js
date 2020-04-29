import React from "react";
import {useParams} from "react-router-dom";
const Topic = () => {
    const { topicId } = useParams();
    return <h3>Requested topic ID: {topicId}</h3>;
}
export {Topic}