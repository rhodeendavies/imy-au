import { autoinject } from "aurelia-framework";
import { PaidiaPlanning } from "../paidia-planning";
import { PromptSection } from "models/prompts";
import { ComponentHelper } from "utils/componentHelper";
import { ApplicationState } from "applicationState";
import { PromptType } from "utils/enums";

@autoinject
export class PaidiaPlanningStrengths {
	
	promptSections: PromptSection[];

	constructor(private localParent: PaidiaPlanning, private appState: ApplicationState) {}

	attached() {
		if (ComponentHelper.NullOrEmpty(this.localParent.model.strengthOptimization.response)) {
			this.promptSections = this.appState.paidiaPrompts.planningPrompts[0];
		} else {
			this.promptSections = ComponentHelper.GeneratePromptSections(this.localParent.model.strengthOptimization.response);
			this.promptSections.forEach(x => x.valid = ComponentHelper.InputValid(x.value));
		}
	}

	nextStep() {
		if (!this.AllowNext) return;
		this.localParent.model.strengthOptimization.response = ComponentHelper.CreateResponseFromPrompt(this.promptSections);
		this.localParent.nextStep();
	}

	increaseInteraction(identifier: string) {
		const interaction = this.localParent.model.strengthOptimization.interactions.find(x => x.identifier == identifier);
		if (interaction != null) {
			++interaction.numInteractions;
		} else {
			this.localParent.model.strengthOptimization.interactions.push({
				identifier: identifier,
				numInteractions: 1
			});
		}
	}

	get AllowNext() {
		return this.promptSections != null && 
			this.promptSections.every(x => 
				x?.type == PromptType.Text ||
				x?.type == PromptType.ShuffleWord ||
				(x?.value?.length >= 3 && x?.valid));
	}
}