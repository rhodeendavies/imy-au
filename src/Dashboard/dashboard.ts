import { ApplicationState } from "applicationState";
import { autoinject } from "aurelia-framework";
import { Router, RouterConfiguration } from "aurelia-router";
import { BaseReflection } from "models/reflections";
import { Busy } from "resources/busy/busy";
import { StudentRoutes } from "routes/studentRoutes";
import { AuthenticationService } from "services/authenticationService";
import { Routes } from "utils/constants";
import { Systems } from "utils/enums";
import { log } from "utils/log";

@autoinject
export class Dashboard {

	currentReflection: BaseReflection;
	lessonOpen: boolean = false;
	busy: Busy = new Busy();

	constructor(private router: Router, private appState: ApplicationState, private authService: AuthenticationService) { }

	async attached() {
		try {
			this.busy.on();
			switch (this.authService.System) {
				case Systems.Base:
					this.currentReflection = await this.appState.getSectionBaseReflection(await this.appState.getCurrentSection());
					break;
				default:
					break;
			}
		} catch (error) {
			log.error(error)
		} finally {
			this.busy.off();
		}
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