import { autoinject } from "aurelia-framework";
import { LudusEvaluation } from "../ludus-evaluation";
import { ApplicationState } from "applicationState";
import { PromptSection } from "models/prompts";
import { ComponentHelper } from "utils/componentHelper";
import { CategoryScale, Chart, ChartType, LineController, LineElement, LinearScale, PointElement, Tooltip } from "chart.js";
import { Colours } from "utils/constants";
import { DateHelper } from "utils/dateHelper";
import { PromptType } from "utils/enums";
import { ReflectionStep } from "Reflections/ReflectionPrompts/reflection-step";

Chart.register(LineController, Tooltip, CategoryScale, LinearScale, PointElement, LineElement);

@autoinject
export class LudusEvaluationFeelings extends ReflectionStep {

	currentIndex: number;
	numOfPrompts: number = 0;
	promptSections: PromptSection[];
	chart: Chart;

	constructor(private localParent: LudusEvaluation, private appState: ApplicationState) {
		super();
		this.stepParent = localParent;
	}

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

	saveStep() {
		this.localParent.model.feelingsLearningEffect.response = ComponentHelper.CreateResponseFromPrompt(this.promptSections);
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
		const feelingsSummary = ComponentHelper.GetFeelingsSummary(this.localParent.questions.courseFeelings);
		feelingsSummary.sort((a, b) => a.createdAt < b.createdAt ? -1 : 1);

		return {
			labels: feelingsSummary.map(x =>
				DateHelper.FormatDate(x.createdAt, "d LLL")
			),
			datasets: [{
				label: "",
				data: feelingsSummary.map(x => x.rating),
				backgroundColor: Colours.OrangeHex,
				borderColor: Colours.OrangeHex
			}]
		}
	}

	createChart() {
		if (this.chart != null) {
			this.chart.destroy();
		}

		this.chart = new Chart(document.getElementById("feelingsChart") as HTMLCanvasElement,
			{
				type: "line" as ChartType,
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