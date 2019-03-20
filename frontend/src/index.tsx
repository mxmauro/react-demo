import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import './index.css';
import AppWithRouter from './App';
import { HashRouter } from 'react-router-dom';
import * as serviceWorker from './serviceWorker';

global.REST_API_URL = "http://localhost:3200/api";

ReactDOM.render(<HashRouter><AppWithRouter /></HashRouter>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
