import { autoinject } from "aurelia-framework";
import { PaidiaEvaluation } from "../paidia-evaluation";
import { ComponentHelper } from "utils/componentHelper";
import data from "emoji-picker-element-data/en/emojibase/data.json";
import { PaidiaSummaryType } from "utils/enums";
import { Colours, Events } from "utils/constants";
import { EventAggregator, Subscription } from "aurelia-event-aggregator";

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
	pickerOpen: boolean = false;
	pickerId: string = "";
	id: string = "";
	clickSub: Subscription;
	scrollSub: Subscription;

	constructor(private localParent: PaidiaEvaluation, private ea: EventAggregator) {
		this.id = ComponentHelper.CreateId("summaryPicker");
		this.pickerId = ComponentHelper.CreateId("summaryPickerBox");
	}

	attached() {
		if (this.localParent.model.chosenEmojis == null || this.localParent.model.emojis == null) {
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

			this.localParent.model.emojis = this.emojis;
		} else {
			this.chosenEmojis = this.localParent.model.chosenEmojis;
			this.emojis = this.localParent.model.emojis;
		}

		this.clickSub = this.ea.subscribe(Events.PickerClicked, (clickedId: string) => this.openPicker(clickedId));
		this.scrollSub = this.ea.subscribe(Events.Scrolled, (clickedId: string) => this.openPicker(clickedId));
	}

	detached() {
		this.clickSub.dispose();
		this.scrollSub.dispose();
	}

	openPicker(clickedId: string) {
		if (clickedId == this.id) {
			this.pickerOpen = !this.pickerOpen;
			const offset = $(`#${this.id}`).offset();
			$(`#${this.pickerId}`).css({
				"top": offset.top - $(window).scrollTop(),
				"left": offset.left + $(`#${this.id}`).width() + 15
			});
		} else {
			this.closePicker();
		}
	}

	togglePicker() {
		this.ea.publish(Events.PickerClicked, this.id);
	}

	closePicker() {
		this.pickerOpen = false;
	}

	selectEmoji(emoji: EmojiDropdown, index: number) {
		this.emojis.splice(index, 1);
		this.chosenEmojis.push(emoji);
		this.togglePicker();
		this.localParent.model.chosenEmojis = this.chosenEmojis;
	}

	removeEmoji(emoji: EmojiDropdown, index: number) {
		this.chosenEmojis.splice(index, 1);
		this.emojis.push(emoji);
		switch (emoji.type) {
			case PaidiaSummaryType.colour:
				this.localParent.model.learningExperience.color = null;
				break;
			case PaidiaSummaryType.gif:
				this.localParent.model.learningExperience.gif = null;
				break;
			case PaidiaSummaryType.text:
				this.localParent.model.learningExperience.text = null;
				break;
			case PaidiaSummaryType.emoji:
				this.localParent.model.learningExperience.emoji = null;
				break;

		}
		this.localParent.model.chosenEmojis = this.chosenEmojis;
	}

	submit() {
		if (!this.AllowSubmit) return;
		this.localParent.model.learningExperience.emoji = ComponentHelper.EmojiToString(this.localParent.model.learningExperience.emoji);
		this.localParent.submitEvaluation();
	}

	get AllowSubmit(): boolean {
		return this.chosenEmojis != null && this.chosenEmojis.length > 0 &&
			(!this.chosenEmojis.some(x => x.type == PaidiaSummaryType.colour)
				|| (!ComponentHelper.NullOrEmpty(this.localParent.model.learningExperience.color)
					&& this.localParent.model.learningExperience.color != Colours.LightGreyHex)) &&
			(!this.chosenEmojis.some(x => x.type == PaidiaSummaryType.text)
				|| (!ComponentHelper.NullOrEmpty(this.localParent.model.learningExperience.text) && this.textValid)) &&
			(!this.chosenEmojis.some(x => x.type == PaidiaSummaryType.gif)
				|| !ComponentHelper.NullOrEmpty(this.localParent.model.learningExperience.gif)) &&
			(!this.chosenEmojis.some(x => x.type == PaidiaSummaryType.emoji)
				|| !ComponentHelper.NullOrEmpty(this.localParent.model.learningExperience.emoji))
	}
}

export class EmojiDropdown {
	emoji: string;
	type: PaidiaSummaryType;
}