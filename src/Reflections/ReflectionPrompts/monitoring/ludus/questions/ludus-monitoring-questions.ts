import { autoinject } from "aurelia-framework";
import { LudusMonitoring } from "../ludus-monitoring";
import { PromptSection } from "models/prompts";
import { ApplicationState } from "applicationState";
import { ComponentHelper } from "utils/componentHelper";

@autoinject
export class LudusMonitoringQuestions {

	indexesShown: number[] = [];
	currentIndex: number = 0;
	numOfPrompts: number = 0;
	promptSections: PromptSection[];

	constructor(private localParent: LudusMonitoring, private appState: ApplicationState) {}

	async attached() {
		await this.appState.initPrompts();
		this.indexesShown = [];
		this.numOfPrompts = this.appState.ludusPrompts.monitoringPrompts.length;
		if (ComponentHelper.NullOrEmpty(this.localParent.model.contentConfusion.response)) {
			this.getRandomPrompt();
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
		this.getRandomPrompt();
	}

	getRandomPrompt(tries: number = 0) {
		this.currentIndex = ComponentHelper.RandomWholeNumber(0, this.numOfPrompts - 1);
		if (this.indexesShown.includes(this.currentIndex) && tries < 10) {
			this.getRandomPrompt(++tries);
		}
		this.indexesShown.push(this.currentIndex);
		this.promptSections = this.appState.ludusPrompts.monitoringPrompts[this.currentIndex];
	}

	get AllowNext() {
		return this.promptSections != null && this.promptSections.every(x => !x?.input || (x?.inputValue?.length >= 3 && x?.valid));
	}
}