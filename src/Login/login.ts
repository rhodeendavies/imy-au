import { ApplicationState } from "applicationState";
import { autoinject } from "aurelia-framework";
import { Redirect, Router } from "aurelia-router";
import { UserDetails } from "models/userDetails";
import { Roles } from "utils/constants";

@autoinject
export class Login {
	constructor (private router: Router, private appState: ApplicationState) {}

	login() {
		this.appState.authenticated = true;
		this.appState.loggedInUser = new UserDetails();
		switch (this.appState.loggedInUser.role) {
			case Roles.Admin:
				this.router.navigate("admin-dashboard");
				break;
			case Roles.Student:
				this.router.navigate("dashboard");
				break
			default:
				new Redirect('login')
				break;
		}
	}
}