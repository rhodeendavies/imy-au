import { autoinject, computedFrom } from "aurelia-framework";
import { ApiResponse } from "models/apiResponse";
import { PasswordRequirements, UserRegister } from "models/userDetails";
import { AuthenticationService } from "services/authenticationService";
import { UsersService } from "services/usersService";
import { Busy } from "resources/busy/busy";
import { Router } from "aurelia-router";
import { AttributionLinks, Routes } from "utils/constants";
import { ComponentHelper } from "utils/componentHelper";
import { log } from "utils/log";

@autoinject
export class Register {

	registerModel: UserRegister = new UserRegister();
	response: ApiResponse;
	busy: Busy = new Busy();
	passwordsMatch: boolean = true;
	passwordValid: boolean = true;
	studentNumberValid: boolean = true;
	registerSuccess: boolean = false;
	onlineEducation: string = AttributionLinks.onlineEducation;

	constructor(
		private authService: AuthenticationService,
		private userService: UsersService,
		private router: Router
	) { }

	async attached() {
		await this.authService.Authenticated();
	}

	async register() {
		try {
			this.busy.on();
			this.passwordsMatch = true;

			this.studentNumberValid = !ComponentHelper.NullOrEmpty(this.registerModel.studentNumber);
			this.passwordValid = this.PasswordRequirements.isValid();
			if (!this.studentNumberValid || !this.passwordValid) return;

			this.passwordsMatch = this.registerModel.password == this.registerModel.passwordConfirmation;
			if (!this.passwordsMatch) return;

			this.response = await this.userService.activate(this.registerModel);
			this.registerSuccess = this.response != null && this.response.result;
			
			this.authService.Authenticated();
		} catch (error) {
			log.error(error);
			this.response = new ApiResponse(false, "Failed to register");
		} finally {
			this.busy.off();
		}
	}

	navigateToLogin() {
		this.router.navigate(Routes.Login);
	}

	navigateToAttribution() {
		window.open(this.onlineEducation, "_blank");
	}

	@computedFrom("response.result")
	get ShowError(): boolean {
		return this.response != null && !this.response.result;
	}

	@computedFrom("registerModel.password")
	get PasswordRequirements(): PasswordRequirements {
		return ComponentHelper.PasswordValid(this.registerModel.password);
	}
}