import { autoinject, computedFrom } from "aurelia-framework";
import { Dashboard } from "Dashboard/dashboard";
import { Lesson, Section } from "models/course";
import { Routes } from "utils/constants";
import { DateTime, Interval } from "luxon";
import { ApplicationState } from "applicationState";

@autoinject
export class CourseView {

	courseHeading: string = "IMY 110: Markup Languages";
	lessonSelected: Lesson;
	contentId: number;
	sections: Section[];
	currentSection: Section;

	constructor(private localParent: Dashboard, private appState: ApplicationState) { }

	activate(params) {
		this.contentId = params.contentId;
	}

	attached() {
		this.sections = this.appState.getSections();
		this.currentSection = this.appState.getCurrentSection();

		this.initData();

		if (this.contentId != null) {
			this.sections.some(section => section.lessons.some(lesson => {
				if (lesson.id == this.contentId) {
					this.selectLesson(lesson);
					section.open = true;
					return true;
				}
			}));
		} else {
			this.currentSection.open = true;
		}
	}

	initData() {
		if (this.sections == null || this.sections.length == 0) return;
		this.sections.forEach(section => {
			section.totalVideos = section.lessons.length;
			const startDate = DateTime.fromJSDate(section.startDate);
			const endDate = DateTime.fromJSDate(section.endDate);
			if (startDate.month == endDate.month) {
				section.dateString = `${startDate.toFormat("d")} - ${endDate.toFormat("d LLL")}`;
			} else {
				const interval = Interval.fromDateTimes(startDate, endDate);
				section.dateString = interval.toFormat("d LLL");
			}
			section.watchedVideos = section.lessons.filter(x => x.watched).length;
			section.available = section.order <= this.currentSection.order;
			section.open = false;
		});
	}

	selectLesson(lesson: Lesson) {
		this.lessonSelected = lesson;
		this.localParent.lessonOpen = true;
		this.localParent.navigate(`${Routes.CourseContent}/${lesson.id}`);
	}

	@computedFrom("localParent.lessonOpen")
	get IsLessonSelected(): boolean {
		return this.localParent.lessonOpen;
	}
}