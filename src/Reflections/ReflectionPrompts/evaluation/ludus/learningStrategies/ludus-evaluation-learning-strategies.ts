import { autoinject, computedFrom } from "aurelia-framework";
import { LudusComponent, Strategy } from "models/reflections";
import { ComponentHelper } from "utils/componentHelper";
import { LudusEvaluation } from "../ludus-evaluation";
import { Busy } from "resources/busy/busy";
import { ArcElement, Chart, ChartType, DoughnutController, Legend, Tooltip } from "chart.js";
import { log } from "utils/log";
import { ApplicationState } from "applicationState";
import { Colours } from "utils/constants";
import { StrategyCategories } from "utils/enums";

Chart.register(DoughnutController, ArcElement, Tooltip, Legend);

@autoinject
export class LudusEvaluationLearningStrategies {

	learningStrategy: Strategy;
	reviewingStrategy: Strategy;
	practicingStrategy: Strategy;
	extendingStrategy: Strategy;
	strategies: Strategy[];
	busy: Busy = new Busy();
	components: LudusComponent[];
	chart: Chart;
	finalScore: number;

	constructor(private localParent: LudusEvaluation, private appState: ApplicationState) { }

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
		this.learningStrategy = ComponentHelper.CreateStrategyFromLudus(
			this.localParent.questions.strategyPlanning.learningStrategy,
			ComponentHelper.StrategyOptions.LearningStrategies,
			this.localParent.model.strategyRating.learningRating
		);
		this.reviewingStrategy = ComponentHelper.CreateStrategyFromLudus(
			this.localParent.questions.strategyPlanning.reviewingStrategy,
			ComponentHelper.StrategyOptions.ReviewingStrategies,
			this.localParent.model.strategyRating.reviewingRating
		);
		this.practicingStrategy = ComponentHelper.CreateStrategyFromLudus(
			this.localParent.questions.strategyPlanning.practicingStrategy,
			ComponentHelper.StrategyOptions.PracticingStrategies,
			this.localParent.model.strategyRating.practicingRating
		);
		this.extendingStrategy = ComponentHelper.CreateStrategyFromLudus(
			this.localParent.questions.strategyPlanning.extendingStrategy,
			ComponentHelper.StrategyOptions.ExtendingStrategies,
			this.localParent.model.strategyRating.extendingRating
		);
		this.strategies = [this.learningStrategy, this.reviewingStrategy, this.practicingStrategy, this.extendingStrategy];

		this.components = ComponentHelper.GetUniqueComponents([], ComponentHelper.GetAllModifiers(this.strategies));
	}

	nextStep() {
		if (!this.AllowSubmit) return;
		this.localParent.model.strategyRating = {
			learningRating: this.learningStrategy.rating,
			reviewingRating: this.reviewingStrategy.rating,
			practicingRating: this.practicingStrategy.rating,
			extendingRating: this.extendingStrategy.rating
		}
		this.localParent.model.components.calculated = this.components;
		this.localParent.nextStep();
	}

	updateComponents() {
		this.components = ComponentHelper.GetComponentScores(this.components, this.strategies);
		this.finalScore = ComponentHelper.GetFinalScore(this.components);
	}

	saveStrategy(strategy: Strategy) {
		switch (strategy.title) {
			case StrategyCategories.Learning:
				this.localParent.model.strategyRating.learningRating = strategy.rating;
				break;
			case StrategyCategories.Extending:
				this.localParent.model.strategyRating.extendingRating = strategy.rating;
				break;
			case StrategyCategories.Reviewing:
				this.localParent.model.strategyRating.reviewingRating = strategy.rating;
				break;
			case StrategyCategories.Practicing:
				this.localParent.model.strategyRating.practicingRating = strategy.rating;
				break;
		}
	}

	createData() {
		this.updateComponents();
		const data: number[] = this.components.map(x => x.total);
		const colours = data.map((x, index) => ComponentHelper.GetColourOpacity(Colours.Orange, 1 - ((index - 0.1) / this.components.length)))
		const total = data.reduce((prev, curr) => { return prev + curr }, 0);

		return {
			labels: this.components.map(x => x.name),
			datasets: [{
				label: "",
				data: data.map(x => {
					return x / total * 100;
				}),
				backgroundColor: colours,
				borderColor: colours
			}]
		}
	}

	createChart() {
		if (this.learningStrategy == null || this.reviewingStrategy == null || this.practicingStrategy == null || this.extendingStrategy == null) return;

		if (this.chart != null) {
			this.chart.destroy();
		}

		this.chart = new Chart(document.getElementById("evaluationComponentsChart") as HTMLCanvasElement,
			{
				type: "doughnut" as ChartType,
				data: this.createData(),
				options: {
					aspectRatio: 2,
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
		return this.strategies != null && this.strategies.every(x => x?.rating != null);
	}
}