import { EventAggregator } from "aurelia-event-aggregator";
import { autoinject } from "aurelia-framework";
import { Router } from "aurelia-router";
import { ApiResponse } from "models/apiResponse";
import { UserDetails, UserLogin } from "models/userDetails";
import { Events, Routes } from "utils/constants";
import { Roles } from "utils/enums";
import { log } from "utils/log";

@autoinject
export class AuthenticationService {

	private user: UserDetails;

	constructor(private router: Router, private ea: EventAggregator) {}

	async login(userLogin: UserLogin): Promise<ApiResponse> {
		try {
			this.user = new UserDetails();
			this.user.authenticated = true;
			switch (this.role) {
				case Roles.Admin:
					this.router.navigate("admin-dashboard");
					break;
				case Roles.Student:
					this.router.navigate("dashboard");
					break
				default:
					throw "Invalid login";
			}

			this.ea.publish(Events.Login);
			return new ApiResponse(true, "");
		} catch (error) {
			return new ApiResponse(false, "An error occurred");
		}
	}

	async logout(): Promise<void> {
		try {
			this.user = null;
			this.ea.publish(Events.Logout);
			this.redirectToLogin();
		} catch (error) {
			log.debug(error);
		}
	}

	get authenticated(): boolean {
		return this.user !== null && this.user !== undefined && this.user.authenticated;
	}

	redirectToLogin() {
		this.router.navigateToRoute(Routes.Login);
	}

	get role(): Roles {
		if (this.user == null || this.user == undefined) {
			this.logout();
			this.redirectToLogin();
			return Roles.Unauthenticated;
		}
		
		return this.user.role;
	}
}