import { EventAggregator, Subscription } from "aurelia-event-aggregator";
import { autoinject, bindable, bindingMode, computedFrom } from "aurelia-framework";
import { ComponentHelper } from "utils/componentHelper";
import { Events } from "utils/constants";

@autoinject
export class EmojiPickerComponent {

	@bindable({ defaultBindingMode: bindingMode.twoWay }) emoji = null;
	@bindable onChange;
	id: string;
	pickerOpen: boolean = false;
	blurring: boolean = false;
	clickSub: Subscription;

	constructor(private ea: EventAggregator) {
		this.id = ComponentHelper.CreateId("emojiPicker");
	}

	attached() {
		this.clickSub = this.ea.subscribe(Events.PickerClicked, (clickedId: string) => {
			if (clickedId == this.id) {
				this.pickerOpen = !this.pickerOpen;
			} else {
				this.pickerOpen = false;
			}
		});
	}

	detached() {
		this.clickSub.dispose();
	}

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
		this.ea.publish(Events.PickerClicked, this.id);
	}

	@computedFrom("emoji")
	get EmojiPicked(): boolean {
		return !ComponentHelper.NullOrEmpty(this.emoji);
	}
}