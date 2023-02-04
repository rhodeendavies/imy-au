import { autoinject, computedFrom } from "aurelia-framework";
import { PaidiaMonitoring } from "../paidia-monitoring";
import { ComponentHelper } from "utils/componentHelper";

@autoinject
export class PaidiaMonitoringFeelings {
	
	valid: boolean = true;
	emoji;
	
	constructor(private localParent: PaidiaMonitoring) {}

	attached() {
		if (!ComponentHelper.NullOrEmpty(this.localParent.model.courseFeelings.emoji)) {
			this.emoji = ComponentHelper.EmojiFromString(this.localParent.model.courseFeelings.emoji);
		}
	}

	nextStep() {
		if (!this.AllowNext) return;
		this.localParent.model.courseFeelings.emoji = ComponentHelper.EmojiToString(this.emoji);
		this.localParent.nextStep();
	}

	@computedFrom("emoji", "localParent.model.courseFeelings.word", "valid")
	get AllowNext(): boolean {
		return this.emoji != null && 
			!ComponentHelper.NullOrEmpty(this.localParent.model.courseFeelings.word) && this.valid;
	}
}