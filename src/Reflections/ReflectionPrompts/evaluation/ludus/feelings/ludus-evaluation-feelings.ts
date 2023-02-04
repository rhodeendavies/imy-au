import { autoinject } from "aurelia-framework";
import { LudusEvaluation } from "../ludus-evaluation";
import { ApplicationState } from "applicationState";
import { PromptSection } from "models/prompts";
import { ComponentHelper } from "utils/componentHelper";
import { CategoryScale, Chart, LineController, LineElement, LinearScale, PointElement, Tooltip } from "chart.js";
import { Colours } from "utils/constants";
import { DateHelper } from "utils/dateHelper";
import { PromptType } from "utils/enums";

Chart.register(LineController, Tooltip, CategoryScale, LinearScale, PointElement, LineElement);

@autoinject
export class LudusEvaluationFeelings {

	currentIndex: number;
	numOfPrompts: number = 0;
	promptSections: PromptSection[];
	chart: Chart;

	constructor(private localParent: LudusEvaluation, private appState: ApplicationState) { }

	async attached() {
		this.currentIndex = -1;

		this.numOfPrompts = this.appState.ludusPrompts.evaluatingPrompts.length;
		if (ComponentHelper.NullOrEmpty(this.localParent.model.feelingsLearningEffect.response)) {
			this.getNextPrompt();
		} else {
			this.promptSections = ComponentHelper.GeneratePromptSections(this.localParent.model.feelingsLearningEffect.response);
			this.promptSections.forEach(x => x.valid = ComponentHelper.InputValid(x.value));
		}
		this.createChart();
	}

	nextStep() {
		if (!this.AllowNext) return;
		this.localParent.model.feelingsLearningEffect.response = ComponentHelper.CreateResponseFromPrompt(this.promptSections);
		this.localParent.nextStep();
	}

	getNewPrompt() {
		++this.localParent.model.feelingsLearningEffect.interactions;
		this.getNextPrompt();
	}

	getNextPrompt() {
		let index = this.currentIndex;
		++index;
		if (index > (this.numOfPrompts - 1)) {
			index = 0;
		}
		this.promptSections = this.appState.ludusPrompts.evaluatingPrompts[index];
		this.currentIndex = index;
	}

	createData() {
		return {
			labels: this.localParent.questions.courseFeelings.createdAt.map(x =>
				DateHelper.FormatDate(x, "d LLL")
			),
			datasets: [{
				label: "",
				data: this.localParent.questions.courseFeelings.rating,
				backgroundColor: Colours.OrangeHex,
				borderColor: Colours.OrangeHex
			}]
		}
	}

	createChart() {
		this.chart = new Chart(document.getElementById("feelingsChart") as HTMLCanvasElement,
			{
				type: "line",
				data: this.createData(),
				options: {
					aspectRatio: 3,
					plugins: {
						tooltip: {
							callbacks: {
								label: (context) => {
									return `${context.parsed.y} %`
								}
							}
						},
						legend: {
							display: false
						}
					},
					scales: {
						y: {
							beginAtZero: true,
							max: 100,
							ticks: {
								stepSize: 20,
								padding: 20
							}
						}
					}
				}
			});
	}

	get AllowNext() {
		return this.promptSections != null && 
			this.promptSections.every(x => x?.type == PromptType.Text || (x?.value?.length >= 3 && x?.valid));
	}
}