import { autoinject } from "aurelia-framework";
import { AuthenticationService } from "services/authenticationService";
import { PlanningPrompts } from "../planning-prompts";
import { BasePlanningApiModel } from "models/reflectionsApiModels";
import { ReflectionTypes } from "utils/enums";
import { ApplicationState } from "applicationState";
import { ReflectionsService } from "services/reflectionsService";
import { log } from "utils/log";
import { ReflectionStepParent } from "Reflections/ReflectionPrompts/reflection-step";

@autoinject
export class BasePlanning extends ReflectionStepParent {

	model: BasePlanningApiModel;

	constructor(
		private localParent: PlanningPrompts,
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
			let id = currentSection.planningReflectionId;
			if (id == null) {
				id = await this.reflectionsApi.createReflection(this.authService.System, ReflectionTypes.Planning, currentSection.id)
			}
			if (id == null) {
				this.appState.triggerToast("Failed to load planning...");
				this.localParent.init();
				return;
			}
			
			this.localParent.reflectionId = id;
			const reflection = await this.reflectionsApi.getBasePlanningReflection(id);
			this.model = reflection.answers;
			this.localParent.modelLoaded = true;
		} catch (error) {
			log.error(error);
		} finally {
			this.localParent.busy.off();
		}
	}
}