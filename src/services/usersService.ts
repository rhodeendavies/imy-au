import { ApiWrapper } from "api";
import { autoinject } from "aurelia-framework";
import { ApiResponse } from "models/apiResponse";
import { PasswordResetModel, UserDetails, UserLogin, UserRegister } from "models/userDetails";
import { StatusCodes } from "utils/constants";

@autoinject
export class UsersService {

	constructor(private api: ApiWrapper) { }

	async login(userLogin: UserLogin): Promise<UserDetails> {
		try {
			return await this.api.post("users/login", userLogin, true, false);
		} catch (error) {
			if (error instanceof Response) {
				throw error;
			} else {
				return null;
			}
		}
	}

	async logout(): Promise<void> {
		try {
			return await this.api.post(`users/logout`, {}, false);
		} catch (error) {
			return null;
		}
	}

	async authenticate(): Promise<UserDetails> {
		try {
			return await this.api.get("users/current", false);
		} catch (error) {
			const unAuth = new UserDetails();
			unAuth.activated = false;
			return unAuth;
		}
	}

	async sendPasswordResetEmail(studentNumber: string): Promise<boolean> {
		return await this.api.post("users/send_password_reset_email", {
			studentNumber: studentNumber
		}, false, false) != null;
	}

	async resetPassword(model: PasswordResetModel): Promise<boolean> {
		return await this.api.post("users/reset_password", model, false, false) != null;
	}

	async activate(model: UserRegister): Promise<UserDetails> {
		try {
			return await this.api.post("users/activate", model, true, false);
		} catch (error) {
			if (error instanceof Response) {
				throw error;
			} else {
				return null;
			}
		}
	}
}