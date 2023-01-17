import { autoinject } from "aurelia-framework";
import { LudusPlanning } from "../ludus-planning";
import { ApplicationState } from "applicationState";
import { ComponentHelper } from "utils/componentHelper";
import { PromptSection } from "models/prompts";

@autoinject
export class LudusPlanningStrengths {

	indexesShown: number[] = [];
	currentIndex: number = 0;
	numOfPrompts: number = 0;
	promptSections: PromptSection[];

	constructor(private localParent: LudusPlanning, private appState: ApplicationState) {}

	async attached() {
		await this.appState.initPrompts();
		this.indexesShown = [];
		this.numOfPrompts = this.appState.ludusPrompts.planningPrompts.length;
		if (ComponentHelper.NullOrEmpty(this.localParent.model.strengthOptimization.response)) {
			this.getRandomPrompt();
		} else {
			this.promptSections = ComponentHelper.GeneratePromptSections(this.localParent.model.strengthOptimization.response);
			this.promptSections.forEach(x => x.valid = ComponentHelper.InputValid(x.inputValue));
		}
	}

	nextStep() {
		this.localParent.model.strengthOptimization.response = ComponentHelper.CreateResponseFromPrompt(this.promptSections);
		this.localParent.nextStep();
	}

	getNewPrompt() {
		++this.localParent.model.strengthOptimization.interactions;
		this.getRandomPrompt();
	}

	getRandomPrompt(tries: number = 0) {
		this.currentIndex = ComponentHelper.RandomWholeNumber(0, this.numOfPrompts - 1);
		if (this.indexesShown.includes(this.currentIndex) && tries < 10) {
			this.getRandomPrompt(++tries);
		}
		this.indexesShown.push(this.currentIndex);
		this.promptSections = this.appState.ludusPrompts.planningPrompts[this.currentIndex];
	}

	get AllowNext() {
		return this.promptSections != null && this.promptSections.every(x => !x?.input || (x?.inputValue?.length >= 3 && x?.valid));
	}
}