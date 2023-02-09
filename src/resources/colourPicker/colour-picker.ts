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
	pickerOpen: boolean = false;
	clickSub: Subscription;

	constructor(private ea: EventAggregator) {
		this.id = ComponentHelper.CreateId("colourPicker");
	}

	attached() {
		this.colourPicker = new ColorPicker({
			color: this.colour == null ? Colours.LightGreyHex : this.colour,
			el: document.getElementById(this.id)
		})

		this.colourPicker.onChange(newColour => {
			this.colour = newColour;
		});

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

	togglePicker() {
		this.ea.publish(Events.PickerClicked, this.id);
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