import { RouteManager } from './routes/routeManager';
import { Router, RouterConfiguration } from 'aurelia-router';
import { autoinject } from 'aurelia-framework';
import { AuthenticationService } from 'services/authenticationService';
import { AuthorizeStep } from 'services/authorizeSteo';

@autoinject
export class App {
	constructor(private router: Router, private authService: AuthenticationService) {}

	public configureRouter(config: RouterConfiguration, router: Router): Promise<void> | PromiseLike<void> | void {
		config.title = 'Aurelia';
		config.addPipelineStep('authorize', AuthorizeStep);
		config.map(RouteManager.CreateRoutes());

		this.router = router;
	}

	get Loading(): boolean {
		return this.authService.Busy;
	}
}