import { ApplicationState } from "applicationState";
import { autoinject } from "aurelia-framework";
import { Router, RouterConfiguration } from "aurelia-router";
import { BaseSystemReflection } from "models/reflections";
import { StudentRoutes } from "routes/studentRoutes";
import { Routes } from "utils/constants";

@autoinject
export class Dashboard {

	// DEMO DATA
	currentReflection: BaseSystemReflection;
	// END OF DEMO DATA

	lessonOpen: boolean = false;

	constructor(private router: Router, private appState: ApplicationState) { }

	attached() {
		this.currentReflection = this.appState.getCurrentReflection();
	}

	public configureRouter(config: RouterConfiguration, router: Router): Promise<void> | PromiseLike<void> | void {
		config.title = 'Aurelia';
		config.map(StudentRoutes.getDashboardSubRoutes());

		this.router = router;
	}

	navigate(fragment: string) {
		this.router.navigate(fragment);
	}

	navigateToRoute(route: string) {
		this.router.navigateToRoute(route);
	}

	navigateToReflection() {
		this.navigateToRoute(`${Routes.Reflections}`)
	}

	triggerDailyReflection() {
		this.appState.triggerDailyModal();
	}
}