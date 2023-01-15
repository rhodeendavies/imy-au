import { ApplicationState } from "applicationState";
import { autoinject, computedFrom } from "aurelia-framework";
import { LudusMonitoringApiModel, LudusStrategyPlanning } from "models/reflectionsApiModels";
import { AuthenticationService } from "services/authenticationService";
import { ReflectionsService } from "services/reflectionsService";
import { ReflectionTypes } from "utils/enums";
import { MonitoringPrompts } from "../monitoring-prompts";

@autoinject
export class LudusMonitoring {
	model: LudusMonitoringApiModel;
	questions: LudusStrategyPlanning;

	constructor(
		private localParent: MonitoringPrompts,
		private authService: AuthenticationService,
		private appState: ApplicationState,
		private reflectionsApi: ReflectionsService
	) { }

	attached() {
		this.getMonitoring();
	}

	nextStep() {
		this.localParent.nextStep();
		this.submitMonitoring(false);
	}

	submitMonitoring(completed: boolean = true) {
		this.model.completed = completed;
		this.localParent.submitMonitoring(this.model, completed);
	}

	async getMonitoring() {
		const currentSection = await this.appState.getCurrentSection();
		let id = currentSection.monitoringReflectionId;
		if (id == null) {
			id = await this.reflectionsApi.createReflection(this.authService.System, ReflectionTypes.Monitoring, currentSection.id)
		}
		const reflection = await this.reflectionsApi.getLudusMonitoringReflection(id);
		this.model = reflection.answers;
		this.questions = reflection.questions.strategyPlanning;
	}

	@computedFrom("authService.Course")
	get Course(): string {
		return this.authService.Course;
	}
}