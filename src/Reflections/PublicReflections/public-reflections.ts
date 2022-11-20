import { autoinject, computedFrom } from "aurelia-framework";
import { BaseSystemEvaluating } from "models/reflections";
import { Reflections } from "Reflections/reflections";

@autoinject
export class PublicReflections {

	constructor(private localParent: Reflections) {}

	@computedFrom("localParent.sectionSelected.id")
	get Reflections(): BaseSystemEvaluating[] {
		if (this.localParent.sectionSelected == null) return [];
		return this.localParent.sectionSelected.publicBaseReflections;
	}
}