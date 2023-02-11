import { EventAggregator, Subscription } from "aurelia-event-aggregator";
import { autoinject, bindable, bindingMode, computedFrom } from "aurelia-framework";
import ColorPicker from "simple-color-picker";
import { ComponentHelper } from "utils/componentHelper";
import { Colours, Events } from "utils/constants";

@autoinject
export class ColourPicker {

	@bindable label: string = "";
	@bindable({ defaultBindingMode: bindingMode.twoWay }) colour: string = null;
	colourPicker: ColorPicker;
	id: string;
	pickerId: string;
	pickerOpen: boolean = false;
	clickSub: Subscription;

	constructor(private ea: EventAggregator) {
		this.id = ComponentHelper.CreateId("colourPicker");
		this.pickerId = ComponentHelper.CreateId("colourPickerBox");
	}

	attached() {
		this.colourPicker = new ColorPicker({
			color: this.colour == null ? Colours.LightGreyHex : this.colour,
			el: document.getElementById(this.pickerId)
		})

		this.colourPicker.onChange(newColour => {
			this.colour = newColour;
		});

		this.clickSub = this.ea.subscribe(Events.PickerClicked, (clickedId: string) => this.openPicker(clickedId));
		this.clickSub = this.ea.subscribe(Events.Scrolled, (clickedId: string) => this.openPicker(clickedId));
	}

	detached() {
		this.clickSub.dispose();
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

	@computedFrom("colour")
	get Colour(): string {
		return `background-color: ${this.colour}`;
	}

	@computedFrom("colour")
	get TextColour(): string {
		return `color: ${this.colour}`;
	}
}