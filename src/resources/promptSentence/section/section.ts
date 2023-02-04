import { autoinject, bindable, bindingMode, computedFrom } from "aurelia-framework";
import { PromptSection } from "models/prompts";
import { PromptType } from "utils/enums";
import { PromptSentence } from "../prompt-sentence";
import { ComponentHelper } from "utils/componentHelper";

@autoinject
export class Section {
	@bindable({ defaultBindingMode: bindingMode.twoWay }) section: PromptSection;

	constructor(private localParent: PromptSentence) {}

	getNextWord(section: PromptSection) {
		this.localParent.triggerIncreaseInteraction(section.wordIndicator);
		section.value = ComponentHelper.GetWord(section);
	}

	@computedFrom("section.type")
	get Text(): boolean {
		return this.section.type == PromptType.Text;
	}

	@computedFrom("section.type")
	get Input(): boolean {
		return this.section.type == PromptType.Input;
	}

	@computedFrom("section.type")
	get ShuffleWord(): boolean {
		return this.section.type == PromptType.ShuffleWord;
	}
}