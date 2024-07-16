import { autoinject, bindable, computedFrom } from "aurelia-framework";
import { ReflectionsDetails } from "../reflections-details";
import { LudusComponent, LudusReflection, Strategy } from "models/reflections";
import { ComponentHelper } from "utils/componentHelper";
import { ApplicationState } from "applicationState";
import { ReflectionsService } from "services/reflectionsService";

@autoinject
export class Ludus {

	@bindable reflection: LudusReflection;
	components: LudusComponent[];
	finalScore: number;

	constructor(
		private localParent: ReflectionsDetails,
		private appState: ApplicationState,
		private reflectionApi: ReflectionsService
	) { }

	async attached() {
		if (this.reflection == null || this.reflection.planningReflection == null) return;

		const strategyPlanning = this.reflection.planningReflection.answers?.strategyPlanning;
		const strategies: Strategy[] = [
			ComponentHelper.CreateStrategyFromLudus(
				strategyPlanning.learningStrategy,
				ComponentHelper.StrategyOptions.LearningStrategies
			),
			ComponentHelper.CreateStrategyFromLudus(
				strategyPlanning.practicingStrategy,
				ComponentHelper.StrategyOptions.PracticingStrategies
			),
			ComponentHelper.CreateStrategyFromLudus(
				strategyPlanning.reviewingStrategy,
				ComponentHelper.StrategyOptions.ReviewingStrategies
			),
			ComponentHelper.CreateStrategyFromLudus(
				strategyPlanning.extendingStrategy,
				ComponentHelper.StrategyOptions.ExtendingStrategies
			),
		];

		this.components = ComponentHelper.GetUniqueComponents([], ComponentHelper.GetAllModifiers(strategies));

		if (this.reflection.evaluatingReflection != null) {
			// calculate from evaluation directly
			this.components = ComponentHelper.AssignComponentScores(this.components, this.reflection.evaluatingReflection.answers.components.calculated);
			this.finalScore = ComponentHelper.GetOriginalFinalScore(this.components);
		} else if (this.reflection.monitoringReflection != null) {
			// use monitoring previous components
			this.components = ComponentHelper.FindLatestScore(this.components, this.reflection.monitoringReflection.questions.previousComponents);
		} else if (this.reflection.section.dailyReflectionIds != null && this.reflection.section.dailyReflectionIds.length > 0){
			// check for latest daily
			const length = this.reflection.section.dailyReflectionIds.length;
			const latestDailyId = this.reflection.section.dailyReflectionIds[length - 1];
			const latestDaily = await this.reflectionApi.getLudusDailyReflection(latestDailyId);
			this.components = ComponentHelper.FindLatestScore(this.components, latestDaily.questions.previousComponents);
		}
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