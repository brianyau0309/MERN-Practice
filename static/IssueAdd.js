export default class IssueAdd extends React.Component {
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