import { autoinject, bindable, bindingMode } from "aurelia-framework";
import { PromptSection } from "models/prompts";
import { ComponentHelper } from "utils/componentHelper";
import { PromptType } from "utils/enums";

@autoinject
export class PromptSentence {
	@bindable({ defaultBindingMode: bindingMode.twoWay }) promptSections: PromptSection[];
	@bindable allowRefresh: boolean = true;
	@bindable increaseInteraction;
	@bindable getNewPrompt;
	spinRefresh: boolean = false;

	triggerGetNewPrompt() {
		if (!this.allowRefresh) return;
		if (this.getNewPrompt != null) {
			this.getNewPrompt();
		}
	}

	triggerIncreaseInteraction(wordIndicator: string) {
		if (this.increaseInteraction != null) {
			this.increaseInteraction({ identifier: wordIndicator });
		}
	}

	attached() {
		this.spin();
	}

	spin() {
		this.spinRefresh = false;
		setTimeout(() => {
			this.spinRefresh = true;
			setTimeout(() => this.spin(), 10000);
		}, 2000);
	}

	get FinalSentence(): string {
		if (this.promptSections == null) return "";
		return ComponentHelper.CleanPrompt(this.promptSections
			.map(x => {
				if (ComponentHelper.NullOrEmpty(x.value) && x.type == PromptType.Input) {
					return "______";
				}
				return x.value;
			}).join(""));
	}
}