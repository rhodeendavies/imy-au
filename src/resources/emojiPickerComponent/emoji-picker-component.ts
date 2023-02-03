import { autoinject, bindable, bindingMode, computedFrom } from "aurelia-framework";

@autoinject
export class EmojiPickerComponent {

	@bindable({ defaultBindingMode: bindingMode.twoWay }) emoji = null;
	pickerOpen: boolean = false;

	emojiSelected(event) {
		this.emoji = event.detail.unicode;
		this.togglePicker();
	}

	togglePicker() {
		this.pickerOpen = !this.pickerOpen;
	}

	@computedFrom("emoji")
	get EmojiPicked(): boolean {
		return this.emoji != null;
	}
}