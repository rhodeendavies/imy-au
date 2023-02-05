import { autoinject } from "aurelia-framework";
import { PaidiaEvaluation } from "../paidia-evaluation";
import { ComponentHelper } from "utils/componentHelper";
import data from "emoji-picker-element-data/en/emojibase/data.json";

@autoinject
export class PaidiaEvaluationSummary {

	emojis: EmojiDropdown[];
	types: PaidiaSummaryType[] = [
		PaidiaSummaryType.colour,
		PaidiaSummaryType.emoji,
		PaidiaSummaryType.gif,
		PaidiaSummaryType.text
	];
	chosenEmojis: EmojiDropdown[];
	gifType: PaidiaSummaryType = PaidiaSummaryType.gif;
	emojiType: PaidiaSummaryType = PaidiaSummaryType.emoji;
	textType: PaidiaSummaryType = PaidiaSummaryType.text;
	colourType: PaidiaSummaryType = PaidiaSummaryType.colour;
	textValid: boolean = true;
	dropdownOpen: boolean = false;

	constructor(private localParent: PaidiaEvaluation) { }

	attached() {
		this.chosenEmojis = [];
		const allEmojis = data.map(x => x.emoji);
		const length = allEmojis.length - 1;
		const indexes = [];
		let index = ComponentHelper.RandomWholeNumber(0, length);
		for (let i = 0; i < 4; i++) {
			while (indexes.includes(index)) {
				index = ComponentHelper.RandomWholeNumber(0, length);
			}
			indexes.push(index);
		}
		this.emojis = indexes.map((x, index) => {
			return {
				emoji: allEmojis[x],
				type: this.types[index]
			}
		});
		this.emojis = ComponentHelper.ShuffleArray(this.emojis);

	}

	togglePicker() {
		this.dropdownOpen = !this.dropdownOpen;
	}

	selectEmoji(emoji: EmojiDropdown, index: number) {
		this.emojis.splice(index, 1);
		this.chosenEmojis.push(emoji);
		this.togglePicker();
	}

	removeEmoji(emoji: EmojiDropdown, index: number) {
		this.chosenEmojis.splice(index, 1);
		this.emojis.push(emoji);
	}

	submit() {
		if (!this.AllowSubmit) return;
		this.localParent.model.learningExperience.emoji = ComponentHelper.EmojiToString(this.localParent.model.learningExperience.emoji);
		this.localParent.submitEvaluation();
	}

	get AllowSubmit(): boolean {
		return this.chosenEmojis != null && this.chosenEmojis.length > 0 &&
			(!this.chosenEmojis.some(x => x.type == PaidiaSummaryType.colour)
				|| !ComponentHelper.NullOrEmpty(this.localParent.model.learningExperience.color)) &&
			(!this.chosenEmojis.some(x => x.type == PaidiaSummaryType.text)
				|| (!ComponentHelper.NullOrEmpty(this.localParent.model.learningExperience.text) && this.textValid)) &&
			(!this.chosenEmojis.some(x => x.type == PaidiaSummaryType.gif)
				|| !ComponentHelper.NullOrEmpty(this.localParent.model.learningExperience.gif)) &&
			(!this.chosenEmojis.some(x => x.type == PaidiaSummaryType.emoji)
				|| !ComponentHelper.NullOrEmpty(this.localParent.model.learningExperience.emoji))
	}
}

class EmojiDropdown {
	emoji: string;
	type: PaidiaSummaryType;
}

enum PaidiaSummaryType {
	gif,
	emoji,
	colour,
	text
}

class EmojiData {
	shortcodes: string[];
	annotation: string;
	tags: string[];
	emoji: string;
	order: number;
	group: number;
	version: number
}