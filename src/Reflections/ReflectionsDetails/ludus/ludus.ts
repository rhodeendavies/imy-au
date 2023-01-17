import { autoinject, bindable, computedFrom } from "aurelia-framework";
import { ReflectionsDetails } from "../reflections-details";
import { LudusComponent, LudusReflection, Strategy } from "models/reflections";
import { ComponentHelper } from "utils/componentHelper";
import { StrategyOptions } from "utils/constants";

@autoinject
export class Ludus {

	@bindable reflection: LudusReflection;
	components: LudusComponent[];

	constructor(private localParent: ReflectionsDetails) {}

	attached() {
		if (this.reflection == null || this.reflection.planningReflection == null) return;

		const strategyPlanning = this.reflection.planningReflection.answers?.strategyPlanning;
		const strategies: Strategy[] = [
			ComponentHelper.CreateStrategyFromLudus(strategyPlanning.learningStrategy, StrategyOptions.LearningStrategies),
			ComponentHelper.CreateStrategyFromLudus(strategyPlanning.practicingStrategy, StrategyOptions.PracticingStrategies),
			ComponentHelper.CreateStrategyFromLudus(strategyPlanning.reviewingStrategy, StrategyOptions.ReviewingStrategies),
			ComponentHelper.CreateStrategyFromLudus(strategyPlanning.extendingStrategy, StrategyOptions.ExtendingStrategies),
		];

		this.components = ComponentHelper.GetUniqueComponents([], ComponentHelper.GetAllModifiers(strategies));

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