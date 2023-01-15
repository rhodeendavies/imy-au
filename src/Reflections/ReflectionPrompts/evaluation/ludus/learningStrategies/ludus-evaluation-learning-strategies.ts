import { autoinject, computedFrom } from "aurelia-framework";
import { Strategy } from "models/reflections";
import { ComponentHelper } from "utils/componentHelper";
import { Colours, StrategyOptions } from "utils/constants";
import { LudusEvaluation } from "../ludus-evaluation";
import { Busy } from "resources/busy/busy";
import { LudusModifier } from "models/reflectionsApiModels";
import { Chart } from "chart.js";
import { log } from "utils/log";

@autoinject
export class BaseEvaluationLearningStrategies {

	learningStrategy: Strategy;
	reviewingStrategy: Strategy;
	practicingStrategy: Strategy;
	extendingStrategy: Strategy;
	busy: Busy = new Busy();
	components: LudusModifier[];
	chart: Chart;
	chartUpdated: boolean = false;

	constructor(private localParent: LudusEvaluation) { }

	attached() {
		try {
			this.busy.on();
			this.chartUpdated = false;
			this.initData();
		} catch (error) {
			log.error(error);
		} finally {
			this.busy.off();
		}
	}

	initData() {
		this.learningStrategy = ComponentHelper.CreateStrategyFromLudus(this.localParent.questions.strategyRating.learningStrategy, StrategyOptions.LearningStrategies, this.localParent.model.strategyRating.learningRating);
		this.reviewingStrategy = ComponentHelper.CreateStrategyFromLudus(this.localParent.questions.strategyRating.reviewingStrategy, StrategyOptions.ReviewingStrategies, this.localParent.model.strategyRating.reviewingRating);
		this.practicingStrategy = ComponentHelper.CreateStrategyFromLudus(this.localParent.questions.strategyRating.practicingStrategy, StrategyOptions.PracticingStrategies, this.localParent.model.strategyRating.practicingRating);
		this.extendingStrategy = ComponentHelper.CreateStrategyFromLudus(this.localParent.questions.strategyRating.extendingStrategy, StrategyOptions.ExtendingStrategies, this.localParent.model.strategyRating.extendingRating);
	}

	submit() {
		if (!this.AllowSubmit) return;
		this.localParent.model.strategyRating = {
			learningRating: this.learningStrategy.rating,
			reviewingRating: this.reviewingStrategy.rating,
			practicingRating: this.practicingStrategy.rating,
			extendingRating: this.extendingStrategy.rating
		}
		this.localParent.submitEvaluation();
	}

	createData() {
		const allModifiers: LudusModifier[] = [];
		if (this.learningStrategy.modifiers != null) {
			allModifiers.push(...this.learningStrategy.modifiers);
		}
		if (this.reviewingStrategy.modifiers != null) {
			allModifiers.push(...this.reviewingStrategy.modifiers);
		}
		if (this.practicingStrategy.modifiers != null) {
			allModifiers.push(...this.practicingStrategy.modifiers);
		}
		if (this.extendingStrategy.modifiers != null) {
			allModifiers.push(...this.extendingStrategy.modifiers);
		}
		
		this.components = ComponentHelper.GetUniqueComponents([], allModifiers);
		const data: number[] = this.components.map(x => x.amount);
		const colours = data.map((x, index) => ComponentHelper.GetColourOpacity(Colours.Orange, 1 - ((index-0.1)/this.components.length)))
		const total = data.reduce((prev, curr) => { return prev + curr }, 0);
		
		return {
			labels: this.components,
			datasets: [{
				label: "",
				data: data.map(x => {
					return x/ total * 100;
				}),
				backgroundColor: colours,
				borderColor: colours
			}]
		}
	}

	updateChart() {
		if (this.learningStrategy == null || this.reviewingStrategy == null || this.practicingStrategy == null || this.extendingStrategy == null) return;
		if (this.chart == null) {
			this.chart = new Chart(document.getElementById("componentsChart") as HTMLCanvasElement,
			{
				type: "doughnut",
				data: this.createData(),
				options: {
					aspectRatio: 2,
					layout: {
						padding: {
							top: 0,
							bottom: 0,
							right: 0,
							left: 0
						}
					},
					plugins: {
						tooltip: {
							callbacks: {
								label: (context) => {
									return `${context.parsed} %`
								}
							}
						},
						legend: {
							display: true,
							position: "right"
						}
					}
				}
			});
		} else {
			this.chart.data = this.createData();
			if (this.chartUpdated) {
				this.chart.update("none");
			} else {
				this.chart.update();
			}

			this.chartUpdated = this.learningStrategy.modifiers != null || this.reviewingStrategy.modifiers != null || this.practicingStrategy.modifiers != null || this.extendingStrategy.modifiers != null
		}
	}

	@computedFrom("learningStrategy.strategy", "reviewingStrategy.strategy", "practicingStrategy.strategy", "extendingStrategy.strategy")
	get AllowSubmit(): boolean {
		this.updateChart();
		return this.Strategies != null && this.Strategies.every(x => !ComponentHelper.NullOrEmpty(x?.strategy));
	}

	get Strategies(): Strategy[] {
		return [
			this.learningStrategy,
			this.reviewingStrategy,
			this.practicingStrategy,
			this.extendingStrategy
		];
	}
}