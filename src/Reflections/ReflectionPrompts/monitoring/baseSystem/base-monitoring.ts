import { autoinject } from "aurelia-framework";
import { AuthenticationService } from "services/authenticationService";
import { MonitoringPrompts } from "../monitoring-prompts";
import { ReflectionTypes } from "utils/enums";
import { ApplicationState } from "applicationState";
import { ReflectionsService } from "services/reflectionsService";
import { BaseMonitoringApiModel, StrategyPlanning } from "models/reflectionsApiModels";
import { log } from "utils/log";
import { ReflectionStepParent } from "Reflections/ReflectionPrompts/reflection-step";

@autoinject
export class BaseMonitoring extends ReflectionStepParent {

	model: BaseMonitoringApiModel;
	questions: StrategyPlanning;

	constructor(
		private localParent: MonitoringPrompts,
		private authService: AuthenticationService,
		private appState: ApplicationState,
		private reflectionsApi: ReflectionsService
	) {
		super();
		this.mainParent = localParent;
	}

	async getModel() {
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
}