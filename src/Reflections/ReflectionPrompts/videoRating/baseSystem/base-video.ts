import { autoinject, computedFrom } from "aurelia-framework";
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
		{ name: 3, subText: "3/3", value: "I understand fully" },
		{ name: 2, subText: "2/3", value: "I understand partially" },
		{ name: 1, subText: "1/3", value: "I mostly don't understand" },
		{ name: 0, subText: "0/3", value: "I don't understand" }
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
		if (!this.AllowSubmit) return;
		let id = null;
		if (this.appState.watchedLesson.incompleteReflectionId != null) {
			id = this.appState.watchedLesson.incompleteReflectionId;
		} else {
			id = await this.reflectionsApi.createReflection(this.authService.System, ReflectionTypes.Lesson, this.appState.watchedLesson.id)
		}

		if (id == null) {
			this.appState.triggerToast("Failed to create rating...");
			return;
		}

		this.localParent.reflectionId = id;
		this.localParent.submit(this.model);
	}
	
	get AllowSubmit(): boolean {
		return this.model?.lessonRating?.rating != null;
	}
}