import { autoinject, bindable, computedFrom } from "aurelia-framework";
import { RadioOption } from "resources/radioButton/radio-button";
import { Modal } from 'resources/modal/modal';
import { ApplicationState } from "applicationState";
import { Lesson, Section } from "models/course";
import { CourseView } from "../course-view";

@autoinject
export class SectionView {
	@bindable section: Section;
	videoRatingOptions: RadioOption[] = [
		{name: "3/3 - I understand fully", value: 3},
		{name: "2/3 - I understand partially", value: 2},
		{name: "1/3 - I don't understand", value: 1}
	];
	ratingSelected: number = null;
	ratingModal: Modal;
	lessonCompleted: Lesson;
	currentId: number;

	constructor(private localParent: CourseView, private appState: ApplicationState) {}

	attached() {
		this.init();
	}

	init() {
		if (this.section.id == this.localParent.currentSection.id) {
			const numOfLessons = this.section.lessons.length;
			for (let index = 0; index < numOfLessons; index++) {
				const lesson = this.section.lessons[index];
				lesson.available = lesson.watched || (index > 0 && this.section.lessons[index-1].watched);
			}
		} else {
			this.section.lessons.forEach(x => x.available = true);
		}
	}

	selectLesson(lesson: Lesson) {
		if (lesson == null || !lesson.available) return;
		this.localParent.selectLesson(lesson);
	}

	completeLesson(lesson: Lesson) {
		if (lesson.watched) {
			this.lessonCompleted = lesson; 
			this.triggerRatingModal();
		}
	}

	triggerRatingModal() {
		this.ratingSelected = null;
		this.ratingModal.toggle();
	}

	submitRating() {
		this.lessonCompleted.rating = this.ratingSelected;
		this.triggerRatingModal();
		this.lessonCompleted = null;
	}

	downloadLesson(lesson: Lesson, event: Event) {
		event.stopPropagation();

		this.appState.triggerToast("Downloading...")
	}

	@computedFrom("localParent.lessonSelected.id")
	get SelectedId(): number {
		if (this.localParent.lessonSelected == null) return -1;
		return this.localParent.lessonSelected.id;
	}
}