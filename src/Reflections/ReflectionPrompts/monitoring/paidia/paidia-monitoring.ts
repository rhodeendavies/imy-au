import { ApplicationState } from "applicationState";
import { autoinject, computedFrom } from "aurelia-framework";
import { PaidiaMonitoringApiModel } from "models/reflectionsApiModels";
import { PaidiaMonitoringQuestions } from "models/reflectionsResponses";
import { AuthenticationService } from "services/authenticationService";
import { ReflectionsService } from "services/reflectionsService";
import { ReflectionTypes } from "utils/enums";
import { MonitoringPrompts } from "../monitoring-prompts";
import { log } from "utils/log";

@autoinject
export class PaidiaMonitoring {
	model: PaidiaMonitoringApiModel;
	questions: PaidiaMonitoringQuestions;

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
				this.localParent.init();
				return;
			}

			const reflection = await this.reflectionsApi.getPaidiaMonitoringReflection(id);
			this.localParent.reflectionId = id;
			this.model = reflection.answers;
			this.questions = reflection.questions;
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