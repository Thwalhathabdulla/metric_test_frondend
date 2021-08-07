import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { Router } from "react-router-dom";
import { createBrowserHistory } from "history";
import reportWebVitals from './reportWebVitals';
import './assets/scss/style.scss';
import '../node_modules/bootstrap/scss/bootstrap.scss'
import 'font-awesome/css/font-awesome.min.css';

const history = createBrowserHistory();

ReactDOM.render(
  <React.StrictMode>
      <Router history={history}>
        <App />
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
