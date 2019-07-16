import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Route, Redirect, Switch } from 'react-router-dom';

import IssueList from './IssueList.jsx';
import IssueEdit from './IssueEdit.jsx';

const contentNode = document.querySelector("#content");
const NoMatch = () => <p>Page Not Found</p>;
    
const RoutedApp = () => (
    <HashRouter>
        <Redirect from="/" to="/issues" />
        <Switch>
            <Route path="/issue/:id" component={IssueEdit}/>
            <Route path="/issues" component={IssueList} />
            <Route path="*" component={NoMatch} />
        </Switch>
    </HashRouter>
    );

ReactDOM.render(<RoutedApp />, contentNode)
