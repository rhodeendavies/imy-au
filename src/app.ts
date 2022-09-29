import { Roles } from 'utils/constants';
import { RouteManager } from './routes/routeManager';
import { Router, RouterConfiguration, Redirect } from 'aurelia-router';
import { log } from 'utils/log';

export class App {
	public router: Router;

	public configureRouter(config: RouterConfiguration, router: Router): Promise<void> | PromiseLike<void> | void {
		config.title = 'Aurelia';
		config.addPipelineStep('authorize', AuthorizeStep);
		config.map(RouteManager.CreateRoutes());

		this.router = router;
	}
}

class AuthorizeStep {
	run(navigationInstruction, next) {
		log.debug("navigating");
		const isAdminRoute = navigationInstruction.getAllInstructions().some(i => i.config.settings.roles.includes(Roles.Admin));
		if (isAdminRoute) {
			const isAdmin = /* insert magic here */false;
			if (!isAdmin) {
				log.debug("not admin; redirecting");
				return next.cancel(new Redirect('login'));
			}
		}

		const isStudentRoute = navigationInstruction.getAllInstructions().some(i => i.config.settings.roles.includes(Roles.Student));
		if (isStudentRoute) {
			const isStudent = /* insert magic here */false;
			if (!isStudent) {
				log.debug("not student; redirecting");
				return next.cancel(new Redirect('login'));
			}
		}

		log.debug("navigation successful");
		return next();
	}
}