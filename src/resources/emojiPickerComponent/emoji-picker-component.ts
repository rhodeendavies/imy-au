import { autoinject, bindable, bindingMode, computedFrom } from "aurelia-framework";
import { ComponentHelper } from "utils/componentHelper";

@autoinject
export class EmojiPickerComponent {

	@bindable({ defaultBindingMode: bindingMode.twoWay }) emoji = null;
	@bindable onChange;
	pickerOpen: boolean = false;

	emojiSelected(event) {
		this.emoji = event.detail.unicode;
		this.togglePicker();
		if (this.onChange != null) {
			setTimeout(() => {
				this.onChange();
			});
		}
	}

	togglePicker() {
		this.pickerOpen = !this.pickerOpen;
	}

	@computedFrom("emoji")
	get EmojiPicked(): boolean {
		return !ComponentHelper.NullOrEmpty(this.emoji);
	}
}