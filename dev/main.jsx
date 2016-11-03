require("normalize.css");
require("./main.scss");

import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import {Router, Route, hashHistory, IndexRoute } from 'react-router'
import store from './Redux/store.jsx'
import {syncHistoryWithStore} from 'react-router-redux'
import App from './Component/App.jsx'
import Jeu from './Component/Jeu/Jeu.jsx'
import Accueil from './Component/Accueil.jsx'
import Aventure from './Component/Aventure.jsx'
import Aide from './Component/Aide.jsx'

var history = syncHistoryWithStore(hashHistory , store)

ReactDOM.render(
    <Provider store={store}>
        <Router history={history}>
            <Route path='/' component={App}>
                <IndexRoute component={Accueil} />
                <Route path="Jeu" component={Jeu} />
                <Route path="Aventure" component={Aventure} />
                <Route path="Aide" component={Aide} />
            </Route>
        </Router>
    </Provider>, document.getElementById("main")
);
