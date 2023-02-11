import { autoinject, computedFrom } from "aurelia-framework";
import { Router } from "aurelia-router";
import { ApiResponse } from "models/apiResponse";
import { PasswordRequirements, PasswordResetModel, UserLogin } from "models/userDetails";
import { Busy } from "resources/busy/busy";
import { UsersService } from "services/usersService";
import { ComponentHelper } from "utils/componentHelper";
import { AttributionLinks, Routes } from "utils/constants";
import { log } from "utils/log";

@autoinject
export class PasswordReset {
	model: PasswordResetModel = new PasswordResetModel();
	response: ApiResponse;
	resetToken: string;
	passwordsMatch: boolean = true;
	passwordValid: boolean = true;
	busy: Busy = new Busy();
	success: boolean = false;
	onlineEducation: string = AttributionLinks.onlineEducation;

	constructor(private usersService: UsersService, private router: Router) { }

	activate(params, routeConfig, navigationInstruction) {
		this.resetToken = params.resetToken
	}

	async resetPassword() {
		try {
			this.busy.on();
			this.passwordValid = this.PasswordRequirements.isValid();
			if (!this.passwordValid) return;

			this.passwordsMatch = this.model.newPassword == this.model.newPasswordConfirmation;
			if (!this.passwordsMatch) return;

			this.model.resetToken = this.resetToken;
			this.response = await this.usersService.resetPassword(this.model);
			this.success = this.response != null && this.response.result;
		} catch (error) {
			log.error(error);
			this.response = new ApiResponse(false, "Failed to login");
		} finally {
			this.busy.off();
		}
	}

	login() {
		this.router.navigate(Routes.Login);
	}

	navigateToAttribution() {
		window.open(this.onlineEducation, "_blank");
	}

	@computedFrom("response.result")
	get ShowError(): boolean {
		return this.response != null && !this.response.result;
	}

	@computedFrom("model.newPassword")
	get PasswordRequirements(): PasswordRequirements {
		if (this.model == null || this.model.newPassword == null) return null;
		return ComponentHelper.PasswordValid(this.model.newPassword);
	}
}