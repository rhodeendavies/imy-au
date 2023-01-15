import { autoinject } from "aurelia-framework";
import { LudusMonitoring } from "../ludus-monitoring";
import { PromptSection } from "models/prompts";
import { ApplicationState } from "applicationState";
import { ComponentHelper } from "utils/componentHelper";

@autoinject
export class BaseMonitoringQuestions {

	indexesShown: number[] = [];
	currentIndex: number = 0;
	numOfPrompts: number = 0;
	promptSections: PromptSection[];

	constructor(private localParent: LudusMonitoring, private appState: ApplicationState) {}

	attached() {
		this.indexesShown = [];
		this.numOfPrompts = this.appState.ludusPrompts.monitoringPrompts.length;
		if (ComponentHelper.NullOrEmpty(this.localParent.model.contentConfusion.response)) {
			this.getRandomPrompt();
		} else {
			this.promptSections = ComponentHelper.GeneratePromptSections(this.localParent.model.contentConfusion.response);
		}
	}

	nextStep() {
		this.localParent.model.contentConfusion.response = this.createResponseFromPrompt(this.promptSections);
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

	createResponseFromPrompt(prompt: PromptSection[]): string {
		return prompt.reduce((prev, curr) => {
			if (curr.input) {
				prev += `%{${curr.inputValue}}`;
			} else {
				prev += curr.prompt;
			}
			return prev;
		}, "");
	}

	get AllowNext() {
		return this.promptSections != null && this.promptSections.every(x => !x?.input || x?.inputValue?.length > 3);
	}
}