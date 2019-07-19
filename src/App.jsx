import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Redirect, Switch, withRouter } from 'react-router-dom';

import IssueList from './IssueList.jsx';
import IssueEdit from './IssueEdit.jsx';

const contentNode = document.querySelector("#content");
const NoMatch = () => <p>Page Not Found</p>;
    
const App = (props) => (
    <div>
        <div className="header">
            <h1>Issue Tracker</h1>
        </div>

        <div className="contents">
            {props.children}
        </div>
        <div className="footer">
            <p>It is footer!</p>
        </div>
    </div>
);

const RoutedApp = () => (
    <Router>
        <Redirect from="/" to="/issues" />
        <App>
            <Switch>
                <Route path="/issue/:id" component={IssueEdit}/>
                <Route path="/issues" component={withRouter(IssueList)} />
                <Route path="*" component={NoMatch} />
            </Switch>
        </App>
    </Router>
    );

ReactDOM.render(<RoutedApp />, contentNode)
