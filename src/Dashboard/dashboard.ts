import { autoinject } from "aurelia-framework";
import { Router, RouterConfiguration } from "aurelia-router";
import { BaseSystemPlanning, BaseSystemReflection, Strategy } from "models/reflections";
import { StudentRoutes } from "routes/studentRoutes";
import { ComponentHelper } from "utils/componentHelper";
import { Routes } from "utils/constants";
import { StrategyCategories } from "utils/enums";

@autoinject
export class Dashboard {

	// DEMO DATA
	currentReflection: BaseSystemReflection = new BaseSystemReflection();
	// END OF DEMO DATA

	lessonOpen: boolean = false;

	constructor(private router: Router) { }

	attached() {
		this.createDemoData();
	}
	
	createDemoData() {
		const strategies: Strategy[] = [{
			title: StrategyCategories.Learning,
			strategy: "a test",
			rating: 1
		}, {
			title: StrategyCategories.Reviewing,
			strategy: "a test",
			rating: 2
		}, {
			title: StrategyCategories.Practicing,
			strategy: "a test",
			rating: 3
		}, {
			title: StrategyCategories.Extending,
			strategy: "a test",
			rating: 0
		}]
		this.currentReflection.planningReflection.strengths = ComponentHelper.LoremIpsum();
		this.currentReflection.planningReflection.strategies = strategies;

		this.currentReflection.monitoringReflection.currentQuestions = ComponentHelper.LoremIpsum();
		this.currentReflection.monitoringReflection.strategies = strategies;

		this.currentReflection.evaluatingReflection.summary = ComponentHelper.LoremIpsum();
		this.currentReflection.evaluatingReflection.strategies = strategies;
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
}