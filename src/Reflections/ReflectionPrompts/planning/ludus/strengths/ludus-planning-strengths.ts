import { autoinject } from "aurelia-framework";
import { LudusPlanning } from "../ludus-planning";
import { ApplicationState } from "applicationState";
import { ComponentHelper } from "utils/componentHelper";
import { PromptSection } from "models/prompts";
import { PromptType } from "utils/enums";
import { ReflectionStep } from "Reflections/ReflectionPrompts/reflection-step";

@autoinject
export class LudusPlanningStrengths extends ReflectionStep {

	currentIndex: number;
	numOfPrompts: number = 0;
	promptSections: PromptSection[];

	constructor(private localParent: LudusPlanning, private appState: ApplicationState) {
		super();
		this.stepParent = localParent;
	}

	async attached() {
		this.currentIndex = -1;

		this.numOfPrompts = this.appState.ludusPrompts.planningPrompts.length;
		if (ComponentHelper.NullOrEmpty(this.localParent.model.strengthOptimization.response)) {
			this.getNextPrompt();
		} else {
			this.promptSections = ComponentHelper.GeneratePromptSections(this.localParent.model.strengthOptimization.response);
			this.promptSections.forEach(x => x.valid = ComponentHelper.InputValid(x.value));
		}
	}

	saveStep() {
		this.localParent.model.strengthOptimization.response = ComponentHelper.CreateResponseFromPrompt(this.promptSections);
	}

	getNewPrompt() {
		++this.localParent.model.strengthOptimization.interactions;
		this.getNextPrompt();
	}

	getNextPrompt() {
		let index = this.currentIndex;
		++index;
		if (index > (this.numOfPrompts - 1)) {
			index = 0;
		}
		this.promptSections = this.appState.ludusPrompts.planningPrompts[index];
		this.currentIndex = index;
	}

	get AllowNext() {
		return this.promptSections != null &&
			this.promptSections.every(x => x?.type == PromptType.Text || (x?.value?.length >= 3 && x?.valid));
	}
}