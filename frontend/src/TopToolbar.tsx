import React from 'react';
declare module 'reactstrap';
import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

type TopToolbarState = {
	isOpen: boolean
};
export default class TopToolbar extends React.Component<any, TopToolbarState> {
	constructor(props: any) {
		super(props);
	
		this.toggle = this.toggle.bind(this);
		this.state = {
			isOpen: false
		};
	}

	toggle() {
		this.setState({
			isOpen: !this.state.isOpen
		});
	}

	updateDimensions() {
		if (window.innerWidth >= 992 && this.state.isOpen) {
			this.setState({
				isOpen: false
			});
		}
	}

	componentDidMount() {
		this.updateDimensions();
		window.addEventListener("resize", this.updateDimensions.bind(this));
	}

	componentWillUnmount() {
		window.removeEventListener("resize", this.updateDimensions.bind(this));
	}

	render() {
		return (
			<Navbar className="navbar navbar-inverse bg-primary navbar-dark" expand="lg">
				<NavbarBrand href="/">React Demo</NavbarBrand>
				<NavbarToggler onClick={this.toggle}>
					<FontAwesomeIcon style={{color: 'white'}} icon="bars" />
				</NavbarToggler>
				<Collapse isOpen={this.state.isOpen} navbar>
					<Nav className="ml-0 mr-auto" navbar>
						<NavItem>
							<NavLink href="/#/page1">Page 1</NavLink>
						</NavItem>
						<NavItem>
							<NavLink href="/#/page2">Page 2</NavLink>
						</NavItem>
					</Nav>
				</Collapse>
			</Navbar>
		);
	}
}
