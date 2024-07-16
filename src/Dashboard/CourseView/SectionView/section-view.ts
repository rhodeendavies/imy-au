import { autoinject, bindable, computedFrom } from "aurelia-framework";
import { ApplicationState } from "applicationState";
import { Lesson, Section } from "models/course";
import { CourseView } from "../course-view";
import { LessonsService } from "services/lessonsService";
import { EventAggregator, Subscription } from "aurelia-event-aggregator";
import { Events } from "utils/constants";

@autoinject
export class SectionView {
	@bindable section: Section;
	currentId: number;
	lessonCompleteSub: Subscription;

	constructor(
		private localParent: CourseView,
		private appState: ApplicationState,
		private lessonApi: LessonsService,
		private ea: EventAggregator
	) { }

	attached() {
		this.lessonCompleteSub = this.ea.subscribe(Events.LessonCompleted, () => {
			++this.section.watchedVideos;
		});
	}

	detached() {
		this.lessonCompleteSub.dispose();
	}


	selectLesson(lesson: Lesson) {
		if (lesson == null || !lesson.available) return;
		this.localParent.selectLesson(lesson);
	}

	completeLesson(lesson: Lesson) {
		if (!lesson.complete) return;
		if (!this.appState.reflectionsEnabled) {
			const completed = this.lessonApi.completeLesson(lesson.id);
			if (!completed) {
				this.appState.triggerToast("Failed to complete lesson...");
			}
			return;
		}

		this.appState.triggerRatingModal(lesson, this.section.id);
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