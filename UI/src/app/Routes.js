import React from "react";

import {BrowserRouter, Route, Redirect, Switch } from "react-router-dom";

import App from "./App";
import Trades from "./components/Trades";
import Transfers from "./components/Transfers";
import Transports from "./components/Transports";


export default function Routes(){
    return(
        <BrowserRouter>
            <App>
                <Switch>
                    <Route path="/trades" component={Trades} />
                    <Route path="/transfers" component={Transfers} />
                    <Route path="/transports" component={Transports} />
                </Switch>
            </App>
        </BrowserRouter>

    )

}
