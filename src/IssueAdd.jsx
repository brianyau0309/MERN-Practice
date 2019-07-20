import React from 'react';

export default class IssueAdd extends React.Component {
	constructor() {
		super();
		this.handleSubmit = this.handleSubmit.bind(this);
        this.update = this.update.bind(this);
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

    update(e) {
        e.preventDefault();
        var form = document.forms.update;
        this.fupdate({
            title: form.title.value,
            owner: 'IamIronMan',
        });
    }

    fupdate(issue) {
        fetch('/api/issue/5d332e0ba76d447ad51ca6f4', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(issue),   
        }).then(res => 
            res.json()
        ).catch(err => {
            alert('Error: ', err.message)
        });
    }
	
	render() {
		return(
			<div>
				<form name="issueAdd" onSubmit={this.handleSubmit}>
				<input type="text" name="owner" placeholder="Owner" />
				<input type="text" name="title" placeholder="Title" />
				<button>Add</button>
				</form>

				<form name="update" onSubmit={this.update}>
                    Title: <input type="text" name="title" placeholder="Title" />
                    <button type='submit'>Update</button>
				</form>
			</div>	
		);
	}
}
