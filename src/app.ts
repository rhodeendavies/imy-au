import { RouteManager } from './routes/routeManager';
import { Router, RouterConfiguration, Redirect, NavigationInstruction, Next } from 'aurelia-router';
import { log } from 'utils/log';
import { autoinject } from 'aurelia-framework';
import { AuthenticationService } from 'services/authenticationService';
import { Roles } from 'utils/enums';
import { Routes } from 'utils/constants';

@autoinject
export class App {
	constructor(private router: Router) {}

	public configureRouter(config: RouterConfiguration, router: Router): Promise<void> | PromiseLike<void> | void {
		config.title = 'Aurelia';
		config.addPipelineStep('authorize', AuthorizeStep);
		config.map(RouteManager.CreateRoutes());

		this.router = router;
	}
}

@autoinject
class AuthorizeStep {
	constructor(private authService: AuthenticationService) {}

	run(navigationInstruction: NavigationInstruction, next: Next) {
		log.debug("navigating...");
		
		const roles = [Roles.Admin, Roles.Student];
		const rolesLength = roles.length;

		for (let i = 0; i < rolesLength; i++) {
			const x = roles[i];
			if (!this.validateRoute(navigationInstruction, x)) {
				log.debug(`not authorized; redirecting`);
				return next.cancel(new Redirect(Routes.Login));
			}
		}

		log.debug("navigation successful");
		return next();
	}

	validateRoute(navigationInstruction: NavigationInstruction, role: Roles) {
		const routeRole = navigationInstruction.getAllInstructions().some(x => x.config.settings.roles.includes(role));
		const requiresAuthentication = navigationInstruction.getAllInstructions().some(x => x.config.settings.authenticated);
		return (!routeRole || this.authService.role == role) && (!requiresAuthentication || this.authService.authenticated)
	}
}