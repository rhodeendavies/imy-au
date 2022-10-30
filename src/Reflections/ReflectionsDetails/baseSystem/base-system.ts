import { autoinject, bindable } from "aurelia-framework";
import { BaseSystemReflection } from "models/reflections";
import { EnumHelper } from "utils/enumHelper";
import { ReflectionsDetails } from "../reflections-details";

@autoinject
export class BaseSystem {

	@bindable reflection: BaseSystemReflection;

	constructor(private localParent: ReflectionsDetails) {}

	attached() {
		if (this.reflection != null) {
			this.reflection.planningReflection.strategies.forEach(x => {
				x.icon = EnumHelper.GetCategoryIcon(x.title);
				x.ratingPercentage = Math.ceil(x.rating / 3 * 100);
			})
		}
	}
}