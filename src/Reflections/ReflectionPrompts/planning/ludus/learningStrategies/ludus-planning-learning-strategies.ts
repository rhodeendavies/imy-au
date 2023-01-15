import { autoinject, computedFrom } from "aurelia-framework";
import { ComponentHelper } from "utils/componentHelper";
import { Colours, StrategyModifier, StrategyOptions } from "utils/constants";
import { LudusPlanning } from "../ludus-planning";
import { Strategy } from "models/reflections";
import { Busy } from "resources/busy/busy";
import { log } from "utils/log";
import { Chart, DoughnutController, ArcElement, Tooltip, Legend } from 'chart.js'

Chart.register(DoughnutController, ArcElement, Tooltip, Legend);

@autoinject
export class LudusPlanningLearningStrategies {

	learningStrategy: Strategy;
	reviewingStrategy: Strategy;
	practicingStrategy: Strategy;
	extendingStrategy: Strategy;
	busy: Busy = new Busy();
	components: string[];
	chart: Chart;
	chartUpdated: boolean = false;

	constructor(private localParent: LudusPlanning) { }

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
		this.learningStrategy = ComponentHelper.CreateStrategyFromLudus(this.localParent.model.strategyPlanning.learningStrategy, StrategyOptions.LearningStrategies);
		this.reviewingStrategy = ComponentHelper.CreateStrategyFromLudus(this.localParent.model.strategyPlanning.reviewingStrategy, StrategyOptions.ReviewingStrategies);
		this.practicingStrategy = ComponentHelper.CreateStrategyFromLudus(this.localParent.model.strategyPlanning.practicingStrategy, StrategyOptions.PracticingStrategies);
		this.extendingStrategy = ComponentHelper.CreateStrategyFromLudus(this.localParent.model.strategyPlanning.extendingStrategy, StrategyOptions.ExtendingStrategies);
	}

	submit() {
		if (!this.AllowSubmit) return;
		this.localParent.model.strategyPlanning = {
			learningStrategy: ComponentHelper.CreateLudusModifier(this.learningStrategy),
			reviewingStrategy: ComponentHelper.CreateLudusModifier(this.reviewingStrategy),
			practicingStrategy: ComponentHelper.CreateLudusModifier(this.practicingStrategy),
			extendingStrategy: ComponentHelper.CreateLudusModifier(this.extendingStrategy),
		}
		this.localParent.submitPlanning();
	}

	getUniqueComponents(components: string[], modifiers: StrategyModifier[]): string[] {
		modifiers?.forEach(x => {
			if (!components.includes(x.type)) {
				components.push(x.type);
			}
		});
		return components;
	}

	createData() {
		const allModifiers = [];
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
		
		this.components = this.getUniqueComponents([], allModifiers);
		const data: number[] = this.components.map(x => {
			return allModifiers.reduce((prev, curr) => {
				if (curr.type == x) {
					prev += curr.value;
				}
				return prev;
			}, 0);
		});
		const colours = data.map((x, index) => ComponentHelper.GetColourOpacity(Colours.Orange, 1 - ((index-0.1)/this.components.length)))
		const total = data.reduce((prev, curr) => {return prev + curr}, 0);
		
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