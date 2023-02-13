import { autoinject, computedFrom } from "aurelia-framework";
import { AuthenticationService } from "services/authenticationService";
import { MonitoringPrompts } from "../monitoring-prompts";
import { ReflectionTypes } from "utils/enums";
import { ApplicationState } from "applicationState";
import { ReflectionsService } from "services/reflectionsService";
import { BaseMonitoringApiModel, StrategyPlanning } from "models/reflectionsApiModels";
import { log } from "utils/log";

@autoinject
export class BaseMonitoring {

	model: BaseMonitoringApiModel;
	questions: StrategyPlanning;

	constructor(
		private localParent: MonitoringPrompts,
		private authService: AuthenticationService,
		private appState: ApplicationState,
		private reflectionsApi: ReflectionsService
	) { }

	attached() {
		this.localParent.modelLoaded = false;
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
		try {
			this.localParent.busy.on();
			const currentSection = await this.appState.getCurrentSection();
			let id = currentSection.monitoringReflectionId;
			if (id == null) {
				id = await this.reflectionsApi.createReflection(this.authService.System, ReflectionTypes.Monitoring, currentSection.id)
			}
			if (id == null) {
				this.appState.triggerToast("Failed to load monitoring...");
				this.localParent.init();
				return;
			}

			const reflection = await this.reflectionsApi.getBaseMonitoringReflection(id);
			this.localParent.reflectionId = id;
			this.model = reflection.answers;
			this.questions = reflection.questions.strategyPlanning;
			this.localParent.modelLoaded = true;
		} catch (error) {
			log.error(error);
		} finally {
			this.localParent.busy.off();
		}
	}

	@computedFrom("localParent.Course")
	get Course(): string {
		return this.localParent.Course;
	}
}