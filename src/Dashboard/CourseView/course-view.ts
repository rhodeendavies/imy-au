import { autoinject, computedFrom } from "aurelia-framework";
import { Dashboard } from "Dashboard/dashboard";
import { Lesson, Section } from "models/course";
import { Routes } from "utils/constants";
import { DateTime, Interval } from "luxon";
import { ApplicationState } from "applicationState";
import { log } from "utils/log";
import { Busy } from "resources/busy/busy";
import { AuthenticationService } from "services/authenticationService";

@autoinject
export class CourseView {

	courseHeading: string = "";
	lessonSelected: Lesson;
	contentId: number;
	sections: Section[];
	currentSection: Section;
	busy: Busy = new Busy();
	initDone: boolean = false;

	constructor(private localParent: Dashboard, private appState: ApplicationState, private authService: AuthenticationService) { }

	activate(params) {
		this.contentId = params.contentId;
	}

	async attached() {
		try {
			this.busy.on();
			this.initDone = false;
			this.sections = await this.appState.getSections();
			this.currentSection = await this.appState.getCurrentSection();
			this.courseHeading = this.authService.Course;

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
		} catch (error) {
			log.error(error);
		} finally {
			this.initDone = true;
			this.busy.off();
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

	downloadLesson(lesson: Lesson) {
		this.appState.triggerToast("Downloading...")
		window.open(lesson.resourcesUrl, '_blank').focus();
	}

	@computedFrom("localParent.lessonOpen")
	get IsLessonSelected(): boolean {
		return this.localParent.lessonOpen;
	}
}