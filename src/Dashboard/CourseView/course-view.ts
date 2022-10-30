import { autoinject, computedFrom } from "aurelia-framework";
import { Dashboard } from "Dashboard/dashboard";
import { Lesson, Section } from "models/course";
import { Routes } from "utils/constants";
import { DateTime, Interval } from "luxon";

@autoinject
export class CourseView {

	// DEMO DATA
	lessonOrder: number = 0;
	// END OF DEMO DATA
	
	sections: Section[];
	courseHeading: string = "IMY 110: Markup Languages";
	currentSection: Section;
	lessonSelected: Lesson;
	contentId: number;

	constructor(private localParent: Dashboard) { }

	activate(params) {
		this.contentId = params.contentId;
	}

	attached() {
		// TODO: replace with call to fetch data
		this.createDemoData();

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

	createDemoData() {
		this.lessonOrder = 0;
		this.sections = [{
			id: 0,
			name: "Introduction to web",
			order: 1,
			startDate: DateTime.fromObject({day: 3, month: 10}).toJSDate(),
			endDate: DateTime.fromObject({day: 16, month: 10}).toJSDate(),
			course: null,
			totalRunTime: 120,
			lessons: [
				this.createDemoLesson("Block and inline elements", true),
				this.createDemoLesson("Images - part 1", true),
				this.createDemoLesson("Images - part 2", true),
				this.createDemoLesson("Images - examples"),
				this.createDemoLesson("Video and audio")
			]
		}, {
			id: 1,
			name: "Introduction to HTML",
			order: 2,
			startDate: DateTime.fromObject({day: 17, month: 10}).toJSDate(),
			endDate: DateTime.fromObject({day: 30, month: 10}).toJSDate(),
			course: null,
			totalRunTime: 120,
			lessons: [
				this.createDemoLesson("Block and inline elements", true),
				this.createDemoLesson("Images - part 1"),
				this.createDemoLesson("Images - part 2"),
				this.createDemoLesson("Images - examples"),
				this.createDemoLesson("Video and audio")
			]
		}, {
			id: 2,
			name: "HTML images, video & audio",
			order: 3,
			startDate: DateTime.fromObject({day: 31, month: 10}).toJSDate(),
			endDate: DateTime.fromObject({day: 13, month: 11}).toJSDate(),
			course: null,
			totalRunTime: 120,
			lessons: [
				this.createDemoLesson("Block and inline elements"),
				this.createDemoLesson("Images - part 1"),
				this.createDemoLesson("Images - part 2"),
				this.createDemoLesson("Images - examples"),
				this.createDemoLesson("Video and audio")
			]
		}];

		this.currentSection = this.sections[1];
	}

	createDemoLesson(name: string, watched: boolean = false): Lesson {
		return {
			id: this.lessonOrder,
			name: name,
			order: this.lessonOrder++,
			section: null,
			video: "",
			resources: "",
			topics: [""],
			watched: watched,
			runTime: 120
		}
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