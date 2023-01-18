import { autoinject, bindable, computedFrom } from "aurelia-framework";
import { ApplicationState } from "applicationState";
import { Lesson, Section } from "models/course";
import { CourseView } from "../course-view";
import { LessonsService } from "services/lessonsService";

@autoinject
export class SectionView {
	@bindable section: Section;
	currentId: number;

	constructor(
		private localParent: CourseView,
		private appState: ApplicationState,
		private lessonApi: LessonsService
	) { }


	selectLesson(lesson: Lesson) {
		if (lesson == null || !lesson.available) return;
		this.localParent.selectLesson(lesson);
	}

	completeLesson(lesson: Lesson) {
		if (!lesson.complete) return
		this.appState.triggerRatingModal(lesson);
	}

	downloadLesson(lesson: Lesson, event: Event) {
		event.stopPropagation();
		this.lessonApi.logResourceDownload(lesson.id);
		this.appState.triggerToast("Downloading...");
		window.open(lesson.resourcesUrl, '_blank').focus();
	}

	@computedFrom("localParent.lessonSelected.id")
	get SelectedId(): number {
		if (this.localParent.lessonSelected == null) return -1;
		return this.localParent.lessonSelected.id;
	}
}