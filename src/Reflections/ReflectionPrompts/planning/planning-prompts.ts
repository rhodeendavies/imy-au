import { ApplicationState } from "applicationState";
import { autoinject } from "aurelia-framework";

@autoinject
export class PlanningPrompts {

	constructor(private appState: ApplicationState) {}
	
	submitPlanning() {
		this.appState.submitPlanning(false);
	}
}