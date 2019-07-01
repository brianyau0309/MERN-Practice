const $ = (query) => document.querySelector(query); //shortcut
const contentNode = $("#content");

// Part 1 Hello World! //
//const continents = ["Africa","America","Asia","Australia","Europe"];
//const message = continents.map(c => `Hello ${c}!`).join(' ');

//ReactDOM.render(<h1>{message}</h1>,
//				contentNode);


// Part 2 React Component //
//const issues = [
//	{
//		id: 1,status: "Open", owner: 'Raven',
//		created: new Date('2019-08-15'), effort: 5, completionDate: undefined,
//		title: 'Error in console when clicking Add',
//	},
//	{
//		id: 2,status: "Assigned", owner: 'Eddie',
//		created: new Date('2019-09-16'), effort: 5,
//		completionDate: new Date('2019-09-30'),
//		title: 'Missing bottom border on panel',
//	},
//];

class IssueFilter extends React.Component {
	render() {
		return(
			<div>Placeholder for Filter</div>
		);
	}
}
	
function IssueTable (props) {
	const issueRows = props.issues.map(issue => <IssueRow 
		key={issue.id} issue={issue} />);
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
		<td>{props.issue.id}</td>
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
	
class IssueAdd extends React.Component {
	constructor() {
		super();
		this.handleSubmit = this.handleSubmit.bind(this);
	}
	
	handleSubmit(e) {
		e.preventDefault();
		var form = document.forms.issueAdd;
		this.props.createIssue ({
			owner: form.owner.value,
			title: form.title.value,
			status: 'New',
			created: new Date(),
		});
		// clear the form for the next input
		form.owner.value = ""; form.title.value = "";
	}
	
	render() {
		return(
			<div>
				<form name="issueAdd" onSubmit={this.handleSubmit}>
				<input type="text" name="owner" placeholder="Owner" />
				<input type="text" name="title" placeholder="Title" />
				<button>Add</button>
				</form>
			</div>
			);
		}
	}

class IssueList extends React.Component {
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
	
	loadData() {
		fetch('/api/issues').then(response =>
			response.json()
		).then(data => {
			console.log("Total count of records:", data._metadata.total_count);
			data.records.forEach(issue => {
				issue.created = new Date(issue.created);
				if (issue.completionDate) 
					issue.completionDate = new Date(issue.completionDate);
			});
				this.setState({ issues: data.records });
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
		).then(updateIssues => {
			console.log("Total count of records:", updateIssues._metadata.total_count);
			updateIssues.records.forEach(issue => {
				issue.created = new Date(issue.created);
				if (issue.completionDate) 
					issue.completionDate = new Date(issue.completionDate);
			});
				this.setState({ issues: updateIssues.records });
		).catch(err => {
			alert("Error in sending data to server: " + err.message);
		});
	
	//	const newIssues = this.state.issues.slice();
	//	newIssue.id = this.state.issues.length + 1;
	//	newIssues.push(newIssue);
	//	this.setState({ issues: newIssues });
	}
	//createTestIssue() {
	//	this.createIssue(
	//		{
	//		status: 'New', owner: 'Pieta', created: new Date(),
	//			title: 'Completion date should be optional',
	//		});
	//}
		
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

ReactDOM.render(<IssueList />, contentNode)