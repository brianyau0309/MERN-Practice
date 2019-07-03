const $ = query => document.querySelector(query); //shortcut
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
		return React.createElement(
			"div",
			null,
			"Placeholder for Filter"
		);
	}
}

function IssueTable(props) {
	const issueRows = props.issues.map(issue => React.createElement(IssueRow, {
		key: issue.id, issue: issue }));
	return React.createElement(
		"table",
		{ className: "bordered-table" },
		React.createElement(
			"thead",
			null,
			React.createElement(
				"tr",
				null,
				React.createElement(
					"th",
					null,
					"Id"
				),
				React.createElement(
					"th",
					null,
					"Status"
				),
				React.createElement(
					"th",
					null,
					"Owner"
				),
				React.createElement(
					"th",
					null,
					"Created"
				),
				React.createElement(
					"th",
					null,
					"Effort"
				),
				React.createElement(
					"th",
					null,
					"Completion Date"
				),
				React.createElement(
					"th",
					null,
					"Title"
				)
			)
		),
		React.createElement(
			"tbody",
			null,
			issueRows
		)
	);
}

const IssueRow = props => React.createElement(
	"tr",
	null,
	React.createElement(
		"td",
		null,
		props.issue.id
	),
	React.createElement(
		"td",
		null,
		props.issue.status
	),
	React.createElement(
		"td",
		null,
		props.issue.owner
	),
	React.createElement(
		"td",
		null,
		props.issue.created.toDateString()
	),
	React.createElement(
		"td",
		null,
		props.issue.effort ? props.issue.effort : ''
	),
	React.createElement(
		"td",
		null,
		props.issue.completionDate ? props.issue.completionDate.toDateString() : ''
	),
	React.createElement(
		"td",
		null,
		props.issue.title
	)
);

class IssueAdd extends React.Component {
	constructor() {
		super();
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleSubmit(e) {
		e.preventDefault();
		var form = document.forms.issueAdd;
		this.props.createIssue({
			owner: form.owner.value,
			title: form.title.value,
			status: 'New',
			created: new Date()
		});
		// clear the form for the next input
		form.owner.value = "";form.title.value = "";
	}

	render() {
		return React.createElement(
			"div",
			null,
			React.createElement(
				"form",
				{ name: "issueAdd", onSubmit: this.handleSubmit },
				React.createElement("input", { type: "text", name: "owner", placeholder: "Owner" }),
				React.createElement("input", { type: "text", name: "title", placeholder: "Title" }),
				React.createElement(
					"button",
					null,
					"Add"
				)
			)
		);
	}
}

class IssueList extends React.Component {
	constructor() {
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
		fetch('/api/issues').then(response => response.json()).then(data => {
			console.log("Total count of records:", data._metadata.total_count);
			data.records.forEach(issue => {
				issue.created = new Date(issue.created);
				if (issue.completionDate) issue.completionDate = new Date(issue.completionDate);
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
			body: JSON.stringify(newIssue)
		}).then(response => {
			if (response.ok) {
				response.json().then(updatedIssue => {
					updatedIssue.created = new Date(updatedIssue.created);
					if (updatedIssue.completionDate) updatedIssue.completionDate = new Date(updatedIssue.completionDate);
					const newIssues = this.state.issues.concat(updatedIssue);
					this.setState({ issues: newIssues });
				});
			} else {
				response.json().then(error => {
					alert('Fail to add issue: ' + error.message);
				});
			}
		}).catch(err => {
			alert("Error in sending data to server: " + err.message);
		});
	}

	render() {
		return React.createElement(
			"div",
			null,
			React.createElement(
				"h1",
				null,
				"Issue Tracker"
			),
			React.createElement(IssueFilter, null),
			React.createElement("hr", null),
			React.createElement(IssueTable, { issues: this.state.issues }),
			React.createElement("hr", null),
			React.createElement(IssueAdd, { createIssue: this.createIssue })
		);
	}
}

ReactDOM.render(React.createElement(IssueList, null), contentNode);