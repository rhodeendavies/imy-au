import { autoinject } from "aurelia-framework";
import { LudusEvaluation } from "../ludus-evaluation";
import { ApplicationState } from "applicationState";
import { PromptSection } from "models/prompts";
import { ComponentHelper } from "utils/componentHelper";

@autoinject
export class BaseEvaluationFeelings {

	indexesShown: number[] = [];
	currentIndex: number = 0;
	numOfPrompts: number = 0;
	promptSections: PromptSection[];
	
	constructor(private localParent: LudusEvaluation, private appState: ApplicationState) {}

	attached() {
		this.indexesShown = [];
		this.numOfPrompts = this.appState.ludusPrompts.evaluatingPrompts.length;
		if (ComponentHelper.NullOrEmpty(this.localParent.model.feelingsLearningEffect.response)) {
			this.getRandomPrompt();
		} else {
			this.promptSections = ComponentHelper.GeneratePromptSections(this.localParent.model.feelingsLearningEffect.response);
		}
	}

	nextStep() {
		this.localParent.model.feelingsLearningEffect.response = this.createResponseFromPrompt(this.promptSections);
		this.localParent.nextStep();
	}

	getNewPrompt() {
		++this.localParent.model.feelingsLearningEffect.interactions;
		this.getRandomPrompt();
	}

	getRandomPrompt(tries: number = 0) {
		this.currentIndex = ComponentHelper.RandomWholeNumber(0, this.numOfPrompts - 1);
		if (this.indexesShown.includes(this.currentIndex) && tries < 10) {
			this.getRandomPrompt(++tries);
		}
		this.indexesShown.push(this.currentIndex);
		this.promptSections = this.appState.ludusPrompts.evaluatingPrompts[this.currentIndex];
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