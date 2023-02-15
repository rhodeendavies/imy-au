import { autoinject } from "aurelia-framework";
import { AuthenticationService } from "services/authenticationService";
import { PlanningPrompts } from "../planning-prompts";
import { LudusPlanningApiModel } from "models/reflectionsApiModels";
import { ApplicationState } from "applicationState";
import { ReflectionsService } from "services/reflectionsService";
import { ReflectionTypes } from "utils/enums";
import { log } from "utils/log";
import { ReflectionStepParent } from "Reflections/ReflectionPrompts/reflection-step";

@autoinject
export class LudusPlanning extends ReflectionStepParent {
	model: LudusPlanningApiModel;

	constructor(
		private localParent: PlanningPrompts,
		private authService: AuthenticationService,
		private appState: ApplicationState,
		private reflectionsApi: ReflectionsService
	) { 
		super()
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
			
			const reflection = await this.reflectionsApi.getLudusPlanningReflection(id);
			this.localParent.reflectionId = id;
			this.model = reflection.answers;
			this.localParent.modelLoaded = true;
		} catch (error) {
			log.error(error);
		} finally {
			this.localParent.busy.off();
		}
	}
}