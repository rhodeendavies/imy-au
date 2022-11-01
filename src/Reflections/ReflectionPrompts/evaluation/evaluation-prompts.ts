import { ApplicationState } from "applicationState";
import { autoinject } from "aurelia-framework";

@autoinject
export class EvaluationPrompts {
	
	constructor(private appState: ApplicationState) {}

	submitEvaluation() {
		this.appState.submitEvaluation(false);
	}
}