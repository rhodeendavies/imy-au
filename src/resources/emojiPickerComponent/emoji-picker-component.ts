import { autoinject, bindable, bindingMode, computedFrom } from "aurelia-framework";
import { ComponentHelper } from "utils/componentHelper";

@autoinject
export class EmojiPickerComponent {

	@bindable({ defaultBindingMode: bindingMode.twoWay }) emoji = null;
	@bindable onChange;
	id: string;
	pickerOpen: boolean = false;
	blurring: boolean = false;

	constructor() {
		this.id = ComponentHelper.CreateId("emojiPicker");
	}

	emojiSelected(event) {
		this.emoji = event.detail.unicode;
		if (this.onChange != null) {
			setTimeout(() => {
				this.onChange();
			});
		}
	}

	togglePicker() {
		if (!this.blurring) {
			this.pickerOpen = !this.pickerOpen;
		}
		setTimeout(() => {
			if (this.pickerOpen) {
				document.getElementById(this.id).focus();
			}
		});
	}

	onBlur() {
		this.blurring = true;
		this.pickerOpen = false;
		setTimeout(() => {
			this.blurring = false;
		}, 500);
	}

	@computedFrom("emoji")
	get EmojiPicked(): boolean {
		return !ComponentHelper.NullOrEmpty(this.emoji);
	}
}