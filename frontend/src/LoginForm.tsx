import React from 'react';
declare module 'reactstrap';
import { Form, Button } from 'reactstrap';
//declare module 'react-block-ui';
import BlockUi from 'react-block-ui';
import 'react-block-ui/style.css';

type LoginFormState = {
	loading: boolean
};
export default class LoginForm extends React.Component<any, LoginFormState> {
	constructor(props: any) {
		super(props);
		this.state = {
			loading: false
		};
	}

	private handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
		event.preventDefault();

		this.setState({
			loading: true
		});
		try {
			let res = await fetch(global.REST_API_URL + '/users/login', {
				method: 'post',
				headers: { 'Content-Type':'application/json' },
				body: {
					"username": '12345',
					"password": '12345'
				}
			});
			res = res.json();

			this.setState({
				loading: false
			});
		}
		catch (err) {
			this.setState({
				loading: false
			});
		}
	}

	render() {
		return (
			<div className="container">
  				<div className="row">
					<BlockUi tag="div" className="text-primary" blocking={this.state.loading}>
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
					</BlockUi>
				</div>
			</div>
		);
	}
}
