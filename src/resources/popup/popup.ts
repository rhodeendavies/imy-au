import { autoinject, bindable } from "aurelia-framework";
import { ComponentHelper } from "utils/componentHelper";
import { PopupPosition } from "utils/enums";
import $ from 'jquery';
import { EventAggregator, Subscription } from "aurelia-event-aggregator";
import { Events } from "utils/constants";

@autoinject
export class Popup {

	@bindable icon: string = "help";
	@bindable position: PopupPosition = PopupPosition.bottom;
	id: string;
	popupBoxId: string;
	scrollSub: Subscription;
	showPopUp: boolean = false;

	constructor(private ea: EventAggregator) {
		this.id = ComponentHelper.CreateId("popup");
		this.popupBoxId = ComponentHelper.CreateId("popupBox")
	}

	attached() {
		this.scrollSub = this.ea.subscribe(Events.PickerClicked, () => {
			this.close();
		});
	}

	detached() {
		this.scrollSub.dispose();
	}

	open() {
		this.showPopUp = true;

		setTimeout(() => {
			const offset = $(`#${this.id}`).offset();
			let top = 0;
			if (this.position == PopupPosition.right || this.position == PopupPosition.left) {
				let left = 0;
				if (this.position == PopupPosition.left) {
					left = offset.left - $(`#${this.popupBoxId}`).width();
				} else {
					left = offset.left + $(`#${this.id}`).width();
				}
				$(`#${this.popupBoxId}`).css({
					"left": left
				});
				top = offset.top - Math.floor($(`#${this.popupBoxId}`).height() / 2) + 10;
			} else {
				top = offset.top + $(`#${this.id}`).height();
			}
	
			$(`#${this.popupBoxId}`).css({
				"top": top - $(window).scrollTop()
			});
		});
	}

	close() {
		this.showPopUp = false;
	}
}