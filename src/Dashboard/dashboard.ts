import { autoinject } from "aurelia-framework";
import { Router, RouterConfiguration } from "aurelia-router";
import { StudentRoutes } from "routes/studentRoutes";

@autoinject
export class Dashboard {

	moduleHeading: string = "IMY 110: Markup Languages";
	weekNumber: number = 4;
	weekDates: string = "22-26 Feb";

	constructor (private router: Router) {}

	public configureRouter(config: RouterConfiguration, router: Router): Promise<void> | PromiseLike<void> | void {
		config.title = 'Aurelia';
		config.map(StudentRoutes.getDashboardSubRoutes());

		this.router = router;
	}
}