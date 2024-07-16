import { ApplicationState } from "applicationState";
import { autoinject, computedFrom } from "aurelia-framework";
import { PaidiaLessonRating, PaidiaVideoRatingApiModel } from "models/reflectionsApiModels";
import { AuthenticationService } from "services/authenticationService";
import { ReflectionsService } from "services/reflectionsService";
import { ReflectionTypes } from "utils/enums";
import { VideoRating } from "../video-rating";
import { ComponentHelper } from "utils/componentHelper";

@autoinject
export class PaidiaVideo {

	model: PaidiaVideoRatingApiModel;
	emoji;

	constructor(
		private localParent: VideoRating,
		private authService: AuthenticationService,
		private appState: ApplicationState,
		private reflectionsApi: ReflectionsService
	) { }

	attached() {
		this.emoji = null;
		this.model = new PaidiaVideoRatingApiModel();
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
		if (this.model.lessonRating == null) {
			this.model.lessonRating = new PaidiaLessonRating();
		}
		this.model.lessonRating.rating = ComponentHelper.EmojiToString(this.emoji);
		this.localParent.submit(this.model);
	}

	@computedFrom("emoji")
	get AllowSubmit(): boolean {
		return this.emoji != null;
	}
}