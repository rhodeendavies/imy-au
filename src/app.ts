import { RouteManager } from './routes/routeManager';
import { Router, RouterConfiguration } from 'aurelia-router';
import { autoinject } from 'aurelia-framework';
import { AuthenticationService } from 'services/authenticationService';
import { AuthorizeStep } from 'services/authorizeStep';
import { Toast } from 'resources/toast/toast';
import { ApplicationState } from 'applicationState';
import { Modal } from 'resources/modal/modal';
import { RadioOption } from 'resources/radioButton/radio-button';

@autoinject
export class App {

	private toast: Toast;
	
	// MODALS
	private ratingModal: Modal;
	private dailyReflectionModal: Modal;
	private planningModal: Modal;
	private monitoringModal: Modal;
	private evaluationModal: Modal;
	videoRatingOptions: RadioOption[] = [
		{ name: "I understand fully", subText: "3/3", value: 3 },
		{ name: "I understand partially", subText: "2/3", value: 2 },
		{ name: "I mostly don't understand", subText: "1/3", value: 1 },
		{ name: "I don't understand", subText: "0/3", value: 0 }
	];
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
	}

	public configureRouter(config: RouterConfiguration, router: Router): Promise<void> | PromiseLike<void> | void {
		config.title = 'Aurelia';
		config.addPipelineStep('authorize', AuthorizeStep);
		config.map(RouteManager.CreateRoutes());

		this.router = router;
	}

	// MODAL FUNCTIONS
	submitRating() {
		this.appState.submitRating();
	}

	// GETS
	get Loading(): boolean {
		return this.authService.Busy;
	}
}