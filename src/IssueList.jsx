import React from 'react';
import 'whatwg-fetch';
import { Link, withRouter } from 'react-router-dom';

import IssueFilter from './IssueFilter.jsx';
import IssueAdd from './IssueAdd.jsx';

const getQueryString = (query) => {
    let keys = Object.keys(query), key, queryString = null;
    if (keys.length !== 0) {
        key = keys.shift();
        queryString = '?' + key + '='  + query[key];
        while (keys.length !== 0) {
            key = keys.shift();
            queryString += '&' + key + '='  + query[key];
        }
    } 
    return queryString
}

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

class IssueList extends React.Component {
	constructor(){
		super();
		this.state = { issues: [] };
		//this.createTestIssue = this.createTestIssue.bind(this);
		//setTimeout(this.createTestIssue, 2000);
		this.createIssue = this.createIssue.bind(this);
        this.setFilter = this.setFilter.bind(this);
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
    
    setFilter(query) {
        let queryString = getQueryString(query);
        if (queryString === null) queryString = '/issues';
        this.props.history.push(queryString);
    }
		
	render() {
		return(
			<div>
				<IssueFilter setFilter={this.setFilter}
                initFilter={this.props.location.search}/>
				<hr />
				<IssueTable issues={this.state.issues} />
				<hr />
				<IssueAdd createIssue={this.createIssue} />
			</div>
		);
	}
}

export default withRouter(IssueList)
