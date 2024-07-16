import { autoinject, computedFrom } from "aurelia-framework";
import { ApiResponse } from "models/apiResponse";
import { PasswordRequirements, UserRegister } from "models/userDetails";
import { AuthenticationService } from "services/authenticationService";
import { UsersService } from "services/usersService";
import { Busy } from "resources/busy/busy";
import { Router } from "aurelia-router";
import { AttributionLinks, Routes, StatusCodes } from "utils/constants";
import { ComponentHelper } from "utils/componentHelper";
import { log } from "utils/log";
import { ApplicationState } from "applicationState";
import { LoginScreens } from "utils/enums";

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
		private router: Router,
		private appState: ApplicationState
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

			const user = await this.userService.activate({
				studentNumber: ComponentHelper.PrependStudentNumber(this.registerModel.studentNumber),
				password: this.registerModel.password,
				passwordConfirmation: this.registerModel.passwordConfirmation
			});
			this.registerSuccess = user != null && user.activated;
			if (!this.registerSuccess) {
				this.response = new ApiResponse(false, "An error occurred");
				return;
			}

			this.authService.Authenticated(true);
		} catch (error) {
			log.error(error);
			if (error instanceof Response) {
				switch (error.status) {
					case StatusCodes.Unauthorized:
						this.response = new ApiResponse(false, "Incorrect password");
						break;
					case StatusCodes.InternalServerError:
						this.response = new ApiResponse(false, "Invalid student number");
						break;
					default:
						this.response = new ApiResponse(false, "An error occurred");
						break;
				}
			} else {
				this.response = new ApiResponse(false, "An error occurred");
			}
		} finally {
			this.busy.off();
		}
	}

	navigateToLogin() {
		this.appState.loginScreenType = LoginScreens.login;
		this.router.navigate(Routes.Login);
	}

	navigateToForgotPassword() {
		this.appState.loginScreenType = LoginScreens.forgotPassword;
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