import React from 'react'
import { Link } from 'react-router-dom'

export default class IssueEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            issue: {
            _id : '', title: '', status: '', owner: '', effort: '',
            completionDate: '', created: null,
            },
        };
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    componentDidMount() {
        this.loadData();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.match.params.id !== this.props.match.params.id) {
            this.loadData();
        }
    }

    onChange(event) {
        const issue = Object.assign({}, this.state.issue);
        issue[event.target.name] = event.target.value;
        this.setState({ issue });
    }
    
    onSubmit(event) {
        let issue = this.state.issue;
        issue.effort = Number.parseInt(issue.effort);
        fetch(`/api/issue/${this.props.match.params.id}`, {
            method: "PUT",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(issue),
        }).then(res => {
            if (res.ok) {
                res.json().then(updateIssue => {
                    updateIssue.created = new Date(updateIssue.created);
                    if (updateIssue.completionDate) {
                        updateIssue.completionDate = new Date (updateIssue.completionDate);
                    }
                    this.setState({ issue: updateIssue })
                    alert('Updated issue successfully')
                });    
            } else {
                res.json().then(err => {
                    alert(`Failed to update issue: ${err.message}`);
                });
            }
        }).catch(err => {
            alert(`Error in sending data to server: ${err.message}`);
        });
    }

    loadData() {
        fetch(`/api/issue/${this.props.match.params.id}`).then(response => {
            if (response.ok) {
                response.json().then(issue => {
                    issue.created = new Date(issue.created);
                    issue.completionDate = issue.completionDate != null ?
                        new Date(issue.completionDate).toDateString() : '';
                    issue.effort = issue.effort != null ? issue.effort.toString() : '';
                    this.setState({ issue });
                });
            } else {
                response.json().then(err => {
                    alert(`Failed to fetch issue: ${err.message}`);
                });
            }
        }).catch(err => {
            alert(`Error in fetching data from server: ${err.message}`);
        });
    } 

    render() {
        const issue = this.state.issue;
        return (
            <div>
                <form onSubmit={this.onSubmit}>
                    ID: {issue._id}
                    <br />
                    Created: {issue.created ? issue.created.toDateString() : ''}
                    <br />
                    Status: <select name='status' value={issue.status} onChange={this.onChange}>
                        <option value='New'>New</option>
                        <option value='Open'>Open</option>
                        <option value='Assigned'>Assigned</option>
                        <option value='Fixed'>Fixed</option>
                        <option value='Verified'>Verified</option>
                        <option value='Closed'>Closed</option>
                    </select>
                    <br />
                    Owner: <input name="owner" value={issue.owner} onChange={this.onChange} />
                    <br />
                    Effort: <input type='number' name='effort' value={issue.effort} onChange={this.onChange} />
                    <br />
                    Completion Date: <input name='completionDate' value={issue.completionDate} onChange={this.onChange} />
                    <br />
                    Title: <input name='title' value={issue.title} size={50} onChange={this.onChange} />
                    <br />
                    <button type="submit">Submit</button>
                </form>
                
                <p>Editing Issue ID: {this.state.id}</p>
                <Link to="/issues">Back to Issue List</Link>
            </div>
        );
    }
}
