import { autoinject } from "aurelia-framework";
import { LudusMonitoring } from "../ludus-monitoring";
import { PromptSection } from "models/prompts";
import { ApplicationState } from "applicationState";
import { ComponentHelper } from "utils/componentHelper";

@autoinject
export class LudusMonitoringQuestions {

	currentIndex: number;
	numOfPrompts: number = 0;
	promptSections: PromptSection[];

	constructor(private localParent: LudusMonitoring, private appState: ApplicationState) {}

	async attached() {
		this.currentIndex = -1;
		await this.appState.initPrompts();
		this.numOfPrompts = this.appState.ludusPrompts.monitoringPrompts.length;
		if (ComponentHelper.NullOrEmpty(this.localParent.model.contentConfusion.response)) {
			this.getNextPrompt();
		} else {
			this.promptSections = ComponentHelper.GeneratePromptSections(this.localParent.model.contentConfusion.response);
			this.promptSections.forEach(x => x.valid = ComponentHelper.InputValid(x.inputValue));
		}
	}

	nextStep() {
		this.localParent.model.contentConfusion.response = ComponentHelper.CreateResponseFromPrompt(this.promptSections);
		this.localParent.nextStep();
	}

	getNewPrompt() {
		++this.localParent.model.contentConfusion.interactions;
		this.getNextPrompt();
	}

	getNextPrompt() {
		let index = this.currentIndex;
		++index;
		if (index > (this.numOfPrompts - 1)) {
			index = 0;
		}
		this.promptSections = this.appState.ludusPrompts.evaluatingPrompts[index];
		this.currentIndex = index;
	}

	get AllowNext() {
		return this.promptSections != null && this.promptSections.every(x => !x?.input || (x?.inputValue?.length >= 3 && x?.valid));
	}
}