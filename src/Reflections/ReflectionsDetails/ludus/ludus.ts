import { autoinject, bindable, computedFrom } from "aurelia-framework";
import { ReflectionsDetails } from "../reflections-details";
import { LudusReflection } from "models/reflections";
import { LudusModifier, LudusStrategyPlanning, StrategyRating } from "models/reflectionsApiModels";
import { ComponentHelper } from "utils/componentHelper";

@autoinject
export class Ludus {

	@bindable reflection: LudusReflection;
	components: Component[];

	constructor(private localParent: ReflectionsDetails) {}

	attached() {
		if (this.reflection == null || this.reflection.planningReflection == null) return;

		const allModifiers: LudusModifier[] = [];
		const strategies: LudusStrategyPlanning = this.reflection.planningReflection.answers?.strategyPlanning;

		let ratings: StrategyRating = null;

		if (this.reflection.evaluatingReflection != null) {
			ratings = this.reflection.evaluatingReflection.answers?.strategyRating;
		} else if (this.reflection.monitoringReflection != null) {
			ratings = this.reflection.monitoringReflection.answers?.strategyRating;
		}

		if (strategies?.learningStrategy?.modifiers != null) {
			allModifiers.push(...strategies.learningStrategy.modifiers);
		}
		if (strategies?.reviewingStrategy?.modifiers != null) {
			allModifiers.push(...strategies.reviewingStrategy.modifiers);
		}
		if (strategies?.practicingStrategy?.modifiers != null) {
			allModifiers.push(...strategies.practicingStrategy.modifiers);
		}
		if (strategies?.extendingStrategy?.modifiers != null) {
			allModifiers.push(...strategies.extendingStrategy.modifiers);
		}
		
		const componentNames = ComponentHelper.GetUniqueComponents([], allModifiers);

		this.components = componentNames.map(x => {
			return {
				name: x,
				value: 0
			}
		});
	}

	@computedFrom("localParent.dashboardVersion")
	get FullReflection(): boolean {
		return !this.localParent.dashboardVersion;
	}

	@computedFrom("localParent.Course")
	get Course(): string {
		return this.localParent.Course;
	}
}

class Component {
	name: string;
	value: number;
}