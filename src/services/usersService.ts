import { ApiWrapper } from "api";
import { autoinject } from "aurelia-framework";
import { UserDetails, UserLogin } from "models/userDetails";
import { log } from "utils/log";

@autoinject
export class UsersService {

	constructor(private api: ApiWrapper) { }

	async login(userLogin: UserLogin): Promise<UserDetails> {
		try {
			return await this.api.post("users/login", userLogin);
		} catch (error) {
			log.error(error);
			return null;
		}
	}

	async logout(userId: number): Promise<void> {
		try {
			return await this.api.post(`users/${userId}/logout`, {});
		} catch (error) {
			log.error(error);
			return null;
		}
	}

	async authenticate(): Promise<UserDetails> {
		try {
			return await this.api.get("users/current");
		} catch (error) {
			log.error(error);
			return null;
		}
	}
}