import React from "react";
import {Button} from "react-bootstrap";
import {Example} from "../components/modal";

const Home = () => {
    return <h2>
        <div>About routing you can read here</div>
        <a href="https://reacttraining.com/react-router/web/guides/quick-start" target="_blank">React Router</a>
        <div>State manager Easy-Peasy</div>
        <a href="https://github.com/ctrlplusb/easy-peasy" target="_blank">Easy-Peasy</a>
        <div>UI framework</div>
        <a href="https://react-bootstrap.github.io/getting-started/introduction" target="_blank">React Bootstarp 4</a>
        <div>
            <h2>Modal for exaple</h2>
            <Example/>
        </div>
    </h2>;
}
export {Home};
