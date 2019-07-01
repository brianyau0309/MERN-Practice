const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(express.static('static'));
app.use(bodyParser.json());

const issues = [
	{
		id: 1,status: "Open", owner: 'Raven',
		created: new Date('2019-08-15'), effort: 5, 
		completionDate: undefined,
		title: 'Error in console when clicking Add',
	},
	{
		id: 2,status: "Assigned", owner: 'Eddie',
		created: new Date('2019-09-16'), effort: 5,
		completionDate: new Date('2019-09-30'),
		title: 'Missing bottom border on panel',
	},
];

const validIssueStatus = {
	New: true,
	Open: true,
	Assigned: true,
	Fixed: true,
	Verified: true,
	Close: true,
};
const issueFieldType = {
	id: 'required',
	status: 'required',
	owner: 'required',
	effort: 'optional',
	created: 'required',
	completionDate: 'optional',
	title: 'required',
};
function validateIssue(issue) {
	for (const field in issueFieldType) {
		const type = issueFieldType[field];
		if (!type) {
			delete issue[field];
		} else if (type === 'required' && !issue[field]) {
			return `${field} is required.`;
		}
	}
	if (!validIssueStatus[issue.status])
		return `${issue.status} is not a valid status.`;
	return null 
};

app.all('/api/issues', (req,res) => {
	if (req.method == "POST") {
		const newIssue = req.body;
		console.log('Post', newIssue);
		newIssue.id = issues.length + 1;
		newIssue.created = new Date();
		if (!newIssue.status) { 
			newIssue.status = "New";
		}	
		const err = validateIssue(newIssue);
		if (err) {
			res.status(422).json({ message: `Invalid request: ${err}` });
			return;
		}
		
		issues.push(newIssue);
	}

	if (req.method == "GET") 
		console.log('GET');
	
	const metadata = { total_count: issues.length };
	res.json({ _metadata: metadata,records: issues });
});

app.listen(3000, () => {
	console.log('App started on http://localhost:3000');
});
