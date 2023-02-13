import { autoinject } from "aurelia-framework";
import { VideoRating } from "../video-rating";
import { ApplicationState } from "applicationState";
import { RadioOption } from "resources/radioButton/radio-button";
import { AuthenticationService } from "services/authenticationService";
import { ReflectionsService } from "services/reflectionsService";
import { ReflectionTypes } from "utils/enums";
import { BaseLessonApiModel } from "models/reflectionsApiModels";

@autoinject
export class BaseVideo {

	model: BaseLessonApiModel;
	videoRatingOptions: RadioOption[] = [
		{ name: "I understand fully", subText: "3/3", value: 3 },
		{ name: "I understand partially", subText: "2/3", value: 2 },
		{ name: "I mostly don't understand", subText: "1/3", value: 1 },
		{ name: "I don't understand", subText: "0/3", value: 0 }
	];

	constructor(
		private localParent: VideoRating,
		private authService: AuthenticationService,
		private appState: ApplicationState,
		private reflectionsApi: ReflectionsService
	) { }

	attached() {
		this.model = new BaseLessonApiModel();
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