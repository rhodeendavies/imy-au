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

	async sendPasswordResetEmail(studentNumber: string): Promise<ApiResponse> {
		try {
			return await this.api.post("users/send_password_reset_email", {
				studentNumber: studentNumber
			}, true, false);
		} catch (error) {
			if (error instanceof Response) {
				switch (error.status) {
					case StatusCodes.NotFound:
						return new ApiResponse(false, "Account does not exist");
					default:
						return new ApiResponse(false, "An error occurred");
				}
			} else {
				return new ApiResponse(false, "An error occurred");
			}
		}
	}

	async resetPassword(model: PasswordResetModel): Promise<ApiResponse> {
		try {
			return await this.api.post("users/reset_password", model, true, false);
		} catch (error) {
			if (error instanceof Response) {
				switch (error.status) {
					case StatusCodes.InternalServerError:
						return new ApiResponse(false, "Reset link not valid");
					default:
						return new ApiResponse(false, "An error occurred");
				}
			} else {
				return new ApiResponse(false, "An error occurred");
			}
		}
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