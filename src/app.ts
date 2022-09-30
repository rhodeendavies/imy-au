import { Roles } from 'utils/constants';
import { RouteManager } from './routes/routeManager';
import { Router, RouterConfiguration, Redirect } from 'aurelia-router';
import { log } from 'utils/log';
import { ApplicationState } from 'applicationState';
import { autoinject } from 'aurelia-framework';

@autoinject
export class App {
	public router: Router;

	constructor(private appState: ApplicationState) {}

	public configureRouter(config: RouterConfiguration, router: Router): Promise<void> | PromiseLike<void> | void {
		config.title = 'Aurelia';
		config.addPipelineStep('authorize', AuthorizeStep);
		config.map(RouteManager.CreateRoutes());

		this.router = router;
	}
}

@autoinject
class AuthorizeStep {
	constructor(private appState: ApplicationState) {}
	run(navigationInstruction, next) {
		log.debug("navigating");
		const isAdminRoute = navigationInstruction.getAllInstructions().some(i => i.config.settings.roles.includes(Roles.Admin));
		if (isAdminRoute) {
			const isAdmin = this.appState.loggedInUser?.role == Roles.Admin;
			if (!isAdmin) {
				log.debug("not admin; redirecting");
				return next.cancel(new Redirect('login'));
			}
		}

		const isStudentRoute = navigationInstruction.getAllInstructions().some(i => i.config.settings.roles.includes(Roles.Student));
		if (isStudentRoute) {
			const isStudent = this.appState.loggedInUser?.role == Roles.Student;
			if (!isStudent) {
				log.debug("not student; redirecting");
				return next.cancel(new Redirect('login'));
			}
		}

		log.debug("navigation successful");
		return next();
	}
}