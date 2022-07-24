import React from 'react';
import './theme.scss';
import 'favicon.ico';
import {App} from "./App";
import { createRoot } from 'react-dom/client';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);
