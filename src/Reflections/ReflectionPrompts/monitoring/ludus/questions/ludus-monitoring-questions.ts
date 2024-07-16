import { autoinject } from "aurelia-framework";
import { LudusMonitoring } from "../ludus-monitoring";
import { PromptSection } from "models/prompts";
import { ApplicationState } from "applicationState";
import { ComponentHelper } from "utils/componentHelper";
import { PromptType } from "utils/enums";
import { ReflectionStep } from "Reflections/ReflectionPrompts/reflection-step";

@autoinject
export class LudusMonitoringQuestions extends ReflectionStep {

	currentIndex: number;
	numOfPrompts: number = 0;
	promptSections: PromptSection[];

	constructor(private localParent: LudusMonitoring, private appState: ApplicationState) {
		super();
		this.stepParent = localParent;
	}

	async attached() {
		this.currentIndex = -1;

		this.numOfPrompts = this.appState.ludusPrompts.monitoringPrompts.length;
		if (ComponentHelper.NullOrEmpty(this.localParent.model.contentConfusion.response)) {
			this.getNextPrompt();
		} else {
			this.promptSections = ComponentHelper.GeneratePromptSections(this.localParent.model.contentConfusion.response);
			this.promptSections.forEach(x => x.valid = ComponentHelper.PromptInputValid(x.value));
		}
	}

	saveStep() {
		this.localParent.model.contentConfusion.response = ComponentHelper.CreateResponseFromPrompt(this.promptSections);
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
		this.promptSections = this.appState.ludusPrompts.monitoringPrompts[index];
		this.currentIndex = index;
	}

	get AllowNext() {
		return this.promptSections != null &&
			this.promptSections.every(x => x?.type == PromptType.Text || (x?.value?.length >= 3 && x?.valid));
	}
}