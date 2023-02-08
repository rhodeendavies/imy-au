import { ApiWrapper } from "api";
import { autoinject } from "aurelia-framework";
import { ApiResponse } from "models/apiResponse";
import { PasswordResetModel, UserDetails, UserLogin } from "models/userDetails";
import { log } from "utils/log";

@autoinject
export class UsersService {

	constructor(private api: ApiWrapper) { }

	async login(userLogin: UserLogin): Promise<UserDetails> {
		try {
			return await this.api.post("users/login", userLogin, true, false);
		} catch (error) {
			log.error(error);
			return null;
		}
	}

	async logout(): Promise<void> {
		try {
			return await this.api.post(`users/logout`, {}, false);
		} catch (error) {
			log.error(error);
			return null;
		}
	}

	async authenticate(): Promise<UserDetails> {
		try {
			return await this.api.get("users/current", false);
		} catch (error) {
			log.error(error);
			const unAuth = new UserDetails();
			unAuth.activated = false;
			return unAuth;
		}
	}

	async resetPassword(model: PasswordResetModel): Promise<ApiResponse> {
		try {
			return await this.api.post("users/reset_password", model, true, false);
		} catch (error) {
			log.error(error);
			return new ApiResponse(false, "An error occurred");
		}
	}
}