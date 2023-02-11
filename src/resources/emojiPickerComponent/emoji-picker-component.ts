import { EventAggregator, Subscription } from "aurelia-event-aggregator";
import { autoinject, bindable, bindingMode, computedFrom } from "aurelia-framework";
import { ComponentHelper } from "utils/componentHelper";
import { Events } from "utils/constants";

@autoinject
export class EmojiPickerComponent {

	@bindable({ defaultBindingMode: bindingMode.twoWay }) emoji = null;
	@bindable onChange;
	id: string;
	pickerId: string;
	pickerOpen: boolean = false;
	blurring: boolean = false;
	clickSub: Subscription;

	constructor(private ea: EventAggregator) {
		this.id = ComponentHelper.CreateId("emojiPicker");
		this.pickerId = ComponentHelper.CreateId("emojiPickerBox");
	}

	attached() {
		this.clickSub = this.ea.subscribe(Events.PickerClicked, (clickedId: string) => this.openPicker(clickedId));
		this.clickSub = this.ea.subscribe(Events.Scrolled, (clickedId: string) => this.openPicker(clickedId));
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

	openPicker(clickedId: string) {
		if (clickedId == this.id) {
			this.pickerOpen = !this.pickerOpen;

			setTimeout(() => {
				const offset = $(`#${this.id}`).offset();

				let top = offset.top - $(window).scrollTop();
				if (top + $(`#${this.pickerId}`).height() > $(window).height()) {
					top = offset.top - $(window).scrollTop() - $(`#${this.pickerId}`).height() + $(`#${this.id}`).height()
				}

				$(`#${this.pickerId}`).css({
					"top": top,
					"left": offset.left + $(`#${this.id}`).width()
				});
			});
		} else {
			this.pickerOpen = false;
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