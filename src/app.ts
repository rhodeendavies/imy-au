import { RouteManager } from './routes/routeManager';
import { Router, RouterConfiguration } from 'aurelia-router';
import { autoinject } from 'aurelia-framework';
import { AuthenticationService } from 'services/authenticationService';
import { AuthorizeStep } from 'services/authorizeStep';
import { Toast } from 'resources/toast/toast';
import { ApplicationState } from 'applicationState';
import { Modal } from 'resources/modal/modal';

@autoinject
export class App {

	private toast: Toast;
	
	// MODALS
	private ratingModal: Modal;
	private dailyReflectionModal: Modal;
	private planningModal: Modal;
	private monitoringModal: Modal;
	private evaluationModal: Modal;
	// END OF MODALS

	constructor(
		private router: Router,
		private authService: AuthenticationService,
		private appState: ApplicationState
	) { }

	attached() {
		this.appState.setToast(this.toast);
		this.appState.setRatingModal(this.ratingModal);
		this.appState.setDailyModal(this.dailyReflectionModal);
		this.appState.setPlanningModal(this.planningModal);
		this.appState.setMonitoringModal(this.monitoringModal);
		this.appState.setEvaluationModal(this.evaluationModal);
		this.appState.init();
	}

	public configureRouter(config: RouterConfiguration, router: Router): Promise<void> | PromiseLike<void> | void {
		config.title = 'FlipQuest';
		config.addPipelineStep('authorize', AuthorizeStep);
		config.map(RouteManager.CreateRoutes());
		config.fallbackRoute('not-found');

		this.router = router;
	}

	// GETS
	get Loading(): boolean {
		return this.authService.Busy;
	}
}