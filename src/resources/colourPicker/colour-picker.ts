import { autoinject, bindable, bindingMode, computedFrom } from "aurelia-framework";
import ColorPicker from "simple-color-picker";
import { ComponentHelper } from "utils/componentHelper";
import { Colours } from "utils/constants";

@autoinject
export class ColourPicker {

	@bindable label: string = "";
	@bindable({ defaultBindingMode: bindingMode.twoWay }) colour: string = null;
	colourPicker: ColorPicker;
	id: string;
	pickerOpen: boolean = false;
	blurring: boolean = false;

	constructor() {
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

	@computedFrom("colour")
	get Colour(): string {
		return `background-color: ${this.colour}`;
	}

	@computedFrom("colour")
	get TextColour(): string {
		return `color: ${this.colour}`;
	}
}