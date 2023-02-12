import { autoinject, computedFrom } from "aurelia-framework";
import { ApiResponse } from "models/apiResponse";
import { UserLogin } from "models/userDetails";
import { AuthenticationService } from "services/authenticationService";
import environment from '../environment'
import { UsersService } from "services/usersService";
import { Busy } from "resources/busy/busy";
import { Router } from "aurelia-router";
import { AttributionLinks, Routes } from "utils/constants";
import { ComponentHelper } from "utils/componentHelper";
import { LoginScreens } from "utils/enums";
import { ApplicationState } from "applicationState";

@autoinject
export class Login {

	loginModel: UserLogin = new UserLogin();
	response: ApiResponse;
	busy: Busy = new Busy();
	resetPasswordSent: boolean = false;
	studentNumberValid: boolean = true;
	passwordValid: boolean = true;
	onlineEducation: string = AttributionLinks.onlineEducation;

	constructor(
		private authService: AuthenticationService,
		private userService: UsersService,
		private router: Router,
		private appState: ApplicationState
	) { }

	async attached() {
		this.appState.loginScreenType = LoginScreens.login;
		await this.authService.Authenticated();
		this.loginModel = environment.loginModel;
	}

	async login() {
		try {
			this.busy.on();
			this.studentNumberValid = !ComponentHelper.NullOrEmpty(this.loginModel.studentNumber);
			this.passwordValid = !ComponentHelper.NullOrEmpty(this.loginModel.password);
			if (!this.studentNumberValid || !this.passwordValid) return;

			this.response = await this.authService.login(this.loginModel);
		} catch (error) {
			this.response = new ApiResponse(false, "Failed to login");
		} finally {
			this.busy.off();
		}
	}

	async resetPassword() {
		try {
			this.busy.on();
			this.studentNumberValid = !ComponentHelper.NullOrEmpty(this.loginModel.studentNumber);
			if (!this.studentNumberValid) return;

			this.response = await this.userService.sendPasswordResetEmail(this.loginModel.studentNumber);
			this.resetPasswordSent = this.response != null && this.response.result;
		} catch (error) {
			this.response = new ApiResponse(false, "Failed to reset password");
		} finally {
			this.busy.off();
		}
	}

	showLogin() {
		this.studentNumberValid = true;
		this.passwordValid = true;
		this.response = null;
		this.appState.loginScreenType = LoginScreens.login;
	}

	navigateToRegister() {
		this.router.navigate(Routes.Register)
	}

	showForgotPassword() {
		this.studentNumberValid = true;
		this.passwordValid = true;
		this.response = null;
		this.appState.loginScreenType = LoginScreens.forgotPassword;
	}

	navigateToAttribution() {
		window.open(this.onlineEducation, "_blank");
	}

	@computedFrom("response.result")
	get ShowError(): boolean {
		return this.response != null && !this.response.result;
	}

	@computedFrom("appState.loginScreenType", "busy.Active")
	get ShowLogin(): boolean {
		return this.appState.loginScreenType == LoginScreens.login && !this.busy.Active;
	}

	@computedFrom("appState.loginScreenType", "busy.Active")
	get ShowForgotPassword(): boolean {
		return this.appState.loginScreenType == LoginScreens.forgotPassword && !this.busy.Active;
	}
}