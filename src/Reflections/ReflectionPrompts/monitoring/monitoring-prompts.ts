import { ApplicationState } from "applicationState";
import { autoinject } from "aurelia-framework";

@autoinject
export class MonitoringPrompts {
	
	constructor(private appState: ApplicationState) {}
	
	submitMonitoring() {
		this.appState.submitMonitoring(false);
	}
}