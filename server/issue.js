'use strict'

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
	for (var field in issueFieldType) {
		var type = issueFieldType[field];
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

module.exports = {
	validateIssue: validateIssue
};
