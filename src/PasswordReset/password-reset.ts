import { autoinject, computedFrom } from "aurelia-framework";
import { ApiResponse } from "models/apiResponse";
import { PasswordResetModel, UserLogin } from "models/userDetails";
import { UsersService } from "services/usersService";

@autoinject
export class PasswordReset {
	model: PasswordResetModel = new PasswordResetModel();
	response: ApiResponse;

	constructor(private usersService: UsersService) { }

	async resetPassword() {
		try {
			if (!this.PasswordsMatch) return;
			this.response = await this.usersService.resetPassword(this.model);
		} catch (error) {
			this.response = new ApiResponse(false, "Failed to login");
		}
	}

	@computedFrom("response.result")
	get ShowError(): boolean {
		return this.response != null && !this.response.result;
	}

	@computedFrom("model.newPassword", "model.newPasswordConfirmation")
	get PasswordsMatch(): boolean {
		return this.model?.newPassword == this.model?.newPasswordConfirmation;
	}
}