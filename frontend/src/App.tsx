import React from 'react';
import './declare_modules.d.ts';

import { Redirect, Route, withRouter, generatePath } from 'react-router-dom';
import ReactNotification from "react-notifications-component";
import { library } from '@fortawesome/fontawesome-svg-core';
import { faBars } from '@fortawesome/free-solid-svg-icons';
library.add(faBars);

import TopToolbar from './TopToolbar';
import LoginForm from './LoginForm';
import Page1 from './Page1';
import Page2 from './Page2';

import './App.css';
import "react-notifications-component/dist/theme.css";

import appAuth from './Auth';

type AppState = {
	loggedUserId: number
};
class App extends React.Component<any, AppState> {
	notificationDOMRef: React.RefObject<{
		addNotification(params: {}) : void;
	}>;

	constructor(props: any) {
		super(props);

		window.showNotification = this.showNotification.bind(this);
		this.notificationDOMRef = React.createRef();

		this.state = {
			loggedUserId: -1
		};
	}
	
	showNotification(_title: string, _message: string, _type: string) {
		if (this.notificationDOMRef.current) {
			this.notificationDOMRef.current.addNotification({
				title: _title,
				message: _message,
				type: _type,
				insert: "top",
				container: "top-right",
				animationIn: ["animated", "fadeIn"],
				animationOut: ["animated", "fadeOut"],
				dismiss: { duration: 2000 },
				dismissable: { click: true }
			});
		}
	}

	renderPage() {
		if (this.state.loggedUserId < 0) {
			if (location.hash != "#/login") {
				return (
					<Redirect to="/login" />
				);
			}
			return (
				<LoginForm />
			);
		}
		return (
			<div>
				<TopToolbar />
				<div className="content">
					<Route exact path="/" component={Page1}/>
					<Route path="/page1" component={Page1}/>
					<Route path="/page2" component={Page2}/>
				</div>
			</div>
		);
	}

	render() {
		return (
			<div className="App">
				<ReactNotification ref={this.notificationDOMRef} />
				{ this.renderPage() }
			</div>
		);
	}
}

const AppWithRouter = withRouter(App);

export default AppWithRouter;
