import { autoinject } from "aurelia-framework";
import { NavigationInstruction, Next, Redirect } from "aurelia-router";
import { Routes } from "utils/constants";
import { Roles } from "utils/enums";
import { log } from "utils/log";
import { AuthenticationService } from "./authenticationService";

@autoinject
export class AuthorizeStep {
	constructor(private authService: AuthenticationService) {}

	async run(navigationInstruction: NavigationInstruction, next: Next) {
		log.debug("navigating...");
		
		const roles = [Roles.Admin, Roles.Student];
		const rolesLength = roles.length;

		for (let i = 0; i < rolesLength; i++) {
			const x = roles[i];
			if (!(await this.validateRoute(navigationInstruction, x))) {
				log.debug(`not authorized; redirecting`);
				return next.cancel(new Redirect(Routes.Login));
			}
		}

		log.debug("navigation successful");
		return next();
	}

	async validateRoute(navigationInstruction: NavigationInstruction, role: Roles): Promise<boolean> {
		const routeRole = navigationInstruction.getAllInstructions().some(x => x.config.settings.roles.includes(role));
		const requiresAuthentication = navigationInstruction.getAllInstructions().some(x => x.config.settings.authenticated);
		const authenticated = await this.authService.Authenticated();
		return (!routeRole || this.authService.Role == role) && (!requiresAuthentication || authenticated)
	}
}