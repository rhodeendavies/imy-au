import { autoinject, bindable, bindingMode, computedFrom } from "aurelia-framework";
import { PromptSection } from "models/prompts";
import { PromptType } from "utils/enums";
import { PromptSentence } from "../prompt-sentence";
import { ComponentHelper } from "utils/componentHelper";

@autoinject
export class Section {
	@bindable({ defaultBindingMode: bindingMode.twoWay }) section: PromptSection;
	animation: string;
	animations: ShuffleWordAnimation[] = [
		ShuffleWordAnimation.blink,
		ShuffleWordAnimation.colourChange,
		ShuffleWordAnimation.shadow,
		ShuffleWordAnimation.wiggle
	];

	constructor(private localParent: PromptSentence) {}

	attached() {
		this.getRandomAnimation();
	}

	getRandomAnimation() {
		this.animation = this.animations[ComponentHelper.RandomWholeNumber(0, 3)];
		setTimeout(() => {
			this.animation = "";
			setTimeout(() => this.getRandomAnimation(), ComponentHelper.RandomWholeNumber(4000, 10000));
		}, 2000);
	}

	getNextWord() {
		this.localParent.triggerIncreaseInteraction(this.section.wordIndicator);
		this.section.value = ComponentHelper.GetWord(this.section);
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

enum ShuffleWordAnimation {
	blink = "blink",
	colourChange = "colour-change",
	wiggle = "wiggle",
	shadow = "shadow"
}