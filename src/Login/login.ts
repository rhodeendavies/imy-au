import { autoinject, computedFrom } from "aurelia-framework";
import { ApiResponse } from "models/apiResponse";
import { UserLogin, UserRegister } from "models/userDetails";
import { AuthenticationService } from "services/authenticationService";
import environment from '../environment'
import { UsersService } from "services/usersService";
import { Busy } from "resources/busy/busy";

@autoinject
export class Login {

	loginModel: UserLogin = new UserLogin();
	registerModel: UserRegister = new UserRegister();
	studentNumber: string;
	response: ApiResponse;
	busy: Busy = new Busy();
	screenType: LoginScreens = LoginScreens.login;

	constructor(private authService: AuthenticationService, private userService: UsersService) { }

	async attached() {
		this.screenType = LoginScreens.login;
		await this.authService.Authenticated();
		this.loginModel = environment.loginModel;
	}

	async login() {
		try {
			this.busy.on();
			this.response = await this.authService.login(this.loginModel);
		} catch (error) {
			this.response = new ApiResponse(false, "Failed to login");
		} finally {
			this.busy.off();
		}
	}

	async register() {
		try {
			this.busy.on();
			this.response = await this.userService.activate(this.registerModel);
		} catch (error) {
			this.response = new ApiResponse(false, "Failed to register");
		} finally {
			this.busy.off();
		}
	}

	async resetPassword() {
		try {
			this.busy.on();
			this.response = await this.userService.sendPasswordResetEmail(this.studentNumber);
		} catch (error) {
			this.response = new ApiResponse(false, "Failed to reset password");
		} finally {
			this.busy.off();
		}
	}

	showRegister() {
		this.screenType = LoginScreens.register;
	}

	showLogin() {
		this.screenType = LoginScreens.login;
	}

	showForgotPassword() {
		this.screenType = LoginScreens.forgotPassword;
	}

	@computedFrom("response.result")
	get ShowError(): boolean {
		return this.response != null && !this.response.result;
	}

	@computedFrom("screenType", "busy.Active")
	get ShowLogin(): boolean {
		return this.screenType == LoginScreens.login && !this.busy.Active;
	}

	@computedFrom("screenType", "busy.Active")
	get ShowRegistration(): boolean {
		return this.screenType == LoginScreens.register && !this.busy.Active;
	}

	@computedFrom("screenType", "busy.Active")
	get ShowForgotPassword(): boolean {
		return this.screenType == LoginScreens.forgotPassword && !this.busy.Active;
	}
}

enum LoginScreens {
	login,
	register,
	forgotPassword
}