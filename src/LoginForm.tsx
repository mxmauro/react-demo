
import React from 'react';
declare module 'reactstrap';
import { Form, Button } from 'reactstrap';

export default class LoginForm extends React.Component<any> {
	constructor(props: any) {
		super(props);
	}

	signin() {

	}

	handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		return false;
	}

	render() {
		return (
			<div className="container">
  				<div className="row">
					<Form className="border border-primary p-5 mx-auto mt-5 col-9 rounded" onSubmit={this.handleSubmit}>
						<p className="h4 mb-4 text-center">Sign in</p>
						<input type="text" name="username" className="form-control mb-4" placeholder="Name" />
						<input type="password" name="password" className="form-control mb-4" placeholder="Password" />

						<div className="d-flex justify-content-between">
							<div>
								<div className="custom-control custom-checkbox">
									<label className="custom-control-label">
										<input type="checkbox" className="custom-control-input" />Remember me
									</label>
								</div>
							</div>
							<div>
								<a href="">Forgot password?</a>
							</div>
						</div>
						<Button onClick={this.signin} color="primary" className="btn-block my-4" type="button">Sign in</Button>
						<div className="text-center">
							<p>Not a member? <a href="">Register</a></p>
						</div>
					</Form>
				</div>
			</div>
		);
	}
}
