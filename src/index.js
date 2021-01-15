/*!

=========================================================
* Material Dashboard React - v1.9.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/material-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import ReduxThunk from "redux-thunk";
import { createBrowserHistory } from "history";
import { Router, Route, Switch, Redirect } from "react-router-dom";
import { ToastContainer } from "react-toastify";

// core components
import layout from "layouts";

import "react-toastify/dist/ReactToastify.css";
import "assets/css/material-dashboard-react.css?v=1.9.0";

import reducer from "./redux";
const store = createStore(reducer, applyMiddleware(ReduxThunk));

const hist = createBrowserHistory();

ReactDOM.render(
  <React.StrictMode>
    <ToastContainer />
    <Provider store={store}>
      <Router history={hist}>
        <Switch>
          <Route path="/" component={layout} />
          <Redirect from="/" to="/home" />
        </Switch>
      </Router>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
