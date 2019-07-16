import React from 'react'
import { Link } from 'react-router-dom'

export default class IssueEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
                    id : props.match.params.id
        };
    }
    render() {
        return (
            <div>
                <p>Editing Issue ID: {this.state.id}</p>
                <Link to="/issues">Back to Issue List</Link>
            </div>
        );
    }
}
