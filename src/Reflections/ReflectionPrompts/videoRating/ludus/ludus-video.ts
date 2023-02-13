import { ApplicationState } from "applicationState";
import { autoinject } from "aurelia-framework";
import { LudusLessonApiModel } from "models/reflectionsApiModels";
import { RadioOption } from "resources/radioButton/radio-button";
import { AuthenticationService } from "services/authenticationService";
import { ReflectionsService } from "services/reflectionsService";
import { ReflectionTypes } from "utils/enums";
import { VideoRating } from "../video-rating";

@autoinject
export class LudusVideo {
	model: LudusLessonApiModel;
	videoRatingOptions: RadioOption[] = [
		{ name: "", value: 1 },
		{ name: "", value: 2 },
		{ name: "", value: 3 }
	];

	constructor(
		private localParent: VideoRating,
		private authService: AuthenticationService,
		private appState: ApplicationState,
		private reflectionsApi: ReflectionsService
	) { }

	attached() {
		this.model = new LudusLessonApiModel();
	}

	async submitRating() {
		const id = await this.reflectionsApi.createReflection(this.authService.System, ReflectionTypes.Lesson, this.appState.watchedLesson.id)
		if (id == null) {
			this.appState.triggerToast("Failed to create rating...");
			return;
		}

		this.localParent.reflectionId = id;
		this.localParent.submitRating(this.model);
	}
}