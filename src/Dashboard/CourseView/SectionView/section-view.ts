import { autoinject, bindable, computedFrom } from "aurelia-framework";
import { ApplicationState } from "applicationState";
import { Lesson, Section } from "models/course";
import { CourseView } from "../course-view";
import { EventAggregator, Subscription } from "aurelia-event-aggregator";
import { Events } from "utils/constants";
import { LessonRatedEvent } from "utils/eventModels";

@autoinject
export class SectionView {
	@bindable section: Section;
	currentId: number;
	lessonRatedSub: Subscription;

	constructor(
		private localParent: CourseView,
		private appState: ApplicationState,
		private ea: EventAggregator
	) { }

	attached() {
		this.lessonRatedSub = this.ea.subscribe(Events.LessonRated, (data: LessonRatedEvent) => {
			if (data.sectionId == this.section.id) {
				this.lessonRated(data.lessonOrder);
			}
		})

		if (this.section.id == this.localParent.currentSection.id) {
			const numOfLessons = this.section.lessons.length;
			for (let index = 0; index < numOfLessons; index++) {
				const lesson = this.section.lessons[index];
				lesson.available = lesson.complete || index == 0 || this.section.lessons[index - 1].complete;
			}
		} else {
			this.section.lessons.forEach(x => x.available = true);
		}
	}

	detached() {
		this.lessonRatedSub.dispose();
	}

	selectLesson(lesson: Lesson) {
		if (lesson == null || !lesson.available) return;
		this.localParent.selectLesson(lesson);
	}

	completeLesson(lesson: Lesson) {
		if (!lesson.complete) return
		this.appState.triggerRatingModal(lesson, this.section);
	}

	lessonRated(order: number) {
		const nextLesson = this.section.lessons.find(x => x.order == (order + 1));
		if (nextLesson == null) return;
		nextLesson.available = true;
		this.selectLesson(nextLesson);
	}

	downloadLesson(lesson: Lesson, event: Event) {
		event.stopPropagation();
		this.appState.triggerToast("Downloading...")
		window.open(lesson.resourcesUrl, '_blank').focus();
	}

	@computedFrom("localParent.lessonSelected.id")
	get SelectedId(): number {
		if (this.localParent.lessonSelected == null) return -1;
		return this.localParent.lessonSelected.id;
	}
}