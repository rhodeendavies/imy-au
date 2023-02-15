import { autoinject } from "aurelia-framework";
import { SectionTrackerParent } from "resources/sectionTracker/section-tracker";

@autoinject
export abstract class ReflectionStep {

	stepParent: ReflectionStepParent;

	abstract saveStep();

	nextStep() {
		if (!this.AllowNext) return;
		this.saveStep();
		this.stepParent.nextStep();
	}

	previousStep() {
		if (!this.AllowNext) return;
		this.saveStep();
		this.stepParent.previousStep();
	}

	submit() {
		this.saveStep();
		this.stepParent.submit();
	}

	abstract get AllowNext(): boolean;
}

@autoinject
export abstract class ReflectionStepParent {

	mainParent: SectionTrackerParent;

	nextStep() {
		this.mainParent.nextStep();
	}

	previousStep() {
		this.mainParent.previousStep();
	}

	abstract submit();
}