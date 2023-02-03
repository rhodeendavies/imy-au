import { autoinject, bindable, computedFrom } from "aurelia-framework";
import { ReflectionsDetails } from "../reflections-details";
import { LudusComponent, LudusReflection, Strategy } from "models/reflections";
import { ComponentHelper } from "utils/componentHelper";
import { ApplicationState } from "applicationState";

@autoinject
export class Ludus {

	@bindable reflection: LudusReflection;
	components: LudusComponent[];
	finalScore: number;

	constructor(private localParent: ReflectionsDetails, private appState: ApplicationState) { }

	attached() {
		if (this.reflection == null || this.reflection.planningReflection == null) return;

		const strategyPlanning = this.reflection.planningReflection.answers?.strategyPlanning;
		const strategies: Strategy[] = [
			ComponentHelper.CreateStrategyFromLudus(
				strategyPlanning.learningStrategy,
				this.appState.strategyOptions.LearningStrategies
			),
			ComponentHelper.CreateStrategyFromLudus(
				strategyPlanning.practicingStrategy,
				this.appState.strategyOptions.PracticingStrategies
			),
			ComponentHelper.CreateStrategyFromLudus(
				strategyPlanning.reviewingStrategy,
				this.appState.strategyOptions.ReviewingStrategies
			),
			ComponentHelper.CreateStrategyFromLudus(
				strategyPlanning.extendingStrategy,
				this.appState.strategyOptions.ExtendingStrategies
			),
		];

		this.components = ComponentHelper.GetUniqueComponents([], ComponentHelper.GetAllModifiers(strategies));

		if (this.reflection.evaluatingReflection != null) {
			this.components = ComponentHelper.AssignComponentScores(this.components, this.reflection.evaluatingReflection.answers.components.calculated);
			this.finalScore = ComponentHelper.GetOriginalFinalScore(this.components);
		} else if (this.reflection.monitoringReflection != null) {
			this.components = ComponentHelper.AssignComponentScores(this.components, this.reflection.monitoringReflection.answers.components.calculated);
		}

		// TODO: check on any daily that could have been after monitoring
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