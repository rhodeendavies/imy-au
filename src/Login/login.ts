import { autoinject, computedFrom } from "aurelia-framework";
import { ApiResponse } from "models/apiResponse";
import { UserLogin } from "models/userDetails";
import { AuthenticationService } from "services/authenticationService";

@autoinject
export class Login {

	loginModel: UserLogin = new UserLogin();
	response: ApiResponse;

	constructor(private authService: AuthenticationService) { }

	attached() {
		if (this.authService.Authenticated) {
			this.authService.logout();
		}
	}

	async login() {
		try {
			this.response = await this.authService.login(this.loginModel);
		} catch (error) {
			this.response = new ApiResponse(false, "Failed to login");
		}
	}

	@computedFrom("response.result")
	get ShowError(): boolean {
		return this.response != null && !this.response.result;
	}
}