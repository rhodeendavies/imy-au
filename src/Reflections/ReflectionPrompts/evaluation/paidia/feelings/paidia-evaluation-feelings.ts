import { autoinject } from "aurelia-framework";
import { ApplicationState } from "applicationState";
import { PromptSection } from "models/prompts";
import { ComponentHelper } from "utils/componentHelper";
import { PromptType } from "utils/enums";
import { PaidiaEvaluation } from "../paidia-evaluation";
import { PaidiaFeelingsSummary } from "models/reflectionsResponses";

@autoinject
export class PaidiaEvaluationFeelings {

	valid: boolean = true;
	emoji;
	promptSections: PromptSection[];
	feelingsSummary: PaidiaFeelingsSummary[];

	constructor(private localParent: PaidiaEvaluation, private appState: ApplicationState) { }

	async attached() {
		this.feelingsSummary = ComponentHelper.GetPaidiaFeelingsSummary(this.localParent.questions.courseFeelings)
		if (ComponentHelper.NullOrEmpty(this.localParent.model.feelingsLearningEffect.response)) {
			this.promptSections = this.appState.paidiaPrompts.evaluatingPrompts[0];
		} else {
			this.promptSections = ComponentHelper.GeneratePromptSections(this.localParent.model.feelingsLearningEffect.response);
			this.promptSections.forEach(x => x.valid = ComponentHelper.InputValid(x.value));
		}
		if (!ComponentHelper.NullOrEmpty(this.localParent.model.courseFeelings.emoji)) {
			this.emoji = ComponentHelper.EmojiFromString(this.localParent.model.courseFeelings.emoji);
		}
	}

	nextStep() {
		if (!this.AllowNext) return;
		this.localParent.model.courseFeelings.emoji = ComponentHelper.EmojiToString(this.emoji);
		this.localParent.model.feelingsLearningEffect.response = ComponentHelper.CreateResponseFromPrompt(this.promptSections);
		this.localParent.nextStep();
	}

	increaseInteraction(identifier: string) {
		if (this.localParent.model.feelingsLearningEffect.interactions == null) {
			this.localParent.model.feelingsLearningEffect.interactions = [];
		}
		const interaction = this.localParent.model.feelingsLearningEffect.interactions.find(x => x.identifier == identifier);
		if (interaction != null) {
			++interaction.numInteractions;
		} else {
			this.localParent.model.feelingsLearningEffect.interactions.push({
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
				(x?.value?.length >= 3 && x?.valid)) &&
			this.emoji != null &&
			!ComponentHelper.NullOrEmpty(this.localParent.model.courseFeelings.word) && this.valid;
	}
}