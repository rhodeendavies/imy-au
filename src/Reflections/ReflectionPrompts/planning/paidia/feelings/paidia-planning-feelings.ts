import { autoinject, computedFrom } from "aurelia-framework";
import { PaidiaPlanning } from "../paidia-planning";
import { ComponentHelper } from "utils/componentHelper";
import { ReflectionStep } from "Reflections/ReflectionPrompts/reflection-step";

@autoinject
export class PaidiaPlanningFeelings extends ReflectionStep {

	valid: boolean = true;
	emoji;

	constructor(private localParent: PaidiaPlanning) {
		super();
		this.stepParent = localParent;
	}

	attached() {
		if (!ComponentHelper.NullOrEmpty(this.localParent.model.courseFeelings.emoji)) {
			this.emoji = ComponentHelper.EmojiFromString(this.localParent.model.courseFeelings.emoji);
		}
	}

	saveStep() {
		this.localParent.model.courseFeelings.emoji = ComponentHelper.EmojiToString(this.emoji);
	}

	@computedFrom("emoji", "localParent.model.courseFeelings.word", "valid")
	get AllowNext(): boolean {
		return this.emoji != null &&
			!ComponentHelper.NullOrEmpty(this.localParent.model.courseFeelings.word) && this.valid;
	}
}