import { autoinject } from "aurelia-framework";
import { Router } from "aurelia-router";
import { Section } from "models/course";
import { DateTime, Interval } from "luxon";
import { BaseSystemReflection } from "models/reflections";

@autoinject
export class Reflections {

	// DEMO DATA
	lessonOrder: number = 0;
	// END OF DEMO DATA

	sections: Section[];
	selectedReflections: BaseSystemReflection[] = [];
	sectionSelected: Section;
	
	constructor(private router: Router) { }

	attached() {
		// TODO: replace with call to fetch data
		this.createDemoData();

		this.initData();
	}

	initData() {
		if (this.sections == null || this.sections.length == 0) return;
		this.sections.forEach(section => {
			const startDate = DateTime.fromJSDate(section.startDate);
			const endDate = DateTime.fromJSDate(section.endDate);
			if (startDate.month == endDate.month) {
				section.dateString = `${startDate.toFormat("d")} - ${endDate.toFormat("d LLL")}`;
			} else {
				const interval = Interval.fromDateTimes(startDate, endDate);
				section.dateString = interval.toFormat("d LLL");
			}
		});
		this.sectionSelected = this.sections[0];
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
			lessons: []
		}, {
			id: 1,
			name: "Introduction to HTML",
			order: 2,
			startDate: DateTime.fromObject({day: 17, month: 10}).toJSDate(),
			endDate: DateTime.fromObject({day: 30, month: 10}).toJSDate(),
			course: null,
			totalRunTime: 120,
			lessons: []
		}, {
			id: 2,
			name: "HTML images, video & audio",
			order: 3,
			startDate: DateTime.fromObject({day: 31, month: 10}).toJSDate(),
			endDate: DateTime.fromObject({day: 13, month: 11}).toJSDate(),
			course: null,
			totalRunTime: 120,
			lessons: []
		}];
	}

	navigate(fragment: string) {
		this.router.navigate(fragment);
	}

	navigateToRoute(route: string) {
		this.router.navigateToRoute(route);
	}

	selectSection(section: Section) {
		if (this.sectionSelected != null) {
			this.sectionSelected.open = false;
		}
		this.sectionSelected = section;
		this.sectionSelected.open = true;
	}
}