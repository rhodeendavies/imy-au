import { autoinject } from "aurelia-framework";
import { Router, RouterConfiguration } from "aurelia-router";
import { Reflection } from "models/reflections";
import { StudentRoutes } from "routes/studentRoutes";
import { Routes } from "utils/constants";

@autoinject
export class Dashboard {

	lessonOpen: boolean = false;
	selectedReflections: Reflection[] = [];

	constructor(private router: Router) { }

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
}