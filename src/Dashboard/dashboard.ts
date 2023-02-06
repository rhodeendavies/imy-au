import { ApplicationState } from "applicationState";
import { EventAggregator, Subscription } from "aurelia-event-aggregator";
import { autoinject } from "aurelia-framework";
import { Router, RouterConfiguration } from "aurelia-router";
import { BaseReflection, LudusReflection, PaidiaReflection } from "models/reflections";
import { Busy } from "resources/busy/busy";
import { StudentRoutes } from "routes/studentRoutes";
import { AuthenticationService } from "services/authenticationService";
import { Events, Routes } from "utils/constants";
import { Systems } from "utils/enums";
import { log } from "utils/log";

@autoinject
export class Dashboard {

	baseReflection: BaseReflection;
	ludusReflection: LudusReflection;
	paidiaReflection: PaidiaReflection;
	lessonOpen: boolean = false;
	busy: Busy = new Busy();
	refreshSub: Subscription;

	constructor(
		private router: Router,
		private appState: ApplicationState,
		private authService: AuthenticationService,
		private ea: EventAggregator
	) { }

	async attached() {
		try {
			this.busy.on();
			this.refreshSub = this.ea.subscribe(Events.RefreshApp, () => { this.attached() });
			const currentSection = await this.appState.getCurrentSection();
			switch (this.authService.System) {
				case Systems.Base:
					this.baseReflection = await this.appState.getSectionBaseReflection(currentSection);
					break;
				case Systems.Ludus:
					this.ludusReflection = await this.appState.getSectionLudusReflection(currentSection);
					break;
				case Systems.Paidia:
					this.paidiaReflection = await this.appState.getSectionPaidiaReflection(currentSection);
					break;
			}
		} catch (error) {
			log.error(error)
		} finally {
			this.busy.off();
		}
	}

	detached() {
		this.refreshSub.dispose();
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