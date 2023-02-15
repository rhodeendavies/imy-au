import { autoinject } from "aurelia-framework";
import { PaidiaPlanning } from "../paidia-planning";
import { PromptSection } from "models/prompts";
import { ComponentHelper } from "utils/componentHelper";
import { ApplicationState } from "applicationState";
import { PromptType } from "utils/enums";
import { ReflectionStep } from "Reflections/ReflectionPrompts/reflection-step";

@autoinject
export class PaidiaPlanningStrengths extends ReflectionStep {
	
	promptSections: PromptSection[];

	constructor(private localParent: PaidiaPlanning, private appState: ApplicationState) {
		super();
		this.stepParent = localParent;
	}

	attached() {
		if (ComponentHelper.NullOrEmpty(this.localParent.model.strengthOptimization.response)) {
			this.promptSections = this.appState.paidiaPrompts.planningPrompts[0];
		} else {
			this.promptSections = ComponentHelper.GeneratePromptSections(this.localParent.model.strengthOptimization.response);
			this.promptSections.forEach(x => x.valid = ComponentHelper.InputValid(x.value));
		}
	}

	saveStep() {
		this.localParent.model.strengthOptimization.response = ComponentHelper.CreateResponseFromPrompt(this.promptSections);
	}

	increaseInteraction(identifier: string) {
		if (this.localParent.model.strengthOptimization.interactions == null) {
			this.localParent.model.strengthOptimization.interactions = [];
		}
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