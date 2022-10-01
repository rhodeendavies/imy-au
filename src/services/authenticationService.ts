import { EventAggregator } from "aurelia-event-aggregator";
import { autoinject, computedFrom } from "aurelia-framework";
import { Router } from "aurelia-router";
import { ApiResponse } from "models/apiResponse";
import { UserDetails, UserLogin } from "models/userDetails";
import { Busy } from "resources/busy/busy";
import { ComponentHelper } from "utils/componentHelper";
import { Events, Routes } from "utils/constants";
import { Roles } from "utils/enums";
import { log } from "utils/log";

@autoinject
export class AuthenticationService {

	busy: Busy = new Busy();
	private user: UserDetails;

	constructor(private router: Router, private ea: EventAggregator) {}

	async login(userLogin: UserLogin): Promise<ApiResponse> {
		try {
			this.busy.on();

			await ComponentHelper.Sleep(100);

			this.user = new UserDetails();
			this.user.authenticated = true;
			switch (this.Role) {
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
		} finally {
			this.busy.off();
		}
	}

	async logout(): Promise<void> {
		try {
			this.busy.on();

			await ComponentHelper.Sleep(100);

			this.user = null;
			this.ea.publish(Events.Logout);
			this.redirectToLogin();
		} catch (error) {
			log.debug(error);
		} finally {
			this.busy.off();
		}
	}

	get Authenticated(): boolean {
		return this.user !== null && this.user !== undefined && this.user.authenticated;
	}

	@computedFrom("busy.Active")
	get Busy(): boolean {
		return this.busy.Active;
	}

	redirectToLogin() {
		this.router.navigateToRoute(Routes.Login);
	}

	get Role(): Roles {
		if (this.user == null || this.user == undefined) {
			this.logout();
			this.redirectToLogin();
			return Roles.Unauthenticated;
		}
		
		return this.user.role;
	}
}