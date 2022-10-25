import { autoinject, bindable, computedFrom } from "aurelia-framework";
import { Reflection } from "models/reflections";
import { Reflections } from "Reflections/reflections";
import { ReflectionSections } from "utils/enums";

@autoinject
export class ReflectionsDetails {

	@bindable reflections: Reflection[] = [];
	activeSection: number = ReflectionSections.Planning;

	constructor(private localParent: Reflections) {}

	@computedFrom("activeSection")
	get ShowPlanning(): boolean {
		return this.activeSection == ReflectionSections.Planning
	}

	@computedFrom("activeSection")
	get ShowMonitoring(): boolean {
		return this.activeSection == ReflectionSections.Monitoring
	}

	@computedFrom("activeSection")
	get ShowEvaluating(): boolean {
		return this.activeSection == ReflectionSections.Evaluating
	}
}