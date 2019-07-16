import React from 'react';
import 'whatwg-fetch';
import { Link } from 'react-router-dom'

import IssueFilter from './IssueFilter.jsx';
import IssueAdd from './IssueAdd.jsx';

function IssueTable (props) {
	const issueRows = props.issues.map(issue => <IssueRow 
		key={issue._id} issue={issue} />);
	return(
		<table className="bordered-table">
			<thead>
				<tr>
					<th>Id</th>
					<th>Status</th>
					<th>Owner</th>
					<th>Created</th>
					<th>Effort</th>
					<th>Completion Date</th>
					<th>Title</th>
				</tr>
			</thead>
			<tbody>{issueRows}</tbody>
		</table>
	);
}

const IssueRow = (props) => (
	<tr>
		<td>
            <Link to={`/issue/${props.issue._id}`}>
                {props.issue._id.substr(-4)}
            </Link>
        </td>
		<td>{props.issue.status}</td>
		<td>{props.issue.owner}</td>
		<td>{props.issue.created.toDateString() }</td>
		<td>{props.issue.effort ? 
			props.issue.effort : ''}</td>
		<td>{props.issue.completionDate ? 
			props.issue.completionDate.toDateString() : ''}</td>
		<td>{props.issue.title}</td>
	</tr>
)

export default class IssueList extends React.Component {
	constructor(){
		super();
		this.state = { issues: [] };
		//this.createTestIssue = this.createTestIssue.bind(this);
		//setTimeout(this.createTestIssue, 2000);
		this.createIssue = this.createIssue.bind(this);
	}
		
	componentDidMount() {
		this.loadData();
	}

    componentDidUpdate(prevProps) {
        if (prevProps.location.search === this.props.location.search) {
            return;
        } 
        this.loadData();
    }
	
	loadData() {
		fetch(`/api/issues${this.props.location.search}`).then(response => {
			if (response.ok) {
				response.json().then(data => {
					console.log("Total count of records:", data._metadata.total_count);
					data.records.forEach(issue => {
						issue.created = new Date(issue.created);
						if (issue.completionDate) 
							issue.completionDate = new Date(issue.completionDate);
					});
					this.setState({ issues: data.records });
				});	
			} else {
				response.json().then(error => {
					alert("Faild to fetch issues:" + error.message)
				});
			}		
		}).catch(err => {
				console.log(err);
			});
	}
	
	createIssue(newIssue) {
		fetch('/api/issues', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(newIssue),
		}).then(response =>
			response.json()
		).then(updateIssue => {
			updateIssue.created = new Date(updateIssue.created);
			if (updateIssue.completionDate) 
				updateIssue.completionDate = new Date(updateIssue.completionDate);
			var newIssues = this.state.issues.concat(updateIssue)
			this.setState({ issues: newIssues });
		}).catch(err => {
			alert("Error in sending data to server: " + err.message);
		});
	}
		
	render() {
		return(
			<div>
				<h1>Issue Tracker</h1>
				<IssueFilter />
				<hr />
				<IssueTable issues={this.state.issues} />
				<hr />
				<IssueAdd createIssue={this.createIssue} />
			</div>
		);
	}
}
