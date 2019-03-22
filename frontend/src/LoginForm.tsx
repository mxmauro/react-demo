import React from 'react';
import './declare_modules.d.ts';

import { Container, Col, Form, FormGroup, Button, Label, Input } from 'reactstrap';
import BlockUi from 'react-block-ui';
import 'react-block-ui/style.css';
import { Globals } from './globals';
import jsSHA from 'jssha';

type LoginFormState = {
	name: string,
	password: string,
	loading: boolean
	validate: {
		name: string,
		password: string
	}
};
export default class LoginForm extends React.Component<any, LoginFormState> {
	disposed: boolean;

	constructor(props : any) {
		super(props);
		this.disposed = false;
		this.state = {
			name: '',
			password: '',
			loading: false,
			validate: {
				name: '',
				password: ''
			}
		};
	}

	componentWillUnmount() {
		this.disposed = true;
	}

	handleNameChange(e : any) {
		const { validate } = this.state;
		this.setState({
			name: e.target.value
		});
		validate.name = '';
		this.setState({ validate });
	}

	handlePasswordChange(e : any) {
		const { validate } = this.state;
		this.setState({
			password: e.target.value
		});
		validate.password = '';
		this.setState({ validate });
	}

	async handleSubmit(e : any) {
		e.preventDefault();
		e.stopPropagation();

		let form_data = {
			name: this.state.name.trim(),
			password: this.state.password.trim()
		}

		const { validate } = this.state;
		let formIsInvalid = false;

		if (form_data.name.length > 0) {
			validate.name = 'has-success';
		}
		else {
			validate.name = 'has-danger';
			formIsInvalid = true;
		}

		if (form_data.password.length > 0) {
			validate.password = 'has-success';
		}
		else {
			validate.password = 'has-danger';
			formIsInvalid = true;
		}
		this.setState({ validate });
		if (formIsInvalid) {
			return;
		}

		let shaObj = new jsSHA("SHA-256", "TEXT");
		shaObj.update(form_data.password);
		form_data.password = shaObj.getHash("HEX").toUpperCase();

		this.setState({
			loading: true
		});

		try {
			let res = await fetch(Globals.REST_API_URL + '/users/login', {
				method: 'POST',
				headers: new Headers({
					"Content-Type": "application/json"
				}),
				//mode: 'cors',
				redirect: 'follow',
				credentials: 'same-origin',
				body: JSON.stringify(form_data)
			});
			if (!this.disposed) {
				if (res.status != 200) {
					this.setState({
						loading: false
					});
					window.showNotification('Unable to sign in', 'shit', 'danger');
					return;
				}
				let json = await res.json();

				this.setState({
					loading: false
				});
			}
		}
		catch (err) {
			console.log(err);
			if (!this.disposed) {
				this.setState({
					loading: false
				});
				window.showNotification('Unable to sign in', 'shit', 'danger');
			}
		}
	}

	render() {
		return (
			<div className="container">
  				<div className="row">
					<Form className="border border-primary p-5 mx-auto mt-5 col-9 rounded needs-validation" noValidate onSubmit={this.handleSubmit.bind(this)}>
					<BlockUi tag="div" className="text-primary" blocking={this.state.loading}>
						<p className="h4 mb-4 text-center">Sign in</p>
						<div className="form-row">
    						<div className="col-12">
								<Label>Name:</Label>
								<Input type="text" name="name" value={this.state.name}
									onChange={this.handleNameChange.bind(this)}
									valid={this.state.validate.name === 'has-success'}
									invalid={this.state.validate.name === 'has-danger'}
									className="form-control mb-4" placeholder="Please enter your name." required />
							</div>
						</div>
						<div className="form-row">
    						<div className="col-12">
								<Label>Password:</Label>
								<Input type="password" name="password" value={this.state.password}
									onChange={this.handlePasswordChange.bind(this)}
									valid={this.state.validate.password === 'has-success'}
									invalid={this.state.validate.password === 'has-danger'}
									className="form-control mb-4" placeholder="Please enter your password." required />
							</div>
						</div>
						<div className="d-flex justify-content-between">
							<div>
								<div className="custom-control custom-checkbox">
									<Label className="custom-control-label">
										<Input type="checkbox" className="custom-control-input" />Remember me
									</Label>
								</div>
							</div>
							<div>
								<a href="">Forgot password?</a>
							</div>
						</div>
						<Button color="primary" className="btn-block my-4" type="submit">Sign in</Button>
						<div className="text-center">
							<p>Not a member? <a href="">Register</a></p>
						</div>
					</BlockUi>
					</Form>
				</div>
			</div>
		);
	}
}
