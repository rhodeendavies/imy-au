import { ApplicationState } from "applicationState";
import { autoinject, computedFrom } from "aurelia-framework";
import { BaseVideoRatingApiModel } from "models/reflectionsApiModels";
import { SectionTrackerParent } from "resources/sectionTracker/section-tracker";
import { AuthenticationService } from "services/authenticationService";
import { ReflectionsService } from "services/reflectionsService";
import { ReflectionTypes, Systems } from "utils/enums";

@autoinject
export class VideoRating extends SectionTrackerParent {

	constructor(
		private appState: ApplicationState,
		private authService: AuthenticationService,
		private reflectionsApi: ReflectionsService) {
		super();
	}

	async submitRating(model: BaseVideoRatingApiModel) {
		const result = await this.reflectionsApi.submitReflection(this.authService.System, ReflectionTypes.Lesson, this.appState.watchedLesson.id, model);
		if (!result) {
			this.appState.triggerToast("Failed to save rating...");
			return;
		}
		this.appState.submitRating();
	}

	@computedFrom("authService.System")
	get ShowBaseSystem(): boolean {
		return this.authService.System == Systems.Base;
	}

	@computedFrom("authService.System")
	get ShowLudus(): boolean {
		return this.authService.System == Systems.Ludus;
	}

	@computedFrom("authService.System")
	get ShowPaidia(): boolean {
		return this.authService.System == Systems.Paidia;
	}
}