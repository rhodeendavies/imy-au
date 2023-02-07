import { autoinject } from "aurelia-dependency-injection";
import { AuthenticationService } from "services/authenticationService";

@autoinject
export class AdminDashboard {

	constructor(private authService: AuthenticationService) {}

	logout() {
		this.authService.logout();
	}
}