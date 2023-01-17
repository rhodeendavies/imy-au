import { autoinject, computedFrom } from "aurelia-framework";
import { LudusComponent, Strategy } from "models/reflections";
import { ComponentHelper } from "utils/componentHelper";
import { Colours, StrategyOptions } from "utils/constants";
import { LudusEvaluation } from "../ludus-evaluation";
import { Busy } from "resources/busy/busy";
import { Chart } from "chart.js";
import { log } from "utils/log";

@autoinject
export class LudusEvaluationLearningStrategies {

	learningStrategy: Strategy;
	reviewingStrategy: Strategy;
	practicingStrategy: Strategy;
	extendingStrategy: Strategy;
	busy: Busy = new Busy();
	components: LudusComponent[];
	chart: Chart;
	finalScore: number;

	constructor(private localParent: LudusEvaluation) { }

	attached() {
		try {
			this.busy.on();
			this.initData();
			this.createChart();
		} catch (error) {
			log.error(error);
		} finally {
			this.busy.off();
		}
	}

	initData() {
		this.learningStrategy = ComponentHelper.CreateStrategyFromLudus(this.localParent.questions.strategyPlanning.learningStrategy, StrategyOptions.LearningStrategies, this.localParent.model.strategyRating.learningRating);
		this.reviewingStrategy = ComponentHelper.CreateStrategyFromLudus(this.localParent.questions.strategyPlanning.reviewingStrategy, StrategyOptions.ReviewingStrategies, this.localParent.model.strategyRating.reviewingRating);
		this.practicingStrategy = ComponentHelper.CreateStrategyFromLudus(this.localParent.questions.strategyPlanning.practicingStrategy, StrategyOptions.PracticingStrategies, this.localParent.model.strategyRating.practicingRating);
		this.extendingStrategy = ComponentHelper.CreateStrategyFromLudus(this.localParent.questions.strategyPlanning.extendingStrategy, StrategyOptions.ExtendingStrategies, this.localParent.model.strategyRating.extendingRating);
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

	updateComponents() {
		this.components = ComponentHelper.GetComponentScores(this.components, this.Strategies);
		this.finalScore = ComponentHelper.GetFinalScore(this.components);
	}

	createData() {
		this.components = ComponentHelper.GetUniqueComponents([], ComponentHelper.GetAllModifiers(this.Strategies));
		this.updateComponents();
		const data: number[] = this.components.map(x => x.total);
		const colours = data.map((x, index) => ComponentHelper.GetColourOpacity(Colours.Orange, 1 - ((index-0.1)/this.components.length)))
		const total = data.reduce((prev, curr) => { return prev + curr }, 0);
		
		return {
			labels: this.components.map(x => x.name),
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

	createChart() {
		if (this.learningStrategy == null || this.reviewingStrategy == null || this.practicingStrategy == null || this.extendingStrategy == null) return;
		
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
	}

	@computedFrom("learningStrategy.rating", "reviewingStrategy.rating", "practicingStrategy.rating", "extendingStrategy.rating")
	get AllowSubmit(): boolean {
		this.updateComponents();
		return this.Strategies != null && this.Strategies.every(x => x?.rating != null);
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