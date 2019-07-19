import React from 'react';
import { Link, withRouter } from 'react-router-dom';

class IssueFilter extends React.Component {
    constructor() {
        super();
        this.clearFilter = this.clearFilter.bind(this);
        this.setFilterOpen = this.setFilterOpen.bind(this);
        this.setFilterAssigned = this.setFilterAssigned.bind(this);
    };

    setFilterOpen(e) {
        e.preventDefault();
        this.props.setFilter({ status: 'Open' });
    };
    
    setFilterAssigned(e) {
        e.preventDefault();
        this.props.setFilter({ status: 'Assigned' });
    };

    clearFilter(e) {
        e.preventDefault();
        this.props.setFilter({});
    };

	render() {
        const Separator = () => <span> | </span>;
		return(
			<div>
                <a href="#" onClick={this.clearFilter}>All Issue</a>
                <Separator />
                <a href="#" onClick={this.setFilterOpen}>
                    Open Issues
                </a>
                <Separator />
                <a href="#" onClick={this.setFilterAssigned}>
                    Assigned Issues
                </a>
            </div>
		);
	}
}
export default withRouter(IssueFilter);
