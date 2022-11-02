import { ApplicationState } from "applicationState";
import { EventAggregator } from "aurelia-event-aggregator";
import { autoinject, computedFrom } from "aurelia-framework";
import { Router } from "aurelia-router";
import { ApiResponse } from "models/apiResponse";
import { UserDetails, UserLogin } from "models/userDetails";
import { Busy } from "resources/busy/busy";
import { ComponentHelper } from "utils/componentHelper";
import { Events, Routes } from "utils/constants";
import { Roles, Systems } from "utils/enums";
import { log } from "utils/log";

@autoinject
export class AuthenticationService {

	busy: Busy = new Busy();
	private user: UserDetails;

	constructor(private router: Router, private appState: ApplicationState, private ea: EventAggregator) { }

	async login(userLogin: UserLogin): Promise<ApiResponse> {
		try {
			this.busy.on();

			// DEMO
			await ComponentHelper.Sleep(100);
			this.user = new UserDetails();
			this.user.authenticated = true;
			this.user.course = "IMY 110";
			// END OF DATA

			switch (this.Role) {
				case Roles.Admin:
					this.router.navigate(Routes.AdminDash);
					break;
				case Roles.Student:
					this.router.navigate(Routes.Dashboard);
					// this.router.navigate(`${Routes.Dashboard}/${Routes.ModuleContent}/8`);
					break
				default:
					throw "Invalid login";
			}

			this.ea.publish(Events.Login);
			this.appState.determineReflectionToShow();
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

			// DEMO
			await ComponentHelper.Sleep(100);
			// END OF DATA

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

	get System(): Systems {
		return this.user !== null && this.user !== undefined && this.user.system;
	}

	get Course(): string {
		return this.user !== null && this.user !== undefined && this.user.course;
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