import { autoinject } from "aurelia-dependency-injection";
import { Router } from "aurelia-router";
import { AuthenticationService } from "services/authenticationService";
import { AttributionLinks, Routes } from "utils/constants";
import { Roles } from "utils/enums";

@autoinject
export class ErrorPage {

	authenticated: boolean;
	student: boolean;
	human: string = AttributionLinks.human;

	constructor(private authService: AuthenticationService, private router: Router) {}

	async attached() {
		this.authenticated = await this.authService.Authenticated();
		if (this.authenticated) {
			this.student = (await this.authService.Role()) == Roles.Student;
		}
	}

	home() {
		this.router.navigate(Routes.Dashboard);
	}

	logout() {
		this.authService.logout();
	}

	login() {
		this.router.navigate(Routes.Login);
	}

	navigateToAttribution() {
		window.open(this.human, "_blank");
	}
}