import { ApplicationState } from "applicationState";
import { autoinject } from "aurelia-framework";
import { BaseLessonApiModel, LudusLessonApiModel, PaidiaVideoRatingApiModel } from "models/reflectionsApiModels";
import { AuthenticationService } from "services/authenticationService";
import { LessonsService } from "services/lessonsService";
import { ReflectionsService } from "services/reflectionsService";
import { ReflectionTypes } from "utils/enums";
import { ReflectionPrompt } from "../reflection-step";
import { EventAggregator } from "aurelia-event-aggregator";

@autoinject
export class VideoRating extends ReflectionPrompt {

	constructor(
		private appState: ApplicationState,
		authService: AuthenticationService,
		private reflectionsApi: ReflectionsService,
		private lessonsApi: LessonsService,
		ea: EventAggregator
	) {
		super(authService, ea);
	}

	async submit(model: BaseLessonApiModel | LudusLessonApiModel | PaidiaVideoRatingApiModel) {
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
}