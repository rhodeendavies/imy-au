import { RouteManager } from './routes/routeManager';
import { Router, RouterConfiguration } from 'aurelia-router';
import { autoinject } from 'aurelia-framework';
import { AuthenticationService } from 'services/authenticationService';
import { AuthorizeStep } from 'services/authorizeStep';
import { Toast } from 'resources/toast/toast';
import { ApplicationState } from 'applicationState';

@autoinject
export class App {

	toast: Toast;

	constructor(private router: Router, private authService: AuthenticationService, private appState: ApplicationState) {}

	attached() {
		this.appState.setToast(this.toast);
	}

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