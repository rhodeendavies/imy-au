import { ApplicationState } from "applicationState";
import { autoinject, computedFrom } from "aurelia-framework";
import { BaseLessonApiModel } from "models/reflectionsApiModels";
import { SectionTrackerParent } from "resources/sectionTracker/section-tracker";
import { AuthenticationService } from "services/authenticationService";
import { LessonsService } from "services/lessonsService";
import { ReflectionsService } from "services/reflectionsService";
import { ReflectionTypes, Systems } from "utils/enums";

@autoinject
export class VideoRating extends SectionTrackerParent {

	reflectionId: number;

	constructor(
		private appState: ApplicationState,
		private authService: AuthenticationService,
		private reflectionsApi: ReflectionsService,
		private lessonsApi: LessonsService
	) {
		super();
	}

	async submitRating(model: BaseLessonApiModel) {
		model.completed = true;
		const result = await this.reflectionsApi.submitReflection(this.authService.System, ReflectionTypes.Lesson, this.reflectionId, model);
		if (!result) {
			this.appState.triggerToast("Failed to save rating...");
			return;
		}
		const completed = this.lessonsApi.completeLesson(this.appState.watchedLesson.id);
		if (!completed) {
			this.appState.triggerToast("Failed to complete lesson...");
			return;
		}
		this.appState.closeRating();
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