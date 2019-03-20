import React from 'react';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faBars } from '@fortawesome/free-solid-svg-icons';
library.add(faBars);

declare module 'react-router-dom';
import { Redirect, Route, withRouter, generatePath } from 'react-router-dom';

import TopToolbar from './TopToolbar';
import LoginForm from './LoginForm';
import Page1 from './Page1';
import Page2 from './Page2';
import './App.css';
import appAuth from './Auth';

type AppState = {
	loggedUserId: number
};
class App extends React.Component<any, AppState> {
	constructor(props: any) {
		super(props);

		this.state = {
			loggedUserId: -1
		};
	}
	
	render() {
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
			<div className="App">
				<TopToolbar />
				<div className="content">
					<Route exact path="/" component={Page1}/>
					<Route path="/page1" component={Page1}/>
					<Route path="/page2" component={Page2}/>
				</div>
			</div>
		);
	}
}

const AppWithRouter = withRouter(App);

export default AppWithRouter;
