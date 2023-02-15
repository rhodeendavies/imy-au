import { autoinject } from "aurelia-framework";
import { PromptSection } from "models/prompts";
import { ApplicationState } from "applicationState";
import { ComponentHelper } from "utils/componentHelper";
import { PromptType } from "utils/enums";
import { PaidiaMonitoring } from "../paidia-monitoring";
import { ReflectionStep } from "Reflections/ReflectionPrompts/reflection-step";

@autoinject
export class PaidiaMonitoringQuestions extends ReflectionStep {

	promptSections: PromptSection[];

	constructor(private localParent: PaidiaMonitoring, private appState: ApplicationState) {
		super();
		this.stepParent = localParent;
	}

	attached() {
		if (ComponentHelper.NullOrEmpty(this.localParent.model.contentConfusion.response)) {
			this.promptSections = this.appState.paidiaPrompts.monitoringPrompts[0];
		} else {
			this.promptSections = ComponentHelper.GeneratePromptSections(this.localParent.model.contentConfusion.response);
			this.promptSections.forEach(x => x.valid = ComponentHelper.InputValid(x.value));
		}
	}

	saveStep() {
		this.localParent.model.contentConfusion.response = ComponentHelper.CreateResponseFromPrompt(this.promptSections);
	}

	increaseInteraction(identifier: string) {
		if (this.localParent.model.contentConfusion.interactions == null) {
			this.localParent.model.contentConfusion.interactions = [];
		}
		const interaction = this.localParent.model.contentConfusion.interactions.find(x => x.identifier == identifier);
		if (interaction != null) {
			++interaction.numInteractions;
		} else {
			this.localParent.model.contentConfusion.interactions.push({
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