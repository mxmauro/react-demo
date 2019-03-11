import React from 'react';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faBars } from '@fortawesome/free-solid-svg-icons';
library.add(faBars);

declare module 'react-router-dom';
import { HashRouter, Route } from 'react-router-dom';

import TopToolbar from './TopToolbar';
import Page1 from './Page1';
import Page2 from './Page2';
import './App.css';

class App extends React.Component {
	render() {
		return (
			<div className="App">
				<TopToolbar />
				<HashRouter>
					<div className="content">
						<Route exact path="/" component={Page1}/>
						<Route path="/page1" component={Page1}/>
						<Route path="/page2" component={Page2}/>
					</div>
				</HashRouter>
			</div>
		);
	}
}

export default App;
