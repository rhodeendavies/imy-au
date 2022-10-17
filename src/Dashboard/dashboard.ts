import { autoinject } from "aurelia-framework";
import { Router, RouterConfiguration } from "aurelia-router";
import { StudentRoutes } from "routes/studentRoutes";

@autoinject
export class Dashboard {

	lessonOpen: boolean = false;

	constructor(private router: Router) { }

	public configureRouter(config: RouterConfiguration, router: Router): Promise<void> | PromiseLike<void> | void {
		config.title = 'Aurelia';
		config.map(StudentRoutes.getDashboardSubRoutes());

		this.router = router;
	}

	navigate(fragment: string) {
		this.router.navigate(fragment);
	}
}