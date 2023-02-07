import { autoinject } from "aurelia-framework";
import { NavigationInstruction, Next, Redirect } from "aurelia-router";
import { Routes } from "utils/constants";
import { Roles } from "utils/enums";
import { log } from "utils/log";
import { AuthenticationService } from "./authenticationService";

@autoinject
export class AuthorizeStep {
	constructor(private authService: AuthenticationService) { }

	async run(navigationInstruction: NavigationInstruction, next: Next) {
		log.debug("navigating...");
		if (!(await this.validateRoute(navigationInstruction))) {
			log.debug(`not authorized; redirecting`);
			return next.cancel(new Redirect(this.authService.homeRoute));
		}
		return next();
	}

	async validateRoute(navigationInstruction: NavigationInstruction): Promise<boolean> {
		const routeRole = navigationInstruction.getAllInstructions().some(x => x.config.settings.roles.includes(this.authService.Role));
		const requiresAuthentication = navigationInstruction.getAllInstructions().some(x => x.config.settings.authenticated);
		const authenticated = await this.authService.Authenticated();
		return !requiresAuthentication || (authenticated && routeRole); 
	}
}