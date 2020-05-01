import React from "react";
import ReactDOM from "react-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import './style.scss';
import {BrowserRouter} from "react-router-dom";
import App from "./App";

ReactDOM.render(
    <BrowserRouter>
        <App/>
    </BrowserRouter>,
    document.querySelector("#root")
);

